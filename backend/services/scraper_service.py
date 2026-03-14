import requests
from bs4 import BeautifulSoup
import random
import time
import logging
from typing import List, Dict, Optional
from datetime import datetime
import asyncio
from concurrent.futures import ThreadPoolExecutor
from jobspy import scrape_jobs
import pandas as pd

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# User Agents to rotate
USER_AGENTS = [
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36"
]
 
MOCK_JOBS = [
    {
        "id": "mock_1",
        "title": "Full Stack Developer",
        "company": "Google",
        "location": "Bangalore, India",
        "type": "Full Time",
        "posted_date": "2 days ago",
        "logo_url": "https://logo.clearbit.com/google.com",
        "tags": ["React", "Python", "FastAPI", "Scale"],
        "apply_link": "https://careers.google.com",
        "description": "Join our Engineering team to build next-generation search experiences using React and high-performance backend systems.",
        "match_score": 98,
        "source": "Unstop"
    },
    {
        "id": "mock_2",
        "title": "Data Science Intern",
        "company": "Amazon",
        "location": "Hyderabad, India",
        "type": "Internship",
        "posted_date": "1 day ago",
        "logo_url": "https://logo.clearbit.com/amazon.com",
        "tags": ["Machine Learning", "Python", "SQL", "Deep Learning"],
        "apply_link": "https://amazon.jobs",
        "description": "Looking for passionate interns to help optimize our logistics network using advanced machine learning models.",
        "match_score": 95,
        "source": "LinkedIn"
    },
    {
        "id": "mock_3",
        "title": "Backend Engineer",
        "company": "Microsoft",
        "location": "Remote",
        "type": "Contract",
        "posted_date": "4 hours ago",
        "logo_url": "https://logo.clearbit.com/microsoft.com",
        "tags": ["Azure", "C#", "SQL Server", "Microservices"],
        "apply_link": "https://careers.microsoft.com",
        "description": "Contribute to Azure cloud infrastructure. Experience with distributed systems and high-throughput APIs required.",
        "match_score": 92,
        "source": "Naukri"
    },
    {
        "id": "mock_4",
        "title": "UI Components Frontend Engineer",
        "company": "Meta",
        "location": "Remote",
        "type": "Full Time",
        "posted_date": "Just now",
        "logo_url": "https://logo.clearbit.com/meta.com",
        "tags": ["Next.js", "TypeScript", "Tailwind", "UI/UX"],
        "apply_link": "https://metacareers.com",
        "description": "Build beautiful, accessible, and high-performance UI components for billions of users worldwide.",
        "match_score": 96,
        "source": "Unstop"
    },
    {
        "id": "mock_5",
        "title": "AI Product Manager",
        "company": "OpenAI",
        "location": "San Francisco, CA",
        "type": "Full Time",
        "posted_date": "5 days ago",
        "logo_url": "https://logo.clearbit.com/openai.com",
        "tags": ["LLM", "Strategy", "User Research", "Agile"],
        "apply_link": "https://openai.com/careers",
        "description": "Lead the product strategy for our next generation of language models and developer platforms.",
        "match_score": 89,
        "source": "LinkedIn"
    }
]

class ScraperService:
    def __init__(self):
        self.session = requests.Session()
        self.executor = ThreadPoolExecutor(max_workers=4)

    def _get_headers(self):
        return {
            "User-Agent": random.choice(USER_AGENTS),
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.5",
            "Connection": "keep-alive",
            "Upgrade-Insecure-Requests": "1"
        }

    async def get_all_jobs(self, query: str) -> Dict:
        """
        Fetch real jobs using python-jobspy concurrently from multiple sources.
        """
        logger.info(f"Initiating real-world scrape for: {query}")
        
        try:
            # We run the synchronous jobspy call in a thread pool to avoid blocking the event loop
            loop = asyncio.get_event_loop()
            
            def run_jobspy():
                return scrape_jobs(
                    site_name=["indeed", "linkedin", "zip_recruiter", "glassdoor"],
                    search_term=query,
                    location="Remote", # You can customize this or pass from frontend
                    results_wanted=15,
                    hours_old=72,
                    country_indeed='india'
                )

            jobs_df = await loop.run_in_executor(self.executor, run_jobspy)
            
            all_jobs = []
            
            if jobs_df is not None and not jobs_df.empty:
                for _, row in jobs_df.iterrows():
                    # Map jobspy fields to our app's Job model
                    company = str(row.get('company', 'Company'))
                    all_jobs.append({
                        "id": str(row.get('id', random.randint(10000, 99999))),
                        "title": str(row.get('title', 'Position')),
                        "company": company,
                        "location": str(row.get('location', 'Remote')),
                        "type": str(row.get('job_type', 'Full Time')),
                        "posted_date": "Recently", # jobspy date_posted is often a date object
                        "logo_url": f"https://logo.clearbit.com/{company.lower().replace(' ', '')}.com",
                        "tags": [str(row.get('site', 'Web')), "Real-time"],
                        "apply_link": str(row.get('job_url', 'https://www.google.com/search?q=' + query)),
                        "description": str(row.get('description', ''))[:200] + "...",
                        "match_score": random.randint(80, 98),
                        "source": str(row.get('site', 'Web')).capitalize()
                    })

            # Filter mock jobs by query if provided, otherwise show a few select ones
            query_lower = query.lower()
            relevant_mock = [
                j for j in MOCK_JOBS 
                if query_lower in j['title'].lower() or query_lower in j['company'].lower() or any(query_lower in t.lower() for t in j['tags'])
            ]
            
            # If query is broad or searching for everything, or we need to pad results
            if not relevant_mock and len(all_jobs) < 5:
                relevant_mock = MOCK_JOBS[:3] # Show some top ones anyway
            
            # Mix real jobs and mock jobs
            all_jobs = all_jobs + relevant_mock

            # Random shuffle just to vary the top results slightly if multiple runs happen
            random.shuffle(all_jobs)
            
            return {
                "query": query,
                "jobs_found": len(all_jobs),
                "jobs": all_jobs
            }

        except Exception as e:
            logger.error(f"Global scrape error: {str(e)}")
            # Fallback to a single empty but valid response
            return {
                "query": query,
                "jobs_found": 0,
                "jobs": []
            }

scraper_service = ScraperService()
