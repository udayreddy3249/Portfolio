/**
 * Single source of truth for every word on the site.
 * Content comes from Uday's LinkedIn profile export. Edit here — components only read from this file.
 */

export type Experience = {
  company: string;
  role: string;
  start: string;
  end: string;
  location: string;
  current?: boolean;
  bullets: string[];
};

export type Project = {
  slug: string;
  title: string;
  context: string; // where the work was done
  description: string;
  tags: string[];
  /** Cover motif drawn in code when no image is provided */
  motif: "rag" | "voice" | "agents" | "stream" | "services";
  /** Optional: path in /public, e.g. "/projects/my-app.webp" */
  image?: string;
  githubUrl?: string;
  liveUrl?: string;
};

export type SkillGroup = { name: string; skills: string[] };

export type Education = {
  school: string;
  degree: string;
  start: string;
  end: string;
};

export const profile = {
  name: "Uday Kumar M",
  firstName: "Uday",
  title: "Forward Deployed Engineer",
  titleAccent: "Applied AI & Agentic Systems",
  subheadline: "LLMs, RAG, AI Agents, API Integration · Python, Cloud & Enterprise Automation",
  location: "Greater Phoenix Area, Arizona",
  intro:
    "AI engineer building production-grade AI systems — RAG pipelines, real-time voice agents, and multi-agent orchestration — on top of solid backend and cloud engineering across fintech and supply chain.",

  links: {
    email: "umuncip@asu.edu",
    linkedin: "https://www.linkedin.com/in/udaykumarmuncip",
    // TODO: add GitHub URL — the GitHub icon stays hidden until this is set.
    github: null as string | null,
    resume: "/resume.pdf", // shown only when public/resume.pdf exists
  },

  photos: {
    graduation: {
      src: "/photos/graduation-night.jpg",
      width: 1600,
      height: 2400,
      alt: "Uday Kumar M walking along a lit campus path at night, carrying his graduation gown, cap, and roses",
    },
  },

  /** Bracket cards beside the 3D hero. Every line is drawn from the LinkedIn profile. */
  heroCards: [
    {
      title: "Applied AI",
      subtitle: "RAG · Voice agents · Multi-agent systems",
      body: "Designing retrieval pipelines, real-time voice agents, and multi-agent workflows that automate real enterprise processes.",
      tags: ["LLMs", "RAG", "LangChain", "MCP", "STT / TTS", "AI guardrails"],
    },
    {
      title: "Backend & Cloud",
      subtitle: "Scalable distributed systems",
      body: "Building FastAPI, Spring Boot, and Go services, Kafka event pipelines, and Kubernetes deployments on AWS and Azure.",
      tags: ["Python", "Java", "Go", "Kafka", "Kubernetes", "AWS / Azure"],
    },
  ],

  techCards: ["RAG", "Voice AI", "AI Agents", "MCP", "LangChain", "FastAPI", "Kubernetes"],

  about: {
    heading: ["Bridging machine learning", "and software engineering."],
    summary:
      "I'm an AI engineer with hands-on experience building production-grade machine learning systems, backend services, and cloud-native data solutions across fintech and supply chain domains. I design and deploy intelligent systems — RAG pipelines, voice agents, multi-modal AI systems, and agent orchestration frameworks — alongside ML pipelines processing 1M+ records, distributed microservices, REST APIs, ETL workflows, and cloud-native deployments on AWS and Azure.",
    closing:
      "I enjoy solving complex engineering challenges and building AI-driven solutions that create measurable business impact.",
    openTo: ["AI Engineer", "Machine Learning Engineer", "Backend Engineer", "Data Engineer"],
    highlights: [
      { label: "Currently", value: "Forward Deployed Engineer Intern", detail: "qBotica" },
      { label: "Previously", value: "Software Engineer", detail: "JPMorganChase" },
      { label: "Focus", value: "RAG · Voice AI · Multi-agent systems", detail: "Applied AI" },
      { label: "Scale", value: "1M+ records · 3x peak throughput", detail: "ML pipelines · Kafka pipelines" },
    ],
  },

  /** Big scroll-lit statement (words light up as you scroll). Paraphrases the LinkedIn summary. */
  statement:
    "I build AI that works in the real world. Retrieval pipelines that find the right answer. Voice agents that talk back in real time. Teams of agents that run whole workflows. All on backends engineered to scale.",

  /** Giant numbers for the pinned stats scene — every figure comes from the LinkedIn profile. */
  stats: [
    { value: "3x", label: "throughput under peak load", detail: "Kafka event-driven pipelines · JPMorganChase" },
    { value: "1M+", label: "records through ML pipelines", detail: "Production machine learning systems" },
    { value: "4", label: "professional certifications", detail: "Including Claude Certified Architect" },
  ],

  projects: [
    {
      slug: "enterprise-rag",
      title: "Enterprise RAG Assistants",
      context: "qBotica",
      description:
        "Retrieval-Augmented Generation pipelines that power context-aware AI assistants over enterprise knowledge, built to improve response relevance.",
      tags: ["RAG", "LLMs", "Python", "FastAPI"],
      motif: "rag",
    },
    {
      slug: "voice-agents",
      title: "Real-Time Voice Agents",
      context: "qBotica",
      description:
        "Conversational voice agents that chain speech-to-text, large language models, and text-to-speech for natural, real-time interactions.",
      tags: ["Voice AI", "STT", "TTS", "LLMs"],
      motif: "voice",
    },
    {
      slug: "multi-agent",
      title: "Multi-Agent Orchestration",
      context: "qBotica",
      description:
        "Multi-agent and multi-model workflows that coordinate specialized AI agents to automate complex business processes.",
      tags: ["AI Agents", "Multi-model", "MCP"],
      motif: "agents",
    },
    {
      slug: "event-driven-pipelines",
      title: "Event-Driven Supply Chain Pipelines",
      context: "JPMorganChase",
      description:
        "Kafka-based event-driven pipelines for supply chain operations, increasing throughput by 3x under peak load.",
      tags: ["Kafka", "Java", "Spring Boot", "Kubernetes"],
      motif: "stream",
    },
    {
      slug: "go-services",
      title: "High-Performance Go Services",
      context: "JPMorganChase",
      description:
        "Go microservices and gRPC services for high-performance internal platforms, containerized for zero-downtime deployments.",
      tags: ["Go", "gRPC", "Docker", "Helm"],
      motif: "services",
    },
    // TODO: add personal projects with image, githubUrl and liveUrl.
  ] satisfies Project[] as Project[],

  experience: [
    {
      company: "qBotica",
      role: "Forward Deployed Engineer (FDE) Intern",
      start: "Jul 2026",
      end: "Present",
      location: "Arizona, United States",
      current: true,
      bullets: [
        "Designed and developed enterprise Retrieval-Augmented Generation (RAG) pipelines to deliver context-aware AI assistants and improve response relevance.",
        "Built real-time AI voice agents integrating speech-to-text, large language models, and text-to-speech for natural conversational interactions.",
        "Implemented multi-agent orchestration and multi-model workflows to automate complex business processes and coordinate specialized AI agents.",
        "Developed Python and FastAPI services and REST APIs to integrate AI capabilities with enterprise applications and backend systems.",
        "Contributed to AI governance and context engineering initiatives, exploring runtime guardrails, observability, evaluation, and auditability for enterprise AI applications.",
        "Collaborated with cross-functional teams to develop, test, troubleshoot, and optimize AI solutions for real-world business use cases.",
      ],
    },
    {
      company: "Arizona State University",
      role: "AI Research Assistant",
      start: "Nov 2024",
      end: "Mar 2026",
      location: "Tempe, Arizona, United States",
      bullets: [
        "Contributed to AI-focused research and cloud-based engineering initiatives.",
        "Supported the development and evaluation of AI/ML solutions for research and engineering problems.",
        "Assisted with data processing, model experimentation, performance evaluation, and analysis of research results.",
        "Applied Python and machine learning frameworks to build, test, and improve AI-driven solutions.",
        "Supported cloud infrastructure, deployment workflows, and automation for research applications.",
        "Collaborated with faculty and research team members to investigate technical approaches, troubleshoot issues, and document findings.",
      ],
    },
    {
      company: "JPMorganChase",
      role: "Software Engineer (AI-Integrated Backend Engineer)",
      start: "Jun 2023",
      end: "Jul 2024",
      location: "India",
      bullets: [
        "Developed Java Spring Boot microservices and distributed backend systems supporting supply chain operations.",
        "Architected Kafka-based event-driven pipelines, increasing throughput by 3x under peak load.",
        "Built Go microservices and gRPC services for high-performance internal platforms.",
        "Containerized services using Docker, Helm, and Kubernetes, enabling zero-downtime deployments.",
        "Contributed to scalable cloud-native architectures with a strong focus on performance and reliability.",
      ],
    },
  ] satisfies Experience[] as Experience[],

  skills: [
    {
      name: "Generative AI & Agents",
      skills: [
        "LLMs",
        "RAG",
        "AI Agents",
        "Multi-agent orchestration",
        "Voice AI (STT / LLM / TTS)",
        "Multi-modal AI",
        "LangChain",
        "Model Context Protocol (MCP)",
        "Claude Code",
        "Context engineering",
        "AI guardrails & evaluation",
      ],
    },
    { name: "Machine Learning & MLOps", skills: ["Machine Learning", "ML pipelines", "Model experimentation & evaluation"] },
    { name: "Languages", skills: ["Python", "Java", "Go", "SQL"] },
    {
      name: "Backend & Distributed Systems",
      skills: ["FastAPI", "Spring Boot", "REST APIs", "gRPC", "Microservices", "Kafka / event-driven"],
    },
    { name: "Data Engineering", skills: ["ETL pipelines", "Data processing"] },
    { name: "Cloud & DevOps", skills: ["AWS", "Azure", "Docker", "Kubernetes", "Helm"] },
  ] satisfies SkillGroup[] as SkillGroup[],

  education: [
    {
      school: "Arizona State University",
      degree: "Master of Science in Data Science",
      start: "Aug 2024",
      end: "May 2026",
    },
    {
      school: "Sri Venkateswara College of Engineering, Tirupati",
      degree: "Bachelor's degree, Computer Science",
      start: "Jul 2020",
      end: "Apr 2024",
    },
  ] satisfies Education[] as Education[],

  graduationCaption: "M.S. Data Science · Arizona State University · 2026",

  certifications: [
    { name: "Claude Certified Architect (CCAF)", issuer: "Anthropic" },
    { name: "Google Cybersecurity", issuer: "Google" },
    { name: "Google IT Support Professional Certificate", issuer: "Google" },
    { name: "Google Data Analytics Professional Certificate", issuer: "Google" },
  ],

  contact: {
    heading: "Let's build something intelligent.",
    blurb: "Open to AI, machine learning, backend, and data engineering roles. The fastest way to reach me is email.",
  },
} as const;

export type Profile = typeof profile;
