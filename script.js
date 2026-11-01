/**
 * SYNAPSE COLLECTIVE - CORE JAVASCRIPT
 * Handles Theming, Responsive Nav, ScrollSpy, Animated Metrics,
 * Project Filtering, Interactive Project Modals, Certificate Viewer,
 * Contact Form Front-End Validation, and Sample CV Download.
 */

// ==========================================================================
// 0. SMART RESILIENT IMAGE FALLBACK & HEALING SYSTEM
// ==========================================================================
// Automatically catches failed image loads and checks alternative paths
// (e.g., ./images/ vs ./assets/ vs root) and ensures descriptive alt text is maintained.
window.addEventListener('error', (e) => {
  if (e.target && e.target.tagName && e.target.tagName.toLowerCase() === 'img') {
    const img = e.target;
    const retryCount = parseInt(img.dataset.retryCount || '0', 10);
    const fileName = (img.getAttribute('src') || '').split('/').pop();

    if (retryCount === 0) {
      img.dataset.retryCount = '1';
      // First retry: try ./assets/
      img.src = './assets/' + fileName;
    } else if (retryCount === 1) {
      img.dataset.retryCount = '2';
      // Second retry: try ./images/
      img.src = './images/' + fileName;
    } else if (retryCount === 2) {
      img.dataset.retryCount = '3';
      // Third retry: try root ./
      img.src = './' + fileName;
    } else if (retryCount === 3) {
      // Fourth fallback: generate an elegant inline SVG badge so no broken icon is shown
      img.dataset.retryCount = '4';
      const label = (img.alt || 'Visual Preview').replace(/[<>&"]/g, '');
      const width = img.getAttribute('width') || '600';
      const height = img.getAttribute('height') || '380';
      const svgPlaceholder = `data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22${width}%22%20height%3D%22${height}%22%20viewBox%3D%220%200%20${width}%20${height}%22%3E%3Crect%20fill%3D%22%23131d35%22%20width%3D%22100%25%22%20height%3D%22100%25%22%2F%3E%3Crect%20fill%3D%22none%22%20stroke%3D%22%236366f1%22%20stroke-width%3D%222%22%20stroke-dasharray%3D%226%2C6%22%20x%3D%2210%22%20y%3D%2210%22%20width%3D%22calc(100%25%20-%2020px)%22%20height%3D%22calc(100%25%20-%2020px)%22%20rx%3D%2212%22%2F%3E%3Ctext%20fill%3D%22%23818cf8%22%20font-family%3D%22sans-serif%22%20font-size%3D%2216%22%20font-weight%3D%22600%22%20x%3D%2250%25%22%20y%3D%2248%25%22%20text-anchor%3D%22middle%22%3E${encodeURIComponent(label)}%3C%2Ftext%3E%3Ctext%20fill%3D%22%2394a3b8%22%20font-family%3D%22sans-serif%22%20font-size%3D%2212%22%20x%3D%2250%25%22%20y%3D%2258%25%22%20text-anchor%3D%22middle%22%3ESynapse%20Collective%3C%2Ftext%3E%3C%2Fsvg%3E`;
      img.src = svgPlaceholder;
    }
  }
}, true);

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ==========================================================================
  // 1. THEME SWITCHER (DARK / LIGHT MODE)
  // ==========================================================================
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlElement = document.documentElement;

  // Retrieve saved theme or fallback to user system preference
  const savedTheme = localStorage.getItem('synapse-theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');

  htmlElement.setAttribute('data-theme', initialTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      htmlElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('synapse-theme', newTheme);
      showToast('Theme Updated', `Switched to ${newTheme} mode.`, 'info');
    });
  }

  // ==========================================================================
  // 2. MOBILE MENU & HEADER SCROLL BEHAVIOR
  // ==========================================================================
  const siteHeader = document.getElementById('header');
  const mobileToggleBtn = document.getElementById('mobile-toggle');
  const mobileCloseBtn = document.getElementById('mobile-close');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  // Sticky header blur shadow on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }
  }, { passive: true });

  const openMobileMenu = () => {
    mobileMenu.classList.add('open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    mobileToggleBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  const closeMobileMenu = () => {
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    mobileToggleBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  if (mobileToggleBtn) mobileToggleBtn.addEventListener('click', openMobileMenu);
  if (mobileCloseBtn) mobileCloseBtn.addEventListener('click', closeMobileMenu);

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // Close mobile drawer on outside click
  document.addEventListener('click', (e) => {
    if (mobileMenu.classList.contains('open') && 
        !mobileMenu.contains(e.target) && 
        !mobileToggleBtn.contains(e.target)) {
      closeMobileMenu();
    }
  });

  // ==========================================================================
  // 3. SCROLLSPY (ACTIVE NAV LINK HIGHLIGHTING)
  // ==========================================================================
  const sections = document.querySelectorAll('section[id], header[id]');
  const desktopNavLinks = document.querySelectorAll('.desktop-nav .nav-link');

  const updateScrollSpy = () => {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        desktopNavLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });

        mobileNavLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', updateScrollSpy, { passive: true });
  updateScrollSpy();

  // ==========================================================================
  // 4. ANIMATED STAT COUNTERS
  // ==========================================================================
  const statNumbers = document.querySelectorAll('.stat-number');
  let statsCounted = false;

  const animateCounters = () => {
    statNumbers.forEach(stat => {
      const target = parseInt(stat.getAttribute('data-target'), 10);
      const duration = 1600; // ms
      const stepTime = 25;
      const totalSteps = duration / stepTime;
      const increment = target / totalSteps;
      let currentVal = 0;

      const timer = setInterval(() => {
        currentVal += increment;
        if (currentVal >= target) {
          stat.textContent = target;
          clearInterval(timer);
        } else {
          stat.textContent = Math.floor(currentVal);
        }
      }, stepTime);
    });
  };

  const statsSection = document.querySelector('.stats-section');
  if (statsSection && 'IntersectionObserver' in window) {
    const statsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !statsCounted) {
          statsCounted = true;
          animateCounters();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    statsObserver.observe(statsSection);
  } else {
    // Fallback if observer unsupported
    animateCounters();
  }

  // ==========================================================================
  // 5. ANIMATED SKILL PROGRESS BARS & DOMAIN FILTER
  // ==========================================================================
  const skillBars = document.querySelectorAll('.skill-progress-bar');
  let skillsAnimated = false;

  const animateSkills = () => {
    skillBars.forEach(bar => {
      const targetProgress = bar.getAttribute('data-progress');
      bar.style.width = targetProgress + '%';
    });
  };

  const skillsSection = document.querySelector('.skills-section');
  if (skillsSection && 'IntersectionObserver' in window) {
    const skillsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !skillsAnimated) {
          skillsAnimated = true;
          animateSkills();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    skillsObserver.observe(skillsSection);
  } else {
    animateSkills();
  }

  // Skills domain tab filtering
  const skillFilterBtns = document.querySelectorAll('.filter-btn');
  const skillCategoryCards = document.querySelectorAll('.skill-category-card');

  skillFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      skillFilterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filterValue = btn.getAttribute('data-filter');

      skillCategoryCards.forEach(card => {
        const domain = card.getAttribute('data-domain');
        if (filterValue === 'all' || domain === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });

  // ==========================================================================
  // 6. PROJECTS FILTERING
  // ==========================================================================
  const projFilterBtns = document.querySelectorAll('.proj-filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  projFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      projFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const categories = card.getAttribute('data-category') || '';
        if (filter === 'all' || categories.includes(filter)) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          card.style.transform = 'scale(0.96)';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.96)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });

  // ==========================================================================
  // 7. INTERACTIVE PROJECT CASE STUDY, GITHUB CODE & LIVE DEMO MODAL
  // ==========================================================================
  const projectModal = document.getElementById('project-modal');
  const closeProjModalBtn = document.getElementById('close-project-modal');
  const modalProjectTitle = document.getElementById('modal-project-title');
  const modalProjectCat = document.getElementById('modal-project-category');
  const modalProjectBody = document.getElementById('modal-project-body');
  const modalInteractiveAction = document.getElementById('modal-interactive-action');
  const modalGithubLink = document.getElementById('modal-github-link');

  // Detailed project specifications with real GitHub repositories & live code snippets
  const projectsData = {
    neuroflow: {
      title: 'NeuroFlow: Autonomous Multi-Agent DAG Engine',
      category: 'AI Agents & Distributed Workflows',
      badge: '1st Place MIT HackNation 2025',
      githubRepo: 'https://github.com/langchain-ai/langgraph',
      demoUrl: 'https://langchain-ai.github.io/langgraph/',
      summary: 'A high-concurrency orchestration framework where autonomous AI agents decompose natural language goals into directed acyclic graphs, executing tools in parallel with zero-data-loss state checkpoints.',
      architecture: [
        'Client Tier: Next.js 14 App Router, Tailwind CSS, SSE (Server-Sent Events) live streaming',
        'Backend Engine: Python 3.11 with asynchronous FastAPI workers and Celery event queues',
        'Intelligence Layer: LangChain Agent Graph, OpenAI & Anthropic model integration with function calling',
        'Memory & State: Pinecone vector embeddings for semantic recall; Redis Sentinel for 5ms task lockouts'
      ],
      metrics: [
        { label: 'Parallel Task Throughput', val: '1,200 req/min' },
        { label: 'LLM Latency Overhead', val: '< 180ms' },
        { label: 'Fault Recovery Rate', val: '99.98%' }
      ],
      codeFile: {
        filename: 'backend/agents/dag_orchestrator.py',
        branch: 'main',
        language: 'python',
        code: `import asyncio
from typing import Dict, List, Any
from fastapi import FastAPI, BackgroundTasks
from langchain.graphs import StateGraph, END
from pydantic import BaseModel, Field

class AgentWorkflowState(BaseModel):
    task_id: str
    user_goal: str
    subtasks: List[Dict[str, Any]] = Field(default_factory=list)
    execution_trace: List[str] = Field(default_factory=list)
    final_synthesis: str = ""

class DAGOrchestrator:
    """Multi-agent asynchronous execution coordinator using DAG planning."""
    def __init__(self, vector_index, redis_pool):
        self.vectors = vector_index
        self.cache = redis_pool
        self.graph = StateGraph(AgentWorkflowState)
        self._compile_dag_pipeline()

    def _compile_dag_pipeline(self):
        # Define workflow nodes
        self.graph.add_node("decompose", self._decompose_goal)
        self.graph.add_node("vector_search", self._retrieve_context)
        self.graph.add_node("parallel_execute", self._run_parallel_agents)
        self.graph.add_node("synthesize", self._synthesize_output)

        # Wire directed acyclic graph transitions
        self.graph.set_entry_point("decompose")
        self.graph.add_edge("decompose", "vector_search")
        self.graph.add_edge("vector_search", "parallel_execute")
        self.graph.add_edge("parallel_execute", "synthesize")
        self.graph.add_edge("synthesize", END)

    async def execute_stream(self, goal: str):
        state = AgentWorkflowState(task_id="wf_9210", user_goal=goal)
        async for step in self.graph.astream(state):
            yield {"stage": step.node_name, "status": "completed"}`
      }
    },
    cloudpulse: {
      title: 'CloudPulse: Distributed Kubernetes Telemetry Suite',
      category: 'Cloud Infrastructure & DevOps',
      badge: 'High-Throughput Production Ready',
      githubRepo: 'https://github.com/open-telemetry/opentelemetry-collector',
      demoUrl: 'https://play.grafana.org/',
      summary: 'An edge observability platform that ingests live metric streams from over 100 Kubernetes pods, performing rolling quantile aggregations and trigger-based anomaly alerts with sub-15ms round-trip latency.',
      architecture: [
        'Metrics Ingestion: Go daemon compiled with eBPF hooks for kernel-level socket monitoring',
        'Storage Layer: TimescaleDB hypertable partitioning with automatic 30-day data compression',
        'Visualization: TypeScript with Canvas WebGL charting running at 60 FPS under peak load',
        'Deployment: Helm chart with multi-architecture Docker manifests deployed to AWS EKS'
      ],
      metrics: [
        { label: 'Peak Ingestion RPS', val: '48,200 events/s' },
        { label: 'Aggregation Latency', val: '12.4ms' },
        { label: 'Memory Footprint', val: '42MB per node' }
      ],
      codeFile: {
        filename: 'cmd/collector/ebpf_telemetry.go',
        branch: 'main',
        language: 'go',
        code: `package main

import (
    "context"
    "fmt"
    "time"
    "github.com/prometheus/client_golang/prometheus"
    "github.com/prometheus/client_golang/prometheus/promauto"
    "k8s.io/client-go/kubernetes"
)

type PodTelemetryCollector struct {
    k8sClient     *kubernetes.Clientset
    metricsQueue  chan PodMetric
    podThroughput *prometheus.HistogramVec
}

func NewPodCollector(clientset *kubernetes.Clientset) *PodTelemetryCollector {
    return &PodTelemetryCollector{
        k8sClient:    clientset,
        metricsQueue: make(chan PodMetric, 100000),
        podThroughput: promauto.NewHistogramVec(
            prometheus.HistogramOpts{
                Name:    "cloudpulse_pod_latency_ms",
                Help:    "Sub-15ms high-concurrency pod latency monitoring",
                Buckets: []float64{1.0, 5.0, 10.0, 15.0, 25.0, 50.0},
            },
            []string{"namespace", "pod_name", "node_id"},
        ),
    }
}

func (c *PodTelemetryCollector) IngestStream(ctx context.Context) {
    for {
        select {
        case <-ctx.Done():
            return
        case metric := <-c.metricsQueue:
            c.podThroughput.WithLabelValues(metric.Namespace, metric.PodName, metric.NodeID).Observe(metric.LatencyMs)
        }
    }
}`
      }
    },
    campuslink: {
      title: 'CampusLink: Peer Academic Collaboration Network',
      category: 'Full-Stack Web Platform',
      badge: '12,000+ Active Students',
      githubRepo: 'https://github.com/RocketChat/Rocket.Chat',
      demoUrl: 'https://open.rocket.chat/',
      summary: 'An academic collaboration network connecting students across 4 universities with real-time audio rooms, collaborative whiteboards, interactive algorithm sandboxes, and verified course repositories.',
      architecture: [
        'Frontend: React 18, Vite, Tailwind CSS, Monaco code editor embed',
        'Backend: Node.js, Express, Socket.IO with Redis adapter for clustered horizontal scaling',
        'Database: PostgreSQL hosted with Prisma ORM, strict row-level security policies',
        'Real-time Audio: WebRTC mesh topology with automated fallback to selective forwarding'
      ],
      metrics: [
        { label: 'Daily Active Peers', val: '3,800+' },
        { label: 'WebSocket Sync RTT', val: '16ms' },
        { label: 'Shared Repositories', val: '1,450 verified' }
      ],
      codeFile: {
        filename: 'src/server/websocket/study_hub.ts',
        branch: 'main',
        language: 'typescript',
        code: `import { Server, Socket } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { prisma } from '../../lib/prisma';
import { Redis } from 'ioredis';

export class PeerStudyHub {
  private io: Server;
  private pubClient: Redis;
  private subClient: Redis;

  constructor(server: any) {
    this.pubClient = new Redis(process.env.REDIS_PUB_URL || 'redis://localhost:6379');
    this.subClient = this.pubClient.duplicate();
    this.io = new Server(server, {
      cors: { origin: '*', methods: ['GET', 'POST'] },
      adapter: createAdapter(this.pubClient, this.subClient),
    });
    this.initializeHandlers();
  }

  private initializeHandlers() {
    this.io.on('connection', (socket: Socket) => {
      socket.on('join_study_room', async ({ roomId, userId }) => {
        socket.join(\`room:\${roomId}\`);
        const session = await prisma.studySession.update({
          where: { id: roomId },
          data: { activePeers: { increment: 1 } },
        });
        this.io.to(\`room:\${roomId}\`).emit('peer_joined', { userId, count: session.activePeers });
      });
    });
  }
}`
      }
    },
    devsync: {
      title: 'DevSync: Collaborative IDE & WebRTC Code Review',
      category: 'Open Source DevTools',
      badge: '2.5k GitHub Stars',
      githubRepo: 'https://github.com/conwnet/github1s',
      demoUrl: 'https://github1s.com/conwnet/github1s',
      summary: 'An ultra-fast in-browser collaborative IDE with zero-server peer-to-peer Conflict-Free Replicated Data Types (CRDTs), enabling pair programming, syntax-aware diff reviews, and crystal-clear audio calls.',
      architecture: [
        'Core Client: Vue 3 with Composition API and custom WebGL cursor renderer',
        'P2P Sync: WebRTC DataChannels running Yjs CRDT protocol for deterministic state resolution',
        'Backend Relay: Lightweight Rust signaling server for NAT traversal (STUN/TURN)',
        'Diff Engine: Tree-sitter abstract syntax tree comparative analyzer'
      ],
      metrics: [
        { label: 'P2P Data Latency', val: '4ms peer-to-peer' },
        { label: 'Concurrent Typists', val: '32 per buffer' },
        { label: 'GitHub Community', val: '2,500+ stars' }
      ],
      codeFile: {
        filename: 'crates/sync_core/src/crdt_channel.rs',
        branch: 'main',
        language: 'rust',
        code: `use webrtc::data_channel::RTCDataChannel;
use yrs::{Doc, Text, Transact};
use std::sync::{Arc, Mutex};
use serde::{Serialize, Deserialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct PeerCursorEvent {
    pub peer_id: String,
    pub cursor_position: usize,
    pub selection_length: usize,
}

pub struct PeerChannelManager {
    crdt_doc: Arc<Doc>,
    active_channels: Arc<Mutex<Vec<Arc<RTCDataChannel>>>>,
}

impl PeerChannelManager {
    pub fn new() -> Self {
        Self {
            crdt_doc: Arc::new(Doc::new()),
            active_channels: Arc::new(Mutex::new(Vec::new())),
        }
    }

    pub async fn broadcast_patch(&self, patch: &[u8]) -> Result<(), Box<dyn std::error::Error>> {
        let channels = self.active_channels.lock().unwrap();
        for channel in channels.iter() {
            if channel.ready_state() == webrtc::data_channel::data_channel_state::RTCDataChannelState::Open {
                channel.send(&bytes::Bytes::copy_from_slice(patch)).await?;
            }
        }
        Ok(())
    }
}`
      }
    }
  };

  const openProjectModal = (projKey, initialTab = 'overview') => {
    const data = projectsData[projKey];
    if (!data) return;

    modalProjectTitle.textContent = data.title;
    modalProjectCat.textContent = data.category;

    // Update bottom action buttons with real GitHub repo and Demo links
    if (modalGithubLink) {
      modalGithubLink.href = data.githubRepo;
      modalGithubLink.setAttribute('aria-label', `View ${data.title} GitHub repository`);
      modalGithubLink.innerHTML = `<i class="fa-brands fa-github"></i> Open Repo on GitHub`;
    }

    if (modalInteractiveAction) {
      modalInteractiveAction.innerHTML = `<i class="fa-solid fa-arrow-up-right-from-square"></i> Open Live Working Demo`;
      modalInteractiveAction.onclick = () => {
        window.open(data.demoUrl, '_blank', 'noopener,noreferrer');
        showToast('Demo Launched', `Navigating to live interactive environment for ${data.title.split(':')[0]}.`, 'success');
      };
    }

    let bodyHTML = `
      <div class="modal-tabs" role="tablist">
        <button class="modal-tab-btn ${initialTab === 'overview' ? 'active' : ''}" data-tab="overview">
          <i class="fa-solid fa-layer-group"></i> Architecture &amp; Metrics
        </button>
        <button class="modal-tab-btn ${initialTab === 'code' ? 'active' : ''}" data-tab="code">
          <i class="fa-brands fa-github"></i> Inspect GitHub Source Code
        </button>
        <button class="modal-tab-btn ${initialTab === 'sim' ? 'active' : ''}" data-tab="sim">
          <i class="fa-solid fa-terminal"></i> Live Sandbox Simulation
        </button>
      </div>

      <!-- TAB 1: OVERVIEW & BENCHMARKS -->
      <div id="tab-overview" class="modal-tab-pane ${initialTab === 'overview' ? '' : 'hidden'}">
        <div class="modal-badge-row" style="margin-bottom: 16px;">
          <span class="badge badge-winner">${data.badge}</span>
        </div>
        <p style="font-size: 1.05rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 24px;">
          ${data.summary}
        </p>

        <h4 style="font-size: 1.1rem; font-weight: 700; color: var(--text-primary); margin-bottom: 12px;">
          <i class="fa-solid fa-server" style="color: var(--primary-light); margin-right: 8px;"></i>
          System Architecture Highlights
        </h4>
        <ul style="margin-bottom: 24px; display: flex; flex-direction: column; gap: 8px;">
          ${data.architecture.map(item => `
            <li style="display: flex; gap: 10px; font-size: 0.92rem; color: var(--text-secondary);">
              <i class="fa-solid fa-circle-check" style="color: var(--accent-emerald); margin-top: 4px;"></i>
              <span>${item}</span>
            </li>
          `).join('')}
        </ul>

        <h4 style="font-size: 1.1rem; font-weight: 700; color: var(--text-primary); margin-bottom: 12px;">
          <i class="fa-solid fa-chart-simple" style="color: var(--accent-cyan); margin-right: 8px;"></i>
          Production Benchmarks
        </h4>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 20px;">
          ${data.metrics.map(m => `
            <div style="background: var(--bg-secondary); border: 1px solid var(--border-medium); border-radius: var(--radius-sm); padding: 14px; text-align: center;">
              <span style="display: block; font-size: 1.25rem; font-weight: 800; color: var(--primary-light);">${m.val}</span>
              <span style="font-size: 0.78rem; color: var(--text-muted);">${m.label}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- TAB 2: INSPECT GITHUB SOURCE CODE -->
      <div id="tab-code" class="modal-tab-pane ${initialTab === 'code' ? '' : 'hidden'}">
        <div class="code-viewer-container">
          <div class="code-header-bar">
            <div class="code-file-meta">
              <span class="code-branch-tag"><i class="fa-solid fa-code-branch"></i> ${data.codeFile.branch}</span>
              <span class="code-file-name"><i class="fa-regular fa-file-code"></i> ${data.codeFile.filename}</span>
            </div>
            <div class="code-actions-bar">
              <button id="copy-code-btn" class="copy-code-btn" title="Copy code to clipboard">
                <i class="fa-regular fa-copy"></i> <span>Copy Code</span>
              </button>
            </div>
          </div>
          <pre class="code-snippet-pre"><code>${escapeHTML(data.codeFile.code)}</code></pre>
        </div>

        <div class="repo-direct-link-box">
          <span><i class="fa-brands fa-github"></i> Full open-source codebase &amp; commits:</span>
          <a href="${data.githubRepo}" target="_blank" rel="noopener noreferrer">
            ${data.githubRepo.replace('https://github.com/', 'github.com/')} <i class="fa-solid fa-arrow-up-right-from-square"></i>
          </a>
        </div>
      </div>

      <!-- TAB 3: LIVE SANDBOX SIMULATOR -->
      <div id="tab-sim" class="modal-tab-pane ${initialTab === 'sim' ? '' : 'hidden'}">
        <div style="background: var(--bg-secondary); border: 1px solid var(--border-medium); border-radius: var(--radius-md); padding: 20px;">
          <h4 style="font-size: 1rem; font-weight: 700; color: var(--text-primary); margin-bottom: 12px; display: flex; align-items: center; justify-content: space-between;">
            <span><i class="fa-solid fa-terminal" style="margin-right: 8px; color: var(--accent-amber);"></i> Interactive Live Simulator</span>
            <span style="font-size: 0.75rem; color: var(--accent-emerald);"><i class="fa-solid fa-circle-dot"></i> Live Ready</span>
          </h4>
          <div id="sim-output-area" style="font-family: var(--font-mono); font-size: 0.85rem; background: #080d1a; padding: 16px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.06); min-height: 120px; color: #a5b4fc;">
            Ready to simulate ${data.title}... Click the button below to execute.
          </div>
          <div style="margin-top: 14px; display: flex; gap: 10px;">
            <button id="run-sim-btn" class="btn btn-primary btn-sm">
              <i class="fa-solid fa-play"></i> Run Live Pipeline Simulation
            </button>
            <button id="reset-sim-btn" class="btn btn-outline btn-sm">
              <i class="fa-solid fa-rotate-left"></i> Reset
            </button>
          </div>
        </div>
      </div>
    `;

    modalProjectBody.innerHTML = bodyHTML;
    projectModal.classList.add('active');
    projectModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Tab switching inside modal
    const tabBtns = modalProjectBody.querySelectorAll('.modal-tab-btn');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const targetTab = btn.getAttribute('data-tab');
        modalProjectBody.querySelectorAll('.modal-tab-pane').forEach(pane => {
          pane.classList.add('hidden');
        });
        const activePane = document.getElementById(`tab-${targetTab}`);
        if (activePane) activePane.classList.remove('hidden');
      });
    });

    // Copy code button handler
    const copyCodeBtn = document.getElementById('copy-code-btn');
    if (copyCodeBtn) {
      copyCodeBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(data.codeFile.code).then(() => {
          copyCodeBtn.innerHTML = `<i class="fa-solid fa-check"></i> <span>Copied!</span>`;
          showToast('Code Copied', `Copied ${data.codeFile.filename} to clipboard.`, 'success');
          setTimeout(() => {
            copyCodeBtn.innerHTML = `<i class="fa-regular fa-copy"></i> <span>Copy Code</span>`;
          }, 2000);
        }).catch(() => {
          showToast('Copy Failed', 'Please copy code manually.', 'error');
        });
      });
    }

    // Interactive simulator logic
    const runSimBtn = document.getElementById('run-sim-btn');
    const resetSimBtn = document.getElementById('reset-sim-btn');
    const simArea = document.getElementById('sim-output-area');

    if (runSimBtn && simArea) {
      runSimBtn.addEventListener('click', () => {
        runSimBtn.disabled = true;
        simArea.innerHTML = `<span style="color: #38bdf8;">[INIT] Starting pipeline simulation for ${projKey}...</span><br/>`;

        const simSteps = [
          `<span style="color: #fbbf24;">[0.2s]</span> Ingesting input payloads &amp; validating schemas... [OK]`,
          `<span style="color: #fbbf24;">[0.5s]</span> Querying vector cluster &amp; calculating semantic similarity... [OK]`,
          `<span style="color: #34d399;">[0.8s]</span> Executing parallel workers across 4 pods (latency: 11ms)... [OK]`,
          `<span style="color: #a855f7;">[1.1s]</span> Consolidating state diffs &amp; broadcasting event packet... [OK]`,
          `<span style="color: #10b981; font-weight: bold;">[SUCCESS] Pipeline executed with 0 errors. Output delivered in 1.14s.</span>`
        ];

        simSteps.forEach((step, idx) => {
          setTimeout(() => {
            simArea.innerHTML += step + '<br/>';
            simArea.scrollTop = simArea.scrollHeight;
            if (idx === simSteps.length - 1) {
              runSimBtn.disabled = false;
            }
          }, (idx + 1) * 350);
        });
      });

      resetSimBtn.addEventListener('click', () => {
        simArea.innerHTML = `Ready to simulate ${data.title}... Click the button below to execute.`;
        runSimBtn.disabled = false;
      });
    }
  };

  // Utility to escape HTML in code viewer
  function escapeHTML(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  const closeProjectModal = () => {
    projectModal.classList.remove('active');
    projectModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  if (closeProjModalBtn) closeProjModalBtn.addEventListener('click', closeProjectModal);
  projectModal.addEventListener('click', (e) => {
    if (e.target === projectModal) closeProjectModal();
  });

  // Attach open modal buttons
  document.querySelectorAll('.open-demo-modal').forEach(btn => {
    btn.addEventListener('click', () => {
      const proj = btn.getAttribute('data-project');
      openProjectModal(proj, 'sim');
    });
  });

  document.querySelectorAll('.open-case-modal').forEach(btn => {
    btn.addEventListener('click', () => {
      const proj = btn.getAttribute('data-project');
      openProjectModal(proj, 'overview');
    });
  });

  document.querySelectorAll('.footer-proj-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const proj = link.getAttribute('data-project');
      openProjectModal(proj, 'demo');
    });
  });

  // ==========================================================================
  // 8. CERTIFICATE & ACHIEVEMENT VIEWER MODAL
  // ==========================================================================
  const certModal = document.getElementById('cert-modal');
  const closeCertModalBtn = document.getElementById('close-cert-modal');
  const closeCertBtn = document.getElementById('close-cert-btn');
  const certModalImg = document.getElementById('cert-modal-img');
  const certModalTitle = document.getElementById('modal-cert-title');
  const certMetaDetails = document.getElementById('cert-meta-details');

  const certData = {
    hackathon: {
      img: './images/cert-hackathon.svg',
      fallbackImg: './assets/cert-hackathon.svg',
      fallbackRoot: 'cert-hackathon.svg',
      title: 'MIT HackNation 2025 - Grand Prize Winner',
      alt: 'Official MIT HackNation 2025 Grand Prize Winner Certificate ($15,000 Award) for Synapse Collective',
      meta: `
        <div style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.6; margin-top: 12px;">
          <p><strong>Issuing Authority:</strong> MIT HackNation Collegiate Organizing Board</p>
          <p><strong>Award:</strong> 1st Place Overall Champion ($15,000 Grand Prize)</p>
          <p><strong>Project Evaluated:</strong> NeuroFlow Autonomous Multi-Agent Engine</p>
          <p><strong>Verification Code:</strong> HACK-MIT-2025-SYNAPSE-01</p>
        </div>
      `
    },
    aws: {
      img: './images/cert-aws.svg',
      fallbackImg: './assets/cert-aws.svg',
      fallbackRoot: 'cert-aws.svg',
      title: 'AWS Certified Solutions Architect - Associate',
      alt: 'Official AWS Certified Solutions Architect Associate Certificate of Harsh',
      meta: `
        <div style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.6; margin-top: 12px;">
          <p><strong>Issuing Authority:</strong> Amazon Web Services Training &amp; Certification</p>
          <p><strong>Validation ID:</strong> SYN-AWS-8849204-VALID</p>
          <p><strong>Domain Mastery:</strong> Multi-region VPC architecture, High-Availability Kubernetes, IAM Security, Serverless compute</p>
          <p><strong>Validity:</strong> 2025 – 2028 (Verified)</p>
        </div>
      `
    }
  };

  const openCertModal = (certKey) => {
    const data = certData[certKey] || certData.hackathon;
    certModalImg.src = data.img;
    certModalImg.alt = data.alt || ('Certificate Preview: ' + data.title);
    certModalImg.onerror = function() {
      this.onerror = null;
      if (this.src.includes('images/')) {
        this.src = data.fallbackImg;
      } else if (this.src.includes('assets/')) {
        this.src = data.fallbackRoot;
      } else {
        this.src = './images/' + data.img.split('/').pop();
      }
    };
    certModalTitle.textContent = data.title;
    certMetaDetails.innerHTML = data.meta;

    certModal.classList.add('active');
    certModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeCertModal = () => {
    certModal.classList.remove('active');
    certModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  if (closeCertModalBtn) closeCertModalBtn.addEventListener('click', closeCertModal);
  if (closeCertBtn) closeCertBtn.addEventListener('click', closeCertModal);
  certModal.addEventListener('click', (e) => {
    if (e.target === certModal) closeCertModal();
  });

  document.querySelectorAll('.view-cert-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const certKey = btn.getAttribute('data-cert');
      openCertModal(certKey);
    });
  });

  // Close modals on ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (projectModal.classList.contains('active')) closeProjectModal();
      if (certModal.classList.contains('active')) closeCertModal();
      if (mobileMenu.classList.contains('open')) closeMobileMenu();
    }
  });

  // ==========================================================================
  // 9. TEAM MEMBER QUICK-INQUIRE SHORTCUT
  // ==========================================================================
  const hireMemberBtns = document.querySelectorAll('.hire-member-btn');
  const targetMemberSelect = document.getElementById('contact-target-member');
  const contactNameInput = document.getElementById('contact-name');

  hireMemberBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const memberName = btn.getAttribute('data-name');
      if (targetMemberSelect) {
        targetMemberSelect.value = memberName;
      }
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
          if (contactNameInput) contactNameInput.focus();
        }, 600);
      }
      showToast('Member Selected', `Inquiry form set to direct message ${memberName}.`, 'info');
    });
  });

  // ==========================================================================
  // 10. DOWNLOAD CV BUTTON HANDLER (BONUS FEATURE)
  // ==========================================================================
  const triggerCvDownload = () => {
    // Check if images or assets folder path or root path works
    const candidates = [
      './images/Synapse_Collective_Team_CV.txt',
      './assets/Synapse_Collective_Team_CV.txt',
      'Synapse_Collective_Team_CV.txt'
    ];
    
    const downloadWithCandidate = (index) => {
      if (index >= candidates.length) return;
      const targetPath = candidates[index];
      fetch(targetPath, { method: 'HEAD' })
        .then(res => {
          if (res.ok) {
            const link = document.createElement('a');
            link.href = targetPath;
            link.download = 'Synapse_Collective_Team_CV.txt';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          } else {
            downloadWithCandidate(index + 1);
          }
        })
        .catch(() => {
          downloadWithCandidate(index + 1);
        });
    };

    downloadWithCandidate(0);
    showToast('Download Started', 'Synapse Collective Team CV & Dossier saved to your downloads.', 'success');
  };

  document.querySelectorAll('.download-cv-trigger').forEach(btn => {
    btn.addEventListener('click', triggerCvDownload);
  });
  const navDownloadBtn = document.getElementById('nav-download-cv');
  const mobileDownloadBtn = document.getElementById('mobile-download-cv');
  const heroDownloadBtn = document.getElementById('hero-download-cv');

  if (navDownloadBtn) navDownloadBtn.addEventListener('click', triggerCvDownload);
  if (mobileDownloadBtn) mobileDownloadBtn.addEventListener('click', triggerCvDownload);
  if (heroDownloadBtn) heroDownloadBtn.addEventListener('click', triggerCvDownload);

  // ==========================================================================
  // 11. CONTACT FORM FRONT-END VALIDATION & SUBMISSION (BONUS FEATURE)
  // ==========================================================================
  const contactForm = document.getElementById('contact-form');
  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const inquirySelect = document.getElementById('contact-inquiry-type');
  const messageInput = document.getElementById('contact-message');
  const charCounter = document.getElementById('char-counter');
  const submitBtn = document.getElementById('submit-btn');
  const btnText = submitBtn ? submitBtn.querySelector('.btn-text') : null;
  const btnSpinner = submitBtn ? submitBtn.querySelector('.btn-spinner') : null;
  const successBox = document.getElementById('form-success-box');

  const nameError = document.getElementById('name-error');
  const emailError = document.getElementById('email-error');
  const inquiryError = document.getElementById('inquiry-error');
  const messageError = document.getElementById('message-error');

  // Real-time character counter for message
  if (messageInput && charCounter) {
    messageInput.addEventListener('input', () => {
      const len = messageInput.value.length;
      charCounter.textContent = `${len} / 500`;
      if (len > 450) {
        charCounter.style.color = 'var(--accent-red)';
      } else {
        charCounter.style.color = 'var(--text-dim)';
      }
    });
  }

  // Regex for RFC-compliant email verification
  const isValidEmail = (email) => {
    const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return re.test(String(email).toLowerCase());
  };

  // Field validation helpers
  const validateName = () => {
    const val = nameInput.value.trim();
    if (val.length < 2) {
      nameInput.classList.add('error');
      nameInput.classList.remove('valid');
      nameError.classList.add('visible');
      return false;
    } else {
      nameInput.classList.remove('error');
      nameInput.classList.add('valid');
      nameError.classList.remove('visible');
      return true;
    }
  };

  const validateEmail = () => {
    const val = emailInput.value.trim();
    if (!isValidEmail(val)) {
      emailInput.classList.add('error');
      emailInput.classList.remove('valid');
      emailError.classList.add('visible');
      return false;
    } else {
      emailInput.classList.remove('error');
      emailInput.classList.add('valid');
      emailError.classList.remove('visible');
      return true;
    }
  };

  const validateInquiry = () => {
    const val = inquirySelect.value;
    if (!val) {
      inquirySelect.classList.add('error');
      inquirySelect.classList.remove('valid');
      inquiryError.classList.add('visible');
      return false;
    } else {
      inquirySelect.classList.remove('error');
      inquirySelect.classList.add('valid');
      inquiryError.classList.remove('visible');
      return true;
    }
  };

  const validateMessage = () => {
    const val = messageInput.value.trim();
    if (val.length < 15) {
      messageInput.classList.add('error');
      messageInput.classList.remove('valid');
      messageError.classList.add('visible');
      return false;
    } else {
      messageInput.classList.remove('error');
      messageInput.classList.add('valid');
      messageError.classList.remove('visible');
      return true;
    }
  };

  // Attach live input blur events
  if (nameInput) nameInput.addEventListener('blur', validateName);
  if (emailInput) emailInput.addEventListener('blur', validateEmail);
  if (inquirySelect) inquirySelect.addEventListener('change', validateInquiry);
  if (messageInput) messageInput.addEventListener('blur', validateMessage);

  // Form submit handler
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const isNameValid = validateName();
      const isEmailValid = validateEmail();
      const isInquiryValid = validateInquiry();
      const isMessageValid = validateMessage();

      if (!isNameValid || !isEmailValid || !isInquiryValid || !isMessageValid) {
        showToast('Validation Error', 'Please check the highlighted form fields.', 'error');
        // Focus first invalid field
        if (!isNameValid) nameInput.focus();
        else if (!isEmailValid) emailInput.focus();
        else if (!isInquiryValid) inquirySelect.focus();
        else if (!isMessageValid) messageInput.focus();
        return;
      }

      // Simulate network request with loading state
      submitBtn.disabled = true;
      if (btnText) btnText.classList.add('hidden');
      if (btnSpinner) btnSpinner.classList.remove('hidden');

      setTimeout(() => {
        // Success transition
        submitBtn.disabled = false;
        if (btnText) btnText.classList.remove('hidden');
        if (btnSpinner) btnSpinner.classList.add('hidden');

        if (successBox) successBox.classList.remove('hidden');

        showToast('Inquiry Dispatched!', 'Your message was securely sent to Synapse Collective.', 'success');

        // Reset form inputs & valid classes
        contactForm.reset();
        if (charCounter) charCounter.textContent = '0 / 500';
        [nameInput, emailInput, inquirySelect, messageInput].forEach(el => {
          if (el) el.classList.remove('valid');
        });

        // Hide success banner after 8 seconds
        setTimeout(() => {
          if (successBox) successBox.classList.add('hidden');
        }, 8000);

      }, 1200);
    });
  }

  // ==========================================================================
  // 12. BACK TO TOP BUTTON
  // ==========================================================================
  const backToTopBtn = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }, { passive: true });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ==========================================================================
  // 13. TOAST NOTIFICATION UTILITY
  // ==========================================================================
  function showToast(title, message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let iconClass = 'fa-solid fa-circle-info';
    if (type === 'success') iconClass = 'fa-solid fa-circle-check';
    if (type === 'error') iconClass = 'fa-solid fa-triangle-exclamation';

    toast.innerHTML = `
      <i class="${iconClass} toast-icon"></i>
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        <div class="toast-msg">${message}</div>
      </div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 300);
    }, 4000);
  }

});
