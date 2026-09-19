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
// ===== نظام المفضلة =====
function toggleFavorite(materialName, materialUrl) {
    let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    
    const existingIndex = favorites.findIndex(fav => fav.name === materialName);
    
    if (existingIndex > -1) {
        favorites.splice(existingIndex, 1);
    } else {
        favorites.push({ name: materialName, url: materialUrl });
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
    updateFavoriteButtons();
}

function isFavorite(materialName) {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    return favorites.some(fav => fav.name === materialName);
}

function updateFavoriteButtons() {
    document.querySelectorAll('.fav-material-btn').forEach(btn => {
        const materialName = btn.dataset.material;
        const icon = btn.querySelector('.fav-icon');
        if (isFavorite(materialName)) {
            btn.classList.add('active');
            if (icon) icon.textContent = '⭐';
        } else {
            btn.classList.remove('active');
            if (icon) icon.textContent = '☆';
        }
    });
}

// ===== إضافة زر المفضلة لكل مادة =====
function addFavoriteButtons() {
    const materialLinks = document.querySelectorAll('.year-content ul li a, .semester li a');
    
    materialLinks.forEach(link => {
        const li = link.parentElement;
        
        // تجنب التكرار
        if (li.querySelector('.fav-material-btn')) return;
        
        const materialName = link.textContent.trim();
        const materialUrl = link.href;
        
        const favBtn = document.createElement('button');
        favBtn.className = 'fav-material-btn';
        favBtn.dataset.material = materialName;
        favBtn.title = 'أضف للمفضلة';
        favBtn.innerHTML = '<span class="fav-icon">☆</span>';
        favBtn.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(materialName, materialUrl);
        };
        
        li.appendChild(favBtn);
    });
    
    updateFavoriteButtons();
}

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

