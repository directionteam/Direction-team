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
    const inputEl = document.getElementById('searchInput');
    if (!inputEl) return;
    const input = inputEl.value.toLowerCase().trim();
    const activeTab = document.querySelector('.tab-content.active');
    if (!activeTab) return;

    activeTab.querySelectorAll('.year-card').forEach(c => {
        c.style.display = '';
        c.classList.remove('active');
    });
    activeTab.querySelectorAll('.year-content').forEach(s => s.style.display = '');
    activeTab.querySelectorAll('.year-content li').forEach(li => li.style.display = '');

    if (input === '') {
        const firstYear = activeTab.querySelector('.year-card');
        if (firstYear) firstYear.classList.add('active');
        return;
    }

    activeTab.querySelectorAll('.year-card').forEach(c => c.classList.add('active'));

    activeTab.querySelectorAll('.year-content li').forEach(li => {
        const link = li.querySelector('a');
        const arText = (link?.getAttribute('data-ar-text') || '').toLowerCase();
        const enText = (materialTranslations[link?.getAttribute('data-ar-text')] || '').toLowerCase();
        const visibleText = li.textContent.toLowerCase().trim();
        const match = arText.includes(input) || enText.includes(input) || visibleText.includes(input);
        li.style.display = match ? '' : 'none';
    });

    activeTab.querySelectorAll('.year-card').forEach(card => {
        const hasVisible = Array.from(card.querySelectorAll('.year-content li'))
                                .some(li => li.style.display !== 'none');
        card.style.display = hasVisible ? '' : 'none';
    });
}

