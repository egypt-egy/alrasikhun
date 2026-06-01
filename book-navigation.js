// التنقل بين الأقسام بدون إعادة تحميل الصفحة
let currentSectionIndex = 0;

function renderSection(index) {
    const section = bookSections[index];
    const container = document.getElementById('sections-container');
    const currentSpan = document.getElementById('current-section');
    
    if (section && container) {
        // تغيير المحتوى فقط بدون إعادة تحميل
        container.innerHTML = `
            <div class="section-content">
                <h2 class="section-title">${escapeHtml(section.title)}</h2>
                <div class="section-text">${section.content}</div>
            </div>
        `;
        
        if (currentSpan) {
            currentSpan.textContent = `القسم ${index + 1} من ${bookSections.length}`;
        }
        
        // تحديث حالة الأزرار
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        
        if (prevBtn) prevBtn.disabled = index === 0;
        if (nextBtn) nextBtn.disabled = index === bookSections.length - 1;
        
        // تحديث الفهرس
        updateActiveTOC(index);
        
        // تمرير سلس للأعلى
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function updateActiveTOC(activeIndex) {
    const tocItems = document.querySelectorAll('.toc-item');
    tocItems.forEach((item, idx) => {
        if (idx === activeIndex) {
            item.style.background = '#CE1126';
            item.style.color = 'white';
            item.style.borderColor = '#CE1126';
        } else {
            item.style.background = 'white';
            item.style.color = '#1a2a3a';
            item.style.borderColor = '#eef2f6';
        }
    });
}

function goToSection(index) {
    if (index >= 0 && index < bookSections.length) {
        currentSectionIndex = index;
        renderSection(currentSectionIndex);
    }
}

function nextSection() {
    if (currentSectionIndex < bookSections.length - 1) {
        currentSectionIndex++;
        renderSection(currentSectionIndex);
    }
}

function prevSection() {
    if (currentSectionIndex > 0) {
        currentSectionIndex--;
        renderSection(currentSectionIndex);
    }
}

function buildTOC() {
    const tocGrid = document.getElementById('toc-grid');
    if (tocGrid) {
        tocGrid.innerHTML = '';
        bookSections.forEach((section, index) => {
            const tocItem = document.createElement('div');
            tocItem.className = 'toc-item';
            tocItem.textContent = `${index + 1}. ${section.title.substring(0, 40)}${section.title.length > 40 ? '...' : ''}`;
            tocItem.onclick = () => goToSection(index);
            tocGrid.appendChild(tocItem);
        });
    }
}

// عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    if (typeof bookSections !== 'undefined' && bookSections.length > 0) {
        buildTOC();
        renderSection(0);
    }
    
    const nextBtn = document.getElementById('next-btn');
    const prevBtn = document.getElementById('prev-btn');
    
    if (nextBtn) nextBtn.addEventListener('click', nextSection);
    if (prevBtn) prevBtn.addEventListener('click', prevSection);
});