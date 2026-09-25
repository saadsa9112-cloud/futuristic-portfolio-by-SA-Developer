const fs = require('fs');
const path = require('path');
const http = require('http');

const PORT = 5255;
const BASE_URL = `http://localhost:${PORT}`;
const DIST_DIR = path.join(__dirname, 'dist');
const TUNNEL_URL = process.env.TELEMETRY_TUNNEL_URL || 'https://saad-dev-telemetry.localtunnel.me';

// Direct copy helper
function copyFolderSync(from, to) {
    if (!fs.existsSync(to)) {
        fs.mkdirSync(to, { recursive: true });
    }
    fs.readdirSync(from).forEach(element => {
        const fromPath = path.join(from, element);
        const toPath = path.join(to, element);
        if (fs.lstatSync(fromPath).isDirectory()) {
            copyFolderSync(fromPath, toPath);
        } else {
            fs.copyFileSync(fromPath, toPath);
        }
    });
}

function fetchPage(urlPath) {
    return new Promise((resolve, reject) => {
        http.get(`${BASE_URL}${urlPath}`, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => resolve(data));
        }).on('error', (err) => reject(err));
    });
}

async function run() {
    console.log('--- Starting Static Build Generation ---');
    
    // 1. Ensure clean dist folder
    if (!fs.existsSync(DIST_DIR)) {
        fs.mkdirSync(DIST_DIR, { recursive: true });
    }

    // 2. Copy all static assets from wwwroot
    console.log('Copying static assets (css, js, images, libraries)...');
    const assets = ['css', 'js', 'images', 'lib', 'files'];
    assets.forEach(folder => {
        const src = path.join(__dirname, 'wwwroot', folder);
        const dest = path.join(DIST_DIR, folder);
        if (fs.existsSync(src)) {
            copyFolderSync(src, dest);
        }
    });

    // Copy files folder to subdirectories to guarantee relative links never 404
    const subDirsWithFiles = ['about', 'portfolio', 'blog', 'contact'];
    subDirsWithFiles.forEach(sub => {
        const subFilesDest = path.join(DIST_DIR, sub, 'files');
        const filesSrc = path.join(__dirname, 'wwwroot', 'files');
        if (fs.existsSync(filesSrc)) {
            copyFolderSync(filesSrc, subFilesDest);
        }
    });


    // Copy favicon.ico
    const faviconSrc = path.join(__dirname, 'wwwroot', 'favicon.ico');
    if (fs.existsSync(faviconSrc)) {
        fs.copyFileSync(faviconSrc, path.join(DIST_DIR, 'favicon.ico'));
    }

    // 3. Download isolated CSS bundle from server
    try {
        console.log('Downloading isolated CSS bundle...');
        const cssBundle = await fetchPage('/FuturisticPortfolio.styles.css');
        fs.writeFileSync(path.join(DIST_DIR, 'FuturisticPortfolio.styles.css'), cssBundle, 'utf8');
        console.log('Successfully saved FuturisticPortfolio.styles.css');
    } catch (err) {
        console.warn('Isolated CSS bundle fetch skipped or unavailable.');
    }

    // 4. Define pages to harvest
    const pages = [
        { route: '/', dest: 'index.html' },
        { route: '/Home/About', dest: 'about/index.html' },
        { route: '/Portfolio', dest: 'portfolio/index.html' },
        { route: '/Blog', dest: 'blog/index.html' },
        { route: '/Home/Contact', dest: 'contact/index.html' }
    ];

    // Crawl project list and blog list from main pages to harvest details
    try {
        console.log('Harvesting main pages...');
        const homeHtml = await fetchPage('/');
        const portfolioHtml = await fetchPage('/Portfolio');
        const blogHtml = await fetchPage('/Blog');

        // Extract detail routes using regex (case-insensitive) or known project IDs
        const projectRegex = /\/[Pp]ortfolio\/[Dd]etails\/\d+/gi;
        const blogRegex = /\/[Bb]log\/[Dd]etails(?:\?slug=|\/)([a-zA-Z0-9_-]+)/gi;

        const combinedHtml = homeHtml + ' ' + portfolioHtml;
        const detectedProjects = combinedHtml.match(projectRegex) || [];
        const allProjectIds = new Set(['2', '1002', '2002', '2003', '2004']);
        detectedProjects.forEach(p => allProjectIds.add(p.split('/').pop()));

        const blogMatches = [...blogHtml.matchAll(blogRegex)];
        const blogRoutes = [...new Set(blogMatches.map(m => m[0]))];

        console.log(`Found ${allProjectIds.size} projects and ${blogRoutes.length} blog posts to harvest.`);

        allProjectIds.forEach(id => {
            pages.push({ route: `/Portfolio/Details/${id}`, dest: `portfolio/details/${id}/index.html` });
        });

        blogRoutes.forEach(route => {
            const slug = route.includes('=') ? route.split('=').pop() : route.split('/').pop();
            pages.push({ route: route, dest: `blog/details/${slug}/index.html` });
        });

        // 5. Download and save HTML files
        for (const page of pages) {
            console.log(`Downloading: ${page.route} -> dist/${page.dest}`);
            let html = await fetchPage(page.route);

            // Calculate depth to build relative paths (immune to repository name variations)
            const depth = page.dest.split('/').length - 1;
            const relativePrefix = depth === 0 ? './' : '../'.repeat(depth);

            // Re-route local links to use relative paths
            html = html.replace(/href="\/Home\/About"/gi, `href="${relativePrefix}about/"`);
            html = html.replace(/href="\/[Pp]ortfolio"/g, `href="${relativePrefix}portfolio/"`);
            html = html.replace(/href="\/[Bb]log"/g, `href="${relativePrefix}blog/"`);
            html = html.replace(/href="\/[Pp]ortfolio\/[Dd]etails\/(\d+)"/gi, `href="${relativePrefix}portfolio/details/$1/"`);
            html = html.replace(/href="\/[Bb]log\/[Dd]etails\?slug=([a-zA-Z0-9_-]+)"/gi, `href="${relativePrefix}blog/details/$1/"`);
            html = html.replace(/href="\/[Bb]log\/[Dd]etails\/([a-zA-Z0-9_-]+)"/gi, `href="${relativePrefix}blog/details/$1/"`);
            html = html.replace(/href="\/[Hh]ome\/[Cc]ontact"/g, `href="${relativePrefix}contact/"`);
            html = html.replace(/href="\/[Cc]ontact"/g, `href="${relativePrefix}contact/"`);
            html = html.replace(/href="\/#([a-zA-Z0-9_-]+)"/g, `href="${relativePrefix}#$1"`);
            html = html.replace(/href="\/"/g, `href="${relativePrefix}"`);

            // Rewrite absolute paths using relative prefixes
            html = html.replace(/href="\/css\//g, `href="${relativePrefix}css/`);
            html = html.replace(/href="\/lib\//g, `href="${relativePrefix}lib/`);
            html = html.replace(/src="\/js\//g, `src="${relativePrefix}js/`);
            html = html.replace(/src="\/lib\//g, `src="${relativePrefix}lib/`);
            html = html.replace(/src="\/images\//g, `src="${relativePrefix}images/`);
            html = html.replace(/href="\/favicon.ico"/g, `href="${relativePrefix}favicon.ico"`);
            html = html.replace(/url\('\/images\//g, `url('${relativePrefix}images/`);
            html = html.replace(/url\("\/images\//g, `url("${relativePrefix}images/`);
            html = html.replace(/href="\/FuturisticPortfolio.styles.css/gi, `href="${relativePrefix}FuturisticPortfolio.styles.css`);
            html = html.replace(/href="(?:\.\/|\/)?files\//gi, `href="${relativePrefix}files/`);
            html = html.replace(/src="(?:\.\/|\/)?files\//gi, `src="${relativePrefix}files/`);

            // Cache-busting query strings for mobile browser caches
            const cacheBuster = Date.now();
            html = html.replace(/site\.css(?:\?v=[^"]*)?/gi, `site.css?v=${cacheBuster}`);
            html = html.replace(/site\.js(?:\?v=[^"]*)?/gi, `site.js?v=${cacheBuster}`);

            // Save file
            const destPath = path.join(DIST_DIR, page.dest);
            const destFolder = path.dirname(destPath);
            if (!fs.existsSync(destFolder)) {
                fs.mkdirSync(destFolder, { recursive: true });
            }
            fs.writeFileSync(destPath, html, 'utf8');
        }

        // 6. Update dist/js/site.js and dist/js/hms-telemetry.js to point to localtunnel URL instead of local paths
        const siteJsPath = path.join(DIST_DIR, 'js', 'site.js');
        if (fs.existsSync(siteJsPath)) {
            console.log(`Patching telemetry and endpoint paths to tunnel: ${TUNNEL_URL}`);
            try {
                fs.chmodSync(siteJsPath, 0o666);
                let jsContent = fs.readFileSync(siteJsPath, 'utf8');
                
                // Replace local fetches with tunnel URLs
                jsContent = jsContent.replace(/fetch\("\/api\/telemetry"/g, `fetch("${TUNNEL_URL}/api/telemetry"`);
                jsContent = jsContent.replace(/fetch\("\/Home\/ContactSubmit"/g, `fetch("${TUNNEL_URL}/Home/ContactSubmit"`);
                jsContent = jsContent.replace(/fetch\("\/api\/ai\/chat"/g, `fetch("${TUNNEL_URL}/api/ai/chat"`);
                
                fs.writeFileSync(siteJsPath, jsContent, 'utf8');
            } catch (pErr) {
                console.warn('Warning patching site.js:', pErr.message);
            }
        }

        const telemetryJsPath = path.join(DIST_DIR, 'js', 'hms-telemetry.js');
        if (fs.existsSync(telemetryJsPath)) {
            try {
                fs.chmodSync(telemetryJsPath, 0o666);
                let telContent = fs.readFileSync(telemetryJsPath, 'utf8');
                telContent = telContent.replace(/const API_BASE = '\/api\/telemetry';/g, `const API_BASE = '${TUNNEL_URL}/api/telemetry';`);
                fs.writeFileSync(telemetryJsPath, telContent, 'utf8');
            } catch (tErr) {
                console.warn('Warning patching telemetry.js:', tErr.message);
            }
        }

        console.log('--- Static Build Generation Completed Successfully! ---');
        console.log('Static site is ready inside the "dist" folder.');
    } catch (err) {
        console.error('Error compiling static views:', err);
    }
}

run();
