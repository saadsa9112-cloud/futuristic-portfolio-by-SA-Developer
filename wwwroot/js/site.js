// FUTURISTIC PREMIUM PORTFOLIO INTERACTION ENGINE

document.addEventListener("DOMContentLoaded", () => {
    // ==========================================
    // 1. Loader Screen Controller
    // ==========================================
    const loader = document.getElementById("loader-screen");
    if (loader) {
        setTimeout(() => {
            loader.style.opacity = "0";
            setTimeout(() => {
                loader.style.display = "none";
            }, 500);
        }, 1200);
    }

    let adminAccessAttempts = 0;

    // ==========================================
    // 2. Site Preferences State Manager
    // ==========================================
    const getPreferences = () => {
        const defaultPrefs = { sound: false, glitch: false, particles: true, diagnostic: true };
        try {
            const saved = localStorage.getItem("sitePreferences");
            return saved ? { ...defaultPrefs, ...JSON.parse(saved) } : defaultPrefs;
        } catch (e) {
            return defaultPrefs;
        }
    };

    let preferences = getPreferences();

    const applyPreferencesUI = () => {
        const soundToggle = document.getElementById("pref-sound-toggle");
        const glitchToggle = document.getElementById("pref-glitch-toggle");
        const particlesToggle = document.getElementById("pref-particles-toggle");
        const diagnosticToggle = document.getElementById("pref-diagnostic-toggle");

        if (soundToggle) soundToggle.checked = preferences.sound;
        if (glitchToggle) glitchToggle.checked = preferences.glitch;
        if (particlesToggle) particlesToggle.checked = preferences.particles;
        if (diagnosticToggle) diagnosticToggle.checked = preferences.diagnostic;

        const particlesEl = document.getElementById("particles-js");
        if (particlesEl) particlesEl.style.display = preferences.particles ? "block" : "none";

        const diagnosticEl = document.getElementById("system-diagnostic");
        if (diagnosticEl) diagnosticEl.style.display = preferences.diagnostic ? "inline-block" : "none";
    };

    applyPreferencesUI();

    const savePrefBtn = document.getElementById("save-preferences-btn");
    if (savePrefBtn) {
        savePrefBtn.addEventListener("click", () => {
            const soundToggle = document.getElementById("pref-sound-toggle");
            const glitchToggle = document.getElementById("pref-glitch-toggle");
            const particlesToggle = document.getElementById("pref-particles-toggle");
            const diagnosticToggle = document.getElementById("pref-diagnostic-toggle");

            preferences = {
                sound: !!(soundToggle && soundToggle.checked),
                glitch: !!(glitchToggle && glitchToggle.checked),
                particles: !!(particlesToggle && particlesToggle.checked),
                diagnostic: !!(diagnosticToggle && diagnosticToggle.checked)
            };

            localStorage.setItem("sitePreferences", JSON.stringify(preferences));
            applyPreferencesUI();
        });
    }

    // ==========================================
    // 3. Synthesized Sound Effects Engine (Web Audio API)
    // ==========================================
    const playSynthSound = (type) => {
        if (!preferences.sound) return;
        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return;
            const ctx = new AudioCtx();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.connect(gain);
            gain.connect(ctx.destination);

            if (type === 'hover') {
                // Soft neon chirp sweep on hover
                osc.type = 'sine';
                osc.frequency.setValueAtTime(850, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(1150, ctx.currentTime + 0.08);
                gain.gain.setValueAtTime(0.015, ctx.currentTime);
                gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.08);
                osc.start();
                osc.stop(ctx.currentTime + 0.08);
            } else if (type === 'click') {
                // Solid click/switch sound on action
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(550, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(250, ctx.currentTime + 0.12);
                gain.gain.setValueAtTime(0.07, ctx.currentTime);
                gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.12);
                osc.start();
                osc.stop(ctx.currentTime + 0.12);
            } else if (type === 'console') {
                // Neon terminal chime
                osc.type = 'sine';
                osc.frequency.setValueAtTime(950, ctx.currentTime);
                osc.frequency.setValueAtTime(1250, ctx.currentTime + 0.06);
                gain.gain.setValueAtTime(0.04, ctx.currentTime);
                gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.22);
                osc.start();
                osc.stop(ctx.currentTime + 0.22);
            } else if (type === 'alert') {
                // Cyber security warning alarm sequence
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(180, ctx.currentTime);
                osc.frequency.linearRampToValueAtTime(380, ctx.currentTime + 0.15);
                osc.frequency.linearRampToValueAtTime(180, ctx.currentTime + 0.3);
                gain.gain.setValueAtTime(0.08, ctx.currentTime);
                gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3);
                osc.start();
                osc.stop(ctx.currentTime + 0.3);
            }
        } catch (e) {}
    };

    // ==========================================
    // 3. Custom Cursor & Glow Trackers
    // ==========================================
    const cursor = document.querySelector(".custom-cursor");
    const cursorDot = document.querySelector(".custom-cursor-dot");
    const ambientGlow = document.querySelector(".ambient-glow");

    if (cursor && cursorDot) {
        document.addEventListener("mousemove", (e) => {
            cursor.style.left = `${e.clientX}px`;
            cursor.style.top = `${e.clientY}px`;
            cursorDot.style.left = `${e.clientX}px`;
            cursorDot.style.top = `${e.clientY}px`;

            if (ambientGlow) {
                ambientGlow.style.left = `${e.clientX}px`;
                ambientGlow.style.top = `${e.clientY}px`;
            }
        });

        // Add hover effects and trigger hover sound
        const hoverables = document.querySelectorAll("a, button, input, select, textarea, .quick-chip, .clickable, .tech-icon-box");
        hoverables.forEach((item) => {
            item.addEventListener("mouseenter", () => {
                cursor.classList.add("cursor-hover");
                playSynthSound('hover');
            });
            item.addEventListener("mouseleave", () => {
                cursor.classList.remove("cursor-hover");
            });
            item.addEventListener("click", () => {
                playSynthSound('click');
            });
        });
    }

    // ==========================================
    // 4. Scroll Progress Indicator
    // ==========================================
    const scrollBar = document.getElementById("scroll-progress");
    if (scrollBar) {
        window.addEventListener("scroll", () => {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            scrollBar.style.width = `${scrolled}%`;
        });
    }

    // ==========================================
    // 5. Initialize Particles.js
    // ==========================================
    if (window.particlesJS) {
        particlesJS("particles-js", {
            "particles": {
                "number": { "value": 60, "density": { "enable": true, "value_area": 800 } },
                "color": { "value": "#a855f7" },
                "shape": { "type": "circle" },
                "opacity": { "value": 0.25, "random": true },
                "size": { "value": 2.5, "random": true },
                "line_linked": { "enable": true, "distance": 150, "color": "#3b82f6", "opacity": 0.15, "width": 1 },
                "move": { "enable": true, "speed": 1.2, "direction": "none", "random": true, "straight": false, "out_mode": "out" }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": { "onhover": { "enable": true, "mode": "grab" }, "onclick": { "enable": true, "mode": "push" } },
                "modes": { "grab": { "distance": 140, "line_linked": { "opacity": 0.4 } } }
            },
            "retina_detect": true
        });
    }

    // ==========================================
    // 6. Initialize AOS (Animate on Scroll)
    // ==========================================
    if (window.AOS) {
        AOS.init({
            duration: 800,
            easing: "ease-in-out-cubic",
            once: true
        });
    }

    // ==========================================
    // 7. Skill Bars Viewport Animation Trigger
    // ==========================================
    const fills = document.querySelectorAll(".skill-progress-fill");
    if (fills.length > 0) {
        const fillSkillBars = () => {
            fills.forEach(bar => {
                const percent = bar.getAttribute("data-percent");
                if (percent) {
                    bar.style.width = `${percent}%`;
                }
            });
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    fillSkillBars();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        fills.forEach(fill => observer.observe(fill));
        // Fallback immediate fill
        setTimeout(fillSkillBars, 300);
    }

    // ==========================================
    // 8. Saad's AI Assistant Widget (Production-Ready UI/UX)
    // ==========================================
    const aiToggleBtn = document.getElementById("ai-chat-toggle");
    const aiWidget = document.getElementById("ai-chat-widget");
    const aiCloseBtn = document.getElementById("ai-chat-close");
    const aiInput = document.getElementById("ai-user-message");
    const aiSendBtn = document.getElementById("ai-send-message");
    const aiMessages = document.getElementById("ai-messages-container");

    if (aiToggleBtn && aiWidget) {
        const welcomeMessage = "Hi! I'm Saad's AI Assistant 👋\n\nI can help you explore Saad's skills, projects, education, experience, and technical background.\n\nWhat would you like to know?";

        aiToggleBtn.addEventListener("click", () => {
            aiWidget.classList.toggle("active");
            if (aiWidget.classList.contains("active")) {
                if (aiInput) aiInput.focus();
                if (aiMessages && aiMessages.children.length === 0) {
                    renderMessage(welcomeMessage, "bot");
                }
            }
        });

        if (aiCloseBtn) {
            aiCloseBtn.addEventListener("click", () => {
                aiWidget.classList.remove("active");
            });
        }

        // Global Escape key listener to close assistant widget
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && aiWidget.classList.contains("active")) {
                aiWidget.classList.remove("active");
            }
        });

        const generateClientAiResponse = (userMessage) => {
            const query = (userMessage || "").toLowerCase().trim();
            const variantIndex = Math.floor(Math.random() * 3);
            
            // 1. Greetings & Identity
            if (query.includes("hello") || query.includes("hi") || query.includes("hey") || query.includes("greetings") || query.includes("who are you") || query.includes("what can you do") || query.includes("about saad") || query.includes("how are you")) {
                const greetings = [
                    "Hi! I'm Saad's AI Assistant 👋\n\nSaad is a Full-Stack Software Developer specializing in ASP.NET Core MVC, C#, SQL Server, normalized database architectures, and responsive web application engineering.\n\nWhat would you like to explore about Saad today?",
                    "Hello! Welcome to Saad's Portfolio 🌐\n\nI'm Saad's AI concierge. I can answer any questions regarding Saad's software projects, core tech stack, academic background (BSBC & ADSE), or contact info.",
                    "Greetings! I'm ready to assist you ⚡\n\nSaad builds enterprise web systems and modern responsive user interfaces. Feel free to ask me anything or click one of the suggested chips below!"
                ];
                return greetings[variantIndex % greetings.length];
            }
            
            // 2. Projects & Deployments
            if (query.includes("project") || query.includes("work") || query.includes("built") || query.includes("created") || query.includes("portfolio") || query.includes("app") || query.includes("system") || query.includes("developed")) {
                const projectVariants = [
                    "### 🚀 Featured Projects & Systems\n\n*   **[Full-Stack Enterprise Developer Portfolio](/Portfolio)**\n    *Built with C#, ASP.NET Core 10 MVC, SQL Server, and dynamic Light/Dark mode themes.*\n    *Tech Stack: C#, ASP.NET Core 10, SQL Server, JavaScript*\n    [View Case Study](/Portfolio)\n\n*   **[HMS Analytics & Telemetry Engine](/Portfolio)**\n    *Real-time visitor tracking, geolocation lookup, session duration, and administrative telemetry dashboard.*\n    *Tech Stack: ASP.NET Core, EF Core, SQL Server, SignalR*\n    [View Case Study](/Portfolio)\n\nYou can explore all project case studies on the [Projects Databank](/Portfolio).",
                    "### 🛠️ Saad's Engineering Highlights\n\nSaad has engineered scalable software systems focused on enterprise database architecture and clean UI design:\n\n1. **Enterprise Developer Portfolio**: C# / .NET 10 MVC web app with custom CSS design tokens & real-time telemetry integration.\n2. **Visitor Analytics Engine**: Geolocation tracking, session duration analytics, and SQL Server persistence.\n\nVisit the [Projects Directory](/Portfolio) to inspect live code details!",
                    "### 💻 Software Solutions & Projects\n\nHere are Saad's core project deployments:\n• **ASP.NET Core Enterprise Portfolio**: Full-stack MVC application with responsive glassmorphic UI.\n• **Real-Time Telemetry Engine**: Back-end visitor tracking and IP geolocation system.\n\nCheck out the full list on the [Projects Page](/Portfolio)."
                ];
                return projectVariants[variantIndex % projectVariants.length];
            }
            
            // 3. Tech Stack & Skills
            if (query.includes("skill") || query.includes("technolog") || query.includes("language") || query.includes("stack") || query.includes("c#") || query.includes("dotnet") || query.includes("sql") || query.includes("javascript") || query.includes("css") || query.includes("html") || query.includes("php") || query.includes("tool") || query.includes("use") || query.includes("know")) {
                const skillVariants = [
                    "### 🛠️ Saad's Core Tech Stack\n\n*   **ASP.NET Core MVC** (`95%`)\n*   **C# / .NET 10** (`95%`)\n*   **SQL Server & Relational DB Architecture** (`90%`)\n*   **HTML5, CSS3, JavaScript** (`92%`)\n*   **PHP & MySQL** (`85%`)\n*   **Git & Version Control** (`90%`)\n\nSaad specializes in constructing normalized database schemas, RESTful Web APIs, and high-performance MVC web applications.",
                    "### ⚡ Technical Skills & Frameworks\n\nSaad's core engineering toolkit includes:\n- **Backend**: C#, ASP.NET Core 10, Entity Framework Core, SQL Server, PHP, MySQL\n- **Frontend**: JavaScript (ES6+), HTML5, CSS3 (Vanilla CSS, Glassmorphic UI Design)\n- **Tools**: Git, GitHub, Visual Studio 2022, SSMS, IIS Server",
                    "### 🔍 Specialized Capabilities\n\nSaad brings expertise in:\n• **Relational Database Design**: Table normalization, indexing, stored procedures & EF Core.\n• **Full-Stack Web Development**: Building responsive C# ASP.NET Core MVC systems from scratch.\n• **Modern UI/UX Engineering**: Glassmorphic interfaces with full Light & Dark mode support."
                ];
                return skillVariants[variantIndex % skillVariants.length];
            }

            // 4. Education & Academic Background
            if (query.includes("education") || query.includes("degree") || query.includes("university") || query.includes("college") || query.includes("aptech") || query.includes("sohail") || query.includes("study") || query.includes("diploma") || query.includes("academic") || query.includes("bsbc") || query.includes("adse")) {
                return "### 🎓 Academic Credentials & Diplomas\n\n*   **CURRENT DEGREE**: BSBC (Bachelor of Science in Business Computing)\n    *Sohail University (2025–2029)*\n\n*   **PROFESSIONAL DIPLOMA**: ADSE (Advanced Diploma in Software Engineering)\n    *Aptech Learning (2024–2027)*";
            }

            // 5. Professional Experience & Role
            if (query.includes("experience") || query.includes("work history") || query.includes("job") || query.includes("career") || query.includes("company") || query.includes("role")) {
                return "### 💼 Professional Experience\n\n*   **Full-Stack Software Developer (1+ Years)**\n    *Specializing in C#, ASP.NET Core MVC, Entity Framework Core, SQL Server database design, and responsive web application development.*";
            }

            // 6. Services & Custom Build Requests ("Can Saad build X?")
            if (query.includes("can saad") || query.includes("build") || query.includes("develop") || query.includes("make") || query.includes("create") || query.includes("service") || query.includes("freelance")) {
                return "### ⚙️ Development Services & Solutions\n\nSaad can engineer custom full-stack solutions including:\n• **Enterprise Web Applications** (ASP.NET Core MVC & SQL Server)\n• **RESTful APIs & Backend Services**\n• **Responsive Portfolio & Corporate Websites**\n• **Database Optimization & Schema Normalization**\n\nWould you like to discuss a project directly on WhatsApp?\n\n[Chat on WhatsApp](https://wa.me/923055188896?text=Hi%20Saad,%20I%20have%20a%20project%20inquiry!)";
            }

            // 7. Hiring, Rates & Availability
            if (query.includes("hire") || query.includes("salary") || query.includes("cost") || query.includes("price") || query.includes("rate") || query.includes("available") || query.includes("remote")) {
                return "### 💼 Hiring & Engagement Opportunities\n\nSaad is open to full-time software engineering roles, contract work, and freelance projects.\n\n*   **Email**: saad.sa9112@gmail.com\n*   **Phone**: +92 305 5188896\n*   **Location**: Karachi, Pakistan\n\n[Chat on WhatsApp](https://wa.me/923055188896?text=Hi%20Saad,%20I%20saw%20your%20portfolio%20and%20would%20like%20to%20discuss%20an%20opportunity!)";
            }
            
            // 8. Contact Info & Location & WhatsApp Direct Redirect
            if (query.includes("contact") || query.includes("email") || query.includes("phone") || query.includes("whatsapp") || query.includes("reach") || query.includes("location") || query.includes("address") || query.includes("number")) {
                return "### 📞 Get in Touch with Saad\n\n*   **Email**: saad.sa9112@gmail.com\n*   **Phone**: +92 305 5188896\n*   **Location**: Karachi, Pakistan\n\nClick below to open a direct chat with Saad on WhatsApp:\n\n[Chat on WhatsApp](https://wa.me/923055188896?text=Hi%20Saad,%20I%20viewed%20your%20portfolio%20and%20would%20like%20to%20connect!)";
            }
            
            // 9. CV / Resume Download Direct Link
            if (query.includes("cv") || query.includes("resume") || query.includes("download") || query.includes("pdf")) {
                return "Sure! You can download Saad's latest CV directly below:\n\n[Download CV (PDF)](/files/Muhammad_Saad_CV.pdf)";
            }

            // 10. Intelligent Dynamic Fallback
            const smartFallbacks = [
                `I understand you're asking about "${userMessage}". While I'm focused primarily on Saad's software development portfolio, I can help you explore:\n\n• **Projects**: *What has Saad built?*\n• **Skills**: *What is his tech stack?*\n• **Education**: *What are his qualifications?*\n• **CV**: *Download resume*\n• **Contact**: *Connect on WhatsApp*\n\n[Chat on WhatsApp](https://wa.me/923055188896?text=Hi%20Saad!)`,
                `Thanks for your query! I specialize in providing details about Hafiz Muhammad Saad's technical work.\n\nTry asking:\n- *"What projects has Saad built?"*\n- *"What technologies does Saad use?"*\n- *"Where did Saad study?"*\n- *"Download CV"*`,
                `I'd be glad to assist with details about Saad's development background! You can inquire about his **Projects**, **Tech Stack**, **Academic Degrees**, **Work Experience**, or **Contact Info**.`
            ];
            return smartFallbacks[variantIndex % smartFallbacks.length];
        };

        const processUserQuery = (text) => {
            if (!text) return;
            renderMessage(text, "user");
            if (aiInput) aiInput.value = "";
            showTypingIndicator();

            // Realistic AI thinking delay (750ms - 1350ms) for a natural, authentic AI feel
            const thinkingDelay = Math.floor(Math.random() * 600) + 750;

            setTimeout(() => {
                fetch("/api/ai/chat", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ message: text })
                })
                .then(res => {
                    if (!res.ok) throw new Error("HTTP error " + res.status);
                    return res.json();
                })
                .then(data => {
                    hideTypingIndicator();
                    renderMessage(data.reply || generateClientAiResponse(text), "bot");
                })
                .catch(() => {
                    hideTypingIndicator();
                    renderMessage(generateClientAiResponse(text), "bot");
                });
            }, thinkingDelay);
        };

        if (aiSendBtn) {
            aiSendBtn.addEventListener("click", () => {
                const text = aiInput ? aiInput.value.trim() : "";
                processUserQuery(text);
            });
        }
        if (aiInput) {
            aiInput.addEventListener("keydown", (e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    const text = aiInput.value.trim();
                    processUserQuery(text);
                }
            });
        }

        document.addEventListener("click", (e) => {
            const chip = e.target.closest(".quick-chip");
            if (chip) {
                const text = chip.getAttribute("data-query");
                if (text) {
                    processUserQuery(text);
                }
            }
        });
    }

    function renderMessage(text, sender) {
        if (!aiMessages) return;
        const msgDiv = document.createElement("div");
        msgDiv.className = `chat-message ${sender}`;

        let formattedText = text
            .replace(/### (.*)/g, '<h6 class="fw-bold mb-2">$1</h6>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code class="px-1.5 py-0.5 rounded bg-dark border border-secondary text-neon-cyan">$1</code>')
            .replace(/\[Chat on WhatsApp\]\((.*?)\)/g, '<a href="$1" target="_blank" rel="noopener noreferrer" class="btn btn-sm text-white px-3 py-1.5 rounded-pill shadow-sm d-inline-flex align-items-center gap-1.5 my-1.5 hover-scale transition" style="background: #25D366; font-weight: 600;"><i class="fab fa-whatsapp fs-6"></i> Chat on WhatsApp</a>')
            .replace(/\[Download CV \(PDF\)\]\((.*?)\)/g, '<a href="$1" download="Muhammad_Saad_CV.pdf" class="btn btn-sm text-white px-3 py-1.5 rounded-pill shadow-sm d-inline-flex align-items-center gap-1.5 my-1.5 hover-scale transition" style="background: linear-gradient(135deg, #8B3DFF, #009FC2); font-weight: 600;"><i class="fas fa-file-download fs-6"></i> Download CV (PDF)</a>')
            .replace(/\[Download Resume \(PDF\)\]\((.*?)\)/g, '<a href="$1" download="Muhammad_Saad_CV.pdf" class="btn btn-sm text-white px-3 py-1.5 rounded-pill shadow-sm d-inline-flex align-items-center gap-1.5 my-1.5 hover-scale transition" style="background: linear-gradient(135deg, #8B3DFF, #009FC2); font-weight: 600;"><i class="fas fa-file-download fs-6"></i> Download CV (PDF)</a>')
            .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-neon-cyan fw-medium text-decoration-underline">$1</a>')
            .replace(/(\+92\s?305\s?5188896|03055188896)/g, '<a href="https://wa.me/923055188896?text=Hi%20Saad,%20I%20saw%20your%20portfolio%20and%20would%20like%20to%20connect!" target="_blank" rel="noopener noreferrer" class="text-success fw-bold text-decoration-none d-inline-flex align-items-center gap-1"><i class="fab fa-whatsapp"></i> $1</a>')
            .replace(/\* (.*)/g, '<li class="mb-1">$1</li>')
            .replace(/• (.*)/g, '<li class="mb-1">$1</li>')
            .replace(/\n/g, '<br>');

        if (formattedText.includes("<li>")) {
            formattedText = `<ul class="ps-3 mb-0">${formattedText}</ul>`;
        }

        msgDiv.innerHTML = formattedText;
        aiMessages.appendChild(msgDiv);
        aiMessages.scrollTop = aiMessages.scrollHeight;
    }

    function showTypingIndicator() {
        if (!aiMessages) return;
        const typingDiv = document.createElement("div");
        typingDiv.id = "ai-typing-indicator";
        typingDiv.className = "chat-message bot d-flex align-items-center gap-2";
        typingDiv.innerHTML = `<span class="small text-muted font-monospace">AI is thinking...</span> <div class="typing-indicator ms-1"><span></span><span></span><span></span></div>`;
        aiMessages.appendChild(typingDiv);
        aiMessages.scrollTop = aiMessages.scrollHeight;
    }

    function hideTypingIndicator() {
        const indicator = document.getElementById("ai-typing-indicator");
        if (indicator) {
            indicator.remove();
        }
    }

    // ==========================================
    // 9. Futuristic Command Palette (Ctrl+K Controller)
    // ==========================================
    const palette = document.getElementById("command-palette");
    const cmdSearch = document.getElementById("command-search");
    const cmdResults = document.getElementById("command-results");

    if (palette && cmdSearch) {
        // Toggle Palette
        const togglePalette = () => {
            const isActive = palette.classList.toggle("active");
            if (isActive) {
                cmdSearch.value = "";
                cmdSearch.focus();
                playSynthSound('console');
                // Reset search results list
                const items = cmdResults.querySelectorAll(".command-item");
                items.forEach((item, index) => {
                    item.style.display = "flex";
                    if (index === 0) item.classList.add("selected");
                    else item.classList.remove("selected");
                });
            }
        };

        // Open palette on Ctrl+K or /
        document.addEventListener("keydown", (e) => {
            if ((e.ctrlKey && e.key.toLowerCase() === "k") || (e.key === "/" && document.activeElement !== cmdSearch && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA')) {
                e.preventDefault();
                togglePalette();
            }
            if (e.key === "Escape" && palette.classList.contains("active")) {
                palette.classList.remove("active");
            }
        });

        // Click outside to close
        palette.addEventListener("click", (e) => {
            if (e.target === palette) {
                palette.classList.remove("active");
            }
        });

        // Search Filter
        cmdSearch.addEventListener("input", () => {
            const query = cmdSearch.value.toLowerCase().trim();
            const items = cmdResults.querySelectorAll(".command-item");
            let firstVisible = null;

            items.forEach(item => {
                const text = item.textContent.toLowerCase();
                if (text.includes(query)) {
                    item.style.display = "flex";
                    item.classList.remove("selected");
                    if (!firstVisible) {
                        firstVisible = item;
                        item.classList.add("selected");
                    }
                } else {
                    item.style.display = "none";
                    item.classList.remove("selected");
                }
            });
        });

        // Arrow and Enter key navigations
        cmdSearch.addEventListener("keydown", (e) => {
            const items = Array.from(cmdResults.querySelectorAll(".command-item")).filter(i => i.style.display !== "none");
            let selectedIndex = items.findIndex(i => i.classList.contains("selected"));

            if (e.key === "ArrowDown") {
                e.preventDefault();
                if (selectedIndex >= 0) items[selectedIndex].classList.remove("selected");
                selectedIndex = (selectedIndex + 1) % items.length;
                items[selectedIndex].classList.add("selected");
                items[selectedIndex].scrollIntoView({ block: "nearest" });
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                if (selectedIndex >= 0) items[selectedIndex].classList.remove("selected");
                selectedIndex = (selectedIndex - 1 + items.length) % items.length;
                items[selectedIndex].classList.add("selected");
                items[selectedIndex].scrollIntoView({ block: "nearest" });
            } else if (e.key === "Enter") {
                e.preventDefault();
                if (cmdSearch.value.toLowerCase().trim() === "sudo admin") {
                    palette.classList.remove("active");
                    adminAccessAttempts++;
                    if (adminAccessAttempts >= 3) {
                        triggerDangerLockdown("Console Intrusion");
                    } else {
                        window.location.href = "/Admin/Dashboard";
                    }
                    return;
                }
                if (selectedIndex >= 0) {
                    executeCommand(items[selectedIndex]);
                }
            }
        });

        // Click executions
        cmdResults.addEventListener("click", (e) => {
            const item = e.target.closest(".command-item");
            if (item) {
                executeCommand(item);
            }
        });

        function executeCommand(item) {
            playSynthSound('click');
            palette.classList.remove("active");
            
            const action = item.getAttribute("data-action");
            if (action === "nav") {
                const url = item.getAttribute("data-url");
                if (url) window.location.href = url;
            } else if (action === "ai") {
                if (aiWidget) aiWidget.classList.add("active");
                if (aiInput) aiInput.focus();
            } else if (action === "contact") {
                const contactSec = document.getElementById("contact-section");
                if (contactSec) {
                    contactSec.scrollIntoView({ behavior: "smooth" });
                    const nameIn = contactSec.querySelector("input[name='Name']");
                    if (nameIn) setTimeout(() => nameIn.focus(), 600);
                }
            } else if (action === "sound") {
                playSynthSound('console');
            }
        }

        function triggerDangerLockdown(triggerSource) {
            if (!preferences.glitch) return;
            playSynthSound('alert');
            const dangerOverlay = document.getElementById("danger-security-overlay");
            const dangerCloseBtn = document.getElementById("danger-close-btn");
            if (dangerOverlay && dangerCloseBtn) {
                dangerOverlay.classList.add("active");
                dangerCloseBtn.disabled = true;
                
                let secondsLeft = 5;
                dangerCloseBtn.textContent = `SYSTEM LOCKDOWN IN ${secondsLeft}s...`;
                
                const timer = setInterval(() => {
                    secondsLeft--;
                    if (secondsLeft <= 0) {
                        clearInterval(timer);
                        dangerCloseBtn.disabled = false;
                        dangerCloseBtn.textContent = "Abort Handshake";
                    } else {
                        dangerCloseBtn.textContent = `SYSTEM LOCKDOWN IN ${secondsLeft}s...`;
                    }
                }, 1000);
            }
            if (typeof trackUserInterest === 'function') {
                trackUserInterest("Security Intrusion", `${triggerSource} - Attempts: ${adminAccessAttempts}`);
            }
        }

        // Double Key Navigator Shortcuts (G+H -> Home, G+P -> Projects, G+B -> Blog)
        let keysPressed = {};

        document.addEventListener("keydown", (e) => {
            if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') return;
            
            keysPressed[e.key.toLowerCase()] = true;
            
            if (keysPressed['g'] && keysPressed['h']) {
                window.location.href = "/";
            } else if (keysPressed['g'] && keysPressed['p']) {
                window.location.href = "/Portfolio";
            } else if (keysPressed['g'] && keysPressed['b']) {
                window.location.href = "/Blog";
            } else if (keysPressed['a'] && keysPressed['i']) {
                if (aiWidget) aiWidget.classList.add("active");
                if (aiInput) aiInput.focus();
            } else if (keysPressed['c'] && keysPressed['o']) {
                const contactSec = document.getElementById("contact-section");
                if (contactSec) contactSec.scrollIntoView({ behavior: "smooth" });
            } else if (keysPressed['s'] && keysPressed['a']) {
                adminAccessAttempts++;
                if (adminAccessAttempts >= 3) {
                    triggerDangerLockdown("Intrusion Bypass");
                } else {
                    window.location.href = "/Admin/Dashboard";
                }
            }
        });

        document.addEventListener("keyup", (e) => {
            delete keysPressed[e.key.toLowerCase()];
        });

        // Abort warning close handler
        const dangerCloseBtn = document.getElementById("danger-close-btn");
        const dangerOverlay = document.getElementById("danger-security-overlay");
        if (dangerCloseBtn && dangerOverlay) {
            dangerCloseBtn.addEventListener("click", () => {
                dangerOverlay.classList.remove("active");
                playSynthSound('click');
            });
        }
    }

    // ==========================================
    // 10. Futuristic Contact Form Transmission Logs
    // ==========================================
    const contactForm = document.getElementById("contact-form");
    const contactStatus = document.getElementById("contact-submit-status");

    if (contactForm && contactStatus) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();
            contactStatus.style.display = "block";
            contactStatus.className = "alert alert-dark shadow border border-secondary terminal-output-log p-3";
            contactStatus.innerHTML = "";

            const logs = [
                { text: "[INIT] Calibrating network socket...", delay: 100 },
                { text: "[RESOLVE] Host resolved: local-kestrel-server:5255", delay: 400 },
                { text: "[CONNECT] Establishing secure handshake tunnel...", delay: 750 },
                { text: "[ENCRYPT] Compiling message payload (SHA-256 validation)...", delay: 1100 },
                { text: "[TRANSIT] Syncing packet [=====>              ] 25% upload...", delay: 1500 },
                { text: "[TRANSIT] Syncing packet [============>       ] 60% upload...", delay: 1950 },
                { text: "[TRANSIT] Syncing packet [===================>] 100% success...", delay: 2300 },
                { text: "[RESPONSE] ASP.NET pipeline resolved. Executing databank sync...", delay: 2600 }
            ];

            // Staggered logs writer with audio chime feedback
            logs.forEach(log => {
                setTimeout(() => {
                    contactStatus.innerHTML += `<div><i class="fas fa-terminal text-neon-cyan me-1"></i> ${log.text}</div>`;
                    playSynthSound('console');
                }, log.delay);
            });

            // Fire fetch after logs print (at 2900ms)
            setTimeout(() => {
                const formData = new FormData(contactForm);
                const tokenInput = document.querySelector('input[name="__RequestVerificationToken"]');
                const token = tokenInput ? tokenInput.value : '';

                fetch("/Home/ContactSubmit", {
                    method: "POST",
                    headers: { "RequestVerificationToken": token },
                    body: formData
                })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        contactStatus.innerHTML += `<div class="text-success mt-2 fw-semibold"><i class="fas fa-check-circle me-1"></i> [SUCCESS] Handshake approved! Packet recorded in database.</div>`;
                        contactForm.reset();
                    } else {
                        contactStatus.innerHTML += `<div class="text-danger mt-2 fw-semibold"><i class="fas fa-times-circle me-1"></i> [FAILURE] Handshake rejected: ${data.errors.join(", ")}</div>`;
                    }
                })
                .catch(() => {
                    contactStatus.innerHTML += `<div class="text-danger mt-2 fw-semibold"><i class="fas fa-times-circle me-1"></i> [FAILURE] Transmission interrupted. Socket timed out.</div>`;
                });
            }, 2900);
        });
    }

    // ==========================================
    // 11. Interactive Tech Stack project filter
    // ==========================================
    const techBoxes = document.querySelectorAll(".tech-icon-box");
    techBoxes.forEach(box => {
        box.addEventListener("click", () => {
            const title = box.getAttribute("title");
            if (title) {
                // If on portfolio list page, populate the search field and filter immediately
                const portfolioSearch = document.querySelector("input[name='search']");
                if (portfolioSearch && portfolioSearch.closest("form")) {
                    portfolioSearch.value = title;
                    portfolioSearch.closest("form").submit();
                } else {
                    // Redirect to project list with technology filter
                    window.location.href = `/Portfolio?search=${encodeURIComponent(title)}`;
                }
            }
        });
    });

    // ==========================================
    // 12. Theme Toggle Controller (Dark / Light)
    // ==========================================
    const themeToggleBtn = document.getElementById("theme-toggle-btn");
    const themeIcon = document.getElementById("theme-icon");
    const body = document.body;

    if (themeToggleBtn && themeIcon) {
        // Load initial theme from localStorage
        const storedTheme = localStorage.getItem("theme");
        if (storedTheme === "light") {
            body.classList.add("light-theme");
            themeIcon.className = "fas fa-moon";
            themeToggleBtn.classList.remove("text-white");
            themeToggleBtn.classList.add("text-dark");
        } else {
            body.classList.remove("light-theme");
            themeIcon.className = "fas fa-sun";
            themeToggleBtn.classList.remove("text-dark");
            themeToggleBtn.classList.add("text-white");
        }

        themeToggleBtn.addEventListener("click", () => {
            playSynthSound('click');
            const isLight = body.classList.toggle("light-theme");
            if (isLight) {
                themeIcon.className = "fas fa-moon";
                themeToggleBtn.classList.remove("text-white");
                themeToggleBtn.classList.add("text-dark");
                localStorage.setItem("theme", "light");
            } else {
                themeIcon.className = "fas fa-sun";
                themeToggleBtn.classList.remove("text-dark");
                themeToggleBtn.classList.add("text-white");
                localStorage.setItem("theme", "dark");
            }
        });
    }

    // ==========================================
    // 13. System Diagnostic Analyzer Widget
    // ==========================================
    const diagBox = document.getElementById("system-diagnostic");
    if (diagBox) {
        setTimeout(() => {
            diagBox.innerHTML = `<i class="fas fa-satellite text-neon-cyan me-1"></i> [DIAGNOSTIC: Handshaking with terminal node...]`;
            
            setTimeout(() => {
                diagBox.innerHTML = `<i class="fas fa-network-wired text-neon-purple me-1"></i> [DIAGNOSTIC: Scanning agent hardware specifications...]`;
                
                setTimeout(() => {
                    const ua = navigator.userAgent;
                    let os = "Generic CPU Client";
                    if (ua.includes("Windows")) os = "Windows Platform";
                    else if (ua.includes("Macintosh")) os = "macOS Client";
                    else if (ua.includes("iPhone")) os = "iOS Mobile Node";
                    else if (ua.includes("iPad")) os = "iOS Tablet Node";
                    else if (ua.includes("Android")) os = "Android Mobile Node";
                    else if (ua.includes("Linux")) os = "Linux Console";

                    let browser = "HTML5 Parser";
                    if (ua.includes("Edg")) browser = "Edge Chromium";
                    else if (ua.includes("Chrome") && !ua.includes("Edg")) browser = "Chrome Engine";
                    else if (ua.includes("Safari") && !ua.includes("Chrome")) browser = "Safari Webkit";
                    else if (ua.includes("Firefox")) browser = "Firefox Gecko";

                    const width = window.screen.width;
                    const height = window.screen.height;

                    diagBox.className = "system-diagnostic-badge mt-4 p-2 rounded border border-success bg-dark font-monospace text-success d-inline-block text-start";
                    diagBox.style.borderColor = "rgba(40, 167, 69, 0.25) !important";
                    diagBox.innerHTML = `<i class="fas fa-check-circle text-success me-1"></i> [NODE CONNECTED: OS: ${os} | Browser: ${browser} | Resol: ${width}x${height} | Channel: Secured]`;
                }, 1000);
            }, 1000);
        }, 1200);
    }

    // ==========================================
    // 14. Telemetry Tracking Engine & Cookie Banner
    // ==========================================
    const cookieBanner = document.getElementById("cookie-banner");
    const acceptBtn = document.getElementById("cookie-accept-btn");
    const declineBtn = document.getElementById("cookie-decline-btn");

    const trackUserInterest = (type, name) => {
        if (localStorage.getItem("cookieConsent") !== "accepted") return;
        fetch("/api/telemetry/log-interest", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ElementType: type, ElementName: name })
        }).catch(() => {});
    };

    if (cookieBanner && acceptBtn && declineBtn) {
        const consent = localStorage.getItem("cookieConsent");
        if (!consent) {
            setTimeout(() => {
                cookieBanner.style.display = "block";
            }, 2500);
        }

        acceptBtn.addEventListener("click", () => {
            localStorage.setItem("cookieConsent", "accepted");
            cookieBanner.style.display = "none";
            playSynthSound('click');
            // Track immediate accept action
            trackUserInterest("Telemetry Consent", "Accepted");
            setupTelemetryListeners();
        });

        declineBtn.addEventListener("click", () => {
            localStorage.setItem("cookieConsent", "rejected");
            cookieBanner.style.display = "none";
            playSynthSound('click');
        });

        if (consent === "accepted") {
            setupTelemetryListeners();
        }

        function setupTelemetryListeners() {
            // 1. Project details page visits
            document.querySelectorAll("a[href^='/Portfolio/Details']").forEach(link => {
                link.addEventListener("click", () => {
                    const title = link.closest(".card")?.querySelector(".card-title")?.textContent.trim() || link.getAttribute("href");
                    trackUserInterest("Project Detail Link", title);
                });
            });

            // 2. Project images/photos inside details
            document.querySelectorAll(".portfolio-gallery img, img.img-fluid.rounded-3").forEach(img => {
                img.addEventListener("click", () => {
                    const src = img.getAttribute("src");
                    trackUserInterest("Project Image/Photo", src.split('/').pop());
                });
            });

            // 3. Project video elements or youtube links
            document.querySelectorAll("iframe, .project-video-btn, a[href*='youtube.com'], a[href*='youtu.be']").forEach(vid => {
                vid.addEventListener("click", () => {
                    trackUserInterest("Project Video/Play", vid.getAttribute("href") || vid.getAttribute("src") || "Embed Video");
                });
            });

            // 4. CV Download Button
            const cvBtn = document.querySelector("a[href*='DownloadCv']");
            if (cvBtn) {
                cvBtn.addEventListener("click", () => {
                    trackUserInterest("CV Download", "Developer CV PDF");
                });
            }

            // 5. Blog Links
            document.querySelectorAll("a[href^='/Blog/Details']").forEach(blog => {
                blog.addEventListener("click", () => {
                    const title = blog.closest(".card")?.querySelector(".card-title")?.textContent.trim() || blog.getAttribute("href");
                    trackUserInterest("Blog Detail Link", title);
                });
            });

            // 6. Image Right-click Download tracking
            document.querySelectorAll("img").forEach(img => {
                img.addEventListener("contextmenu", () => {
                    trackUserInterest("Right-Click Save Image", img.getAttribute("src").split('/').pop());
                });
            });

            // 7. Navbar logo/branding clicks
            document.querySelectorAll(".navbar-brand img, .footer h5").forEach(logo => {
                logo.addEventListener("click", () => {
                    trackUserInterest("Logo/Branding Click", "Website Logo");
                });
            });
        }
    }

    // Parse VisitorId cookie & run telemetry updates
    const getCookieValue = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    };

    const visitorIdStr = getCookieValue("VisitorId");
    if (visitorIdStr && localStorage.getItem("cookieConsent") === "accepted") {
        const visitorId = parseInt(visitorIdStr, 10);
        
        // Fetch country client-side via free service
        fetch("https://ipapi.co/json/")
        .then(res => res.json())
        .then(data => {
            if (data.country_name) {
                fetch("/api/telemetry/update-visitor", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ VisitorId: visitorId, Country: data.country_name })
                }).catch(() => {});
            }
        }).catch(() => {});

        // Track session duration spent on site
        let startTime = Date.now();
        const sendDurationUpdate = () => {
            const seconds = Math.floor((Date.now() - startTime) / 1000);
            if (seconds > 0) {
                const payload = JSON.stringify({ VisitorId: visitorId, Seconds: seconds });
                if (navigator.sendBeacon) {
                    navigator.sendBeacon("/api/telemetry/update-duration", new Blob([payload], { type: "application/json" }));
                } else {
                    fetch("/api/telemetry/update-duration", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: payload,
                        keepalive: true
                    }).catch(() => {});
                }
            }
        };

        // Heartbeat every 10 seconds
        setInterval(sendDurationUpdate, 10000);

        // Beforeunload tab-close updates
        window.addEventListener("beforeunload", sendDurationUpdate);
        window.addEventListener("visibilitychange", () => {
            if (document.visibilityState === "hidden") {
                sendDurationUpdate();
            }
        });
    }
});
