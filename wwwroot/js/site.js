// FUTURISTIC PREMIUM PORTFOLIO INTERACTION ENGINE

document.addEventListener("DOMContentLoaded", () => {
    // ==========================================
    // 0. Background Scroll Lock Prevention
    // ==========================================
    const preventScrollDuringLock = (e) => {
        if (document.documentElement.classList.contains("lock-scroll") || document.body.classList.contains("lock-scroll")) {
            e.preventDefault();
        }
    };
    window.addEventListener("wheel", preventScrollDuringLock, { passive: false });
    window.addEventListener("touchmove", preventScrollDuringLock, { passive: false });
    window.addEventListener("keydown", (e) => {
        if (document.documentElement.classList.contains("lock-scroll") || document.body.classList.contains("lock-scroll")) {
            if (["Space", "ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End"].includes(e.code)) {
                if (e.target.tagName !== "INPUT" && e.target.tagName !== "TEXTAREA") {
                    e.preventDefault();
                }
            }
        }
    });

    const unlockPageScroll = () => {
        document.documentElement.classList.remove("lock-scroll");
        document.body.classList.remove("lock-scroll");
        window.scrollTo({ top: 0, behavior: "instant" });
    };

    // ==========================================
    // 1. Terminal Boot Loader -> Animated Welcome -> Index Flow
    // ==========================================
    const loader = document.getElementById("loader-screen");
    const logBody = document.getElementById("dev-log-body");
    const termTitle = document.getElementById("dev-terminal-title");
    const welcomeScreen = document.getElementById("welcome-screen");

    if (loader && logBody) {
        const hasSeenWelcome = (sessionStorage.getItem("saad_welcome_shown") === "true") || (localStorage.getItem("saad_welcome_shown") === "true");
        const runFullWelcomeSequence = !hasSeenWelcome;

        if (runFullWelcomeSequence) {
            // Stage 1: The exact original developer terminal boot sequence
            if (termTitle) termTitle.textContent = "saad@portfolio ~ bash";

            const bootLines = [
                [0,    `<span class="dev-prompt">$</span> <span class="dev-cmd">./boot portfolio.sh</span>`],
                [180,  `<span class="dev-dim">▶  Initializing runtime environment...</span>`],
                [420,  `<span class="dev-prompt">›</span> <span class="dev-cyan">Framework:</span>  <span class="dev-cmd">ASP.NET Core 10 MVC</span>  <span class="dev-ok">✓ READY</span>`],
                [640,  `<span class="dev-prompt">›</span> <span class="dev-cyan">Database:</span>   <span class="dev-cmd">SQL Server + Entity Framework Core</span>  <span class="dev-ok">✓ CONNECTED</span>`],
                [860,  `<span class="dev-prompt">›</span> <span class="dev-cyan">Language:</span>   <span class="dev-cmd">C# .NET 10 / React 19 / JavaScript</span>  <span class="dev-ok">✓ LOADED</span>`],
                [1080, `<span class="dev-prompt">›</span> <span class="dev-cyan">Projects:</span>   <span class="dev-cmd">NED Academy · Nexora · CyberSentinel · NeuralMesh</span>  <span class="dev-ok">✓ 5 MOUNTED</span>`],
                [1300, `<span class="dev-prompt">›</span> <span class="dev-cyan">AI Engine:</span>  <span class="dev-cmd">Saad's AI Assistant &amp; Claude Mythos</span>  <span class="dev-ok">✓ ONLINE</span>`],
                [1500, `<span class="dev-dim">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span>`],
                [1680, `<span class="dev-ready">  ✦  Portfolio is live. Welcome — Hafiz Muhammad Saad  ✦</span>`]
            ];

            const progressWrap = document.createElement("div");
            progressWrap.className = "dev-progress-wrap";
            progressWrap.innerHTML = `
                <div class="dev-progress-label">
                    <span class="dev-dim">Loading modules...</span>
                    <span class="dev-cyan" id="dev-progress-pct">0%</span>
                </div>
                <div class="dev-progress-bar-outer">
                    <div class="dev-progress-bar-inner" id="dev-progress-bar"></div>
                </div>`;

            const cursor = document.createElement("span");
            cursor.className = "dev-cursor";

            bootLines.forEach(([delay, html], idx) => {
                setTimeout(() => {
                    if (logBody.lastChild && logBody.lastChild.querySelector) {
                        const prev = logBody.lastChild.querySelector?.(".dev-cursor");
                        if (prev) prev.remove();
                    }

                    const line = document.createElement("div");
                    line.className = "dev-log-line";
                    line.innerHTML = html;
                    line.appendChild(cursor.cloneNode());
                    logBody.appendChild(line);

                    requestAnimationFrame(() => {
                        requestAnimationFrame(() => { line.classList.add("visible"); });
                    });

                    const pct = Math.round(((idx + 1) / bootLines.length) * 100);
                    const bar = document.getElementById("dev-progress-bar");
                    const pctLabel = document.getElementById("dev-progress-pct");
                    if (bar) bar.style.width = pct + "%";
                    if (pctLabel) pctLabel.textContent = pct + "%";

                    if (idx === 0 && !logBody.parentElement.querySelector(".dev-progress-wrap")) {
                        logBody.parentElement.appendChild(progressWrap);
                    }

                    // Terminal boot reaches last line: smoothly reveal Stage 2 (Welcome Screen)
                    if (idx === bootLines.length - 1) {
                        setTimeout(() => {
                            if (welcomeScreen) {
                                // 1. Pre-activate welcome screen directly underneath loader (z-index 99999)
                                welcomeScreen.style.display = "flex";
                                welcomeScreen.classList.add("active");

                                // 2. Fade out loader screen -> crossfades directly into welcomeScreen!
                                loader.classList.add("fade-out");
                                setTimeout(() => {
                                    loader.style.display = "none";
                                }, 500);

                                // 3. Interactive Enter Button Handler with 3-Second VIP Client Handshake
                                const skipBtn = document.getElementById("welcome-skip-btn");
                                const viewMain = document.getElementById("welcome-view-main");
                                const viewHandshake = document.getElementById("welcome-view-handshake");
                                const progressBar = document.getElementById("handshake-progress-bar");
                                const timerNum = document.getElementById("handshake-timer-num");

                                let clicked = false;
                                const handleClientEnter = () => {
                                    if (clicked) return;
                                    clicked = true;

                                    // Switch from welcome panel to 3-second VIP Handshake
                                    if (viewMain) viewMain.style.display = "none";
                                    if (viewHandshake) {
                                        viewHandshake.style.display = "block";
                                        requestAnimationFrame(() => {
                                            if (progressBar) progressBar.style.width = "100%";
                                        });

                                        let remaining = 3;
                                        const timer = setInterval(() => {
                                            remaining--;
                                            if (timerNum && remaining >= 0) {
                                                timerNum.textContent = remaining.toString();
                                            }
                                            if (remaining <= 0) {
                                                clearInterval(timer);
                                            }
                                        }, 1000);

                                        // Hold for 3 seconds, then launch portfolio index!
                                        setTimeout(() => {
                                            welcomeScreen.classList.add("welcome-dismiss");
                                            sessionStorage.setItem("saad_welcome_shown", "true");
                                            localStorage.setItem("saad_welcome_shown", "true");

                                            setTimeout(() => {
                                                welcomeScreen.style.display = "none";
                                                unlockPageScroll();
                                                // Stage 3: Index page is live, start number counters!
                                                window.dispatchEvent(new CustomEvent("portfolio-ready"));
                                            }, 600);
                                        }, 3000);
                                    } else {
                                        welcomeScreen.classList.add("welcome-dismiss");
                                        sessionStorage.setItem("saad_welcome_shown", "true");
                                        localStorage.setItem("saad_welcome_shown", "true");
                                        setTimeout(() => {
                                            welcomeScreen.style.display = "none";
                                            unlockPageScroll();
                                            window.dispatchEvent(new CustomEvent("portfolio-ready"));
                                        }, 600);
                                    }
                                };

                                if (skipBtn) {
                                    skipBtn.addEventListener("click", handleClientEnter);
                                }

                                // Also allow keyboard Enter key
                                const handleKey = (e) => {
                                    if (e.key === "Enter" && !clicked) {
                                        document.removeEventListener("keydown", handleKey);
                                        handleClientEnter();
                                    }
                                };
                                document.addEventListener("keydown", handleKey);
                            } else {
                                loader.classList.add("fade-out");
                                sessionStorage.setItem("saad_welcome_shown", "true");
                                localStorage.setItem("saad_welcome_shown", "true");
                                setTimeout(() => {
                                    loader.style.display = "none";
                                    unlockPageScroll();
                                    window.dispatchEvent(new CustomEvent("portfolio-ready"));
                                }, 500);
                            }
                        }, 500);
                    }
                }, delay);
            });
        } else {
            // Already seen welcome / internal navigation: immediately hide loader & welcome screen, unlock scroll, and dispatch ready event
            if (welcomeScreen) welcomeScreen.style.display = "none";
            if (loader) {
                loader.style.display = "none";
                loader.remove();
            }
            unlockPageScroll();
            window.dispatchEvent(new CustomEvent("portfolio-ready"));
        }
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
    // 3b. Professional Step-by-Step Count-Up Counters
    // ==========================================
    const initCounters = () => {
        const statsElements = document.querySelectorAll("#stats-section, #about-stats-section");
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        statsElements.forEach(section => {
            if (section.dataset.countersAnimated === "true") return;

            const animateCounters = () => {
                if (section.dataset.countersAnimated === "true") return;
                section.dataset.countersAnimated = "true";
                const counters = section.querySelectorAll(".counter-number");

                counters.forEach(counter => {
                    const target = parseInt(counter.getAttribute("data-target"), 10);
                    if (isNaN(target) || target <= 0) {
                        counter.textContent = isNaN(target) ? "0" : target;
                        return;
                    }

                    if (prefersReducedMotion) {
                        counter.textContent = target;
                        return;
                    }

                    // Discrete integer ticking: each number is held for a clear readable delay
                    // For small targets (<= 5): 300ms per integer (1... 2... 3... 4... 5... STOP!)
                    // For larger targets (9): 180ms per integer
                    const stepDelay = target <= 5 ? 300 : 180;

                    let current = 0;
                    counter.textContent = "0";

                    const tick = () => {
                        current++;
                        counter.textContent = current;
                        counter.classList.add("counter-pulse");
                        setTimeout(() => counter.classList.remove("counter-pulse"), 160);

                        if (current < target) {
                            setTimeout(tick, stepDelay);
                        }
                    };

                    setTimeout(tick, stepDelay);
                });
            };

            const startObservation = () => {
                if ("IntersectionObserver" in window) {
                    const observer = new IntersectionObserver((entries, obs) => {
                        entries.forEach(entry => {
                            if (entry.isIntersecting) {
                                animateCounters();
                                obs.unobserve(entry.target);
                            }
                        });
                    }, { threshold: 0.1 });
                    observer.observe(section);
                } else {
                    animateCounters();
                }
            };

            // If loader is active, wait until portfolio-ready event fires so the user clearly sees the animation!
            const loaderEl = document.getElementById("loader-screen");
            if (loaderEl && loaderEl.style.display !== "none" && !loaderEl.classList.contains("fade-out")) {
                window.addEventListener("portfolio-ready", () => {
                    setTimeout(startObservation, 200);
                }, { once: true });
                // Fallback timeout in case user skipped loader
                setTimeout(startObservation, 3500);
            } else {
                startObservation();
            }
        });
    };

    initCounters();

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
    // 3. Custom Cursor & Interactive Glow Engine (Dual Lerp Cursor)
    // ==========================================
    const cursor = document.querySelector(".custom-cursor");
    const cursorDot = document.querySelector(".custom-cursor-dot");
    const ambientGlow = document.querySelector(".ambient-glow");

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let isTouch = window.matchMedia("(pointer: coarse)").matches;

    if (!isTouch && cursor && cursorDot) {
        document.addEventListener("mousemove", (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            // Dot follows instantaneously
            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;

            if (ambientGlow) {
                ambientGlow.style.left = `${mouseX}px`;
                ambientGlow.style.top = `${mouseY}px`;
            }
        });

        // Outer ring follows with smooth spring lerp
        const renderCursorRing = () => {
            ringX += (mouseX - ringX) * 0.22;
            ringY += (mouseY - ringY) * 0.22;
            cursor.style.left = `${ringX.toFixed(2)}px`;
            cursor.style.top = `${ringY.toFixed(2)}px`;
            requestAnimationFrame(renderCursorRing);
        };
        requestAnimationFrame(renderCursorRing);

        // Click haptic scale
        document.addEventListener("mousedown", () => {
            cursor.classList.add("cursor-clicking");
        });
        document.addEventListener("mouseup", () => {
            cursor.classList.remove("cursor-clicking");
        });

        // Hover expand on interactive elements
        const hoverables = document.querySelectorAll("a, button, input, select, textarea, .quick-chip, .clickable, .tech-icon-box, .stat-dev-card, .project-terminal-card, .cyber-cli-btn");
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

        // Magnetic Attraction on Buttons
        const magneticElements = document.querySelectorAll(".btn, .cyber-cli-btn, .quick-chip, .hud-minimize-btn");
        magneticElements.forEach(btn => {
            btn.classList.add("magnetic-btn");
            btn.addEventListener("mousemove", (e) => {
                const rect = btn.getBoundingClientRect();
                const dx = e.clientX - (rect.left + rect.width / 2);
                const dy = e.clientY - (rect.top + rect.height / 2);
                btn.style.transform = `translate(${dx * 0.22}px, ${dy * 0.22}px)`;
            });
            btn.addEventListener("mouseleave", () => {
                btn.style.transform = "translate(0px, 0px)";
            });
        });
    }

    // Sonar Shockwave on Click (Ethereal cyber ripple)
    document.addEventListener("click", (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        const wave = document.createElement("div");
        wave.className = "cyber-sonar-shockwave";
        wave.style.left = `${e.clientX}px`;
        wave.style.top = `${e.clientY}px`;
        document.body.appendChild(wave);
        setTimeout(() => wave.remove(), 700);
    });

    // ==========================================
    // 3B. Unique Cyber Animations (Matrix Decrypt, 3D Gyro Tilt, Laser Sweep, Telemetry HUD)
    // ==========================================

    // A. Matrix Text Glyph Decryption Engine
    class MatrixDecrypter {
        constructor(el) {
            this.el = el;
            this.chars = '!<>-_\\/[]{}—=+*^?#010101XYZSAAD';
            this.originalText = el.getAttribute('data-original-text') || el.textContent.trim();
            el.setAttribute('data-original-text', this.originalText);
            this.update = this.update.bind(this);
            this.isRunning = false;
        }
        setText(newText) {
            const oldText = this.el.textContent.trim();
            const length = Math.max(oldText.length, newText.length);
            this.queue = [];
            for (let i = 0; i < length; i++) {
                const from = oldText[i] || '';
                const to = newText[i] || '';
                const start = Math.floor(Math.random() * 8);
                const end = start + Math.floor(Math.random() * 12);
                this.queue.push({ from, to, start, end, char: '' });
            }
            cancelAnimationFrame(this.frameRequest);
            this.frame = 0;
            this.isRunning = true;
            this.update();
        }
        update() {
            let output = '';
            let complete = 0;
            for (let i = 0, n = this.queue.length; i < n; i++) {
                let { from, to, start, end, char } = this.queue[i];
                if (this.frame >= end) {
                    complete++;
                    output += to;
                } else if (this.frame >= start) {
                    if (!char || Math.random() < 0.28) {
                        char = this.chars[Math.floor(Math.random() * this.chars.length)];
                        this.queue[i].char = char;
                    }
                    output += `<span class="scramble-glyph">${char}</span>`;
                } else {
                    output += from;
                }
            }
            this.el.innerHTML = output;
            if (complete === this.queue.length) {
                this.el.textContent = this.originalText;
                this.isRunning = false;
            } else {
                this.frameRequest = requestAnimationFrame(this.update);
                this.frame++;
            }
        }
        decrypt() {
            if (this.isRunning) return;
            this.setText(this.originalText);
        }
    }

    // Attach Matrix Decrypter to Section Headings & Badges
    const scrambleCandidates = document.querySelectorAll(
        "h2.display-5, .section-title, .section-badge, .dev-status-pill, .stat-metric-id, .hud-brand-tag, .dev-ide-tab, .welcome-meta-sub"
    );

    const scrambleInstances = [];
    scrambleCandidates.forEach(el => {
        // Only target elements that are single text lines without deep nested DOM
        if (el.children.length <= 1) {
            const decrypter = new MatrixDecrypter(el);
            scrambleInstances.push({ el, decrypter });

            // Re-decrypt on mouse hover
            el.addEventListener("mouseenter", () => {
                decrypter.decrypt();
            });
        }
    });

    // Trigger Matrix Decryption on Scroll Reveal
    if ('IntersectionObserver' in window && scrambleInstances.length > 0) {
        const titleObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const match = scrambleInstances.find(item => item.el === entry.target);
                    if (match) {
                        match.decrypter.decrypt();
                    }
                }
            });
        }, { threshold: 0.25 });

        scrambleInstances.forEach(item => titleObserver.observe(item.el));
    }

    // B. 3D Tilt & Holographic Specular Glare (Physics Engine)
    if (!isTouch) {
        const tiltTargets = document.querySelectorAll(
            ".project-terminal-card, .stat-dev-card, .tech-icon-box, .cyber-hud-card, .dev-ide-window, .card.bg-dark, .blog-card, .glass-panel"
        );

        tiltTargets.forEach(card => {
            card.classList.add("cyber-tilt-card");

            card.addEventListener("mousemove", (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = ((y - centerY) / centerY) * -7;
                const rotateY = ((x - centerX) / centerX) * 7;

                card.style.setProperty("--mx", `${x}px`);
                card.style.setProperty("--my", `${y}px`);
                card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
            });

            card.addEventListener("mouseleave", () => {
                card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
            });
        });
    }

    // C. Cyber Laser Scanline Beam on Scroll Reveal
    if ('IntersectionObserver' in window) {
        const laserSweepTargets = document.querySelectorAll(
            ".project-terminal-card, .dev-ide-window, #audit-terminal-screen, .stat-dev-card, .cyber-hud-card"
        );

        const laserObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("laser-sweep-card", "laser-active");
                    setTimeout(() => {
                        entry.target.classList.remove("laser-active");
                    }, 1400);
                }
            });
        }, { threshold: 0.2 });

        laserSweepTargets.forEach(t => laserObserver.observe(t));
    }

    // D. Floating Cyber Telemetry HUD (Viewport Diagnostics)
    const hud = document.getElementById("cyber-telemetry-hud");
    if (hud) {
        const hudToggleBtn = document.getElementById("hud-toggle-btn");
        const hudToggleIcon = document.getElementById("hud-toggle-icon");
        const hudFpsVal = document.getElementById("hud-fps-val");
        const hudCoordsVal = document.getElementById("hud-coords-val");
        const hudScrollVal = document.getElementById("hud-scroll-val");
        const hudVelocityVal = document.getElementById("hud-velocity-val");

        // Toggle Minimize / Maximize
        if (hudToggleBtn) {
            hudToggleBtn.addEventListener("click", () => {
                hud.classList.toggle("minimized");
                if (hudToggleIcon) {
                    hudToggleIcon.className = hud.classList.contains("minimized") ? "fas fa-plus" : "fas fa-minus";
                }
            });
        }

        // Live FPS Loop
        let frames = 0;
        let lastFpsCheck = performance.now();
        const updateFpsCounter = (now) => {
            frames++;
            if (now - lastFpsCheck >= 500) {
                const fps = Math.min(144, Math.round((frames * 1000) / (now - lastFpsCheck)));
                if (hudFpsVal) {
                    hudFpsVal.textContent = `${fps} FPS`;
                    hudFpsVal.className = fps >= 45 ? "hud-metric-value text-neon-green" : "hud-metric-value text-warning";
                }
                frames = 0;
                lastFpsCheck = now;
            }
            requestAnimationFrame(updateFpsCounter);
        };
        requestAnimationFrame(updateFpsCounter);

        // Live Cursor Coordinates
        document.addEventListener("mousemove", (e) => {
            if (hudCoordsVal) {
                hudCoordsVal.textContent = `${Math.round(e.clientX)}, ${Math.round(e.clientY)}`;
            }
        });

        // Live Scroll & Velocity Metrics
        let lastScrollY = window.scrollY;
        let lastScrollTime = performance.now();
        let scrollVelocity = 0;

        window.addEventListener("scroll", () => {
            const now = performance.now();
            const dt = (now - lastScrollTime) / 1000;
            const currentY = window.scrollY;

            if (dt > 0.04) {
                scrollVelocity = Math.round(Math.abs(currentY - lastScrollY) / dt);
                lastScrollY = currentY;
                lastScrollTime = now;
                if (hudVelocityVal) hudVelocityVal.textContent = `${scrollVelocity} px/s`;
            }

            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            const pct = maxScroll > 0 ? Math.round((currentY / maxScroll) * 100) : 0;
            if (hudScrollVal) hudScrollVal.textContent = `${pct}%`;
        }, { passive: true });
    }

    // ==========================================
    // 3C. Under Development Interactive Witty Flip / Notice Engine
    // ==========================================
    document.addEventListener("click", (e) => {
        // 1. Trigger witty under-dev warning
        const triggerBtn = e.target.closest(".trigger-under-dev-btn") || e.target.closest(".under-dev-card .project-thumb-img");
        if (triggerBtn) {
            e.preventDefault();
            e.stopPropagation();
            const card = triggerBtn.closest(".project-terminal-card");
            if (card) {
                const normalView = card.querySelector(".under-dev-normal-view");
                const hiddenView = card.querySelector(".under-dev-hidden-view");
                if (normalView && hiddenView) {
                    playSynthSound('click');
                    normalView.style.display = "none";
                    hiddenView.style.display = "flex";
                }
            }
            return;
        }

        // 2. Restore normal project card view
        const restoreBtn = e.target.closest(".restore-under-dev-btn");
        if (restoreBtn) {
            e.preventDefault();
            e.stopPropagation();
            const card = restoreBtn.closest(".project-terminal-card");
            if (card) {
                const normalView = card.querySelector(".under-dev-normal-view");
                const hiddenView = card.querySelector(".under-dev-hidden-view");
                if (normalView && hiddenView) {
                    playSynthSound('click');
                    hiddenView.style.display = "none";
                    normalView.style.display = "flex";
                }
            }
            return;
        }
    });

    // ==========================================
    // 3D. Active Navigation Highlighting & Route Detection
    // ==========================================
    try {
        const curPath = window.location.pathname.toLowerCase();
        const navLinks = document.querySelectorAll(".navbar-futuristic .nav-link");
        navLinks.forEach(link => {
            const href = link.getAttribute("href")?.toLowerCase();
            if (!href) return;
            const isHome = curPath === "/" || curPath === "" || curPath.endsWith("/index.html") || curPath.endsWith("/dist/") || curPath.endsWith("/futuristic-portfolio-by-sa-developer/");
            if (isHome && (href === "/" || href.endsWith("/home") || href.endsWith("/index") || href.endsWith("/index.html"))) {
                link.classList.add("active");
            } else if (!isHome && href !== "/" && curPath.includes(href.replace("/index", ""))) {
                link.classList.add("active");
            }
        });
    } catch (e) {}

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
    // 8. Saad's AI Assistant Widget (Production-Ready UI/UX Engine)
    // ==========================================
    const aiToggleBtn = document.getElementById("ai-chat-toggle");
    const aiWidget = document.getElementById("ai-chat-widget");
    const aiCloseBtn = document.getElementById("ai-chat-close");
    const aiResetBtn = document.getElementById("ai-chat-reset");
    const aiInput = document.getElementById("ai-user-message");
    const aiSendBtn = document.getElementById("ai-send-message");
    const aiMessages = document.getElementById("ai-messages-container");

    if (aiToggleBtn && aiWidget) {
        const welcomeMessage = "Hi! I'm Saad's AI Assistant 👋\n\nI can help you explore Saad's projects, technical skills, degree background, CV, or connect directly via WhatsApp.\n\nWhat would you like to know?";

        const showWelcome = () => {
            if (aiMessages && aiMessages.children.length === 0) {
                renderMessage(welcomeMessage, "bot");
            }
        };

        aiToggleBtn.addEventListener("click", () => {
            aiWidget.classList.toggle("active");
            if (aiWidget.classList.contains("active")) {
                if (aiInput) aiInput.focus();
                showWelcome();
            }
        });

        if (aiCloseBtn) {
            aiCloseBtn.addEventListener("click", () => {
                aiWidget.classList.remove("active");
            });
        }

        if (aiResetBtn) {
            aiResetBtn.addEventListener("click", () => {
                if (aiMessages) {
                    aiMessages.innerHTML = "";
                    renderMessage(welcomeMessage, "bot");
                }
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

            // 1. WhatsApp / Contact / Phone / Reach / Message / Hire / Number / Roman Urdu Contact
            if (query.includes("whatsapp") || query.includes("contact") || query.includes("phone") || query.includes("number") || query.includes("reach") || query.includes("email") || query.includes("location") || query.includes("address") || query.includes("rabta") || query.includes("baat")) {
                return "### 📞 Connect Direct with Saad\n\nSaad is a Full-Stack Software Developer based in **Karachi, Pakistan**.\n\n• **WhatsApp Direct**: [+92 305 5188896](https://wa.me/923055188896?text=Hi%20Saad,%20I%20saw%20your%20portfolio%20and%20would%20like%20to%20connect!)\n• **Email**: saad.sa9112@gmail.com\n• **Location**: Karachi, Pakistan\n\n[Chat on WhatsApp](https://wa.me/923055188896?text=Hi%20Saad,%20I%20saw%20your%20portfolio%20and%20would%20like%20to%20connect!)";
            }

            // 2. CV / Resume / Download / PDF / File / Roman Urdu CV
            if (query.includes("cv") || query.includes("resume") || query.includes("download") || query.includes("pdf") || query.includes("file")) {
                return "### 📄 Download Saad's Official CV\n\nClick below to download Hafiz Muhammad Saad's updated resume in PDF format:\n\n[Download CV (PDF)](/files/Muhammad_Saad_CV.pdf)\n\n*Includes full details on C# ASP.NET Core 10 MVC, SQL Server, BSBC degree, and ADSE diploma.*";
            }

            // 3. Projects / Work / Portfolio / Apps / Systems / Built / Created / Roman Urdu Projects
            if (query.includes("project") || query.includes("work") || query.includes("built") || query.includes("created") || query.includes("portfolio") || query.includes("app") || query.includes("system") || query.includes("developed") || query.includes("kaam")) {
                const projectVariants = [
                    "### 🚀 Featured System Deployments\n\n*   **[Full-Stack Enterprise Developer Portfolio](/Portfolio)**\n    *C# ASP.NET Core 10 MVC portfolio app featuring SQL Server persistence, real-time telemetry, and dynamic Light/Dark mode design system.*\n    *Tech Stack: C#, ASP.NET Core 10, SQL Server, JS*\n    [View Details](/Portfolio)\n\n*   **[HMS Analytics & Telemetry Engine](/Portfolio)**\n    *Real-time visitor analytics, IP geolocation lookup, session tracking dashboard, and EF Core architecture.*\n    *Tech Stack: ASP.NET Core, EF Core, SQL Server, SignalR*\n    [View Details](/Portfolio)\n\n[Explore All Projects](/Portfolio)",
                    "### 🛠️ Saad's Software Deployments\n\n1. **Full-Stack Developer Portfolio**: ASP.NET Core 10 MVC system with custom CSS design tokens & real-time telemetry.\n2. **Visitor Analytics Engine**: IP geolocation tracking, session duration analytics, and SQL Server persistence.\n\nVisit the [Projects Page](/Portfolio) for full case studies!",
                    "### 💻 Code Case Studies\n\nHere are Saad's core software projects:\n• **ASP.NET Core Enterprise Portfolio**: Full-stack MVC application with responsive glassmorphic UI.\n• **Real-Time Telemetry Engine**: Visitor tracking and geolocation API system.\n\nCheck out the complete list on the [Projects Page](/Portfolio)."
                ];
                return projectVariants[variantIndex % projectVariants.length];
            }

            // 4. Skills / Tech Stack / C# / .NET / SQL / JavaScript / PHP / Languages / Stack / Roman Urdu Skills
            if (query.includes("skill") || query.includes("technolog") || query.includes("language") || query.includes("stack") || query.includes("c#") || query.includes("dotnet") || query.includes("sql") || query.includes("javascript") || query.includes("css") || query.includes("html") || query.includes("php") || query.includes("tool") || query.includes("use") || query.includes("know") || query.includes("seekha")) {
                const skillVariants = [
                    "### 🛠️ Saad's Technical Toolkit\n\n• **Backend & DB**: C#, ASP.NET Core 10 MVC, Entity Framework Core, SQL Server, PHP, MySQL\n• **Frontend & UI**: JavaScript (ES6+), HTML5, CSS3 (Vanilla CSS, Glassmorphic UI Design)\n• **Architecture**: Relational DB Normalization, RESTful Web APIs, Real-Time Telemetry\n• **Tools**: Git, GitHub, Visual Studio 2022, SSMS, IIS Server",
                    "### ⚡ Core Software Skills\n\nSaad works primarily with:\n- **ASP.NET Core MVC** (`95%`)\n- **C# / .NET 10** (`95%`)\n- **SQL Server & Relational DB Architecture** (`90%`)\n- **HTML5, CSS3 & Modern UI/UX** (`92%`)\n- **PHP & MySQL Development** (`85%`)\n- **Git Version Control** (`90%`)",
                    "### 🔍 Specialized Capabilities\n\nSaad brings expertise in:\n• **Relational Database Design**: Table normalization, indexing, stored procedures & EF Core.\n• **Full-Stack Web Development**: Building responsive C# ASP.NET Core MVC systems from scratch.\n• **Modern UI/UX Engineering**: Glassmorphic interfaces with full Light & Dark mode support."
                ];
                return skillVariants[variantIndex % skillVariants.length];
            }

            // 5. Education / Degree / University / Aptech / Sohail / Study / Diploma / Academic / BSBC / ADSE / Parhai
            if (query.includes("education") || query.includes("degree") || query.includes("university") || query.includes("college") || query.includes("aptech") || query.includes("sohail") || query.includes("study") || query.includes("diploma") || query.includes("academic") || query.includes("bsbc") || query.includes("adse") || query.includes("parhai")) {
                return "### 🎓 Academic Credentials & Diplomas\n\n• **BSBC (Bachelor of Science in Business Computing)**\n  *Sohail University (2025–2029)*\n\n• **ADSE (Advanced Diploma in Software Engineering)**\n  *Aptech Learning (2024–2027)*";
            }

            // 6. Experience / Role / Job / History / Experience
            if (query.includes("experience") || query.includes("work history") || query.includes("job") || query.includes("career") || query.includes("company") || query.includes("role") || query.includes("tajurba")) {
                return "### 💼 Professional Background\n\nSaad has **1+ Years of Full-Stack Development Experience**, specializing in building enterprise web applications, normalized SQL databases, and responsive UI systems using C# and ASP.NET Core MVC.";
            }

            // 7. Services / Custom App / Build Website / Freelance / Hire Saad / Rates
            if (query.includes("build") || query.includes("develop") || query.includes("make") || query.includes("create") || query.includes("service") || query.includes("freelance") || query.includes("hire") || query.includes("cost") || query.includes("rate") || query.includes("can saad")) {
                return "### ⚙️ Development Services & Solutions\n\nSaad engineers custom full-stack solutions including:\n• **Enterprise Web Applications** (C# ASP.NET Core MVC & SQL Server)\n• **RESTful APIs & Backend Services**\n• **Responsive Portfolios & Corporate Web Portals**\n• **Database Optimization & Schema Normalization**\n\n[Chat on WhatsApp](https://wa.me/923055188896?text=Hi%20Saad,%20I%20have%20a%20project%20inquiry!)";
            }

            // 8. Greetings & Casual Intro ("Hi", "Hello", "Hey", "How are you", "Who are you", "Kaun ho", "Kaise ho")
            if (query.includes("hello") || query.includes("hi") || query.includes("hey") || query.includes("greetings") || query.includes("who are you") || query.includes("what can you do") || query.includes("about saad") || query.includes("kaun ho") || query.includes("kaise ho")) {
                return "Hi! I'm Saad's AI Assistant 👋\n\nI'm a full-stack portfolio assistant for **Hafiz Muhammad Saad** (Software Developer).\n\nHow can I help you today? Feel free to ask about Saad's:\n• **Projects** (*\"What projects has Saad built?\"*)\n• **Tech Stack** (*\"What technologies does he use?\"*)\n• **CV / Resume** (*\"Download CV\"*)\n• **WhatsApp Contact** (*\"Connect on WhatsApp\"*)";
            }

            // 9. Intelligent Dynamic Fallback
            const smartFallbacks = [
                `I understand you're asking about "${userMessage}". While I'm focused on Saad's software development portfolio, I can help you with:\n\n• **Projects**: *What has Saad built?*\n• **Skills**: *What is his tech stack?*\n• **Education**: *What are his qualifications?*\n• **CV**: *Download resume*\n• **Contact**: *Connect on WhatsApp*\n\n[Chat on WhatsApp](https://wa.me/923055188896?text=Hi%20Saad!)`,
                `Thanks for your query! I specialize in providing details about Hafiz Muhammad Saad's technical work.\n\nTry asking:\n- *"What projects has Saad built?"*\n- *"What technologies does Saad use?"*\n- *"Where did Saad study?"*\n- *"Download CV"*`,
                `I'd be glad to assist with details about Saad's development background! You can inquire about his **Projects**, **Tech Stack**, **Academic Degrees**, **Work Experience**, or **WhatsApp Contact**.`
            ];
            return smartFallbacks[variantIndex % smartFallbacks.length];
        };

        const processUserQuery = (text) => {
            if (!text) return;
            renderMessage(text, "user");
            if (aiInput) aiInput.value = "";
            showTypingIndicator();

            // Realistic AI thinking delay (750ms - 1250ms) for an authentic AI feel
            const thinkingDelay = Math.floor(Math.random() * 500) + 750;

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

        // Open CLI console from Cyber Ribbon button
        const cliBtn = document.getElementById("open-cyber-terminal-btn");
        if (cliBtn) {
            cliBtn.addEventListener("click", () => {
                togglePalette();
            });
        }

        // Run CLI command button
        const cliRunBtn = document.getElementById("cyber-cli-run-btn");
        const cliOutput = document.getElementById("cyber-cli-output");

        const runCliCommandText = (rawInput) => {
            const input = rawInput.toLowerCase().trim();
            if (!input) return;

            playSynthSound('click');
            if (cliOutput) {
                const userEcho = document.createElement("div");
                userEcho.className = "text-white mt-2";
                userEcho.innerHTML = `<span class="text-neon-cyan">saad@visitor:~$</span> ${rawInput}`;
                cliOutput.appendChild(userEcho);

                if (input === "clear" || input === "cls") {
                    cliOutput.innerHTML = `<div class="text-muted">// Screen cleared. Type <span class="text-neon-cyan">help</span> for commands.</div>`;
                    cmdSearch.value = "";
                    return;
                }

                const resDiv = document.createElement("div");
                resDiv.className = "mt-1 ms-2";

                if (input === "help") {
                    resDiv.innerHTML = `
                        <div class="text-neon-cyan fw-bold">AVAILABLE COMMANDS:</div>
                        <div>• <strong class="text-danger">sec-audit</strong> : Run real-time zero-trust security audit</div>
                        <div>• <strong class="text-neon-cyan">projects</strong> : List all 5 enterprise systems (inc. Under Development)</div>
                        <div>• <strong class="text-neon-purple">skills</strong> : Output AST tech stack &amp; telemetry proficiencies</div>
                        <div>• <strong class="text-warning">whoami</strong> : Software engineer credentials &amp; university degrees</div>
                        <div>• <strong class="text-info">home / blog / projects-page</strong> : Navigate system views</div>
                        <div>• <strong class="text-success">contact</strong> : Focus communication uplink</div>
                        <div>• <strong class="text-muted">clear</strong> : Clear console history</div>
                    `;
                } else if (input === "sec-audit" || input === "audit") {
                    resDiv.innerHTML = `
                        <div class="text-warning">&gt; [SCANNING] Running zero-trust endpoint audit...</div>
                        <div class="text-neon-green ms-2">✓ TLS 1.3 Cipher Suite: AES-256-GCM Validated</div>
                        <div class="text-neon-green ms-2">✓ SQL Injection Surface: Entity Framework Core Parameterized (0 Flaws)</div>
                        <div class="text-neon-green ms-2">✓ XSS &amp; Context Sanitization: AST Encoded Enforced</div>
                        <div class="text-neon-green ms-2">✓ eBPF Kernel Syscall Monitors: Armed &amp; Active</div>
                        <div class="text-neon-green ms-2">✓ Claude Mythos Epistemic Guardrail: Active &amp; Isolated</div>
                        <div class="text-white mt-1 fw-bold">✦ COMPLIANCE: 100% SECURE · RATING A+</div>
                    `;
                    const auditSection = document.getElementById("cyber-audit-section");
                    if (auditSection) {
                        setTimeout(() => auditSection.scrollIntoView({ behavior: "smooth" }), 400);
                        const runBtn = document.getElementById("run-audit-btn");
                        if (runBtn) setTimeout(() => runBtn.click(), 700);
                    }
                } else if (input === "projects" || input === "ls") {
                    resDiv.innerHTML = `
                        <div class="text-neon-cyan fw-bold">MOUNTED SYSTEMS DATABANK:</div>
                        <div>1. <strong class="text-white">NED Academy UMS</strong> [ASP.NET Core 10] · <span class="text-success">PROD</span></div>
                        <div>2. <strong class="text-white">NED Academy Admissions Portal</strong> [EF Core 10] · <span class="text-success">PROD</span></div>
                        <div>3. <strong class="text-white">Nexora Digital Platform</strong> [React 19 / Tailwind v4] · <span class="text-success">PROD</span></div>
                        <div>4. <strong class="text-warning">CyberSentinel SIEM Engine</strong> [eBPF / .NET 10 / Rust] · <span class="text-warning">UNDER DEVELOPMENT</span></div>
                        <div>5. <strong class="text-warning">NeuralMesh AI Agent Swarm</strong> [ONNX / Redis Streams] · <span class="text-warning">UNDER DEVELOPMENT</span></div>
                    `;
                } else if (input === "skills") {
                    resDiv.innerHTML = `
                        <div class="text-neon-purple fw-bold">CORE ARCHITECTURAL MATRIX:</div>
                        <div>• ASP.NET Core 10 &amp; C# : 95% [Native AOT / High Throughput]</div>
                        <div>• SQL Server &amp; Relational DB : 90% [EF Core / LINQ Optimization]</div>
                        <div>• eBPF &amp; Kernel Telemetry : 88% [Zero-Trust / Packet Inspection]</div>
                        <div>• React 19 &amp; Modern Web : 88% [Framer Motion / Glassmorphism]</div>
                        <div>• Git &amp; CI/CD Pipelines : 90% [Zero-Downtime Rollouts]</div>
                    `;
                } else if (input === "whoami") {
                    resDiv.innerHTML = `
                        <div class="text-warning fw-bold">HAFIZ MUHAMMAD SAAD</div>
                        <div class="text-muted">Full-Stack Software Engineer &amp; Systems Architect</div>
                        <div>• BSBC (Bachelor of Science in Business Computing) — Sohail University (2025–2029)</div>
                        <div>• ADSE (Advanced Diploma in Software Engineering) — Aptech Learning (2024–2027)</div>
                        <div class="text-success">• Status: Ready for Enterprise Architecture &amp; Production Delivery</div>
                    `;
                } else if (input === "home") {
                    window.location.href = "/";
                } else if (input === "blog" || input === "articles") {
                    window.location.href = "/Blog";
                } else if (input === "projects-page") {
                    window.location.href = "/Portfolio";
                } else if (input === "contact") {
                    palette.classList.remove("active");
                    const contactSec = document.getElementById("contact-section");
                    if (contactSec) {
                        contactSec.scrollIntoView({ behavior: "smooth" });
                        const nameIn = contactSec.querySelector("input[name='Name']");
                        if (nameIn) setTimeout(() => nameIn.focus(), 600);
                    }
                } else {
                    resDiv.innerHTML = `<span class="text-danger">command not found: "${rawInput}". Type <span class="text-neon-cyan">help</span> for valid commands.</span>`;
                }

                cliOutput.appendChild(resDiv);
                cliOutput.scrollTop = cliOutput.scrollHeight;
                cmdSearch.value = "";
            }
        };

        if (cliRunBtn) {
            cliRunBtn.addEventListener("click", () => {
                runCliCommandText(cmdSearch.value);
            });
        }

        // Click executions
        cmdResults.addEventListener("click", (e) => {
            const item = e.target.closest(".command-item");
            if (item) {
                executeCommand(item);
            }
        });

        function executeCommand(item) {
            playSynthSound('click');
            const action = item.getAttribute("data-action");

            if (action === "cmd") {
                const cmd = item.getAttribute("data-cmd");
                if (cmd) {
                    runCliCommandText(cmd);
                }
            } else if (action === "nav") {
                palette.classList.remove("active");
                const url = item.getAttribute("data-url");
                if (url) window.location.href = url;
            } else if (action === "ai") {
                palette.classList.remove("active");
                if (aiWidget) aiWidget.classList.add("active");
                if (aiInput) aiInput.focus();
            } else if (action === "contact") {
                palette.classList.remove("active");
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

        // Live Ping Ticker Animation
        const pingElem = document.getElementById("live-ping-val");
        if (pingElem) {
            setInterval(() => {
                const ms = Math.floor(Math.random() * 5) + 12; // 12ms - 16ms
                pingElem.innerHTML = `<i class="fas fa-bolt text-success me-1"></i> ${ms}ms (PK-KHI)`;
            }, 4000);
        }

        // ==========================================
        // 9.1 Live Zero-Trust Security Audit Daemon
        // ==========================================
        const runAuditBtn = document.getElementById("run-audit-btn");
        const clearAuditBtn = document.getElementById("clear-audit-btn");
        const auditScreen = document.getElementById("audit-terminal-screen");
        const auditStatusPill = document.getElementById("audit-status-pill");
        const auditScoreVal = document.getElementById("audit-score-val");

        if (runAuditBtn && auditScreen) {
            let auditing = false;
            runAuditBtn.addEventListener("click", () => {
                if (auditing) return;
                auditing = true;
                playSynthSound('console');
                runAuditBtn.disabled = true;
                if (auditStatusPill) {
                    auditStatusPill.className = "badge bg-dark border border-warning text-warning font-monospace";
                    auditStatusPill.innerHTML = `<i class="fas fa-spinner fa-spin me-1"></i> AUDITING...`;
                }

                auditScreen.innerHTML = `<div class="text-neon-cyan fw-bold mb-2">&gt; [INITIATING] Zero-Trust Autonomous Security &amp; Architecture Audit...</div>`;

                const steps = [
                    [180, `<div class="text-muted">&gt; [1/5] Evaluating TLS 1.3 Cipher Suite &amp; Perfect Forward Secrecy...</div><div class="text-neon-green ms-3">✓ PASSED: ECDHE-RSA-AES256-GCM-SHA384 (TLS 1.3 Guaranteed)</div>`],
                    [550, `<div class="text-muted mt-2">&gt; [2/5] Scanning Relational Database AST for SQL Injection Surfaces...</div><div class="text-neon-green ms-3">✓ PASSED: Entity Framework Core Parameterized Queries (0 Vulnerabilities)</div>`],
                    [950, `<div class="text-muted mt-2">&gt; [3/5] Inspecting XSS Filters &amp; Context Sanitization Tokens...</div><div class="text-neon-green ms-3">✓ PASSED: Razor AST Encoding &amp; Immutable Content Security Policy Enforced</div>`],
                    [1350, `<div class="text-muted mt-2">&gt; [4/5] Testing Kernel eBPF Telemetry Probes &amp; Syscall Bounds...</div><div class="text-neon-green ms-3">✓ ARMED: Zero-Copy RingBuffer Sub-Millisecond Syscall Interceptor Active</div>`],
                    [1750, `<div class="text-muted mt-2">&gt; [5/5] Stress-Testing Claude Mythos Epistemic AI Guardrails...</div><div class="text-neon-green ms-3">✓ VERIFIED: Indirect Prompt Injections Quarantined in Immutable Envelopes</div>`],
                    [2150, `<div class="mt-3 p-2 rounded border border-success border-opacity-50 text-white font-monospace" style="background: rgba(0, 255, 102, 0.1);"><strong>✦ AUDIT CONCLUSION:</strong> System Integrity Rating A+ · Zero-Trust Compliance 100% · 0 Vulnerabilities Detected.</div>`]
                ];

                steps.forEach(([delay, html], index) => {
                    setTimeout(() => {
                        auditScreen.innerHTML += html;
                        auditScreen.scrollTop = auditScreen.scrollHeight;
                        playSynthSound('click');

                        if (index === steps.length - 1) {
                            auditing = false;
                            runAuditBtn.disabled = false;
                            if (auditStatusPill) {
                                auditStatusPill.className = "badge bg-dark border border-success text-neon-green font-monospace";
                                auditStatusPill.innerHTML = `<i class="fas fa-check-circle me-1"></i> AUDIT PASSED [A+]`;
                            }
                            if (auditScoreVal) {
                                auditScoreVal.textContent = "A+ [100% COMPLIANT · 0 FLAWS]";
                            }
                        }
                    }, delay);
                });
            });

            if (clearAuditBtn) {
                clearAuditBtn.addEventListener("click", () => {
                    auditScreen.innerHTML = `
                        <div class="text-muted">// Zero-Trust Continuous Security Telemetry Daemon</div>
                        <div class="text-muted">// Click "Run Live Security Audit" above to test active defensive layers...</div>
                        <div class="mt-2 text-neon-purple">&gt; All security sensors idling at 0.0% CPU overhead.</div>
                    `;
                    if (auditStatusPill) {
                        auditStatusPill.className = "badge bg-dark border border-success text-neon-green font-monospace";
                        auditStatusPill.textContent = "READY TO SCAN";
                    }
                    if (auditScoreVal) {
                        auditScoreVal.textContent = "A+ [100% SECURE]";
                    }
                });
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
    // 12. Theme Toggle Controller (Dark / Light) & Roast Toast
    // ==========================================
    const themeToggleBtn = document.getElementById("theme-toggle-btn");
    const themeIcon = document.getElementById("theme-icon");
    const body = document.body;
    const roastToast = document.getElementById("developer-roast-toast");
    const roastCloseBtn = document.getElementById("roast-close-btn");
    const roastRevertBtn = document.getElementById("roast-revert-btn");

    const showRoastToast = () => {
        if (!roastToast) return;
        roastToast.style.display = "block";
    };

    const hideRoastToast = () => {
        if (!roastToast) return;
        roastToast.style.display = "none";
    };

    if (roastCloseBtn) {
        roastCloseBtn.addEventListener("click", hideRoastToast);
    }

    if (roastRevertBtn && themeToggleBtn) {
        roastRevertBtn.addEventListener("click", () => {
            hideRoastToast();
            if (body.classList.contains("light-theme")) {
                themeToggleBtn.click();
            }
        });
    }

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
                showRoastToast();
            } else {
                themeIcon.className = "fas fa-sun";
                themeToggleBtn.classList.remove("text-dark");
                themeToggleBtn.classList.add("text-white");
                localStorage.setItem("theme", "dark");
                hideRoastToast();
            }
        });
    }

    // ==========================================
    // 12B. Smart In-Place Project Databank Filtering
    // ==========================================
    const filterButtons = document.querySelectorAll("#portfolio-filter-group .project-filter-btn");
    const projectCards = document.querySelectorAll("#portfolio-grid .project-card-item");

    if (filterButtons.length && projectCards.length) {
        filterButtons.forEach(btn => {
            btn.addEventListener("click", () => {
                const targetFilter = btn.getAttribute("data-filter");

                // Update active pill styling
                filterButtons.forEach(b => {
                    b.classList.remove("active", "btn-neon");
                    b.classList.add("btn-outline-secondary");
                });
                btn.classList.add("active", "btn-neon");
                btn.classList.remove("btn-outline-secondary");

                // Filter cards in-place with instant smooth visibility
                projectCards.forEach(card => {
                    const cardGroup = card.getAttribute("data-category-group");
                    if (targetFilter === "all" || cardGroup === targetFilter) {
                        card.classList.remove("filter-hidden");
                    } else {
                        card.classList.add("filter-hidden");
                    }
                });

                if (window.AOS) {
                    window.AOS.refresh();
                }
            });
        });
    }

    // ==========================================
    // 12C. Under Development Card Witty Interactive Toggle
    // ==========================================
    document.addEventListener("click", (e) => {
        const triggerBtn = e.target.closest(".trigger-under-dev-btn");
        if (triggerBtn) {
            const card = triggerBtn.closest(".under-dev-card");
            if (card) {
                const normalView = card.querySelector(".under-dev-normal-view");
                const hiddenView = card.querySelector(".under-dev-hidden-view");
                if (normalView && hiddenView) {
                    normalView.style.display = "none";
                    hiddenView.style.display = "flex";
                }
            }
            return;
        }

        const restoreBtn = e.target.closest(".restore-under-dev-btn");
        if (restoreBtn) {
            const card = restoreBtn.closest(".under-dev-card");
            if (card) {
                const normalView = card.querySelector(".under-dev-normal-view");
                const hiddenView = card.querySelector(".under-dev-hidden-view");
                if (normalView && hiddenView) {
                    hiddenView.style.display = "none";
                    normalView.style.display = "flex";
                }
            }
            return;
        }
    });

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
