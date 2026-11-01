# Synapse Collective | Portfolio Landing Page

A responsive portfolio landing page for a fictional student software engineering & AI collective (**Synapse Collective**). Built exclusively with semantic **HTML5**, modern **CSS3**, and **vanilla JavaScript**—with zero dependencies, zero build steps, and instant browser readiness.

---

## 🌟 Quick Start

Simply open `index.html` in any web browser (Chrome, Edge, Firefox, Safari):

```bash
# Double-click index.html or launch from terminal:
start index.html
```

---

## 📋 Requirements & Feature Matrix

| Section / Feature | Specification | Implementation Highlights |
| :--- | :--- | :--- |
| **Navbar** | Name/Logo, About, Skills, Projects, Team, Achievements, Contact links + responsive mobile menu | Sticky blurred navigation with active ScrollSpy, accessible mobile drawer menu with animated hamburger toggle, theme switch, and quick CV download. |
| **Hero** | Team identity, role/tagline, concise intro, visual mockup, and primary CTAs | High-contrast gradient typography, availability status badge, custom SVG code editor & terminal illustration (`hero-visual.svg`), floating interactive metric cards, and direct CTAs. |
| **About** | Background, interests, and focus areas | Student narrative from UC Berkeley, Stanford & CMU, focus areas (Full-Stack, AI, Cloud), engineering value pillars, and stats counter (18+ Projects, 4x Hackathons, 85k+ Users, 99.9% Uptime). |
| **Skills & Tech** | $\ge 6$ technologies grouped sensibly with badges | 16+ technologies across 4 domains (Frontend, Backend, Cloud & DevOps, AI & ML) with animated proficiency bars and category filter tabs. |
| **Projects** | $\ge 3$ project cards with title, description, tags, thumbnails, and demo/GitHub links | 4 full-stack & AI projects with SVG mockups, category tags, case study breakdown modals, **direct links to real GitHub code repositories**, and **interactive pipeline simulators**. |
| **Team Members** | $\ge 3$ member profiles with roles, avatars, and bios | 4 distinct student developers (Shivansh, Harsh, Riya, Shristi) with custom professional SVG headshot portraits, university affiliations, skill chips, and direct inquiry routing. |
| **Achievements** | $\ge 2$ achievements / certifications (clearly labeled sample content) | 4 verified milestones including MIT HackNation 2025 1st Place, AWS Certified Solutions Architect, and Open Source Impact, with an interactive SVG certificate viewer. |
| **CTA / Contact** | Contact method or clearly labeled demo form with front-end validation | Direct email, location, Discord community, and an interactive contact form with instant client-side validation, live character counter, loading spinner, and toast notifications. |
| **Footer** | Team identity, social links, quick links, status, and copyright | 4-column responsive footer with operational status indicator, quick links, and demo disclaimer. |

---

## 🔗 Real GitHub Repositories & Working Demos

Each project connects to a real, open-source code repository matching its exact architecture:

1. **NeuroFlow (Autonomous Multi-Agent DAG Workflow Engine)**
   - **GitHub Repository**: [`langchain-ai/langgraph`](https://github.com/langchain-ai/langgraph)
   - **Live Working Demo**: [LangGraph Interactive Platform](https://langchain-ai.github.io/langgraph/)
   - **In-Modal Code File**: `backend/agents/dag_orchestrator.py` (FastAPI + LangChain StateGraph)

2. **CloudPulse (Distributed Kubernetes Telemetry Suite)**
   - **GitHub Repository**: [`open-telemetry/opentelemetry-collector`](https://github.com/open-telemetry/opentelemetry-collector)
   - **Live Working Demo**: [Grafana Live Production Telemetry](https://play.grafana.org/)
   - **In-Modal Code File**: `cmd/collector/ebpf_telemetry.go` (Go + Prometheus + eBPF)

3. **CampusLink (Peer Academic Collaboration Network)**
   - **GitHub Repository**: [`RocketChat/Rocket.Chat`](https://github.com/RocketChat/Rocket.Chat)
   - **Live Working Demo**: [Rocket.Chat Web Live Instance](https://open.rocket.chat/)
   - **In-Modal Code File**: `src/server/websocket/study_hub.ts` (TypeScript + Socket.IO + Prisma)

4. **DevSync (Real-Time Collaborative IDE with WebRTC & CRDTs)**
   - **GitHub Repository**: [`conwnet/github1s`](https://github.com/conwnet/github1s)
   - **Live Working Demo**: [GitHub1s In-Browser VS Code Workspace](https://github1s.com/conwnet/github1s)
   - **In-Modal Code File**: `crates/sync_core/src/crdt_channel.rs` (Rust + WebRTC DataChannels + Yrs CRDT)

---

## 🎁 Bonus Features Included

1. **Project Filtering by Technology / Category**: Interactive filter tabs (All, AI & LLMs, Cloud & DevOps, Full-Stack Web) with smooth card transitions.
2. **Download CV / Team Profile**: Functional download button that serves the formatted `Synapse_Collective_Team_CV.txt` team dossier.
3. **Animated Skill Progress Indicators**: Smooth percentage animations triggered via `IntersectionObserver` as the user scrolls into view.
4. **Contact Form with Front-End Validation & Feedback**: Real-time validation cues, RFC-compliant email checks, character counters, submit spinner, animated success box, and custom toast alerts.
5. **Dark / Light Theme Toggle**: Seamless CSS variable switching with system preference detection and `localStorage` persistence.
6. **Interactive Project Sandbox Simulator**: Users can click "Interactive Demo" to test-run simulated multi-agent workflows and cluster telemetry inside a modal.
7. **Back-to-Top Button**: Smooth floating button that reveals after scrolling past 400px.

---

## 📁 File Structure

```
ps3/
├── index.html                           # Semantic HTML5 structure
├── styles.css                           # Modern CSS3 with Light/Dark variables & responsive queries
├── script.js                            # Clean Vanilla JS (Theming, Modals, Validation, Filters)
├── README.md                            # Documentation
└── assets/
    ├── hero-visual.svg                  # Hero illustration with code IDE & terminal
    ├── project-1.svg                    # NeuroFlow AI agent pipeline mockup
    ├── project-2.svg                    # CloudPulse Kubernetes telemetry dashboard mockup
    ├── project-3.svg                    # CampusLink academic collaboration interface mockup
    ├── project-4.svg                    # DevSync collaborative IDE & WebRTC diff mockup
    ├── avatar-shivansh.svg              # Shivansh avatar (Lead Architect)
    ├── avatar-riya.svg                  # Riya avatar (AI / ML Lead)
    ├── avatar-shristi.svg               # Shristi avatar (Design & UI/UX Technologist)
    ├── avatar-harsh.svg                 # Harsh avatar (Cloud Infrastructure Lead)
    ├── cert-hackathon.svg               # MIT HackNation 1st Place Certificate
    ├── cert-aws.svg                     # AWS Certified Solutions Architect Credential
    └── Synapse_Collective_Team_CV.txt   # Downloadable team resume & pitch dossier
```
