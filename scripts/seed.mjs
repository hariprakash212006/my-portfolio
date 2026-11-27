import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  // 1. Admin User
  const adminEmail = "admin@portfolio.com";
  const existingUser = await prisma.user.findUnique({ where: { email: adminEmail } });

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash("adminpassword123", salt);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash,
      name: "Hariharan",
    },
    create: {
      email: adminEmail,
      name: "Hariharan",
      passwordHash,
      role: "ADMIN",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    },
  });
  console.log(`✅ Admin user ready: ${admin.email} (Password: adminpassword123)`);

  // 2. Profile
  await prisma.profile.deleteMany();
  await prisma.profile.create({
    data: {
      name: "Hariharan",
      title: "Senior Full-Stack Engineer & Cloud Architect",
      shortBio:
        "Specializing in high-throughput distributed systems, modern React/Next.js architectures, and resilient cloud infrastructures. Passionate about clean code, performance engineering, and user-centric software design.",
      fullBio:
        "I am a results-oriented Senior Full-Stack Engineer with over 6 years of experience architecting and shipping mission-critical web applications. Having led frontend and backend engineering teams across hyper-growth startups and enterprise environments, I specialize in combining robust distributed backend systems (Node.js, Go, PostgreSQL, Redis) with ultra-responsive, accessible web interfaces built in TypeScript, Next.js, and Tailwind CSS.\n\nMy philosophy balances rigorous engineering craftsmanship with rapid product delivery. Outside of core product engineering, I contribute to open-source developer tooling, mentor aspiring developers, and explore emerging paradigms in AI-assisted developer workflows and cloud-native observability.",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
      location: "San Francisco, CA / Hybrid Remote",
      email: "hariharan.eng@example.com",
      phone: "+1 (555) 382-9014",
      availability: "Open to High-Impact Opportunities & Advisory",
      yearsOfExperience: 6,
      completedProjects: 24,
      certificationsCount: 6,
      technologiesCount: 35,
      resumeUrl: "https://example.com/resumes/hariharan_senior_software_engineer.pdf",
      resumeName: "Hariharan_Senior_Software_Engineer_Resume.pdf",
      resumeUpdatedAt: new Date(),
    },
  });
  console.log("✅ Profile created");

  // 3. Technologies
  await prisma.projectTechnology.deleteMany();
  await prisma.technology.deleteMany();

  const technologiesData = [
    { name: "Next.js", slug: "nextjs", color: "#000000", icon: "Layers" },
    { name: "TypeScript", slug: "typescript", color: "#3178C6", icon: "Code2" },
    { name: "React", slug: "react", color: "#61DAFB", icon: "Atom" },
    { name: "Node.js", slug: "nodejs", color: "#339933", icon: "Server" },
    { name: "PostgreSQL", slug: "postgresql", color: "#4169E1", icon: "Database" },
    { name: "Prisma ORM", slug: "prisma", color: "#2D3748", icon: "Workflow" },
    { name: "Tailwind CSS", slug: "tailwindcss", color: "#06B6D4", icon: "Palette" },
    { name: "Docker", slug: "docker", color: "#2496ED", icon: "Boxes" },
    { name: "AWS", slug: "aws", color: "#FF9900", icon: "Cloud" },
    { name: "Redis", slug: "redis", color: "#DC382D", icon: "Zap" },
    { name: "GraphQL", slug: "graphql", color: "#E10098", icon: "Cpu" },
    { name: "Kubernetes", slug: "kubernetes", color: "#326CE5", icon: "Layers" },
  ];

  const techMap = {};
  for (const tech of technologiesData) {
    const created = await prisma.technology.create({ data: tech });
    techMap[tech.slug] = created.id;
  }
  console.log(`✅ ${technologiesData.length} Technologies created`);

  // 4. Skills
  await prisma.skill.deleteMany();
  const skillsData = [
    // Frontend
    { name: "TypeScript", category: "FRONTEND", proficiency: 95, yearsOfExperience: 6, isFeatured: true, displayOrder: 1 },
    { name: "Next.js (App Router)", category: "FRONTEND", proficiency: 94, yearsOfExperience: 5, isFeatured: true, displayOrder: 2 },
    { name: "React / Server Components", category: "FRONTEND", proficiency: 96, yearsOfExperience: 6, isFeatured: true, displayOrder: 3 },
    { name: "Tailwind CSS & shadcn/ui", category: "FRONTEND", proficiency: 92, yearsOfExperience: 4, isFeatured: true, displayOrder: 4 },
    { name: "State Management (Zustand / Redux)", category: "FRONTEND", proficiency: 90, yearsOfExperience: 5, isFeatured: false, displayOrder: 5 },
    { name: "Web Performance & Core Web Vitals", category: "FRONTEND", proficiency: 88, yearsOfExperience: 5, isFeatured: true, displayOrder: 6 },

    // Backend
    { name: "Node.js & Express", category: "BACKEND", proficiency: 92, yearsOfExperience: 6, isFeatured: true, displayOrder: 1 },
    { name: "Go (Golang)", category: "BACKEND", proficiency: 80, yearsOfExperience: 3, isFeatured: true, displayOrder: 2 },
    { name: "GraphQL & RESTful APIs", category: "BACKEND", proficiency: 92, yearsOfExperience: 5, isFeatured: false, displayOrder: 3 },
    { name: "Microservices Architecture", category: "BACKEND", proficiency: 86, yearsOfExperience: 4, isFeatured: true, displayOrder: 4 },
    { name: "Event-Driven Systems (Kafka / RabbitMQ)", category: "BACKEND", proficiency: 82, yearsOfExperience: 3, isFeatured: false, displayOrder: 5 },

    // Database
    { name: "PostgreSQL & Query Optimization", category: "DATABASE", proficiency: 92, yearsOfExperience: 6, isFeatured: true, displayOrder: 1 },
    { name: "Prisma & Drizzle ORM", category: "DATABASE", proficiency: 94, yearsOfExperience: 4, isFeatured: true, displayOrder: 2 },
    { name: "Redis In-Memory Caching", category: "DATABASE", proficiency: 88, yearsOfExperience: 4, isFeatured: false, displayOrder: 3 },
    { name: "MongoDB & DynamoDB", category: "DATABASE", proficiency: 84, yearsOfExperience: 4, isFeatured: false, displayOrder: 4 },

    // DevOps & Cloud
    { name: "Amazon Web Services (AWS)", category: "CLOUD", proficiency: 88, yearsOfExperience: 5, isFeatured: true, displayOrder: 1 },
    { name: "Docker Containerization", category: "DEVOPS", proficiency: 90, yearsOfExperience: 5, isFeatured: true, displayOrder: 2 },
    { name: "Kubernetes Orchestration", category: "DEVOPS", proficiency: 80, yearsOfExperience: 3, isFeatured: false, displayOrder: 3 },
    { name: "CI/CD (GitHub Actions / GitLab)", category: "DEVOPS", proficiency: 90, yearsOfExperience: 5, isFeatured: true, displayOrder: 4 },
    { name: "Terraform Infrastructure as Code", category: "CLOUD", proficiency: 78, yearsOfExperience: 2, isFeatured: false, displayOrder: 5 },
  ];

  for (const skill of skillsData) {
    await prisma.skill.create({ data: skill });
  }
  console.log(`✅ ${skillsData.length} Skills created`);

  // 5. Projects
  await prisma.project.deleteMany();
  const projectsData = [
    {
      title: "PulseFlow - Enterprise Real-Time Telemetry Platform",
      slug: "pulseflow-telemetry-platform",
      shortDescription:
        "High-throughput real-time telemetry streaming and analytical platform handling 250,000+ metric events per second with sub-50ms query latencies.",
      fullDescription:
        "PulseFlow is an enterprise-scale telemetry ingestion engine and real-time dashboard built for distributed cloud infrastructure monitoring. Engineered using Next.js 15, Go ingestion workers, Apache Kafka, and PostgreSQL with TimescaleDB extensions, the platform provides automated threshold anomaly detection, multi-tenant RBAC, and configurable operational alert pipelines.\n\nThe user interface combines interactive WebGL timeline scrubbers with instantaneous metric aggregations, allowing engineering teams to diagnose cascading microservice degradations across hybrid cloud deployments within seconds.",
      mainImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
      ]),
      category: "Full-Stack System",
      clientName: "CloudScale Systems",
      githubUrl: "https://github.com/example/pulseflow-telemetry",
      liveDemoUrl: "https://pulseflow.example.com",
      challenges:
        "Ingesting peak loads of 250k events per second without thread exhaustion or database lock contention while maintaining real-time dashboard updates over secure WebSocket channels.",
      solutions:
        "Implemented a fan-out Go ingestion gateway writing batch buffers to Kafka partitions, paired with Redis stream subscriptions and Next.js Server-Sent Events to push pre-aggregated time-bucketed metrics directly to the browser.",
      results:
        "Reduced mean time to detection (MTTD) by 64% across 40+ engineering squads while shrinking monthly cloud infrastructure ingestion costs by 38%.",
      isFeatured: true,
      isPublished: true,
      displayOrder: 1,
      techSlugs: ["nextjs", "typescript", "postgresql", "docker", "redis", "aws"],
    },
    {
      title: "AuraOS - Collaborative Design Workspace & Canvas",
      slug: "auraos-collaborative-workspace",
      shortDescription:
        "Real-time multiplayer infinite canvas designed for system architecture diagrams, state machines, and collaborative technical whiteboarding.",
      fullDescription:
        "AuraOS is an ultra-fast collaborative design environment engineered for software architects and product teams. It features a custom 60fps HTML5 Canvas & WebGL rendering engine, CRDT-based operational conflict resolution for simultaneous multiplayer editing, and native export pipelines into Terraform and Mermaid diagram specifications.",
      mainImage: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80",
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1200&q=80",
      ]),
      category: "Web Application",
      clientName: "Open Engineering Initiative",
      githubUrl: "https://github.com/example/auraos-canvas",
      liveDemoUrl: "https://auraos.example.com",
      challenges:
        "Guaranteeing zero jitter during concurrent editing with 50+ simultaneous collaborators editing 10,000+ diagram nodes.",
      solutions:
        "Designed a Yjs-backed CRDT synchronization layer over WebSockets combined with viewport spatial indexing (R-Tree) to cull off-screen nodes from render passes.",
      results:
        "Adopted by over 12,000 active developers, maintaining an average canvas frame rate of 59.4 FPS across all modern desktop browsers.",
      isFeatured: true,
      isPublished: true,
      displayOrder: 2,
      techSlugs: ["react", "typescript", "nextjs", "tailwindcss", "prisma"],
    },
    {
      title: "KryptonPay - Cross-Border Payment Settlement Gateway",
      slug: "kryptonpay-settlement-gateway",
      shortDescription:
        "Compliant payment orchestration gateway processing multi-currency institutional transactions with automated AML verification and ledger auditability.",
      fullDescription:
        "KryptonPay streamlines global cross-border treasury settlements across 32 currencies. Designed with high-resilience double-entry accounting ledgers, strict idempotency enforcement, and end-to-end cryptographic payload signing, it ensures zero transactional discrepancy across institutional corridors.",
      mainImage: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80",
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80",
      ]),
      category: "Fintech Engine",
      clientName: "Apex FinCorp",
      githubUrl: "https://github.com/example/kryptonpay-gateway",
      liveDemoUrl: "https://kryptonpay.example.com",
      challenges:
        "Eliminating phantom payment state updates during third-party banking timeout spikes and network partition events.",
      solutions:
        "Implemented Saga orchestration patterns with compensating state machines, strict distributed Redis locks, and immutable cryptographic transaction logs in PostgreSQL.",
      results:
        "Processed $48M+ in transactional volume with 99.999% uptime and zero ledger imbalances during peak reconciliation windows.",
      isFeatured: true,
      isPublished: true,
      displayOrder: 3,
      techSlugs: ["typescript", "nodejs", "postgresql", "prisma", "docker", "redis"],
    },
    {
      title: "OmniSearch - Semantic Code Search & Documentation Engine",
      slug: "omnisearch-code-intelligence",
      shortDescription:
        "Hybrid vector and lexical code search platform indexing 100M+ lines of enterprise monorepo code with contextual AST exploration.",
      fullDescription:
        "OmniSearch transforms developer onboarding across massive multi-repository organizations. Utilizing tree-sitter AST parsing, embeddings-based vector search, and BM25 lexical indexing, developers can query codebases using natural language questions to locate precise implementation snippets and internal architectural guidelines.",
      mainImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
      ]),
      category: "Developer Tools",
      clientName: "DevCore Labs",
      githubUrl: "https://github.com/example/omnisearch-code",
      liveDemoUrl: "https://omnisearch.example.com",
      challenges:
        "Maintaining low latency queries across millions of code embeddings without ballooning vector database indexing memory.",
      solutions:
        "Created an incremental AST change detector that re-embeds only modified semantic function blocks on pull request merge.",
      results:
        "Cut internal developer search time by 45% and reduced redundant code duplication across 6 disparate core repositories.",
      isFeatured: false,
      isPublished: true,
      displayOrder: 4,
      techSlugs: ["typescript", "nextjs", "postgresql", "docker"],
    },
  ];

  for (const p of projectsData) {
    const { techSlugs, ...projectFields } = p;
    const project = await prisma.project.create({
      data: projectFields,
    });

    for (const slug of techSlugs) {
      if (techMap[slug]) {
        await prisma.projectTechnology.create({
          data: {
            projectId: project.id,
            technologyId: techMap[slug],
          },
        });
      }
    }
  }
  console.log(`✅ ${projectsData.length} Projects created with relational technologies`);

  // 6. Experience
  await prisma.experience.deleteMany();
  const experienceData = [
    {
      jobTitle: "Lead Full-Stack Engineer",
      company: "Stratos Cloud Systems",
      companyLogo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80",
      companyUrl: "https://example.com/stratos",
      location: "San Francisco, CA",
      employmentType: "Full-time",
      startDate: new Date("2023-03-01"),
      endDate: null,
      isCurrent: true,
      description:
        "Leading the core cloud platform engineering team responsible for real-time observability pipelines and developer orchestration services.",
      responsibilities: JSON.stringify([
        "Spearheaded architectural migration of monolithic backend services into distributed containerized microservices handling 250k+ req/sec.",
        "Architected modern Next.js 15 enterprise console with server actions, real-time analytics, and role-based permissions.",
        "Mentored a team of 9 senior and mid-level software engineers, establishing automated CI/CD and rigorous code review standards.",
        "Decreased Core Web Vitals LCP by 48% and improved server response times by 35% through aggressive query optimization and edge caching.",
      ]),
      technologies: JSON.stringify(["Next.js", "TypeScript", "Node.js", "PostgreSQL", "Docker", "AWS", "Kafka"]),
      isPublished: true,
      displayOrder: 1,
    },
    {
      jobTitle: "Senior Software Engineer",
      company: "Vanguard Tech Labs",
      companyLogo: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=200&q=80",
      companyUrl: "https://example.com/vanguard",
      location: "San Jose, CA",
      employmentType: "Full-time",
      startDate: new Date("2020-08-01"),
      endDate: new Date("2023-02-28"),
      isCurrent: false,
      description:
        "Designed and shipped high-scale customer billing, subscription orchestration, and transaction verification systems.",
      responsibilities: JSON.stringify([
        "Engineered reliable double-entry ledger database schema processing over $120M in annualized gross merchandise volume.",
        "Built reusable React component library with accessible WCAG AAA compliance, adopted across 4 major customer-facing products.",
        "Implemented Redis distributed locking mechanisms that eliminated double-spend edge cases under high concurrent API traffic.",
      ]),
      technologies: JSON.stringify(["React", "TypeScript", "Node.js", "PostgreSQL", "Prisma", "Redis", "Docker"]),
      isPublished: true,
      displayOrder: 2,
    },
    {
      jobTitle: "Software Engineer",
      company: "Nexus Digital Agency",
      companyLogo: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=200&q=80",
      companyUrl: "https://example.com/nexus",
      location: "Austin, TX",
      employmentType: "Full-time",
      startDate: new Date("2018-06-01"),
      endDate: new Date("2020-07-31"),
      isCurrent: false,
      description:
        "Developed full-stack web applications, headless e-commerce platforms, and interactive client portals.",
      responsibilities: JSON.stringify([
        "Developed responsive web frontends using modern JavaScript, React, and CSS preprocessors.",
        "Integrated REST APIs with Stripe, Auth0, SendGrid, and headless CMS platforms for 15+ external clients.",
        "Optimized client SQL database queries, cutting average query execution latency from 450ms down to 40ms.",
      ]),
      technologies: JSON.stringify(["JavaScript", "React", "Node.js", "PostgreSQL", "Tailwind CSS", "Git"]),
      isPublished: true,
      displayOrder: 3,
    },
  ];

  for (const exp of experienceData) {
    await prisma.experience.create({ data: exp });
  }
  console.log(`✅ ${experienceData.length} Experience entries created`);

  // 7. Education
  await prisma.education.deleteMany();
  const educationData = [
    {
      institution: "University of California, Berkeley",
      degree: "Bachelor of Science",
      fieldOfStudy: "Computer Science & Engineering",
      location: "Berkeley, CA",
      startDate: new Date("2014-08-01"),
      endDate: new Date("2018-05-15"),
      isCurrent: false,
      description:
        "Graduated Magna Cum Laude (GPA 3.86/4.0). Special focus on Distributed Systems, Algorithms & Complexity, Database Internals, and Computer Networking. President of the ACM Student Chapter.",
      institutionUrl: "https://berkeley.edu",
      logo: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=200&q=80",
      isPublished: true,
      displayOrder: 1,
    },
    {
      institution: "Stanford Center for Professional Development",
      degree: "Advanced Professional Certificate",
      fieldOfStudy: "Cloud Computing & Distributed Software Architecture",
      location: "Stanford, CA",
      startDate: new Date("2021-01-10"),
      endDate: new Date("2021-11-20"),
      isCurrent: false,
      description:
        "Intensive graduate-level program covering fault-tolerant consensus protocols (Raft/Paxos), distributed key-value storage engines, and container orchestration.",
      institutionUrl: "https://scpd.stanford.edu",
      logo: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=200&q=80",
      isPublished: true,
      displayOrder: 2,
    },
  ];

  for (const edu of educationData) {
    await prisma.education.create({ data: edu });
  }
  console.log(`✅ ${educationData.length} Education entries created`);

  // 8. Certificates
  await prisma.certificate.deleteMany();
  const certificatesData = [
    {
      title: "AWS Certified Solutions Architect - Professional (SAP-C02)",
      issuingOrg: "Amazon Web Services",
      credentialId: "AWS-PSA-99381204",
      credentialUrl: "https://aws.amazon.com/verification",
      issueDate: new Date("2023-04-15"),
      expiryDate: new Date("2026-04-15"),
      doesNotExpire: false,
      certificateImage: "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?auto=format&fit=crop&w=800&q=80",
      certificatePdf: "https://example.com/certificates/aws-solutions-architect-pro.pdf",
      description:
        "Demonstrates advanced technical expertise in designing complex, highly available, fault-tolerant, and cost-efficient cloud architectures spanning multiple VPCs and global AWS regions.",
      skills: JSON.stringify(["AWS", "Cloud Architecture", "Disaster Recovery", "Security & Compliance"]),
      isFeatured: true,
      isPublished: true,
      displayOrder: 1,
    },
    {
      title: "Certified Kubernetes Administrator (CKA)",
      issuingOrg: "Cloud Native Computing Foundation (CNCF)",
      credentialId: "CKA-2309-8472",
      credentialUrl: "https://www.cncf.io/certification/cka/",
      issueDate: new Date("2022-10-10"),
      expiryDate: new Date("2025-10-10"),
      doesNotExpire: false,
      certificateImage: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80",
      certificatePdf: "https://example.com/certificates/cka-certified-kubernetes-admin.pdf",
      description:
        "Validates skills in Kubernetes cluster architecture, workload scheduling, secure networking, storage volume management, and production troubleshooting.",
      skills: JSON.stringify(["Kubernetes", "Docker", "DevOps", "Linux Kernel"]),
      isFeatured: true,
      isPublished: true,
      displayOrder: 2,
    },
    {
      title: "Meta Certified Front-End Developer Professional",
      issuingOrg: "Meta",
      credentialId: "META-FED-772910",
      credentialUrl: "https://www.coursera.org/verify/professional-cert/meta-frontend",
      issueDate: new Date("2021-08-14"),
      expiryDate: null,
      doesNotExpire: true,
      certificateImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
      certificatePdf: "https://example.com/certificates/meta-frontend-professional.pdf",
      description:
        "In-depth mastery of React, UI state architecture, responsive web design principles, accessibility (WCAG), and modern frontend unit and integration testing.",
      skills: JSON.stringify(["React", "TypeScript", "Web Accessibility", "Testing"]),
      isFeatured: true,
      isPublished: true,
      displayOrder: 3,
    },
  ];

  for (const cert of certificatesData) {
    await prisma.certificate.create({ data: cert });
  }
  console.log(`✅ ${certificatesData.length} Certificates created`);

  // 9. Achievements
  await prisma.achievement.deleteMany();
  const achievementsData = [
    {
      title: "1st Place Winner - Global Cloud Architecture Hackathon",
      organization: "Cloud Native Global Summit",
      date: new Date("2024-02-18"),
      description:
        "Led a 4-person engineering team to design and demonstrate an autonomous self-healing Kubernetes autoscaler based on real-time application latency telemetry.",
      image: "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?auto=format&fit=crop&w=800&q=80",
      url: "https://example.com/hackathon-2024-winners",
      isFeatured: true,
      isPublished: true,
      displayOrder: 1,
    },
    {
      title: "Published Technical Author - High-Performance Next.js Architectures",
      organization: "DevEngineering Journal",
      date: new Date("2023-09-05"),
      description:
        "Authored an in-depth 15,000-word engineering breakdown on optimizing React Server Components, streaming SSR, and edge database caching patterns.",
      image: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=800&q=80",
      url: "https://example.com/engineering-publications/high-performance-nextjs",
      isFeatured: true,
      isPublished: true,
      displayOrder: 2,
    },
    {
      title: "Open Source Contributor of the Year Recognition",
      organization: "Web Performance Guild",
      date: new Date("2022-12-10"),
      description:
        "Recognized for submitting 40+ pull requests to developer tooling, focusing on tree-shaking optimizations, bundle analyzer diagnostics, and headless UI primitives.",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
      url: "https://example.com/awards/open-source-guild-2022",
      isFeatured: false,
      isPublished: true,
      displayOrder: 3,
    },
  ];

  for (const ach of achievementsData) {
    await prisma.achievement.create({ data: ach });
  }
  console.log(`✅ ${achievementsData.length} Achievements created`);

  // 10. Blog Posts
  await prisma.blogPostTag.deleteMany();
  await prisma.blogTag.deleteMany();
  await prisma.blogPost.deleteMany();

  const blogTags = ["Architecture", "Next.js", "Performance", "PostgreSQL", "TypeScript"];
  const tagMap = {};
  for (const t of blogTags) {
    const slug = t.toLowerCase().replace(/[^a-z0-9]/g, "-");
    const createdTag = await prisma.blogTag.create({
      data: { name: t, slug },
    });
    tagMap[t] = createdTag.id;
  }

  const postsData = [
    {
      title: "Architecting Ultra-Low Latency Next.js 15 Apps with Server Components",
      slug: "architecting-ultra-low-latency-nextjs-15",
      coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80",
      excerpt:
        "A deep dive into React Server Components, streaming SSR, edge data caching, and tactical techniques to achieve sub-100ms Largest Contentful Paint (LCP) at enterprise scale.",
      content: `<h2>The Paradigm Shift of React Server Components</h2><p>React Server Components (RSC) represent the most significant evolution in frontend engineering since the introduction of hooks. By moving data fetching, authentication boundary checks, and heavy dependency parsing onto the server, our client-side JavaScript bundles drop significantly in weight.</p><h3>1. Eliminate Waterfall Requests at the Root</h3><p>In traditional client-rendered single page applications, data waterfalls were an inescapable reality: the HTML loads, downloads the bundle, kicks off user authentication queries, and only then starts retrieving section-specific content.</p><p>With Server Components in Next.js App Router, parallel data fetching happens directly on the server over persistent database connection pools, executing queries before a single byte of markup streams down to the browser.</p><h3>2. Pragmatic Streaming SSR with Suspense</h3><p>By wrapping heavy dynamic components in <code>&lt;Suspense&gt;</code> boundaries, the primary document shell and critical layout render immediately. The client experiences zero blank-screen delay while secondary data streams into place.</p><h3>Conclusion</h3><p>RSC isn't just about faster initial page loads; it fundamentally redefines how we model full-stack system architecture, delivering uncompromising performance without sacrificing developer productivity.</p>`,
      author: "Hariharan",
      publishedDate: new Date("2024-03-12"),
      isPublished: true,
      seoTitle: "Architecting Ultra-Low Latency Next.js 15 Apps with Server Components",
      seoDescription: "Learn how to architect high-performance web applications using Next.js 15, React Server Components, and streaming SSR.",
      tags: ["Next.js", "Performance", "Architecture"],
    },
    {
      title: "Mastering PostgreSQL Connection Pooling & Index Tuning for Node.js",
      slug: "mastering-postgresql-connection-pooling-nodejs",
      coverImage: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=1200&q=80",
      excerpt:
        "Prevent database connection exhaustion under spike loads. Learn how PgBouncer, connection pool sizing, and composite indexing can 10x your query throughput.",
      content: `<h2>Understanding Connection Overhead</h2><p>Each client connection established directly to a PostgreSQL database spawns a dedicated backend process on the database host, consuming between 5MB to 10MB of server memory even while idle.</p><p>When hundreds of serverless functions or container replicas burst simultaneously during traffic spikes, the database can easily spend more CPU cycles managing process context switches than executing actual index scans.</p><h3>Effective Pool Sizing with Prisma</h3><p>A common misconception is that larger connection pool sizes equal higher throughput. In reality, setting your pool size to <code>connections = (2 * CPU_cores) + disk_spindles</code> ensures the database engine executes queries without excessive lock contention.</p>`,
      author: "Hariharan",
      publishedDate: new Date("2024-01-20"),
      isPublished: true,
      seoTitle: "Mastering PostgreSQL Connection Pooling for Node.js",
      seoDescription: "Strategies for optimizing PostgreSQL performance, connection pools, and composite indexes in modern Node.js applications.",
      tags: ["PostgreSQL", "Performance", "Architecture"],
    },
  ];

  for (const post of postsData) {
    const { tags, ...postData } = post;
    const createdPost = await prisma.blogPost.create({ data: postData });
    for (const tName of tags) {
      if (tagMap[tName]) {
        await prisma.blogPostTag.create({
          data: {
            postId: createdPost.id,
            tagId: tagMap[tName],
          },
        });
      }
    }
  }
  console.log(`✅ ${postsData.length} Blog posts created`);

  // 11. Social Links
  await prisma.socialLink.deleteMany();
  const socialLinksData = [
    { platform: "GitHub", url: "https://github.com", icon: "Github", isEnabled: true, displayOrder: 1 },
    { platform: "LinkedIn", url: "https://linkedin.com", icon: "Linkedin", isEnabled: true, displayOrder: 2 },
    { platform: "Twitter / X", url: "https://twitter.com", icon: "Twitter", isEnabled: true, displayOrder: 3 },
    { platform: "Email", url: "mailto:hariharan.eng@example.com", icon: "Mail", isEnabled: true, displayOrder: 4 },
  ];

  for (const link of socialLinksData) {
    await prisma.socialLink.create({ data: link });
  }
  console.log(`✅ ${socialLinksData.length} Social links created`);

  // 12. Site Settings
  await prisma.siteSettings.deleteMany();
  await prisma.siteSettings.create({
    data: {
      siteName: "Hariharan | Senior Software Engineer",
      siteDescription: "Senior Full-Stack Engineer & Cloud Architect Portfolio and Engineering Showcase.",
      ownerName: "Hariharan",
      ownerEmail: "hariharan.eng@example.com",
      location: "San Francisco, CA",
      timezone: "America/Los_Angeles",
      heroGreeting: "Hello, I'm",
      heroTitle: "Senior Full-Stack Engineer & Cloud Architect",
      heroSubtitle:
        "Architecting scalable distributed backends, ultra-performant Next.js applications, and resilient cloud infrastructure.",
      primaryCtaText: "Explore My Work",
      primaryCtaUrl: "#projects",
      secondaryCtaText: "Download Resume",
      secondaryCtaUrl: "/resume",
      primaryColor: "blue",
      appearanceMode: "system",
      navSections: JSON.stringify({
        about: true,
        skills: true,
        experience: true,
        education: true,
        projects: true,
        certifications: true,
        achievements: true,
        blog: true,
        contact: true,
      }),
      enableBlog: true,
      enableContactForm: true,
      seoTitle: "Hariharan | Senior Full-Stack Engineer & Cloud Architect",
      seoDescription:
        "Explore my portfolio, featured engineering projects, certifications, technical skills, and software development insights.",
      seoKeywords: "software engineer, full-stack developer, nextjs, react, typescript, postgresql, cloud architect, portfolio",
      ogImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    },
  });
  console.log("✅ Site settings created");

  // 13. Activity Log
  await prisma.activityLog.create({
    data: {
      action: "DATABASE_SEEDED",
      entityType: "SYSTEM",
      details: "Initial database seed completed successfully with complete realistic portfolio dataset.",
      userId: admin.id,
    },
  });
  console.log("✅ Initial activity log recorded");

  console.log("\n🎉 Database seeding successfully finished!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("Admin Dashboard Credentials:");
  console.log("URL:      /admin/login");
  console.log("Email:    admin@portfolio.com");
  console.log("Password: adminpassword123");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
