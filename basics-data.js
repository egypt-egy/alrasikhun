// تشغيل الفيديوهات في نافذة منبثقة

let currentModal = null;

function createModal() {
    const modal = document.createElement('div');
    modal.className = 'video-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="close-modal"><i class="fas fa-times"></i></button>
            <iframe id="video-iframe" src="" frameborder="0" allowfullscreen></iframe>
        </div>
    `;
    document.body.appendChild(modal);
    
    const closeBtn = modal.querySelector('.close-modal');
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        const iframe = modal.querySelector('#video-iframe');
        iframe.src = '';
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            const iframe = modal.querySelector('#video-iframe');
            iframe.src = '';
        }
    });
    
    return modal;
}

function playVideo(url) {
    if (!currentModal) {
        currentModal = createModal();
    }
    
    const iframe = currentModal.querySelector('#video-iframe');
    iframe.src = url;
    currentModal.classList.add('active');
}

function displayVideos(videos) {
    const container = document.getElementById('videos-container');
    if (!container) return;
    
    container.innerHTML = videos.map((video, index) => `
        <div class="video-card" data-url="${video.url}">
            <div class="video-thumbnail">
                <img src="https://img.youtube.com/vi/${getYoutubeId(video.url)}/hqdefault.jpg" alt="${video.title}">
                <span class="video-duration">${video.duration}</span>
                <div class="play-overlay">
                    <i class="fas fa-play-circle"></i>
                </div>
            </div>
            <div class="video-info">
                <span class="video-number">فيديو ${index + 1}</span>
                <h3 class="video-title">${video.title}</h3>
                <p class="video-source"><i class="fas fa-chalkboard-user"></i> ${video.source}</p>
            </div>
        </div>
    `).join('');
    
    // إضافة حدث النقر
    const videoCards = document.querySelectorAll('.video-card');
    videoCards.forEach(card => {
        card.addEventListener('click', () => {
            const url = card.getAttribute('data-url');
            if (url) {
                playVideo(url);
            }
        });
    });
}

function getYoutubeId(url) {
    const match = url.match(/embed\/([^?]+)/);
    return match ? match[1] : 'dQw4w9WgXcQ';
}
