const fs = require('fs');
const path = require('path');

const clientDir = path.resolve(__dirname, '../client');

const globalResourceHints = `
    <!-- Performance & Resource Hints -->
    <link rel="dns-prefetch" href="//fonts.googleapis.com" />
    <link rel="dns-prefetch" href="//fonts.gstatic.com" />
    <link rel="dns-prefetch" href="//cdnjs.cloudflare.com" />
    <link rel="dns-prefetch" href="//cdn.jsdelivr.net" />
    <link rel="manifest" href="/site.webmanifest" />
    <meta name="theme-color" content="#090514" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

    <!-- Global Dublin Core & Geographic Meta (Local & International SEO) -->
    <meta name="author" content="Hafiz Muhammad Saad (HMS Developer)" />
    <meta name="publisher" content="Hafiz Muhammad Saad" />
    <meta name="copyright" content="Hafiz Muhammad Saad" />
    <meta name="rating" content="General" />
    <meta name="revisit-after" content="2 days" />
    <meta name="geo.region" content="PK-SD" />
    <meta name="geo.placename" content="Karachi, Sindh, Pakistan" />
    <meta name="geo.position" content="24.8607;67.0011" />
    <meta name="ICBM" content="24.8607, 67.0011" />
    <meta name="DC.creator" content="Hafiz Muhammad Saad" />
    <meta name="DC.publisher" content="Hafiz Muhammad Saad" />
    <meta name="DC.language" content="en" />
    <meta name="DC.coverage" content="Worldwide" />
`;

