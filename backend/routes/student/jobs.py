from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from database.connection import get_db
from models.user import User
from routes.auth import get_current_user
from typing import List, Optional
from pydantic import BaseModel
import random
import time
from datetime import datetime
from services.scraper_service import scraper_service

router = APIRouter()

# --- Models ---
class Job(BaseModel):
    id: str
    title: str
    company: str
    location: str
    type: str
    posted_date: str
    logo_url: Optional[str] = None
    tags: List[str] = []
    apply_link: str
    description: str
    match_score: int
    source: Optional[str] = "Web"

class ScrapeResponse(BaseModel):
    message: str
    jobs_found: int
    jobs: List[Job]

# --- Endpoints ---

@router.get("/list", response_model=List[Job])
async def get_jobs(
    role: Optional[str] = None,
    location: Optional[str] = None,
    type: Optional[str] = None,
    current_user: User = Depends(get_current_user)
):
    # Initial load - can use mock data or a default "hot jobs" scrape
    # For speed, we use a quick mock set or cached set here
    # Using the scraper mock directly for consistency
    results = await scraper_service.get_all_jobs(role if role else "Software Engineer")
    jobs = results["jobs"]
    
    # Apply post-scraping filters
    filtered_jobs = []
    for j in jobs:
        # Pydantic conversion
        job_obj = Job(**j)
        
        if location and location.lower() not in job_obj.location.lower():
            continue
        if type and type != "All" and type.lower() not in job_obj.type.lower():
            continue
            
        filtered_jobs.append(job_obj)
        
    return filtered_jobs

@router.post("/scrape", response_model=ScrapeResponse)
async def scrape_jobs(
    keywords: str = Query(..., description="Job keywords to search for"),
    current_user: User = Depends(get_current_user)
):
    # Call the real scraper service
    # This will simulate (or perform) the live connect to Unstop/Naukri
    results = await scraper_service.get_all_jobs(keywords)
    
    # Convert dicts to Pydantic models
    job_models = [Job(**j) for j in results["jobs"]]
    
    return ScrapeResponse(
        message=f"Scraping completed. Found opportunities from Unstop, Naukri, and LinkedIn.",
        jobs_found=results["jobs_found"],
        jobs=job_models
    )