// ===== تشغيل عند تحميل الصفحة =====
document.addEventListener('DOMContentLoaded', function() {
    // صفحة المواد
    if (document.getElementById('renewable') || document.getElementById('mechanical')) {
        addFavoriteButtons();
    }
    
    // الصفحة الرئيسية
    if (document.getElementById('favoritesList')) {
        displayFavorites();
    }
});
// ===== التبديل بين الحاسبات =====
function switchCalc(event, calcId) {
    document.querySelectorAll('.calc-content').forEach(c => c.classList.remove('active'));
    document.querySelectorAll('.calc-tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(calcId).classList.add('active');
    event.currentTarget.classList.add('active');
}

// ===== حاسبة المثلثات =====
function calculateTrig() {
    const angle = parseFloat(document.getElementById('angleInput').value);
    if (isNaN(angle)) {
        alert('الرجاء إدخال زاوية صحيحة');
        return;
    }
    
    const radians = angle * Math.PI / 180;
    const sin = Math.sin(radians).toFixed(4);
    const cos = Math.cos(radians).toFixed(4);
    const tan = Math.tan(radians).toFixed(4);
    
    document.getElementById('sinResult').textContent = sin;
    document.getElementById('cosResult').textContent = cos;
    document.getElementById('tanResult').textContent = tan;
    document.getElementById('triangleResult').style.display = 'block';
}

// ===== حاسبة القدرة =====
function calculatePower() {
    const v = parseFloat(document.getElementById('voltageInput').value);
    const i = parseFloat(document.getElementById('currentInput').value);
    
    if (isNaN(v) || isNaN(i)) {
        alert('الرجاء إدخال قيم صحيحة');
        return;
    }
    
    const p = v * i;
    const kw = (p / 1000).toFixed(3);
    
    document.getElementById('powerValue').textContent = p.toFixed(2) + ' واط';
    document.getElementById('powerKW').textContent = kw + ' كيلوواط';
    document.getElementById('powerResult').style.display = 'block';
}

// ===== حاسبة الحرارة =====
function calculateHeat() {
    const m = parseFloat(document.getElementById('massInput').value);
    const c = parseFloat(document.getElementById('specificHeatInput').value);
    const dt = parseFloat(document.getElementById('deltaTInput').value);
    
    if (isNaN(m) || isNaN(c) || isNaN(dt)) {
        alert('الرجاء إدخال قيم صحيحة');
        return;
    }
    
    const q = m * c * dt;
    const kj = (q / 1000).toFixed(2);
    
    document.getElementById('heatValue').textContent = q.toFixed(2) + ' جول';
    document.getElementById('heatKJ').textContent = kj + ' كيلوجول';
    document.getElementById('heatResult').style.display = 'block';
}

// ===== حاسبة الضغط =====
function calculatePressure() {
    const f = parseFloat(document.getElementById('forceInput').value);
    const a = parseFloat(document.getElementById('areaInput').value);
    
    if (isNaN(f) || isNaN(a) || a === 0) {
        alert('الرجاء إدخال قيم صحيحة (المساحة لا يمكن أن تكون صفر)');
        return;
    }
    
    const p = f / a;
    const kpa = (p / 1000).toFixed(3);
    
    document.getElementById('pressureValue').textContent = p.toFixed(2) + ' باسكال';
    document.getElementById('pressureKPA').textContent = kpa + ' كيلوباسكال';
    document.getElementById('pressureResult').style.display = 'block';
}

// ===== محول الوحدات =====
function convertUnits() {
    const value = parseFloat(document.getElementById('unitValue').value);
    const from = document.getElementById('fromUnit').value;
    const to = document.getElementById('toUnit').value;
    
    if (isNaN(value)) {
        alert('الرجاء إدخال قيمة صحيحة');
        return;
    }
    
    // تحويل لكل الوحدات إلى متر أولاً
    const toMeter = {
        m: 1,
        cm: 0.01,
        mm: 0.001,
        km: 1000,
        inch: 0.0254,
        ft: 0.3048
    };
    
    // القيمة بالمتر
    const inMeters = value * toMeter[from];
    
    // من متر إلى الوحدة المطلوبة
    const result = inMeters / toMeter[to];
    
    document.getElementById('unitResult').textContent = result.toFixed(6) + ' ' + to;
    document.getElementById('unitsResult').style.display = 'block';
}
// ===== حكمة اليوم =====
const wisdomData = {
    quran: [
        { text: "وَقُل رَّبِّ زِدْنِي عِلْمًا", source: "سورة طه - الآية 114" },
        { text: "يَرْفَعِ اللَّهُ الَّذِينَ آمَنُوا مِنكُمْ وَالَّذِينَ أُوتُوا الْعِلْمَ دَرَجَاتٍ", source: "سورة المجادلة - الآية 11" },
        { text: "وَعَلَّمَ آدَمَ الْأَسْمَاءَ كُلَّهَا", source: "سورة البقرة - الآية 31" },
        { text: "اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ", source: "سورة العلق - الآية 1" },
        { text: "وَاللَّهُ أَخْرَجَكُم مِّن بُطُونِ أُمَّهَاتِكُمْ لَا تَعْلَمُونَ شَيْئًا", source: "سورة النحل - الآية 78" },
        { text: "إِنَّ فِي خَلْقِ السَّمَاوَاتِ وَالْأَرْضِ وَاخْتِلَافِ اللَّيْلِ وَالنَّهَارِ لَآيَاتٍ لِّأُولِي الْأَلْبَابِ", source: "سورة آل عمران - الآية 190" },
        { text: "سَنُرِيهِمْ آيَاتِنَا فِي الْآفَاقِ وَفِي أَنفُسِهِمْ حَتَّىٰ يَتَبَيَّنَ لَهُمْ أَنَّهُ الْحَقُّ", source: "سورة فصلت - الآية 53" }
    ],
    engineering: [
        { text: "الهندسة هي فن توجيه قوى الطبيعة لخدمة الإنسان", source: "حكمة هندسية" },
        { text: "لا يوجد شيء مستحيل في الهندسة، فقط لم يتم تصميمه بعد", source: "مهندس مجهول" },
        { text: "الرياضيات هي لغة الكون، والهندسة هي تطبيقها", source: "جاليليو جاليلي" },
        { text: "أعطني نقطة ارتكاز وأرفع لك الأرض", source: "أرخميدس" },
        { text: "الابتكار هو الفرق بين القائد والتابع", source: "ستيف جوبز" },
        { text: "المشروع الجيد يحتاج إلى تصميم جيد، والتصميم الجيد يحتاج إلى مهندس جيد", source: "حكمة هندسية" },
        { text: "كل مشكلة هندسية لها حل، فقط فكر بطريقة مختلفة", source: "حكمة هندسية" }
    ],
    motivational: [
        { text: "النجاح ليس نهاية الطريق، والفشل ليس نهاية العالم", source: "ونستون تشرشل" },
        { text: "لا تنتظر الفرصة، اصنعها", source: "جورج برنارد شو" },
        { text: "العلم في الصغر كالنقش على الحجر", source: "مثل عربي" },
        { text: "من جدّ وجد، ومن زرع حصد", source: "مثل عربي" },
        { text: "اطلبوا العلم من المهد إلى اللحد", source: "حديث شريف" },
        { text: "رحلة الألف ميل تبدأ بخطوة واحدة", source: "لاو تسي" },
        { text: "أنت أقوى مما تعتقد، وأذكى مما تظن", source: "حكمة" }
    ]
};

function getDayOfYear() {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
}

function loadDailyWisdom() {
    const card = document.getElementById('wisdomCard');
    if (!card) return;

    const dayOfYear = getDayOfYear();
    const today = new Date();
    const dayOfWeek = today.getDay();

    let wisdom;
    let icon;
    let type;

    // التناوب بين الفئات حسب اليوم
    if (dayOfWeek === 5) {
        // الجمعة: آية قرآنية
        wisdom = wisdomData.quran[dayOfYear % wisdomData.quran.length];
        icon = '📖';
        type = 'آية قرآنية';
    } else if (dayOfWeek === 0 || dayOfWeek === 3) {
        // الأحد والأربعاء: اقتباس ملهم
        wisdom = wisdomData.motivational[dayOfYear % wisdomData.motivational.length];
        icon = '📜';
        type = 'اقتباس ملهم';
    } else {
        // باقي الأيام: حكمة هندسية
        wisdom = wisdomData.engineering[dayOfYear % wisdomData.engineering.length];
        icon = '💡';
        type = 'حكمة هندسية';
    }

    document.getElementById('wisdomIcon').textContent = icon;
    document.getElementById('wisdomType').textContent = type;
    document.getElementById('wisdomText').textContent = wisdom.text;
    document.getElementById('wisdomAuthor').textContent = wisdom.source;
}

// تشغيل عند تحميل الصفحة الرئيسية
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('wisdomCard')) {
        loadDailyWisdom();
    }
});
