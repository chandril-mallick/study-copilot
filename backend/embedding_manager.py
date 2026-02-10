import os
import pickle
import logging
from typing import List, Dict, Any

import numpy as np
import faiss
from sentence_transformers import SentenceTransformer

logger = logging.getLogger("embedding_manager")


class EmbeddingManager:
    def __init__(
        self,
        model_name: str = "all-MiniLM-L6-v2",
        data_dir: str = "./data"
    ):
        self.model_name = model_name
        self.data_dir = data_dir

        self.model = None
        self.index = None

        self.metadata: Dict[int, Dict[str, Any]] = {}
        self.next_id = 0

        os.makedirs(self.data_dir, exist_ok=True)

        self._init_model()
        self._load_existing()

    # --------------------------------------------------
    # Init
    # --------------------------------------------------

    def _init_model(self):
        logger.info(f"Loading embedding model: {self.model_name}")
        self.model = SentenceTransformer(self.model_name, device="cpu")
        logger.info("Embedding model loaded successfully")

    # --------------------------------------------------
    # Persistence
    # --------------------------------------------------

    def _index_path(self):
        return os.path.join(self.data_dir, "index.faiss")

    def _meta_path(self):
        return os.path.join(self.data_dir, "metadata.pkl")

    def _load_existing(self):
        if os.path.exists(self._index_path()) and os.path.exists(self._meta_path()):
            try:
                self.index = faiss.read_index(self._index_path())
                with open(self._meta_path(), "rb") as f:
                    data = pickle.load(f)
                    self.metadata = data["metadata"]
                    self.next_id = data["next_id"]

                logger.info(f"Loaded {len(self.metadata)} embeddings")

            except Exception as e:
                logger.error(f"Failed to load existing data: {e}")
                self.clear()

    def _save(self):
        if self.index is None:
            return

        faiss.write_index(self.index, self._index_path())

        with open(self._meta_path(), "wb") as f:
            pickle.dump(
                {
                    "metadata": self.metadata,
                    "next_id": self.next_id
                },
                f
            )

        logger.info("FAISS index saved")

    # --------------------------------------------------
    # Core
    # --------------------------------------------------

    def add_documents(
        self,
        texts: List[str],
        metadata_list: List[Dict[str, Any]] | None = None
    ):
        if not texts:
            return []

        if metadata_list and len(texts) != len(metadata_list):
            raise ValueError("texts and metadata_list length mismatch")

        logger.info(f"Embedding {len(texts)} documents")

        embeddings = self.model.encode(
            texts,
            batch_size=32,
            convert_to_numpy=True,
            show_progress_bar=False,  # CRITICAL FIX
            device="cpu",
            normalize_embeddings=False  # We normalize manually with FAISS
        )

        faiss.normalize_L2(embeddings)

        if self.index is None:
            dim = embeddings.shape[1]
            base = faiss.IndexFlatIP(dim)
            self.index = faiss.IndexIDMap(base)

        ids = []

        for i, text in enumerate(texts):
            doc_id = self.next_id
            ids.append(doc_id)

            self.metadata[doc_id] = {
                "text": text,
                "metadata": metadata_list[i] if metadata_list else {}
            }

            self.next_id += 1

        self.index.add_with_ids(
            embeddings.astype(np.float32),
            np.array(ids, dtype=np.int64)
        )

        self._save()

        logger.info("Documents added to FAISS")
        return ids

    # --------------------------------------------------
    # Search
    # --------------------------------------------------

    def search(self, query: str, top_k: int = 5):
        if self.index is None:
            return []

        query_emb = self.model.encode(
            [query],
            convert_to_numpy=True,
            show_progress_bar=False,
            device="cpu",
            normalize_embeddings=False
        )

        faiss.normalize_L2(query_emb)

        scores, ids = self.index.search(query_emb.astype(np.float32), top_k)

        results = []
        for score, doc_id in zip(scores[0], ids[0]):
            if doc_id == -1:
                continue

            doc = self.metadata.get(int(doc_id))
            if not doc:
                continue

            results.append({
                "id": int(doc_id),
                "score": float(score),
                "text": doc["text"],
                "metadata": doc["metadata"]
            })

        return results

    # --------------------------------------------------
    # Maintenance
    # --------------------------------------------------

    def clear(self):
        self.index = None
        self.metadata = {}
        self.next_id = 0

        if os.path.exists(self._index_path()):
            os.remove(self._index_path())
        if os.path.exists(self._meta_path()):
            os.remove(self._meta_path())

        logger.info("Embedding store cleared")
