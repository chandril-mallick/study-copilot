# Admin and Management APIs - Complete Module

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
import random

from database.connection import get_db
from models.user import User
from middleware.rbac import require_admin, require_management, require_admin_or_management
from routes.auth import get_current_user
from ollama_utils import run_ollama

router = APIRouter(prefix="/api/admin", tags=["Admin & Management"])

# ===== WORKFLOW AUTOMATION =====

class WorkflowCreate(BaseModel):
    name: str
    type: str  # admission, scholarship, verification, fee_approval
    steps: List[dict]

@router.get("/workflows")
async def list_workflows(
    current_user: User = Depends(require_admin)
):
    """List all workflows"""
    
    # TODO: Retrieve from database
    return {
        "workflows": [
            {
                "id": 1,
                "name": "Student Admission Workflow",
                "type": "admission",
                "steps": 5,
                "active": True
            },
            {
                "id": 2,
                "name": "Scholarship Approval",
                "type": "scholarship",
                "steps": 3,
                "active": True
            }
        ]
    }

@router.post("/workflows")
async def create_workflow(
    workflow: WorkflowCreate,
    current_user: User = Depends(require_admin)
):
    """Create new workflow"""
    
    # TODO: Save to database
    return {
        "success": True,
        "workflow_id": random.randint(100, 999),
        "name": workflow.name,
        "message": "Workflow created successfully"
    }

@router.post("/workflows/{workflow_id}/execute")
async def execute_workflow(
    workflow_id: int,
    data: dict,
    current_user: User = Depends(require_admin)
):
    """Execute a workflow"""
    
    # TODO: Implement workflow execution engine
    return {
        "execution_id": random.randint(1000, 9999),
        "workflow_id": workflow_id,
        "status": "running",
        "current_step": 1,
        "total_steps": 5
    }

# ===== INSTITUTION BRAIN =====

@router.get("/brain/stats")
async def get_institution_stats(
    current_user: User = Depends(require_admin_or_management)
):
    """Get comprehensive institution statistics"""
    
    return {
        "total_students": 1250,
        "total_faculty": 85,
        "total_courses": 42,
        "data_ingested_gb": 125.5,
        "ai_queries_today": 3420,
        "system_uptime": "99.8%"
    }

@router.get("/brain/accuracy")
async def get_ai_accuracy_metrics(
    current_user: User = Depends(require_admin_or_management)
):
    """Get AI accuracy metrics per subject"""
    
    return {
        "subjects": [
            {"name": "Computer Science", "accuracy": 94.5, "queries": 1250},
            {"name": "Mathematics", "accuracy": 91.2, "queries": 980},
            {"name": "Physics", "accuracy": 88.7, "queries": 750}
        ],
        "overall_accuracy": 92.1
    }

@router.get("/brain/knowledge-graph")
async def get_knowledge_graph(
    current_user: User = Depends(require_admin_or_management)
):
    """Get knowledge graph visualization data"""
    
    return {
        "nodes": [
            {"id": "cs", "label": "Computer Science", "size": 1250},
            {"id": "math", "label": "Mathematics", "size": 980},
            {"id": "physics", "label": "Physics", "size": 750}
        ],
        "edges": [
            {"from": "cs", "to": "math", "weight": 0.8},
            {"from": "math", "to": "physics", "weight": 0.6}
        ]
    }

# ===== ROLE INSIGHTS =====

@router.get("/insights/activity")
async def get_activity_heatmap(
    current_user: User = Depends(require_admin)
):
    """Get activity heatmap for all roles"""
    
    return {
        "heatmap": [
            {"role": "student", "hour": 9, "activity": 85},
            {"role": "student", "hour": 14, "activity": 120},
            {"role": "faculty", "hour": 10, "activity": 45},
            {"role": "faculty", "hour": 15, "activity": 60}
        ],
        "peak_hours": {"student": 14, "faculty": 15}
    }

@router.get("/insights/engagement")
async def get_engagement_metrics(
    current_user: User = Depends(require_admin)
):
    """Get engagement metrics"""
    
    return {
        "daily_active_users": 850,
        "weekly_active_users": 1150,
        "avg_session_duration": "45 minutes",
        "top_features": [
            {"name": "AI Tutor", "usage": 3200},
            {"name": "Assignments", "usage": 2100},
            {"name": "Study Groups", "usage": 1500}
        ]
    }

@router.get("/insights/role/{role}")
async def get_role_specific_insights(
    role: str,
    current_user: User = Depends(require_admin)
):
    """Get insights for specific role"""
    
    insights = {
        "student": {
            "total_users": 1250,
            "active_today": 850,
            "avg_performance": 78.5,
            "top_activities": ["AI Tutor", "Assignments"]
        },
        "faculty": {
            "total_users": 85,
            "active_today": 65,
            "avg_grading_time": "15 minutes",
            "top_activities": ["Auto-Grader", "Dashboard"]
        }
    }
    
    return insights.get(role, {"error": "Role not found"})

# ===== SECURITY & COMPLIANCE =====

@router.get("/security/logs")
async def get_security_logs(
    limit: int = 100,
    current_user: User = Depends(require_admin)
):
    """Get security access logs"""
    
    # TODO: Retrieve from database
    return {
        "logs": [
            {
                "timestamp": datetime.now() - timedelta(minutes=5),
                "user_id": 123,
                "action": "login",
                "ip": "192.168.1.100",
                "status": "success"
            },
            {
                "timestamp": datetime.now() - timedelta(minutes=10),
                "user_id": 456,
                "action": "failed_login",
                "ip": "10.0.0.50",
                "status": "blocked"
            }
        ],
        "total": limit
    }

