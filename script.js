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

function searchMaterials() {
    const input = document.getElementById('searchInput');
    if (!input) return;
    
    const query = input.value.toLowerCase().trim();
    const activeTab = document.querySelector('.tab-content.active');
    if (!activeTab) return;
    
    // إذا البحث فارغ - أعد الكل
    if (query === '') {
        activeTab.querySelectorAll('.year-card').forEach(card => {
            card.style.display = '';
            card.classList.remove('active');
        });
        activeTab.querySelectorAll('.semester').forEach(sem => {
            sem.style.display = '';
        });
        activeTab.querySelectorAll('.semester li').forEach(li => {
            li.style.display = '';
        });
        const firstYear = activeTab.querySelector('.year-card');
        if (firstYear) firstYear.classList.add('active');
        return;
    }
    
    // افتح كل السنوات
    activeTab.querySelectorAll('.year-card').forEach(card => {
        card.classList.add('active');
    });
    
    // ابحث في كل المواد
    activeTab.querySelectorAll('.semester li').forEach(li => {
        // احصل على النص العربي والإنجليزي من data-ar-text
        const arText = (li.querySelector('a')?.getAttribute('data-ar-text') || '').toLowerCase();
        const fullText = li.textContent.toLowerCase();
        
        if (arText.includes(query) || fullText.includes(query)) {
            li.style.display = '';
        } else {
            li.style.display = 'none';
        }
    });
    
    // إخفاء الفصول الفارغة
    activeTab.querySelectorAll('.semester').forEach(sem => {
        const hasVisible = Array.from(sem.querySelectorAll('li')).some(
            li => li.style.display !== 'none'
        );
        sem.style.display = hasVisible ? '' : 'none';
    });
    
    // إخفاء السنوات الفارغة
    activeTab.querySelectorAll('.year-card').forEach(card => {
        const hasVisible = Array.from(card.querySelectorAll('li')).some(
            li => li.style.display !== 'none'
        );
        card.style.display = hasVisible ? '' : 'none';
    });
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

/* ===== إخفاء شاشة التحميل ===== */
.loader-screen {
    display: none !important;
}

// ===== قائمة الجوال واللابتوب =====
function toggleMenu() {
    const navLinks = document.getElementById('navLinks');
    const overlay = document.getElementById('navOverlay');
    if (!navLinks) return;
    if (window.innerWidth > 768) {
        navLinks.classList.toggle('expanded');
    } else {
        navLinks.classList.toggle('open');
    }
    if (overlay) overlay.classList.toggle('show');
}

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

// ===== قاموس المصطلحات الهندسية الكامل (220+ مصطلح) =====
const engineeringTerms = [
    // ========== ميكانيكا (Mechanics) - 24 ==========
    { ar: "ميكانيكا", en: "Mechanics", cat: "mechanics", descAr: "فرع من الفيزياء يدرس حركة الأجسام والقوى المؤثرة عليها", descEn: "Branch of physics that studies motion of bodies and forces acting on them" },
    { ar: "قوة", en: "Force", cat: "mechanics", descAr: "مؤثر خارجي يغير حالة الجسم الحركية. وحدتها: نيوتن (N)", descEn: "External influence that changes the state of motion of a body. Unit: Newton (N)" },
    { ar: "كتلة", en: "Mass", cat: "mechanics", descAr: "مقدار المادة في الجسم. وحدتها: كيلوغرام (kg)", descEn: "Amount of matter in a body. Unit: Kilogram (kg)" },
    { ar: "وزن", en: "Weight", cat: "mechanics", descAr: "قوة جذب الأرض للجسم = الكتلة × الجاذبية (W = mg)", descEn: "Gravitational force on a body = mass × gravity (W = mg)" },
    { ar: "سرعة", en: "Velocity", cat: "mechanics", descAr: "معدل تغير الإزاحة مع الزمن. وحدتها: م/ث", descEn: "Rate of change of displacement with time. Unit: m/s" },
    { ar: "تسارع", en: "Acceleration", cat: "mechanics", descAr: "معدل تغير السرعة مع الزمن. وحدتها: م/ث²", descEn: "Rate of change of velocity with time. Unit: m/s²" },
    { ar: "عزم", en: "Torque", cat: "mechanics", descAr: "قدرة القوة على إحداث دوران. = القوة × الذراع", descEn: "Ability of a force to cause rotation = Force × Moment arm" },
    { ar: "زخم", en: "Momentum", cat: "mechanics", descAr: "حاصل ضرب الكتلة في السرعة. = كتلة × سرعة", descEn: "Product of mass and velocity = mass × velocity" },
    { ar: "احتكاك", en: "Friction", cat: "mechanics", descAr: "قوة تعارض الحركة بين سطحين متلامسين", descEn: "Force that opposes motion between two touching surfaces" },
    { ar: "اتزان", en: "Equilibrium", cat: "mechanics", descAr: "حالة يكون فيها مجموع القوى المؤثرة على جسم = صفر", descEn: "State where the sum of all forces acting on a body equals zero" },
    { ar: "إزاحة", en: "Displacement", cat: "mechanics", descAr: "المسافة مع الاتجاه. وحدتها: متر (m)", descEn: "Distance with direction. Unit: meter (m)" },
    { ar: "إجهاد القص", en: "Shear Stress", cat: "mechanics", descAr: "قوة موازية للسطح مقسومة على مساحة المقطع", descEn: "Force parallel to surface divided by cross-sectional area" },
    { ar: "قوة الطرد المركزي", en: "Centrifugal Force", cat: "mechanics", descAr: "قوة ظاهرية تدفع الجسم بعيداً عن المركز", descEn: "Apparent force that pushes a body away from the center" },
    { ar: "قوة الجذب المركزي", en: "Centripetal Force", cat: "mechanics", descAr: "قوة تجعل الجسم يتحرك في مسار دائري", descEn: "Force that makes a body move in a circular path" },
    { ar: "قانون نيوتن الأول", en: "Newton's First Law", cat: "mechanics", descAr: "الجسم الساكن يبقى ساكناً ما لم تؤثر عليه قوة", descEn: "A body at rest stays at rest unless acted upon by a force" },
    { ar: "قانون نيوتن الثاني", en: "Newton's Second Law", cat: "mechanics", descAr: "F = ma (القوة = الكتلة × التسارع)", descEn: "F = ma (Force = mass × acceleration)" },
    { ar: "قانون نيوتن الثالث", en: "Newton's Third Law", cat: "mechanics", descAr: "لكل فعل رد فعل مساوٍ له في المقدار ومعاكس في الاتجاه", descEn: "For every action there is an equal and opposite reaction" },
    { ar: "طاقة حركية", en: "Kinetic Energy", cat: "mechanics", descAr: "الطاقة الناتجة عن حركة الجسم = ½mv²", descEn: "Energy resulting from motion of a body = ½mv²" },
    { ar: "طاقة كامنة", en: "Potential Energy", cat: "mechanics", descAr: "الطاقة المخزنة نتيجة الوضع = mgh", descEn: "Stored energy due to position = mgh" },
    { ar: "شغل", en: "Work", cat: "mechanics", descAr: "القوة × المسافة في اتجاه القوة. وحدتها: جول (J)", descEn: "Force × Distance in direction of force. Unit: Joule (J)" },
    { ar: "قدرة ميكانيكية", en: "Mechanical Power", cat: "mechanics", descAr: "معدل بذل الشغل. وحدتها: واط (W)", descEn: "Rate of doing work. Unit: Watt (W)" },
    { ar: "دفع", en: "Impulse", cat: "mechanics", descAr: "القوة × الزمن. يساوي التغير في الزخم", descEn: "Force × Time = change in momentum" },
    { ar: "تردد طبيعي", en: "Natural Frequency", cat: "mechanics", descAr: "التردد الذي يهتز به الجسم بحرية", descEn: "Frequency at which a body vibrates freely without external force" },
    { ar: "رنين", en: "Resonance", cat: "mechanics", descAr: "اهتزاز بأقصى سعة عند تساوي الترددات", descEn: "Vibration with maximum amplitude when frequencies match" },

    // ========== حراريات (Thermodynamics) - 22 ==========
    { ar: "حرارة", en: "Heat", cat: "thermo", descAr: "شكل من أشكال الطاقة ينتقل من الجسم الساخن للبارد", descEn: "Form of energy that transfers from hot body to cold body" },
    { ar: "درجة حرارة", en: "Temperature", cat: "thermo", descAr: "مقياس لمتوسط الطاقة الحركية للجزيئات", descEn: "Measure of average kinetic energy of molecules" },
    { ar: "إنتروبيا", en: "Entropy", cat: "thermo", descAr: "مقياس لدرجة العشوائية أو الفوضى في النظام", descEn: "Measure of randomness or disorder in a system" },
    { ar: "إنثالبي", en: "Enthalpy", cat: "thermo", descAr: "مجموع الطاقة الداخلية + حاصل ضرب الضغط في الحجم", descEn: "Total internal energy + (pressure × volume)" },
    { ar: "قانون بويل", en: "Boyle's Law", cat: "thermo", descAr: "الضغط × الحجم = ثابت عند درجة حرارة ثابتة", descEn: "Pressure × Volume = constant at constant temperature" },
    { ar: "قانون تشارلز", en: "Charles's Law", cat: "thermo", descAr: "حجم الغاز يتناسب طردياً مع درجة الحرارة", descEn: "Gas volume is directly proportional to temperature at constant pressure" },
    { ar: "قانون جاي-لوساك", en: "Gay-Lussac's Law", cat: "thermo", descAr: "الضغط يتناسب طردياً مع درجة الحرارة", descEn: "Pressure is directly proportional to temperature at constant volume" },
    { ar: "دورة كارنو", en: "Carnot Cycle", cat: "thermo", descAr: "أعلى كفاءة نظرية لمحرك حراري", descEn: "Maximum theoretical efficiency for a heat engine" },
    { ar: "دورة رانكين", en: "Rankine Cycle", cat: "thermo", descAr: "الدورة الأساسية لمحطات الطاقة البخارية", descEn: "Basic cycle of steam power plants" },
    { ar: "دورة برايتون", en: "Brayton Cycle", cat: "thermo", descAr: "الدورة الأساسية لتوربينات الغاز", descEn: "Basic cycle of gas turbines" },
    { ar: "دورة أوتو", en: "Otto Cycle", cat: "thermo", descAr: "الدورة المثالية لمحركات البنزين", descEn: "Ideal cycle for gasoline engines" },
    { ar: "دورة ديزل", en: "Diesel Cycle", cat: "thermo", descAr: "الدورة المثالية لمحركات الديزل", descEn: "Ideal cycle for diesel engines" },
    { ar: "انتقال الحرارة", en: "Heat Transfer", cat: "thermo", descAr: "انتقال الطاقة الحرارية: توصيل، حمل، إشعاع", descEn: "Transfer of thermal energy: conduction, convection, radiation" },
    { ar: "توصيل حراري", en: "Conduction", cat: "thermo", descAr: "انتقال الحرارة عبر مادة صلبة", descEn: "Heat transfer through a solid material" },
    { ar: "حمل حراري", en: "Convection", cat: "thermo", descAr: "انتقال الحرارة عبر حركة المائع", descEn: "Heat transfer through fluid movement" },
    { ar: "إشعاع حراري", en: "Radiation", cat: "thermo", descAr: "انتقال الحرارة عبر الموجات الكهرومغناطيسية", descEn: "Heat transfer through electromagnetic waves" },
    { ar: "قانون ستيفان-بولتزمان", en: "Stefan-Boltzmann Law", cat: "thermo", descAr: "الطاقة المشعة تتناسب مع القوة الرابعة لدرجة الحرارة", descEn: "Radiated energy is proportional to the fourth power of temperature" },
    { ar: "الطاقة الداخلية", en: "Internal Energy", cat: "thermo", descAr: "مجموع الطاقات الحركية والكامنة للجزيئات", descEn: "Sum of kinetic and potential energies of molecules" },
    { ar: "قانون الديناميكا الأول", en: "First Law of Thermodynamics", cat: "thermo", descAr: "الطاقة لا تفنى ولا تستحدث، ΔU = Q - W", descEn: "Energy cannot be created or destroyed, ΔU = Q - W" },
    { ar: "قانون الديناميكا الثاني", en: "Second Law of Thermodynamics", cat: "thermo", descAr: "الإنتروبيا في نظام معزول لا تقل أبداً", descEn: "Entropy in an isolated system never decreases" },
    { ar: "الغاز المثالي", en: "Ideal Gas", cat: "thermo", descAr: "غاز يتبع قانون PV = nRT", descEn: "Gas that follows PV = nRT" },
    { ar: "ثابت الغازات", en: "Gas Constant", cat: "thermo", descAr: "R = 8.314 J/mol·K", descEn: "R = 8.314 J/mol·K" },

    // ========== موائع (Fluids) - 19 ==========
    { ar: "لزوجة", en: "Viscosity", cat: "fluids", descAr: "مقاومة المائع للتدفق. وحدتها: Pa·s", descEn: "Resistance of fluid to flow. Unit: Pa·s" },
    { ar: "ضغط", en: "Pressure", cat: "fluids", descAr: "القوة المؤثرة على وحدة المساحة. وحدتها: باسكال", descEn: "Force per unit area. Unit: Pascal (Pa)" },
    { ar: "كثافة", en: "Density", cat: "fluids", descAr: "الكتلة في وحدة الحجم. وحدتها: kg/m³", descEn: "Mass per unit volume. Unit: kg/m³" },
    { ar: "تدفق", en: "Flow", cat: "fluids", descAr: "حركة المائع في نظام. يقاس بـ: m³/s", descEn: "Movement of fluid in a system. Measured in m³/s" },
    { ar: "مبدأ برنولي", en: "Bernoulli's Principle", cat: "fluids", descAr: "زيادة سرعة المائع تقلل ضغطه", descEn: "Increasing fluid speed decreases its pressure" },
    { ar: "معادلة الاستمرارية", en: "Continuity Equation", cat: "fluids", descAr: "A₁V₁ = A₂V₂ (معدل التدفق ثابت)", descEn: "A₁V₁ = A₂V₂ (flow rate is constant)" },
    { ar: "رقم رينولدز", en: "Reynolds Number", cat: "fluids", descAr: "مقياس لطبيعة التدفق: صفحي أو مضطرب", descEn: "Measure of flow type: laminar or turbulent" },
    { ar: "قانون باسكال", en: "Pascal's Law", cat: "fluids", descAr: "الضغط على سائل محصور ينتقل بالتساوي", descEn: "Pressure applied to enclosed fluid is transmitted equally" },
    { ar: "ديناميكا الموائع", en: "Fluid Dynamics", cat: "fluids", descAr: "دراسة حركة الموائع والقوى المؤثرة فيها", descEn: "Study of fluid motion and forces on them" },
    { ar: "إستاتيكا الموائع", en: "Fluid Statics", cat: "fluids", descAr: "دراسة الموائع في حالة السكون", descEn: "Study of fluids at rest" },
    { ar: "تدفق صفحي", en: "Laminar Flow", cat: "fluids", descAr: "تدفق منتظم في طبقات متوازية", descEn: "Smooth flow in parallel layers" },
    { ar: "تدفق مضطرب", en: "Turbulent Flow", cat: "fluids", descAr: "تدفق غير منتظم مع دوامات", descEn: "Irregular flow with eddies" },
    { ar: "معامل الاحتكاك", en: "Friction Factor", cat: "fluids", descAr: "معامل يحسب فقدان الطاقة في الأنابيب", descEn: "Factor for calculating energy loss in pipes" },
    { ar: "فقدان الرأس", en: "Head Loss", cat: "fluids", descAr: "فقدان الضغط بسبب الاحتكاك في الأنابيب", descEn: "Pressure loss due to friction in pipes" },
    { ar: "مضخة", en: "Pump", cat: "fluids", descAr: "جهاز يزيد ضغط المائع لنقله", descEn: "Device that increases fluid pressure to move it" },
    { ar: "توربين", en: "Turbine", cat: "fluids", descAr: "جهاز يحول طاقة المائع لطاقة ميكانيكية", descEn: "Device that converts fluid energy into mechanical energy" },
    { ar: "مقياس ضغط", en: "Manometer", cat: "fluids", descAr: "جهاز لقياس فرق الضغط", descEn: "Device for measuring pressure difference" },
    { ar: "طفو", en: "Buoyancy", cat: "fluids", descAr: "قوة دفع المائع للأجسام المغمورة", descEn: "Upward force exerted by fluid on immersed bodies" },
    { ar: "قانون أرخميدس", en: "Archimedes' Principle", cat: "fluids", descAr: "قوة الطفو = وزن المائع المُزاح", descEn: "Buoyant force = weight of displaced fluid" },

    // ========== مواد (Materials) - 23 ==========
    { ar: "إجهاد", en: "Stress", cat: "materials", descAr: "القوة الداخلية على وحدة المساحة. وحدتها: Pa", descEn: "Internal force per unit area. Unit: Pa" },
    { ar: "انفعال", en: "Strain", cat: "materials", descAr: "التغير النسبي في الطول. = ΔL / L", descEn: "Relative change in length = ΔL / L" },
    { ar: "معامل يونغ", en: "Young's Modulus", cat: "materials", descAr: "نسبة الإجهاد إلى الانفعال. مقياس الصلابة", descEn: "Ratio of stress to strain. Measure of stiffness" },
    { ar: "معامل القص", en: "Shear Modulus", cat: "materials", descAr: "نسبة إجهاد القص إلى انفعال القص", descEn: "Ratio of shear stress to shear strain" },
    { ar: "نسبة بواسون", en: "Poisson's Ratio", cat: "materials", descAr: "نسبة الانفعال الجانبي للانفعال الطولي", descEn: "Ratio of lateral strain to axial strain" },
    { ar: "صلابة", en: "Hardness", cat: "materials", descAr: "مقاومة المادة للخدش أو التشكيل", descEn: "Resistance of material to scratching or deformation" },
    { ar: "مطيلية", en: "Ductility", cat: "materials", descAr: "قدرة المادة على التشكيل دون كسر", descEn: "Ability of material to deform without breaking" },
    { ar: "هشاشة", en: "Brittleness", cat: "materials", descAr: "خاصية المادة التي تتكسر بسرعة", descEn: "Property of material that breaks suddenly" },
    { ar: "مقاومة الشد", en: "Tensile Strength", cat: "materials", descAr: "أقصى إجهاد يتحمله الجسم قبل الكسر", descEn: "Maximum stress a body can withstand before breaking" },
    { ar: "مقاومة الخضوع", en: "Yield Strength", cat: "materials", descAr: "الإجهاد الذي عنده تبدأ المادة بالتشكل", descEn: "Stress at which material begins to deform plastically" },
    { ar: "قص", en: "Shear", cat: "materials", descAr: "إجهاد يسبب انزلاق الطبقات", descEn: "Stress causing layers to slide over each other" },
    { ar: "انحناء", en: "Bending", cat: "materials", descAr: "تشوه الجسم بسبب قوى عمودية", descEn: "Deformation of a body due to perpendicular forces" },
    { ar: "التواء", en: "Torsion", cat: "materials", descAr: "التفاف الجسم حول محوره", descEn: "Twisting of a body around its axis" },
    { ar: "زحف", en: "Creep", cat: "materials", descAr: "تشوه بطيء للمادة تحت إجهاد ثابت", descEn: "Slow deformation of material under constant stress" },
    { ar: "كسر", en: "Fracture", cat: "materials", descAr: "انفصال المادة إلى جزئين", descEn: "Separation of material into two parts" },
    { ar: "تعب", en: "Fatigue", cat: "materials", descAr: "ضعف المادة بسبب أحمال متكررة", descEn: "Weakening of material due to repeated loads" },
    { ar: "سبيكة", en: "Alloy", cat: "materials", descAr: "مادة معدنية من خلط معدنين أو أكثر", descEn: "Metallic material made by mixing two or more metals" },
    { ar: "فولاذ", en: "Steel", cat: "materials", descAr: "سبيكة من الحديد والكربون", descEn: "Alloy of iron and carbon" },
    { ar: "حديد زهر", en: "Cast Iron", cat: "materials", descAr: "سبيكة حديدية بنسبة كربون عالية", descEn: "Iron alloy with high carbon content" },
    { ar: "ألومنيوم", en: "Aluminum", cat: "materials", descAr: "معدن خفيف الوزن ومقاوم للتآكل", descEn: "Lightweight and corrosion-resistant metal" },
    { ar: "بوليمر", en: "Polymer", cat: "materials", descAr: "مادة من جزيئات كبيرة متكررة", descEn: "Material made of large repeating molecules" },
    { ar: "خزف", en: "Ceramic", cat: "materials", descAr: "مادة صلبة وهشة مقاومة للحرارة", descEn: "Hard, brittle, heat-resistant material" },
    { ar: "مركب", en: "Composite", cat: "materials", descAr: "مادة من مادتين مختلفتين أو أكثر", descEn: "Material made of two or more different materials" },

    // ========== كهرباء (Electrical) - 20 ==========
    { ar: "جهد", en: "Voltage", cat: "electric", descAr: "فرق الجهد الكهربائي. وحدته: فولت (V)", descEn: "Electric potential difference. Unit: Volt (V)" },
    { ar: "تيار", en: "Current", cat: "electric", descAr: "معدل تدفق الشحنة. وحدته: أمبير (A)", descEn: "Rate of charge flow. Unit: Ampere (A)" },
    { ar: "مقاومة", en: "Resistance", cat: "electric", descAr: "معارضة المادة لمرور التيار. وحدتها: أوم", descEn: "Opposition of material to current. Unit: Ohm (Ω)" },
    { ar: "قدرة", en: "Power", cat: "electric", descAr: "معدل استهلاك الطاقة. وحدتها: واط (W)", descEn: "Rate of energy consumption. Unit: Watt (W)" },
    { ar: "قانون أوم", en: "Ohm's Law", cat: "electric", descAr: "V = I × R", descEn: "V = I × R" },
    { ar: "قانون كيرشوف للتيار", en: "Kirchhoff's Current Law", cat: "electric", descAr: "مجموع التيارات الداخلة = الخارجة", descEn: "Sum of currents entering = leaving" },
    { ar: "قانون كيرشوف للجهد", en: "Kirchhoff's Voltage Law", cat: "electric", descAr: "مجموع الجهود في حلقة مغلقة = صفر", descEn: "Sum of voltages in a closed loop = 0" },
    { ar: "دائرة كهربائية", en: "Electric Circuit", cat: "electric", descAr: "مسار مغلق يمر فيه التيار", descEn: "Closed path through which current flows" },
    { ar: "دائرة توازي", en: "Parallel Circuit", cat: "electric", descAr: "دائرة بمكونات على التوازي", descEn: "Circuit with components connected in parallel" },
    { ar: "دائرة توالي", en: "Series Circuit", cat: "electric", descAr: "دائرة بمكونات على التوالي", descEn: "Circuit with components connected in series" },
    { ar: "مكثف", en: "Capacitor", cat: "electric", descAr: "مكون يخزن الشحنة. وحدته: فاراد", descEn: "Component that stores charge. Unit: Farad (F)" },
    { ar: "محث", en: "Inductor", cat: "electric", descAr: "مكون يخزن الطاقة مغناطيسياً. وحدته: هنري", descEn: "Component that stores magnetic energy. Unit: Henry (H)" },
    { ar: "مقاومة كهربائية", en: "Resistor", cat: "electric", descAr: "مكون يعارض مرور التيار", descEn: "Component that opposes current flow" },
    { ar: "ديود", en: "Diode", cat: "electric", descAr: "مكون يسمح بالمرور في اتجاه واحد", descEn: "Component that allows current in one direction" },
    { ar: "ترانزستور", en: "Transistor", cat: "electric", descAr: "مكون للتضخيم أو كمفتاح", descEn: "Component for amplification or switching" },
    { ar: "تيار متردد", en: "AC", cat: "electric", descAr: "تيار يغير اتجاهه دورياً", descEn: "Current that reverses direction periodically" },
    { ar: "تيار مستمر", en: "DC", cat: "electric", descAr: "تيار في اتجاه واحد", descEn: "Current flowing in one direction" },
    { ar: "تردد", en: "Frequency", cat: "electric", descAr: "عدد الدورات في الثانية. وحدته: هرتز", descEn: "Number of cycles per second. Unit: Hertz (Hz)" },
    { ar: "محول كهربائي", en: "Transformer", cat: "electric", descAr: "جهاز يغير جهد التيار المتردد", descEn: "Device that changes AC voltage" },
    { ar: "محرك كهربائي", en: "Electric Motor", cat: "electric", descAr: "يحول الطاقة الكهربائية لحركية", descEn: "Converts electrical energy to mechanical" },

    // ========== طاقة (Energy) - 22 ==========
    { ar: "طاقة متجددة", en: "Renewable Energy", cat: "energy", descAr: "طاقة من مصادر لا تنضب", descEn: "Energy from inexhaustible sources" },
    { ar: "طاقة شمسية", en: "Solar Energy", cat: "energy", descAr: "الطاقة من أشعة الشمس", descEn: "Energy from the sun's rays" },
    { ar: "خلايا كهروضوئية", en: "PV Cells", cat: "energy", descAr: "تحول الطاقة الشمسية لكهرباء", descEn: "Convert solar energy to electricity" },
    { ar: "الخلايا الشمسية", en: "Solar Cells", cat: "energy", descAr: "ألواح تحول ضوء الشمس لكهرباء", descEn: "Panels that convert sunlight to electricity" },
    { ar: "الطاقة الشمسية المركزة", en: "Concentrated Solar Power", cat: "energy", descAr: "تركيز الشمس لتوليد الحرارة", descEn: "Concentrating sunlight to generate heat" },
    { ar: "طاقة الرياح", en: "Wind Energy", cat: "energy", descAr: "الطاقة من حركة الرياح", descEn: "Energy from wind movement" },
    { ar: "توربين رياح", en: "Wind Turbine", cat: "energy", descAr: "يحول طاقة الرياح لكهرباء", descEn: "Converts wind energy to electricity" },
    { ar: "طاقة حرارية أرضية", en: "Geothermal Energy", cat: "energy", descAr: "الطاقة من حرارة باطن الأرض", descEn: "Energy from the Earth's internal heat" },
    { ar: "كتلة حيوية", en: "Biomass", cat: "energy", descAr: "طاقة من مواد عضوية", descEn: "Energy from organic materials" },
    { ar: "طاقة حيوية", en: "Bioenergy", cat: "energy", descAr: "الطاقة من الكتلة الحيوية", descEn: "Energy from biomass" },
    { ar: "خلايا الوقود", en: "Fuel Cells", cat: "energy", descAr: "تحول الطاقة الكيميائية لكهرباء", descEn: "Convert chemical energy to electricity" },
    { ar: "الهيدروجين الأخضر", en: "Green Hydrogen", cat: "energy", descAr: "هيدروجين من مصادر متجددة", descEn: "Hydrogen produced from renewable sources" },
    { ar: "كفاءة الطاقة", en: "Energy Efficiency", cat: "energy", descAr: "نسبة الطاقة المفيدة للمنتجة", descEn: "Ratio of useful output to input energy" },
    { ar: "تخزين الطاقة", en: "Energy Storage", cat: "energy", descAr: "تقنيات لتخزين الطاقة", descEn: "Technologies for storing energy" },
    { ar: "بطارية", en: "Battery", cat: "energy", descAr: "تخزن الطاقة الكيميائية", descEn: "Stores chemical energy" },
    { ar: "شبكة ذكية", en: "Smart Grid", cat: "energy", descAr: "شبكة كهربائية رقمية", descEn: "Digital electric grid" },
    { ar: "محطة طاقة", en: "Power Plant", cat: "energy", descAr: "منشأة لتوليد الكهرباء", descEn: "Facility for generating electricity" },
    { ar: "محطة بخارية", en: "Steam Power Plant", cat: "energy", descAr: "تعمل بالبخار", descEn: "Plant that operates with steam" },
    { ar: "محطة غازية", en: "Gas Power Plant", cat: "energy", descAr: "تعمل بالغاز الطبيعي", descEn: "Plant that operates with natural gas" },
    { ar: "الطاقة الكهرومائية", en: "Hydropower", cat: "energy", descAr: "توليد الكهرباء من الماء", descEn: "Electricity generation from water" },
    { ar: "الطاقة النووية", en: "Nuclear Energy", cat: "energy", descAr: "من الانشطار أو الاندماج", descEn: "From fission or fusion" },
    { ar: "تحويل الطاقة", en: "Energy Conversion", cat: "energy", descAr: "تحويل الطاقة من شكل لآخر", descEn: "Converting energy from one form to another" },

    // ========== رياضيات (Mathematics) - 20 ==========
    { ar: "اشتقاق", en: "Derivative", cat: "math", descAr: "معدل تغير دالة. dy/dx", descEn: "Rate of change of a function. dy/dx" },
    { ar: "تكامل", en: "Integral", cat: "math", descAr: "عكس الاشتقاق. المساحة تحت المنحنى", descEn: "Inverse of derivative. Area under curve" },
    { ar: "نهاية", en: "Limit", cat: "math", descAr: "القيمة التي تقترب منها الدالة", descEn: "Value a function approaches" },
    { ar: "استمرارية", en: "Continuity", cat: "math", descAr: "دالة بلا قفزات", descEn: "Function without jumps" },
    { ar: "مصفوفة", en: "Matrix", cat: "math", descAr: "ترتيب مستطيل للأرقام", descEn: "Rectangular arrangement of numbers" },
    { ar: "محدد", en: "Determinant", cat: "math", descAr: "قيمة عددية من عناصر المصفوفة", descEn: "Numerical value from matrix elements" },
    { ar: "متجه", en: "Vector", cat: "math", descAr: "كمية لها مقدار واتجاه", descEn: "Quantity with magnitude and direction" },
    { ar: "ضرب نقطي", en: "Dot Product", cat: "math", descAr: "حاصل ضرب متجهين يعطي عدداً", descEn: "Product of two vectors giving a scalar" },
    { ar: "ضرب اتجاهي", en: "Cross Product", cat: "math", descAr: "حاصل ضرب متجهين يعطي متجهاً", descEn: "Product of two vectors giving a vector" },
    { ar: "مشتقة جزئية", en: "Partial Derivative", cat: "math", descAr: "اشتقاق دالة متعددة المتغيرات", descEn: "Derivative of multivariable function" },
    { ar: "معادلة تفاضلية", en: "Differential Equation", cat: "math", descAr: "معادلة فيها مشتقات", descEn: "Equation with derivatives" },
    { ar: "تحويل لابلاس", en: "Laplace Transform", cat: "math", descAr: "لحل المعادلات التفاضلية", descEn: "For solving differential equations" },
    { ar: "تحويل فورييه", en: "Fourier Transform", cat: "math", descAr: "تفكيك الدوال لموجات", descEn: "Decomposes functions into waves" },
    { ar: "سلسلة تايلور", en: "Taylor Series", cat: "math", descAr: "تقريب دالة بمتسلسلة", descEn: "Approximating a function by series" },
    { ar: "سلسلة ماكلورين", en: "Maclaurin Series", cat: "math", descAr: "حالة من تايلور حول الصفر", descEn: "Taylor series around zero" },
    { ar: "متسلسلة فورييه", en: "Fourier Series", cat: "math", descAr: "تمثيل الدوال الدورية", descEn: "Representing periodic functions" },
    { ar: "إحصاء", en: "Statistics", cat: "math", descAr: "جمع وتحليل البيانات", descEn: "Collecting and analyzing data" },
    { ar: "احتمال", en: "Probability", cat: "math", descAr: "إمكانية وقوع حدث", descEn: "Likelihood of an event" },
    { ar: "توزيع طبيعي", en: "Normal Distribution", cat: "math", descAr: "توزيع على شكل جرس",
         { ar: "توزيع طبيعي", en: "Normal Distribution", cat: "math", descAr: "توزيع على شكل جرس", descEn: "Bell-shaped distribution" },
    { ar: "انحدار خطي", en: "Linear Regression", cat: "math", descAr: "أفضل خط يمر بالبيانات", descEn: "Best line through data" },

    // ========== إنتاج وتصنيع (Manufacturing) - 15 ==========
    { ar: "عمليات الإنتاج", en: "Manufacturing Processes", cat: "manufacturing", descAr: "تحويل المواد الخام لمنتجات", descEn: "Converting raw materials into products" },
    { ar: "خراطة", en: "Turning", cat: "manufacturing", descAr: "تشكيل بالمخرطة", descEn: "Shaping with a lathe" },
    { ar: "تفريز", en: "Milling", cat: "manufacturing", descAr: "قطع بأداة دوارة متعددة الأسنان", descEn: "Cutting with multi-tooth rotary tool" },
    { ar: "ثقب", en: "Drilling", cat: "manufacturing", descAr: "إنشاء ثقوب", descEn: "Creating holes" },
    { ar: "تجليخ", en: "Grinding", cat: "manufacturing", descAr: "تشطيب سطحي بدقة", descEn: "Precision surface finishing" },
    { ar: "لحام", en: "Welding", cat: "manufacturing", descAr: "ربط المعادن بالحرارة", descEn: "Joining metals by heat" },
    { ar: "سباكة", en: "Casting", cat: "manufacturing", descAr: "صب المعدن في قالب", descEn: "Pouring metal into a mold" },
    { ar: "طرق", en: "Forging", cat: "manufacturing", descAr: "تشكيل بالطرق أو الضغط", descEn: "Shaping by hammering or pressing" },
    { ar: "بثق", en: "Extrusion", cat: "manufacturing", descAr: "دفع المعدن عبر قالب", descEn: "Pushing metal through a die" },
    { ar: "درفلة", en: "Rolling", cat: "manufacturing", descAr: "تمرير بين بكرات", descEn: "Passing between rollers" },
    { ar: "سحب", en: "Drawing", cat: "manufacturing", descAr: "سحب عبر قالب", descEn: "Pulling through a die" },
    { ar: "قياس دقيق", en: "Precision Measurement", cat: "manufacturing", descAr: "بأدوات دقيقة", descEn: "With precise instruments" },
    { ar: "تحكم رقمي", en: "CNC", cat: "manufacturing", descAr: "تحكم الحاسوب بالآلات", descEn: "Computer control of machines" },
    { ar: "طباعة ثلاثية الأبعاد", en: "3D Printing", cat: "manufacturing", descAr: "تصنيع طبقة فوق طبقة", descEn: "Manufacturing layer by layer" },
    { ar: "مراقبة الجودة", en: "Quality Control", cat: "manufacturing", descAr: "ضمان جودة المنتجات", descEn: "Ensuring product quality" },

    // ========== تحكم (Control) - 10 ==========
    { ar: "أنظمة التحكم", en: "Control Systems", cat: "control", descAr: "تتحكم بالأنظمة الديناميكية", descEn: "Control dynamic systems" },
    { ar: "حلقة مفتوحة", en: "Open Loop", cat: "control", descAr: "بدون تغذية راجعة", descEn: "Without feedback" },
    { ar: "حلقة مغلقة", en: "Closed Loop", cat: "control", descAr: "مع تغذية راجعة", descEn: "With feedback" },
    { ar: "تغذية راجعة", en: "Feedback", cat: "control", descAr: "إعادة جزء من الإخراج", descEn: "Returning part of output to input" },
    { ar: "متحكم PID", en: "PID Controller", cat: "control", descAr: "تناسب + تكامل + اشتقاق", descEn: "Proportional + Integral + Derivative" },
    { ar: "استقرار النظام", en: "System Stability", cat: "control", descAr: "العودة للتوازن", descEn: "Return to equilibrium" },
    { ar: "دالة التحويل", en: "Transfer Function", cat: "control", descAr: "نسبة الخرج للدخل", descEn: "Output to input ratio" },
    { ar: "استجابة النظام", en: "System Response", cat: "control", descAr: "سلوك النظام مع الزمن", descEn: "System behavior over time" },
    { ar: "زمن الاستقرار", en: "Settling Time", cat: "control", descAr: "الزمن للوصول للاستقرار", descEn: "Time to reach stability" },
    { ar: "زيادة التجاوز", en: "Overshoot", cat: "control", descAr: "تجاوز القيمة المطلوبة", descEn: "Exceeding the target value" },

    // ========== اهتزازات (Vibrations) - 8 ==========
    { ar: "اهتزاز حر", en: "Free Vibration", cat: "vibrations", descAr: "بدون قوة خارجية", descEn: "Without external force" },
    { ar: "اهتزاز قسري", en: "Forced Vibration", cat: "vibrations", descAr: "بقوة خارجية", descEn: "With external force" },
    { ar: "تخميد", en: "Damping", cat: "vibrations", descAr: "تقليل السعة مع الزمن", descEn: "Reducing amplitude with time" },
    { ar: "تردد طبيعي", en: "Natural Frequency", cat: "vibrations", descAr: "تردد الاهتزاز الحر", descEn: "Free vibration frequency" },
    { ar: "رنين", en: "Resonance", cat: "vibrations", descAr: "أقصى سعة", descEn: "Maximum amplitude" },
    { ar: "درجة حرية", en: "Degree of Freedom", cat: "vibrations", descAr: "إحداثيات مستقلة", descEn: "Independent coordinates" },
    { ar: "وضع الاهتزاز", en: "Mode Shape", cat: "vibrations", descAr: "شكل الجسم عند تردد", descEn: "Body shape at a frequency" },
    { ar: "فقدان الطاقة", en: "Energy Dissipation", cat: "vibrations", descAr: "تحول الطاقة لأشكال أخرى", descEn: "Energy converted to other forms" },

    // ========== تصميم (Design) - 12 ==========
    { ar: "تصميم ميكانيكي", en: "Mechanical Design", cat: "design", descAr: "تصميم الأجزاء الميكانيكية", descEn: "Design of mechanical parts" },
    { ar: "تحمل", en: "Bearing", cat: "design", descAr: "يقلل الاحتكاك", descEn: "Reduces friction" },
    { ar: "تروس", en: "Gears", cat: "design", descAr: "تنقل الحركة والقدرة", descEn: "Transmit motion and power" },
    { ar: "سيور", en: "Belts", cat: "design", descAr: "تنقل الحركة بين البكرات", descEn: "Transmit motion between pulleys" },
    { ar: "سلاسل", en: "Chains", cat: "design", descAr: "سلاسل معدنية", descEn: "Metal chains" },
    { ar: "عمود", en: "Shaft", cat: "design", descAr: "جزء دوّار ينقل العزم", descEn: "Rotating part that transmits torque" },
    { ar: "مسمار", en: "Bolt", cat: "design", descAr: "مثبت لولبي", descEn: "Threaded fastener" },
    { ar: "لحام دائم", en: "Permanent Joint", cat: "design", descAr: "لا يمكن فكه", descEn: "Cannot be disassembled" },
    { ar: "وصل مؤقت", en: "Temporary Joint", cat: "design", descAr: "يمكن فكه", descEn: "Can be disassembled" },
    { ar: "تصميم بمساعدة الحاسوب", en: "CAD", cat: "design", descAr: "الحاسوب في التصميم", descEn: "Computer in design" },
    { ar: "تصنيع بمساعدة الحاسوب", en: "CAM", cat: "design", descAr: "الحاسوب في التصنيع", descEn: "Computer in manufacturing" },
    { ar: "هندسة عكسية", en: "Reverse Engineering", cat: "design", descAr: "تحليل منتج لفهم تصميمه", descEn: "Analyzing a product to understand design" },

    // ========== سلامة (Safety) - 6 ==========
    { ar: "سلامة مهنية", en: "Occupational Safety", cat: "safety", descAr: "حماية العاملين", descEn: "Protecting workers" },
    { ar: "صيانة وقائية", en: "Preventive Maintenance", cat: "safety", descAr: "دورية لمنع الأعطال", descEn: "Periodic to prevent failures" },
    { ar: "صيانة علاجية", en: "Corrective Maintenance", cat: "safety", descAr: "بعد حدوث العطل", descEn: "After failure occurs" },
    { ar: "تحليل المخاطر", en: "Risk Analysis", cat: "safety", descAr: "تحديد وتقييم المخاطر", descEn: "Identifying and assessing risks" },
    { ar: "معدات الوقاية", en: "PPE", cat: "safety", descAr: "حماية شخصية", descEn: "Personal protective equipment" },
    { ar: "محركات الاحتراق", en: "Combustion Engines", cat: "safety", descAr: "بحرق الوقود", descEn: "Burning fuel" },

    // ========== سيارات (Automotive) - 8 ==========
    { ar: "هندسة السيارات", en: "Automotive Engineering", cat: "automotive", descAr: "تصميم وتصنيع السيارات", descEn: "Design and manufacturing of vehicles" },
    { ar: "ناقل حركة", en: "Transmission", cat: "automotive", descAr: "ينقل القدرة للعجلات", descEn: "Transmits power to wheels" },
    { ar: "نظام تعليق", en: "Suspension System", cat: "automotive", descAr: "يربط السيارة بالعجلات", descEn: "Connects vehicle to wheels" },
    { ar: "نظام فرامل", en: "Braking System", cat: "automotive", descAr: "لإيقاف السيارة", descEn: "For stopping the vehicle" },
    { ar: "نظام توجيه", en: "Steering System", cat: "automotive", descAr: "للتحكم بالاتجاه", descEn: "For controlling direction" },
    { ar: "احتراق داخلي", en: "Internal Combustion", cat: "automotive", descAr: "احتراق داخل المحرك", descEn: "Combustion inside the engine" },
    { ar: "احتراق خارجي", en: "External Combustion", cat: "automotive", descAr: "احتراق خارج المحرك", descEn: "Combustion outside the engine" },
    { ar: "كفاءة الوقود", en: "Fuel Efficiency", cat: "automotive", descAr: "المسافة لكل وحدة وقود", descEn: "Distance per unit of fuel" },

    // ========== تكييف (HVAC) - 9 ==========
    { ar: "تبريد", en: "Refrigeration", cat: "hvac", descAr: "نقل الحرارة", descEn: "Transfer of heat" },
    { ar: "تكييف", en: "Air Conditioning", cat: "hvac", descAr: "التحكم بدرجة الحرارة والرطوبة", descEn: "Controlling temperature and humidity" },
    { ar: "دورة التبريد", en: "Refrigeration Cycle", cat: "hvac", descAr: "نقل الحرارة من بارد لساخن", descEn: "Moving heat from cold to hot" },
    { ar: "ضاغط", en: "Compressor", cat: "hvac", descAr: "يزيد ضغط الغاز", descEn: "Increases gas pressure" },
    { ar: "مكثف تبريد", en: "Condenser", cat: "hvac", descAr: "يطرد الحرارة", descEn: "Rejects heat" },
    { ar: "مبخر", en: "Evaporator", cat: "hvac", descAr: "يمتص الحرارة", descEn: "Absorbs heat" },
    { ar: "صمام تمدد", en: "Expansion Valve", cat: "hvac", descAr: "يخفض الضغط", descEn: "Reduces pressure" },
    { ar: "معامل الأداء", en: "COP", cat: "hvac", descAr: "كفاءة دورة التبريد", descEn: "Efficiency of refrigeration cycle" },
    { ar: "وسيط تبريد", en: "Refrigerant", cat: "hvac", descAr: "سائل دورة التبريد", descEn: "Refrigeration cycle fluid" }
];

let currentCategory = 'all';

// ===== دوال قاموس المصطلحات =====
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
    const isAr = currentLang === 'ar';
    container.innerHTML = terms.map(t => `
        <div class="dict-item">
            <div class="dict-item-header">
                <h3 class="dict-ar">${isAr ? t.ar : t.en}</h3>
                <span class="dict-en">${isAr ? t.en : t.ar}</span>
            </div>
            <p class="dict-desc">${isAr ? t.descAr : t.descEn}</p>
            <span class="dict-category">${getTermCategoryName(t.cat)}</span>
        </div>
    `).join('');
}

function getTermCategoryName(cat) {
    const isAr = currentLang === 'ar';
    const names = isAr ? {
        mechanics: '⚙️ ميكانيكا', thermo: '🔥 حراريات', fluids: '💧 موائع',
        materials: '🔬 مواد', electric: '⚡ كهرباء', energy: '🌱 طاقة',
        math: '📐 رياضيات', manufacturing: '🏭 إنتاج', control: '🎛️ تحكم',
        vibrations: '〰️ اهتزازات', design: '✏️ تصميم', safety: '🦺 سلامة',
        automotive: '🚗 سيارات', hvac: '❄️ تكييف'
    } : {
        mechanics: '⚙️ Mechanics', thermo: '🔥 Thermo', fluids: '💧 Fluids',
        materials: '🔬 Materials', electric: '⚡ Electric', energy: '🌱 Energy',
        math: '📐 Math', manufacturing: '🏭 Manufacturing', control: '🎛️ Control',
        vibrations: '〰️ Vibrations', design: '✏️ Design', safety: '🦺 Safety',
        automotive: '🚗 Automotive', hvac: '❄️ HVAC'
    };
    return names[cat] || cat;
}

function searchTerms() {
    const query = document.getElementById('dictSearch').value.toLowerCase().trim();
    let filtered = engineeringTerms;
    if (currentCategory !== 'all') filtered = filtered.filter(t => t.cat === currentCategory);
    if (query) {
        filtered = filtered.filter(t =>
            t.ar.toLowerCase().includes(query) ||
            t.en.toLowerCase().includes(query) ||
            t.descAr.toLowerCase().includes(query) ||
            t.descEn.toLowerCase().includes(query)
        );
    }
    renderTerms(filtered);
}

function filterCategory(event, category) {
    currentCategory = category;
    document.querySelectorAll('.dict-cat-btn').forEach(btn => btn.classList.remove('active'));
    event.currentTarget.classList.add('active');
    searchTerms();
}

// ===== ترجمات الواجهة =====
const translations = {
    ar: {
        'nav-home': 'الرئيسية', 'nav-materials': 'المواد', 'nav-plans': 'الخطط الدراسية',
        'nav-exam': 'امتحان الكفاءة', 'nav-programs': 'برامج هندسية', 'nav-calculator': 'الحاسبة',
        'nav-map': 'خريطة الجامعة', 'nav-reminders': 'التذكيرات', 'nav-dictionary': 'القاموس',
        'nav-suggestions': 'شاركنا اقتراحك', 'nav-links': 'روابط تهمك', 'nav-contact': 'تواصل معنا',
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
        'materials-title': '📚 مواد التخصص', 'materials-desc': 'اختر التخصص ثم السنة الدراسية',
        'materials-search': '🔍 ابحث عن مادة...',
        'materials-tab-renewable': '🌱 هندسة الطاقة المتجددة', 'materials-tab-mechanical': '⚙️ هندسة الميكانيك',
        'materials-year-1': '🎓 السنة الأولى', 'materials-year-2': '🎓 السنة الثانية',
        'materials-year-3': '🎓 السنة الثالثة', 'materials-year-4': '🎓 السنة الرابعة', 'materials-year-5': '🎓 السنة الخامسة',
        'plans-title': '📋 الخطط الدراسية', 'plans-desc': 'اختر التخصص والسنة',
        'plans-mechanical': '⚙️ هندسة الميكانيك', 'plans-renewable': '🌱 هندسة الطاقة المتجددة',
        'plans-new-2026': '🆕 الخطة الجديدة 2026', 'plans-2020': '📄 الخطة الدراسية (2020)',
        'plans-2021': '📄 الخطة الدراسية (2021)', 'plans-tree': '🌳 الخطة الشجرية', 'plans-years': '📅 الخطة حسب السنوات',
        'exam-title': '📝 نماذج امتحان الكفاءة', 'exam-desc': 'كل ما تحتاجه للاستعداد',
        'exam-general': '📌 معلومات عامة', 'exam-instructions': '📋 تعليمات امتحان الكفاءة',
        'exam-sample': '📄 نموذج مستوى عام', 'exam-mechanical': '⚙️ نماذج الهندسة الميكانيكية',
        'exam-part-1': '1️⃣ الجزء الأول', 'exam-part-2': '2️⃣ الجزء الثاني',
        'exam-part-3': '3️⃣ الجزء الثالث', 'exam-part-4': '4️⃣ الجزء الرابع',
        'programs-title': '💻 برامج هندسية', 'programs-desc': 'روابط تحميل وشرح',
        'programs-download': 'رابط التحميل', 'programs-video': 'شرح طريقة التثبيت',
        'program-solidworks-desc': 'برنامج التصميم الهندسي ثلاثي الأبعاد - الأشهر في كليات الهندسة.',
        'program-matlab-desc': 'برنامج التحليل الرياضي والحسابات الهندسية.',
        'calc-title': '🧮 الحاسبة الهندسية', 'calc-desc': 'مجموعة حاسبات في مكان واحد',
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
        'map-title': '🗺️ خريطة الجامعة', 'map-desc': 'اكتشف أهم أماكن الجامعة',
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
        'dict-manufacturing': '🏭 إنتاج', 'dict-control': '🎛️ تحكم', 'dict-vibrations': '〰️ اهتزازات',
        'dict-design': '✏️ تصميم', 'dict-safety': '🦺 سلامة', 'dict-automotive': '🚗 سيارات',
        'dict-hvac': '❄️ تكييف',
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
        'nav-suggestions': 'Send Suggestion', 'nav-links': 'Useful Links', 'nav-contact': 'Contact Us',
        'hero-desc': 'Volunteer Academic Team - College of Engineering',
        'hero-btn-materials': '📚 Browse Materials', 'hero-btn-plans': '📋 Study Plans',
        'about-title': 'About Us', 'team-title': '👥 The Team',
        'team-desc': 'Get to know us, our vision, and our mission',
        'team-about': 'About Us', 'team-vision': 'Our Vision', 'team-message': 'Our Mission',
        'favorites-title': '⭐ My Favorites', 'favorites-desc': 'Materials saved in your browser',
        'footer-contact': 'Contact Us', 'footer-copy': '© 2026 Direction Team - Al-Hussein Bin Talal University',
        'footer-love': 'Made with love for engineering students 💜', 'btn-share': 'Share Website',
        'team-about-text': 'A volunteer academic team in the Department of Mechanical Engineering and Renewable Energy Engineering at Al-Hussein Bin Talal University.',
        'team-vision-text': 'Providing the appropriate atmosphere for excellence and creativity in mechanical engineering and renewable energy engineering.',
        'team-message-text': 'Working together to reach a proactive student community.',
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
        'program-solidworks-desc': 'The most famous 3D engineering design software.',
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
        'dict-manufacturing': '🏭 Manufacturing', 'dict-control': '🎛️ Control', 'dict-vibrations': '〰️ Vibrations',
        'dict-design': '✏️ Design', 'dict-safety': '🦺 Safety', 'dict-automotive': '🚗 Automotive',
        'dict-hvac': '❄️ HVAC',
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
    if (document.getElementById('dictList')) renderTerms(engineeringTerms);
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
    if (isNaN(angle)) { alert(currentLang === 'ar' ? 'الرجاء إدخال زاوية' : 'Please enter a valid angle'); return; }
    const radians = angle * Math.PI / 180;
    document.getElementById('sinResult').textContent = Math.sin(radians).toFixed(4);
    document.getElementById('cosResult').textContent = Math.cos(radians).toFixed(4);
    document.getElementById('tanResult').textContent = Math.tan(radians).toFixed(4);
    document.getElementById('triangleResult').style.display = 'block';
}

function calculatePower() {
    const v = parseFloat(document.getElementById('voltageInput').value);
    const i = parseFloat(document.getElementById('currentInput').value);
    if (isNaN(v) || isNaN(i)) { alert(currentLang === 'ar' ? 'الرجاء إدخال قيم' : 'Please enter valid values'); return; }
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
    if (isNaN(m) || isNaN(c) || isNaN(dt)) { alert(currentLang === 'ar' ? 'الرجاء إدخال قيم' : 'Please enter valid values'); return; }
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
    if (isNaN(f) || isNaN(a) || a === 0) { alert(currentLang === 'ar' ? 'الرجاء إدخال قيم' : 'Please enter valid values'); return; }
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
    if (isNaN(value)) { alert(currentLang === 'ar' ? 'الرجاء إدخال قيمة' : 'Please enter a valid value'); return; }
    const toMeter = { m: 1, cm: 0.01, mm: 0.001, km: 1000, inch: 0.0254, ft: 0.3048 };
    const result = (value * toMeter[from]) / toMeter[to];
    document.getElementById('unitResult').textContent = result.toFixed(6) + ' ' + to;
    document.getElementById('unitsResult').style.display = 'block';
}

// ===== نظام التذكيرات =====
let reminderFilter = 'all';
function getReminders() { return JSON.parse(localStorage.getItem('reminders') || '[]'); }
function saveReminders(reminders) { localStorage.setItem('reminders', JSON.stringify(rem
                                                                                     
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
    reminders.push({ id: Date.now(), title, date, time: time || '00:00', priority, type, completed: false, createdAt: new Date().toISOString() });
    saveReminders(reminders);

    document.getElementById('reminderTitle').value = '';
    document.getElementById('reminderDate').value = '';
    document.getElementById('reminderTime').value = '';
    renderReminders();
    showNotification(currentLang === 'ar' ? '✅ تم إضافة التذكير!' : '✅ Reminder added!');

    if ('Notification' in window && Notification.permission === 'default') Notification.requestPermission();
}

function deleteReminder(id) {
    const isAr = currentLang === 'ar';
    if (!confirm(isAr ? 'حذف هذا التذكير؟' : 'Delete this reminder?')) return;
    saveReminders(getReminders().filter(r => r.id !== id));
    renderReminders();
    showNotification(isAr ? '🗑️ تم الحذف' : '🗑️ Deleted');
}

function toggleComplete(id) {
    const reminders = getReminders();
    const reminder = reminders.find(r => r.id === id);
    if (reminder) { reminder.completed = !reminder.completed; saveReminders(reminders); renderReminders(); }
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

function getTypeIcon(type) { return { exam: '📝', homework: '📚', project: '🔬', meeting: '👥', other: '📌' }[type] || '📌'; }

function getTypeName(type) {
    const isAr = currentLang === 'ar';
    const names = isAr ? { exam: 'امتحان', homework: 'واجب', project: 'مشروع', meeting: 'اجتماع', other: 'أخرى' }
                        : { exam: 'Exam', homework: 'Homework', project: 'Project', meeting: 'Meeting', other: 'Other' };
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
    return new Date(dateStr).toLocaleDateString(isAr ? 'ar-EG' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' });
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

    if (reminderFilter === 'upcoming') reminders = reminders.filter(r => !r.completed && new Date(r.date + 'T' + r.time) >= now);
    else if (reminderFilter === 'past') reminders = reminders.filter(r => r.completed || new Date(r.date + 'T' + r.time) < now);

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
    setTimeout(() => { notif.classList.remove('show'); setTimeout(() => notif.remove(), 300); }, 2500);
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
                try { new Notification('⏰ Direction Team', { body: `${r.title} - ${r.time}`, icon: 'logo.png', tag: 'reminder-' + r.id }); } catch (e) {}
            }
        }
    });
}

function requestNotificationPermission() {
    if (!('Notification' in window)) { showNotification(currentLang === 'ar' ? '⚠️ غير مدعوم' : '⚠️ Not supported'); return; }
    if (Notification.permission === 'granted') { showNotification(currentLang === 'ar' ? '✅ مفعّلة مسبقاً' : '✅ Already enabled'); updateNotifButton(); return; }
    if (Notification.permission === 'denied') { showNotification(currentLang === 'ar' ? '❌ مرفوضة' : '❌ Denied'); updateNotifButton(); return; }
    Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
            showNotification(currentLang === 'ar' ? '🎉 تم التفعيل!' : '🎉 Enabled!');
            try { new Notification('⏰ Direction Team', { body: currentLang === 'ar' ? 'ستصلك إشعارات التذكيرات' : 'You will receive notifications', icon: 'logo.png' }); } catch (e) {}
        } else {
            showNotification(currentLang === 'ar' ? '❌ لم يتم التفعيل' : '❌ Not enabled');
        }
        updateNotifButton();
    });
}

