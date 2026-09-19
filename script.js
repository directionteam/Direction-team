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
// ===== نظام التذكيرات =====
let reminderFilter = 'all';

function getReminders() {
    return JSON.parse(localStorage.getItem('reminders') || '[]');
}

function saveReminders(reminders) {
    localStorage.setItem('reminders', JSON.stringify(reminders));
}

function addReminder() {
    const title = document.getElementById('reminderTitle').value.trim();
    const date = document.getElementById('reminderDate').value;
    const time = document.getElementById('reminderTime').value;
    const priority = document.getElementById('reminderPriority').value;
    const type = document.getElementById('reminderType').value;

    if (!title || !date) {
        alert('⚠️ الرجاء إدخال العنوان والتاريخ على الأقل');
        return;
    }

    const reminders = getReminders();
    const newReminder = {
        id: Date.now(),
        title: title,
        date: date,
        time: time || '00:00',
        priority: priority,
        type: type,
        completed: false,
        createdAt: new Date().toISOString()
    };

    reminders.push(newReminder);
    saveReminders(reminders);

    // تفريغ الحقول
    document.getElementById('reminderTitle').value = '';
    document.getElementById('reminderDate').value = '';
    document.getElementById('reminderTime').value = '';

    renderReminders();

    // رسالة نجاح
    showNotification('✅ تم إضافة التذكير بنجاح!');

    // طلب إذن الإشعارات
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
}

function deleteReminder(id) {
    if (!confirm('هل أنت متأكد من حذف هذا التذكير؟')) return;
    let reminders = getReminders();
    reminders = reminders.filter(r => r.id !== id);
    saveReminders(reminders);
    renderReminders();
    showNotification('🗑️ تم حذف التذكير');
}

function toggleComplete(id) {
    const reminders = getReminders();
    const reminder = reminders.find(r => r.id === id);
    if (reminder) {
        reminder.completed = !reminder.completed;
        saveReminders(reminders);
        renderReminders();
        if (reminder.completed) {
            showNotification('✅ أحسنت! تم إنجاز التذكير');
        }
    }
}

function clearAllReminders() {
    if (!confirm('هل أنت متأكد من حذف جميع التذكيرات؟')) return;
    saveReminders([]);
    renderReminders();
    showNotification('🗑️ تم حذف جميع التذكيرات');
}

function filterReminders(filter) {
    reminderFilter = filter;
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    event.currentTarget.classList.add('active');
    renderReminders();
}

function getTypeIcon(type) {
    const icons = {
        exam: '📝',
        homework: '📚',
        project: '🔬',
        meeting: '👥',
        other: '📌'
    };
    return icons[type] || '📌';
}

function getTypeName(type) {
    const names = {
        exam: 'امتحان',
        homework: 'واجب',
        project: 'مشروع',
        meeting: 'اجتماع',
        other: 'أخرى'
    };
    return names[type] || 'أخرى';
}

function getPriorityInfo(priority) {
    const info = {
        high: { label: 'عالية', color: '#e74c3c', icon: '🔴' },
        medium: { label: 'متوسطة', color: '#f39c12', icon: '🟡' },
        low: { label: 'منخفضة', color: '#27ae60', icon: '🟢' }
    };
    return info[priority] || info.medium;
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
    return date.toLocaleDateString('ar-EG', options);
}

function getDaysLeft(dateStr) {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const target = new Date(dateStr);
    target.setHours(0, 0, 0, 0);
    const diff = Math.ceil((target - now) / (1000 * 60 * 60 * 24));
    return diff;
}

