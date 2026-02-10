import os
import subprocess
import json
import logging
import time
import threading
import asyncio
from typing import Optional, List, Dict, Any
from dataclasses import dataclass

# -------------------------------------------------------
# 🧠 Configure Logging
# -------------------------------------------------------
logger = logging.getLogger("ollama_utils")
logging.basicConfig(level=logging.INFO)


# -------------------------------------------------------
# 📦 Model Info Dataclass
# -------------------------------------------------------
@dataclass
class ModelInfo:
    name: str
    size: str
    modified: str
    status: str


# -------------------------------------------------------
# 🚀 Ollama Manager
# -------------------------------------------------------
class OllamaManager:
    def __init__(self):
        self._lock = threading.Lock()
        self._available_models: List[ModelInfo] = []
        self._last_check = 0
        self._cache_timeout = 30  # Cache model list for 30s

    # ---------------------------------------------------
    # 🧠 Run Ollama (Sync)
    # ---------------------------------------------------
    def run_ollama(self, prompt: str, model: str = "gemma3:1b", max_retries: int = 2) -> Optional[str]:
        for attempt in range(max_retries + 1):
            try:
                logger.info(f"Running Ollama with model '{model}' (Attempt {attempt + 1}/{max_retries + 1})")

                process = subprocess.Popen(
                    ["ollama", "run", model],
                    stdin=subprocess.PIPE,
                    stdout=subprocess.PIPE,
                    stderr=subprocess.PIPE,
                    text=True,
                    bufsize=1,
                    universal_newlines=True,
                    env={**os.environ, 'OLLAMA_MAX_LOADED_MODELS': '1', 'OLLAMA_MAX_QUEUE': '1'}
                )

                stdout, stderr = process.communicate(input=prompt, timeout=90)

                if process.returncode == 0:
                    response = stdout.strip()

                    # Basic cleanup
                    cleaned = response.replace("**", "").replace("*", "").strip()

                    # Add friendly formatting if normal text (not JSON)
                    if not cleaned.startswith("{"):
                        cleaned = cleaned.replace("\n- ", "\n• ")
                        cleaned = cleaned.strip()
                        if not cleaned.endswith("."):
                            cleaned += "."

                    return cleaned

                logger.error(f"Ollama failed (code {process.returncode}): {stderr}")
                if attempt < max_retries:
                    time.sleep(2 ** attempt)
                    continue
                return None

            except subprocess.TimeoutExpired:
                logger.warning("⏰ Ollama timed out — retrying...")
                process.kill()
                time.sleep(2 ** attempt)
            except FileNotFoundError:
                logger.error("❌ Ollama not found. Make sure it's installed and available in PATH.")
                return None
            except Exception as e:
                logger.error(f"Unexpected error running Ollama: {e}")
                time.sleep(2 ** attempt)

        return None

    # ---------------------------------------------------
    # ⚡ Run Ollama (Async)
    # ---------------------------------------------------
    async def run_ollama_async(self, prompt: str, model: str = "gemma3:1b") -> str:
        """Non-blocking async version for FastAPI."""
        try:
            logger.info(f"[Async] Running Ollama model: {model}")
            process = await asyncio.create_subprocess_exec(
                "ollama", "run", model,
                stdin=asyncio.subprocess.PIPE,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE,
                env={**os.environ, 'OLLAMA_MAX_LOADED_MODELS': '1', 'OLLAMA_MAX_QUEUE': '1'}
            )
            stdout, stderr = await process.communicate(input=prompt.encode())

            if process.returncode != 0:
                logger.error(f"Ollama async error: {stderr.decode().strip()}")
                return ""

            output = stdout.decode().strip()
            return output

        except Exception as e:
            logger.error(f"run_ollama_async() failed: {e}")
            return ""

    # ---------------------------------------------------
    # 🧩 Check Ollama Availability
    # ---------------------------------------------------
    def check_ollama_availability(self, model: str = "gemma3:1b") -> bool:
        try:
            result = subprocess.run(["ollama", "list"], capture_output=True, text=True, timeout=10)
            if result.returncode != 0:
                logger.error(f"Ollama list failed: {result.stderr}")
                return False

            if model not in result.stdout:
                logger.warning(f"Model {model} not found. Attempting to pull...")
                pull = subprocess.run(["ollama", "pull", model], capture_output=True, text=True, timeout=120)
                if pull.returncode != 0:
                    logger.error(f"Failed to pull {model}: {pull.stderr}")
                    return False
                logger.info(f"✅ Successfully pulled {model}")

            return True

        except Exception as e:
            logger.error(f"Error checking Ollama availability: {e}")
            return False

    # ---------------------------------------------------
    # 📄 Get Available Models
    # ---------------------------------------------------
    def get_available_models(self) -> List[ModelInfo]:
        now = time.time()
        if now - self._last_check < self._cache_timeout and self._available_models:
            return self._available_models

        try:
            result = subprocess.run(["ollama", "list"], capture_output=True, text=True, timeout=10)
            if result.returncode != 0:
                logger.warning(f"ollama list failed: {result.stderr}")
                return []

            models = []
            for line in result.stdout.strip().split("\n")[1:]:
                if not line.strip():
                    continue
                parts = line.split()
                if len(parts) >= 3:
                    models.append(ModelInfo(parts[0], parts[1], parts[2], "ready"))

            with self._lock:
                self._available_models = models
                self._last_check = now
            return models

        except Exception as e:
            logger.error(f"Error fetching model list: {e}")
            return []

    # ---------------------------------------------------
    # 🔍 Test Model
    # ---------------------------------------------------
    def test_model(self, model: str = "gemma3:1b") -> Dict[str, Any]:
        if not self.check_ollama_availability(model):
            return {"success": False, "model": model, "error": "Model unavailable", "response": None}

        prompt = "Say 'Ollama test successful' if you received this prompt."
        resp = self.run_ollama(prompt, model)
        return {
            "success": bool(resp),
            "model": model,
            "error": None if resp else "No response received",
            "response": resp,
        }


# -------------------------------------------------------
# 🌍 Global instance for easy import
# -------------------------------------------------------
ollama_manager = OllamaManager()

# Backward-compatible helper functions
def run_ollama(prompt: str, model: str = "gemma3:1b") -> Optional[str]:
    return ollama_manager.run_ollama(prompt, model)

def run_ollama_async(prompt: str, model: str = "gemma3:1b") -> str:
    return asyncio.run(ollama_manager.run_ollama_async(prompt, model))

def check_ollama_availability(model: str = "gemma3:1b") -> bool:
    return ollama_manager.check_ollama_availability(model)
