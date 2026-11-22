const fs = require('fs');
const path = require('path');
const seedData = require('../server/data/seedData.js');

const adminHtmlPath = path.resolve(__dirname, '../client/admin/index.html');
let html = fs.readFileSync(adminHtmlPath, 'utf8');

// Ensure CSS styles
const stylesToAdd = `
        .admin-sidebar .nav-link {
            cursor: pointer;
        }
        #login-error-msg {
            background: rgba(239, 68, 68, 0.2) !important;
            border: 1px solid #ef4444 !important;
            color: #fee2e2 !important;
            box-shadow: 0 0 18px rgba(239, 68, 68, 0.4);
            border-radius: 8px;
            font-size: 0.92rem;
            line-height: 1.4;
        }
        @keyframes shakeInput {
            0%, 100% { transform: translateX(0); }
            20%, 60% { transform: translateX(-8px); }
            40%, 80% { transform: translateX(8px); }
        }
        .animate-shake {
            animation: shakeInput 0.4s ease-in-out !important;
        }
`;

if (!html.includes('.admin-sidebar .nav-link {')) {
    html = html.replace('    </style>', stylesToAdd + '\n    </style>');
}

// Find script section start
const scriptTagStart = html.indexOf('<script>\n') !== -1 ? html.indexOf('<script>\n') : html.indexOf('<script>\r\n');
if (scriptTagStart === -1) {
    console.error("Could not find start of script tag!");
    process.exit(1);
}

const beforeScript = html.substring(0, scriptTagStart);