function updateNotifButton() {
    const btn = document.getElementById('enableNotifBtn');
    if (!btn) return;
    if (!('Notification' in window)) { btn.classList.add('denied'); btn.innerHTML = '❌ <span>' + (currentLang === 'ar' ? 'غير مدعوم' : 'Not supported') + '</span>'; btn.disabled = true; return; }
    if (Notification.permission === 'granted') { btn.classList.add('enabled'); btn.innerHTML = '✅ <span>' + (currentLang === 'ar' ? 'الإشعارات مفعّلة' : 'Notifications enabled') + '</span>'; btn.disabled = true; }
    else if (Notification.permission === 'denied') { btn.classList.add('denied'); btn.innerHTML = '❌ <span>' + (currentLang === 'ar' ? 'الإشعارات مرفوضة' : 'Notifications denied') + '</span>'; }
    else { btn.innerHTML = '🔔 <span>' + (currentLang === 'ar' ? 'تفعيل الإشعارات' : 'Enable Notifications') + '</span>'; }
}

// ===== القاموس - الرموز =====
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
    { symbol: "( )", name: "أقواس", fullName: "Parentheses", cat: "programming", desc: "الدوال" },
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
    if (symbols.length === 0) { container.innerHTML = ''; if (noResults) noResults.style.display = 'block'; return; }
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
    if (localStorage.getItem('siteLanguage') === 'en') applyLanguage();
    const firstYear = document.querySelector('.tab-content.active .year-card') || document.querySelector('.year-card');
    if (firstYear) firstYear.classList.add('active');
    applySavedTheme();
    showRealLastUpdate();
    if (document.getElementById('favoritesList')) displayFavorites();
    if (document.getElementById('renewable') || document.getElementById('mechanical')) {
        setTimeout(() => { addShareButtons(); addFavoriteButtons(); }, 100);
    }
    if (document.getElementById('remindersList')) {
        renderReminders();
        const dateInput = document.getElementById('reminderDate');
        if (dateInput) { const today = new Date().toISOString().split('T')[0]; dateInput.value = today; }
        if (document.getElementById('enableNotifBtn')) updateNotifButton();
        checkUpcomingReminders();
        setInterval(checkUpcomingReminders, 30 * 1000);
    }
    if (document.getElementById('dictList')) renderTerms(engineeringTerms);
    if (document.getElementById('symbolList')) renderSymbols(engineeringSymbols);
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
