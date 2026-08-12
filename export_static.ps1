# export_static.ps1
$port = 5255
$baseUrl = "http://localhost:$port"
$distDir = Join-Path $PSScriptRoot "dist"
$tunnelUrl = "https://saad-dev-telemetry.localtunnel.me"

# Clean dist folder
if (Test-Path $distDir) {
    Remove-Item -Path $distDir -Recurse -Force
}
New-Item -ItemType Directory -Path $distDir -Force | Out-Null

# Copy static assets from wwwroot
Write-Host "Copying static assets (css, js, images, libraries)..."
$assets = @("css", "js", "images", "lib")
foreach ($folder in $assets) {
    $src = Join-Path $PSScriptRoot "wwwroot\$folder"
    $dest = Join-Path $distDir $folder
    if (Test-Path $src) {
        Copy-Item -Path $src -Destination $dest -Recurse -Force
    }
}
if (Test-Path "$PSScriptRoot\wwwroot\favicon.ico") {
    Copy-Item -Path "$PSScriptRoot\wwwroot\favicon.ico" -Destination "$distDir\favicon.ico" -Force
}

# Helper to download page
function Download-Page($route, $destFile) {
    $url = "$baseUrl$route"
    $destPath = Join-Path $distDir $destFile
    $parent = Split-Path $destPath -Parent
    if (!(Test-Path $parent)) {
        New-Item -ItemType Directory -Path $parent -Force | Out-Null
    }
    Write-Host "Downloading: $route -> dist/$destFile"
    try {
        # Fetch content using HttpClient to ensure correct encoding
        $client = New-Object System.Net.Http.HttpClient
        $html = $client.GetStringAsync($url).Result
        
        # Re-route links to support pretty URL directories in GitHub Pages
        $html = $html -replace 'href="/Portfolio"', 'href="/portfolio/"'
        $html = $html -replace 'href="/Blog"', 'href="/blog/"'
        $html = $html -replace 'href="/Home/Contact"', 'href="/#contact-section"'
        $html = $html -replace 'href="/"', 'href="/"'
        
        [System.IO.File]::WriteAllText($destPath, $html)
        return $html
    } catch {
        Write-Error "Failed to download ${route} - $_"
        return $null
    }
}

# Harvest main pages
$homeHtml = Download-Page "/" "index.html"
$portfolioHtml = Download-Page "/Portfolio" "portfolio/index.html"
$blogHtml = Download-Page "/Blog" "blog/index.html"

# Extract detail URLs using Regex from main pages
Write-Host "Scanning for project and blog detail links..."
$projectRoutes = [regex]::Matches($portfolioHtml, '/Portfolio/Details/\d+') | ForEach-Object { $_.Value } | Select-Object -Unique
$blogRoutes = [regex]::Matches($blogHtml, '/Blog/Details/\d+') | ForEach-Object { $_.Value } | Select-Object -Unique

Write-Host "Found $($projectRoutes.Count) projects and $($blogRoutes.Count) blog posts."

foreach ($route in $projectRoutes) {
    $id = $route.Split('/')[-1]
    $null = Download-Page $route "portfolio/details/$id/index.html"
}

foreach ($route in $blogRoutes) {
    $id = $route.Split('/')[-1]
    $null = Download-Page $route "blog/details/$id/index.html"
}

# Patch js/site.js to point to localtunnel URL instead of local paths
$siteJs = Join-Path $distDir "js\site.js"
if (Test-Path $siteJs) {
    Write-Host "Patching site.js API paths to tunnel: $tunnelUrl"
    $jsContent = [System.IO.File]::ReadAllText($siteJs)
    
    $jsContent = $jsContent -replace 'fetch\("/api/telemetry"', "fetch(`"$tunnelUrl/api/telemetry`""
    $jsContent = $jsContent -replace 'fetch\("/Home/ContactSubmit"', "fetch(`"$tunnelUrl/Home/ContactSubmit`""
    $jsContent = $jsContent -replace 'fetch\("/api/ai/chat"', "fetch(`"$tunnelUrl/api/ai/chat`""
    
    [System.IO.File]::WriteAllText($siteJs, $jsContent)
}

Write-Host "--- Static Build Generation Completed Successfully! ---"
