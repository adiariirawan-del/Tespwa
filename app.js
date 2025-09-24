class DataSaverBrowser {
    constructor() {
        this.currentTab = 'youtube';
        this.dataUsage = 0;
        this.cacheHits = 0;
        this.cacheMisses = 0;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadSettings();
        this.registerServiceWorker();
        this.setupNetworkMonitoring();
        this.updateStats();
    }

    setupEventListeners() {
        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTab(e.target.getAttribute('data-tab'));
            });
        });

        // Enter key for search
        document.getElementById('youtubeSearch').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.searchYouTube();
        });

        document.getElementById('googleSearch').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.searchGoogle();
        });

        // Network status
        window.addEventListener('online', () => this.updateNetworkStatus(true));
        window.addEventListener('offline', () => this.updateNetworkStatus(false));
    }

    switchTab(tabName) {
        // Update active tab button
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update active tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(tabName).classList.add('active');

        this.currentTab = tabName;
    }

    async searchYouTube() {
        const query = document.getElementById('youtubeSearch').value.trim();
        if (!query) return;

        this.showLoading(true);
        
        try {
            // Use YouTube Data API with data saving techniques
            const results = await this.fetchYouTubeData(query);
            this.displayYouTubeResults(results);
        } catch (error) {
            this.showError('Gagal memuat hasil pencarian YouTube');
        } finally {
            this.showLoading(false);
        }
    }

    async fetchYouTubeData(query) {
        // Simulate YouTube API call with data optimization
        const cacheKey = `youtube_${query}`;
        const cached = this.getCachedData(cacheKey);
        
        if (cached) {
            this.cacheHits++;
            return cached;
        }

        this.cacheMisses++;
        
        // Simulate API response (in real app, use YouTube Data API)
        const simulatedResults = this.simulateYouTubeResults(query);
        
        // Cache the results
        this.cacheData(cacheKey, simulatedResults, 300000); // 5 minutes
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        return simulatedResults;
    }

    simulateYouTubeResults(query) {
        // Simulate YouTube search results with optimized data
        return Array.from({length: 10}, (_, i) => ({
            id: `video_${i}`,
            title: `${query} - Video ${i + 1}`,
            channel: `Channel ${i + 1}`,
            thumbnail: this.generateLowResThumbnail(),
            duration: `${Math.floor(Math.random() * 10) + 1}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
            views: `${(Math.random() * 1000).toFixed(0)}K ditonton`
        }));
    }

    generateLowResThumbnail() {
        // Return low-resolution thumbnail URL or data URI
        const colors = ['FF6B6B', '4ECDC4', '45B7D1', '96CEB4', 'FFEAA7'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        return `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='320' height='180' viewBox='0 0 320 180'><rect width='320' height='180' fill='%23${color}'/><text x='50%' y='50%' font-family='Arial' font-size='24' fill='white' text-anchor='middle' dominant-baseline='middle'>Thumbnail</text></svg>`;
    }

    displayYouTubeResults(results) {
        const container = document.getElementById('youtubeResults');
        container.innerHTML = '';

        results.forEach(video => {
            const videoElement = document.createElement('div');
            videoElement.className = 'youtube-video';
            videoElement.innerHTML = `
                <img src="${video.thumbnail}" alt="${video.title}" class="video-thumbnail" loading="lazy">
                <div class="video-title">${video.title}</div>
                <div class="video-channel">${video.channel}</div>
                <div class="video-info">${video.duration} • ${video.views}</div>
            `;
            videoElement.addEventListener('click', () => this.playVideo(video.id));
            container.appendChild(videoElement);
        });

        this.trackDataUsage(50); // Simulate 50KB data usage
    }

    playVideo(videoId) {
        const quality = document.getElementById('videoQuality').value;
        const player = document.getElementById('youtubePlayer');
        const container = document.getElementById('videoContainer');
        
        // Use YouTube iframe with quality parameters
        container.innerHTML = `
            <iframe 
                width="100%" 
                height="400" 
                src="https://www.youtube.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0&iv_load_policy=3&vq=${quality}"
                frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen>
            </iframe>
        `;
        
        player.style.display = 'flex';
        this.trackDataUsage(200); // Simulate 200KB video load
    }

    closeVideo() {
        document.getElementById('youtubePlayer').style.display = 'none';
        document.getElementById('videoContainer').innerHTML = '';
    }

    async searchGoogle() {
        const query = document.getElementById('googleSearch').value.trim();
        if (!query) return;

        this.showLoading(true);
        
        try {
            const results = await this.fetchGoogleResults(query);
            this.displayGoogleResults(results);
        } catch (error) {
            this.showError('Gagal memuat hasil pencarian Google');
        } finally {
            this.showLoading(false);
        }
    }

    async fetchGoogleResults(query) {
        const cacheKey = `google_${query}`;
        const cached = this.getCachedData(cacheKey);
        
        if (cached) {
            this.cacheHits++;
            return cached;
        }

        this.cacheMisses++;
        
        // Simulate Google search results
        const simulatedResults = this.simulateGoogleResults(query);
        this.cacheData(cacheKey, simulatedResults, 300000);
        
        await new Promise(resolve => setTimeout(resolve, 300));
        
        return simulatedResults;
    }

    simulateGoogleResults(query) {
        return Array.from({length: 8}, (_, i) => ({
            title: `Hasil untuk "${query}" - ${i + 1}`,
            url: `https://example.com/result-${i + 1}`,
            snippet: `Ini adalah deskripsi hasil pencarian untuk "${query}". Konten ini dimuat dengan optimasi data.`,
            isAd: i < 2 // First two results as ads
        }));
    }

    displayGoogleResults(results) {
        const container = document.getElementById('googleResults');
        container.innerHTML = '';

        const textOnly = document.getElementById('textOnlyMode').checked;
        
        results.forEach((result, index) => {
            const resultElement = document.createElement('div');
            resultElement.className = 'google-result';
            
            if (result.isAd) {
                resultElement.innerHTML = `
                    <div style="color: #34A853; font-size: 0.8em; margin-bottom: 5px;">🔵 Iklan</div>
                    <a href="${result.url}" class="result-title" target="_blank">${result.title}</a>
                    <div class="result-url">${result.url}</div>
                    <div class="result-snippet">${result.snippet}</div>
                `;
            } else {
                resultElement.innerHTML = `
                    <a href="${result.url}" class="result-title" target="_blank">${result.title}</a>
                    <div class="result-url">${result.url}</div>
                    <div class="result-snippet">${result.snippet}</div>
                `;
            }
            
            container.appendChild(resultElement);
        });

        this.trackDataUsage(30); // Simulate 30KB data usage
    }

    // Data Management Methods
    trackDataUsage(kb) {
        this.dataUsage += kb;
        this.updateStats();
    }

    cacheData(key, data, ttl) {
        const item = {
            data: data,
            expiry: Date.now() + ttl
        };
        localStorage.setItem(`cache_${key}`, JSON.stringify(item));
    }

    getCachedData(key) {
        const item = localStorage.getItem(`cache_${key}`);
        if (!item) return null;

        const cached = JSON.parse(item);
        if (Date.now() > cached.expiry) {
            localStorage.removeItem(`cache_${key}`);
            return null;
        }

        return cached.data;
    }

    clearCache() {
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith('cache_')) {
                localStorage.removeItem(key);
            }
        });
        this.updateStats();
        this.showMessage('Cache berhasil dibersihkan');
    }

    // UI Methods
    showLoading(show) {
        document.getElementById('loading').style.display = show ? 'flex' : 'none';
        if (show) {
            this.simulateLoadProgress();
        }
    }

    simulateLoadProgress() {
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 10;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
            }
            document.getElementById('loadPercent').textContent = `${Math.round(progress)}%`;
        }, 100);
    }

    showError(message) {
        this.showMessage(message, 'error');
    }

    showMessage(message, type = 'info') {
        const messageEl = document.createElement('div');
        messageEl.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px;
            background: ${type === 'error' ? '#f44336' : '#4CAF50'};
            color: white;
            border-radius: 5px;
            z-index: 10000;
            max-width: 300px;
        `;
        messageEl.textContent = message;
        document.body.appendChild(messageEl);

        setTimeout(() => {
            document.body.removeChild(messageEl);
        }, 3000);
    }

    updateNetworkStatus(online) {
        const statusEl = document.getElementById('networkStatus');
        statusEl.textContent = online ? '📶 Online' : '📶 Offline';
        statusEl.style.background = online ? 'rgba(76, 175, 80, 0.3)' : 'rgba(244, 67, 54, 0.3)';
    }

    updateStats() {
        document.getElementById('dataUsage').textContent = 
            `Data digunakan: ${(this.dataUsage / 1024).toFixed(2)}MB`;
        
        document.getElementById('dailyUsage').textContent = 
            `${(this.dataUsage / 1024).toFixed(2)}MB`;
        
        const cacheRate = this.cacheHits + this.cacheMisses > 0 ? 
            (this.cacheHits / (this.cacheHits + this.cacheMisses) * 100) : 0;
        
        document.getElementById('cacheRate').textContent = `${cacheRate.toFixed(1)}%`;
        
        // Calculate cache size
        let cacheSize = 0;
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith('cache_')) {
                cacheSize += localStorage.getItem(key).length;
            }
        });
        document.getElementById('cacheSize').textContent = `${(cacheSize / 1024).toFixed(2)}KB`;
    }

    loadSettings() {
        // Load saved settings or use defaults
        const settings = JSON.parse(localStorage.getItem('dataSaverSettings') || '{}');
        
        document.getElementById('dataSaverMode').value = settings.mode || 'high';
        document.getElementById('textOnlyMode').checked = settings.textOnly !== false;
        document.getElementById('imageLazyLoad').checked = settings.lazyLoad !== false;
        document.getElementById('blockAutoplay').checked = settings.blockAutoplay !== false;
        document.getElementById('imageCompression').checked = settings.imageCompression !== false;
        document.getElementById('qualityLimit').value = settings.qualityLimit || 480;
        document.getElementById('qualityValue').textContent = `${settings.qualityLimit || 480}p`;
    }

    updateDataSaverSettings() {
        const settings = {
            mode: document.getElementById('dataSaverMode').value,
            textOnly: document.getElementById('textOnlyMode').checked,
            lazyLoad: document.getElementById('imageLazyLoad').checked,
            blockAutoplay: document.getElementById('blockAutoplay').checked,
            imageCompression: document.getElementById('imageCompression').checked,
            qualityLimit: document.getElementById('qualityLimit').value
        };
        
        localStorage.setItem('dataSaverSettings', JSON.stringify(settings));
        this.showMessage('Pengaturan disimpan');
    }

    setupNetworkMonitoring() {
        // Monitor network requests for data usage tracking
        const originalFetch = window.fetch;
        window.fetch = async (...args) => {
            const start = Date.now();
            const response = await originalFetch(...args);
            const end = Date.now();
            
            // Estimate data usage based on content-length
            const contentLength = response.headers.get('content-length');
            if (contentLength) {
                this.trackDataUsage(parseInt(contentLength) / 1024);
            }
            
            return response;
        };
    }

    registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('Service Worker terdaftar');
                })
                .catch(error => {
                    console.log('Service Worker gagal:', error);
                });
        }
    }
}

// Global functions for HTML onclick attributes
function searchYouTube() {
    browser.searchYouTube();
}

function searchGoogle() {
    browser.searchGoogle();
}

function closeVideo() {
    browser.closeVideo();
}

function changeVideoQuality() {
    browser.showMessage(`Kualitas video diubah: ${document.getElementById('videoQuality').value}`);
}

function clearCache() {
    browser.clearCache();
}

function updateDataSaverSettings() {
    browser.updateDataSaverSettings();
}

// Quality slider update
document.getElementById('qualityLimit').addEventListener('input', function() {
    document.getElementById('qualityValue').textContent = `${this.value}p`;
    browser.updateDataSaverSettings();
});

// Initialize the app
const browser = new DataSaverBrowser();