function renderReminders() {
    const container = document.getElementById('remindersList');
    if (!container) return;

    let reminders = getReminders();
    const now = new Date();

    // الترتيب حسب التاريخ
    reminders.sort((a, b) => new Date(a.date + 'T' + a.time) - new Date(b.date + 'T' + b.time));

    // الفلترة
    if (reminderFilter === 'upcoming') {
        reminders = reminders.filter(r => !r.completed && new Date(r.date + 'T' + r.time) >= now);
    } else if (reminderFilter === 'past') {
        reminders = reminders.filter(r => r.completed || new Date(r.date + 'T' + r.time) < now);
    }

    if (reminders.length === 0) {
        container.innerHTML = `
            <div class="empty-reminders">
                <div class="empty-icon">📭</div>
                <p>لا توجد تذكيرات بعد</p>
                <p class="empty-hint">أضف تذكيرك الأول من الأعلى ☝️</p>
            </div>
        `;
        return;
    }

    container.innerHTML = reminders.map(r => {
        const priority = getPriorityInfo(r.priority);
        const daysLeft = getDaysLeft(r.date);
        const isPast = daysLeft < 0;
        const isToday = daysLeft === 0;
        const isTomorrow = daysLeft === 1;

        let timeLeftText = '';
        let timeLeftClass = '';

        if (r.completed) {
            timeLeftText = '✅ منجز';
            timeLeftClass = 'completed';
        } else if (isPast) {
            timeLeftText = `⚠️ متأخر بـ ${Math.abs(daysLeft)} يوم`;
            timeLeftClass = 'overdue';
        } else if (isToday) {
            timeLeftText = '🔥 اليوم!';
            timeLeftClass = 'today';
        } else if (isTomorrow) {
            timeLeftText = '⏰ غداً';
            timeLeftClass = 'tomorrow';
        } else {
            timeLeftText = `📅 بعد ${daysLeft} يوم`;
            timeLeftClass = 'upcoming';
        }

        return `
            <div class="reminder-item ${r.completed ? 'completed' : ''}" style="border-right-color: ${priority.color};">
                <div class="reminder-priority-bar" style="background: ${priority.color};"></div>
                <button class="reminder-check ${r.completed ? 'checked' : ''}" onclick="toggleComplete(${r.id})" title="${r.completed ? 'إلغاء الإنجاز' : 'تحديد كمنجز'}">
                    ${r.completed ? '✓' : ''}
                </button>
                <div class="reminder-content">
                    <div class="reminder-top">
                        <span class="reminder-type-icon">${getTypeIcon(r.type)}</span>
                        <h3 class="reminder-title">${r.title}</h3>
                        <span class="reminder-priority-badge" style="background: ${priority.color};">${priority.icon} ${priority.label}</span>
                    </div>
                    <div class="reminder-meta">
                        <span>📅 ${formatDate(r.date)}</span>
                        <span>⏰ ${r.time}</span>
                        <span>📂 ${getTypeName(r.type)}</span>
                    </div>
                    <div class="reminder-time-left ${timeLeftClass}">${timeLeftText}</div>
                </div>
                <button class="reminder-delete" onclick="deleteReminder(${r.id})" title="حذف">🗑️</button>
            </div>
        `;
    }).join('');
}

function showNotification(message) {
    // إشعار بسيط
    const notif = document.createElement('div');
    notif.className = 'temp-notification';
    notif.textContent = message;
    document.body.appendChild(notif);

    setTimeout(() => notif.classList.add('show'), 10);
    setTimeout(() => {
        notif.classList.remove('show');
        setTimeout(() => notif.remove(), 300);
    }, 2500);
}

// فحص التذكيرات القريبة عند تحميل الصفحة
function checkUpcomingReminders() {
    const reminders = getReminders();
    const now = new Date();
    
    reminders.forEach(r => {
        if (r.completed) return;
        const reminderTime = new Date(r.date + 'T' + r.time);
        const diffHours = (reminderTime - now) / (1000 * 60 * 60);

        // إذا كان التذكير خلال 24 ساعة
        if (diffHours > 0 && diffHours <= 24) {
            if ('Notification' in window && Notification.permission === 'granted') {
                new Notification('⏰ تذكير Direction Team', {
                    body: `${r.title} - ${r.time}`,
                    icon: 'logo.png'
                });
            }
        }
    });
}

