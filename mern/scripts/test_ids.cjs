const fs = require('fs');
const html = fs.readFileSync('client/admin/index.html', 'utf8');

const requiredIds = [
    'dash-total-projects',
    'dash-total-skills',
    'dash-total-blogviews',
    'dash-unread-count',
    'sidebar-unread-badge',
    'visitorChart',
    'projects-table-body',
    'skills-table-body',
    'blogs-table-body',
    'experience-table-body',
    'education-table-body',
    'certificates-table-body',
    'testimonials-table-body',
    'messages-table-body',
    'admin-auth-view',
    'admin-main-shell',
    'login-email',
    'login-password',
    'login-remember',
    'login-error-msg',
    'login-submit-btn'
];

const missing = requiredIds.filter(id => !html.includes(`id="${id}"`));
console.log('Missing IDs:', missing);
