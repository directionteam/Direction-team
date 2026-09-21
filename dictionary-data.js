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
            <p class="dict-desc">${t.desc}</p>
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
        math: '📐 رياضيات'
    } : {
        mechanics: '⚙️ Mechanics',
        thermo: '🔥 Thermo',
        fluids: '💧 Fluids',
        materials: '🔬 Materials',
        electric: '⚡ Electric',
        energy: '🌱 Energy',
        math: '📐 Math'
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
            t.desc.toLowerCase().includes(query)
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


