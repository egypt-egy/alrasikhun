// تشغيل الفيديوهات في نافذة منبثقة (Modal)

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

document.addEventListener('DOMContentLoaded', () => {
    displayVideos();
    
    // إضافة حدث النقر على بطاقات الفيديو
    setTimeout(() => {
        const videoCards = document.querySelectorAll('.video-card');
        videoCards.forEach(card => {
            card.addEventListener('click', () => {
                const url = card.getAttribute('data-url');
                if (url) {
                    playVideo(url);
                }
            });
        });
    }, 100);
});
