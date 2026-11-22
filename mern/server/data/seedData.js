const seedData = {
  settings: {
    siteName: "HMS Developer | Software Engineer & Systems Architect",
    authorName: "Hafiz Muhammad Saad",
    roleTitle: "Software Developer & Systems Architect",
    email: "saad.sa9112@gmail.com",
    phone: "+92 345 3937195",
    location: "Karachi, Pakistan",
    yearsOfExperience: 2,
    educationShort: "BSBC - Sohail University & ADSE - Aptech Learning, Karachi",
    cvFilePath: "/files/Muhammad_Saad_CV.pdf",
    githubUrl: "https://github.com/saadsa9112-cloud",
    linkedinUrl: "https://linkedin.com",
    bio: "Motivated and detail-oriented Software Developer with knowledge of C#, ASP.NET Core MVC (.NET), PHP, HTML5, CSS3, JavaScript, SQL, and MySQL. Experienced in developing and enhancing web applications through academic and personal projects."
  },
  featureFlags: {
    enableCostEstimator: true,
    enableCyberLab: true,
    enableBenchmark: true,
    enableSandbox: true
  },
  skills: [
    { id: 1, name: "ASP.NET Core MVC", percentage: 95, iconClass: "fab fa-microsoft", colorHex: "#A855F7", displayOrder: 1 },
    { id: 2, name: "C# / .NET 10", percentage: 95, iconClass: "fas fa-code", colorHex: "#3B82F6", displayOrder: 2 },
    { id: 3, name: "MERN Stack (MongoDB, Express, React, Node)", percentage: 92, iconClass: "fab fa-node-js", colorHex: "#10B981", displayOrder: 3 },
    { id: 4, name: "SQL Server & Relational DB", percentage: 90, iconClass: "fas fa-database", colorHex: "#06B6D4", displayOrder: 4 },
    { id: 5, name: "HTML5, CSS3 & JavaScript", percentage: 90, iconClass: "fab fa-js", colorHex: "#F59E0B", displayOrder: 5 },
    { id: 6, name: "React & Modern UI", percentage: 88, iconClass: "fab fa-react", colorHex: "#00D9FF", displayOrder: 6 },
    { id: 7, name: "Graphic Designing & UI/UX (Figma/Adobe)", percentage: 90, iconClass: "fas fa-palette", colorHex: "#EC4899", displayOrder: 7 },
    { id: 8, name: "SEO & Performance Tuning", percentage: 88, iconClass: "fas fa-chart-line", colorHex: "#F59E0B", displayOrder: 8 },
    { id: 9, name: "PHP & MySQL", percentage: 85, iconClass: "fab fa-php", colorHex: "#10B981", displayOrder: 9 },
    { id: 10, name: "Git & GitHub", percentage: 90, iconClass: "fab fa-git-alt", colorHex: "#EF4444", displayOrder: 10 },
    { id: 11, name: "Entity Framework Core", percentage: 90, iconClass: "fas fa-layer-group", colorHex: "#8B3DFF", displayOrder: 11 }
  ],
  projects: [
    {
      id: 1,
      title: "NED Academy University Management System (UMS)",
      subtitle: "Enterprise Academic Course, Student & Department Management Architecture",
      description: "Engineered a robust university management platform featuring student enrollment, departmental hierarchy administration, teacher course assignments, notice board broadcasts, and academic progress tracking.",
      technologies: "ASP.NET Core MVC, C#, Entity Framework Core, SQL Server, Bootstrap",
      githubLink: "https://github.com/saadsa9112-cloud",
      liveDemoLink: "",
      featured: true,
      status: "Published",
      displayOrder: 1,
      thumbnailPath: "/images/projects/ned-academy-system.jpg",
      category: "University Projects"
    },
    {
      id: 2,
      title: "NED Academy Admissions & Public University Portal",
      subtitle: "Complete Online Admission Lifecycle & Departmental CMS Engine",
      description: "Engineered an enterprise-grade university admissions and content management system featuring student application workflows, document proof verification queues, academic program registries, fee voucher management, audit logging, and dynamic CMS controls.",
      technologies: "ASP.NET Core 10 MVC, C#, EF Core 10, SQL Server, Bootstrap 5",
      githubLink: "https://github.com/saadsa9112-cloud",
      liveDemoLink: "",
      featured: true,
      status: "Published",
      displayOrder: 2,
      thumbnailPath: "/images/projects/ned-academy-website.jpg",
      category: "University Projects"
    },
    {
      id: 3,
      title: "Nexora Digital Agency & Client Solutions Platform",
      subtitle: "Full-Scale Agency CMS, Client Inquiries, and Interactive Service Engine",
      description: "Developed a modern, high-conversion agency platform with dynamic service catalogs, case study showcase, lead capture telemetry, and sleek cyber-aesthetic branding.",
      technologies: "HTML5, CSS3, JavaScript, PHP, MySQL, Bootstrap, SwiperJS",
      githubLink: "https://github.com/saadsa9112-cloud",
      liveDemoLink: "https://nexoradigital.netlify.app",
      featured: true,
      status: "Published",
      displayOrder: 3,
      thumbnailPath: "/images/projects/nexora-agency.jpg",
      category: "Agency Websites"
    },
    {
      id: 4,
      title: "Futuristic Cyber Portfolio & Systems Architecture Portal",
      subtitle: "High-Performance Interactive Showcase with Matrix Canvas, Terminal Bootloader & Ambient FX",
      description: "High-octane developer portfolio featuring cyber-themed animations, real-time telemetry, terminal emulator, audio effects, and architecture quick-scan overlay.",
      technologies: "React.js, Node.js, Express, MongoDB, Canvas API, CSS3 Glassmorphism",
      githubLink: "https://github.com/saadsa9112-cloud/futuristic-portfolio-by-SA-Developer",
      liveDemoLink: "https://hmsofficial.netlify.app",
      featured: true,
      status: "Published",
      displayOrder: 4,
      thumbnailPath: "/images/projects/cyber-portfolio.jpg",
      category: "Portfolio Websites"
    }
  ],
  blogs: [
    {
      id: 1,
      title: "Architecting Zero-Trust Web Security in .NET 10 & MERN Applications",
      slug: "architecting-zero-trust-web-security",
      category: "Cybersecurity",
      readTime: "6 min read",
      views: 482,
      createdDate: "2026-08-15",
      content: "Deep dive into kernel eBPF probes, Content Security Policies, AST query sanitization, and token boundaries."
    },
    {
      id: 2,
      title: "Engineering Sub-Millisecond APIs with ASP.NET Core & Redis Caching",
      slug: "sub-millisecond-apis-dotnet-redis",
      category: "Backend Architecture",
      readTime: "8 min read",
      views: 758,
      createdDate: "2026-09-02",
      content: "Optimizing memory allocations, connection pooling, and multi-tier L1/L2 response caching for high-concurrency systems."
    }
  ],
  experiences: [
    {
      id: 1,
      company: "Aptech Learning Center",
      role: "Software Developer Intern",
      startDate: "2024-06-01",
      endDate: null,
      isCurrent: true,
      description: "Building responsive full-stack applications with C#, ASP.NET Core, SQL Server, and modern web UI libraries."
    },
    {
      id: 2,
      company: "Freelance Solutions",
      role: "Full-Stack Web Architect",
      startDate: "2023-01-15",
      endDate: null,
      isCurrent: true,
      description: "Delivering customized web platforms, SEO architectures, and brand landing interfaces for commercial clients."
    }
  ],
  education: [
    {
      id: 1,
      institution: "Sohail University, Karachi",
      degree: "Bachelor of Science in Business Computing (BSBC)",
      duration: "2025 - 2029",
      description: "Undergraduate program focused on software development, programming, databases, software engineering, business management, and information systems."
    },
    {
      id: 2,
      institution: "Aptech Learning, Karachi",
      degree: "Advanced Diploma in Software Engineering (ADSE)",
      duration: "2024 - 2027",
      description: "Diploma program covering software engineering, object-oriented programming, database management, web development, Git, and practical application development."
    }
  ],
  certificates: [
    {
      id: 1,
      title: "Enterprise Application Development with C# & .NET",
      authority: "Microsoft Learn / Aptech",
      issueDate: "2025-02-10",
      credentialUrl: "https://learn.microsoft.com"
    },
    {
      id: 2,
      title: "Advanced SQL Server & Relational Database Design",
      authority: "Aptech Learning",
      issueDate: "2024-11-20",
      credentialUrl: "https://aptech-education.com"
    }
  ],
  testimonials: [
    {
      id: 1,
      clientName: "Engr. Tariq Mehmood",
      roleCompany: "Department Head, Academic Systems",
      rating: 5,
      content: "Saad demonstrated exceptional architectural prowess and discipline while building the NED Academy University Management System. Flawless database design."
    },
    {
      id: 2,
      clientName: "Hamza Farooq",
      roleCompany: "Lead Creative Director, Nexora Digital",
      rating: 5,
      content: "His attention to UI aesthetics, speed, and modern cyber design distinguishes him from typical developers. Highly recommended!"
    }
  ],
  messages: [
    {
      id: 1,
      name: "Hamza Siddiqui",
      email: "hamza.tech@example.com",
      subject: "Full-Stack Enterprise Contract",
      message: "Hi Saad, we reviewed your work on NED Academy and would love to consult with you on an upcoming enterprise C# ASP.NET Core project.",
      isRead: false,
      replyText: "",
      createdDate: "2026-09-29T14:22:00Z"
    },
    {
      id: 2,
      name: "Elena Rostova",
      email: "e.rostova@globalventures.io",
      subject: "Senior Full-Stack Developer Opportunity",
      message: "Hello Saad! We are building high-throughput distributed applications and your portfolio demonstrates the exact architectural depth we are looking for.",
      isRead: true,
      replyText: "Thank you Elena, I am excited to connect.",
      createdDate: "2026-09-28T18:45:00Z"
    },
    {
      id: 3,
      name: "Zubair Ahmed",
      email: "zubair.ahmed@cloudscale.pk",
      subject: "Collaboration on SIEM Telemetry Tool",
      message: "Assalam o Alaikum Saad bhai, your CyberSentinel project looks phenomenal. Are you open to freelance consulting?",
      isRead: false,
      replyText: "",
      createdDate: "2026-09-27T10:15:00Z"
    }
  ],
  visitors: [
    { id: 1, ipAddress: "192.168.100.12", country: "Pakistan", duration: 184, osBrowser: "Windows 11 / Chrome 129", timestamp: "2026-09-30T17:42:00Z" },
    { id: 2, ipAddress: "54.210.88.19", country: "United States", duration: 75, osBrowser: "macOS / Safari 18", timestamp: "2026-09-30T16:18:00Z" },
    { id: 3, ipAddress: "185.199.110.153", country: "United Kingdom", duration: 120, osBrowser: "Linux / Firefox 131", timestamp: "2026-09-30T15:04:00Z" }
  ],
  blockedNodes: [
    { id: 1, ipAddress: "203.0.113.88", reason: "Automated DDoS Probe Blocked", timestamp: "2026-09-25T08:12:00Z" }
  ],
  activityLogs: [
    { id: 1, action: "Zero-Trust Active", details: "Kernel interceptor initialized on port 5000", timestamp: "2026-09-30T17:28:00Z" },
    { id: 2, action: "Authentication", details: "Operator 'saad' authenticated via secure link", timestamp: "2026-09-30T17:30:00Z" },
    { id: 3, action: "Telemetry Handshake", details: "Node handshake verified with Anycast Edge", timestamp: "2026-09-30T17:45:00Z" }
  ],
  statistics: [
    { title: "Enterprise Projects", value: 4, iconClass: "fas fa-folder-open" },
    { title: "Education Milestones", value: 2, iconClass: "fas fa-graduation-cap" },
    { title: "Years Coding", value: 2, iconClass: "fas fa-laptop-code" },
    { title: "Core Technologies", value: 11, iconClass: "fas fa-code" }
  ]
};

module.exports = seedData;
