(function () {
    const API_BASE = '/api/telemetry';
    let sessionActive = true;
    let heartbeatInterval = null;
    let scrollMilestones = { p25: false, p50: false, p75: false, p100: false };

    // Get page load timing metrics
    function getPageLoadTime() {
        try {
            const perf = window.performance || window.webkitPerformance || window.msPerformance || window.mozPerformance;
            if (perf && perf.getEntriesByType) {
                const nav = perf.getEntriesByType('navigation')[0];
                if (nav) {
                    return Math.round(nav.duration || (nav.loadEventEnd - nav.startTime));
                }
            }
            if (perf && perf.timing) {
                const t = perf.timing;
                return Math.round(t.loadEventEnd - t.navigationStart);
            }
        } catch (e) {
            // Fail silently
        }
        return 0;
    }

    // Assemble common payload attributes
    function buildBasePayload() {
        return {
            pagePath: window.location.pathname,
            pageTitle: document.title,
            queryString: window.location.search,
            referrerUrl: document.referrer || 'direct',
            language: navigator.language || navigator.userLanguage || 'en-US',
            screenResolution: `${window.screen.width}x${window.screen.height}`,
            viewportWidth: window.innerWidth || document.documentElement.clientWidth,
            viewportHeight: window.innerHeight || document.documentElement.clientHeight,
            loadTime: getPageLoadTime()
        };
    }

    // Send data using fetch (with tunnel bypass headers) or fallback to Beacon API
    function sendTelemetry(endpoint, payload) {
        const url = API_BASE + endpoint;
        const data = JSON.stringify(payload);

        fetch(url, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'bypass-tunnel-reminder': 'true',
                'ngrok-skip-browser-warning': 'true'
            },
            body: data,
            keepalive: true
        }).catch(() => {
            if (navigator.sendBeacon) {
                try {
                    const blob = new Blob([data], { type: 'application/json' });
                    navigator.sendBeacon(url, blob);
                } catch (e) {}
            }
        });
    }

    // 1. Log Page View
    function logPageView() {
        const payload = buildBasePayload();
        sendTelemetry('/pageview', payload);
    }

    // 2. Log Heartbeat
    function logHeartbeat() {
        if (!sessionActive) return;
        const payload = buildBasePayload();
        sendTelemetry('/heartbeat', payload);
    }

    // 3. Log Event
    function logEvent(name, category, targetId = null, targetText = null, targetUrl = null, val = null, meta = {}) {
        // Detect automation headless settings
        const isHeadless = navigator.webdriver || window.callPhantom || window._phantom || window.Buffer || window.emit;
        meta.headless = !!isHeadless;

        const payload = {
            ...buildBasePayload(),
            eventName: name,
            eventCategory: category,
            targetElementId: targetId,
            targetText: targetText ? targetText.substring(0, 100) : null,
            targetUrl: targetUrl,
            eventValue: val,
            metadataJson: JSON.stringify(meta)
        };
        sendTelemetry('/event', payload);
    }

    // Initialize listeners
    function init() {
        // Log view on load
        if (document.readyState === 'complete') {
            logPageView();
        } else {
            window.addEventListener('load', logPageView);
        }

        // Set heartbeats (every 15 seconds)
        heartbeatInterval = setInterval(logHeartbeat, 15000);

        // Visibility API: suspend heartbeats if user minimizes/leaves tab
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') {
                sessionActive = false;
                logHeartbeat(); // Final pulse before going inactive
            } else {
                sessionActive = true;
                logHeartbeat();
            }
        });

        // 4. Click Event Listeners (Social networks, buttons, and custom telemetry data targets)
        document.addEventListener('click', (e) => {
            const el = e.target.closest('a, button, [data-telemetry-event]');
            if (!el) return;

            const name = el.getAttribute('data-telemetry-event') || el.innerText || el.value || el.id || 'Click';
            const cat = el.getAttribute('data-telemetry-category') || (el.tagName === 'A' ? 'Link' : 'Button');
            const url = el.getAttribute('href') || el.getAttribute('formaction') || null;
            const targetId = el.id || null;

            logEvent(name, cat, targetId, el.innerText, url);
        });

        // 5. Scroll Depth Tracking
        window.addEventListener('scroll', () => {
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (docHeight <= 0) return;

            const scrollPct = Math.round((window.scrollY / docHeight) * 100);

            if (scrollPct >= 25 && !scrollMilestones.p25) {
                scrollMilestones.p25 = true;
                logEvent('Scroll Depth 25%', 'Scroll', null, null, null, 25);
            }
            if (scrollPct >= 50 && !scrollMilestones.p50) {
                scrollMilestones.p50 = true;
                logEvent('Scroll Depth 50%', 'Scroll', null, null, null, 50);
            }
            if (scrollPct >= 75 && !scrollMilestones.p75) {
                scrollMilestones.p75 = true;
                logEvent('Scroll Depth 75%', 'Scroll', null, null, null, 75);
            }
            if (scrollPct >= 98 && !scrollMilestones.p100) { // 98% is practically bottom
                scrollMilestones.p100 = true;
                logEvent('Scroll Depth 100%', 'Scroll', null, null, null, 100);
            }
        });

        // 6. Clipboard Interaction tracking
        document.addEventListener('copy', (e) => {
            const selectedText = window.getSelection().toString();
            logEvent('Clipboard Copy', 'Interaction', null, null, null, null, {
                charLength: selectedText.length,
                selectionSnippet: selectedText.substring(0, 50)
            });
        });

        document.addEventListener('paste', (e) => {
            logEvent('Clipboard Paste', 'Interaction');
        });

        // Beacon updates on tab closing
        window.addEventListener('pagehide', () => {
            logHeartbeat();
        });
    }

    init();
})();
