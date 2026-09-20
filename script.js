// ============================================
// Direction Team - Main JavaScript File
// ============================================

// ===== تحويل الأرقام العربية إلى إنجليزية =====
function convertToEnglishNumbers(str) {
    if (!str) return str;
    const arabicNumbers = ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'];
    return String(str).replace(/[٠-٩]/g, d => arabicNumbers.indexOf(d));
}

// ===== التبديل بين التخصصات =====
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
    if (themeBtn) themeBtn.textContent = isDark ? '☀️' : '🌙';
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
    const isAr = currentLang === 'ar';
    const text = isAr 
        ? '🔗 موقع Direction Team الرسمي\n\n📚 مواد هندسة الميكانيك والطاقة المتجددة\n📋 الخطط الدراسية\n📝 امتحان الكفاءة\n💻 برامج هندسية\n\n' + url + '\n\n💜 انشروه لكل الطلاب!'
        : '🔗 Direction Team Official Website\n\n📚 Mechanical & Renewable Energy Materials\n📋 Study Plans\n📝 Competency Exam\n💻 Engineering Programs\n\n' + url + '\n\n💜 Share it with all students!';
    
    if (navigator.share) {
        navigator.share({ title: 'Direction Team', text: text, url: url }).catch(() => openWhatsApp(text));
    } else {
        openWhatsApp(text);
    }
}

function openWhatsApp(text) {
    window.open('https://wa.me/?text=' + encodeURIComponent(text), '_blank');
}

// ===== الرجوع للأعلى =====
window.addEventListener('scroll', function() {
    const btn = document.getElementById('scrollTop');
    if (btn) {
        if (window.scrollY > 300) btn.classList.add('show');
        else btn.classList.remove('show');
    }
});

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== عرض تاريخ آخر تعديل =====
async function showRealLastUpdate() {
    const updateElement = document.getElementById('lastUpdate');
    if (!updateElement) return;
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const isAr = currentLang === 'ar';
    const prefix = isAr ? '🕐 آخر تحديث: ' : '🕐 Last update: ';
    const locale = isAr ? 'ar-EG' : 'en-US';
    const now = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    updateElement.textContent = prefix + now.toLocaleDateString(locale, options);
    try {
        const response = await fetch(`https://api.github.com/repos/directionteam/Direction-team/commits?path=${currentPage}&per_page=1`);
        const data = await response.json();
        if (data && data[0] && data[0].commit) {
            const commitDate = new Date(data[0].commit.committer.date);
            updateElement.textContent = prefix + commitDate.toLocaleDateString(locale, options);
        }
    } catch (error) {}
}

// ===== شاشة التحميل =====
window.addEventListener('load', function() {
    const loader = document.getElementById('loaderScreen');
    if (!loader) return;
    const hasVisited = localStorage.getItem('hasVisited');
    if (hasVisited) { loader.remove(); return; }
    localStorage.setItem('hasVisited', 'true');
    setTimeout(function() {
        loader.classList.add('hidden');
        setTimeout(() => loader.remove(), 700);
    }, 1500);
});

// ============================================
// ===== نظام اللغة =====
// ============================================
let currentLang = localStorage.getItem('siteLanguage') || 'ar';

// ===== أزرار المشاركة والمفضلة =====
function addShareButtons() {
    const materialLinks = document.querySelectorAll('.year-content ul li a, .semester li a');
    materialLinks.forEach(link => {
        const li = link.parentElement;
        if (!li || li.querySelector('.share-material-btn')) return;
        const materialName = link.getAttribute('data-ar-text') || link.textContent.trim();
        const shareBtn = document.createElement('button');
        shareBtn.className = 'share-material-btn';
        shareBtn.innerHTML = currentLang === 'ar' ? '📤 مشاركة' : '📤 Share';
        shareBtn.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            shareMaterialAdvanced(materialName);
        };
        li.style.position = 'relative';
        li.appendChild(shareBtn);
    });
}