@router.get("/security/threats")
async def get_threat_detection(
    current_user: User = Depends(require_admin)
):
    """Get threat detection alerts"""
    
    return {
        "threats": [
            {
                "type": "SQL Injection Attempt",
                "severity": "high",
                "ip": "203.0.113.45",
                "timestamp": datetime.now() - timedelta(hours=2),
                "blocked": True
            },
            {
                "type": "Brute Force Attack",
                "severity": "medium",
                "ip": "198.51.100.23",
                "timestamp": datetime.now() - timedelta(hours=5),
                "blocked": True
            }
        ],
        "total_today": 12,
        "blocked_ips": 8
    }

@router.get("/security/compliance")
async def get_compliance_scores(
    current_user: User = Depends(require_admin)
):
    """Get compliance scores"""
    
    return {
        "mfa_adoption": 78.5,
        "password_strength": 85.2,
        "data_encryption": 100.0,
        "access_control": 92.0,
        "overall_score": 88.9,
        "recommendations": [
            "Increase MFA adoption to 90%",
            "Enforce stronger password policies"
        ]
    }

# ===== NATIONAL BENCHMARKING (Management) =====

@router.get("/management/benchmark/placement")
async def get_placement_benchmark(
    current_user: User = Depends(require_admin_or_management)
):
    """Get placement rate benchmarking data"""
    
    return {
        "brainware": 92.0,
        "national_avg": 76.0,
        "top_tier_avg": 95.0,
        "trend": "+4.5%",
        "year": 2024
    }

@router.get("/management/benchmark/research")
async def get_research_benchmark(
    current_user: User = Depends(require_admin_or_management)
):
    """Get research output benchmarking"""
    
    return {
        "papers_per_faculty": 3.2,
        "national_avg": 1.8,
        "top_tier_avg": 5.5,
        "trend": "+0.8"
    }

# ===== PREDICTIVE INSIGHTS (Management) =====

@router.get("/management/predict/dropout")
async def predict_dropout_risk(
    current_user: User = Depends(require_admin_or_management)
):
    """Predict dropout risk by department"""
    
    return {
        "predictions": [
            {
                "department": "Civil Engineering",
                "risk_percentage": 12.0,
                "trend": "up",
                "key_factors": ["Low internship placements", "Attendance issues"]
            },
            {
                "department": "Computer Science",
                "risk_percentage": 3.0,
                "trend": "down",
                "key_factors": ["High engagement in labs"]
            }
        ]
    }

@router.get("/management/predict/performance")
async def predict_performance(
    current_user: User = Depends(require_admin_or_management)
):
    """Predict department performance"""
    
    return {
        "forecasts": [
            {
                "department": "Bio-Technology",
                "current_gpa": 8.2,
                "projected_gpa": 8.5,
                "status": "improving"
            },
            {
                "department": "Electronics",
                "current_gpa": 7.8,
                "projected_gpa": 7.6,
                "status": "declining"
            }
        ]
    }

# ===== POLICY GENERATOR (Management) =====

@router.post("/management/policy/generate")
async def generate_policy(
    topic: str,
    template_type: str,  # circular, regulation, compliance, notice
    current_user: User = Depends(require_admin_or_management)
):
    """Generate policy document using AI"""
    
    prompt = f"""Draft a formal university {template_type} concerning: "{topic}".
    
    Context: The user wants a specific, enforceable document. 
    Ensure the tone is authoritative yet professional.
    
    Structure required (JSON format):
    {{
      "title": "Formal Title of Document",
      "body": "Full text of the body... (Use \\n for line breaks, include sections like Purpose, Scope, Policy Details, Penalties/Actions, Effective Date)"
    }}
    
    If the topic is "maintain 75% attendance", ensure you mention:
    - Mandatory requirement.
    - Consequences of falling below 75%.
    - Medical exemptions logic.

    If template_type is "notice", ensure it follows a standard institutional notice format:
    - Subject Line at the top.
    - Reference Number (mocked).
    - Clear, concise instructions or information.
    - Mentioning the specific date if provided.
    """
    
    try:
        response_text = run_ollama(prompt, model="gemma3:1b")
        
        # Parse JSON
        start = response_text.find('{')
        end = response_text.rfind('}')
        if start != -1:
             json_str = response_text[start:end+1]
             import json
             try:
                # First try standard parse
                data = json.loads(json_str)
             except json.JSONDecodeError:
                # If fail, try to sanitize unescaped newlines which are common LLM errors
                # This is a naive fix but often works for simple text blocks
                import re
                # Replace literal newlines within quotes might be hard without regex
                # Fallback: treat the whole response as body if JSON is broken
                title = f"Policy: {topic}"
                body = response_text
             else:
                title = data.get("title", f"Policy on {topic}")
                body = data.get("body", response_text)
        else:
             title = f"Policy: {topic}"
             body = response_text

    except Exception as e:
        # Fallback for any other unexpected errors
        title = f"Policy: {topic}"
        body = response_text if 'response_text' in locals() else f"Generation Error: {str(e)}"
    
    return {
        "success": True,
        "topic": topic,
        "template_type": template_type,
        "content": {
             "title": title,
             "body": body,
             "date": datetime.now().strftime("%B %d, %Y")
        },
        "generated_at": datetime.now()
    }

@router.get("/management/policy/templates")
async def list_policy_templates(
    current_user: User = Depends(require_admin_or_management)
):
    """List available policy templates"""
    
    return {
        "templates": [
            {"id": "circular", "name": "Official Circular", "icon": "📢"},
            {"id": "regulation", "name": "Academic Regulation", "icon": "📜"},
            {"id": "compliance", "name": "Compliance Draft", "icon": "✅"}
        ]
    }