// تشغيل عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('remindersList')) {
        renderReminders();
        
        // تعيين التاريخ الافتراضي لليوم
        const dateInput = document.getElementById('reminderDate');
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.value = today;
        }

        // فحص التذكيرات القريبة
        checkUpcomingReminders();
        
        // فحص كل ساعة
        setInterval(checkUpcomingReminders, 60 * 60 * 1000);
    }
});
// ===== التبديل بين تاب المصطلحات والرموز =====
function switchMainTab(event, tabId) {
    document.querySelectorAll('.dict-main-content').forEach(c => c.classList.remove('active'));
    document.querySelectorAll('.dict-main-tab').forEach(b => b.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    event.currentTarget.classList.add('active');
}

// ===== رموز هندسية =====
const engineeringSymbols = [
    // كهربائية
    { symbol: "V", name: "فولت", fullName: "Voltage", cat: "electric", desc: "وحدة قياس الجهد الكهربائي" },
    { symbol: "A", name: "أمبير", fullName: "Ampere", cat: "electric", desc: "وحدة قياس التيار الكهربائي" },
    { symbol: "Ω", name: "أوم", fullName: "Ohm", cat: "electric", desc: "وحدة قياس المقاومة الكهربائية" },
    { symbol: "W", name: "واط", fullName: "Watt", cat: "electric", desc: "وحدة قياس القدرة الكهربائية" },
    { symbol: "F", name: "فاراد", fullName: "Farad", cat: "electric", desc: "وحدة قياس السعة الكهربائية" },
    { symbol: "H", name: "هنري", fullName: "Henry", cat: "electric", desc: "وحدة قياس الحث الكهربائي" },
    { symbol: "Hz", name: "هرتز", fullName: "Hertz", cat: "electric", desc: "وحدة قياس التردد" },
    { symbol: "~", name: "تيار متردد", fullName: "AC", cat: "electric", desc: "رمز التيار المتردد" },
    { symbol: "⎓", name: "تيار مستمر", fullName: "DC", cat: "electric", desc: "رمز التيار المستمر" },
    { symbol: "⏚", name: "أرضي", fullName: "Ground", cat: "electric", desc: "رمز التأريض" },

    // ميكانيكية
    { symbol: "N", name: "نيوتن", fullName: "Newton", cat: "mechanical", desc: "وحدة قياس القوة" },
    { symbol: "J", name: "جول", fullName: "Joule", cat: "mechanical", desc: "وحدة قياس الطاقة" },
    { symbol: "Pa", name: "باسكال", fullName: "Pascal", cat: "mechanical", desc: "وحدة قياس الضغط" },
    { symbol: "kg", name: "كيلوغرام", fullName: "Kilogram", cat: "mechanical", desc: "وحدة قياس الكتلة" },
    { symbol: "m/s", name: "متر/ثانية", fullName: "m/s", cat: "mechanical", desc: "وحدة قياس السرعة" },
    { symbol: "m/s²", name: "متر/ث²", fullName: "m/s²", cat: "mechanical", desc: "وحدة قياس التسارع" },
    { symbol: "N·m", name: "نيوتن.متر", fullName: "Newton-meter", cat: "mechanical", desc: "وحدة قياس العزم" },
    { symbol: "τ", name: "تاو", fullName: "Tau", cat: "mechanical", desc: "رمز الإجهاد القصي" },
    { symbol: "σ", name: "سيغما", fullName: "Sigma", cat: "mechanical", desc: "رمز الإجهاد العمودي" },
    { symbol: "ε", name: "إبسيلون", fullName: "Epsilon", cat: "mechanical", desc: "رمز الانفعال" },

    // مدنية
    { symbol: "🏗️", name: "مبنى", fullName: "Building", cat: "civil", desc: "رمز المبنى في المخططات" },
    { symbol: "🚪", name: "باب", fullName: "Door", cat: "civil", desc: "رمز الباب في المخططات المعمارية" },
    { symbol: "🪟", name: "نافذة", fullName: "Window", cat: "civil", desc: "رمز النافذة في المخططات" },
    { symbol: "🚿", name: "حمام", fullName: "Bathroom", cat: "civil", desc: "رمز الحمام" },
    { symbol: "🛗", name: "مصعد", fullName: "Elevator", cat: "civil", desc: "رمز المصعد" },
    { symbol: "🪜", name: "سلم", fullName: "Stairs", cat: "civil", desc: "رمز السلم" },
    { symbol: "🛣️", name: "طريق", fullName: "Road", cat: "civil", desc: "رمز الطريق" },
    { symbol: "🌉", name: "جسر", fullName: "Bridge", cat: "civil", desc: "رمز الجسر" },
    { symbol: "🏛️", name: "عمود", fullName: "Column", cat: "civil", desc: "رمز العمود الإنشائي" },
    { symbol: "⚖️", name: "توازن", fullName: "Balance", cat: "civil", desc: "رمز التوازن الإنشائي" },

    // برمجية
    { symbol: "{ }", name: "أقواس معقوفة", fullName: "Curly Braces", cat: "programming", desc: "تستخدم في الكتل البرمجية" },
    { symbol: "( )", name: "أقواس", fullName: "Parentheses", cat: "programming", desc: "تستخدم في الدوال والتجميع" },
    { symbol: "[ ]", name: "أقواس مربعة", fullName: "Square Brackets", cat: "programming", desc: "تستخدم للمصفوفات" },
    { symbol: "=", name: "إسناد", fullName: "Assignment", cat: "programming", desc: "يُسند قيمة لمتغير" },
    { symbol: "==", name: "مساواة", fullName: "Equality", cat: "programming", desc: "يقارن قيمتين" },
    { symbol: "!=", name: "لا يساوي", fullName: "Not Equal", cat: "programming", desc: "يقارن عدم التساوي" },
    { symbol: "&&", name: "و المنطقية", fullName: "Logical AND", cat: "programming", desc: "يعيد true إذا كان الشرطان صحيحين" },
    { symbol: "||", name: "أو المنطقية", fullName: "Logical OR", cat: "programming", desc: "يعيد true إذا كان أحد الشرطين صحيحاً" },
    { symbol: "//", name: "تعليق", fullName: "Comment", cat: "programming", desc: "تعليق سطر واحد" },
    { symbol: "/* */", name: "تعليق متعدد", fullName: "Multi-line Comment", cat: "programming", desc: "تعليق متعدد الأسطر" },
    { symbol: "→", name: "سهم", fullName: "Arrow", cat: "programming", desc: "يستخدم في الدوال السهمية" },
    { symbol: "++", name: "زيادة", fullName: "Increment", cat: "programming", desc: "يزيد قيمة المتغير بمقدار 1" },

    // رياضية
    { symbol: "∑", name: "سيغما كبيرة", fullName: "Summation", cat: "math", desc: "رمز المجموع" },
    { symbol: "∏", name: "باي كبيرة", fullName: "Product", cat: "math", desc: "رمز الجداء" },
    { symbol: "∫", name: "تكامل", fullName: "Integral", cat: "math", desc: "رمز التكامل" },
    { symbol: "∂", name: "مشتقة جزئية", fullName: "Partial Derivative", cat: "math", desc: "رمز الاشتقاق الجزئي" },
    { symbol: "∇", name: "نابلا", fullName: "Nabla", cat: "math", desc: "عامل التدرج" },
    { symbol: "∞", name: "ما لا نهاية", fullName: "Infinity", cat: "math", desc: "رمز اللانهاية" },
    { symbol: "≈", name: "تقريباً", fullName: "Approximately", cat: "math", desc: "يساوي تقريباً" },
    { symbol: "≠", name: "لا يساوي", fullName: "Not Equal", cat: "math", desc: "لا يساوي" },
    { symbol: "≤", name: "أصغر أو يساوي", fullName: "Less or Equal", cat: "math", desc: "أصغر من أو يساوي" },
    { symbol: "≥", name: "أكبر أو يساوي", fullName: "Greater or Equal", cat: "math", desc: "أكبر من أو يساوي" },
    { symbol: "√", name: "جذر", fullName: "Square Root", cat: "math", desc: "رمز الجذر التربيعي" },
    { symbol: "θ", name: "ثيتا", fullName: "Theta", cat: "math", desc: "رمز الزاوية" },
    { symbol: "π", name: "باي", fullName: "Pi", cat: "math", desc: "النسبة التقريبية = 3.14159" },
    { symbol: "Δ", name: "دلتا", fullName: "Delta", cat: "math", desc: "رمز التغير" }
];

let currentSymbolCategory = 'all';

function renderSymbols(symbols) {
    const container = document.getElementById('symbolList');
    const noResults = document.getElementById('noSymbolResults');
    const countEl = document.getElementById('symbolCount');

    if (!container) return;

    if (countEl) countEl.textContent = symbols.length;

    if (symbols.length === 0) {
        container.innerHTML = '';
        if (noResults) noResults.style.display = 'block';
        return;
    }

    if (noResults) noResults.style.display = 'none';

    container.innerHTML = symbols.map(s => `
        <div class="symbol-item">
            <div class="symbol-display">${s.symbol}</div>
            <div class="symbol-info">
                <h3 class="symbol-name">${s.name}</h3>
                <span class="symbol-full">${s.fullName}</span>
                <p class="symbol-desc">${s.desc}</p>
                <span class="symbol-category">${getSymbolCategoryName(s.cat)}</span>
            </div>
        </div>
    `).join('');
}

function getSymbolCategoryName(cat) {
    const names = {
        electric: '⚡ كهربائية',
        mechanical: '🔧 ميكانيكية',
        civil: '🏗️ مدنية',
        programming: '💻 برمجية',
        math: '📐 رياضية'
    };
    return names[cat] || cat;
}

function searchSymbols() {
    const query = document.getElementById('symbolSearch').value.toLowerCase().trim();
    let filtered = engineeringSymbols;

    if (currentSymbolCategory !== 'all') {
        filtered = filtered.filter(s => s.cat === currentSymbolCategory);
    }

    if (query) {
        filtered = filtered.filter(s =>
            s.name.toLowerCase().includes(query) ||
            s.fullName.toLowerCase().includes(query) ||
            s.symbol.toLowerCase().includes(query) ||
            s.desc.toLowerCase().includes(query)
        );
    }

    renderSymbols(filtered);
}

function filterSymbolCategory(event, category) {
    currentSymbolCategory = category;
    document.querySelectorAll('.sym-cat-btn').forEach(btn => btn.classList.remove('active'));
    event.currentTarget.classList.add('active');
    searchSymbols();
}

// تشغيل عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('symbolList')) {
        renderSymbols(engineeringSymbols);
    }
});
