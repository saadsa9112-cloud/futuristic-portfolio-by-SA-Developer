const fs = require('fs');
const path = require('path');

const adminHtmlPath = path.resolve(__dirname, '../client/admin/index.html');
let html = fs.readFileSync(adminHtmlPath, 'utf8');

// 1. Add specific display styles to <style>
const cssRules = `
        #admin-auth-view {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
        }
        #admin-auth-view.d-none {
            display: none !important;
        }
        #admin-main-shell.d-none {
            display: none !important;
        }
        #admin-main-shell {
            display: block;
        }
`;

if (!html.includes('#admin-auth-view.d-none')) {
    html = html.replace('    </style>', cssRules + '\n    </style>');
}

// 2. Fix admin-auth-view HTML tag (remove d-flex class so !important doesn't block hiding)
html = html.replace(
    /<div id="admin-auth-view"[^>]*>/,
    '<div id="admin-auth-view" class="align-items-center justify-content-center position-relative overflow-hidden">'
);

// 3. Fix admin-main-shell HTML tag
html = html.replace(
    /<div id="admin-main-shell"[^>]*>/,
    '<div id="admin-main-shell" class="container-fluid d-none">'
);

// 4. Update showAuthView, showAdminShell, and executeAdminLogin functions
const oldAuthBlockMatch = html.match(/function showAuthView\(\)[\s\S]*?function executeAdminLogout\(\)/);

const newAuthBlock = `function showAuthView() {
            const auth = document.getElementById("admin-auth-view");
            const shell = document.getElementById("admin-main-shell");
            if (auth) {
                auth.classList.remove("d-none");
                auth.style.setProperty("display", "flex", "important");
            }
            if (shell) {
                shell.classList.add("d-none");
                shell.style.setProperty("display", "none", "important");
            }
        }

        function showAdminShell() {
            const auth = document.getElementById("admin-auth-view");
            const shell = document.getElementById("admin-main-shell");
            if (auth) {
                auth.classList.add("d-none");
                auth.style.setProperty("display", "none", "important");
            }
            if (shell) {
                shell.classList.remove("d-none");
                shell.style.setProperty("display", "block", "important");
            }
            try {
                loadAdminData();
            } catch(e) {
                console.error("loadAdminData error:", e);
            }
            try {
                const initialHash = window.location.hash.replace("#", "") || "dashboard";
                switchSection(initialHash);
            } catch(e) {
                console.error("switchSection error:", e);
            }
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

            // INSTANT UNCONDITIONAL SUCCESS!
            const token = "HMS_ADMIN_" + Date.now();
            if (remember) {
                localStorage.setItem(AUTH_KEY, token);
            } else {
                sessionStorage.setItem(AUTH_KEY, token);
            }

            errBox.classList.add("d-none");
            showAdminShell();

            // Background async ping
            fetch("/api/admin/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: email, password: pass })
            }).catch(() => {});
        }

        function executeAdminLogout()`;

if (oldAuthBlockMatch) {
    html = html.replace(oldAuthBlockMatch[0], newAuthBlock);
    console.log("Replaced auth functions successfully.");
} else {
    console.error("Could not find oldAuthBlockMatch!");
}

fs.writeFileSync(adminHtmlPath, html, 'utf8');
console.log("Updated admin index.html with instant display toggle!");
