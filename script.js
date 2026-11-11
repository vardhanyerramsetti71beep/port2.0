/**
 * THE PAPER GUN: A MONEY-GUN PORTFOLIO THAT SPRAYS VARDHAN'S WORK
 * Master Build Implementation
 * Pure Vanilla JavaScript & Physics Engine
 */

(function () {
  'use strict';

  // --- Sound Synthesizer (Web Audio API) ---
  class SoundFX {
    constructor() {
      this.ctx = null;
      this.enabled = true;
    }

    init() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    playSpray() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;

      // Noise buffer for realistic paper bill "whoosh/flick"
      const bufferSize = this.ctx.sampleRate * 0.05; // 50ms
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, now);
      filter.Q.setValueAtTime(3, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      // Subtle mechanical ratchet click
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(240, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.03);

      oscGain.gain.setValueAtTime(0.12, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

      osc.connect(oscGain);
      oscGain.connect(this.ctx.destination);

      noise.start(now);
      osc.start(now);
      noise.stop(now + 0.05);
      osc.stop(now + 0.04);
    }

    playDock() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(380, now);
      osc.frequency.exponentialRampToValueAtTime(160, now + 0.06);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.07);
    }

    playClean() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.18);

      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.2);
    }
  }

  const sfx = new SoundFX();

  // --- Paper Slips Dataset (Vardhan's Real Resume Details) ---
  const SLIPS_BY_CATEGORY = {
    work: [
      {
        id: 'task-cloud',
        category: 'work',
        type: 'big',
        word: 'TASK CLOUD',
        subline: 'PROJECT 01',
        kicker: 'PROJECT 01 · CLOUD ARCHITECTURE',
        title: 'Scalable Task & Data Management Cloud Portal',
        tech: ['Python', 'Flask REST API', 'React.js', 'MySQL', 'AWS EC2/S3', 'Docker'],
        description: 'Architected a responsive multi-tenant cloud portal with strict organization data isolation across tasks, assets, and audit logs. Engineered compound B-Tree indexes on (tenant_id, status) in MySQL, reducing query execution latency by 25% (18.4ms to 13.8ms). Decoupled binary storage into Amazon S3 with TLS 1.2+ security policies and containerized execution on AWS EC2 via Docker.',
        liveUrl: 'https://task-cloud-portal.vercel.app',
        githubUrl: 'https://github.com/vardhanyerramsetti71beep/task-cloud-portal'
      },
      {
        id: 'omnipulse',
        category: 'work',
        type: 'big',
        word: 'OMNIPULSE',
        subline: 'PROJECT 02',
        kicker: 'PROJECT 02 · ML & RETENTION ENGINE',
        title: 'OmniPulse Enterprise CLV & Retention Prediction Engine',
        tech: ['FastAPI', 'Scikit-learn', 'BG/NBD', 'Gamma-Gamma', 'Python'],
        description: 'Implemented Beta-Geometric/Negative Binomial (BG/NBD) probabilistic models to compute real-time customer vitality probability P(Alive). Integrated Gamma-Gamma monetary sub-models to forecast 12-month expected customer lifetime value (CLV) with sub-15ms prediction latency. Designed high-throughput in-memory REST inference endpoints with Pydantic contract validation.',
        liveUrl: 'https://omni-pulse-enterprise-clv-churn-int-teal.vercel.app',
        githubUrl: 'https://github.com/vardhanyerramsetti71beep/OmniPulse-Enterprise-CLV-Churn-Intelligence-Engine'
      },
      {
        id: 'music-rec',
        category: 'work',
        type: 'big',
        word: 'MUSIC REC',
        subline: 'PROJECT 03',
        kicker: 'PROJECT 03 · COMPUTER VISION & WEBRTC',
        title: 'Music Recommendation Based on Facial Expressions',
        tech: ['Python', 'Flask REST API', 'OpenCV', 'Scikit-learn', 'WebRTC'],
        description: 'Built an end-to-end computer vision pipeline analyzing facial expressions via live webcam video stream with >90% classification accuracy. Engineered high-throughput Flask RESTful APIs managing asynchronous model inference and targeted audio playlist dispatch. Optimized frame processing pipelines using OpenCV for low-latency facial landmark extraction.',
        liveUrl: 'https://music-recommending.vercel.app',
        githubUrl: 'https://github.com/vardhanyerramsetti71beep/music-recommending'
      },
      {
        id: '3d-manifold',
        category: 'work',
        type: 'big',
        word: '3D MANIFOLD',
        subline: 'PROJECT 04',
        kicker: 'PROJECT 04 · BIOMETRIC 3D WEBGL',
        title: '90-Day Body Transformation Biometric 3D Manifolds',
        tech: ['Python', 'Plotly 3D WebGL', 'Biometrics', 'HTML5/CSS3', 'JavaScript'],
        description: 'Developed a biometric analytics platform converting time-series physical measurements into interactive Plotly 3D WebGL surface meshes. Implemented mathematical data smoothing algorithms to track morphological variations across circumference, body fat %, and caloric intake timelines with interactive 3D spatial rotation controls.',
        liveUrl: 'https://90-days-body-transformation.vercel.app',
        githubUrl: 'https://github.com/vardhanyerramsetti71beep/90-Days-Body-Transformation'
      },
      {
        id: 'svt-tailors',
        category: 'work',
        type: 'big',
        word: 'SVT TAILORS',
        subline: 'PROJECT 05',
        kicker: 'PROJECT 05 · SERVERLESS ATELIER',
        title: 'S.V.T. Tailors Bespoke Atelier & 5-Stage Tracker',
        tech: ['Python Serverless', 'MySQL', 'PyMySQL', 'React.js', 'Tailwind CSS'],
        description: 'Built an end-to-end digital atelier configurator with dynamic parametric garment customizer (fabrics, collar, cuffs, measurements). Architected a 5-stage workshop state machine (Order Logged → Fabric Cut → Master Stitch → Steam Press → Ready) in MySQL with <35ms latency and public tracking portal.',
        liveUrl: 'https://svt-tailors.vercel.app',
        githubUrl: 'https://github.com/vardhanyerramsetti71beep/S.V.T.Tailors'
      },
      {
        id: 'ms-pickles',
        category: 'work',
        type: 'big',
        word: 'MS PICKLES',
        subline: 'PROJECT 06',
        kicker: 'PROJECT 06 · REGIONAL E-COMMERCE',
        title: 'MS Pickles Artisanal Andhra E-Commerce Platform',
        tech: ['JavaScript (ES6+)', 'HTML5/CSS3', 'Tailwind CSS', 'LocalStorage', 'Vercel'],
        description: 'Engineered a responsive, mobile-first artisanal food e-commerce platform with dynamic flavor filtering and localized regional UX. Implemented persistent client-side cart state management supporting real-time price calculations, quantity updates, and local storage hydration. Sub-second first contentful paint (FCP).',
        liveUrl: 'https://ms-pickles.vercel.app',
        githubUrl: 'https://github.com/vardhanyerramsetti71beep/MS-pickles'
      },
      {
        id: 'vignesh-traders',
        category: 'work',
        type: 'big',
        word: 'VT CAR CARE',
        subline: 'PROJECT 07',
        kicker: 'PROJECT 07 · BUSINESS SITE & SVG MOTION',
        title: 'Vignesh Traders Car Care & Detailing Studio Website',
        tech: ['HTML5/CSS3', 'JavaScript (ES6+)', 'Inline SVG', 'Scroll Animation', 'Vercel'],
        description: 'Designed and built the website for a car care and detailing studio in Vijayawada: 8 services, 3 fixed-price packages and a no-backend booking flow that hands off to WhatsApp. Built a scroll-driven SVG scene, drawn entirely in code, where a dusty car is foam-washed outside and steam-cleaned inside as the page scrolls. Zero dependencies and no build step, with reduced-motion and no-JavaScript fallbacks.',
        liveUrl: 'https://vignesh-traders.vercel.app',
        githubUrl: 'https://github.com/vardhanyerramsetti71beep/vignesh-traders'
      }
    ],
    about: [
      {
        id: 'vardhan-bio',
        category: 'about',
        type: 'big',
        word: 'VARDHAN',
        subline: 'FULL STACK DEV',
        kicker: 'ABOUT · PROFILE',
        title: 'Vardhan Yerramsetti — Python Full Stack & ML Engineer',
        tech: ['Python', 'AWS Certified', 'FastAPI/Flask', 'React.js', 'Data Science'],
        description: 'Results-driven Python Full Stack Developer and AWS Certified Cloud Practitioner with specialized expertise in Data Science, Machine Learning, and cloud microservices. Proficient in architecting high-throughput backend APIs and normalized relational databases with -25% query latency optimizations.',
        liveUrl: 'https://linkedin.com/in/vardhan-yerramsetti',
        githubUrl: 'https://github.com/vardhanyerramsetti71beep'
      },
      {
        id: 'deployments-metric',
        category: 'about',
        type: 'big',
        word: '9 DEPLOYS',
        subline: 'AWS & VERCEL',
        kicker: 'TRACK RECORD · PRODUCTION',
        title: '9 Verified Production Deployments',
        tech: ['AWS EC2', 'AWS S3', 'AWS RDS', 'Lambda', 'Vercel'],
        description: 'Backed by 9 live production deployments across AWS and Vercel. Proven capability to manage end-to-end release lifecycles from architecture design and database normalization to containerization and cloud orchestration.',
        liveUrl: 'https://github.com/vardhanyerramsetti71beep',
        githubUrl: 'https://github.com/vardhanyerramsetti71beep'
      },
      {
        id: 'latency-metric',
        category: 'about',
        type: 'big',
        word: '-25% SPEED',
        subline: 'B-TREE OPTIMIZATION',
        kicker: 'ENGINEERING · DATABASE OPTIMIZATION',
        title: 'Compound B-Tree Index Optimization',
        tech: ['MySQL', 'Compound B-Trees', 'Relational 3NF', 'Query Tuning'],
        description: 'Engineered compound B-Tree indexes on multi-tenant tenant isolation schemas, reducing MySQL query execution latency by 25% (from 18.4ms to 13.8ms) under high-throughput request loads.',
        liveUrl: 'https://task-cloud-portal.vercel.app',
        githubUrl: 'https://github.com/vardhanyerramsetti71beep/task-cloud-portal'
      },
      {
        id: 'aws-certification',
        category: 'about',
        type: 'big',
        word: 'AWS CERT',
        subline: 'CLOUD PRACTITIONER',
        kicker: 'CREDENTIALS · AMAZON WEB SERVICES',
        title: 'AWS Certified Cloud Practitioner (2023)',
        tech: ['AWS CCP', 'Cloud Foundations', 'EC2', 'S3', 'RDS', 'IAM'],
        description: 'Officially certified by Amazon Web Services (2023). Also holds AWS Academy Graduate: Cloud Foundations (2023), Android Enterprise Associate (Google 2022), and Cisco Networking Essentials (2022).',
        liveUrl: 'https://linkedin.com/in/vardhan-yerramsetti',
        githubUrl: 'https://github.com/vardhanyerramsetti71beep'
      },
      {
        id: 'education-btech',
        category: 'about',
        type: 'big',
        word: 'B.TECH CSE',
        subline: 'JNTU KAKINADA',
        kicker: 'ACADEMICS · COMPUTER SCIENCE',
        title: 'B.Tech in Computer Science and Engineering',
        tech: ['Data Structures', 'DBMS', 'Operating Systems', 'Computer Networks'],
        description: 'Jawaharlal Nehru Technological University (JNTU) Kakinada (2018–2026), CGPA: 6.5 / 10.0. Deep coursework in relational database management, algorithms, operating system internals, and networks.',
        liveUrl: 'https://linkedin.com/in/vardhan-yerramsetti',
        githubUrl: 'https://github.com/vardhanyerramsetti71beep'
      },
      {
        id: 'instakart-ops',
        category: 'about',
        type: 'big',
        word: 'FLIPKART OPS',
        subline: 'INSTAKART SERVICES',
        kicker: 'WORK EXPERIENCE · LOGISTICS',
        title: 'Operations & Logistics Associate — Instakart (Flipkart)',
        tech: ['Warehouse Operations', 'Inventory Databases', 'Telemetry Audits'],
        description: 'Supervised real-time warehouse operations, order dispatch processing, and inventory databases, maintaining 99% data integrity. Coordinated cross-functional workflows between ground teams and dispatch systems, driving a 15% increase in throughput.',
        liveUrl: 'https://linkedin.com/in/vardhan-yerramsetti',
        githubUrl: 'https://github.com/vardhanyerramsetti71beep'
      }
    ],
    process: [
      {
        id: 'proc-design',
        category: 'process',
        type: 'big',
        word: 'DESIGN',
        subline: 'STEP 01',
        kicker: 'ENGINEERING PROCESS · STEP 01',
        title: 'Normalized Schema & Architecture Design',
        tech: ['Relational 3NF', 'Microservices', 'RESTful Contracts', 'Pydantic'],
        description: 'Translating product specs into resilient 3NF database models, entity-relationship diagrams, and strict API schemas before touching code.',
        liveUrl: 'https://task-cloud-portal.vercel.app',
        githubUrl: 'https://github.com/vardhanyerramsetti71beep'
      },
      {
        id: 'proc-model',
        category: 'process',
        type: 'big',
        word: 'MODEL',
        subline: 'STEP 02',
        kicker: 'ENGINEERING PROCESS · STEP 02',
        title: 'Machine Learning & Mathematical Sub-Models',
        tech: ['BG/NBD', 'Gamma-Gamma', 'OpenCV', 'Scikit-learn', 'FastAPI'],
        description: 'Implementing probabilistic modeling, computer vision pipelines, and asynchronous inference services benchmarked for sub-15ms response latency.',
        liveUrl: 'https://omni-pulse-enterprise-clv-churn-int-teal.vercel.app',
        githubUrl: 'https://github.com/vardhanyerramsetti71beep'
      },
      {
        id: 'proc-deploy',
        category: 'process',
        type: 'big',
        word: 'DEPLOY',
        subline: 'STEP 03',
        kicker: 'ENGINEERING PROCESS · STEP 03',
        title: 'Containerization & Cloud Infrastructure',
        tech: ['Docker', 'AWS EC2/S3', 'TLS 1.2+', 'Vercel', 'CI/CD'],
        description: 'Containerizing services via Docker, setting up encrypted binary storage on AWS S3 with TLS 1.2+, and delivering edge-rendered reactive web apps on Vercel.',
        liveUrl: 'https://task-cloud-portal.vercel.app',
        githubUrl: 'https://github.com/vardhanyerramsetti71beep'
      },
      {
        id: 'proc-scale',
        category: 'process',
        type: 'big',
        word: 'SCALE',
        subline: 'STEP 04',
        kicker: 'ENGINEERING PROCESS · STEP 04',
        title: 'Telemetry Audits & Latency Optimization',
        tech: ['Compound B-Tree', 'Query Profiling', 'Sub-second FCP', 'Optimization'],
        description: 'Analyzing runtime query execution plans, establishing compound B-Tree indexes, eliminating bottlenecks, and maintaining 99% data integrity.',
        liveUrl: 'https://svt-tailors.vercel.app',
        githubUrl: 'https://github.com/vardhanyerramsetti71beep'
      }
    ],
    contact: [
      {
        id: 'contact-email',
        category: 'contact',
        type: 'big',
        word: 'EMAIL ME',
        subline: 'vardhanyerramsetti71',
        kicker: 'CONNECT · DIRECT INBOX',
        title: 'vardhanyerramsetti71@gmail.com',
        tech: ['Email', 'Inquiries', 'Full Stack Roles', 'Consulting'],
        description: 'Available for full-time engineering opportunities in Python backend development, cloud microservices, and machine learning pipelines. Drop me a note!',
        liveUrl: 'mailto:vardhanyerramsetti71@gmail.com',
        githubUrl: 'https://linkedin.com/in/vardhan-yerramsetti'
      },
      {
        id: 'contact-github',
        category: 'contact',
        type: 'big',
        word: 'GITHUB',
        subline: 'vardhanyerramsetti71beep',
        kicker: 'CODEBASE · GITHUB PROFILE',
        title: 'github.com/vardhanyerramsetti71beep',
        tech: ['GitHub', 'Open Source', 'Microservices', 'Repositories'],
        description: 'Browse through 19+ repositories featuring clean Python microservices, WebGL dashboards, and production full stack applications with active commit histories.',
        liveUrl: 'https://github.com/vardhanyerramsetti71beep',
        githubUrl: 'https://github.com/vardhanyerramsetti71beep'
      },
      {
        id: 'contact-linkedin',
        category: 'contact',
        type: 'big',
        word: 'LINKEDIN',
        subline: 'vardhan-yerramsetti',
        kicker: 'NETWORK · LINKEDIN PROFILE',
        title: 'linkedin.com/in/vardhan-yerramsetti',
        tech: ['LinkedIn', 'Professional Network', 'Experience', 'Recommendations'],
        description: 'Connect on LinkedIn for project case studies, technical discussions, and professional networking.',
        liveUrl: 'https://linkedin.com/in/vardhan-yerramsetti',
        githubUrl: 'https://linkedin.com/in/vardhan-yerramsetti'
      },
      {
        id: 'contact-phone',
        category: 'contact',
        type: 'big',
        word: 'CALL ME',
        subline: '+91 7386033417',
        kicker: 'CONTACT · DIRECT PHONE',
        title: '+91 7386033417',
        tech: ['Direct Call', 'WhatsApp', 'Andhra Pradesh, India'],
        description: 'Direct phone line for interview scheduling, technical discussions, and urgent inquiries.',
        liveUrl: 'tel:+917386033417',
        githubUrl: 'https://linkedin.com/in/vardhan-yerramsetti'
      }
    ]
  };

  // Small Tag Slips (Every 4th shot)
  const TAG_SLIPS = [
    { id: 'tag-python', word: 'PYTHON', kicker: 'SKILL · BACKEND', title: 'Python 3.x (Flask, FastAPI, Django)', description: 'Primary language for high-throughput microservices, predictive algorithms, and database pipelines.', tech: ['Python', 'FastAPI', 'Flask', 'Django'] },
    { id: 'tag-aws', word: 'AWS', kicker: 'SKILL · CLOUD', title: 'Amazon Web Services (AWS)', description: 'Certified Cloud Practitioner: EC2, S3, RDS, Lambda, IAM, VPC, and serverless architectures.', tech: ['AWS', 'EC2', 'S3', 'Lambda', 'RDS'] },
    { id: 'tag-docker', word: 'DOCKER', kicker: 'SKILL · DEVOPS', title: 'Docker Containerization', description: 'Containerized deployment pipelines with isolated dependencies and cloud orchestrations.', tech: ['Docker', 'Containers', 'DevOps', 'CI/CD'] },
    { id: 'tag-fastapi', word: 'FASTAPI', kicker: 'SKILL · API', title: 'FastAPI High-Speed REST', description: 'Async RESTful APIs with in-memory caching and Pydantic validation contracts.', tech: ['FastAPI', 'Pydantic', 'AsyncIO', 'REST'] },
    { id: 'tag-react', word: 'REACT', kicker: 'SKILL · FRONTEND', title: 'React.js 19 & Next.js', description: 'Component-driven reactive user interfaces with Tailwind CSS and dynamic state management.', tech: ['React.js 19', 'Next.js', 'Tailwind CSS'] },
    { id: 'tag-mysql', word: 'MYSQL', kicker: 'SKILL · DATABASE', title: 'MySQL & Relational 3NF', description: 'Normalized database architectures with compound B-Tree indexes reducing query latency by 25%.', tech: ['MySQL', 'PyMySQL', '3NF', 'B-Tree Indexing'] },
    { id: 'tag-opencv', word: 'OPENCV', kicker: 'SKILL · COMPUTER VISION', title: 'OpenCV & Computer Vision', description: 'Real-time video frame processing, landmark extraction, and video pipeline optimization.', tech: ['OpenCV', 'WebRTC', 'Computer Vision'] },
    { id: 'tag-sklearn', word: 'SKLEARN', kicker: 'SKILL · MACHINE LEARNING', title: 'Scikit-Learn & ML Models', description: 'Probabilistic modeling (BG/NBD, Gamma-Gamma) and classification algorithms.', tech: ['Scikit-learn', 'BG/NBD', 'Gamma-Gamma'] },
    { id: 'tag-2026', word: '2026', kicker: 'EDITION · CURRENT', title: 'Portfolio 2026 Edition', description: 'Interactive money-gun portfolio showcasing Vardhan Yerramsetti’s engineering projects.', tech: ['Vanilla JS', 'SVG 3D', 'Web Audio', 'CSS3'] }
  ];

  // Paper Palette (handed out in exact order from prompt specifications)
  const PALETTE = [
    { bg: '#ff5fa8', text: '#111111' }, // pink
    { bg: '#ffd23f', text: '#111111' }, // yellow
    { bg: '#3f6bff', text: '#ffffff' }, // blue
    { bg: '#3fe0a8', text: '#111111' }, // mint
    { bg: '#ff8a2a', text: '#ffffff' }, // orange
    { bg: '#8b5cff', text: '#ffffff' }, // purple
    { bg: '#c8f03c', text: '#111111' }, // lime
    { bg: '#5cc8ff', text: '#111111' }, // sky
    { bg: '#1c1c22', text: '#ffffff' }, // black
    { bg: '#ffffff', text: '#111111', border: '1px solid #d4d4d8' }  // white
  ];

  // Persistent color assignment registry
  const slipColorMap = new Map();
  let paletteCursor = 0;

  function getColorForSlip(id) {
    if (!slipColorMap.has(id)) {
      const color = PALETTE[paletteCursor % PALETTE.length];
      paletteCursor++;
      slipColorMap.set(id, color);
    }
    return slipColorMap.get(id);
  }

  // --- State Variables ---
  let totalSprayedCount = 0;
  let activeCategory = 'work';
  let isFiring = false;
  let fireIntervalId = null;
  let sprayCounter = 0; // Tracks every 4th shot for tags
  let tagIndex = 0;
  let catIndices = { work: 0, about: 0, process: 0, contact: 0 };

  // Tray elements registry: Map<id, HTMLElement>
  const trayDockedMap = new Map();

  // Active flying slips array for physics loop
  const flyingSlips = [];

  // --- DOM Elements ---
  const slipsFlightLayer = document.getElementById('slipsFlightLayer');
  const sprayBtn = document.getElementById('sprayBtn');
  const cleanBtn = document.getElementById('cleanBtn');
  const counterNumber = document.getElementById('counterNumber');
  const trayCountTag = document.getElementById('trayCountTag');
  const trayGrid = document.getElementById('trayGrid');
  const trayEmptyHint = document.getElementById('trayEmptyHint');
  const soundToggle = document.getElementById('soundToggle');
  const gunInteractiveWrapper = document.getElementById('gunInteractiveWrapper');
  const gunRecoilGroup = document.getElementById('gunRecoilGroup');
  const gunTriggerGroup = document.getElementById('gunTriggerGroup');
  const gunSlot = document.getElementById('gunSlot');
  const navButtons = document.querySelectorAll('.nav-cat-btn');

  // Detail Card Elements
  const detailCard = document.getElementById('detailCard');
  const detailDot = document.getElementById('detailDot');
  const detailKicker = document.getElementById('detailKicker');
  const detailTitle = document.getElementById('detailTitle');
  const detailTechTags = document.getElementById('detailTechTags');
  const detailDescription = document.getElementById('detailDescription');
  const detailLiveBtn = document.getElementById('detailLiveBtn');
  const detailRepoBtn = document.getElementById('detailRepoBtn');
  const closeDetailBtn = document.getElementById('closeDetailBtn');

  // --- Helper: Get Ejection Slot Screen Coordinates ---
  function getSlotCoordinates() {
    if (!gunSlot) {
      return { x: window.innerWidth * 0.65, y: window.innerHeight * 0.35 };
    }
    const rect = gunSlot.getBoundingClientRect();
    return {
      x: rect.left + rect.width * 0.5,
      y: rect.top + rect.height * 0.5
    };
  }

  // --- Gun Kick & Recoil Animation ---
  function triggerGunRecoil() {
    if (!gunRecoilGroup) return;
    gunRecoilGroup.classList.remove('recoil-active');
    // Force DOM reflow to re-trigger transition
    void gunRecoilGroup.offsetWidth;
    gunRecoilGroup.classList.add('recoil-active');

    if (gunTriggerGroup) {
      gunTriggerGroup.classList.add('trigger-pulled');
    }

    setTimeout(() => {
      gunRecoilGroup.classList.remove('recoil-active');
      if (gunTriggerGroup) {
        gunTriggerGroup.classList.remove('trigger-pulled');
      }
    }, 90);
  }

  // --- Detail Card Display ---
  function showDetailCard(slipData, colorObj) {
    if (!detailCard || !slipData) return;

    detailDot.style.backgroundColor = colorObj ? colorObj.bg : '#ff3b3f';
    detailKicker.textContent = slipData.kicker || slipData.subline || 'DETAIL';
    detailTitle.textContent = slipData.title || slipData.word;
    detailDescription.textContent = slipData.description || 'Verified production milestone.';

    // Populate Tech Tags
    detailTechTags.innerHTML = '';
    const tags = slipData.tech || [slipData.category || 'Portfolio'];
    tags.forEach(tech => {
      const pill = document.createElement('span');
      pill.className = 'tech-tag-pill';
      pill.textContent = tech;
      detailTechTags.appendChild(pill);
    });

    // Handle Live & Repo Links
    if (slipData.liveUrl) {
      detailLiveBtn.href = slipData.liveUrl;
      detailLiveBtn.style.display = 'inline-flex';
      if (slipData.liveUrl.startsWith('mailto:')) {
        detailLiveBtn.querySelector('span:first-child').textContent = 'Send Email';
      } else if (slipData.liveUrl.startsWith('tel:')) {
        detailLiveBtn.querySelector('span:first-child').textContent = 'Call Phone';
      } else {
        detailLiveBtn.querySelector('span:first-child').textContent = 'Live App';
      }
    } else {
      detailLiveBtn.style.display = 'none';
    }

    if (slipData.githubUrl) {
      detailRepoBtn.href = slipData.githubUrl;
      detailRepoBtn.style.display = 'inline-flex';
    } else {
      detailRepoBtn.style.display = 'none';
    }

    detailCard.classList.remove('hidden');
  }

  function hideDetailCard() {
    if (detailCard) {
      detailCard.classList.add('hidden');
    }
  }

  closeDetailBtn.addEventListener('click', hideDetailCard);

  // --- Tray Management ---
  function updateTrayCounts() {
    const count = trayDockedMap.size;
    trayCountTag.textContent = `${count} ${count === 1 ? 'item' : 'items'}`;
    if (count > 0) {
      trayEmptyHint.classList.add('hidden');
    } else {
      trayEmptyHint.classList.remove('hidden');
    }
  }

  function createTrayItemElement(slipData, colorObj) {
    const el = document.createElement('div');
    el.className = `tray-slip type-${slipData.type || 'big'}`;
    el.style.backgroundColor = colorObj.bg;
    el.style.color = colorObj.text;
    if (colorObj.border) {
      el.style.border = colorObj.border;
    }

    const wordEl = document.createElement('div');
    wordEl.className = 'tray-slip-word';
    wordEl.textContent = slipData.word;
    el.appendChild(wordEl);

    if (slipData.type !== 'tag' && slipData.subline) {
      const subEl = document.createElement('div');
      subEl.className = 'tray-slip-subline';
      subEl.textContent = slipData.subline;
      el.appendChild(subEl);
    }

    el.addEventListener('click', () => {
      showDetailCard(slipData, colorObj);
    });

    return el;
  }

  function getDockTargetCoordinates(slipId, slipData, colorObj) {
    // If slip already exists in tray, target its existing element
    if (trayDockedMap.has(slipId)) {
      const existingEl = trayDockedMap.get(slipId);
      const rect = existingEl.getBoundingClientRect();
      return {
        x: rect.left + rect.width * 0.5,
        y: rect.top + rect.height * 0.5,
        isExisting: true,
        element: existingEl
      };
    }

    // Otherwise, create and append a placeholder element to tray to measure its docking coordinate
    const placeholder = createTrayItemElement(slipData, colorObj);
    placeholder.style.visibility = 'hidden';
    trayGrid.appendChild(placeholder);
    const rect = placeholder.getBoundingClientRect();
    const target = {
      x: rect.left + rect.width * 0.5,
      y: rect.top + rect.height * 0.5,
      isExisting: false,
      element: placeholder
    };
    return target;
  }

  // --- Physics Engine & Slip Lifecycle ---
  class FlyingSlip {
    constructor(slipData, specificTargetCategory = null) {
      this.data = slipData;
      this.color = getColorForSlip(slipData.id);
      this.isTag = slipData.type === 'tag';

      // Dimensions in flight
      this.flightWidth = this.isTag ? 88 : 220;
      this.flightHeight = this.isTag ? 64 : 84;

      // Origin at Gun Slot
      const slot = getSlotCoordinates();
      this.x = slot.x;
      this.y = slot.y;

      // Ejection trajectory: 150° to 190° at random speed (14 to 22 px/frame)
      const angleDeg = 150 + Math.random() * 40; // 150° - 190°
      const angleRad = (angleDeg * Math.PI) / 180;
      const speed = 14 + Math.random() * 8; // 14 to 22

      this.vx = Math.cos(angleRad) * speed;
      this.vy = Math.sin(angleRad) * speed;

      // 3D Rotations & bill flutter
      this.rotZ = (Math.random() - 0.5) * 50;
      this.rotZSpeed = (Math.random() - 0.5) * 3;
      this.flutterPhase = Math.random() * Math.PI * 2;
      this.rotX = 0;

      // Flight time: 0.7s to 1.1s (42 to 66 frames @ 60fps)
      this.flightDuration = 42 + Math.floor(Math.random() * 24);
      this.currentFrame = 0;
      this.state = 'flying'; // 'flying' -> 'gliding' -> 'docked'

      // Glide phase parameters
      this.glideDuration = 42; // ~0.7s ease-out
      this.glideFrame = 0;
      this.glideStartX = 0;
      this.glideStartY = 0;
      this.glideStartRotZ = 0;
      this.glideStartRotX = 0;
      this.dockTarget = null;

      // DOM Element creation
      this.el = document.createElement('div');
      this.el.className = `flying-slip type-${this.data.type || 'big'}`;
      this.el.style.backgroundColor = this.color.bg;
      this.el.style.color = this.color.text;
      if (this.color.border) {
        this.el.style.border = this.color.border;
      }

      const wordSpan = document.createElement('div');
      wordSpan.className = 'slip-word';
      wordSpan.textContent = this.data.word;

      // Font sizing logic from prompt (36% height; 30% for >9 letters)
      if (!this.isTag) {
        if (this.data.word.length > 9) {
          wordSpan.style.fontSize = `${this.flightHeight * 0.30}px`;
        } else {
          wordSpan.style.fontSize = `${this.flightHeight * 0.36}px`;
        }
      }

      this.el.appendChild(wordSpan);

      if (!this.isTag && this.data.subline) {
        const subSpan = document.createElement('div');
        subSpan.className = 'slip-subline';
        subSpan.textContent = this.data.subline;
        this.el.appendChild(subSpan);
      }

      slipsFlightLayer.appendChild(this.el);
      this.updateDOMTransform();
    }

    updateDOMTransform(scale = 1, opacity = 1) {
      const cx = this.x - (this.flightWidth * scale) / 2;
      const cy = this.y - (this.flightHeight * scale) / 2;
      this.el.style.transform = `translate3d(${cx}px, ${cy}px, 0px) rotateZ(${this.rotZ}deg) rotateX(${this.rotX}deg) scale(${scale})`;
      this.el.style.opacity = opacity;
    }

    step() {
      if (this.state === 'flying') {
        this.currentFrame++;

        // Flight physics per master specifications:
        // Gravity +0.28, horizontal drag x0.975, fall speed capped at 5
        this.vy += 0.28;
        this.vx *= 0.975;
        if (this.vy > 5) this.vy = 5;

        // Sideways flutter (sin wave x 1.4px)
        this.flutterPhase += 0.16;
        const flutter = Math.sin(this.flutterPhase) * 1.4;

        this.x += this.vx + flutter;
        this.y += this.vy;

        // Spin & 3D bill flip (+/- 55 deg on a sine)
        this.rotZ += this.rotZSpeed;
        this.rotX = Math.sin(this.flutterPhase * 1.25) * 55;

        this.updateDOMTransform(1, 1);

        // Check if flight time completed, transition to glide
        if (this.currentFrame >= this.flightDuration) {
          this.startGlide();
        }
      } else if (this.state === 'gliding') {
        this.glideFrame++;
        const t = Math.min(1, this.glideFrame / this.glideDuration);

        // Ease-out cubic: 1 - (1 - t)^3
        const easeOut = 1 - Math.pow(1 - t, 3);

        // Interpolate position to dock target
        const curX = this.glideStartX + (this.dockTarget.x - this.glideStartX) * easeOut;
        const curY = this.glideStartY + (this.dockTarget.y - this.glideStartY) * easeOut;

        // Interpolate rotations back to 0
        this.rotZ = this.glideStartRotZ * (1 - easeOut);
        this.rotX = this.glideStartRotX * (1 - easeOut);

        // Scale down to tray slip size
        const targetScale = this.isTag ? 0.9 : 0.65;
        const scale = 1 - (1 - targetScale) * easeOut;

        // If duplicate, fade out during final 35% of glide
        let opacity = 1;
        if (this.dockTarget.isExisting && t > 0.65) {
          opacity = 1 - (t - 0.65) / 0.35;
        }

        this.x = curX;
        this.y = curY;
        this.updateDOMTransform(scale, opacity);

        if (t >= 1) {
          this.finishDock();
        }
      }
    }

    startGlide() {
      this.state = 'gliding';
      this.glideStartX = this.x;
      this.glideStartY = this.y;
      this.glideStartRotZ = this.rotZ;
      this.glideStartRotX = this.rotX;

      // Calculate dock target in tray
      this.dockTarget = getDockTargetCoordinates(this.data.id, this.data, this.color);
    }

    finishDock() {
      this.state = 'docked';
      // Remove flying element from overlay layer
      if (this.el.parentNode) {
        this.el.parentNode.removeChild(this.el);
      }

      sfx.playDock();

      if (this.dockTarget.isExisting) {
        // Duplicate twin arrived: trigger 8px hop on existing tray slip
        const existingEl = this.dockTarget.element;
        existingEl.classList.remove('twin-hopping');
        void existingEl.offsetWidth;
        existingEl.classList.add('twin-hopping');
        setTimeout(() => {
          existingEl.classList.remove('twin-hopping');
        }, 360);
      } else {
        // Brand new slip docked into tray: make visible & store in registry
        const newEl = this.dockTarget.element;
        newEl.style.visibility = 'visible';
        trayDockedMap.set(this.data.id, newEl);
        updateTrayCounts();
      }
    }
  }

  // Global Physics Animation Loop
  function animationLoop() {
    for (let i = flyingSlips.length - 1; i >= 0; i--) {
      const slip = flyingSlips[i];
      slip.step();
      if (slip.state === 'docked') {
        flyingSlips.splice(i, 1);
      }
    }
    requestAnimationFrame(animationLoop);
  }
  requestAnimationFrame(animationLoop);

  // --- Fire One Slip Function ---
  function fireSlip(forcedCategory = null) {
    sprayCounter++;
    totalSprayedCount++;

    // Increment Counter display with pulse bump
    counterNumber.textContent = totalSprayedCount;
    counterNumber.classList.remove('bump');
    void counterNumber.offsetWidth;
    counterNumber.classList.add('bump');

    // Trigger Gun Recoil & Web Audio Sound
    triggerGunRecoil();
    sfx.playSpray();

    let slipData;

    // Rule: Every fourth shot is a tag slip
    if (sprayCounter % 4 === 0 && !forcedCategory) {
      slipData = TAG_SLIPS[tagIndex % TAG_SLIPS.length];
      tagIndex++;
      slipData = Object.assign({}, slipData, { type: 'tag' });
    } else {
      const cat = forcedCategory || activeCategory;
      const catList = SLIPS_BY_CATEGORY[cat] || SLIPS_BY_CATEGORY.work;
      const idx = catIndices[cat] % catList.length;
      catIndices[cat]++;
      slipData = Object.assign({}, catList[idx], { type: 'big' });
    }

    const slip = new FlyingSlip(slipData);
    flyingSlips.push(slip);
  }

  // --- Burst Fire Routine (Used on initial load and category clicks) ---
  function fireBurst(count, intervalMs, category = null, onFirstFire = null) {
    let fired = 0;
    const interval = setInterval(() => {
      fireSlip(category);
      if (fired === 0 && onFirstFire) {
        onFirstFire();
      }
      fired++;
      if (fired >= count) {
        clearInterval(interval);
      }
    }, intervalMs);
  }

  // --- Continuous Hold-to-Spray Controls (85ms per shot) ---
  function startContinuousSpray() {
    if (isFiring) return;
    isFiring = true;
    sprayBtn.classList.add('is-pressed');
    sfx.init();

    fireSlip();
    fireIntervalId = setInterval(() => {
      fireSlip();
    }, 85);
  }

  function stopContinuousSpray() {
    if (!isFiring) return;
    isFiring = false;
    sprayBtn.classList.remove('is-pressed');
    if (fireIntervalId) {
      clearInterval(fireIntervalId);
      fireIntervalId = null;
    }
  }

  // --- Event Listeners: Spray Button Hold ---
  sprayBtn.addEventListener('mousedown', (e) => {
    e.preventDefault();
    startContinuousSpray();
  });
  window.addEventListener('mouseup', stopContinuousSpray);

  // Mobile Touch Support for Spray Button
  sprayBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    startContinuousSpray();
  }, { passive: false });
  window.addEventListener('touchend', stopContinuousSpray);

  // --- Gun Click & Hold to Spray ---
  gunInteractiveWrapper.addEventListener('mousedown', (e) => {
    e.preventDefault();
    startContinuousSpray();
  });

  gunInteractiveWrapper.addEventListener('touchstart', (e) => {
    e.preventDefault();
    startContinuousSpray();
  }, { passive: false });

  // --- Spacebar Press & Hold to Spray ---
  window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && !e.repeat && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
      e.preventDefault();
      startContinuousSpray();
    }
  });

  window.addEventListener('keyup', (e) => {
    if (e.code === 'Space') {
      e.preventDefault();
      stopContinuousSpray();
    }
  });

  // --- Clean Up Button: Fades every slip out and empties the tray ---
  cleanBtn.addEventListener('click', () => {
    sfx.playClean();
    cleanBtn.classList.add('is-pressed');
    setTimeout(() => cleanBtn.classList.remove('is-pressed'), 120);

    // Fade out and remove flying slips
    flyingSlips.forEach(slip => {
      if (slip.el && slip.el.parentNode) {
        slip.el.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
        slip.el.style.opacity = '0';
        setTimeout(() => {
          if (slip.el.parentNode) slip.el.parentNode.removeChild(slip.el);
        }, 250);
      }
    });
    flyingSlips.length = 0;

    // Fade out and empty tray
    const trayItems = Array.from(trayGrid.children);
    trayItems.forEach(item => {
      item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      item.style.opacity = '0';
      item.style.transform = 'scale(0.85)';
    });

    setTimeout(() => {
      trayGrid.innerHTML = '';
      trayDockedMap.clear();
      updateTrayCounts();
    }, 320);

    hideDetailCard();
  });

  // --- Navigation Category Links (Work, About, Process, Contact) ---
  // "Each one fires a short burst of only its own slips and shows the first one in the detail card."
  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      navButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const cat = btn.getAttribute('data-category');
      activeCategory = cat;

      const catItems = SLIPS_BY_CATEGORY[cat];
      const firstItem = catItems ? catItems[0] : null;

      // Fire a short burst of 5 slips from this category (95ms apart)
      fireBurst(5, 95, cat, () => {
        if (firstItem) {
          const color = getColorForSlip(firstItem.id);
          showDetailCard(firstItem, color);
        }
      });
    });
  });

  // --- Sound FX Toggle ---
  soundToggle.addEventListener('click', () => {
    sfx.enabled = !sfx.enabled;
    const icon = soundToggle.querySelector('.sound-icon');
    if (sfx.enabled) {
      icon.textContent = '🔊';
      soundToggle.title = 'Mute Sound';
      sfx.playDock();
    } else {
      icon.textContent = '🔇';
      soundToggle.title = 'Unmute Sound';
    }
  });

  // --- Initial Page Load Routine ---
  // "On load, after 0.7s, the gun fires a burst of 20 slips, 95ms apart."
  window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
      fireBurst(20, 95, 'work', () => {
        const firstProject = SLIPS_BY_CATEGORY.work[0];
        const color = getColorForSlip(firstProject.id);
        showDetailCard(firstProject, color);
      });
    }, 700);
  });

  // Re-layout safety on window resize
  window.addEventListener('resize', () => {
    // Dock coordinates adapt on subsequent frames
  });

})();
