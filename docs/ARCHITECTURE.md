# 🏙️ CivicAI — System Architecture & Technical Specifications

> **Tagline:** *"See the Problem. Understand the Impact. Fix It Faster."*

---

## 1. Executive Summary

CivicAI is a modern, full-stack smart city municipal operations and civic intelligence platform. It transforms civic reporting from slow, fragmented manual ticketing into an automated, AI-driven closed-loop workflow:
1. **Citizen Ingestion**: Citizens capture and upload photos with GPS coordinates via mobile or web.
2. **AI Vision & Classification**: YOLOv8 computer vision models detect and localize infrastructure defects (potholes, garbage, broken streetlights, water leaks, open manholes) with bounding box geometry and confidence ratings.
3. **Multi-Factor Risk Scoring**: Evaluates severity (0-100) using a composite formula of defect hazard weight, model confidence, duplicate corroboration, and transit corridor sensitivity.
4. **Spatial Deduplication**: Uses Haversine proximity clustering (sub-50m radius) and visual defect matching to group duplicate complaints under a single master incident.
5. **Generative AI Copilot & RAG**: Operators converse with an intelligent assistant grounded in live municipal data via Retrieval-Augmented Generation with hyperlinked incident references.
6. **Real-Time Dispatch**: Socket.IO broadcasts immediate notifications across municipal dashboards, enabling automated routing to responsible departments (Road Maintenance, Sanitation, Water, Electrical, Public Works).

---

## 2. Architectural Blueprint

```
+-----------------------------------------------------------------------------------+
|                                  CLIENT LAYER                                     |
|  +---------------------------+  +--------------------------+  +----------------+  |
|  | Citizen Web / PWA         |  | Operations Command Center|  | Field Dispatch |  |
|  | - React 18, Vite          |  | - Real-time KPI charts   |  | - Ticket queue |  |
|  | - Camera & GPS Capture    |  | - Leaflet spatial map    |  | - Status update|  |
|  | - Status Tracker          |  | - AI Copilot (RAG)       |  | - Proof upload |  |
|  +---------------------------+  +--------------------------+  +----------------+  |
+-----------------------------------------|-----------------------------------------+
                                          | HTTPS / WebSockets (Port 3001)
+-----------------------------------------v-----------------------------------------+
|                               API GATEWAY & BACKEND                               |
|  +-----------------------------------------------------------------------------+  |
|  | Node.js / Express / TypeScript                                              |  |
|  | - JWT Authentication & RBAC (Citizen, Officer, Supervisor, Admin)          |  |
|  | - Multer Multipart Ingestion & Media Disk Buffer                           |  |
|  | - Socket.IO Pub/Sub Event Hub (Wards, Departments, Global Alerts)           |  |
|  | - Centralized Error Handling & Rate Limiting                                |  |
|  +-----------------------------------------------------------------------------+  |
|         |                                      |                                  |
|         v                                      v                                  |
|  +------------------------------+       +--------------------------------------+  |
|  | Dual-Tier Data Layer         |       | AI & ML Microservice Client          |  |
|  | - PostgreSQL 15 + PostGIS    |       | - FastAPI (Port 8000)                |  |
|  | - In-Memory Resilient Store  |       | - YOLOv8 Computer Vision Engine      |  |
|  | - Redis 7 Spatial Cache      |       | - Multi-Factor Severity Scorer       |  |
|  +------------------------------+       | - Google Gemini 3.8 Flash / OpenAI   |  |
|                                         +--------------------------------------+  |
+-----------------------------------------------------------------------------------+
```

---

## 3. Core Algorithms & Mathematical Foundations

### 3.1 Multi-Factor Severity Scoring Equation

The system determines civic priority on a normalized scale $S \in [0, 100]$:

$$S = \min\left(100, \, W_{\text{base}}(T) + \lfloor 20 \cdot C_{\text{vision}} \rfloor + \min(5 \cdot N_{\text{dup}}, 20) + R_{\text{loc}}\right)$$

Where:
- $W_{\text{base}}(T)$: Base risk weight of issue type $T$ (Open Manhole $= 45$, Pothole $= 32$, Road Damage $= 28$, Water Leakage $= 26$, Drainage $= 24$, Garbage $= 22$, Streetlight $= 18$).
- $C_{\text{vision}} \in [0.0, 1.0]$: Confidence score from the YOLO computer vision classifier.
- $N_{\text{dup}}$: Number of corroborating citizen reports linked within the spatial cluster.
- $R_{\text{loc}} \in [5, 25]$: Environmental hazard risk factor based on ward classification and transit arterial priority.

**Severity Tiers:**
- **CRITICAL** ($S \ge 76$): Immediate dispatch; triggers audible broadcast alert on admin console.
- **HIGH** ($51 \le S < 76$): Escalated ticket; 24-hour resolution SLA.
- **MEDIUM** ($26 \le S < 51$): Standard operational queue; 48-hour resolution SLA.
- **LOW** ($S < 26$): Scheduled routine maintenance.

---

### 3.2 Haversine Geospatial Proximity Clustering

To detect duplicate reports without external GIS dependencies, the system computes great-circle distance between coordinates $(\phi_1, \lambda_1)$ and $(\phi_2, \lambda_2)$:

$$a = \sin^2\left(\frac{\Delta \phi}{2}\right) + \cos(\phi_1)\cos(\phi_2)\sin^2\left(\frac{\Delta \lambda}{2}\right)$$
$$c = 2 \cdot \text{atan2}\left(\sqrt{a}, \sqrt{1-a}\right)$$
$$d = R \cdot c \quad (R = 6371\text{ km})$$

If $d \le 0.05\text{ km}$ ($50\text{ meters}$) and $\text{Type}_1 = \text{Type}_2$ within a 24-hour temporal window:
$$\text{IsDuplicate} = \text{True}$$
The new report increments $N_{\text{dup}}$ on the primary ticket and links as a child reference.

---

## 4. Security & Access Control (RBAC)

| Role | Permissions |
|---|---|
| **CITIZEN** | Create reports, view own submitted tickets, browse public ward map, track resolution timeline. |
| **OFFICER** | View assigned department tickets, update status (`IN_PROGRESS`, `RESOLVED`), upload repair proof, add field notes. |
| **SUPERVISOR** | Department-wide oversight, ticket reassignment, SLA audit, quality assurance validation. |
| **ADMIN** | Full administrative command, system-wide analytics, user role provisioning, department configuration, AI Copilot access. |
