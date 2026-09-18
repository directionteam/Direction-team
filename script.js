// ===== التبديل بين التخصصين =====
function switchTab(event, tabId) {
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    event.currentTarget.classList.add('active');

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
    if (!activeTab) return;

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

// ===== الوضع الليلي =====
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    
    const themeBtn = document.getElementById('themeToggle');
    if (themeBtn) {
        themeBtn.textContent = isDark ? '☀️' : '🌙';
    }
}

function applySavedTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        const themeBtn = document.getElementById('themeToggle');
        if (themeBtn) themeBtn.textContent = '☀️';
    }
}

// ===== زر شارك الموقع =====
function shareSite() {
    const url = 'https://directionteam.github.io/Direction-team/';
    const text = '🔗 موقع Direction Team الرسمي\n\n' +
                 '📚 مواد هندسة الميكانيك والطاقة المتجددة\n' +
                 '📋 الخطط الدراسية\n' +
                 '📝 امتحان الكفاءة\n' +
                 '💻 برامج هندسية\n\n' +
                 url + '\n\n' +
                 '💜 انشروه لكل الطلاب!';
    
    if (navigator.share) {
        navigator.share({
            title: 'Direction Team',
            text: text,
            url: url
        }).catch(() => openWhatsApp(text));
    } else {
        openWhatsApp(text);
    }
}

function openWhatsApp(text) {
    const whatsappUrl = 'https://wa.me/?text=' + encodeURIComponent(text);
    window.open(whatsappUrl, '_blank');
}

// ===== الرجوع للأعلى =====
window.addEventListener('scroll', function() {
    const btn = document.getElementById('scrollTop');
    if (btn) {
        if (window.scrollY > 300) {
            btn.classList.add('show');
        } else {
            btn.classList.remove('show');
        }
    }
});

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== عرض تاريخ آخر تعديل حقيقي من GitHub =====
async function showRealLastUpdate() {
    const updateElement = document.getElementById('lastUpdate');
    if (!updateElement) return;
    
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // عرض تاريخ اليوم مؤقتاً
    const now = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    updateElement.textContent = '🕐 آخر تحديث: ' + now.toLocaleDateString('ar-EG', options);
    
    // محاولة جلب التاريخ الحقيقي من GitHub
    try {
        const response = await fetch(
            `https://api.github.com/repos/directionteam/Direction-team/commits?path=${currentPage}&per_page=1`
        );
        const data = await response.json();
        
        if (data && data[0] && data[0].commit) {
            const commitDate = new Date(data[0].commit.committer.date);
            updateElement.textContent = '🕐 آخر تحديث: ' + commitDate.toLocaleDateString('ar-EG', options);
        }
    } catch (error) {
        // التاريخ الحالي كافتراضي
    }
}

// ===== تشغيل عند تحميل الصفحة =====
document.addEventListener('DOMContentLoaded', function() {
    const firstYear = document.querySelector('.tab-content.active .year-card') || document.querySelector('.year-card');
    if (firstYear) firstYear.classList.add('active');
    
    applySavedTheme();
    showRealLastUpdate();
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
// ===== شاشة التحميل (أول زيارة فقط) =====
window.addEventListener('load', function() {
    const loader = document.getElementById('loaderScreen');
    if (!loader) return; // إذا ما فيه شاشة تحميل، تجاهل
    
    // هل هذه أول زيارة؟
    const hasVisited = localStorage.getItem('hasVisited');
    
    if (hasVisited) {
        // ليس أول زيارة → إخفاء فوري
        loader.remove();
        return;
    }
    
    // أول زيارة → عرض الشاشة ثم إخفاؤها
    localStorage.setItem('hasVisited', 'true');
    
    setTimeout(function() {
        loader.classList.add('hidden');
        setTimeout(() => loader.remove(), 700);
    }, 1500); // 1.5 ثانية
});
// ===== مشاركة مادة =====
function shareMaterial(materialName) {
    const url = 'https://directionteam.github.io/Direction-team/materials.html';
    const text = `📚 ${materialName}\n\n` +
                 `🔗 من موقع Direction Team:\n` +
                 `directionteam.github.io/Direction-team\n\n` +
                 `💜 شاركها مع زملائك!`;
    
    if (navigator.share) {
        navigator.share({
            title: materialName,
            text: text,
            url: url
        }).catch(() => openWhatsAppShare(text));
    } else {
        openWhatsAppShare(text);
    }
}

function openWhatsAppShare(text) {
    const whatsappUrl = 'https://wa.me/?text=' + encodeURIComponent(text);
    window.open(whatsappUrl, '_blank');
}
// ===== إضافة زر المشاركة لكل مادة تلقائياً =====
function addShareButtons() {
    const materialLinks = document.querySelectorAll('.year-content ul li a');
    
    materialLinks.forEach(link => {
        // اسم المادة
        const materialName = link.textContent.trim();
        // الرابط
        const materialUrl = link.href;
        
        // إنشاء زر المشاركة
        const shareBtn = document.createElement('button');
        shareBtn.className = 'share-material-btn';
       shareBtn.innerHTML = '📤 مشاركة';
        shareBtn.title = 'شارك هذه المادة';
        shareBtn.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            shareMaterialAdvanced(materialName, materialUrl);
        };
        
        // إضافة الزر داخل الـ li
        const li = link.parentElement;
        li.style.position = 'relative';
        li.appendChild(shareBtn);
    });
}

// ===== مشاركة مادة (متقدم) =====
function shareMaterialAdvanced(materialName, materialUrl) {
    const siteUrl = 'https://directionteam.github.io/Direction-team/materials.html';
    const text = `📚 ${materialName}\n\n` +
                 `🔗 من موقع Direction Team:\n` +
                 `${siteUrl}\n\n` +
                 `💜 شاركها مع زملائك!`;
    
    if (navigator.share) {
        navigator.share({
            title: materialName,
            text: text,
            url: siteUrl
        }).catch(() => openWhatsAppShare(text));
    } else {
        openWhatsAppShare(text);
    }
}

function openWhatsAppShare(text) {
    const whatsappUrl = 'https://wa.me/?text=' + encodeURIComponent(text);
    window.open(whatsappUrl, '_blank');
}

// تشغيل عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // إذا كنا في صفحة المواد
    if (document.getElementById('renewable') || document.getElementById('mechanical')) {
        addShareButtons();
    }
});
// ===== عرض المفضلة في الصفحة الرئيسية =====
function displayFavorites() {
    const container = document.getElementById('favoritesList');
    if (!container) return;
    
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    
    if (favorites.length === 0) {
        container.innerHTML = `
            <div class="empty-favorites">
                <p>⭐ لا توجد مواد في المفضلة بعد</p>
                <p>اذهب إلى <a href="materials.html">صفحة المواد</a> وأضف موادك المفضلة بنقرة على النجمة</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = favorites.map(fav => `
        <div class="favorite-item">
            <a href="${fav.url}" target="_blank" class="fav-link">
                <span class="fav-icon">⭐</span>
                <span class="fav-name">${fav.name}</span>
            </a>
            <button class="fav-remove" onclick="removeFavorite('${fav.name.replace(/'/g, "\\'")}')" title="إزالة">×</button>
        </div>
    `).join('');
}

function removeFavorite(materialName) {
    let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    favorites = favorites.filter(fav => fav.name !== materialName);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    displayFavorites();
}

// تشغيل في الصفحة الرئيسية
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('favoritesList')) {
        displayFavorites();
    }
});
