// Alternatif sederhana: redirect ke YouTube dengan parameter hemat data
function loadVideoAlternative() {
    const url = document.getElementById('videoUrl').value.trim();
    const videoId = extractYouTubeId(url);
    
    if (!videoId) {
        alert('Link YouTube tidak valid!');
        return;
    }
    
    // Redirect ke YouTube dengan parameter hemat data
    const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
    
    // Buka di tab baru atau embed
    const shouldEmbed = confirm('Buka video dalam mode embed (hemat data) atau tab baru? Klik OK untuk embed, Cancel untuk tab baru.');
    
    if (shouldEmbed) {
        showVideoPlayer(videoId);
        document.getElementById('playerContainer').classList.remove('hidden');
    } else {
        window.open(youtubeUrl, '_blank');
    }
}

// Fungsi extractYouTubeId tetap sama
function extractYouTubeId(url) {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
}
