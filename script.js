// Global Variables
let map;
let currentPage = 'home';
let isDarkMode = false;
let ndviLayer = null;
let baseLayer = null;
let accessToken = null;
let currentLayer = 'ndvi';

// Sentinel Hub Configuration
const SENTINEL_CONFIG = {
    CLIENT_ID: '5ede283b-fe14-469d-82bb-47ae0720b6f4',
    CLIENT_SECRET: 'kmzl9YlijJQmsarFkZsJjGESBbAKuSwm',
    INSTANCE_ID: 'ndvi-webgis',
    BASE_URL: 'https://services.sentinel-hub.com'
};

// Layer configurations
const LAYER_CONFIGS = {
    ndvi: {
        name: 'NDVI',
        evalscript: `
            //VERSION=3
            function setup() {
                return {
                    input: ["B04", "B08", "dataMask"],
                    output: { bands: 4 }
                };
            }
            
            function evaluatePixel(sample) {
                let ndvi = (sample.B08 - sample.B04) / (sample.B08 + sample.B04);
                
                if (ndvi < -0.5) return [0.05, 0.05, 0.05, sample.dataMask];
                else if (ndvi < -0.2) return [0.75, 0.75, 0.75, sample.dataMask];
                else if (ndvi < -0.1) return [0.86, 0.86, 0.86, sample.dataMask];
                else if (ndvi < 0) return [0.92, 0.92, 0.92, sample.dataMask];
                else if (ndvi < 0.025) return [1, 0.98, 0.8, sample.dataMask];
                else if (ndvi < 0.05) return [0.93, 0.91, 0.71, sample.dataMask];
                else if (ndvi < 0.075) return [0.87, 0.85, 0.61, sample.dataMask];
                else if (ndvi < 0.1) return [0.8, 0.78, 0.51, sample.dataMask];
                else if (ndvi < 0.125) return [0.74, 0.72, 0.42, sample.dataMask];
                else if (ndvi < 0.15) return [0.69, 0.76, 0.38, sample.dataMask];
                else if (ndvi < 0.175) return [0.64, 0.8, 0.35, sample.dataMask];
                else if (ndvi < 0.2) return [0.57, 0.75, 0.32, sample.dataMask];
                else if (ndvi < 0.25) return [0.5, 0.7, 0.28, sample.dataMask];
                else if (ndvi < 0.3) return [0.44, 0.64, 0.25, sample.dataMask];
                else if (ndvi < 0.35) return [0.38, 0.59, 0.21, sample.dataMask];
                else if (ndvi < 0.4) return [0.31, 0.54, 0.18, sample.dataMask];
                else if (ndvi < 0.45) return [0.25, 0.49, 0.14, sample.dataMask];
                else if (ndvi < 0.5) return [0.19, 0.43, 0.11, sample.dataMask];
                else if (ndvi < 0.55) return [0.13, 0.38, 0.07, sample.dataMask];
                else if (ndvi < 0.6) return [0.06, 0.33, 0.04, sample.dataMask];
                else return [0, 0.27, 0, sample.dataMask];
            }
        `
    },
    'true-color': {
        name: 'True Color',
        evalscript: `
            //VERSION=3
            function setup() {
                return {
                    input: ["B02", "B03", "B04", "dataMask"],
                    output: { bands: 4 }
                };
            }
            
            function evaluatePixel(sample) {
                return [sample.B04, sample.B03, sample.B02, sample.dataMask];
            }
        `
    },
    'false-color': {
        name: 'False Color',
        evalscript: `
            //VERSION=3
            function setup() {
                return {
                    input: ["B04", "B08", "B11", "dataMask"],
                    output: { bands: 4 }
                };
            }
            
            function evaluatePixel(sample) {
                return [sample.B08, sample.B04, sample.B11, sample.dataMask];
            }
        `
    },
    agriculture: {
        name: 'Agriculture',
        evalscript: `
            //VERSION=3
            function setup() {
                return {
                    input: ["B11", "B08", "B02", "dataMask"],
                    output: { bands: 4 }
                };
            }
            
            function evaluatePixel(sample) {
                return [sample.B11, sample.B08, sample.B02, sample.dataMask];
            }
        `
    }
};