const pages = [
    {
        file: 'index.html',
        title: 'Hafiz Muhammad Saad | Senior Full-Stack Engineer &amp; Systems Architect (.NET 10 &amp; MERN)',
        canonical: 'https://hmsofficial.netlify.app/',
        description: 'Official portfolio of Hafiz Muhammad Saad — Senior Full-Stack Software Engineer & Systems Architect specializing in ASP.NET Core 10, C#, MERN Stack, React 19, and Zero-Trust Cloud Architecture.',
        keywords: 'Hafiz Muhammad Saad, HMS Developer, Full Stack Developer Karachi, Senior Software Engineer Pakistan, ASP.NET Core 10, C# Developer, MERN Stack Expert, React 19, Node.js, Systems Architecture, Cybersecurity Zero-Trust, NED Academy Management System, Nexora Digital Agency, Hire .NET Developer',
        ogImage: 'https://hmsofficial.netlify.app/images/projects/ned-academy-system.jpg',
        breadcrumb: 'Home',
        schema: {
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "WebSite",
                    "@id": "https://hmsofficial.netlify.app/#website",
                    "url": "https://hmsofficial.netlify.app/",
                    "name": "Hafiz Muhammad Saad Portfolio",
                    "description": "High-Performance Developer Portfolio & Systems Architecture Portal",
                    "publisher": { "@id": "https://hmsofficial.netlify.app/#person" }
                },
                {
                    "@type": "Person",
                    "@id": "https://hmsofficial.netlify.app/#person",
                    "name": "Hafiz Muhammad Saad",
                    "alternateName": ["HMS Developer", "Saad Developer", "Muhammad Saad"],
                    "url": "https://hmsofficial.netlify.app",
                    "email": "saad.sa9112@gmail.com",
                    "telephone": "+92 305 5188896",
                    "image": "https://hmsofficial.netlify.app/images/profile.png",
                    "jobTitle": "Senior Full-Stack Software Engineer & Systems Architect",
                    "address": {
                        "@type": "PostalAddress",
                        "addressLocality": "Karachi",
                        "addressRegion": "Sindh",
                        "addressCountry": "Pakistan"
                    },
                    "alumniOf": [
                        { "@type": "CollegeOrUniversity", "name": "Sohail University, Karachi", "description": "BS in Business Computing (BSBC)" },
                        { "@type": "EducationalOrganization", "name": "Aptech Learning, Karachi", "description": "Advanced Diploma in Software Engineering (ADSE)" }
                    ],
                    "knowsAbout": ["C#", ".NET 10", "ASP.NET Core MVC", "MERN Stack", "React 19", "Node.js", "MongoDB", "SQL Server", "Zero-Trust Architecture", "Entity Framework Core", "REST APIs", "Cybersecurity", "eBPF", "Docker"],
                    "sameAs": [
                        "https://github.com/saadsa9112-cloud",
                        "https://linkedin.com"
                    ]
                },
                {
                    "@type": "ProfessionalService",
                    "name": "HMS Software Engineering & Architecture Consulting",
                    "url": "https://hmsofficial.netlify.app",
                    "priceRange": "$$$",
                    "areaServed": "Global / Worldwide",
                    "provider": { "@id": "https://hmsofficial.netlify.app/#person" },
                    "serviceType": ["Enterprise Web Development", "Cloud Architecture", "Database Optimization", "Security Auditing"]
                },
                {
                    "@type": "ItemList",
                    "name": "Featured Software Engineering Deployments",
                    "itemListElement": [
                        {
                            "@type": "SoftwareApplication",
                            "position": 1,
                            "name": "NED Academy University Management System (UMS)",
                            "applicationCategory": "BusinessApplication",
                            "operatingSystem": "Web Browser / Cloud Runtimes",
                            "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
                            "description": "Enterprise Academic Course, Student & Department Management Architecture engineered with ASP.NET Core MVC, C#, EF Core, and SQL Server."
                        },
                        {
                            "@type": "SoftwareApplication",
                            "position": 2,
                            "name": "Nexora Digital Agency & Client Solutions Platform",
                            "applicationCategory": "BusinessApplication",
                            "operatingSystem": "Web Browser",
                            "url": "https://nexoradigital.netlify.app",
                            "description": "Modern responsive digital agency platform featuring dynamic multi-currency pricing, interactive quotation builder, and fluid animations."
                        }
                    ]
                }
            ]
        }
    },
    {
        file: 'about/index.html',
        title: 'About Hafiz Muhammad Saad | Software Developer, Cloud Architect &amp; Bio',
        canonical: 'https://hmsofficial.netlify.app/about/',
        description: 'Learn about Hafiz Muhammad Saad (HMS Developer) — Education (BSBC Sohail University, ADSE Aptech), professional experience, technical philosophy, and enterprise track record.',
        keywords: 'About Hafiz Muhammad Saad, HMS Developer Biography, Sohail University BSBC, Aptech Learning ADSE, C# Engineer Experience, .NET Developer Bio, Karachi Software Architect',
        ogImage: 'https://hmsofficial.netlify.app/images/profile.png',
        breadcrumb: 'About',
        schema: {
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "ProfilePage",
                    "name": "About Hafiz Muhammad Saad",
                    "url": "https://hmsofficial.netlify.app/about/",
                    "mainEntity": { "@id": "https://hmsofficial.netlify.app/#person" }
                },
                {
                    "@type": "BreadcrumbList",
                    "itemListElement": [
                        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://hmsofficial.netlify.app/" },
                        { "@type": "ListItem", "position": 2, "name": "About", "item": "https://hmsofficial.netlify.app/about/" }
                    ]
                }
            ]
        }
    },
    {
        file: 'portfolio/index.html',
        title: 'Enterprise Projects &amp; Systems Showcase | Hafiz Muhammad Saad',
        canonical: 'https://hmsofficial.netlify.app/portfolio/',
        description: 'Explore production-grade enterprise web applications built by Hafiz Muhammad Saad, including NED Academy UMS (ASP.NET Core / EF Core / SQL Server) and Nexora Agency.',
        keywords: 'Hafiz Muhammad Saad Projects, ASP.NET Core MVC Projects, MERN Stack Portfolio, NED Academy UMS System, Nexora Digital Agency, C# Web Applications, Full Stack Case Studies',
        ogImage: 'https://hmsofficial.netlify.app/images/projects/ned-academy-system.jpg',
        breadcrumb: 'Portfolio',
        schema: {
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "CollectionPage",
                    "name": "Engineering Projects Showcase",
                    "url": "https://hmsofficial.netlify.app/portfolio/",
                    "description": "Curated directory of production enterprise platforms and systems architecture projects by Hafiz Muhammad Saad."
                },
                {
                    "@type": "BreadcrumbList",
                    "itemListElement": [
                        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://hmsofficial.netlify.app/" },
                        { "@type": "ListItem", "position": 2, "name": "Portfolio", "item": "https://hmsofficial.netlify.app/portfolio/" }
                    ]
                }
            ]
        }
    },
    {
        file: 'blog/index.html',
        title: 'Tech Logs &amp; Engineering Articles | Architecture &amp; Cybersecurity Insights',
        canonical: 'https://hmsofficial.netlify.app/blog/',
        description: 'In-depth technical publications on Zero-Trust Cybersecurity in .NET 10, sub-millisecond API caching architectures with Redis, and AI autonomous agent choreography.',
        keywords: 'Software Engineering Articles, Zero-Trust .NET 10, High-Throughput Redis Caching, Autonomous AI Agents, Hafiz Muhammad Saad Tech Logs, Full-Stack Architecture Blog',
        ogImage: 'https://hmsofficial.netlify.app/images/blogs/software-development-2027.svg',
        breadcrumb: 'Tech Logs',
        schema: {
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "Blog",
                    "name": "HMS Developer Tech Logs",
                    "url": "https://hmsofficial.netlify.app/blog/",
                    "description": "Technical insights on software engineering, distributed systems, and zero-trust cybersecurity."
                },
                {
                    "@type": "BreadcrumbList",
                    "itemListElement": [
                        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://hmsofficial.netlify.app/" },
                        { "@type": "ListItem", "position": 2, "name": "Tech Logs", "item": "https://hmsofficial.netlify.app/blog/" }
                    ]
                }
            ]
        }
    },
    {
        file: 'contact/index.html',
        title: 'Contact &amp; Hire Operator | Hafiz Muhammad Saad (Full-Stack Engineer)',
        canonical: 'https://hmsofficial.netlify.app/contact/',
        description: 'Initiate secure communication with Hafiz Muhammad Saad for enterprise engineering contracts, full-stack consulting (.NET / MERN), or software architecture engagements.',
        keywords: 'Contact Hafiz Muhammad Saad, Hire Full-Stack Developer, Hire .NET 10 Architect Karachi, MERN Stack Consultant, Software Engineer Contact',
        ogImage: 'https://hmsofficial.netlify.app/images/profile.png',
        breadcrumb: 'Contact',
        schema: {
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "ContactPage",
                    "name": "Contact Hafiz Muhammad Saad",
                    "url": "https://hmsofficial.netlify.app/contact/",
                    "mainEntity": {
                        "@type": "Person",
                        "name": "Hafiz Muhammad Saad",
                        "email": "saad.sa9112@gmail.com",
                        "telephone": "+92 305 5188896"
                    }
                },
                {
                    "@type": "BreadcrumbList",
                    "itemListElement": [
                        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://hmsofficial.netlify.app/" },
                        { "@type": "ListItem", "position": 2, "name": "Contact", "item": "https://hmsofficial.netlify.app/contact/" }
                    ]
                }
            ]
        }
    }
];

