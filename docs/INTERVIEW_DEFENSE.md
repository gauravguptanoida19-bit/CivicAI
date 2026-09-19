# 🎯 CivicAI — Technical Interview & Hackathon Defense Guide

Use this guide to confidently explain key engineering decisions, trade-offs, and algorithms implemented in **CivicAI**.

---

### Q1: Why use YOLOv8 for civic defect detection instead of traditional CNNs or ResNet classifiers?
**Answer:**
- Standard image classification networks (ResNet, EfficientNet) predict a single global label for the entire image without spatial context.
- YOLOv8 is a one-stage object detection architecture that simultaneously predicts **bounding box coordinates** $(x, y, w, h)$, **class probabilities**, and **confidence scores** in a single forward pass.
- In municipal operations, localization is critical: we need to know whether the pothole is in the driving lane or on the shoulder, or where garbage is accumulating relative to pedestrian sidewalks.
- YOLOv8 provides sub-20ms inference latency on standard hardware, making it suitable for edge cameras and high-concurrency cloud deployments.

---

### Q2: How does the system prevent duplicate tickets when 50 citizens report the same pothole?
**Answer:**
- We implement a dual-phase deduplication pipeline:
  1. **Geospatial Proximity Gate**: Using the Haversine equation (or PostGIS `ST_DWithin`), we query for existing open reports of the same category within a 50-meter radius submitted within the last 24 hours.
  2. **Feature Corroboration**: If matching reports are found, instead of creating a redundant ticket, the system automatically increments the `duplicateCount` and `reportCount` on the primary master incident.
- This prevents ticket flood in municipal departments while simultaneously increasing the issue's priority score through the corroboration term in our multi-factor severity formula.

---

### Q3: How is the multi-factor severity score calculated?
**Answer:**
- Severity is calculated on a 0-100 normalized score combining four distinct signals:
  1. **Base Hazard Profile** (up to 45 pts): Open manholes and deep asphalt fissures represent acute life-safety risks compared to non-functional streetlights or cosmetic issues.
  2. **Computer Vision Confidence** (up to 20 pts): High-confidence detections receive greater urgency.
  3. **Corroborating Reports** (up to 20 pts): Multiple independent citizens reporting the same defect confirms community severity.
  4. **Corridor Sensitivity** (up to 25 pts): Issues on primary arterial transit corridors or near schools receive higher priority weights.
- Tickets with score $\ge 76$ are classified as **CRITICAL**, immediately triggering audible alerts and real-time dashboard banner notifications.

---

### Q4: How does the AI Copilot work and how do you prevent hallucinations?
**Answer:**
- The Copilot uses a Retrieval-Augmented Generation (RAG) architecture:
  1. Incoming natural language queries are parsed to extract intent, severity constraints, and location filters.
  2. Relevant tickets are fetched from the indexed repository as structured context.
  3. The prompt explicitly instructs the LLM (Gemini 3.8 Flash) to base its analysis strictly on the supplied facts and format references as clickable citations (e.g. `[CIV-1041](/admin/issues/iss-001)`).
  4. If external LLM APIs are offline or unconfigured, an intelligent heuristic reasoning engine synthesizes structured insights with zero external dependency.

---

### Q5: How do WebSockets improve municipal operations compared to standard polling?
**Answer:**
- In a city command center managing hundreds of simultaneous field events, HTTP polling introduces unnecessary latency and database load.
- We utilize Socket.IO with topic-based rooms (`ward:${wardId}`, `dept:${deptCode}`).
- When a new incident is triaged or an officer marks a repair as `RESOLVED`, the backend immediately broadcasts the payload down active WebSocket pipes, updating metric counters, charts, and map pins with zero latency and zero page refresh.