// Sample dataset data
const sampleDatasets = [
    { date: '2024-01-15', sensor: 'Sentinel-2A', cloudCover: '5%', quality: 'Excellent' },
    { date: '2024-01-10', sensor: 'Sentinel-2B', cloudCover: '12%', quality: 'Good' },
    { date: '2024-01-05', sensor: 'Sentinel-2A', cloudCover: '25%', quality: 'Fair' },
    { date: '2024-01-01', sensor: 'Sentinel-2B', cloudCover: '8%', quality: 'Good' },
    { date: '2023-12-28', sensor: 'Sentinel-2A', cloudCover: '15%', quality: 'Good' }
];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

async function initializeApp() {
    setupEventListeners();
    await initializeMap();
    initializeCharts();
    populateDataTable();
    setDefaultDate();
    
    // Show loading spinner briefly
    showLoading();
    setTimeout(hideLoading, 2000);
}

function setupEventListeners() {
    // Navigation
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.getAttribute('data-page');
            navigateToPage(page);
        });
    });

    // Hamburger menu
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    themeToggle.addEventListener('click', toggleTheme);

    // Map controls
    const layerSelect = document.getElementById('layerSelect');
    const cloudCover = document.getElementById('cloudCover');
    const cloudValue = document.getElementById('cloudValue');
    
    if (layerSelect) {
        layerSelect.addEventListener('change', (e) => {
            currentLayer = e.target.value;
        });
    }
    
    if (cloudCover) {
        cloudCover.addEventListener('input', (e) => {
            cloudValue.textContent = e.target.value + '%';
        });
    }

    // Close modal when clicking outside
    const modal = document.getElementById('statusModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

function navigateToPage(page) {
    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    document.querySelector(`[data-page="${page}"]`).classList.add('active');

    // Show/hide pages
    document.querySelectorAll('.page').forEach(p => {
        p.classList.remove('active');
    });
    document.getElementById(`${page}Page`).classList.add('active');

    // Close mobile menu
    document.getElementById('hamburger').classList.remove('active');
    document.getElementById('navMenu').classList.remove('active');

    currentPage = page;

    // Initialize page-specific content
    if (page === 'analysis') {
        setTimeout(initializeCharts, 100);
    }
}

function toggleTheme() {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle('dark-mode');
    
    const themeIcon = document.querySelector('.theme-icon');
    themeIcon.textContent = isDarkMode ? '☀️' : '🌙';
    
    // Save theme preference
    localStorage.setItem('darkMode', isDarkMode);
}

async function getAccessToken() {
    try {
        const response = await fetch(`${SENTINEL_CONFIG.BASE_URL}/oauth/token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                grant_type: 'client_credentials',
                client_id: SENTINEL_CONFIG.CLIENT_ID,
                client_secret: SENTINEL_CONFIG.CLIENT_SECRET
            })
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('Token fetch error:', error);
            throw new Error('Failed to get access token');
        }

        const data = await response.json();
        accessToken = data.access_token;
        return accessToken;
    } catch (error) {
        console.error('Error getting access token:', error);
        showStatusModal('Authentication Error', 'Failed to authenticate with Sentinel Hub. Please check your credentials.');
        return null;
    }
}

async function initializeMap() {
    try {
        // Get access token first
        await getAccessToken();
        
        // Initialize Leaflet map centered on Indonesia
        map = L.map('map').setView([-2.5, 118], 5);

        // Add base tile layer
        baseLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        // Add NDVI layer if token is available
        if (accessToken) {
            await addNDVILayer();
        } else {
            console.warn('No access token available, NDVI layer not added');
        }

        // Add map event listeners
        map.on('click', onMapClick);
        map.on('zoomend', onMapZoom);

    } catch (error) {
        console.error('Error initializing map:', error);
        showStatusModal('Map Error', 'Failed to initialize the map. Please refresh the page and try again.');
    }
}

async function addNDVILayer() {
    try {
        if (!accessToken) {
            await getAccessToken();
        }

        if (!accessToken) {
            throw new Error('No access token available');
        }

        const layerConfig = LAYER_CONFIGS[currentLayer];
        const dateSelect = document.getElementById('dateSelect');
        const selectedDate = dateSelect ? dateSelect.value : new Date().toISOString().split('T')[0];
        const cloudCover = document.getElementById('cloudCover');
        const maxCloudCover = cloudCover ? cloudCover.value : 20;

        // Remove existing NDVI layer
        if (ndviLayer) {
            map.removeLayer(ndviLayer);
        }

        // Create WMS layer with Process API
        const wmsUrl = `${SENTINEL_CONFIG.BASE_URL}/ogc/wms/${SENTINEL_CONFIG.INSTANCE_ID}`;
        
        ndviLayer = L.tileLayer.wms(wmsUrl, {
            layers: layerConfig.name,
            format: 'image/png',
            transparent: true,
            attribution: 'NDVI data via Sentinel Hub',
            tileSize: 512,
            maxZoom: 16,
            version: '1.3.0',
            crs: L.CRS.EPSG3857,
            time: `${selectedDate}/${selectedDate}`,
            maxcc: maxCloudCover,
            evalscript: btoa(layerConfig.evalscript),
            access_token: accessToken
        });

        // Add custom headers for authentication
        ndviLayer.on('tileerror', function(error) {
            console.error('Tile loading error:', error);
        });

        ndviLayer.addTo(map);
        
        console.log('NDVI layer added successfully');

    } catch (error) {
        console.error('Error adding NDVI layer:', error);
        showStatusModal('Layer Error', 'Failed to load NDVI layer. Please check your internet connection and try again.');
    }
}

function onMapClick(e) {
    const lat = e.latlng.lat.toFixed(6);
    const lng = e.latlng.lng.toFixed(6);
    
    L.popup()
        .setLatLng(e.latlng)
        .setContent(`
            <div style="text-align: center;">
                <strong>Location</strong><br>
                Lat: ${lat}<br>
                Lng: ${lng}<br>
                <button onclick="analyzePoint(${lat}, ${lng})" style="margin-top: 10px; padding: 5px 10px; background: #22c55e; color: white; border: none; border-radius: 4px; cursor: pointer;">
                    Analyze NDVI
                </button>
            </div>
        `)
        .openOn(map);
}

function onMapZoom() {
    const zoom = map.getZoom();
    console.log('Map zoom level:', zoom);
}

async function analyzePoint(lat, lng) {
    showLoading();
    
    try {
        // Simulate NDVI analysis for the clicked point
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const simulatedNDVI = (Math.random() * 1.8 - 0.4).toFixed(3); // Random NDVI between -0.4 and 1.4
        let healthStatus = 'Unknown';
        let color = '#gray';
        
        if (simulatedNDVI < 0) {
            healthStatus = 'Water/Bare Soil';
            color = '#8B4513';
        } else if (simulatedNDVI < 0.2) {
            healthStatus = 'Sparse Vegetation';
            color = '#FFFF00';
        } else if (simulatedNDVI < 0.5) {
            healthStatus = 'Moderate Vegetation';
            color = '#ADFF2F';
        } else {
            healthStatus = 'Dense Vegetation';
            color = '#228B22';
        }
        
        hideLoading();
        
        showStatusModal('NDVI Analysis Result', `
            <div style="text-align: center;">
                <p><strong>Location:</strong> ${lat}, ${lng}</p>
                <p><strong>NDVI Value:</strong> <span style="color: ${color}; font-weight: bold;">${simulatedNDVI}</span></p>
                <p><strong>Vegetation Status:</strong> ${healthStatus}</p>
                <div style="margin-top: 15px; padding: 10px; background: ${color}20; border-radius: 8px;">
                    <small>NDVI values range from -1 to +1, where higher values indicate healthier vegetation.</small>
                </div>
            </div>
        `);
        
    } catch (error) {
        hideLoading();
        console.error('Error analyzing point:', error);
        showStatusModal('Analysis Error', 'Failed to analyze the selected point. Please try again.');
    }
}

function resetMapView() {
    if (map) {
        map.setView([-2.5, 118], 5);
    }
}

function toggleNDVILayer() {
    if (ndviLayer) {
        if (map.hasLayer(ndviLayer)) {
            map.removeLayer(ndviLayer);
        } else {
            map.addLayer(ndviLayer);
        }
    }
}

async function updateMapLayer() {
    showMapLoading();
    
    try {
        await addNDVILayer();
        hideMapLoading();
        showStatusModal('Layer Updated', 'Map layer has been successfully updated with the new parameters.');
    } catch (error) {
        hideMapLoading();
        console.error('Error updating layer:', error);
        showStatusModal('Update Error', 'Failed to update the map layer. Please try again.');
    }
}

function downloadData() {
    showStatusModal('Download', 'Data download functionality will be available in the full version. This would export the current view as GeoTIFF, PNG, or other formats.');
}

function processData() {
    const startDate = document.getElementById('startDate')?.value;
    const endDate = document.getElementById('endDate')?.value;
    const aoi = document.getElementById('aoiSelect')?.value;
    const format = document.getElementById('formatSelect')?.value;
    
    showLoading();
    
    // Simulate data processing
    setTimeout(() => {
        hideLoading();
        showStatusModal('Data Processing', `
            <div>
                <p><strong>Processing Parameters:</strong></p>
                <ul style="text-align: left; margin: 10px 0;">
                    <li>Date Range: ${startDate || 'Not specified'} to ${endDate || 'Not specified'}</li>
                    <li>Area of Interest: ${aoi || 'Current view'}</li>
                    <li>Output Format: ${format || 'GeoTIFF'}</li>
                </ul>
                <p>Data processing would be initiated with these parameters in the full version.</p>
            </div>
        `);
    }, 2000);
}

function scrollToMap() {
    document.getElementById('mapSection').scrollIntoView({ 
        behavior: 'smooth' 
    });
}

function scrollToFeatures() {
    document.getElementById('featuresSection').scrollIntoView({ 
        behavior: 'smooth' 
    });
}

function showMapLoading() {
    const loading = document.getElementById('mapLoading');
    if (loading) {
        loading.classList.add('active');
    }
}

function hideMapLoading() {
    const loading = document.getElementById('mapLoading');
    if (loading) {
        loading.classList.remove('active');
    }
}

function showLoading() {
    document.getElementById('loadingSpinner').classList.add('active');
}

function hideLoading() {
    document.getElementById('loadingSpinner').classList.remove('active');
}

function showStatusModal(title, message) {
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalMessage').innerHTML = message;
    document.getElementById('statusModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('statusModal').classList.remove('active');
    document.body.style.overflow = 'auto';
}

function setDefaultDate() {
    const dateSelect = document.getElementById('dateSelect');
    if (dateSelect) {
        const today = new Date();
        const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        dateSelect.value = oneWeekAgo.toISOString().split('T')[0];
    }
    
    const startDate = document.getElementById('startDate');
    const endDate = document.getElementById('endDate');
    if (startDate && endDate) {
        const today = new Date();
        const oneMonthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
        startDate.value = oneMonthAgo.toISOString().split('T')[0];
        endDate.value = today.toISOString().split('T')[0];
    }
}

function populateDataTable() {
    const tableBody = document.getElementById('datasetTableBody');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    sampleDatasets.forEach(dataset => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${dataset.date}</td>
            <td>${dataset.sensor}</td>
            <td>${dataset.cloudCover}</td>
            <td>
                <span class="quality-badge quality-${dataset.quality.toLowerCase()}">${dataset.quality}</span>
            </td>
            <td>
                <button class="btn-small" onclick="downloadDataset('${dataset.date}')">Download</button>
                <button class="btn-small" onclick="previewDataset('${dataset.date}')">Preview</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function downloadDataset(date) {
    showStatusModal('Download Dataset', `Downloading dataset for ${date}. This would initiate the download in the full version.`);
}

function previewDataset(date) {
    showStatusModal('Preview Dataset', `Loading preview for dataset from ${date}. This would show a preview of the data in the full version.`);
}

function initializeCharts() {
    // NDVI Time Series Chart
    const ndviTimeCtx = document.getElementById('ndviTimeChart');
    if (ndviTimeCtx) {
        new Chart(ndviTimeCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [{
                    label: 'Average NDVI',
                    data: [0.3, 0.35, 0.45, 0.55, 0.65, 0.7, 0.68, 0.6, 0.5, 0.4, 0.35, 0.32],
                    borderColor: '#22c55e',
                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--text-primary')
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        min: 0,
                        max: 1,
                        ticks: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary')
                        },
                        grid: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--border-color')
                        }
                    },
                    x: {
                        ticks: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary')
                        },
                        grid: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--border-color')
                        }
                    }
                }
            }
        });
    }

    // Vegetation Distribution Chart
    const vegetationCtx = document.getElementById('vegetationChart');
    if (vegetationCtx) {
        new Chart(vegetationCtx, {
            type: 'doughnut',
            data: {
                labels: ['Dense Vegetation', 'Moderate Vegetation', 'Sparse Vegetation', 'Bare Soil', 'Water'],
                datasets: [{
                    data: [35, 30, 20, 10, 5],
                    backgroundColor: ['#228B22', '#ADFF2F', '#FFFF00', '#D2691E', '#4169E1'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--text-primary'),
                            padding: 20
                        }
                    }
                }
            }
        });
    }

    // Seasonal Patterns Chart
    const seasonalCtx = document.getElementById('seasonalChart');
    if (seasonalCtx) {
        new Chart(seasonalCtx, {
            type: 'radar',
            data: {
                labels: ['Spring', 'Summer', 'Autumn', 'Winter'],
                datasets: [{
                    label: 'NDVI Seasonal Pattern',
                    data: [0.6, 0.8, 0.5, 0.3],
                    borderColor: '#22c55e',
                    backgroundColor: 'rgba(34, 197, 94, 0.2)',
                    pointBackgroundColor: '#22c55e',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: '#22c55e'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--text-primary')
                        }
                    }
                },
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 1,
                        ticks: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary')
                        },
                        grid: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--border-color')
                        },
                        angleLines: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--border-color')
                        }
                    }
                }
            }
        });
    }

    // Health Index Chart
    const healthCtx = document.getElementById('healthChart');
    if (healthCtx) {
        new Chart(healthCtx, {
            type: 'bar',
            data: {
                labels: ['Excellent', 'Good', 'Fair', 'Poor', 'Critical'],
                datasets: [{
                    label: 'Vegetation Health Distribution (%)',
                    data: [25, 35, 25, 10, 5],
                    backgroundColor: ['#228B22', '#ADFF2F', '#FFFF00', '#FFA500', '#FF4500'],
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--text-primary')
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 40,
                        ticks: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary')
                        },
                        grid: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--border-color')
                        }
                    },
                    x: {
                        ticks: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary')
                        },
                        grid: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--border-color')
                        }
                    }
                }
            }
        });
    }
}

// Load saved theme preference
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme === 'true') {
        toggleTheme();
    }
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.feature-card, .stat-card, .dashboard-card, .ndvi-info-card, .methodology-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Error handling for map initialization
window.addEventListener('error', (e) => {
    if (e.message.includes('Leaflet') || e.message.includes('map')) {
        console.warn('Map initialization failed, retrying...');
        setTimeout(() => {
            try {
                initializeMap();
            } catch (error) {
                console.error('Map initialization failed permanently:', error);
            }
        }, 2000);
    }
});

// Export functions for global access
window.scrollToMap = scrollToMap;
window.scrollToFeatures = scrollToFeatures;
window.resetMapView = resetMapView;
window.toggleNDVILayer = toggleNDVILayer;
window.updateMapLayer = updateMapLayer;
window.downloadData = downloadData;
window.processData = processData;
window.closeModal = closeModal;
window.analyzePoint = analyzePoint;
window.downloadDataset = downloadDataset;
window.previewDataset = previewDataset;