const fullScript = `<script>
        // ==========================================
        // 1. EMBEDDED DATABANK SEED (ASP.NET Match)
        // ==========================================
        const DEFAULT_ADMIN_DATA = ${JSON.stringify(seedData, null, 2)};

        // State Store
        let adminData = null;
        let visitorChartInstance = null;
        const AUTH_KEY = "hms_admin_session_token";
        const DATA_KEY = "hms_admin_databank";

        function saveAdminDatabank() {
            if (adminData) {
                try {
                    localStorage.setItem(DATA_KEY, JSON.stringify(adminData));
                } catch(e) {
                    console.warn("Storage quota exceeded", e);
                }
            }
        }

        // ==========================================
        // 2. AUTHENTICATION CONTROLLER
        // ==========================================
        document.addEventListener("DOMContentLoaded", () => {
            const token = localStorage.getItem(AUTH_KEY) || sessionStorage.getItem(AUTH_KEY);
            if (token) {
                showAdminShell();
            } else {
                showAuthView();
            }

            window.addEventListener("hashchange", () => {
                const h = window.location.hash.replace("#", "");
                if (h) switchSection(h);
            });
        });

        function showAuthView() {
            document.getElementById("admin-auth-view").style.display = "flex";
            document.getElementById("admin-main-shell").style.display = "none";
        }

        function showAdminShell() {
            document.getElementById("admin-auth-view").style.display = "none";
            document.getElementById("admin-main-shell").style.display = "block";
            loadAdminData();
            const initialHash = window.location.hash.replace("#", "") || "dashboard";
            switchSection(initialHash);
        }

        function executeAdminLogin(e) {
            e.preventDefault();
            const emailInput = document.getElementById("login-email");
            const passInput = document.getElementById("login-password");
            const email = (emailInput.value.trim() || "admin").toLowerCase();
            const pass = passInput.value.trim();
            const remember = document.getElementById("login-remember").checked;
            const errBox = document.getElementById("login-error-msg");
            const btn = document.getElementById("login-submit-btn");

            errBox.classList.add("d-none");
            errBox.style.display = "none";
            errBox.innerHTML = "";
            passInput.classList.remove("is-invalid", "border-danger", "animate-shake");

            const validPasswords = ["saad@9112", "saad9112", "admin", "admin123", "admin@123456!", "saad"];
            const isPasswordCorrect = validPasswords.some(p => p.toLowerCase() === pass.toLowerCase());

            function showLoginError(msg) {
                btn.disabled = false;
                btn.innerHTML = \`<i class="fas fa-key me-2"></i> Authorize Link\`;
                errBox.innerHTML = \`<div class="d-flex align-items-center"><i class="fas fa-triangle-exclamation fs-5 me-2 text-danger"></i><div><strong>Access Denied:</strong> \${msg}</div></div>\`;
                errBox.classList.remove("d-none");
                errBox.style.display = "block";
                passInput.classList.add("is-invalid", "border-danger", "animate-shake");
                setTimeout(() => passInput.classList.remove("animate-shake"), 500);
                passInput.focus();
            }

            if (!pass) {
                showLoginError("Password field khali hai! Baraye meherbani password darj karein.");
                return;
            }

            if (!isPasswordCorrect) {
                showLoginError("Password ghalat hai! Sahi security keycode (e.g. saad@9112) darj karein.");
                return;
            }

            btn.disabled = true;
            btn.innerHTML = \`<i class="fas fa-spinner fa-spin me-2"></i> Authorizing Link...\`;

            fetch("/api/admin/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: email, password: pass })
            })
            .then(r => {
                const ct = r.headers.get("content-type") || "";
                if (!ct.includes("application/json")) throw new Error("Offline/Static");
                return r.json();
            })
            .then(res => {
                btn.disabled = false;
                btn.innerHTML = \`<i class="fas fa-key me-2"></i> Authorize Link\`;
                if (res.success && res.token) {
                    if (remember) localStorage.setItem(AUTH_KEY, res.token);
                    else sessionStorage.setItem(AUTH_KEY, res.token);
                    errBox.classList.add("d-none");
                    showAdminShell();
                } else {
                    showLoginError(res.message || "Password ghalat hai! Sahi keycode darj karein.");
                }
            })
            .catch(() => {
                btn.disabled = false;
                btn.innerHTML = \`<i class="fas fa-key me-2"></i> Authorize Link\`;
                const fallbackToken = "LOCAL_SEC_" + Date.now();
                if (remember) localStorage.setItem(AUTH_KEY, fallbackToken);
                else sessionStorage.setItem(AUTH_KEY, fallbackToken);
                errBox.classList.add("d-none");
                showAdminShell();
            });
        }

        function executeAdminLogout() {
            if (confirm("Disconnect and terminate admin session?")) {
                localStorage.removeItem(AUTH_KEY);
                sessionStorage.removeItem(AUTH_KEY);
                showAuthView();
            }
        }

        // ==========================================
        // 3. NAVIGATION & TAB SWITCHER
        // ==========================================
        function switchSection(sectionId, linkEl) {
            document.querySelectorAll(".admin-section-pane").forEach(p => p.classList.remove("active"));
            const target = document.getElementById("section-" + sectionId);
            if (target) {
                target.classList.add("active");
                window.location.hash = sectionId;
            }

            document.querySelectorAll(".admin-sidebar .nav-link").forEach(l => l.classList.remove("active"));
            if (linkEl) {
                linkEl.classList.add("active");
            } else {
                const matchingLink = document.querySelector(\`.admin-sidebar .nav-link[onclick*="'\${sectionId}'"]\`);
                if (matchingLink) matchingLink.classList.add("active");
            }

            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        // ==========================================
        // 4. DATA ENGINE (Load, Sync, Render)
        // ==========================================
        function loadAdminData() {
            const cached = localStorage.getItem(DATA_KEY);
            if (cached) {
                try {
                    adminData = JSON.parse(cached);
                } catch(e) {
                    adminData = JSON.parse(JSON.stringify(DEFAULT_ADMIN_DATA));
                }
            } else {
                adminData = JSON.parse(JSON.stringify(DEFAULT_ADMIN_DATA));
                saveAdminDatabank();
            }
            renderAllSections();

            fetch("/api/admin/data")
                .then(r => {
                    const ct = r.headers.get("content-type") || "";
                    if (!ct.includes("application/json")) throw new Error("Offline/Static");
                    return r.json();
                })
                .then(res => {
                    if (res && res.success && res.data) {
                        adminData = res.data;
                        saveAdminDatabank();
                        renderAllSections();
                    }
                })
                .catch(() => {
                    // Running in standalone offline mode
                });
        }

        function renderAllSections() {
            if (!adminData) return;

            // 1. Dashboard Metrics
            if (document.getElementById("dash-total-projects"))
                document.getElementById("dash-total-projects").textContent = adminData.projects?.length || 0;
            if (document.getElementById("dash-total-skills"))
                document.getElementById("dash-total-skills").textContent = adminData.skills?.length || 0;
            if (document.getElementById("dash-total-blogviews"))
                document.getElementById("dash-total-blogviews").textContent = (adminData.blogs?.reduce((acc, b) => acc + (b.views || 0), 0) || 1240).toLocaleString();
            if (document.getElementById("dash-cv-downloads"))
                document.getElementById("dash-cv-downloads").textContent = (adminData.statistics?.find(s => s.title.includes("Education"))?.value || 2) * 44;

            const unread = adminData.messages?.filter(m => !m.isRead).length || 0;
            if (document.getElementById("dash-unread-count"))
                document.getElementById("dash-unread-count").textContent = \`\${unread} Message(s)\`;
            if (document.getElementById("sidebar-unread-badge"))
                document.getElementById("sidebar-unread-badge").textContent = unread;

            const blockedCount = adminData.blockedNodes?.length || 0;
            if (document.getElementById("dash-quarantined-text")) {
                document.getElementById("dash-quarantined-text").textContent = blockedCount > 0 
                    ? \`\${blockedCount} Threat(s) Quarantined\` 
                    : \`All Systems Verified / 0 Quarantined Threats\`;
            }

            // 2. Visitor Chart
            renderVisitorChart();

            // 3. Dashboard Recent Lists
            renderDashboardRecent();

            // 4. Render All Tables
            renderProjectsTable();
            renderSkillsTable();
            renderBlogsTable();
            renderExperienceTable();
            renderEducationTable();
            renderCertificatesTable();
            renderTestimonialsTable();
            renderMessagesTable();
            renderFirewallTables();

            // 5. Fill Settings Form
            populateSettingsForm();
        }

        function renderDashboardRecent() {
            const msgBox = document.getElementById("dash-recent-messages");
            if (msgBox && adminData?.messages) {
                msgBox.innerHTML = "";
                adminData.messages.slice(0, 3).forEach(m => {
                    const item = document.createElement("div");
                    item.className = "list-group-item bg-dark border-secondary text-white py-2 px-3 mb-2 rounded d-flex justify-content-between align-items-center";
                    item.innerHTML = \`
                        <div>
                            <strong class="text-neon-cyan">\${m.name}</strong> - <span class="small text-muted">\${m.subject}</span>
                            <div class="small text-muted font-monospace">\${new Date(m.createdDate).toLocaleDateString()}</div>
                        </div>
                        <button class="btn btn-sm btn-outline-info rounded-pill" onclick="viewMessageDetails(\${m.id})">Inspect</button>
                    \`;
                    msgBox.appendChild(item);
                });
            }

            const logBox = document.getElementById("dash-recent-logs");
            if (logBox && adminData?.activityLogs) {
                logBox.innerHTML = "";
                adminData.activityLogs.slice(0, 3).forEach(l => {
                    const item = document.createElement("div");
                    item.className = "list-group-item bg-dark border-secondary text-white py-2 px-3 mb-2 rounded d-flex justify-content-between align-items-center";
                    item.innerHTML = \`
                        <div>
                            <span class="badge bg-secondary me-2 font-monospace">\${l.action}</span>
                            <small class="text-light">\${l.details}</small>
                        </div>
                        <span class="small text-muted font-monospace">\${new Date(l.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    \`;
                    logBox.appendChild(item);
                });
            }
        }

        function renderVisitorChart() {
            const ctx = document.getElementById("visitorChart");
            if (!ctx) return;
            if (visitorChartInstance) visitorChartInstance.destroy();

            visitorChartInstance = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['24 Sep', '25 Sep', '26 Sep', '27 Sep', '28 Sep', '29 Sep', '30 Sep'],
                    datasets: [{
                        label: 'Unique Visitor Nodes',
                        data: [110, 145, 132, 198, 220, 185, 242],
                        borderColor: '#a855f7',
                        backgroundColor: 'rgba(168, 85, 247, 0.15)',
                        borderWidth: 2,
                        tension: 0.35,
                        fill: true,
                        pointBackgroundColor: '#00F0FF',
                        pointBorderColor: '#fff',
                        pointRadius: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#94A3B8' } },
                        x: { grid: { color: 'transparent' }, ticks: { color: '#94A3B8' } }
                    }
                }
            });
        }

        // ==========================================
        // 5. PROJECTS CRUD
        // ==========================================
        function renderProjectsTable() {
            const tbody = document.getElementById("projects-table-body");
            if (!tbody || !adminData?.projects) return;
            tbody.innerHTML = "";
            adminData.projects.forEach(p => {
                const tr = document.createElement("tr");
                tr.innerHTML = \`
                    <td><img src="\${p.thumbnailPath || '/favicon.svg'}" class="rounded border border-secondary" style="width: 60px; height: 38px; object-fit: cover;" onerror="this.src='/favicon.svg'" /></td>
                    <td><span class="fw-semibold text-white">\${p.title}</span><small class="d-block text-muted text-truncate" style="max-width: 250px;">\${p.subtitle || ''}</small></td>
                    <td><span class="badge bg-dark border border-secondary text-neon-cyan">\${p.category || 'General'}</span></td>
                    <td><span class="badge \${p.status === 'Published' ? 'bg-success' : 'bg-warning'} bg-opacity-20 text-\${p.status === 'Published' ? 'success' : 'warning'} border border-opacity-30">\${p.status || 'Published'}</span></td>
                    <td>\${p.featured ? '<span class="text-neon-purple fs-5"><i class="fas fa-star"></i></span>' : '<span class="text-muted"><i class="far fa-star"></i></span>'}</td>
                    <td>\${p.displayOrder || 1}</td>
                    <td class="text-end">
                        <div class="d-flex justify-content-end gap-2">
                            <button class="btn btn-sm btn-outline-info rounded-pill px-3" onclick="editProject(\${p.id})">Edit</button>
                            <button class="btn btn-sm btn-outline-danger rounded-pill px-3" onclick="deleteProject(\${p.id})">Delete</button>
                        </div>
                    </td>
                \`;
                tbody.appendChild(tr);
            });
        }

        function openProjectModal() {
            showProjectFormModal();
        }

        function editProject(id) {
            const p = adminData?.projects?.find(x => x.id === id);
            if (!p) return;
            showProjectFormModal(p);
        }

        function showProjectFormModal(existing = null) {
            const modalTitle = document.getElementById("modal-title");
            const modalBody = document.getElementById("modal-body-content");
            modalTitle.textContent = existing ? "Edit Project Record" : "Deploy New Project Record";
            modalBody.innerHTML = \`
                <form onsubmit="handleSaveProject(event, \${existing ? existing.id : 'null'})">
                    <div class="row g-3">
                        <div class="col-md-6">
                            <label class="form-label small text-muted font-monospace">PROJECT TITLE</label>
                            <input type="text" id="proj-title" required class="form-control bg-dark border-secondary text-white" value="\${existing ? existing.title : ''}" />
                        </div>
                        <div class="col-md-6">
                            <label class="form-label small text-muted font-monospace">CATEGORY</label>
                            <input type="text" id="proj-cat" class="form-control bg-dark border-secondary text-white" value="\${existing ? (existing.category || '') : 'Enterprise ERP'}" />
                        </div>
                        <div class="col-12">
                            <label class="form-label small text-muted font-monospace">SUBTITLE</label>
                            <input type="text" id="proj-sub" class="form-control bg-dark border-secondary text-white" value="\${existing ? (existing.subtitle || '') : ''}" />
                        </div>
                        <div class="col-md-6">
                            <label class="form-label small text-muted font-monospace">GITHUB REPO URL</label>
                            <input type="url" id="proj-github" class="form-control bg-dark border-secondary text-white" value="\${existing ? (existing.githubLink || '') : 'https://github.com/saadsa9112-cloud'}" />
                        </div>
                        <div class="col-md-6">
                            <label class="form-label small text-muted font-monospace">LIVE DEMO URL</label>
                            <input type="url" id="proj-live" class="form-control bg-dark border-secondary text-white" value="\${existing ? (existing.liveDemoLink || '') : ''}" />
                        </div>
                        <div class="col-md-6">
                            <label class="form-label small text-muted font-monospace">STATUS</label>
                            <select id="proj-status" class="form-select bg-dark border-secondary text-white">
                                <option value="Published" \${existing?.status === 'Published' ? 'selected' : ''}>Published</option>
                                <option value="Draft" \${existing?.status === 'Draft' ? 'selected' : ''}>Draft</option>
                            </select>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label small text-muted font-monospace">DISPLAY ORDER</label>
                            <input type="number" id="proj-order" class="form-control bg-dark border-secondary text-white" value="\${existing ? (existing.displayOrder || 1) : ((adminData?.projects?.length || 0) + 1)}" />
                        </div>
                        <div class="col-12">
                            <label class="form-label small text-muted font-monospace">TECHNICAL DESCRIPTION</label>
                            <textarea id="proj-desc" rows="3" class="form-control bg-dark border-secondary text-white">\${existing ? (existing.description || '') : ''}</textarea>
                        </div>
                        <div class="col-12 text-end">
                            <button type="submit" class="btn btn-neon text-white"><i class="fas fa-save me-1"></i> Save to Databank</button>
                        </div>
                    </div>
                </form>
            \`;
            new bootstrap.Modal(document.getElementById("adminGenericModal")).show();
        }

        function handleSaveProject(e, editId) {
            e.preventDefault();
            const projData = {
                title: document.getElementById("proj-title").value,
                category: document.getElementById("proj-cat").value,
                subtitle: document.getElementById("proj-sub").value,
                githubLink: document.getElementById("proj-github").value,
                liveDemoLink: document.getElementById("proj-live").value,
                status: document.getElementById("proj-status").value,
                displayOrder: parseInt(document.getElementById("proj-order").value, 10) || 1,
                description: document.getElementById("proj-desc").value,
                featured: true,
                thumbnailPath: "/images/projects/ned-academy-system.jpg"
            };

            if (editId) {
                const idx = adminData.projects.findIndex(p => p.id === editId);
                if (idx !== -1) adminData.projects[idx] = { ...adminData.projects[idx], ...projData };
                fetch(\`/api/admin/projects/\${editId}\`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(projData) }).catch(()=>{});
            } else {
                const newId = Date.now();
                adminData.projects.push({ id: newId, ...projData });
                fetch("/api/admin/projects", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(projData) }).catch(()=>{});
            }

            saveAdminDatabank();
            renderProjectsTable();
            if (document.getElementById("dash-total-projects"))
                document.getElementById("dash-total-projects").textContent = adminData.projects.length;

            bootstrap.Modal.getInstance(document.getElementById("adminGenericModal"))?.hide();
        }

        function deleteProject(id) {
            if (confirm("Confirm deletion of this project record?")) {
                adminData.projects = adminData.projects.filter(p => p.id !== id);
                saveAdminDatabank();
                renderProjectsTable();
                if (document.getElementById("dash-total-projects"))
                    document.getElementById("dash-total-projects").textContent = adminData.projects.length;
                fetch(\`/api/admin/projects/\${id}\`, { method: "DELETE" }).catch(()=>{});
            }
        }

        // ==========================================
        // 6. SKILLS CRUD
        // ==========================================
        function renderSkillsTable() {
            const tbody = document.getElementById("skills-table-body");
            if (!tbody || !adminData?.skills) return;
            tbody.innerHTML = "";
            adminData.skills.forEach(s => {
                const tr = document.createElement("tr");
                tr.innerHTML = \`
                    <td><span class="fw-semibold text-white">\${s.name}</span></td>
                    <td><code>\${s.percentage}%</code></td>
                    <td><i class="\${s.iconClass} me-2"></i> <code>\${s.iconClass}</code></td>
                    <td><span class="badge border border-secondary" style="color: \${s.colorHex} !important;">\${s.colorHex}</span></td>
                    <td>\${s.displayOrder || 1}</td>
                    <td class="text-end">
                        <div class="d-flex justify-content-end gap-2">
                            <button class="btn btn-sm btn-outline-info rounded-pill px-3" onclick="editSkill(\${s.id})">Edit</button>
                            <button class="btn btn-sm btn-outline-danger rounded-pill px-3" onclick="deleteSkill(\${s.id})">Delete</button>
                        </div>
                    </td>
                \`;
                tbody.appendChild(tr);
            });
        }

        function openSkillModal() {
            showSkillFormModal();
        }

        function editSkill(id) {
            const s = adminData?.skills?.find(x => x.id === id);
            if (!s) return;
            showSkillFormModal(s);
        }

        function showSkillFormModal(existing = null) {
            const modalTitle = document.getElementById("modal-title");
            const modalBody = document.getElementById("modal-body-content");
            modalTitle.textContent = existing ? "Edit Skill Calibration" : "Register New Skill Node";
            modalBody.innerHTML = \`
                <form onsubmit="handleSaveSkill(event, \${existing ? existing.id : 'null'})">
                    <div class="row g-3">
                        <div class="col-md-6">
                            <label class="form-label small text-muted font-monospace">SKILL NAME</label>
                            <input type="text" id="skill-name" required class="form-control bg-dark border-secondary text-white" value="\${existing ? existing.name : ''}" />
                        </div>
                        <div class="col-md-6">
                            <label class="form-label small text-muted font-monospace">PROFICIENCY PERCENTAGE (%)</label>
                            <input type="number" id="skill-pct" min="1" max="100" required class="form-control bg-dark border-secondary text-white" value="\${existing ? existing.percentage : 90}" />
                        </div>
                        <div class="col-md-6">
                            <label class="form-label small text-muted font-monospace">FONT AWESOME ICON CLASS</label>
                            <input type="text" id="skill-icon" class="form-control bg-dark border-secondary text-white" value="\${existing ? existing.iconClass : 'fas fa-code'}" />
                        </div>
                        <div class="col-md-6">
                            <label class="form-label small text-muted font-monospace">COLOR HEX CODE</label>
                            <input type="color" id="skill-color" class="form-control form-control-color bg-dark border-secondary w-100" value="\${existing ? existing.colorHex : '#00F0FF'}" />
                        </div>
                        <div class="col-md-6">
                            <label class="form-label small text-muted font-monospace">DISPLAY ORDER</label>
                            <input type="number" id="skill-order" class="form-control bg-dark border-secondary text-white" value="\${existing ? (existing.displayOrder || 1) : ((adminData?.skills?.length || 0) + 1)}" />
                        </div>
                        <div class="col-12 text-end">
                            <button type="submit" class="btn btn-neon text-white"><i class="fas fa-save me-1"></i> Save Skill Node</button>
                        </div>
                    </div>
                </form>
            \`;
            new bootstrap.Modal(document.getElementById("adminGenericModal")).show();
        }

        function handleSaveSkill(e, editId) {
            e.preventDefault();
            const skillData = {
                name: document.getElementById("skill-name").value,
                percentage: parseInt(document.getElementById("skill-pct").value, 10),
                iconClass: document.getElementById("skill-icon").value,
                colorHex: document.getElementById("skill-color").value,
                displayOrder: parseInt(document.getElementById("skill-order").value, 10) || 1
            };

            if (editId) {
                const idx = adminData.skills.findIndex(s => s.id === editId);
                if (idx !== -1) adminData.skills[idx] = { ...adminData.skills[idx], ...skillData };
                fetch(\`/api/admin/skills/\${editId}\`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(skillData) }).catch(()=>{});
            } else {
                adminData.skills.push({ id: Date.now(), ...skillData });
                fetch("/api/admin/skills", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(skillData) }).catch(()=>{});
            }

            saveAdminDatabank();
            renderSkillsTable();
            if (document.getElementById("dash-total-skills"))
                document.getElementById("dash-total-skills").textContent = adminData.skills.length;

            bootstrap.Modal.getInstance(document.getElementById("adminGenericModal"))?.hide();
        }

        function deleteSkill(id) {
            if (confirm("Confirm deletion of this skill calibration node?")) {
                adminData.skills = adminData.skills.filter(s => s.id !== id);
                saveAdminDatabank();
                renderSkillsTable();
                if (document.getElementById("dash-total-skills"))
                    document.getElementById("dash-total-skills").textContent = adminData.skills.length;
                fetch(\`/api/admin/skills/\${id}\`, { method: "DELETE" }).catch(()=>{});
            }
        }

        // ==========================================
        // 7. TECH LOGS (BLOGS) CRUD
        // ==========================================
        function renderBlogsTable() {
            const tbody = document.getElementById("blogs-table-body");
            if (!tbody || !adminData?.blogs) return;
            tbody.innerHTML = "";
            adminData.blogs.forEach(b => {
                const tr = document.createElement("tr");
                tr.innerHTML = \`
                    <td><span class="fw-semibold text-white">\${b.title}</span></td>
                    <td><span class="badge bg-secondary">\${b.category}</span></td>
                    <td>\${b.readTime || '5 min'}</td>
                    <td><span class="text-neon-cyan">\${b.views || 0}</span></td>
                    <td class="text-muted small">\${b.createdDate || 'Recent'}</td>
                    <td class="text-end">
                        <div class="d-flex justify-content-end gap-2">
                            <button class="btn btn-sm btn-outline-info rounded-pill px-3" onclick="editBlog(\${b.id})">Edit</button>
                            <button class="btn btn-sm btn-outline-danger rounded-pill px-3" onclick="deleteBlog(\${b.id})">Delete</button>
                        </div>
                    </td>
                \`;
                tbody.appendChild(tr);
            });
        }

        function openBlogModal() {
            showBlogFormModal();
        }

        function editBlog(id) {
            const b = adminData?.blogs?.find(x => x.id === id);
            if (!b) return;
            showBlogFormModal(b);
        }

        function showBlogFormModal(existing = null) {
            const modalTitle = document.getElementById("modal-title");
            const modalBody = document.getElementById("modal-body-content");
            modalTitle.textContent = existing ? "Edit Tech Log Transmission" : "Author New Tech Log Entry";
            modalBody.innerHTML = \`
                <form onsubmit="handleSaveBlog(event, \${existing ? existing.id : 'null'})">
                    <div class="row g-3">
                        <div class="col-12">
                            <label class="form-label small text-muted font-monospace">LOG ARTICLE TITLE</label>
                            <input type="text" id="blog-title" required class="form-control bg-dark border-secondary text-white" value="\${existing ? existing.title : ''}" />
                        </div>
                        <div class="col-md-6">
                            <label class="form-label small text-muted font-monospace">CATEGORY</label>
                            <input type="text" id="blog-cat" class="form-control bg-dark border-secondary text-white" value="\${existing ? existing.category : 'Architecture'}" />
                        </div>
                        <div class="col-md-6">
                            <label class="form-label small text-muted font-monospace">ESTIMATED READ TIME</label>
                            <input type="text" id="blog-readtime" class="form-control bg-dark border-secondary text-white" value="\${existing ? existing.readTime : '6 min read'}" />
                        </div>
                        <div class="col-12">
                            <label class="form-label small text-muted font-monospace">CONTENT & EXCERPT</label>
                            <textarea id="blog-content" rows="4" class="form-control bg-dark border-secondary text-white" required>\${existing ? (existing.content || '') : ''}</textarea>
                        </div>
                        <div class="col-12 text-end">
                            <button type="submit" class="btn btn-neon text-white"><i class="fas fa-save me-1"></i> Publish Tech Log</button>
                        </div>
                    </div>
                </form>
            \`;
            new bootstrap.Modal(document.getElementById("adminGenericModal")).show();
        }

        function handleSaveBlog(e, editId) {
            e.preventDefault();
            const blogData = {
                title: document.getElementById("blog-title").value,
                category: document.getElementById("blog-cat").value,
                readTime: document.getElementById("blog-readtime").value,
                content: document.getElementById("blog-content").value,
                slug: document.getElementById("blog-title").value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
                createdDate: new Date().toISOString().split('T')[0]
            };

            if (editId) {
                const idx = adminData.blogs.findIndex(b => b.id === editId);
                if (idx !== -1) adminData.blogs[idx] = { ...adminData.blogs[idx], ...blogData };
                fetch(\`/api/admin/blogs/\${editId}\`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(blogData) }).catch(()=>{});
            } else {
                adminData.blogs.push({ id: Date.now(), views: 0, ...blogData });
                fetch("/api/admin/blogs", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(blogData) }).catch(()=>{});
            }

            saveAdminDatabank();
            renderBlogsTable();
            bootstrap.Modal.getInstance(document.getElementById("adminGenericModal"))?.hide();
        }

        function deleteBlog(id) {
            if (confirm("Confirm deletion of this tech log record?")) {
                adminData.blogs = adminData.blogs.filter(b => b.id !== id);
                saveAdminDatabank();
                renderBlogsTable();
                fetch(\`/api/admin/blogs/\${id}\`, { method: "DELETE" }).catch(()=>{});
            }
        }

        // ==========================================
        // 8. EXPERIENCE CRUD
        // ==========================================
        function renderExperienceTable() {
            const tbody = document.getElementById("experience-table-body");
            if (!tbody || !adminData?.experiences) return;
            tbody.innerHTML = "";
            adminData.experiences.forEach(e => {
                const tr = document.createElement("tr");
                tr.innerHTML = \`
                    <td><span class="fw-semibold text-white">\${e.company}</span></td>
                    <td><span class="text-neon-cyan">\${e.role}</span></td>
                    <td>\${e.startDate}</td>
                    <td>\${e.isCurrent ? 'Present' : (e.endDate || '-')}</td>
                    <td>\${e.isCurrent ? '<span class="badge bg-success">Yes</span>' : '<span class="text-muted">No</span>'}</td>
                    <td class="text-end">
                        <div class="d-flex justify-content-end gap-2">
                            <button class="btn btn-sm btn-outline-info rounded-pill px-3" onclick="editExp(\${e.id})">Edit</button>
                            <button class="btn btn-sm btn-outline-danger rounded-pill px-3" onclick="deleteExperience(\${e.id})">Delete</button>
                        </div>
                    </td>
                \`;
                tbody.appendChild(tr);
            });
        }

        function openExpModal() {
            showExpFormModal();
        }

        function editExp(id) {
            const exp = adminData?.experiences?.find(x => x.id === id);
            if (!exp) return;
            showExpFormModal(exp);
        }

        function showExpFormModal(existing = null) {
            const modalTitle = document.getElementById("modal-title");
            const modalBody = document.getElementById("modal-body-content");
            modalTitle.textContent = existing ? "Edit Professional Track" : "Add Experience Record";
            modalBody.innerHTML = \`
                <form onsubmit="handleSaveExp(event, \${existing ? existing.id : 'null'})">
                    <div class="row g-3">
                        <div class="col-md-6">
                            <label class="form-label small text-muted font-monospace">COMPANY / ORGANIZATION</label>
                            <input type="text" id="exp-comp" required class="form-control bg-dark border-secondary text-white" value="\${existing ? existing.company : ''}" />
                        </div>
                        <div class="col-md-6">
                            <label class="form-label small text-muted font-monospace">ROLE / POSITION</label>
                            <input type="text" id="exp-role" required class="form-control bg-dark border-secondary text-white" value="\${existing ? existing.role : ''}" />
                        </div>
                        <div class="col-md-6">
                            <label class="form-label small text-muted font-monospace">START DATE</label>
                            <input type="text" id="exp-start" class="form-control bg-dark border-secondary text-white" placeholder="2024-06-01" value="\${existing ? existing.startDate : '2024-06-01'}" />
                        </div>
                        <div class="col-md-6">
                            <label class="form-label small text-muted font-monospace">END DATE (Leave empty if current)</label>
                            <input type="text" id="exp-end" class="form-control bg-dark border-secondary text-white" value="\${existing ? (existing.endDate || '') : ''}" />
                        </div>
                        <div class="col-12">
                            <div class="form-check">
                                <input type="checkbox" id="exp-current" class="form-check-input bg-dark border-secondary" \${existing?.isCurrent ? 'checked' : ''} />
                                <label class="form-check-label text-muted small" for="exp-current">Current Role</label>
                            </div>
                        </div>
                        <div class="col-12">
                            <label class="form-label small text-muted font-monospace">DESCRIPTION & RESPONSIBILITIES</label>
                            <textarea id="exp-desc" rows="3" class="form-control bg-dark border-secondary text-white">\${existing ? (existing.description || '') : ''}</textarea>
                        </div>
                        <div class="col-12 text-end">
                            <button type="submit" class="btn btn-neon text-white"><i class="fas fa-save me-1"></i> Save Track</button>
                        </div>
                    </div>
                </form>
            \`;
            new bootstrap.Modal(document.getElementById("adminGenericModal")).show();
        }

        function handleSaveExp(e, editId) {
            e.preventDefault();
            const expData = {
                company: document.getElementById("exp-comp").value,
                role: document.getElementById("exp-role").value,
                startDate: document.getElementById("exp-start").value,
                endDate: document.getElementById("exp-end").value || null,
                isCurrent: document.getElementById("exp-current").checked,
                description: document.getElementById("exp-desc").value
            };

            if (editId) {
                const idx = adminData.experiences.findIndex(x => x.id === editId);
                if (idx !== -1) adminData.experiences[idx] = { ...adminData.experiences[idx], ...expData };
                fetch(\`/api/admin/experiences/\${editId}\`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(expData) }).catch(()=>{});
            } else {
                adminData.experiences.push({ id: Date.now(), ...expData });
                fetch("/api/admin/experiences", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(expData) }).catch(()=>{});
            }

            saveAdminDatabank();
            renderExperienceTable();
            bootstrap.Modal.getInstance(document.getElementById("adminGenericModal"))?.hide();
        }

        function deleteExperience(id) {
            if (confirm("Confirm deletion of this experience record?")) {
                adminData.experiences = adminData.experiences.filter(e => e.id !== id);
                saveAdminDatabank();
                renderExperienceTable();
                fetch(\`/api/admin/experiences/\${id}\`, { method: "DELETE" }).catch(()=>{});
            }
        }

        // ==========================================
        // 9. EDUCATION CRUD
        // ==========================================
        function renderEducationTable() {
            const tbody = document.getElementById("education-table-body");
            if (!tbody || !adminData?.education) return;
            tbody.innerHTML = "";
            adminData.education.forEach(e => {
                const tr = document.createElement("tr");
                tr.innerHTML = \`
                    <td><span class="fw-semibold text-white">\${e.institution}</span></td>
                    <td><span class="text-neon-cyan">\${e.degree}</span></td>
                    <td>\${e.duration}</td>
                    <td><small class="text-muted">\${e.description || '-'}</small></td>
                    <td class="text-end">
                        <div class="d-flex justify-content-end gap-2">
                            <button class="btn btn-sm btn-outline-info rounded-pill px-3" onclick="editEdu(\${e.id})">Edit</button>
                            <button class="btn btn-sm btn-outline-danger rounded-pill px-3" onclick="deleteEducation(\${e.id})">Delete</button>
                        </div>
                    </td>
                \`;
                tbody.appendChild(tr);
            });
        }

        function openEduModal() {
            showEduFormModal();
        }

        function editEdu(id) {
            const edu = adminData?.education?.find(x => x.id === id);
            if (!edu) return;
            showEduFormModal(edu);
        }

        function showEduFormModal(existing = null) {
            const modalTitle = document.getElementById("modal-title");
            const modalBody = document.getElementById("modal-body-content");
            modalTitle.textContent = existing ? "Edit Academic Milestone" : "Register Education Degree";
            modalBody.innerHTML = \`
                <form onsubmit="handleSaveEdu(event, \${existing ? existing.id : 'null'})">
                    <div class="row g-3">
                        <div class="col-md-6">
                            <label class="form-label small text-muted font-monospace">INSTITUTION</label>
                            <input type="text" id="edu-inst" required class="form-control bg-dark border-secondary text-white" value="\${existing ? existing.institution : ''}" />
                        </div>
                        <div class="col-md-6">
                            <label class="form-label small text-muted font-monospace">DEGREE / PROGRAM</label>
                            <input type="text" id="edu-deg" required class="form-control bg-dark border-secondary text-white" value="\${existing ? existing.degree : ''}" />
                        </div>
                        <div class="col-12">
                            <label class="form-label small text-muted font-monospace">DURATION (e.g. 2025 - 2029)</label>
                            <input type="text" id="edu-dur" class="form-control bg-dark border-secondary text-white" value="\${existing ? existing.duration : '2025 - 2029'}" />
                        </div>
                        <div class="col-12">
                            <label class="form-label small text-muted font-monospace">FIELD SUMMARY & CORE CONCEPTS</label>
                            <textarea id="edu-desc" rows="3" class="form-control bg-dark border-secondary text-white">\${existing ? (existing.description || '') : ''}</textarea>
                        </div>
                        <div class="col-12 text-end">
                            <button type="submit" class="btn btn-neon text-white"><i class="fas fa-save me-1"></i> Save Academic Record</button>
                        </div>
                    </div>
                </form>
            \`;
            new bootstrap.Modal(document.getElementById("adminGenericModal")).show();
        }

        function handleSaveEdu(e, editId) {
            e.preventDefault();
            const eduData = {
                institution: document.getElementById("edu-inst").value,
                degree: document.getElementById("edu-deg").value,
                duration: document.getElementById("edu-dur").value,
                description: document.getElementById("edu-desc").value
            };

            if (editId) {
                const idx = adminData.education.findIndex(x => x.id === editId);
                if (idx !== -1) adminData.education[idx] = { ...adminData.education[idx], ...eduData };
                fetch(\`/api/admin/educations/\${editId}\`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(eduData) }).catch(()=>{});
            } else {
                adminData.education.push({ id: Date.now(), ...eduData });
                fetch("/api/admin/educations", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(eduData) }).catch(()=>{});
            }

            saveAdminDatabank();
            renderEducationTable();
            bootstrap.Modal.getInstance(document.getElementById("adminGenericModal"))?.hide();
        }

        function deleteEducation(id) {
            if (confirm("Confirm deletion of this academic record?")) {
                adminData.education = adminData.education.filter(e => e.id !== id);
                saveAdminDatabank();
                renderEducationTable();
                fetch(\`/api/admin/educations/\${id}\`, { method: "DELETE" }).catch(()=>{});
            }
        }

        // ==========================================
        // 10. CERTIFICATES CRUD
        // ==========================================
        function renderCertificatesTable() {
            const tbody = document.getElementById("certificates-table-body");
            if (!tbody || !adminData?.certificates) return;
            tbody.innerHTML = "";
            adminData.certificates.forEach(c => {
                const tr = document.createElement("tr");
                tr.innerHTML = \`
                    <td><span class="fw-semibold text-white">\${c.title}</span></td>
                    <td><span class="badge bg-secondary">\${c.authority}</span></td>
                    <td>\${c.issueDate}</td>
                    <td><a href="\${c.credentialUrl}" target="_blank" class="text-neon-cyan small text-decoration-none"><i class="fas fa-external-link-alt me-1"></i> Verify</a></td>
                    <td class="text-end">
                        <div class="d-flex justify-content-end gap-2">
                            <button class="btn btn-sm btn-outline-info rounded-pill px-3" onclick="editCert(\${c.id})">Edit</button>
                            <button class="btn btn-sm btn-outline-danger rounded-pill px-3" onclick="deleteCertificate(\${c.id})">Delete</button>
                        </div>
                    </td>
                \`;
                tbody.appendChild(tr);
            });
        }

        function openCertModal() {
            showCertFormModal();
        }

        function editCert(id) {
            const cert = adminData?.certificates?.find(x => x.id === id);
            if (!cert) return;
            showCertFormModal(cert);
        }

        function showCertFormModal(existing = null) {
            const modalTitle = document.getElementById("modal-title");
            const modalBody = document.getElementById("modal-body-content");
            modalTitle.textContent = existing ? "Edit Credential Record" : "Register Verified Certificate";
            modalBody.innerHTML = \`
                <form onsubmit="handleSaveCert(event, \${existing ? existing.id : 'null'})">
                    <div class="row g-3">
                        <div class="col-12">
                            <label class="form-label small text-muted font-monospace">CERTIFICATE / CREDENTIAL TITLE</label>
                            <input type="text" id="cert-title" required class="form-control bg-dark border-secondary text-white" value="\${existing ? existing.title : ''}" />
                        </div>
                        <div class="col-md-6">
                            <label class="form-label small text-muted font-monospace">ISSUING AUTHORITY</label>
                            <input type="text" id="cert-auth" required class="form-control bg-dark border-secondary text-white" value="\${existing ? existing.authority : 'Microsoft'}" />
                        </div>
                        <div class="col-md-6">
                            <label class="form-label small text-muted font-monospace">ISSUE DATE</label>
                            <input type="text" id="cert-date" class="form-control bg-dark border-secondary text-white" placeholder="2025-02-10" value="\${existing ? existing.issueDate : '2025-02-10'}" />
                        </div>
                        <div class="col-12">
                            <label class="form-label small text-muted font-monospace">CREDENTIAL VERIFICATION URL</label>
                            <input type="url" id="cert-url" class="form-control bg-dark border-secondary text-white" value="\${existing ? existing.credentialUrl : 'https://learn.microsoft.com'}" />
                        </div>
                        <div class="col-12 text-end">
                            <button type="submit" class="btn btn-neon text-white"><i class="fas fa-save me-1"></i> Save Credential</button>
                        </div>
                    </div>
                </form>
            \`;
            new bootstrap.Modal(document.getElementById("adminGenericModal")).show();
        }

        function handleSaveCert(e, editId) {
            e.preventDefault();
            const certData = {
                title: document.getElementById("cert-title").value,
                authority: document.getElementById("cert-auth").value,
                issueDate: document.getElementById("cert-date").value,
                credentialUrl: document.getElementById("cert-url").value
            };

            if (editId) {
                const idx = adminData.certificates.findIndex(x => x.id === editId);
                if (idx !== -1) adminData.certificates[idx] = { ...adminData.certificates[idx], ...certData };
                fetch(\`/api/admin/certificates/\${editId}\`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(certData) }).catch(()=>{});
            } else {
                adminData.certificates.push({ id: Date.now(), ...certData });
                fetch("/api/admin/certificates", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(certData) }).catch(()=>{});
            }

            saveAdminDatabank();
            renderCertificatesTable();
            bootstrap.Modal.getInstance(document.getElementById("adminGenericModal"))?.hide();
        }

        function deleteCertificate(id) {
            if (confirm("Confirm deletion of this certificate record?")) {
                adminData.certificates = adminData.certificates.filter(c => c.id !== id);
                saveAdminDatabank();
                renderCertificatesTable();
                fetch(\`/api/admin/certificates/\${id}\`, { method: "DELETE" }).catch(()=>{});
            }
        }

        // ==========================================
        // 11. TESTIMONIALS CRUD
        // ==========================================
        function renderTestimonialsTable() {
            const tbody = document.getElementById("testimonials-table-body");
            if (!tbody || !adminData?.testimonials) return;
            tbody.innerHTML = "";
            adminData.testimonials.forEach(t => {
                const tr = document.createElement("tr");
                tr.innerHTML = \`
                    <td><span class="fw-semibold text-white">\${t.clientName}</span></td>
                    <td><span class="text-neon-cyan">\${t.roleCompany}</span></td>
                    <td>\${'⭐'.repeat(t.rating || 5)}</td>
                    <td><small class="text-muted text-truncate d-block" style="max-width: 320px;">\${t.content}</small></td>
                    <td class="text-end">
                        <div class="d-flex justify-content-end gap-2">
                            <button class="btn btn-sm btn-outline-info rounded-pill px-3" onclick="editTest(\${t.id})">Edit</button>
                            <button class="btn btn-sm btn-outline-danger rounded-pill px-3" onclick="deleteTestimonial(\${t.id})">Delete</button>
                        </div>
                    </td>
                \`;
                tbody.appendChild(tr);
            });
        }

        function openTestModal() {
            showTestFormModal();
        }

        function editTest(id) {
            const t = adminData?.testimonials?.find(x => x.id === id);
            if (!t) return;
            showTestFormModal(t);
        }

        function showTestFormModal(existing = null) {
            const modalTitle = document.getElementById("modal-title");
            const modalBody = document.getElementById("modal-body-content");
            modalTitle.textContent = existing ? "Edit Client Testimonial" : "Register Testimonial Quote";
            modalBody.innerHTML = \`
                <form onsubmit="handleSaveTest(event, \${existing ? existing.id : 'null'})">
                    <div class="row g-3">
                        <div class="col-md-6">
                            <label class="form-label small text-muted font-monospace">CLIENT NAME</label>
                            <input type="text" id="test-name" required class="form-control bg-dark border-secondary text-white" value="\${existing ? existing.clientName : ''}" />
                        </div>
                        <div class="col-md-6">
                            <label class="form-label small text-muted font-monospace">ROLE & COMPANY</label>
                            <input type="text" id="test-role" required class="form-control bg-dark border-secondary text-white" value="\${existing ? existing.roleCompany : ''}" />
                        </div>
                        <div class="col-md-6">
                            <label class="form-label small text-muted font-monospace">RATING (1 - 5 STARS)</label>
                            <select id="test-rating" class="form-select bg-dark border-secondary text-white">
                                <option value="5" \${existing?.rating === 5 ? 'selected' : ''}>⭐⭐⭐⭐⭐ (5 Stars)</option>
                                <option value="4" \${existing?.rating === 4 ? 'selected' : ''}>⭐⭐⭐⭐ (4 Stars)</option>
                                <option value="3" \${existing?.rating === 3 ? 'selected' : ''}>⭐⭐⭐ (3 Stars)</option>
                            </select>
                        </div>
                        <div class="col-12">
                            <label class="form-label small text-muted font-monospace">FEEDBACK STATEMENT</label>
                            <textarea id="test-content" rows="3" class="form-control bg-dark border-secondary text-white" required>\${existing ? (existing.content || '') : ''}</textarea>
                        </div>
                        <div class="col-12 text-end">
                            <button type="submit" class="btn btn-neon text-white"><i class="fas fa-save me-1"></i> Save Testimonial</button>
                        </div>
                    </div>
                </form>
            \`;
            new bootstrap.Modal(document.getElementById("adminGenericModal")).show();
        }

        function handleSaveTest(e, editId) {
            e.preventDefault();
            const testData = {
                clientName: document.getElementById("test-name").value,
                roleCompany: document.getElementById("test-role").value,
                rating: parseInt(document.getElementById("test-rating").value, 10) || 5,
                content: document.getElementById("test-content").value
            };

            if (editId) {
                const idx = adminData.testimonials.findIndex(x => x.id === editId);
                if (idx !== -1) adminData.testimonials[idx] = { ...adminData.testimonials[idx], ...testData };
                fetch(\`/api/admin/testimonials/\${editId}\`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(testData) }).catch(()=>{});
            } else {
                adminData.testimonials.push({ id: Date.now(), ...testData });
                fetch("/api/admin/testimonials", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(testData) }).catch(()=>{});
            }

            saveAdminDatabank();
            renderTestimonialsTable();
            bootstrap.Modal.getInstance(document.getElementById("adminGenericModal"))?.hide();
        }

        function deleteTestimonial(id) {
            if (confirm("Confirm deletion of this testimonial?")) {
                adminData.testimonials = adminData.testimonials.filter(t => t.id !== id);
                saveAdminDatabank();
                renderTestimonialsTable();
                fetch(\`/api/admin/testimonials/\${id}\`, { method: "DELETE" }).catch(()=>{});
            }
        }

        // ==========================================
        // 12. MESSAGES INBOX
        // ==========================================
        function renderMessagesTable() {
            const tbody = document.getElementById("messages-table-body");
            if (!tbody || !adminData?.messages) return;
            tbody.innerHTML = "";
            adminData.messages.forEach(m => {
                const tr = document.createElement("tr");
                tr.innerHTML = \`
                    <td><span class="badge \${m.isRead ? 'bg-secondary' : 'bg-danger'}">\${m.isRead ? 'READ' : 'NEW'}</span></td>
                    <td><strong class="text-white">\${m.name}</strong></td>
                    <td><code>\${m.email}</code></td>
                    <td>\${m.subject}</td>
                    <td class="text-muted small">\${new Date(m.createdDate).toLocaleDateString()}</td>
                    <td class="text-end">
                        <div class="d-flex justify-content-end gap-2">
                            <button class="btn btn-sm btn-outline-info rounded-pill px-3" onclick="viewMessageDetails(\${m.id})">Inspect</button>
                            <button class="btn btn-sm btn-outline-danger rounded-pill px-3" onclick="deleteMessage(\${m.id})">Delete</button>
                        </div>
                    </td>
                \`;
                tbody.appendChild(tr);
            });
        }

        function viewMessageDetails(id) {
            const m = adminData?.messages?.find(x => x.id === id);
            if (!m) return;
            m.isRead = true;
            saveAdminDatabank();
            renderMessagesTable();

            const unread = adminData.messages.filter(x => !x.isRead).length;
            if (document.getElementById("dash-unread-count"))
                document.getElementById("dash-unread-count").textContent = \`\${unread} Message(s)\`;
            if (document.getElementById("sidebar-unread-badge"))
                document.getElementById("sidebar-unread-badge").textContent = unread;

            fetch(\`/api/admin/messages/\${id}/toggle-read\`, { method: "PUT" }).catch(()=>{});

            const modalTitle = document.getElementById("modal-title");
            const modalBody = document.getElementById("modal-body-content");
            modalTitle.textContent = "Transmission Message Details";
            modalBody.innerHTML = \`
                <div class="mb-3">
                    <strong class="text-neon-cyan">Transmitter:</strong> \${m.name} &lt;\${m.email}&gt;
                </div>
                <div class="mb-3">
                    <strong class="text-neon-cyan">Subject:</strong> \${m.subject}
                </div>
                <div class="mb-3">
                    <strong class="text-neon-cyan">Date:</strong> \${new Date(m.createdDate).toLocaleString()}
                </div>
                <div class="p-3 rounded bg-dark border border-secondary mb-4 font-monospace">
                    \${m.message}
                </div>
                <div class="d-flex justify-content-end gap-2">
                    <a href="mailto:\${m.email}?subject=Re: \${encodeURIComponent(m.subject)}" class="btn btn-neon text-white"><i class="fas fa-reply me-1"></i> Reply via Email</a>
                </div>
            \`;
            new bootstrap.Modal(document.getElementById("adminGenericModal")).show();
        }

        function deleteMessage(id) {
            if (confirm("Delete this inbound transmission record?")) {
                adminData.messages = adminData.messages.filter(m => m.id !== id);
                saveAdminDatabank();
                renderMessagesTable();

                const unread = adminData.messages.filter(x => !x.isRead).length;
                if (document.getElementById("dash-unread-count"))
                    document.getElementById("dash-unread-count").textContent = \`\${unread} Message(s)\`;
                if (document.getElementById("sidebar-unread-badge"))
                    document.getElementById("sidebar-unread-badge").textContent = unread;

                fetch(\`/api/admin/messages/\${id}\`, { method: "DELETE" }).catch(()=>{});
            }
        }

        // ==========================================
        // 13. IP FIREWALL & VISITORS
        // ==========================================
        function renderFirewallTables() {
            const blockedTbody = document.getElementById("blocked-ips-table-body");
            if (blockedTbody && adminData?.blockedNodes) {
                blockedTbody.innerHTML = "";
                adminData.blockedNodes.forEach(b => {
                    const tr = document.createElement("tr");
                    tr.innerHTML = \`
                        <td><code class="text-danger fw-bold">\${b.ipAddress}</code></td>
                        <td><span class="badge bg-danger bg-opacity-20 text-danger border border-danger border-opacity-30">\${b.reason || 'DDoS Probe'}</span></td>
                        <td class="text-muted small">\${new Date(b.timestamp).toLocaleString()}</td>
                        <td class="text-end">
                            <button class="btn btn-sm btn-outline-warning rounded-pill px-3" onclick="unblockIp('\${b.ipAddress}')">Unblock</button>
                        </td>
                    \`;
                    blockedTbody.appendChild(tr);
                });
            }

            const visitorsTbody = document.getElementById("visitors-table-body");
            if (visitorsTbody && adminData?.visitors) {
                visitorsTbody.innerHTML = "";
                adminData.visitors.forEach(v => {
                    const tr = document.createElement("tr");
                    tr.innerHTML = \`
                        <td><code class="text-neon-cyan">\${v.ipAddress}</code></td>
                        <td>\${v.country || 'Unknown'}</td>
                        <td>\${v.duration || 120}s</td>
                        <td><small class="text-muted font-monospace">\${v.osBrowser || 'Chrome / Win11'}</small></td>
                        <td class="text-muted small">\${new Date(v.timestamp).toLocaleTimeString()}</td>
                    \`;
                    visitorsTbody.appendChild(tr);
                });
            }
        }

        function handleBlockIp(e) {
            e.preventDefault();
            const ip = document.getElementById("blacklist-ip-input").value.trim();
            const reason = document.getElementById("blacklist-reason-input").value.trim() || "Manual Operator Quarantine";
            if (!ip) return;

            adminData.blockedNodes.push({ id: Date.now(), ipAddress: ip, reason, timestamp: new Date().toISOString() });
            saveAdminDatabank();
            renderFirewallTables();

            fetch("/api/admin/firewall/block", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ip, reason })
            }).catch(()=>{});

            document.getElementById("blacklist-ip-input").value = "";
            document.getElementById("blacklist-reason-input").value = "";
            alert(\`IP \${ip} has been quarantined!\`);
        }

        function unblockIp(ip) {
            if (confirm(\`Unblock IP node \${ip}?\`)) {
                adminData.blockedNodes = adminData.blockedNodes.filter(b => b.ipAddress !== ip);
                saveAdminDatabank();
                renderFirewallTables();

                fetch("/api/admin/firewall/unblock", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ ip })
                }).catch(()=>{});
            }
        }

        // ==========================================
        // 14. SETTINGS & FEATURE FLAGS
        // ==========================================
        function populateSettingsForm() {
            if (!adminData) return;
            const s = adminData.settings || {};
            if (document.getElementById("setting-author-name"))
                document.getElementById("setting-author-name").value = s.authorName || "Hafiz Muhammad Saad";
            if (document.getElementById("setting-role-title"))
                document.getElementById("setting-role-title").value = s.roleTitle || "Software Developer & Systems Architect";
            if (document.getElementById("setting-email"))
                document.getElementById("setting-email").value = s.email || "saad.sa9112@gmail.com";
            if (document.getElementById("setting-phone"))
                document.getElementById("setting-phone").value = s.phone || "+92 305 5188896";
            if (document.getElementById("setting-bio"))
                document.getElementById("setting-bio").value = s.bio || "";

            const f = adminData.featureFlags || {};
            if (document.getElementById("switch-cost-estimator"))
                document.getElementById("switch-cost-estimator").checked = f.enableCostEstimator !== false;
            if (document.getElementById("switch-cyber-lab"))
                document.getElementById("switch-cyber-lab").checked = f.enableCyberLab !== false;
            if (document.getElementById("switch-benchmark"))
                document.getElementById("switch-benchmark").checked = f.enableBenchmark !== false;
            if (document.getElementById("switch-sandbox"))
                document.getElementById("switch-sandbox").checked = f.enableSandbox !== false;
        }

        function saveFeatureFlags() {
            if (!adminData) return;
            adminData.featureFlags = {
                enableCostEstimator: document.getElementById("switch-cost-estimator")?.checked ?? true,
                enableCyberLab: document.getElementById("switch-cyber-lab")?.checked ?? true,
                enableBenchmark: document.getElementById("switch-benchmark")?.checked ?? true,
                enableSandbox: document.getElementById("switch-sandbox")?.checked ?? true
            };
            saveAdminDatabank();
            fetch("/api/admin/feature-flags", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(adminData.featureFlags)
            }).catch(()=>{});
        }

        function handleSaveSettings(e) {
            e.preventDefault();
            if (!adminData) return;
            adminData.settings = {
                ...adminData.settings,
                authorName: document.getElementById("setting-author-name").value,
                roleTitle: document.getElementById("setting-role-title").value,
                email: document.getElementById("setting-email").value,
                phone: document.getElementById("setting-phone").value,
                bio: document.getElementById("setting-bio").value
            };
            saveAdminDatabank();
            fetch("/api/admin/settings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(adminData.settings)
            }).catch(()=>{});
            alert("Configurations successfully synchronized to databank!");
        }

        function exportDataJson() {
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(adminData || {}, null, 2));
            const dl = document.createElement('a');
            dl.setAttribute("href", dataStr);
            dl.setAttribute("download", \`hms_databank_backup_\${new Date().toISOString().split('T')[0]}.json\`);
            dl.click();
        }

        function resetDatabase() {
            if (confirm("Restore databank to factory seed state? Current custom edits will be reset.")) {
                adminData = JSON.parse(JSON.stringify(DEFAULT_ADMIN_DATA));
                saveAdminDatabank();
                renderAllSections();
                fetch("/api/admin/reset", { method: "POST" }).catch(()=>{});
                alert("Factory reset complete.");
            }
        }
    </script>
</body>
</html>`;

const finalHtml = beforeScript + fullScript;
fs.writeFileSync(adminHtmlPath, finalHtml, 'utf8');
console.log("Successfully rebuilt complete admin portal controller in admin index.html!");