pages.forEach(p => {
    const filePath = path.join(clientDir, p.file);
    if (!fs.existsSync(filePath)) return;

    let content = fs.readFileSync(filePath, 'utf8');

    // 1. Remove obsolete anti-caching meta tags from public pages that harm SEO
    content = content.replace(/<meta http-equiv="Cache-Control"[^>]*>\s*/gi, '');
    content = content.replace(/<meta http-equiv="Pragma"[^>]*>\s*/gi, '');
    content = content.replace(/<meta http-equiv="Expires"[^>]*>\s*/gi, '');

    // 2. Remove any old title, description, keywords, canonical, OG, Twitter, and ld+json tags
    content = content.replace(/<title>[\s\S]*?<\/title>/i, '');
    content = content.replace(/<meta name="title"[^>]*>\s*/gi, '');
    content = content.replace(/<meta name="description"[^>]*>\s*/gi, '');
    content = content.replace(/<meta name="keywords"[^>]*>\s*/gi, '');
    content = content.replace(/<meta name="robots"[^>]*>\s*/gi, '');
    content = content.replace(/<link rel="canonical"[^>]*>\s*/gi, '');
    content = content.replace(/<meta property="og:[^>]*>\s*/gi, '');
    content = content.replace(/<meta name="twitter:[^>]*>\s*/gi, '');
    content = content.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>\s*/gi, '');

    // 3. Construct extreme SEO head block
    const extremeSeoHead = `
    <!-- Extreme Next-Level SEO Engine (Google, Bing, Social, Rich Snippets) -->
    <title>${p.title}</title>
    <meta name="description" content="${p.description}" />
    <meta name="keywords" content="${p.keywords}" />
    <link rel="canonical" href="${p.canonical}" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />

    <!-- Open Graph (Facebook, LinkedIn, Discord) -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${p.canonical}" />
    <meta property="og:title" content="${p.title}" />
    <meta property="og:description" content="${p.description}" />
    <meta property="og:image" content="${p.ogImage}" />
    <meta property="og:image:secure_url" content="${p.ogImage}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${p.title}" />
    <meta property="og:site_name" content="HMS Developer | Systems Architecture" />
    <meta property="og:locale" content="en_US" />

    <!-- Twitter / X Cards -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="${p.canonical}" />
    <meta name="twitter:title" content="${p.title}" />
    <meta name="twitter:description" content="${p.description}" />
    <meta name="twitter:image" content="${p.ogImage}" />
    <meta name="twitter:image:alt" content="${p.title}" />
    <meta name="twitter:creator" content="@saadsa9112" />
    <meta name="twitter:site" content="@saadsa9112" />

    ${globalResourceHints}

    <!-- Structured Data: Extreme Schema.org Entity Graph -->
    <script type="application/ld+json">
${JSON.stringify(p.schema, null, 2)}
    </script>
`;

    // 4. Inject right after <head>
    content = content.replace(/<head>/i, '<head>\n' + extremeSeoHead);

    // 5. Semantic inline alt attributes verification for images
    content = content.replace(/<img(?![^>]*\balt=)([^>]*)>/gi, '<img alt="Hafiz Muhammad Saad Systems Architecture Project"$1>');

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Injected extreme SEO into ${p.file}`);
});

console.log("All pages updated with extreme SEO!");
