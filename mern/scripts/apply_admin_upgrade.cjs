const fs = require('fs');
const path = require('path');
const seedData = require('../server/data/seedData.js');

const adminHtmlPath = path.resolve(__dirname, '../client/admin/index.html');
let html = fs.readFileSync(adminHtmlPath, 'utf8');

// 1. Ensure shake and alert styling
const extraStyles = `
        #login-error-msg {
            background: rgba(239, 68, 68, 0.18) !important;
            border: 1px solid #ef4444 !important;
            color: #fee2e2 !important;
            box-shadow: 0 0 15px rgba(239, 68, 68, 0.35);
            border-radius: 8px;
            font-size: 0.9rem;
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

if (!html.includes('#login-error-msg {')) {
    html = html.replace('    </style>', extraStyles + '\n    </style>');
}

// 2. Ensure login error message div is clean
html = html.replace(
    /<div id="login-error-msg"[^>]*>.*?<\/div>/s,
    '<div id="login-error-msg" class="alert alert-danger py-2 px-3 small font-monospace d-none mb-3"></div>'
);

// 3. Ensure input has clean placeholder and no value pre-filled
html = html.replace(
    /<input type="text" id="login-email"[^>]*\/>/,
    '<input type="text" id="login-email" class="form-control bg-dark border-secondary text-white py-2" placeholder="admin@corenode.io" autocomplete="username" />'
);

html = html.replace(
    /<input type="password" id="login-password"[^>]*\/>/,
    '<input type="password" id="login-password" class="form-control bg-dark border-secondary text-white py-2" placeholder="••••••••••••" required autocomplete="current-password" />'
);

// 4. Replace script section around data and login
const scriptStartIdx = html.indexOf('<script>\r\n        // State store') !== -1 
    ? html.indexOf('<script>\r\n        // State store')
    : html.indexOf('<script>\n        // State store');

const scriptEndTarget = '        function switchSection(sectionId, linkEl) {';
const scriptEndIdx = html.indexOf(scriptEndTarget);

if (scriptStartIdx !== -1 && scriptEndIdx !== -1) {
    const seedDataJson = JSON.stringify(seedData, null, 2);

    const newScriptBlock = `<script>
        // Default Embedded Seed Databank (ASP.NET Full Match)
        const DEFAULT_ADMIN_DATA = ${seedDataJson};

        // State store
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

        // Check authentication on startup
        document.addEventListener("DOMContentLoaded", () => {
            const token = localStorage.getItem(AUTH_KEY) || sessionStorage.getItem(AUTH_KEY);
            if (token) {
                showAdminShell();
            } else {
                showAuthView();
            }
        });

        function showAuthView() {
            document.getElementById("admin-auth-view").style.display = "flex";
            document.getElementById("admin-main-shell").style.display = "none";
        }

        function showAdminShell() {
            document.getElementById("admin-auth-view").style.display = "none";
            document.getElementById("admin-main-shell").style.display = "block";
            loadAdminData();
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

            // Reset previous error states
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

            // 1. Check if empty
            if (!pass) {
                showLoginError("Password field khali hai! Baraye meherbani password darj karein.");
                return;
            }

            // 2. Validate password
            if (!isPasswordCorrect) {
                showLoginError("Password ghalat hai! Sahi security keycode (e.g. saad@9112) darj karein.");
                return;
            }

            // 3. If correct, initiate authorization
            btn.disabled = true;
            btn.innerHTML = \`<i class="fas fa-spinner fa-spin me-2"></i> Authorizing...\`;

            // Try backend API first, or fallback to instant client-side authorization
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
                // Standalone / Netlify client-side authorization
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

        function loadAdminData() {
            // First load from localStorage cache or fallback seed data
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

            // Then query backend API if running
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
                    // Static / Netlify offline mode - data already rendered
                });
        }

`;

    html = html.substring(0, scriptStartIdx) + newScriptBlock + html.substring(scriptEndIdx);
    console.log("Successfully replaced script and data loading logic.");
} else {
    console.error("Could not find script target indices:", scriptStartIdx, scriptEndIdx);
}

fs.writeFileSync(adminHtmlPath, html, 'utf8');
console.log("Updated admin index.html successfully.");
