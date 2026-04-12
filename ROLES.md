# AquaShield: Role-Based Architecture & Documentation

The AquaShield platform is designed as a **multi-tiered system** bridging the gap between field-level health workers, high-level government officials, and the general public. 

Below is the comprehensive breakdown of the **Three Distinct User Roles**, what recent features were developed for them, and how they uniquely interact with the system.

---

## 1. PUBLIC (General Citizens)
**Authentication Level:** None Required (Open Access)
**Primary Goal:** Self-assessment, situational awareness, and education regarding local waterborne threats.

### What We Built For Them:
* **`📍 /check-risk` (Intelligent Risk Assessment)**: We built a highly interactive tool where users can click a **"Use Device Location"** button. The app actively tracks their GPS, animates a map pin drop, reverse-geocodes their town name, and cross-references it against real Central Pollution Control Board (CPCB) data to inform them of exact, localized outbreak probabilities.
* **`🗺️ /map` (National Water Quality Heatmap)**: Unauthenticated users can view a macroscopic Heatmap of the entire country. We implemented dynamic `react-leaflet` density layers that cluster high-risk (Red), moderate-risk (Yellow), and safe (Green) water monitoring checkpoints.
* **`📊 /stats` (Community Outbreak Analytics)**: Designed robust `Recharts` graph UI to display historical weekly trends across states, visually tying disease (e.g., Cholera) fluctuations to metrics like Water Turbidity.
* **`🆘 /awareness` (Dynamic Safety Guidelines)**: We upgraded the standard awareness page with a "threat-simulator". This shifts the text, color palette, and advice tone dynamically based on whether the local risk is currently Low, Medium, or High (e.g. urging immediate boiling vs. standard hygiene).

---

## 2. ASHA WORKERS (Community Health Activists)
**Authentication Level:** Standard Authenticated (Role: `ASHA`)
**Primary Goal:** Field reporting, grassroots epidemiological tracking, and local community triage.

### What We Built For Them:
* **`📝 /report` (Geospatial Clinical Reporting)**: Empowered field workers with a frictionless reporting tool. Instead of manually typing village names (causing data inconsistency), ASHA workers use the integrated `<MapSelector>`. They pinpoint the exact location of a clinic or outbreak cluster. The system logs their physical coordinates alongside disease case numbers and symptom severity.
* **`🚨 /alerts` (Threshold Warnings)**: Provides a localized real-time feed of hazardous spikes. If a local sensor unexpectedly reads fatal BOD (Biological Oxygen Demand) or pH levels, ASHA workers receive instant notifications allowing them to dispatch local warnings immediately.

---

## 3. OFFICIAL (Government & High-Level Directives)
**Authentication Level:** High Privilege Authenticated (Role: `OFFICIAL`)
**Primary Goal:** Nationwide oversight, systemic analysis, and resource deployment allocation based on Machine Learning forecasts.

### What We Built For Them:
* **`📈 /dashboard` (IoT & ML Command Center)**: A strictly gated admin-panel that aggregates every physical sensor log across the continent. It displays total active High-Severity incidents and computes cross-state averages.
* **Machine Learning Extrapolation**: Under the hood, we routed authentic CPCB dataset logs (using `prepare_dataset.py`) into the backend endpoint specifically for Officials. By calling `/api/v1/dashboard/map-data`, Officials process heavy algorithmic filters (e.g. Haversine distance computations) to generate wide-radius incident metrics without crashing the frontend.

---

### Project Wide Technical Infrastructure
To securely accommodate these diverse users, we fundamentally structured the frontend navigation (`Navbar.tsx`) and Next.js Routing using a strict `withAuth.tsx` Higher Order Component barrier.

The general workflow effectively guarantees that:
1. **Public** stays informed instantly without login friction.
2. **ASHA** supplies continuous ground-truth data cleanly via interactive Maps.
3. **Official** dictates response strategies driven intelligently by the underlying XGBoost & Random Forest pipelines working silently in the FastAPI backend!
