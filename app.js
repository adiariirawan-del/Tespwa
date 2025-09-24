let currentVideoId = '';
let dataSaverMode = true;

// Fungsi ekstrak ID YouTube yang lebih baik
function extractYouTubeId(url) {
    // Handle berbagai format URL YouTube
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?#]+)/,
        /youtube\.com\/watch\?.*v=([^&?#]+)/,
        /youtu\.be\/([^&?#]+)/
    ];
    
    for (let pattern of patterns) {
        const match = url.match(pattern);
        if (match && match[1]) {
            return match[1];
        }
    }
    return null;
}

function loadVideo() {
    const url = document.getElementById('videoUrl').value.trim();
    const videoId = extractYouTubeId(url);
    
    if (!videoId) {
        alert('❌ Link YouTube tidak valid! Contoh: https://www.youtube.com/watch?v=ABCD1234');
        return;
    }
    
    currentVideoId = videoId;
    showVideoPlayer(videoId);
    document.getElementById('playerContainer').classList.remove('hidden');
}

function showVideoPlayer(videoId) {
    const quality = document.getElementById('quality').value;
    const videoFrame = document.getElementById('videoFrame');
    
    // Parameter YouTube untuk hemat data
    const params = new URLSearchParams({
        'autoplay': 0, // Non-aktifkan autoplay untuk hemat data
        'mute': 0,
        'controls': 1,
        'showinfo': 0,
        'modestbranding': 1,
        'rel': 0, // Non-aktifkan video terkait
        'enablejsapi': 1,
        'playsinline': 1
    });
    
    // Untuk kualitas, kita bisa mencoba dengan parameter tertentu
    // Note: YouTube tidak mengizinkan kontrol kualitas langsung via URL parameter
    const videoUrl = `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
    
    videoFrame.innerHTML = `
        <iframe 
            width="100%" 
            height="400" 
            src="${videoUrl}"
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen>
        </iframe>
    `;
    
    document.getElementById('videoTitle').textContent = `Video: ${videoId}`;
}

function changeQuality() {
    if (currentVideoId) {
        showVideoPlayer(currentVideoId);
    }
}

function toggleDataSaver() {
    dataSaverMode = !dataSaverMode;
    const btn = document.getElementById('dataSaverBtn');
    const modeText = document.getElementById('dataMode');
    
    if (dataSaverMode) {
        btn.textContent = 'Hemat Data: ON';
        btn.classList.remove('off');
        modeText.textContent = 'Aktif';
        // Set kualitas terendah saat mode hemat data aktif
        document.getElementById('quality').value = '144';
    } else {
        btn.textContent = 'Hemat Data: OFF';
        btn.classList.add('off');
        modeText.textContent = 'Tidak Aktif';
    }
    
    if (currentVideoId) {
        showVideoPlayer(currentVideoId);
    }
}

// Event Listeners
document.getElementById('videoUrl').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') loadVideo();
});

// Support untuk paste langsung
document.getElementById('videoUrl').addEventListener('paste', function(e) {
    setTimeout(() => {
        // Auto-load setelah paste
        loadVideo();
    }, 100);
});

// PWA Features
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    showInstallPrompt();
});

function showInstallPrompt() {
    // Tambahkan button install jika diperlukan
    console.log('Aplikasi siap diinstall!');
}

// Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Tambahkan beberapa video contoh untuk testing
window.addEventListener('load', function() {
    // Contoh link untuk testing
    document.getElementById('videoUrl').value = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
});