function resetSearch() {
    document.querySelectorAll('.year-card').forEach(c => {
        c.style.display = '';
        c.classList.remove('active');
    });
    document.querySelectorAll('.year-content').forEach(s => s.style.display = '');
    document.querySelectorAll('.year-content li').forEach(li => li.style.display = '');
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

// ===== قائمة الجوال واللابتوب =====
function toggleMenu() {
    const navLinks = document.getElementById('navLinks');
    const overlay = document.getElementById('navOverlay');
    
    if (!navLinks) return;
    
    if (window.innerWidth > 768) {
        // اللابتوب
        navLinks.classList.toggle('expanded');
    } else {
        // الجوال
        navLinks.classList.toggle('open');
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

// ===== نظام اللغة =====
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

// ===== ترجمات الواجهة =====
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
     // إعادة رسم القاموس والرموز عند تبديل اللغة
    if (document.getElementById('dictList')) searchTerms();
    if (document.getElementById('symbolList')) renderSymbols(engineeringSymbols);
}

// ===== الحاسبة الهندسية =====
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

function checkUpcomingReminders() {
    const reminders = getReminders();
    const now = new Date();
    reminders.forEach(r => {
        if (r.completed) return;
        const reminderTime = new Date(r.date + 'T' + r.time);
        const diffMinutes = (reminderTime - now) / (1000 * 60);
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

// ===== بيانات قاموس المصطلحات =====
const engineeringTerms = [
    // ===== ميكانيكا (Mechanics) =====
    { ar: "ميكانيكا", en: "Mechanics", cat: "mechanics", desc: "فرع من الفيزياء يدرس حركة الأجسام والقوى المؤثرة عليها" },
    { ar: "قوة", en: "Force", cat: "mechanics", desc: "مؤثر خارجي يغير حالة الجسم الحركية. وحدتها: نيوتن (N)" },
    { ar: "كتلة", en: "Mass", cat: "mechanics", desc: "مقدار المادة في الجسم. وحدتها: كيلوغرام (kg)" },
    { ar: "وزن", en: "Weight", cat: "mechanics", desc: "قوة جذب الأرض للجسم = الكتلة × الجاذبية (W = mg)" },
    { ar: "سرعة", en: "Velocity", cat: "mechanics", desc: "معدل تغير الإزاحة مع الزمن. وحدتها: م/ث" },
    { ar: "تسارع", en: "Acceleration", cat: "mechanics", desc: "معدل تغير السرعة مع الزمن. وحدتها: م/ث²" },
    { ar: "عزم", en: "Torque", cat: "mechanics", desc: "قدرة القوة على إحداث دوران. = القوة × الذراع" },
    { ar: "زخم", en: "Momentum", cat: "mechanics", desc: "حاصل ضرب الكتلة في السرعة. = كتلة × سرعة" },
    { ar: "احتكاك", en: "Friction", cat: "mechanics", desc: "قوة تعارض الحركة بين سطحين متلامسين" },
    { ar: "اتزان", en: "Equilibrium", cat: "mechanics", desc: "حالة يكون فيها مجموع القوى المؤثرة على جسم = صفر" },
    { ar: "إزاحة", en: "Displacement", cat: "mechanics", desc: "المسافة مع الاتجاه. وحدتها: متر (m)" },
    { ar: "إجهاد القص", en: "Shear Stress", cat: "mechanics", desc: "قوة موازية للسطح مقسومة على مساحة المقطع" },
    { ar: "قوة الطرد المركزي", en: "Centrifugal Force", cat: "mechanics", desc: "قوة ظاهرية تبدو وكأنها تدفع الجسم بعيداً عن المركز" },
    { ar: "قوة الجذب المركزي", en: "Centripetal Force", cat: "mechanics", desc: "قوة تجعل الجسم يتحرك في مسار دائري" },
    { ar: "قانون نيوتن الأول", en: "Newton's First Law", cat: "mechanics", desc: "الجسم الساكن يبقى ساكناً، والمتحرك يبقى متحركاً بنفس السرعة ما لم تؤثر عليه قوة" },
    { ar: "قانون نيوتن الثاني", en: "Newton's Second Law", cat: "mechanics", desc: "F = ma (القوة = الكتلة × التسارع)" },
    { ar: "قانون نيوتن الثالث", en: "Newton's Third Law", cat: "mechanics", desc: "لكل فعل رد فعل مساوٍ له في المقدار ومعاكس في الاتجاه" },
    { ar: "طاقة حركية", en: "Kinetic Energy", cat: "mechanics", desc: "الطاقة الناتجة عن حركة الجسم = ½mv²" },
    { ar: "طاقة كامنة", en: "Potential Energy", cat: "mechanics", desc: "الطاقة المخزنة نتيجة الوضع = mgh" },
    { ar: "شغل", en: "Work", cat: "mechanics", desc: "القوة × المسافة في اتجاه القوة. وحدتها: جول (J)" },
    { ar: "قدرة ميكانيكية", en: "Mechanical Power", cat: "mechanics", desc: "معدل بذل الشغل. وحدتها: واط (W)" },
    { ar: "دفع", en: "Impulse", cat: "mechanics", desc: "القوة × الزمن. يساوي التغير في الزخم" },
    { ar: "تردد طبيعي", en: "Natural Frequency", cat: "mechanics", desc: "التردد الذي يهتز به الجسم بحرية بدون قوة خارجية" },
    { ar: "رنين", en: "Resonance", cat: "mechanics", desc: "اهتزاز الجسم بأقصى سعة عندما يكون التردد الخارجي مساوياً للتردد الطبيعي" },

    // ===== حراريات (Thermodynamics) =====
    { ar: "حرارة", en: "Heat", cat: "thermo", desc: "شكل من أشكال الطاقة ينتقل من الجسم الساخن للبارد" },
    { ar: "درجة حرارة", en: "Temperature", cat: "thermo", desc: "مقياس لمتوسط الطاقة الحركية للجزيئات" },
    { ar: "إنتروبيا", en: "Entropy", cat: "thermo", desc: "مقياس لدرجة العشوائية أو الفوضى في النظام" },
    { ar: "إنثالبي", en: "Enthalpy", cat: "thermo", desc: "مجموع الطاقة الداخلية + حاصل ضرب الضغط في الحجم" },
    { ar: "قانون بويل", en: "Boyle's Law", cat: "thermo", desc: "الضغط × الحجم = ثابت عند درجة حرارة ثابتة" },
    { ar: "قانون تشارلز", en: "Charles's Law", cat: "thermo", desc: "حجم الغاز يتناسب طردياً مع درجة الحرارة عند ضغط ثابت" },
    { ar: "قانون جاي-لوساك", en: "Gay-Lussac's Law", cat: "thermo", desc: "الضغط يتناسب طردياً مع درجة الحرارة عند حجم ثابت" },
    { ar: "دورة كارنو", en: "Carnot Cycle", cat: "thermo", desc: "أعلى كفاءة نظرية لمحرك حراري بين درجتي حرارة" },
    { ar: "دورة رانكين", en: "Rankine Cycle", cat: "thermo", desc: "الدورة الأساسية لمحطات الطاقة البخارية" },
    { ar: "دورة برايتون", en: "Brayton Cycle", cat: "thermo", desc: "الدورة الأساسية لتوربينات الغاز" },
    { ar: "دورة أوتو", en: "Otto Cycle", cat: "thermo", desc: "الدورة المثالية لمحركات البنزين" },
    { ar: "دورة ديزل", en: "Diesel Cycle", cat: "thermo", desc: "الدورة المثالية لمحركات الديزل" },
    { ar: "انتقال الحرارة", en: "Heat Transfer", cat: "thermo", desc: "انتقال الطاقة الحرارية: توصيل، حمل، إشعاع" },
    { ar: "توصيل حراري", en: "Conduction", cat: "thermo", desc: "انتقال الحرارة عبر مادة صلبة دون حركة المادة" },
    { ar: "حمل حراري", en: "Convection", cat: "thermo", desc: "انتقال الحرارة عبر حركة المائع" },
    { ar: "إشعاع حراري", en: "Radiation", cat: "thermo", desc: "انتقال الحرارة عبر الموجات الكهرومغناطيسية" },
    { ar: "قانون ستيفان-بولتزمان", en: "Stefan-Boltzmann Law", cat: "thermo", desc: "الطاقة المشعة تتناسب مع القوة الرابعة لدرجة الحرارة" },
    { ar: "الطاقة الداخلية", en: "Internal Energy", cat: "thermo", desc: "مجموع الطاقات الحركية والكامنة للجزيئات" },
    { ar: "قانون الديناميكا الأول", en: "First Law of Thermodynamics", cat: "thermo", desc: "الطاقة لا تفنى ولا تستحدث، ΔU = Q - W" },
    { ar: "قانون الديناميكا الثاني", en: "Second Law of Thermodynamics", cat: "thermo", desc: "الإنتروبيا في نظام معزول لا تقل أبداً" },
    { ar: "الغاز المثالي", en: "Ideal Gas", cat: "thermo", desc: "غاز يتبع قانون PV = nRT" },
    { ar: "ثابت الغازات", en: "Gas Constant", cat: "thermo", desc: "R = 8.314 J/mol·K" },
    { ar: "انتقال الحرارة بالإشعاع", en: "Thermal Radiation", cat: "thermo", desc: "انتقال الحرارة دون وسط مادي" },

    // ===== موائع (Fluid Mechanics) =====
    { ar: "لزوجة", en: "Viscosity", cat: "fluids", desc: "مقاومة المائع للتدفق. وحدتها: Pa·s" },
    { ar: "ضغط", en: "Pressure", cat: "fluids", desc: "القوة المؤثرة على وحدة المساحة. وحدتها: باسكال (Pa)" },
    { ar: "كثافة", en: "Density", cat: "fluids", desc: "الكتلة في وحدة الحجم. وحدتها: kg/m³" },
    { ar: "تدفق", en: "Flow", cat: "fluids", desc: "حركة المائع في نظام. يقاس بـ: m³/s" },
    { ar: "مبدأ برنولي", en: "Bernoulli's Principle", cat: "fluids", desc: "زيادة سرعة المائع تقلل ضغطه" },
    { ar: "معادلة الاستمرارية", en: "Continuity Equation", cat: "fluids", desc: "A₁V₁ = A₂V₂ (معدل التدفق ثابت)" },
    { ar: "رقم رينولدز", en: "Reynolds Number", cat: "fluids", desc: "مقياس لطبيعة التدفق: صفحي أو مضطرب" },
    { ar: "قانون باسكال", en: "Pascal's Law", cat: "fluids", desc: "الضغط المطبق على سائل محصور ينتقل بالتساوي" },
    { ar: "ديناميكا الموائع", en: "Fluid Dynamics", cat: "fluids", desc: "دراسة حركة الموائع والقوى المؤثرة فيها" },
    { ar: "إستاتيكا الموائع", en: "Fluid Statics", cat: "fluids", desc: "دراسة الموائع في حالة السكون" },
    { ar: "تدفق صفحي", en: "Laminar Flow", cat: "fluids", desc: "تدفق منتظم في طبقات متوازية" },
    { ar: "تدفق مضطرب", en: "Turbulent Flow", cat: "fluids", desc: "تدفق غير منتظم مع دوامات واهتزازات" },
    { ar: "معامل الاحتكاك", en: "Friction Factor", cat: "fluids", desc: "معامل يحسب فقدان الطاقة في الأنابيب" },
    { ar: "فقدان الرأس", en: "Head Loss", cat: "fluids", desc: "فقدان الضغط بسبب الاحتكاك في الأنابيب" },
    { ar: "مضخة", en: "Pump", cat: "fluids", desc: "جهاز يزيد ضغط المائع لنقله من مكان لآخر" },
    { ar: "توربين", en: "Turbine", cat: "fluids", desc: "جهاز يحول طاقة المائع لطاقة ميكانيكية دوارة" },
    { ar: "مقياس ضغط", en: "Manometer", cat: "fluids", desc: "جهاز لقياس فرق الضغط" },
    { ar: "طفو", en: "Buoyancy", cat: "fluids", desc: "قوة دفع المائع للأجسام المغمورة فيه" },
    { ar: "قانون أرخميدس", en: "Archimedes' Principle", cat: "fluids", desc: "قوة الطفو = وزن المائع المُزاح" },

    // ===== مواد (Materials Science) =====
    { ar: "إجهاد", en: "Stress", cat: "materials", desc: "القوة الداخلية على وحدة المساحة. وحدتها: Pa" },
    { ar: "انفعال", en: "Strain", cat: "materials", desc: "التغير النسبي في الطول. = ΔL / L" },
    { ar: "معامل يونغ", en: "Young's Modulus", cat: "materials", desc: "نسبة الإجهاد إلى الانفعال. مقياس الصلابة" },
    { ar: "معامل القص", en: "Shear Modulus", cat: "materials", desc: "نسبة إجهاد القص إلى انفعال القص" },
    { ar: "نسبة بواسون", en: "Poisson's Ratio", cat: "materials", desc: "نسبة الانفعال الجانبي للانفعال الطولي" },
    { ar: "صلابة", en: "Hardness", cat: "materials", desc: "مقاومة المادة للخدش أو التشكيل" },
    { ar: "مطيلية", en: "Ductility", cat: "materials", desc: "قدرة المادة على التشكيل دون كسر" },
    { ar: "هشاشة", en: "Brittleness", cat: "materials", desc: "خاصية المادة التي تتكسر بسرعة دون تشكيل" },
    { ar: "مقاومة الشد", en: "Tensile Strength", cat: "materials", desc: "أقصى إجهاد يتحمله الجسم قبل الكسر" },
    { ar: "مقاومة الخضوع", en: "Yield Strength", cat: "materials", desc: "الإجهاد الذي عنده تبدأ المادة بالتشكل الدائم" },
    { ar: "قص", en: "Shear", cat: "materials", desc: "إجهاد يسبب انزلاق الطبقات" },
    { ar: "انحناء", en: "Bending", cat: "materials", desc: "تشوه الجسم بسبب قوى عمودية على محوره" },
    { ar: "التواء", en: "Torsion", cat: "materials", desc: "التفاف الجسم حول محوره بسبب عزم دوران" },
    { ar: "زحف", en: "Creep", cat: "materials", desc: "تشوه بطيء للمادة تحت إجهاد ثابت مع الزمن" },
    { ar: "كسر", en: "Fracture", cat: "materials", desc: "انفصال المادة إلى جزئين عند تجاوز مقاومتها" },
    { ar: "تعب", en: "Fatigue", cat: "materials", desc: "ضعف المادة بسبب أحمال متكررة" },
    { ar: "سبيكة", en: "Alloy", cat: "materials", desc: "مادة معدنية مكونة من خلط معدنين أو أكثر" },
    { ar: "فولاذ", en: "Steel", cat: "materials", desc: "سبيكة من الحديد والكربون" },
    { ar: "حديد زهر", en: "Cast Iron", cat: "materials", desc: "سبيكة حديدية بنسبة كربون عالية" },
    { ar: "ألومنيوم", en: "Aluminum", cat: "materials", desc: "معدن خفيف الوزن ومقاوم للتآكل" },
    { ar: "بوليمر", en: "Polymer", cat: "materials", desc: "مادة مكونة من جزيئات كبيرة متكررة" },
    { ar: "خزف", en: "Ceramic", cat: "materials", desc: "مادة صلبة وهشة مقاومة للحرارة" },
    { ar: "مركب", en: "Composite", cat: "materials", desc: "مادة مكونة من مادتين مختلفتين أو أكثر" },

    // ===== كهرباء (Electrical) =====
    { ar: "جهد", en: "Voltage", cat: "electric", desc: "فرق الجهد الكهربائي. وحدته: فولت (V)" },
    { ar: "تيار", en: "Current", cat: "electric", desc: "معدل تدفق الشحنة. وحدته: أمبير (A)" },
    { ar: "مقاومة", en: "Resistance", cat: "electric", desc: "معارضة المادة لمرور التيار. وحدتها: أوم (Ω)" },
    { ar: "قدرة", en: "Power", cat: "electric", desc: "معدل استهلاك الطاقة. وحدتها: واط (W)" },
    { ar: "قانون أوم", en: "Ohm's Law", cat: "electric", desc: "V = I × R" },
    { ar: "قانون كيرشوف للتيار", en: "Kirchhoff's Current Law", cat: "electric", desc: "مجموع التيارات الداخلة = الخارجة" },
    { ar: "قانون كيرشوف للجهد", en: "Kirchhoff's Voltage Law", cat: "electric", desc: "مجموع الجهود في حلقة مغلقة = صفر" },
    { ar: "دائرة كهربائية", en: "Electric Circuit", cat: "electric", desc: "مسار مغلق يمر فيه التيار الكهربائي" },
    { ar: "دائرة توازي", en: "Parallel Circuit", cat: "electric", desc: "دائرة ترتبط فيها المكونات على التوازي" },
    { ar: "دائرة توالي", en: "Series Circuit", cat: "electric", desc: "دائرة ترتبط فيها المكونات على التوالي" },
    { ar: "مكثف", en: "Capacitor", cat: "electric", desc: "مكون يخزن الشحنة الكهربائية. وحدته: فاراد (F)" },
    { ar: "محث", en: "Inductor", cat: "electric", desc: "مكون يخزن الطاقة في مجال مغناطيسي. وحدته: هنري (H)" },
    { ar: "مقاومة كهربائية", en: "Resistor", cat: "electric", desc: "مكون يعارض مرور التيار" },
    { ar: "ديود", en: "Diode", cat: "electric", desc: "مكون يسمح للتيار بالمرور في اتجاه واحد" },
    { ar: "ترانزستور", en: "Transistor", cat: "electric", desc: "مكون يستخدم للتضخيم أو كمفتاح إلكتروني" },
    { ar: "تيار متردد", en: "AC", cat: "electric", desc: "تيار يغير اتجاهه دورياً" },
    { ar: "تيار مستمر", en: "DC", cat: "electric", desc: "تيار يسير في اتجاه واحد" },
    { ar: "تردد", en: "Frequency", cat: "electric", desc: "عدد الدورات في الثانية. وحدته: هرتز (Hz)" },
    { ar: "محول كهربائي", en: "Transformer", cat: "electric", desc: "جهاز يغير جهد التيار المتردد" },
    { ar: "محرك كهربائي", en: "Electric Motor", cat: "electric", desc: "جهاز يحول الطاقة الكهربائية لحركية" },
    { ar: "مولد كهربائي", en: "Generator", cat: "electric", desc: "جهاز يحول الطاقة الحركية لكهربائية" },

    // ===== طاقة (Energy) =====
    { ar: "طاقة متجددة", en: "Renewable Energy", cat: "energy", desc: "طاقة من مصادر لا تنضب: شمس، رياح، ماء" },
    { ar: "طاقة شمسية", en: "Solar Energy", cat: "energy", desc: "الطاقة المستمدة من أشعة الشمس" },
    { ar: "خلايا كهروضوئية", en: "PV Cells", cat: "energy", desc: "تحول الطاقة الشمسية لكهرباء مباشرة" },
    { ar: "الخلايا الشمسية", en: "Solar Cells", cat: "energy", desc: "ألواح تحول ضوء الشمس إلى كهرباء" },
    { ar: "الطاقة الشمسية المركزة", en: "Concentrated Solar Power", cat: "energy", desc: "تركيز أشعة الشمس لتوليد الحرارة" },
    { ar: "طاقة الرياح", en: "Wind Energy", cat: "energy", desc: "الطاقة من حركة الرياح بواسطة توربينات" },
    { ar: "توربين رياح", en: "Wind Turbine", cat: "energy", desc: "جهاز يحول طاقة الرياح لكهرباء" },
    { ar: "طاقة حرارية أرضية", en: "Geothermal Energy", cat: "energy", desc: "الطاقة من حرارة باطن الأرض" },
    { ar: "كتلة حيوية", en: "Biomass", cat: "energy", desc: "طاقة من مواد عضوية (نبات، خشب، نفايات)" },
    { ar: "طاقة حيوية", en: "Bioenergy", cat: "energy", desc: "الطاقة المستخرجة من الكتلة الحيوية" },
    { ar: "خلايا الوقود", en: "Fuel Cells", cat: "energy", desc: "تحول الطاقة الكيميائية لكهرباء" },
    { ar: "الهيدروجين الأخضر", en: "Green Hydrogen", cat: "energy", desc: "هيدروجين يُنتج من مصادر متجددة" },
    { ar: "كفاءة الطاقة", en: "Energy Efficiency", cat: "energy", desc: "نسبة الطاقة المفيدة للمنتجة" },
    { ar: "تخزين الطاقة", en: "Energy Storage", cat: "energy", desc: "تقنيات لتخزين الطاقة لاستخدامها لاحقاً" },
    { ar: "بطارية", en: "Battery", cat: "energy", desc: "جهاز يخزن الطاقة الكيميائية ويحولها لكهربائية" },
    { ar: "شبكة ذكية", en: "Smart Grid", cat: "energy", desc: "شبكة كهربائية تستخدم تقنيات رقمية" },
    { ar: "محطة طاقة", en: "Power Plant", cat: "energy", desc: "منشأة لتوليد الكهرباء" },
    { ar: "محطة بخارية", en: "Steam Power Plant", cat: "energy", desc: "محطة توليد تعمل بالبخار" },
    { ar: "محطة غازية", en: "Gas Power Plant", cat: "energy", desc: "محطة توليد تعمل بالغاز الطبيعي" },
    { ar: "الطاقة الكهرومائية", en: "Hydropower", cat: "energy", desc: "توليد الكهرباء من حركة الماء" },
    { ar: "الطاقة النووية", en: "Nuclear Energy", cat: "energy", desc: "الطاقة من الانشطار أو الاندماج النووي" },
    { ar: "تحويل الطاقة", en: "Energy Conversion", cat: "energy", desc: "تحويل الطاقة من شكل لآخر" },
    { ar: "قانون حفظ الطاقة", en: "Conservation of Energy", cat: "energy", desc: "الطاقة لا تفنى ولا تستحدث" },

    // ===== رياضيات (Mathematics) =====
    { ar: "اشتقاق", en: "Derivative", cat: "math", desc: "معدل تغير دالة بالنسبة لمتغير. dy/dx" },
    { ar: "تكامل", en: "Integral", cat: "math", desc: "عكس الاشتقاق. يحسب المساحة تحت المنحنى" },
    { ar: "نهاية", en: "Limit", cat: "math", desc: "القيمة التي تقترب منها الدالة عند نقطة" },
    { ar: "استمرارية", en: "Continuity", cat: "math", desc: "خاصية الدالة التي لا تحدث فيها قفزات" },
    { ar: "مصفوفة", en: "Matrix", cat: "math", desc: "ترتيب مستطيل للأرقام في صفوف وأعمدة" },
    { ar: "محدد", en: "Determinant", cat: "math", desc: "قيمة عددية تُحسب من عناصر المصفوفة المربعة" },
    { ar: "متجه", en: "Vector", cat: "math", desc: "كمية لها مقدار واتجاه" },
    { ar: "ضرب نقطي", en: "Dot Product", cat: "math", desc: "حاصل ضرب متجهين ينتج عدداً قياسياً" },
    { ar: "ضرب اتجاهي", en: "Cross Product", cat: "math", desc: "حاصل ضرب متجهين ينتج متجهاً عمودياً" },
    { ar: "مشتقة جزئية", en: "Partial Derivative", cat: "math", desc: "اشتقاق دالة متعددة المتغيرات" },
    { ar: "معادلة تفاضلية", en: "Differential Equation", cat: "math", desc: "معادلة تحتوي على مشتقات دالة" },
    { ar: "تحويل لابلاس", en: "Laplace Transform", cat: "math", desc: "تحويل يساعد على حل المعادلات التفاضلية" },
    { ar: "تحويل فورييه", en: "Fourier Transform", cat: "math", desc: "تحويل يفكك الدوال إلى موجات جيبية" },
    { ar: "سلسلة تايلور", en: "Taylor Series", cat: "math", desc: "تقريب دالة بواسطة متسلسلة لا نهائية" },
    { ar: "سلسلة ماكلورين", en: "Maclaurin Series", cat: "math", desc: "حالة خاصة من سلسلة تايلور حول الصفر" },
    { ar: "متسلسلة فورييه", en: "Fourier Series", cat: "math", desc: "تمثيل الدوال الدورية بمجموع من الدوال المثلثية" },
    { ar: "إحصاء", en: "Statistics", cat: "math", desc: "علم جمع وتحليل وتفسير البيانات" },
    { ar: "احتمال", en: "Probability", cat: "math", desc: "مقياس لإمكانية وقوع حدث ما" },
    { ar: "توزيع طبيعي", en: "Normal Distribution", cat: "math", desc: "توزيع احتمالي على شكل جرس" },
    { ar: "انحدار خطي", en: "Linear Regression", cat: "math", desc: "طريقة لإيجاد أفضل خط يمر عبر البيانات" }
    ,

    // ===== إنتاج وتصنيع (Manufacturing) =====
    { ar: "عمليات الإنتاج", en: "Manufacturing Processes", cat: "manufacturing", desc: "العمليات المستخدمة لتحويل المواد الخام لمنتجات" },
    { ar: "خراطة", en: "Turning", cat: "manufacturing", desc: "عملية إنتاج تستخدم مخرطة لتشكيل المعادن" },
    { ar: "تفريز", en: "Milling", cat: "manufacturing", desc: "عملية قطع باستخدام أداة دوارة متعددة الأسنان" },
    { ar: "ثقب", en: "Drilling", cat: "manufacturing", desc: "عملية إنشاء ثقوب في المواد الصلبة" },
    { ar: "تجليخ", en: "Grinding", cat: "manufacturing", desc: "عملية تشطيب سطحي بدقة عالية" },
    { ar: "لحام", en: "Welding", cat: "manufacturing", desc: "ربط المعادن بالحرارة أو الضغط" },
    { ar: "سباكة", en: "Casting", cat: "manufacturing", desc: "صب المعدن المنصهر في قالب للتشكيل" },
    { ar: "طرق", en: "Forging", cat: "manufacturing", desc: "تشكيل المعدن بالطرق أو الضغط" },
    { ar: "بثق", en: "Extrusion", cat: "manufacturing", desc: "دفع المعدن عبر قالب لتشكيله" },
    { ar: "درفلة", en: "Rolling", cat: "manufacturing", desc: "تمرير المعدن بين بكرات لتقليل سماكته" },
    { ar: "سحب", en: "Drawing", cat: "manufacturing", desc: "سحب المعدن عبر قالب لتقليل قطره" },
    { ar: "قياس دقيق", en: "Precision Measurement", cat: "manufacturing", desc: "قياس بأدوات دقيقة مثل الميكرومتر" },
    { ar: "تحكم رقمي", en: "CNC", cat: "manufacturing", desc: "التحكم الرقمي بالحاسوب في آلات التصنيع" },
    { ar: "طباعة ثلاثية الأبعاد", en: "3D Printing", cat: "manufacturing", desc: "تصنيع الأجسام طبقة فوق طبقة" },
    { ar: "مراقبة الجودة", en: "Quality Control", cat: "manufacturing", desc: "عمليات لضمان جودة المنتجات" },

    // ===== ميكاترونكس وتحكم (Mechatronics & Control) =====
    { ar: "أنظمة التحكم", en: "Control Systems", cat: "control", desc: "أنظمة تتحكم في سلوك الأنظمة الديناميكية" },
    { ar: "حلقة مفتوحة", en: "Open Loop", cat: "control", desc: "نظام تحكم بدون تغذية راجعة" },
    { ar: "حلقة مغلقة", en: "Closed Loop", cat: "control", desc: "نظام تحكم مع تغذية راجعة" },
    { ar: "تغذية راجعة", en: "Feedback", cat: "control", desc: "إعادة جزء من الإخراج للمدخل لتحسين الأداء" },
    { ar: "متحكم PID", en: "PID Controller", cat: "control", desc: "متحكم يستخدم التناسب والتكامل والاشتقاق" },
    { ar: "استقرار النظام", en: "System Stability", cat: "control", desc: "قدرة النظام على العودة لحالة التوازن" },
    { ar: "دالة التحويل", en: "Transfer Function", cat: "control", desc: "نسبة الخرج للدخل في نطاق لابلاس" },
    { ar: "استجابة النظام", en: "System Response", cat: "control", desc: "سلوك النظام مع الزمن عند تغير المدخل" },
    { ar: "زمن الاستقرار", en: "Settling Time", cat: "control", desc: "الزمن اللازم للنظام للوصول لحالة مستقرة" },
    { ar: "زيادة التجاوز", en: "Overshoot", cat: "control", desc: "تجاوز النظام للقيمة المطلوبة قبل الاستقرار" },

    // ===== اهتزازات (Vibrations) =====
    { ar: "اهتزاز حر", en: "Free Vibration", cat: "vibrations", desc: "اهتزاز الجسم بدون قوة خارجية مستمرة" },
    { ar: "اهتزاز قسري", en: "Forced Vibration", cat: "vibrations", desc: "اهتزاز الجسم بسبب قوة خارجية" },
    { ar: "تخميد", en: "Damping", cat: "vibrations", desc: "تقليل سعة الاهتزاز مع الزمن" },
    { ar: "تردد طبيعي", en: "Natural Frequency", cat: "vibrations", desc: "التردد الذي يهتز به الجسم بحرية" },
    { ar: "رنين", en: "Resonance", cat: "vibrations", desc: "اهتزاز بأقصى سعة عند تساوي الترددات" },
    { ar: "درجة حرية", en: "Degree of Freedom", cat: "vibrations", desc: "عدد الإحداثيات المستقلة لوصف حركة النظام" },
    { ar: "وضع الاهتزاز", en: "Mode Shape", cat: "vibrations", desc: "شكل الجسم عند اهتزازه بتردد معين" },
    { ar: "فقدان الطاقة", en: "Energy Dissipation", cat: "vibrations", desc: "تحول طاقة الاهتزاز لأشكال أخرى" },

    // ===== تصميم هندسي (Engineering Design) =====
    { ar: "تصميم ميكانيكي", en: "Mechanical Design", cat: "design", desc: "عملية تصميم الأجزاء والأنظمة الميكانيكية" },
    { ar: "تحمل", en: "Bearing", cat: "design", desc: "مكون يقلل الاحتكاك بين الأجزاء المتحركة" },
    { ar: "تروس", en: "Gears", cat: "design", desc: "عجلات مسننة تنقل الحركة والقدرة" },
    { ar: "سيور", en: "Belts", cat: "design", desc: "أحزمة تنقل الحركة بين البكرات" },
    { ar: "سلاسل", en: "Chains", cat: "design", desc: "سلاسل معدنية تنقل الحركة" },
    { ar: "عمود", en: "Shaft", cat: "design", desc: "جزء دوّار ينقل العزم" },
    { ar: "مسمار", en: "Bolt", cat: "design", desc: "مثبت لولبي يستخدم لتجميع الأجزاء" },
    { ar: "لحام دائم", en: "Permanent Joint", cat: "design", desc: "وصل لا يمكن فكه بدون تلف" },
    { ar: "وصل مؤقت", en: "Temporary Joint", cat: "design", desc: "وصل يمكن فكه وتركيبه" },
    { ar: "تصميم بمساعدة الحاسوب", en: "CAD", cat: "design", desc: "استخدام الحاسوب في التصميم الهندسي" },
    { ar: "تصنيع بمساعدة الحاسوب", en: "CAM", cat: "design", desc: "استخدام الحاسوب في عمليات التصنيع" },
    { ar: "هندسة عكسية", en: "Reverse Engineering", cat: "design", desc: "تحليل منتج موجود لفهم تصميمه" },

    // ===== سلامة وصيانة (Safety & Maintenance) =====
    { ar: "سلامة مهنية", en: "Occupational Safety", cat: "safety", desc: "إجراءات حماية العاملين من المخاطر" },
    { ar: "صيانة وقائية", en: "Preventive Maintenance", cat: "safety", desc: "صيانة دورية لمنع الأعطال" },
    { ar: "صيانة علاجية", en: "Corrective Maintenance", cat: "safety", desc: "صيانة بعد حدوث العطل" },
    { ar: "تحليل المخاطر", en: "Risk Analysis", cat: "safety", desc: "تحديد وتقييم المخاطر المحتملة" },
    { ar: "معدات الوقاية", en: "PPE", cat: "safety", desc: "معدات الحماية الشخصية للعاملين" },
    { ar: "محركات الاحتراق", en: "Combustion Engines", cat: "safety", desc: "محركات تعمل بحرق الوقود" },

    // ===== هندسة السيارات (Automotive) =====
    { ar: "هندسة السيارات", en: "Automotive Engineering", cat: "automotive", desc: "فرع يهتم بتصميم وتصنيع السيارات" },
    { ar: "ناقل حركة", en: "Transmission", cat: "automotive", desc: "نظام ينقل القدرة من المحرك للعجلات" },
    { ar: "نظام تعليق", en: "Suspension System", cat: "automotive", desc: "نظام يربط السيارة بالعجلات ويمتص الصدمات" },
    { ar: "نظام فرامل", en: "Braking System", cat: "automotive", desc: "نظام لإيقاف السيارة أو تقليل سرعتها" },
    { ar: "نظام توجيه", en: "Steering System", cat: "automotive", desc: "نظام للتحكم في اتجاه السيارة" },
    { ar: "احتراق داخلي", en: "Internal Combustion", cat: "automotive", desc: "احتراق الوقود داخل المحرك" },
    { ar: "احتراق خارجي", en: "External Combustion", cat: "automotive", desc: "احتراق الوقود خارج المحرك" },
    { ar: "كفاءة الوقود", en: "Fuel Efficiency", cat: "automotive", desc: "المسافة المقطوعة لكل وحدة وقود" },

    // ===== تبريد وتكييف (HVAC) =====
    { ar: "تبريد", en: "Refrigeration", cat: "hvac", desc: "عملية نقل الحرارة من مكان لآخر" },
    { ar: "تكييف", en: "Air Conditioning", cat: "hvac", desc: "التحكم في درجة حرارة ورطوبة الهواء" },
    { ar: "دورة التبريد", en: "Refrigeration Cycle", cat: "hvac", desc: "دورة لنقل الحرارة من مكان بارد لساخن" },
    { ar: "ضاغط", en: "Compressor", cat: "hvac", desc: "جهاز يزيد ضغط غاز التبريد" },
    { ar: "مكثف تبريد", en: "Condenser", cat: "hvac", desc: "مبادل حراري يطرد الحرارة للخارج" },
    { ar: "مبخر", en: "Evaporator", cat: "hvac", desc: "مبادل حراري يمتص الحرارة من المكان" },
    { ar: "صمام تمدد", en: "Expansion Valve", cat: "hvac", desc: "صمام يخفض ضغط وسائل التبريد" },
    { ar: "معامل الأداء", en: "COP", cat: "hvac", desc: "كفاءة دورة التبريد = التبريد / الشغل" },
    { ar: "وسيط تبريد", en: "Refrigerant", cat: "hvac", desc: "سائل يعمل في دورة التبريد" }

];
// ===== إضافة الشرح الإنجليزي لكل مصطلح =====
const termDescEn = {
    // ميكانيكا
    "ميكانيكا": "Branch of physics that studies motion of bodies and forces",
    "قوة": "External influence that changes motion. Unit: Newton (N)",
    "كتلة": "Amount of matter. Unit: Kilogram (kg)",
    "وزن": "Earth's gravitational force = mass × gravity (W = mg)",
    "سرعة": "Rate of displacement. Unit: m/s",
    "تسارع": "Rate of change of velocity. Unit: m/s²",
    "عزم": "Ability of force to cause rotation = Force × Arm",
    "زخم": "Product of mass and velocity = mass × velocity",
    "احتكاك": "Force opposing motion between two touching surfaces",
    "اتزان": "State where sum of forces on a body = zero",
    "إزاحة": "Distance with direction. Unit: meter (m)",
    "إجهاد القص": "Force parallel to surface divided by cross-section area",
    "قوة الطرد المركزي": "Apparent force pushing body away from center",
    "قوة الجذب المركزي": "Force making body move in circular path",
    "قانون نيوتن الأول": "A body stays at rest or motion unless acted by force",
    "قانون نيوتن الثاني": "F = ma (Force = Mass × Acceleration)",
    "قانون نيوتن الثالث": "For every action there is equal and opposite reaction",
    "طاقة حركية": "Energy of motion = ½mv²",
    "طاقة كامنة": "Stored energy = mgh",
    "شغل": "Force × distance. Unit: Joule (J)",
    "قدرة ميكانيكية": "Rate of doing work. Unit: Watt (W)",
    "دفع": "Force × time = change in momentum",
    "تردد طبيعي": "Frequency at which body vibrates freely",
    "رنين": "Maximum amplitude vibration when frequencies match",

    // حراريات
    "حرارة": "Form of energy transferred from hot to cold",
    "درجة حرارة": "Measure of average kinetic energy of molecules",
    "إنتروبيا": "Measure of disorder in a system",
    "إنثالبي": "Internal energy + pressure × volume",
    "قانون بويل": "Pressure × volume = constant at constant temperature",
    "قانون تشارلز": "Gas volume proportional to temperature at constant pressure",
    "قانون جاي-لوساك": "Pressure proportional to temperature at constant volume",
    "دورة كارنو": "Maximum theoretical efficiency between two temperatures",
    "دورة رانكين": "Basic cycle of steam power plants",
    "دورة برايتون": "Basic cycle of gas turbines",
    "دورة أوتو": "Ideal cycle of gasoline engines",
    "دورة ديزل": "Ideal cycle of diesel engines",
    "انتقال الحرارة": "Heat transfer: conduction, convection, radiation",
    "توصيل حراري": "Heat transfer through solid without material motion",
    "حمل حراري": "Heat transfer through fluid motion",
    "إشعاع حراري": "Heat transfer through electromagnetic waves",
    "قانون ستيفان-بولتزمان": "Radiated energy proportional to T⁴",
    "الطاقة الداخلية": "Sum of kinetic and potential energies of molecules",
    "قانون الديناميكا الأول": "Energy conservation, ΔU = Q - W",
    "قانون الديناميكا الثاني": "Entropy of isolated system never decreases",
    "الغاز المثالي": "Gas following PV = nRT",
    "ثابت الغازات": "R = 8.314 J/mol·K",
    "انتقال الحرارة بالإشعاع": "Heat transfer without medium",

    // موائع
    "لزوجة": "Fluid resistance to flow. Unit: Pa·s",
    "ضغط": "Force per unit area. Unit: Pascal (Pa)",
    "كثافة": "Mass per unit volume. Unit: kg/m³",
    "تدفق": "Fluid motion in a system. Unit: m³/s",
    "مبدأ برنولي": "Increasing fluid speed decreases pressure",
    "معادلة الاستمرارية": "A₁V₁ = A₂V₂ (flow rate constant)",
    "رقم رينولدز": "Measure of flow type: laminar or turbulent",
    "قانون باسكال": "Pressure on confined fluid transmits equally",
    "ديناميكا الموائع": "Study of fluid motion and forces",
    "إستاتيكا الموائع": "Study of fluids at rest",
    "تدفق صفحي": "Smooth flow in parallel layers",
    "تدفق مضطرب": "Irregular flow with eddies and vibrations",
    "معامل الاحتكاك": "Calculates energy loss in pipes",
    "فقدان الرأس": "Pressure loss due to pipe friction",
    "مضخة": "Device that increases fluid pressure to move it",
    "توربين": "Converts fluid energy to rotating mechanical energy",
    "مقياس ضغط": "Device to measure pressure difference",
    "طفو": "Buoyant force of fluid on submerged bodies",
    "قانون أرخميدس": "Buoyant force = weight of displaced fluid",

    // مواد
    "إجهاد": "Internal force per unit area. Unit: Pa",
    "انفعال": "Relative change in length = ΔL / L",
    "معامل يونغ": "Ratio of stress to strain. Measure of stiffness",
    "معامل القص": "Ratio of shear stress to shear strain",
    "نسبة بواسون": "Ratio of lateral to axial strain",
    "صلابة": "Resistance to scratching or deformation",
    "مطيلية": "Ability to deform without fracture",
    "هشاشة": "Property of breaking suddenly without deformation",
    "مقاومة الشد": "Maximum stress before fracture",
    "مقاومة الخضوع": "Stress at which permanent deformation begins",
    "قص": "Stress causing layers to slide",
    "انحناء": "Deformation due to perpendicular forces",
    "التواء": "Twisting around axis due to torque",
    "زحف": "Slow deformation under constant stress over time",
    "كسر": "Separation of material into parts",
    "تعب": "Weakness due to repeated loads",
    "سبيكة": "Metallic material from mixing two or more metals",
    "فولاذ": "Alloy of iron and carbon",
    "حديد زهر": "Iron alloy with high carbon content",
    "ألومنيوم": "Lightweight corrosion-resistant metal",
    "بوليمر": "Material of large repeating molecules",
    "خزف": "Hard brittle heat-resistant material",
    "مركب": "Material of two or more different materials",

    // كهرباء
    "جهد": "Electric potential difference. Unit: Volt (V)",
    "تيار": "Rate of charge flow. Unit: Ampere (A)",
    "مقاومة": "Opposition to current. Unit: Ohm (Ω)",
    "قدرة": "Rate of energy consumption. Unit: Watt (W)",
    "قانون أوم": "V = I × R",
    "قانون كيرشوف للتيار": "Sum of currents in = out",
    "قانون كيرشوف للجهد": "Sum of voltages in closed loop = zero",
    "دائرة كهربائية": "Closed path for electric current",
    "دائرة توازي": "Circuit with components in parallel",
    "دائرة توالي": "Circuit with components in series",
    "مكثف": "Component storing charge. Unit: Farad (F)",
    "محث": "Component storing magnetic energy. Unit: Henry (H)",
    "مقاومة كهربائية": "Component opposing current flow",
    "ديود": "Component allowing current in one direction",
    "ترانزستور": "Component for amplification or switching",
    "تيار متردد": "Current that reverses direction periodically",
    "تيار مستمر": "Current in one direction",
    "تردد": "Cycles per second. Unit: Hertz (Hz)",
    "محول كهربائي": "Device changing AC voltage",
    "محرك كهربائي": "Converts electrical energy to motion",
    "مولد كهربائي": "Converts kinetic energy to electricity",

    // طاقة
    "طاقة متجددة": "Energy from inexhaustible sources: sun, wind, water",
    "طاقة شمسية": "Energy from sun rays",
    "خلايا كهروضوئية": "Convert solar energy to electricity directly",
    "الخلايا الشمسية": "Panels converting sunlight to electricity",
    "الطاقة الشمسية المركزة": "Concentrating sun rays to generate heat",
    "طاقة الرياح": "Energy from wind motion via turbines",
    "توربين رياح": "Device converting wind energy to electricity",
    "طاقة حرارية أرضية": "Energy from Earth's internal heat",
    "كتلة حيوية": "Energy from organic materials (plants, wood, waste)",
    "طاقة حيوية": "Energy extracted from biomass",
    "خلايا الوقود": "Convert chemical energy to electricity",
    "الهيدروجين الأخضر": "Hydrogen produced from renewable sources",
    "كفاءة الطاقة": "Ratio of useful to produced energy",
    "تخزين الطاقة": "Technologies for storing energy for later use",
    "بطارية": "Device storing chemical energy and converting to electricity",
    "شبكة ذكية": "Electric grid using digital technologies",
    "محطة طاقة": "Facility for electricity generation",
    "محطة بخارية": "Power plant operating with steam",
    "محطة غازية": "Power plant operating with natural gas",
    "الطاقة الكهرومائية": "Generating electricity from water motion",
    "الطاقة النووية": "Energy from nuclear fission or fusion",
    "تحويل الطاقة": "Converting energy from one form to another",
    "قانون حفظ الطاقة": "Energy cannot be created or destroyed",

    // رياضيات
    "اشتقاق": "Rate of change of a function. dy/dx",
    "تكامل": "Inverse of derivative. Area under curve",
    "نهاية": "Value function approaches at a point",
    "استمرارية": "Property of function without jumps",
    "مصفوفة": "Rectangular arrangement of numbers in rows/columns",
    "محدد": "Scalar value computed from square matrix elements",
    "متجه": "Quantity with magnitude and direction",
    "ضرب نقطي": "Product of two vectors yielding a scalar",
    "ضرب اتجاهي": "Product of two vectors yielding perpendicular vector",
    "مشتقة جزئية": "Derivative of multivariable function",
    "معادلة تفاضلية": "Equation containing function derivatives",
    "تحويل لابلاس": "Transform for solving differential equations",
    "تحويل فورييه": "Transform decomposing functions into sine waves",
    "سلسلة تايلور": "Approximating function by infinite series",
    "سلسلة ماكلورين": "Special case of Taylor series around zero",
    "متسلسلة فورييه": "Representing periodic functions as sum of trig functions",
    "إحصاء": "Science of collecting and analyzing data",
    "احتمال": "Measure of likelihood of an event",
    "توزيع طبيعي": "Bell-shaped probability distribution",
    "انحدار خطي": "Method for finding best line through data",

    // إنتاج
    "عمليات الإنتاج": "Processes for converting raw materials to products",
    "خراطة": "Production process using lathe for shaping metals",
    "تفريز": "Cutting process using rotating multi-tooth tool",
    "ثقب": "Process of creating holes in solid materials",
    "تجليخ": "High-precision surface finishing process",
    "لحام": "Joining metals by heat or pressure",
    "سباكة": "Pouring molten metal into mold for shaping",
    "طرق": "Shaping metal by hammering or pressing",
    "بثق": "Pushing metal through die for shaping",
    "درفلة": "Passing metal between rollers to reduce thickness",
    "سحب": "Pulling metal through die to reduce diameter",
    "قياس دقيق": "Measurement with precise tools like micrometer",
    "تحكم رقمي": "Computer numerical control of manufacturing machines",
    "طباعة ثلاثية الأبعاد": "Manufacturing objects layer by layer",
    "مراقبة الجودة": "Processes to ensure product quality",

    // تحكم
    "أنظمة التحكم": "Systems controlling behavior of dynamic systems",
    "حلقة مفتوحة": "Control system without feedback",
    "حلقة مغلقة": "Control system with feedback",
    "تغذية راجعة": "Returning part of output to input for improvement",
    "متحكم PID": "Controller using proportional, integral, derivative",
    "استقرار النظام": "Ability of system to return to equilibrium",
    "دالة التحويل": "Ratio of output to input in Laplace domain",
    "استجابة النظام": "System behavior over time when input changes",
    "زمن الاستقرار": "Time for system to reach steady state",
    "زيادة التجاوز": "System exceeding target value before settling",

    // اهتزازات
    "اهتزاز حر": "Body vibration without continuous external force",
    "اهتزاز قسري": "Body vibration due to external force",
    "تخميد": "Reducing vibration amplitude over time",
    "درجة حرية": "Number of independent coordinates describing motion",
    "وضع الاهتزاز": "Body shape when vibrating at a specific frequency",
    "فقدان الطاقة": "Converting vibration energy to other forms",

    // تصميم
    "تصميم ميكانيكي": "Process of designing mechanical parts and systems",
    "تحمل": "Component reducing friction between moving parts",
    "تروس": "Toothed wheels transmitting motion and power",
    "سيور": "Belts transmitting motion between pulleys",
    "سلاسل": "Metal chains transmitting motion",
    "عمود": "Rotating part transmitting torque",
    "مسمار": "Threaded fastener for assembling parts",
    "لحام دائم": "Joint that cannot be disassembled without damage",
    "وصل مؤقت": "Joint that can be disassembled and reassembled",
    "تصميم بمساعدة الحاسوب": "Using computer in engineering design",
    "تصنيع بمساعدة الحاسوب": "Using computer in manufacturing processes",
    "هندسة عكسية": "Analyzing existing product to understand its design",

    // سلامة
    "سلامة مهنية": "Procedures protecting workers from hazards",
    "صيانة وقائية": "Periodic maintenance to prevent failures",
    "صيانة علاجية": "Maintenance after failure occurs",
    "تحليل المخاطر": "Identifying and assessing potential risks",
    "معدات الوقاية": "Personal protective equipment for workers",
    "محركات الاحتراق": "Engines operating by burning fuel",

    // سيارات
    "هندسة السيارات": "Field concerned with vehicle design and manufacturing",
    "ناقل حركة": "System transmitting power from engine to wheels",
    "نظام تعليق": "System connecting vehicle to wheels and absorbing shocks",
    "نظام فرامل": "System for stopping vehicle or reducing speed",
    "نظام توجيه": "System for controlling vehicle direction",
    "احتراق داخلي": "Fuel combustion inside engine",
    "احتراق خارجي": "Fuel combustion outside engine",
    "كفاءة الوقود": "Distance traveled per unit of fuel",

    // تكييف
    "تبريد": "Process of transferring heat from one place to another",
    "تكييف": "Controlling air temperature and humidity",
    "دورة التبريد": "Cycle transferring heat from cold to hot place",
    "ضاغط": "Device increasing refrigerant gas pressure",
    "مكثف تبريد": "Heat exchanger rejecting heat outside",
    "مبخر": "Heat exchanger absorbing heat from space",
    "صمام تمدد": "Valve reducing refrigerant pressure",
    "معامل الأداء": "Cooling cycle efficiency = Cooling / Work",
    "وسيط تبريد": "Fluid operating in refrigeration cycle"
};

// دمج الشرح الإنجليزي مع المصفوفة
engineeringTerms.forEach(term => {
    if (termDescEn[term.ar]) {
        term.descEn = termDescEn[term.ar];
    } else {
        term.descEn = term.en;
    }
});
let currentCategory = 'all';

// ===== عرض المصطلحات =====
function renderTerms(terms) {
    const container = document.getElementById('dictList');
    const noResults = document.getElementById('noResults');
    const countEl = document.getElementById('dictCount');

    if (!container) return;

    if (countEl) countEl.textContent = terms.length;

    if (terms.length === 0) {
        container.innerHTML = '';
        if (noResults) noResults.style.display = 'block';
        return;
    }

    if (noResults) noResults.style.display = 'none';

    container.innerHTML = terms.map(t => `
        <div class="dict-item">
            <div class="dict-item-header">
                <h3 class="dict-ar">${t.ar}</h3>
                <span class="dict-en">${t.en}</span>
            </div>
                       <p class="dict-desc">${currentLang === 'ar' ? t.desc : (t.descEn || t.desc)}</p>
            <span class="dict-category">${getTermCategoryName(t.cat)}</span>
        </div>
    `).join('');
}
function getTermCategoryName(cat) {
    const isAr = currentLang === 'ar';
    const names = isAr ? {
        mechanics: '⚙️ ميكانيكا',
        thermo: '🔥 حراريات',
        fluids: '💧 موائع',
        materials: '🔬 مواد',
        electric: '⚡ كهرباء',
        energy: '🌱 طاقة',
        math: '📐 رياضيات',
        manufacturing: '🏭 إنتاج',
        control: '🎛️ تحكم',
        vibrations: '〰️ اهتزازات',
        design: '✏️ تصميم',
        safety: '🦺 سلامة',
        automotive: '🚗 سيارات',
        hvac: '❄️ تكييف'
    } : {
        mechanics: '⚙️ Mechanics',
        thermo: '🔥 Thermo',
        fluids: '💧 Fluids',
        materials: '🔬 Materials',
        electric: '⚡ Electric',
        energy: '🌱 Energy',
        math: '📐 Math',
        manufacturing: '🏭 Manufacturing',
        control: '🎛️ Control',
        vibrations: '〰️ Vibrations',
        design: '✏️ Design',
        safety: '🦺 Safety',
        automotive: '🚗 Automotive',
        hvac: '❄️ HVAC'
    };
    return names[cat] || cat;
}
// ===== البحث في المصطلحات =====
function searchTerms() {
    const query = document.getElementById('dictSearch').value.toLowerCase().trim();
    let filtered = engineeringTerms;

    if (currentCategory !== 'all') {
        filtered = filtered.filter(t => t.cat === currentCategory);
    }

     if (query) {
        filtered = filtered.filter(t =>
            t.ar.toLowerCase().includes(query) ||
            t.en.toLowerCase().includes(query) ||
            t.desc.toLowerCase().includes(query) ||
            (t.descEn && t.descEn.toLowerCase().includes(query))
        );
    }

    renderTerms(filtered);
}

// ===== فلترة التصنيفات =====
function filterCategory(event, category) {
    currentCategory = category;
    document.querySelectorAll('.dict-cat-btn').forEach(btn => btn.classList.remove('active'));
    event.currentTarget.classList.add('active');
    searchTerms();
}

// ===== عرض المصطلحات عند التحميل =====
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('dictList')) {
        renderTerms(engineeringTerms);
    }
});

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
