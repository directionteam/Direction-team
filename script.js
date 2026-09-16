// ===== التبديل بين التخصصين =====
function switchTab(event, tabId) {
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    event.currentTarget.classList.add('active');

    // إعادة تعيين البحث
    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.value = '';
    resetSearch();
}

// ===== فتح وإغلاق بطاقة السنة =====
function toggleYear(button) {
    button.parentElement.classList.toggle('active');
}

// ===== البحث في المواد =====
function searchMaterials() {
    const input = document.getElementById('searchInput').value.toLowerCase().trim();

    document.querySelectorAll('.year-card').forEach(c => { c.style.display = ''; c.classList.remove('active'); });
    document.querySelectorAll('.semester').forEach(s => s.style.display = '');
    document.querySelectorAll('.semester li').forEach(li => li.style.display = '');

    if (input === '') {
        const firstYear = document.querySelector('.tab-content.active .year-card');
        if (firstYear) firstYear.classList.add('active');
        return;
    }

    document.querySelectorAll('.tab-content.active .year-card').forEach(c => c.classList.add('active'));

    const activeTab = document.querySelector('.tab-content.active');
    activeTab.querySelectorAll('.semester li').forEach(li => {
        li.style.display = li.textContent.toLowerCase().includes(input) ? '' : 'none';
    });

    activeTab.querySelectorAll('.semester').forEach(sem => {
        const hasVisible = Array.from(sem.querySelectorAll('li')).some(li => li.style.display !== 'none');
        sem.style.display = hasVisible ? '' : 'none';
    });

    activeTab.querySelectorAll('.year-card').forEach(card => {
        const hasVisible = Array.from(card.querySelectorAll('li')).some(li => li.style.display !== 'none');
        card.style.display = hasVisible ? '' : 'none';
    });
}

// ===== إعادة تعيين البحث =====
function resetSearch() {
    document.querySelectorAll('.year-card').forEach(c => {
        c.style.display = '';
        c.classList.remove('active');
    });
    document.querySelectorAll('.semester').forEach(s => s.style.display = '');
    document.querySelectorAll('.semester li').forEach(li => li.style.display = '');
    const firstYear = document.querySelector('.tab-content.active .year-card');
    if (firstYear) firstYear.classList.add('active');
}

// ===== فتح السنة الأولى =====
document.addEventListener('DOMContentLoaded', function() {
    const firstYear = document.querySelector('.tab-content.active .year-card');
    if (firstYear) firstYear.classList.add('active');
});

// ===== تمرير سلس =====
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href.length > 1) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});