function addFavoriteButtons() {
    const materialLinks = document.querySelectorAll('.year-content ul li a, .semester li a');
    materialLinks.forEach(link => {
        const li = link.parentElement;
        if (!li || li.querySelector('.fav-material-btn')) return;
        const materialName = link.getAttribute('data-ar-text') || link.textContent.trim();
        const materialUrl = link.href;
        const favBtn = document.createElement('button');
        favBtn.className = 'fav-material-btn';
        favBtn.dataset.material = materialName;
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

function shareMaterialAdvanced(materialName) {
    const siteUrl = 'https://directionteam.github.io/Direction-team/materials.html';
    const isAr = currentLang === 'ar';
    const text = isAr
        ? `📚 ${materialName}\n\n🔗 من موقع Direction Team:\n${siteUrl}\n\n💜 شاركها مع زملائك!`
        : `📚 ${materialName}\n\n🔗 From Direction Team:\n${siteUrl}\n\n💜 Share it with your colleagues!`;
    if (navigator.share) {
        navigator.share({ title: materialName, text: text, url: siteUrl }).catch(() => openWhatsAppShare(text));
    } else {
        openWhatsAppShare(text);
    }
}

function openWhatsAppShare(text) {
    window.open('https://wa.me/?text=' + encodeURIComponent(text), '_blank');
}

// ===== نظام المفضلة =====
function toggleFavorite(materialName, materialUrl) {
    let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const existingIndex = favorites.findIndex(fav => fav.name === materialName);
    if (existingIndex > -1) favorites.splice(existingIndex, 1);
    else favorites.push({ name: materialName, url: materialUrl });
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

function displayFavorites() {
    const container = document.getElementById('favoritesList');
    if (!container) return;
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const isAr = currentLang === 'ar';
    if (favorites.length === 0) {
        container.innerHTML = `
            <div class="empty-favorites">
                <p>${isAr ? '⭐ لا توجد مواد في المفضلة بعد' : '⭐ No favorites yet'}</p>
                <p>${isAr ? 'اذهب إلى <a href="materials.html">صفحة المواد</a> وأضف موادك المفضلة' : 'Go to <a href="materials.html">Materials page</a> and add favorites'}</p>
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
            <button class="fav-remove" onclick="removeFavorite('${fav.name.replace(/'/g, "\\'")}')">×</button>
        </div>
    `).join('');
}

function removeFavorite(materialName) {
    let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    favorites = favorites.filter(fav => fav.name !== materialName);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    displayFavorites();
}

// ===== ترجمة المواد =====
function translateMaterials() {
    const materialLinks = document.querySelectorAll('.year-content ul li a, .semester li a');
    materialLinks.forEach(link => {
        const arabicText = link.getAttribute('data-ar-text');
        if (!arabicText) return;
        const targetText = currentLang === 'en' ? (materialTranslations[arabicText] || arabicText) : arabicText;
        while (link.firstChild) link.removeChild(link.firstChild);
        link.appendChild(document.createTextNode(targetText));
    });
}

// ===== قاموس ترجمة المواد =====
const materialTranslations = {
    'لغة البرمجة C++': 'C++ Programming Language',
    'المختبر الكهرباء والإلكترونيات': 'Electrical & Electronics Lab',
    'لغة C++': 'C++ Language',
    'مدخل الهندسة': 'Introduction to Engineering',
    'كيمياء عامة (1) - General Chemistry (1)': 'General Chemistry (1)',
    'تفاضل وتكامل (2) - Calculus (2)': 'Calculus (2)',
    'مختبر فيزياء عامة (1)': 'General Physics Lab (1)',
    'مختبر فيزياء عامة (2)': 'General Physics Lab (2)',
    'الرسم الهندسي - Engineering Drawing': 'Engineering Drawing',
    'مهارات الاتصال - Communication Skills': 'Communication Skills',
    'الاقتصاد الهندسي - Engineering Economy': 'Engineering Economy',
    'التحليل العددي للمهندسين - Numerical Analysis': 'Numerical Analysis',
    'رياضيات هندسية - Engineering Mathematics': 'Engineering Mathematics',
    'الطاقة والبيئة - Energy and the Environment': 'Energy and Environment',
    'القياسات والأجهزة الهندسية': 'Engineering Measurements & Devices',
    'الميكانيكا الهندسية - Engineering Mechanics': 'Engineering Mechanics',
    'برمجة الحاسوب للمهندسين': 'Computer Programming for Engineers',
    'ميكانيكا الموائع - Fluid Mechanics': 'Fluid Mechanics',
    'مبادئ الهندسة الكهربائية والإلكترونيات': 'Electrical & Electronic Principles',
    'الديناميكا الحرارية - Thermodynamics': 'Thermodynamics',
    'مصادر الطاقة المتجددة': 'Renewable Energy Sources',
    'ميكانيكا المواد وخصائصها': 'Mechanics of Materials & Properties',
    'نقل الحرارة والكتلة': 'Heat and Mass Transfer',
    'أساسيات أنظمة القدرة الكهربائية': 'Fundamentals of Power Systems',
    'مختبر ميكانيكا الموائع': 'Fluid Mechanics Lab',
    'مختبر الكهرباء والإلكترونيات': 'Electrical & Electronic Lab',
    'أنظمة طاقة شمسية حرارية': 'Solar Thermal Energy Systems',
    'الآلات التوربينية - Turbo-Machinery': 'Turbo-Machinery',
    'تكنولوجيا أنظمة الخلايا الكهروضوئية': 'PV System Technology',
    'إدارة الطاقة - Energy Management': 'Energy Management',
    'مقدمة في التصميم الميكانيكي': 'Introduction to Mechanical Design',
    'مختبر ديناميكا الموائع الحسابية (CFD) Lab': 'CFD Lab',
    'مختبر التحكم - Control Lab': 'Control Lab',
    'الطاقة الحرارية الارضية - Geothermal Energy': 'Geothermal Energy',
    'طاقة الرياح - Wind Energy': 'Wind Energy',
    'مدخل للهندسة': 'Introduction to Engineering',
    'فيزياء عامة عملية (1)': 'General Physics Lab (1)',
    'كيمياء عامة (1)': 'General Chemistry (1)',
    'تفاضل وتكامل (2)': 'Calculus (2)',
    'رياضيات هندسية (1)': 'Engineering Mathematics (1)',
    'رياضيات هندسية (2)': 'Engineering Mathematics (2)',
    'استاتيكا': 'Statics',
    'ديناميكا': 'Dynamics',
    'تحليل عددي للمهندسين': 'Numerical Analysis',
    'علم المواد': 'Materials Science',
    'رسم هندسي': 'Engineering Drawing',
    'رسم آلات': 'Machine Drawing',
    'اقتصاد هندسي': 'Engineering Economy',
    'مهارات اتصال': 'Communication Skills',
    'ميكانيكا الموائع (1)': 'Fluid Mechanics (1)',
    'ميكانيكا الموائع (2)': 'Fluid Mechanics (2)',
    'ديناميكا حرارية (1)': 'Thermodynamics (1)',
    'ديناميكا حرارية (2)': 'Thermodynamics (2)',
    'مقاومة المواد (1)': 'Mechanics of Materials (1)',
    'مقاومة مواد (2)': 'Mechanics of Materials (2)',
    'نظرية الآلات': 'Theory of Machines',
    'انتقال الحرارة (1)': 'Heat Transfer (1)',
    'القياسات الهندسية': 'Engineering Measurements',
    'الدوائر والآلات الكهربائية': 'Electrical Circuits & Machines',
    'عمليات الإنتاج (1)': 'Manufacturing Processes (1)',
    'مختبر ديناميكا حرارية': 'Thermodynamics Lab',
    'مختبر مقاومة المواد': 'Materials Lab',
    'مختبر نظرية الآلات': 'Machines Lab',
    'مختبر انتقال الحرارة': 'Heat Transfer Lab',
    'مختبر الإنتاج والقياسات': 'Production & Measurements Lab',
    'التصميم الميكانيكي (1)': 'Mechanical Design (1)',
    'التصميم الميكانيكي (2)': 'Mechanical Design (2)',
    'التصميم بواسطة الحاسوب': 'Computer-Aided Design',
    'الآلات التوربينية': 'Turbo-Machinery',
    'التكييف (1)': 'Air Conditioning (1)',
    'الاهتزازات الميكانيكية': 'Mechanical Vibrations',
    'محركات احتراق داخلي': 'Internal Combustion Engines',
    'مختبر محركات الاحتراق الداخلي': 'IC Engines Lab',
    'مختبر الاهتزازات الميكانيكية والتحكم': 'Vibrations & Control Lab',
    'التحكم الآلي': 'Automatic Control',
    'الأنظمة الديناميكية والتحكم': 'Dynamic Systems & Control',
    'مختبر آلات كهربائية': 'Electrical Machines Lab',
    'هندسة السلامة المهنية': 'Industrial Safety Engineering',
    'أنظمة الطاقة المتجددة': 'Renewable Energy Systems',
    'تحويل الطاقة': 'Energy Conversion',
    'محطات القدرة الحرارية': 'Thermal Power Plants',
    'موضوعات خاصة في الهندسة الميكانيكية': 'Special Topics in Mechanical Engineering'
};

// ============================================
// ===== ترجمات الواجهة =====
// ============================================
const translations = {
    ar: {
        'nav-home': 'الرئيسية', 'nav-materials': 'المواد', 'nav-plans': 'الخطط الدراسية',
        'nav-exam': 'امتحان الكفاءة', 'nav-programs': 'برامج هندسية', 'nav-calculator': 'الحاسبة',
        'nav-map': 'خريطة الجامعة', 'nav-reminders': 'التذكيرات', 'nav-dictionary': 'القاموس',
        'nav-feedback': 'شارك تجربتك', 'nav-suggestions': 'شاركنا اقتراحك',
        'nav-links': 'روابط تهمك', 'nav-contact': 'تواصل معنا',
        'hero-subtitle': 'Al-Hussein Bin Talal University',
        'hero-desc': 'فريق أكاديمي تطوّعي - كلية الهندسة',
        'hero-btn-materials': '📚 تصفح المواد', 'hero-btn-plans': '📋 الخطط الدراسية',
        'about-title': 'من نحن', 'team-title': '👥 الفريق',
        'team-desc': 'تعرّف على من نحن، رؤيتنا، ورسالتنا',
        'team-about': 'من نحن', 'team-vision': 'رؤيتنا', 'team-message': 'رسالتنا',
        'wisdom-title': '💡 حكمة اليوم', 'wisdom-desc': 'حكمة يومية تتجدد كل يوم',
        'favorites-title': '⭐ موادي المفضلة', 'favorites-desc': 'المواد التي حفظتها في متصفحك',
        'footer-contact': 'تواصل معنا', 'footer-copy': '© 2026 Direction Team - جامعة الحسين بن طلال',
        'footer-love': 'صُنع بحب لطلبة الهندسة 💜', 'btn-share': 'شارك الموقع',
        'team-about-text': 'فريق أكاديمي تطوّعي في قسمِ الهندسة الميكانيكيّة وهندسة الطاقة المتجددة في جامعة الحسين بن طلال، يهدف إلى الرقي بالمستوى الأكاديمي والإجتماعي لطلبة الهندسة الميكانيكيّة وهندسة الطاقة المتجددة بشكل خاص وطلبة كليّة الهندسة بشكل عام.',
        'team-vision-text': 'توفير الأجواء الملائمة للتميز والإبداع في مجالات الهندسة الميكانيكيّة وهندسة الطاقة المتجددة وتطوير العمل الأكاديمي وتنميّة الطلبة من خلال الأنشطة اللامنهجيّة.',
        'team-message-text': 'العمل المشترك للوصول إلى مجتمع طلابي مبادر واشراكه في التخطيط والتنفيذ لمختلف الأنشطة، وتنميته لمواكبة تطورات العصر.',
        'materials-title': '📚 مواد التخصص', 'materials-desc': 'اختر التخصص ثم السنة الدراسية لعرض المواد',
        'materials-search': '🔍 ابحث عن مادة...',
        'materials-tab-renewable': '🌱 هندسة الطاقة المتجددة', 'materials-tab-mechanical': '⚙️ هندسة الميكانيك',
        'materials-year-1': '🎓 السنة الأولى', 'materials-year-2': '🎓 السنة الثانية',
        'materials-year-3': '🎓 السنة الثالثة', 'materials-year-4': '🎓 السنة الرابعة', 'materials-year-5': '🎓 السنة الخامسة',
        'plans-title': '📋 الخطط الدراسية', 'plans-desc': 'اختر التخصص والسنة',
        'plans-mechanical': '⚙️ هندسة الميكانيك', 'plans-renewable': '🌱 هندسة الطاقة المتجددة',
        'plans-new-2026': '🆕 الخطة الجديدة 2026', 'plans-2020': '📄 الخطة الدراسية (2020)',
        'plans-2021': '📄 الخطة الدراسية (2021)', 'plans-tree': '🌳 الخطة الشجرية', 'plans-years': '📅 الخطة حسب السنوات',
        'exam-title': '📝 نماذج امتحان الكفاءة الجامعية', 'exam-desc': 'كل ما تحتاجه للاستعداد',
        'exam-general': '📌 معلومات عامة', 'exam-instructions': '📋 تعليمات امتحان الكفاءة',
        'exam-sample': '📄 نموذج مستوى عام', 'exam-mechanical': '⚙️ نماذج الهندسة الميكانيكية',
        'exam-part-1': '1️⃣ الجزء الأول', 'exam-part-2': '2️⃣ الجزء الثاني',
        'exam-part-3': '3️⃣ الجزء الثالث', 'exam-part-4': '4️⃣ الجزء الرابع',
        'programs-title': '💻 برامج هندسية', 'programs-desc': 'روابط تحميل وشرح',
        'programs-download': 'رابط التحميل', 'programs-video': 'شرح طريقة التثبيت',
        'program-solidworks-desc': 'برنامج التصميم الهندسي ثلاثي الأبعاد - الأشهر في كليات الهندسة.',
        'program-matlab-desc': 'برنامج التحليل الرياضي والحسابات الهندسية.',
        'calc-title': '🧮 الحاسبة الهندسية المتعددة', 'calc-desc': 'مجموعة حاسبات في مكان واحد',
        'calc-tab-triangle': '📐 المثلثات', 'calc-tab-power': '⚡ القدرة', 'calc-tab-heat': '🔥 الحرارة',
        'calc-tab-pressure': '💧 الضغط', 'calc-tab-units': '🔄 الوحدات',
        'calc-triangle-title': '📐 حاسبة المثلثات', 'calc-triangle-desc': 'احسب الدوال المثلثية',
        'calc-angle-label': 'الزاوية (بالدرجات):', 'calc-calculate': 'احسب',
        'calc-sin': 'sin (جيب):', 'calc-cos': 'cos (جتا):', 'calc-tan': 'tan (ظل):',
        'calc-power-title': '⚡ حاسبة القدرة', 'calc-voltage-label': 'الجهد V (فولت):',
        'calc-current-label': 'التيار I (أمبير):', 'calc-power-result': 'القدرة P:', 'calc-power-kw': 'بالكيلوواط:',
        'calc-heat-title': '🔥 حاسبة الحرارة', 'calc-mass-label': 'الكتلة m (كغ):',
        'calc-specific-label': 'الحرارة النوعية c (J/kg·°C):', 'calc-deltat-label': 'فرق الحرارة ΔT (°C):',
        'calc-heat-result': 'الطاقة Q:', 'calc-heat-kj': 'بالكيلوجول:',
        'calc-pressure-title': '💧 حاسبة الضغط', 'calc-force-label': 'القوة F (نيوتن):',
        'calc-area-label': 'المساحة A (م²):', 'calc-pressure-result': 'الضغط P:', 'calc-pressure-kpa': 'بالكيلوباسكال:',
        'calc-units-title': '🔄 محول الوحدات', 'calc-units-desc': 'حوّل بين وحدات القياس',
        'calc-value-label': 'القيمة:', 'calc-from-label': 'من وحدة:', 'calc-to-label': 'إلى وحدة:',
        'calc-convert': 'حوّل', 'calc-result-label': 'النتيجة:',
        'calc-m': 'متر (m)', 'calc-cm': 'سنتيمتر (cm)', 'calc-mm': 'مليمتر (mm)',
        'calc-km': 'كيلومتر (km)', 'calc-inch': 'بوصة (inch)', 'calc-ft': 'قدم (ft)',
        'map-title': '🗺️ خريطة الجامعة التفاعلية', 'map-desc': 'اكتشف أهم أماكن الجامعة',
        'map-places': '📍 أماكن مهمة في الجامعة', 'map-places-desc': 'اضغط على أي مكان',
        'map-engineering': 'كلية الهندسة', 'map-it': 'كلية تكنولوجيا المعلومات',
        'map-science': 'كلية العلوم', 'map-literature': 'كلية الآداب',
        'map-business': 'كلية إدارة الأعمال', 'map-law': 'كلية القانون',
        'map-nursing': 'كلية الأميرة عائشة للتمريض', 'map-finance': 'مبنى الإدارة المالية',
        'map-jordan-hall': 'قاعة الأردن', 'map-computer-center': 'مركز الحاسوب',
        'map-halls': 'مجمع القاعات', 'map-booth': 'منصة الهندسة',
        'map-bus': 'مجمع الباصات', 'map-dorm1': 'سكن الطالبات (1)',
        'map-dorm2': 'سكن الطالبات (2)', 'map-housing-gate': 'بوابة السكن', 'map-supplies': 'وحدة اللوازم',
        'reminders-title': '⏰ تذكيراتي', 'reminders-desc': 'سجّل تذكيراتك',
        'reminders-add': '➕ إضافة تذكير جديد', 'reminders-title-label': '📝 العنوان:',
        'reminders-date-label': '📅 التاريخ:', 'reminders-time-label': '⏰ الوقت:',
        'reminders-priority-label': '🎯 الأولوية:', 'reminders-type-label': '📂 النوع:',
        'reminders-priority-high': '🔴 عالية', 'reminders-priority-medium': '🟡 متوسطة', 'reminders-priority-low': '🟢 منخفضة',
        'reminders-type-exam': '📝 امتحان', 'reminders-type-homework': '📚 واجب',
        'reminders-type-project': '🔬 مشروع', 'reminders-type-meeting': '👥 اجتماع', 'reminders-type-other': '📌 أخرى',
        'reminders-add-btn': '➕ إضافة التذكير', 'reminders-list-title': '📋 تذكيراتي',
        'reminders-filter-all': 'الكل', 'reminders-filter-upcoming': 'القادمة', 'reminders-filter-past': 'المنتهية',
        'enable-notifications': '🔔 تفعيل الإشعارات',
        'reminders-clear-all': '🗑️ حذف الكل',
        'dict-title': '📖 القاموس الهندسي', 'dict-desc': 'مصطلحات + رموز هندسية',
        'dict-tab-terms': '📖 المصطلحات', 'dict-tab-symbols': '🔣 الرموز',
        'dict-search-term': '🔍 ابحث عن مصطلح...', 'dict-search-symbol': '🔍 ابحث عن رمز...',
        'dict-all': '🌐 الكل', 'dict-mechanics': '⚙️ ميكانيكا', 'dict-thermo': '🔥 حراريات',
        'dict-fluids': '💧 موائع', 'dict-materials': '🔬 مواد', 'dict-electric': '⚡ كهرباء',
        'dict-energy': '🌱 طاقة', 'dict-math': '📐 رياضيات',
        'dict-electric-sym': '⚡ كهربائية', 'dict-mechanical-sym': '🔧 ميكانيكية',
        'dict-civil': '🏗️ مدنية', 'dict-programming': '💻 برمجية', 'dict-math-sym': '📐 رياضية',
        'dict-term-count': 'مصطلح', 'dict-symbol-count': 'رمز',
        'dict-no-results': 'لا توجد نتائج', 'dict-no-results-desc': 'جربي كلمة أخرى',
        'suggestions-title': '📮 شاركنا اقتراحك', 'suggestions-desc': 'رأيك يهمنا',
        'suggestions-how': 'كيف نساعدك؟', 'suggestions-how-desc': 'اختر نوع رسالتك',
        'suggestions-type-suggestion': 'اقتراح', 'suggestions-type-problem': 'مشكلة', 'suggestions-type-note': 'ملاحظة',
        'suggestions-write': '📝 اكتب رسالتك', 'suggestions-type-label': '📌 نوع الرسالة:',
        'suggestions-name-label': '👤 اسمك (اختياري):', 'suggestions-email-label': '📧 إيميلك (اختياري):',
        'suggestions-major-label': '🎓 تخصصك:', 'suggestions-major-none': 'اختر تخصصك',
        'suggestions-major-other': 'تخصص آخر', 'suggestions-subject-label': '📝 الموضوع:',
        'suggestions-details-label': '💬 التفاصيل:', 'suggestions-submit': '📤 إرسال الرسالة',
        'suggestions-form-note': '⚠️ رسالتك ستصل مباشرة للفريق.',
        'suggestions-alt-contact': '💡 أو تواصل معنا مباشرة',
        'links-title': '🔗 روابط تهمك', 'links-desc': 'روابط مهمة لطلاب الجامعة',
        'links-university': 'موقع الجامعة', 'links-university-desc': 'الموقع الرسمي للجامعة',
        'links-portal': 'بوابة الطالب', 'links-portal-desc': 'سجّل موادك، شوف علاماتك',
        'links-elearning': 'التعليم الإلكتروني', 'links-elearning-desc': 'منصة eLearning',
        'links-calculator': 'حاسبة المعدل', 'links-calculator-desc': 'احسب معدلك بسهولة',
        'contact-title': '📞 تواصل معنا', 'contact-desc': 'تابعنا على السوشيال ميديا',
        'notfound-title': '🚫 404', 'notfound-subtitle': 'الصفحة غير موجودة',
        'notfound-message': 'عذراً، الصفحة غير موجودة',
        'notfound-desc': 'الرابط غير متوفر أو تم نقله',
        'notfound-home': '🏠 الرجوع للرئيسية', 'notfound-materials': '📚 تصفح المواد',
        'notfound-suggestions-title': '💡 قد تجد ما تبحث عنه هنا:'
    },
    en: {
        'nav-home': 'Home', 'nav-materials': 'Materials', 'nav-plans': 'Study Plans',
        'nav-exam': 'Competency Exam', 'nav-programs': 'Engineering Programs', 'nav-calculator': 'Calculator',
        'nav-map': 'Campus Map', 'nav-reminders': 'Reminders', 'nav-dictionary': 'Dictionary',
        'nav-feedback': 'Share Experience', 'nav-suggestions': 'Send Suggestion',
        'nav-links': 'Useful Links', 'nav-contact': 'Contact Us',
        'hero-subtitle': 'Al-Hussein Bin Talal University',
        'hero-desc': 'Volunteer Academic Team - College of Engineering',
        'hero-btn-materials': '📚 Browse Materials', 'hero-btn-plans': '📋 Study Plans',
        'about-title': 'About Us', 'team-title': '👥 The Team',
        'team-desc': 'Get to know us, our vision, and our mission',
        'team-about': 'About Us', 'team-vision': 'Our Vision', 'team-message': 'Our Mission',
        'wisdom-title': '💡 Wisdom of the Day', 'wisdom-desc': 'Daily wisdom updated every day',
        'favorites-title': '⭐ My Favorites', 'favorites-desc': 'Materials saved in your browser',
        'footer-contact': 'Contact Us', 'footer-copy': '© 2026 Direction Team - Al-Hussein Bin Talal University',
        'footer-love': 'Made with love for engineering students 💜', 'btn-share': 'Share Website',
        'team-about-text': 'A volunteer academic team in the Department of Mechanical Engineering and Renewable Energy Engineering at Al-Hussein Bin Talal University, aiming to elevate the academic and social level of students.',
        'team-vision-text': 'Providing the appropriate atmosphere for excellence and creativity in mechanical engineering and renewable energy engineering.',
        'team-message-text': 'Working together to reach a proactive student community and developing it to keep pace with the developments of the age.',
        'materials-title': '📚 Major Materials', 'materials-desc': 'Choose your major and year',
        'materials-search': '🔍 Search for a material...',
        'materials-tab-renewable': '🌱 Renewable Energy Engineering', 'materials-tab-mechanical': '⚙️ Mechanical Engineering',
        'materials-year-1': '🎓 First Year', 'materials-year-2': '🎓 Second Year',
        'materials-year-3': '🎓 Third Year', 'materials-year-4': '🎓 Fourth Year', 'materials-year-5': '🎓 Fifth Year',
        'plans-title': '📋 Study Plans', 'plans-desc': 'Choose your major and year',
        'plans-mechanical': '⚙️ Mechanical Engineering', 'plans-renewable': '🌱 Renewable Energy Engineering',
        'plans-new-2026': '🆕 New Plan 2026', 'plans-2020': '📄 Study Plan (2020)',
        'plans-2021': '📄 Study Plan (2021)', 'plans-tree': '🌳 Tree Plan', 'plans-years': '📅 Plan by Years',
        'exam-title': '📝 Competency Exam Samples', 'exam-desc': 'Everything to prepare for the exam',
        'exam-general': '📌 General Information', 'exam-instructions': '📋 Exam Instructions',
        'exam-sample': '📄 General Level Sample', 'exam-mechanical': '⚙️ Mechanical Engineering Samples',
        'exam-part-1': '1️⃣ Part One', 'exam-part-2': '2️⃣ Part Two',
        'exam-part-3': '3️⃣ Part Three', 'exam-part-4': '4️⃣ Part Four',
        'programs-title': '💻 Engineering Programs', 'programs-desc': 'Download links and tutorials',
        'programs-download': 'Download Link', 'programs-video': 'Installation Tutorial',
        'program-solidworks-desc': 'The most famous 3D engineering design software in engineering colleges.',
        'program-matlab-desc': 'Mathematical analysis and engineering calculations software.',
        'calc-title': '🧮 Multi Engineering Calculator', 'calc-desc': 'Group of engineering calculators',
        'calc-tab-triangle': '📐 Triangle', 'calc-tab-power': '⚡ Power', 'calc-tab-heat': '🔥 Heat',
        'calc-tab-pressure': '💧 Pressure', 'calc-tab-units': '🔄 Units',
        'calc-triangle-title': '📐 Triangle Calculator', 'calc-triangle-desc': 'Calculate trig values',
        'calc-angle-label': 'Angle (degrees):', 'calc-calculate': 'Calculate',
        'calc-sin': 'sin:', 'calc-cos': 'cos:', 'calc-tan': 'tan:',
        'calc-power-title': '⚡ Power Calculator', 'calc-voltage-label': 'Voltage V (Volt):',
        'calc-current-label': 'Current I (Ampere):', 'calc-power-result': 'Power P:', 'calc-power-kw': 'In kW:',
        'calc-heat-title': '🔥 Heat Calculator', 'calc-mass-label': 'Mass m (kg):',
        'calc-specific-label': 'Specific Heat c (J/kg·°C):', 'calc-deltat-label': 'Temp. Diff. ΔT (°C):',
        'calc-heat-result': 'Energy Q:', 'calc-heat-kj': 'In kJ:',
        'calc-pressure-title': '💧 Pressure Calculator', 'calc-force-label': 'Force F (N):',
        'calc-area-label': 'Area A (m²):', 'calc-pressure-result': 'Pressure P:', 'calc-pressure-kpa': 'In kPa:',
        'calc-units-title': '🔄 Unit Converter', 'calc-units-desc': 'Convert between units',
        'calc-value-label': 'Value:', 'calc-from-label': 'From:', 'calc-to-label': 'To:',
        'calc-convert': 'Convert', 'calc-result-label': 'Result:',
        'calc-m': 'Meter (m)', 'calc-cm': 'Centimeter (cm)', 'calc-mm': 'Millimeter (mm)',
        'calc-km': 'Kilometer (km)', 'calc-inch': 'Inch', 'calc-ft': 'Foot (ft)',
        'map-title': '🗺️ Interactive Campus Map', 'map-desc': 'Discover important places',
        'map-places': '📍 Important Places on Campus', 'map-places-desc': 'Click any place',
        'map-engineering': 'College of Engineering', 'map-it': 'IT College',
        'map-science': 'College of Science', 'map-literature': 'College of Literature',
        'map-business': 'Business Administration', 'map-law': 'College of Law',
        'map-nursing': 'Princess Aisha Nursing', 'map-finance': 'Financial Management',
        'map-jordan-hall': 'Jordan Hall', 'map-computer-center': 'Computer Center',
        'map-halls': 'Halls Complex', 'map-booth': 'Engineering Booth',
        'map-bus': 'Bus Complex', 'map-dorm1': 'Female Dormitory 1',
        'map-dorm2': 'Female Dormitory 2', 'map-housing-gate': 'Housing Gate', 'map-supplies': 'Supplies Unit',
        'reminders-title': '⏰ My Reminders', 'reminders-desc': 'Record your reminders',
        'reminders-add': '➕ Add New Reminder', 'reminders-title-label': '📝 Title:',
        'reminders-date-label': '📅 Date:', 'reminders-time-label': '⏰ Time:',
        'reminders-priority-label': '🎯 Priority:', 'reminders-type-label': '📂 Type:',
        'reminders-priority-high': '🔴 High', 'reminders-priority-medium': '🟡 Medium', 'reminders-priority-low': '🟢 Low',
        'reminders-type-exam': '📝 Exam', 'reminders-type-homework': '📚 Homework',
        'reminders-type-project': '🔬 Project', 'reminders-type-meeting': '👥 Meeting', 'reminders-type-other': '📌 Other',
        'reminders-add-btn': '➕ Add Reminder', 'reminders-list-title': '📋 My Reminders',
        'reminders-filter-all': 'All', 'reminders-filter-upcoming': 'Upcoming', 'reminders-filter-past': 'Past',
        'enable-notifications': '🔔 Enable Notifications',
        'reminders-clear-all': '🗑️ Clear All',
        'dict-title': '📖 Engineering Dictionary', 'dict-desc': 'Terms + symbols',
        'dict-tab-terms': '📖 Terms', 'dict-tab-symbols': '🔣 Symbols',
        'dict-search-term': '🔍 Search for a term...', 'dict-search-symbol': '🔍 Search for a symbol...',
        'dict-all': '🌐 All', 'dict-mechanics': '⚙️ Mechanics', 'dict-thermo': '🔥 Thermo',
        'dict-fluids': '💧 Fluids', 'dict-materials': '🔬 Materials', 'dict-electric': '⚡ Electric',
        'dict-energy': '🌱 Energy', 'dict-math': '📐 Math',
        'dict-electric-sym': '⚡ Electrical', 'dict-mechanical-sym': '🔧 Mechanical',
        'dict-civil': '🏗️ Civil', 'dict-programming': '💻 Programming', 'dict-math-sym': '📐 Math',
        'dict-term-count': 'Terms', 'dict-symbol-count': 'Symbols',
        'dict-no-results': 'No results found', 'dict-no-results-desc': 'Try another search',
        'suggestions-title': '📮 Send Us Your Suggestion', 'suggestions-desc': 'Your opinion matters',
        'suggestions-how': 'How can we help?', 'suggestions-how-desc': 'Choose message type',
        'suggestions-type-suggestion': 'Suggestion', 'suggestions-type-problem': 'Problem', 'suggestions-type-note': 'Note',
        'suggestions-write': '📝 Write Your Message', 'suggestions-type-label': '📌 Message Type:',
        'suggestions-name-label': '👤 Your Name (optional):', 'suggestions-email-label': '📧 Your Email (optional):',
        'suggestions-major-label': '🎓 Your Major:', 'suggestions-major-none': 'Choose your major',
        'suggestions-major-other': 'Other major', 'suggestions-subject-label': '📝 Subject:',
        'suggestions-details-label': '💬 Details:', 'suggestions-submit': '📤 Send Message',
        'suggestions-form-note': '⚠️ Your message will be sent directly to the team.',
        'suggestions-alt-contact': '💡 Or contact us directly',
        'links-title': '🔗 Useful Links', 'links-desc': 'Important links for students',
        'links-university': 'University Website', 'links-university-desc': 'Official university website',
        'links-portal': 'Student Portal', 'links-portal-desc': 'Register courses, view grades',
        'links-elearning': 'E-Learning', 'links-elearning-desc': 'eLearning platform',
        'links-calculator': 'GPA Calculator', 'links-calculator-desc': 'Calculate your GPA',
        'contact-title': '📞 Contact Us', 'contact-desc': 'Follow us on social media',
        'notfound-title': '🚫 404', 'notfound-subtitle': 'Page Not Found',
        'notfound-message': 'Sorry, page not found',
        'notfound-desc': 'The link is unavailable or has been moved',
        'notfound-home': '🏠 Back to Home', 'notfound-materials': '📚 Browse Materials',
        'notfound-suggestions-title': '💡 You may find what you are looking for here:'
    }
};

// ===== تطبيق اللغة =====
function toggleLanguage() {
    currentLang = currentLang === 'ar' ? 'en' : 'ar';
    localStorage.setItem('siteLanguage', currentLang);
    applyLanguage();
}

function applyLanguage() {
    const html = document.documentElement;
    if (currentLang === 'en') {
        html.setAttribute('dir', 'ltr');
        html.setAttribute('lang', 'en');
    } else {
        html.setAttribute('dir', 'rtl');
        html.setAttribute('lang', 'ar');
    }
    const langBtn = document.getElementById('langToggle');
    if (langBtn) langBtn.textContent = currentLang === 'ar' ? '🌐 EN' : '🌐 AR';
    document.querySelectorAll('[data-lang]').forEach(el => {
        const key = el.dataset.lang;
        if (translations[currentLang] && translations[currentLang][key]) {
            el.textContent = translations[currentLang][key];
        }
    });
    document.querySelectorAll('[data-lang-placeholder]').forEach(el => {
        const key = el.dataset.langPlaceholder;
        if (translations[currentLang] && translations[currentLang][key]) {
            el.placeholder = translations[currentLang][key];
        }
    });
    translateMaterials();
    document.querySelectorAll('.share-material-btn').forEach(btn => {
        btn.innerHTML = currentLang === 'ar' ? '📤 مشاركة' : '📤 Share';
    });
    if (document.getElementById('remindersList')) renderReminders();
    if (document.getElementById('favoritesList')) displayFavorites();
    if (document.getElementById('enableNotifBtn')) updateNotifButton();
}

// ===== الحاسبة =====
function switchCalc(event, calcId) {
    document.querySelectorAll('.calc-content').forEach(c => c.classList.remove('active'));
    document.querySelectorAll('.calc-tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(calcId).classList.add('active');
    event.currentTarget.classList.add('active');
}

function calculateTrig() {
    const angle = parseFloat(document.getElementById('angleInput').value);
    if (isNaN(angle)) {
        alert(currentLang === 'ar' ? 'الرجاء إدخال زاوية صحيحة' : 'Please enter a valid angle');
        return;
    }
    const radians = angle * Math.PI / 180;
    document.getElementById('sinResult').textContent = Math.sin(radians).toFixed(4);
    document.getElementById('cosResult').textContent = Math.cos(radians).toFixed(4);
    document.getElementById('tanResult').textContent = Math.tan(radians).toFixed(4);
    document.getElementById('triangleResult').style.display = 'block';
}

function calculatePower() {
    const v = parseFloat(document.getElementById('voltageInput').value);
    const i = parseFloat(document.getElementById('currentInput').value);
    if (isNaN(v) || isNaN(i)) {
        alert(currentLang === 'ar' ? 'الرجاء إدخال قيم صحيحة' : 'Please enter valid values');
        return;
    }
    const p = v * i;
    const kw = (p / 1000).toFixed(3);
    const isAr = currentLang === 'ar';
    document.getElementById('powerValue').textContent = p.toFixed(2) + (isAr ? ' واط' : ' W');
    document.getElementById('powerKW').textContent = kw + (isAr ? ' كيلوواط' : ' kW');
    document.getElementById('powerResult').style.display = 'block';
}

function calculateHeat() {
    const m = parseFloat(document.getElementById('massInput').value);
    const c = parseFloat(document.getElementById('specificHeatInput').value);
    const dt = parseFloat(document.getElementById('deltaTInput').value);
    if (isNaN(m) || isNaN(c) || isNaN(dt)) {
        alert(currentLang === 'ar' ? 'الرجاء إدخال قيم صحيحة' : 'Please enter valid values');
        return;
    }
    const q = m * c * dt;
    const kj = (q / 1000).toFixed(2);
    const isAr = currentLang === 'ar';
    document.getElementById('heatValue').textContent = q.toFixed(2) + (isAr ? ' جول' : ' J');
    document.getElementById('heatKJ').textContent = kj + (isAr ? ' كيلوجول' : ' kJ');
    document.getElementById('heatResult').style.display = 'block';
}

function calculatePressure() {
    const f = parseFloat(document.getElementById('forceInput').value);
    const a = parseFloat(document.getElementById('areaInput').value);
    if (isNaN(f) || isNaN(a) || a === 0) {
        alert(currentLang === 'ar' ? 'الرجاء إدخال قيم صحيحة' : 'Please enter valid values');
        return;
    }
    const p = f / a;
    const kpa = (p / 1000).toFixed(3);
    const isAr = currentLang === 'ar';
    document.getElementById('pressureValue').textContent = p.toFixed(2) + (isAr ? ' باسكال' : ' Pa');
    document.getElementById('pressureKPA').textContent = kpa + (isAr ? ' كيلوباسكال' : ' kPa');
    document.getElementById('pressureResult').style.display = 'block';
}

function convertUnits() {
    const value = parseFloat(document.getElementById('unitValue').value);
    const from = document.getElementById('fromUnit').value;
    const to = document.getElementById('toUnit').value;
    if (isNaN(value)) {
        alert(currentLang === 'ar' ? 'الرجاء إدخال قيمة صحيحة' : 'Please enter a valid value');
        return;
    }
    const toMeter = { m: 1, cm: 0.01, mm: 0.001, km: 1000, inch: 0.0254, ft: 0.3048 };
    const result = (value * toMeter[from]) / toMeter[to];
    document.getElementById('unitResult').textContent = result.toFixed(6) + ' ' + to;
    document.getElementById('unitsResult').style.display = 'block';
}

// ===== نظام التذكيرات =====
let reminderFilter = 'all';

function getReminders() {
    return JSON.parse(localStorage.getItem('reminders') || '[]');
}

function saveReminders(reminders) {
    localStorage.setItem('reminders', JSON.stringify(reminders));
}

function addReminder() {
    const titleInput = document.getElementById('reminderTitle').value.trim();
    const dateInput = document.getElementById('reminderDate').value;
    const timeInput = document.getElementById('reminderTime').value;
    const priority = document.getElementById('reminderPriority').value;
    const type = document.getElementById('reminderType').value;

    // تحويل الأرقام العربية إلى إنجليزية
    const title = convertToEnglishNumbers(titleInput);
    const date = convertToEnglishNumbers(dateInput);
    const time = convertToEnglishNumbers(timeInput);

    if (!title || !date) {
        alert(currentLang === 'ar' ? '⚠️ الرجاء إدخال العنوان والتاريخ' : '⚠️ Please enter title and date');
        return;
    }

    const reminders = getReminders();
    reminders.push({
        id: Date.now(),
        title: title,
        date: date,
        time: time || '00:00',
        priority: priority,
        type: type,
        completed: false,
        createdAt: new Date().toISOString()
    });
    saveReminders(reminders);

    document.getElementById('reminderTitle').value = '';
    document.getElementById('reminderDate').value = '';
    document.getElementById('reminderTime').value = '';

    renderReminders();
    showNotification(currentLang === 'ar' ? '✅ تم إضافة التذكير!' : '✅ Reminder added!');

    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
}

function deleteReminder(id) {
    const isAr = currentLang === 'ar';
    if (!confirm(isAr ? 'حذف هذا التذكير؟' : 'Delete this reminder?')) return;
    let reminders = getReminders().filter(r => r.id !== id);
    saveReminders(reminders);
    renderReminders();
    showNotification(isAr ? '🗑️ تم الحذف' : '🗑️ Deleted');
}

function toggleComplete(id) {
    const reminders = getReminders();
    const reminder = reminders.find(r => r.id === id);
    if (reminder) {
        reminder.completed = !reminder.completed;
        saveReminders(reminders);
        renderReminders();
    }
}

function clearAllReminders() {
    const isAr = currentLang === 'ar';
    if (!confirm(isAr ? 'حذف جميع التذكيرات؟' : 'Delete all reminders?')) return;
    saveReminders([]);
    renderReminders();
}

function filterReminders(filter) {
    reminderFilter = filter;
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    if (event && event.currentTarget) event.currentTarget.classList.add('active');
    renderReminders();
}

function getTypeIcon(type) {
    return { exam: '📝', homework: '📚', project: '🔬', meeting: '👥', other: '📌' }[type] || '📌';
}

function getTypeName(type) {
    const isAr = currentLang === 'ar';
    const names = isAr ? {
        exam: 'امتحان', homework: 'واجب', project: 'مشروع', meeting: 'اجتماع', other: 'أخرى'
    } : {
        exam: 'Exam', homework: 'Homework', project: 'Project', meeting: 'Meeting', other: 'Other'
    };
    return names[type] || names.other;
}

function getPriorityInfo(priority) {
    const isAr = currentLang === 'ar';
    return {
        high: { label: isAr ? 'عالية' : 'High', color: '#e74c3c', icon: '🔴' },
        medium: { label: isAr ? 'متوسطة' : 'Medium', color: '#f39c12', icon: '🟡' },
        low: { label: isAr ? 'منخفضة' : 'Low', color: '#27ae60', icon: '🟢' }
    }[priority] || { label: isAr ? 'متوسطة' : 'Medium', color: '#f39c12', icon: '🟡' };
}

function formatDate(dateStr) {
    const isAr = currentLang === 'ar';
    return new Date(dateStr).toLocaleDateString(isAr ? 'ar-EG' : 'en-US', 
        { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' });
}

function getDaysLeft(dateStr) {
    const now = new Date(); now.setHours(0,0,0,0);
    const target = new Date(dateStr); target.setHours(0,0,0,0);
    return Math.ceil((target - now) / (1000 * 60 * 60 * 24));
}

function renderReminders() {
    const container = document.getElementById('remindersList');
    if (!container) return;

    let reminders = getReminders();
    const now = new Date();
    const isAr = currentLang === 'ar';

    reminders.sort((a, b) => new Date(a.date + 'T' + a.time) - new Date(b.date + 'T' + b.time));

    if (reminderFilter === 'upcoming') {
        reminders = reminders.filter(r => !r.completed && new Date(r.date + 'T' + r.time) >= now);
    } else if (reminderFilter === 'past') {
        reminders = reminders.filter(r => r.completed || new Date(r.date + 'T' + r.time) < now);
    }

    if (reminders.length === 0) {
        container.innerHTML = `
            <div class="empty-reminders">
                <div class="empty-icon">📭</div>
                <p>${isAr ? 'لا توجد تذكيرات بعد' : 'No reminders yet'}</p>
                <p class="empty-hint">${isAr ? 'أضف تذكيرك الأول ☝️' : 'Add your first reminder ☝️'}</p>
            </div>
        `;
        return;
    }

    container.innerHTML = reminders.map(r => {
        const priority = getPriorityInfo(r.priority);
        const daysLeft = getDaysLeft(r.date);
        const isPast = daysLeft < 0, isToday = daysLeft === 0, isTomorrow = daysLeft === 1;
        let timeLeftText = '', timeLeftClass = '';

        if (r.completed) { timeLeftText = isAr ? '✅ منجز' : '✅ Done'; timeLeftClass = 'completed'; }
        else if (isPast) { timeLeftText = isAr ? `⚠️ متأخر بـ ${Math.abs(daysLeft)} يوم` : `⚠️ ${Math.abs(daysLeft)} days late`; timeLeftClass = 'overdue'; }
        else if (isToday) { timeLeftText = isAr ? '🔥 اليوم!' : '🔥 Today!'; timeLeftClass = 'today'; }
        else if (isTomorrow) { timeLeftText = isAr ? '⏰ غداً' : '⏰ Tomorrow'; timeLeftClass = 'tomorrow'; }
        else { timeLeftText = isAr ? `📅 بعد ${daysLeft} يوم` : `📅 In ${daysLeft} days`; timeLeftClass = 'upcoming'; }

        return `
            <div class="reminder-item ${r.completed ? 'completed' : ''}" style="border-right-color: ${priority.color};">
                <button class="reminder-check ${r.completed ? 'checked' : ''}" onclick="toggleComplete(${r.id})">
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
                <button class="reminder-delete" onclick="deleteReminder(${r.id})">🗑️</button>
            </div>
        `;
    }).join('');
}

function showNotification(message) {
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

// ===== فحص التذكيرات القادمة =====
function checkUpcomingReminders() {
    const reminders = getReminders();
    const now = new Date();
    
    reminders.forEach(r => {
        if (r.completed) return;
        
        const reminderTime = new Date(r.date + 'T' + r.time);
        const diffMinutes = (reminderTime - now) / (1000 * 60);
        
        // إذا كان التذكير قادماً خلال 24 ساعة (1440 دقيقة)
        if (diffMinutes > -1 && diffMinutes <= 1440) {
            if ('Notification' in window && Notification.permission === 'granted') {
                try {
                    new Notification('⏰ Direction Team', { 
                        body: `${r.title} - ${r.time}`, 
                        icon: 'logo.png',
                        tag: 'reminder-' + r.id
                    });
                } catch (e) {}
            }
        }
    });
}

// ===== تفعيل الإشعارات =====
function requestNotificationPermission() {
    const btn = document.getElementById('enableNotifBtn');
    if (!('Notification' in window)) {
        showNotification(currentLang === 'ar' ? '⚠️ متصفحك لا يدعم الإشعارات' : '⚠️ Not supported');
        return;
    }
    if (Notification.permission === 'granted') {
        showNotification(currentLang === 'ar' ? '✅ الإشعارات مفعّلة مسبقاً' : '✅ Already enabled');
        updateNotifButton();
        return;
    }
    if (Notification.permission === 'denied') {
        showNotification(currentLang === 'ar' ? '❌ الإشعارات مرفوضة' : '❌ Notifications denied');
        updateNotifButton();
        return;
    }
    Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
            showNotification(currentLang === 'ar' ? '🎉 تم التفعيل بنجاح!' : '🎉 Enabled!');
            try {
                new Notification('⏰ Direction Team', {
                    body: currentLang === 'ar' ? 'ستصلك إشعارات التذكيرات هنا' : 'You will receive notifications here',
                    icon: 'logo.png'
                });
            } catch (e) {}
        } else {
            showNotification(currentLang === 'ar' ? '❌ لم يتم التفعيل' : '❌ Not enabled');
        }
        updateNotifButton();
    });
}

function updateNotifButton() {
    const btn = document.getElementById('enableNotifBtn');
    if (!btn) return;
    if (!('Notification' in window)) {
        btn.classList.add('denied');
        btn.innerHTML = '❌ <span>' + (currentLang === 'ar' ? 'غير مدعوم' : 'Not supported') + '</span>';
        btn.disabled = true;
        return;
    }
    if (Notification.permission === 'granted') {
        btn.classList.add('enabled');
        btn.innerHTML = '✅ <span>' + (currentLang === 'ar' ? 'الإشعارات مفعّلة' : 'Notifications enabled') + '</span>';
        btn.disabled = true;
    } else if (Notification.permission === 'denied') {
        btn.classList.add('denied');
        btn.innerHTML = '❌ <span>' + (currentLang === 'ar' ? 'الإشعارات مرفوضة' : 'Notifications denied') + '</span>';
    } else {
        btn.innerHTML = '🔔 <span>' + (currentLang === 'ar' ? 'تفعيل الإشعارات' : 'Enable Notifications') + '</span>';
    }
}

// ===== القاموس والرموز =====
function switchMainTab(event, tabId) {
    document.querySelectorAll('.dict-main-content').forEach(c => c.classList.remove('active'));
    document.querySelectorAll('.dict-main-tab').forEach(b => b.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    event.currentTarget.classList.add('active');
}

const engineeringSymbols = [
    { symbol: "V", name: "فولت", fullName: "Voltage", cat: "electric", desc: "وحدة قياس الجهد" },
    { symbol: "A", name: "أمبير", fullName: "Ampere", cat: "electric", desc: "وحدة قياس التيار" },
    { symbol: "Ω", name: "أوم", fullName: "Ohm", cat: "electric", desc: "وحدة قياس المقاومة" },
    { symbol: "W", name: "واط", fullName: "Watt", cat: "electric", desc: "وحدة قياس القدرة" },
    { symbol: "F", name: "فاراد", fullName: "Farad", cat: "electric", desc: "وحدة قياس السعة" },
    { symbol: "H", name: "هنري", fullName: "Henry", cat: "electric", desc: "وحدة قياس الحث" },
    { symbol: "Hz", name: "هرتز", fullName: "Hertz", cat: "electric", desc: "وحدة قياس التردد" },
    { symbol: "N", name: "نيوتن", fullName: "Newton", cat: "mechanical", desc: "وحدة قياس القوة" },
    { symbol: "J", name: "جول", fullName: "Joule", cat: "mechanical", desc: "وحدة قياس الطاقة" },
    { symbol: "Pa", name: "باسكال", fullName: "Pascal", cat: "mechanical", desc: "وحدة قياس الضغط" },
    { symbol: "kg", name: "كيلوغرام", fullName: "Kilogram", cat: "mechanical", desc: "وحدة قياس الكتلة" },
    { symbol: "τ", name: "تاو", fullName: "Tau", cat: "mechanical", desc: "الإجهاد القصي" },
    { symbol: "σ", name: "سيغما", fullName: "Sigma", cat: "mechanical", desc: "الإجهاد العمودي" },
    { symbol: "ε", name: "إبسيلون", fullName: "Epsilon", cat: "mechanical", desc: "الانفعال" },
    { symbol: "{ }", name: "أقواس معقوفة", fullName: "Curly Braces", cat: "programming", desc: "الكتل البرمجية" },
    { symbol: "( )", name: "أقواس", fullName: "Parentheses", cat: "programming", desc: "الدوال والتجميع" },
    { symbol: "==", name: "مساواة", fullName: "Equality", cat: "programming", desc: "مقارنة قيمتين" },
    { symbol: "&&", name: "و المنطقية", fullName: "Logical AND", cat: "programming", desc: "الشرطان صحيحان" },
    { symbol: "||", name: "أو المنطقية", fullName: "Logical OR", cat: "programming", desc: "أحد الشرطين صحيح" },
    { symbol: "∑", name: "سيغما كبيرة", fullName: "Summation", cat: "math", desc: "رمز المجموع" },
    { symbol: "∫", name: "تكامل", fullName: "Integral", cat: "math", desc: "رمز التكامل" },
    { symbol: "∞", name: "ما لا نهاية", fullName: "Infinity", cat: "math", desc: "رمز اللانهاية" },
    { symbol: "√", name: "جذر", fullName: "Square Root", cat: "math", desc: "الجذر التربيعي" },
    { symbol: "θ", name: "ثيتا", fullName: "Theta", cat: "math", desc: "رمز الزاوية" },
    { symbol: "π", name: "باي", fullName: "Pi", cat: "math", desc: "= 3.14159" },
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
    const isAr = currentLang === 'ar';
    const names = isAr ? {
        electric: '⚡ كهربائية', mechanical: '🔧 ميكانيكية', civil: '🏗️ مدنية',
        programming: '💻 برمجية', math: '📐 رياضية'
    } : {
        electric: '⚡ Electrical', mechanical: '🔧 Mechanical', civil: '🏗️ Civil',
        programming: '💻 Programming', math: '📐 Math'
    };
    return names[cat] || cat;
}

function searchSymbols() {
    const query = document.getElementById('symbolSearch').value.toLowerCase().trim();
    let filtered = engineeringSymbols;
    if (currentSymbolCategory !== 'all') filtered = filtered.filter(s => s.cat === currentSymbolCategory);
    if (query) {
        filtered = filtered.filter(s =>
            s.name.toLowerCase().includes(query) || s.fullName.toLowerCase().includes(query) ||
            s.symbol.toLowerCase().includes(query) || s.desc.toLowerCase().includes(query)
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

// ===== نموذج الاقتراحات =====
function confirmSubmit() {
    const subject = document.querySelector('input[name="الموضوع"]');
    const details = document.querySelector('textarea[name="التفاصيل"]');
    if (!subject || !details) return true;
    if (!subject.value.trim() || !details.value.trim()) {
        alert(currentLang === 'ar' ? '⚠️ أكمل الحقول المطلوبة' : '⚠️ Fill required fields');
        return false;
    }
    return confirm(currentLang === 'ar' ? '📤 إرسال الرسالة؟' : '📤 Send message?');
}

// ===== قائمة الجوال =====
function toggleMenu() {
    const navLinks = document.getElementById('navLinks');
    const overlay = document.getElementById('navOverlay');
    if (navLinks) navLinks.classList.toggle('open');
    if (overlay) overlay.classList.toggle('show');
}

document.addEventListener('click', function(e) {
    if (e.target.closest('.nav-links a') || e.target.id === 'navOverlay') {
        const navLinks = document.getElementById('navLinks');
        const overlay = document.getElementById('navOverlay');
        if (navLinks) navLinks.classList.remove('open');
        if (overlay) overlay.classList.remove('show');
    }
});

// ============================================
// تشغيل عند التحميل
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    if (localStorage.getItem('siteLanguage') === 'en') {
        applyLanguage();
    }
    const firstYear = document.querySelector('.tab-content.active .year-card') || document.querySelector('.year-card');
    if (firstYear) firstYear.classList.add('active');
    applySavedTheme();
    showRealLastUpdate();
    if (document.getElementById('favoritesList')) displayFavorites();
    if (document.getElementById('renewable') || document.getElementById('mechanical')) {
        setTimeout(() => {
            addShareButtons();
            addFavoriteButtons();
        }, 100);
    }
    if (document.getElementById('remindersList')) {
        renderReminders();
        const dateInput = document.getElementById('reminderDate');
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.value = today;
        }
        if (document.getElementById('enableNotifBtn')) updateNotifButton();
        checkUpcomingReminders();
        // فحص كل 30 ثانية
        setInterval(checkUpcomingReminders, 30 * 1000);
    }
    if (document.getElementById('symbolList')) {
        renderSymbols(engineeringSymbols);
    }
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
function toggleMenu() {
    const navLinks = document.getElementById('navLinks');
    const overlay = document.getElementById('navOverlay');
    
    if (navLinks) {
        // على الجوال: نستخدم open
        // على اللابتوب: نستخدم expanded
        if (window.innerWidth > 768) {
            navLinks.classList.toggle('expanded');
        } else {
            navLinks.classList.toggle('open');
        }
    }
    if (overlay) overlay.classList.toggle('show');
}

// إغلاق القائمة عند الضغط على رابط أو overlay
document.addEventListener('click', function(e) {
    if (e.target.closest('.nav-links a') || e.target.id === 'navOverlay') {
        const navLinks = document.getElementById('navLinks');
        const overlay = document.getElementById('navOverlay');
        
        if (navLinks) {
            navLinks.classList.remove('open');
            navLinks.classList.remove('expanded');
        }
        if (overlay) overlay.classList.remove('show');
    }
});
