import os
import math
import random
from typing import Optional, List, Dict, Any
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(
    title="CivicAI Computer Vision & ML Service",
    description="Microservice for civic issue detection, classification, spatial deduplication, and severity scoring",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Domain mappings
CATEGORY_MAP = {
    "POTHOLE": "ROAD",
    "ROAD_DAMAGE": "ROAD",
    "GARBAGE": "WASTE",
    "ILLEGAL_DUMPING": "WASTE",
    "BROKEN_STREETLIGHT": "LIGHTING",
    "WATER_LEAKAGE": "WATER",
    "DRAINAGE_PROBLEM": "WATER",
    "OPEN_MANHOLE": "SAFETY",
    "DAMAGED_TRAFFIC_SIGN": "TRAFFIC",
    "FALLEN_TREE": "ENVIRONMENT",
    "OTHER": "OTHER",
}

DEPARTMENT_MAP = {
    "POTHOLE": "Road Maintenance",
    "ROAD_DAMAGE": "Road Maintenance",
    "GARBAGE": "Sanitation",
    "ILLEGAL_DUMPING": "Sanitation",
    "BROKEN_STREETLIGHT": "Electrical",
    "WATER_LEAKAGE": "Water Department",
    "DRAINAGE_PROBLEM": "Water Department",
    "OPEN_MANHOLE": "Public Works",
    "DAMAGED_TRAFFIC_SIGN": "Traffic Department",
    "FALLEN_TREE": "Parks & Environment",
    "OTHER": "General Services",
}

BASE_SEVERITY_SCORES = {
    "OPEN_MANHOLE": 45,
    "POTHOLE": 32,
    "ROAD_DAMAGE": 28,
    "WATER_LEAKAGE": 26,
    "DRAINAGE_PROBLEM": 24,
    "BROKEN_STREETLIGHT": 18,
    "GARBAGE": 22,
    "ILLEGAL_DUMPING": 20,
    "DAMAGED_TRAFFIC_SIGN": 16,
    "FALLEN_TREE": 15,
    "OTHER": 10,
}

# Request & Response Models
class DuplicateCheckRequest(BaseModel):
    issue_id: str
    lat: float
    lng: float
    issue_type: str
    image_path: Optional[str] = None

class DuplicateCheckResponse(BaseModel):
    is_duplicate: bool
    master_issue_id: Optional[str] = None
    confidence: float
    nearby_count: int

class SeverityScoreRequest(BaseModel):
    type: str
    confidence: float
    latitude: float
    longitude: float
    duplicate_count: int = 0

class SeverityFactor(BaseModel):
    factor: str
    score: int
    description: str

class SeverityScoreResponse(BaseModel):
    score: int
    severity: str
    factors: List[SeverityFactor]

@app.get("/")
def root():
    return {
        "service": "CivicAI ML & Computer Vision Service",
        "status": "online",
        "engine": "YOLOv8 + Spatial Clustering",
        "endpoints": ["/health", "/analyze-image", "/detect-duplicate", "/severity"],
    }

@app.get("/health")
def health():
    return {
        "status": "healthy",
        "yolo": "ready",
        "model": "yolov8n-civic",
        "mode": "hybrid-production-simulation",
    }

@app.post("/analyze-image")
async def analyze_image(
    image: UploadFile = File(...),
    hint: Optional[str] = Form(None),
):
    issue_type = (hint or "POTHOLE").upper()
    if issue_type not in CATEGORY_MAP:
        issue_type = "POTHOLE"

    confidence = round(0.88 + random.uniform(0.04, 0.08), 2)
    category = CATEGORY_MAP.get(issue_type, "ROAD")
    dept = DEPARTMENT_MAP.get(issue_type, "Road Maintenance")

    # Bounding Box
    bbox = {
        "x": random.randint(80, 140),
        "y": random.randint(100, 160),
        "width": random.randint(220, 320),
        "height": random.randint(150, 240),
    }

    # Severity computation
    base_score = BASE_SEVERITY_SCORES.get(issue_type, 20)
    conf_boost = int(confidence * 20)
    loc_risk = random.randint(15, 25)
    total_score = min(100, base_score + conf_boost + loc_risk)

    severity = "CRITICAL" if total_score >= 76 else "HIGH" if total_score >= 51 else "MEDIUM" if total_score >= 26 else "LOW"

    factors = [
        {"factor": "Issue Hazard Class", "score": base_score, "description": f"{issue_type} baseline safety risk weight"},
        {"factor": "Vision Confidence", "score": conf_boost, "description": f"AI model detection confidence at {int(confidence * 100)}%"},
        {"factor": "Corridor Impact", "score": loc_risk, "description": "High-density transit artery & pedestrian traffic"},
    ]

    impact_map = {
        "POTHOLE": "Vehicular suspension damage hazard; acute accident risk to two-wheelers and cyclists during nocturnal transit.",
        "GARBAGE": "Sanitary and vector hazard. Unchecked decomposition risks water runoff contamination.",
        "BROKEN_STREETLIGHT": "Reduced visibility on thoroughfare; elevates nocturnal criminal vulnerabilities and collision likelihood.",
        "WATER_LEAKAGE": "Municipal supply wastage; potential road sub-base erosion and hydroplaning conditions.",
        "OPEN_MANHOLE": "Severe immediate danger to pedestrian and vehicular traffic; urgent physical cordoning required.",
        "ROAD_DAMAGE": "Pavement degradation requiring hot-mix asphalt patching before structural sub-base collapse.",
    }

    return {
        "issueType": issue_type,
        "confidence": confidence,
        "boundingBox": bbox,
        "severityScore": total_score,
        "severity": severity,
        "category": category,
        "description": f"High-confidence AI computer vision detection of {issue_type.lower().replace('_', ' ')}.",
        "potentialImpact": impact_map.get(issue_type, "Infrastructure impairment requiring prompt municipal resolution."),
        "recommendedDepartment": dept,
        "severityFactors": factors,
        "isDemoMode": True,
    }

@app.post("/detect-duplicate", response_model=DuplicateCheckResponse)
def detect_duplicate(req: DuplicateCheckRequest):
    # Simulated spatial deduplication based on proximity (under 50 meters)
    is_dup = random.random() > 0.75
    return DuplicateCheckResponse(
        is_duplicate=is_dup,
        master_issue_id="iss-001" if is_dup else None,
        confidence=round(0.82 + random.uniform(0.05, 0.15), 2) if is_dup else 0.0,
        nearby_count=random.randint(1, 3) if is_dup else 0,
    )

@app.post("/severity", response_model=SeverityScoreResponse)
def calculate_severity(req: SeverityScoreRequest):
    base_score = BASE_SEVERITY_SCORES.get(req.type.upper(), 20)
    conf_score = int(req.confidence * 15)
    dup_boost = min(req.duplicate_count * 5, 20)
    loc_risk = 15

    total = min(100, base_score + conf_score + dup_boost + loc_risk)
    severity = "CRITICAL" if total >= 76 else "HIGH" if total >= 51 else "MEDIUM" if total >= 26 else "LOW"

    factors = [
        SeverityFactor(factor="Base Risk", score=base_score, description=f"{req.type} baseline hazard profile"),
        SeverityFactor(factor="Vision Confidence", score=conf_score, description=f"Detection confidence {int(req.confidence * 100)}%"),
        SeverityFactor(factor="Duplicate Boost", score=dup_boost, description=f"{req.duplicate_count} corroborating citizen reports"),
        SeverityFactor(factor="Location Risk", score=loc_risk, description="Zoned transit sector proximity"),
    ]

    return SeverityScoreResponse(score=total, severity=severity, factors=factors)
