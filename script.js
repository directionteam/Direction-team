// ===== فتح وإغلاق بطاقة السنة =====
function toggleYear(button) {
    const card = button.parentElement;
    card.classList.toggle('active');
}

// ===== البحث في المواد =====
function searchMaterials() {
    const input = document.getElementById('searchInput').value.toLowerCase().trim();

    // إعادة تعيين العرض
    document.querySelectorAll('.year-card').forEach(card => {
        card.style.display = '';
    });
    document.querySelectorAll('.semester').forEach(sem => {
        sem.style.display = '';
    });
    document.querySelectorAll('.semester li').forEach(li => {
        li.style.display = '';
    });

    if (input === '') {
        // رجّع الوضع الأصلي
        document.querySelectorAll('.year-card').forEach(card => {
            card.classList.remove('active');
        });
        const firstYear = document.querySelector('.year-card');
        if (firstYear) firstYear.classList.add('active');
        return;
    }

    // افتح كل السنوات
    document.querySelectorAll('.year-card').forEach(card => {
        card.classList.add('active');
    });

    // فلتر المواد
    document.querySelectorAll('.semester li').forEach(li => {
        const text = li.textContent.toLowerCase();
        li.style.display = text.includes(input) ? '' : 'none';
    });

    // إخفاء الفصول الفارغة
    document.querySelectorAll('.semester').forEach(sem => {
        const hasVisible = Array.from(sem.querySelectorAll('li')).some(
            li => li.style.display !== 'none'
        );
        sem.style.display = hasVisible ? '' : 'none';
    });

    // إخفاء السنوات الفارغة
    document.querySelectorAll('.year-card').forEach(card => {
        const hasVisible = Array.from(card.querySelectorAll('li')).some(
            li => li.style.display !== 'none'
        );
        card.style.display = hasVisible ? '' : 'none';
    });
}

// ===== فتح السنة الأولى تلقائياً =====
document.addEventListener('DOMContentLoaded', function() {
    const firstYear = document.querySelector('.year-card');
    if (firstYear) firstYear.classList.add('active');
});

// ===== تمرير سلس =====
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href.length > 1) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    });
});