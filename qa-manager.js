/**
 * مدير الأسئلة والأجوبة المحسّن
 * قاعدة بيانات شاملة للقوانين العمانية مع بحث ذكي
 */

class QAManager {
  constructor() {
    this.storageKey = 'bawaba_qa_database';
    this.database = [];
    this.loadDatabase();
  }

  // ── قاعدة البيانات الشاملة ──
  getDefaultDatabase() {
    return [
      // ── قانون الشرطة ──
      { id: 1, keywords: ['شرطة عمان', 'شرطة السلطانية', 'الشرطة'], answer: 'شرطة عمان السلطانية: جهاز أمني متخصص في المحافظة على الأمن والنظام والنظام العام. تتمتع بصلاحيات قانونية واسعة وتتبع وزارة الداخلية.', category: 'قانون الشرطة', createdAt: new Date().toISOString() },
      { id: 2, keywords: ['المفتش العام', 'قائد الشرطة', 'رئيس الشرطة'], answer: 'المفتش العام للشرطة والجمارك: القائد الأعلى لشرطة عمان السلطانية. رتبته فريق وهو يتمتع بصلاحيات واسعة.', category: 'قانون الشرطة', createdAt: new Date().toISOString() },
      { id: 3, keywords: ['الشرطة النسائية', 'عنصر نسائي'], answer: 'الشرطة النسائية: وحدة متخصصة في شرطة عمان السلطانية تضم عنصراً نسائياً. بدأت عام 1973م وتلعب دوراً مهماً في الأمن.', category: 'قانون الشرطة', createdAt: new Date().toISOString() },
      { id: 4, keywords: ['أكاديمية الشرطة', 'أكاديمية السلطان قابوس'], answer: 'أكاديمية السلطان قابوس لعلوم الشرطة: مؤسسة تدريبية متخصصة في تدريب رجال الشرطة. تقع في نزوى بالداخلية.', category: 'قانون الشرطة', createdAt: new Date().toISOString() },
      { id: 5, keywords: ['السجون', 'الإدارة العامة للسجون'], answer: 'الإدارة العامة للسجون: مسؤولة عن إدارة السجون والمعتقلات وتطبيق الأحكام. تتبع وزارة الداخلية.', category: 'قانون الشرطة', createdAt: new Date().toISOString() },
      { id: 6, keywords: ['المرور', 'إدارة المرور', 'تنظيم المرور'], answer: 'الإدارة العامة للمرور: مسؤولة عن تنظيم المرور والحوادث والمخالفات المرورية. تتبع شرطة عمان السلطانية.', category: 'قانون الشرطة', createdAt: new Date().toISOString() },
      { id: 7, keywords: ['خفر السواحل', 'شرطة خفر السواحل'], answer: 'قيادة شرطة خفر السواحل: مسؤولة عن مراقبة السواحل والمياه الإقليمية والحدود البحرية. تتبع شرطة عمان السلطانية.', category: 'قانون الشرطة', createdAt: new Date().toISOString() },
      { id: 8, keywords: ['المهام الخاصة', 'شرطة المهام الخاصة'], answer: 'قيادة شرطة المهام الخاصة: مسؤولة عن مواجهة أعمال تخل بالنظام العام والإرهاب. تتبع شرطة عمان السلطانية.', category: 'قانون الشرطة', createdAt: new Date().toISOString() },
      { id: 9, keywords: ['الإنتربول', 'منظمة الإنتربول'], answer: 'منظمة الإنتربول الدولية: منظمة دولية للتعاون الشرطي بين دول العالم. انضمت عمان عام 1972م.', category: 'قانون الشرطة', createdAt: new Date().toISOString() },

      // ── الجرائم والعقوبات ──
      { id: 10, keywords: ['جريمة', 'تعريف الجريمة'], answer: 'الجريمة: فعل أو امتناع عن فعل يخالف القانون ويستحق العقاب. تنقسم الجرائم إلى: جنايات وجنح ومخالفات.', category: 'الجرائم', createdAt: new Date().toISOString() },
      { id: 11, keywords: ['جنايات', 'الجنايات'], answer: 'الجنايات: الجرائم التي يعاقب عليها بالإعدام أو السجن المؤبد أو السجن لمدة تزيد على 3 سنوات.', category: 'الجرائم', createdAt: new Date().toISOString() },
      { id: 12, keywords: ['جنح', 'الجنح'], answer: 'الجنح: الجرائم التي يعاقب عليها بالسجن من 3 أيام إلى 3 سنوات أو بالغرامة من 50 إلى 1000 ريال عماني.', category: 'الجرائم', createdAt: new Date().toISOString() },
      { id: 13, keywords: ['مخالفات', 'المخالفات'], answer: 'المخالفات: الجرائم التي يعاقب عليها بالسجن من يوم إلى يومين أو بالغرامة من 10 إلى 50 ريال عماني.', category: 'الجرائم', createdAt: new Date().toISOString() },
      { id: 14, keywords: ['عقوبة', 'العقوبة', 'أنواع العقوبات'], answer: 'العقوبة: الجزاء الذي يفرضه القانون على من يرتكب جريمة. أنواع العقوبات: إعدام، سجن، غرامة، مصادرة، حرمان من الحقوق.', category: 'الجرائم', createdAt: new Date().toISOString() },
      { id: 15, keywords: ['إدانة', 'الإدانة'], answer: 'الإدانة: قرار قضائي بإثبات ارتكاب الشخص للجريمة. يجب أن تكون الإدانة بناءً على أدلة قاطعة وقطعية.', category: 'الجرائم', createdAt: new Date().toISOString() },
      { id: 16, keywords: ['براءة', 'براءة الذمة'], answer: 'براءة الذمة: حالة الشخص الذي لم يثبت ارتكابه للجريمة. الأصل براءة الذمة إلا بإدانة قضائية.', category: 'الجرائم', createdAt: new Date().toISOString() },

      // ── الإجراءات الجنائية ──
      { id: 17, keywords: ['تحقيق', 'التحقيق', 'إجراء التحقيق'], answer: 'التحقيق: إجراء قانوني للتحقق من صحة الاتهام والبحث عن الأدلة. يجريه المحقق أو الشرطة تحت إشراف النيابة العامة.', category: 'الإجراءات', createdAt: new Date().toISOString() },
      { id: 18, keywords: ['تفتيش', 'التفتيش القضائي'], answer: 'التفتيش القضائي (م.38): إجراء تحقيقي يقوم به المحقق أو الشرطة للبحث عن الأدلة والأشياء المتعلقة بالجريمة.', category: 'الإجراءات', createdAt: new Date().toISOString() },
      { id: 19, keywords: ['اعتقال', 'الاعتقال'], answer: 'الاعتقال: حرمان الشخص من حريته بناءً على أمر قضائي. لا يجوز الاعتقال إلا بأمر من القاضي أو النيابة العامة.', category: 'الإجراءات', createdAt: new Date().toISOString() },
      { id: 20, keywords: ['محاكمة', 'المحاكمة'], answer: 'المحاكمة: إجراء قانوني تقيمه المحكمة للفصل في الدعوى. يجب أن تكون المحاكمة علنية وعادلة وتحترم حقوق المتهم.', category: 'الإجراءات', createdAt: new Date().toISOString() },
      { id: 21, keywords: ['دفاع', 'الدفاع', 'حق الدفاع'], answer: 'الدفاع: حق المتهم في الدفاع عن نفسه أمام المحكمة. يجب أن يتمتع المتهم بحق الدفاع الكامل والعادل.', category: 'الإجراءات', createdAt: new Date().toISOString() },
      { id: 22, keywords: ['شهادة', 'الشهادة'], answer: 'الشهادة: إخبار الشاهد بما رآه أو سمعه أو علمه عن الواقعة المدعى بها. يجب أن تكون الشهادة صريحة وواضحة وتحت القسم.', category: 'الإجراءات', createdAt: new Date().toISOString() },
      { id: 23, keywords: ['أدلة', 'الأدلة'], answer: 'الأدلة: كل ما يثبت أو ينفي واقعة معينة. أنواع الأدلة: شهادة، وثائق، خبرة، معاينة، اعترافات.', category: 'الإجراءات', createdAt: new Date().toISOString() },
      { id: 24, keywords: ['وثائق', 'الوثائق'], answer: 'الوثائق: أوراق مكتوبة تثبت واقعة معينة. يجب أن تكون الوثائق أصلية أو مصدقة من جهات رسمية.', category: 'الإجراءات', createdAt: new Date().toISOString() },
      { id: 25, keywords: ['خبرة', 'الخبرة'], answer: 'الخبرة: رأي الخبير في مسألة تتطلب معرفة فنية أو علمية خاصة. يجب أن يكون الخبير محايداً وذا خبرة معترف بها.', category: 'الإجراءات', createdAt: new Date().toISOString() },
      { id: 26, keywords: ['معاينة', 'المعاينة'], answer: 'المعاينة: فحص المحقق أو القاضي للمكان أو الشيء المتعلق بالجريمة. تتم المعاينة بحضور الأطراف ذات الصلة.', category: 'الإجراءات', createdAt: new Date().toISOString() },

      // ── الطعن والاستئناف ──
      { id: 27, keywords: ['استئناف', 'الاستئناف'], answer: 'الاستئناف: طريقة طعن في الحكم أمام محكمة أعلى درجة. يجب تقديم الاستئناف خلال 30 يوماً من صدور الحكم.', category: 'الطعن', createdAt: new Date().toISOString() },
      { id: 28, keywords: ['نقض', 'النقض'], answer: 'النقض: طريقة طعن في الحكم أمام محكمة النقض. يكون النقض للأحكام النهائية فقط والمتعلقة بمخالفة القانون.', category: 'الطعن', createdAt: new Date().toISOString() },
      { id: 29, keywords: ['حكم', 'الحكم'], answer: 'الحكم: قرار صادر من المحكمة بناءً على الأدلة والمرافعات. يجب أن يكون الحكم معللاً ومكتوباً وموقعاً من القاضي.', category: 'الطعن', createdAt: new Date().toISOString() },

      // ── الحقوق والحريات ──
      { id: 30, keywords: ['حرية', 'الحرية'], answer: 'الحرية: حق أساسي للإنسان. لا يجوز انتهاك الحرية إلا بناءً على القانون وبأمر قضائي.', category: 'الحقوق', createdAt: new Date().toISOString() },
      { id: 31, keywords: ['كرامة', 'كرامة الإنسان'], answer: 'كرامة الإنسان: حق أساسي لا يجوز انتهاكه. يجب احترام كرامة الإنسان في جميع الأحوال والإجراءات.', category: 'الحقوق', createdAt: new Date().toISOString() },
      { id: 32, keywords: ['مساواة', 'المساواة'], answer: 'المساواة: مبدأ أساسي في القانون. الجميع متساوون أمام القانون بغض النظر عن الجنس أو العرق أو الدين.', category: 'الحقوق', createdAt: new Date().toISOString() },
      { id: 33, keywords: ['عدالة', 'العدالة'], answer: 'العدالة: المبدأ الأساسي للنظام القانوني. تقوم على المساواة والإنصاف والحق والقانون.', category: 'الحقوق', createdAt: new Date().toISOString() },

      // ── التلبس ──
      { id: 34, keywords: ['تلبس', 'التلبس بالجريمة'], answer: 'التلبس بالجريمة (م.37): هو مشاهدة الجريمة حال ارتكابها أو مشاهدة الجاني بعدها بوقت قصير أو وجود آثار تدل على ارتكابه للجريمة.', category: 'الجرائم', createdAt: new Date().toISOString() },

      // ── الجنسية ──
      { id: 35, keywords: ['جنسية', 'الجنسية'], answer: 'الجنسية: الرابطة القانونية بين الشخص والدولة. تكتسب الجنسية بالولادة أو التجنس أو الزواج.', category: 'الجنسية', createdAt: new Date().toISOString() },

      // ── القانون العام ──
      { id: 36, keywords: ['قانون', 'القانون'], answer: 'القانون: مجموعة القواعد التي تحكم سلوك الأفراد والدول. يجب احترام القانون من قبل الجميع.', category: 'عام', createdAt: new Date().toISOString() },
      { id: 37, keywords: ['مرسوم', 'المرسوم السلطاني'], answer: 'المرسوم السلطاني: قرار يصدره السلطان وهو أعلى درجة من التشريعات. يجب نشره في الجريدة الرسمية.', category: 'عام', createdAt: new Date().toISOString() },
      { id: 38, keywords: ['قانون جزائي', 'القانون الجنائي'], answer: 'القانون الجنائي: مجموعة القواعد التي تحدد الجرائم والعقوبات. يطبق على كل من يرتكب جريمة.', category: 'عام', createdAt: new Date().toISOString() },
    ];
  }

  // ── LOAD DATABASE ──
  loadDatabase() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        this.database = JSON.parse(stored);
      } else {
        this.database = this.getDefaultDatabase();
        this.saveDatabase();
      }
    } catch (e) {
      console.error('❌ خطأ في تحميل قاعدة البيانات:', e);
      this.database = this.getDefaultDatabase();
    }
  }

  // ── SAVE DATABASE ──
  saveDatabase() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.database));
    } catch (e) {
      console.error('❌ خطأ في حفظ قاعدة البيانات:', e);
    }
  }

  // ── FIND ANSWER (محسّن) ──
  findAnswer(question) {
    if (!question || question.trim().length === 0) return null;

    const q = question.toLowerCase().trim();
    const words = q.split(/\s+/);

    // البحث الدقيق أولاً
    for (const item of this.database) {
      for (const keyword of item.keywords) {
        if (q.includes(keyword.toLowerCase())) {
          return item.answer;
        }
      }
    }

    // البحث الجزئي
    for (const word of words) {
      if (word.length > 2) {
        for (const item of this.database) {
          for (const keyword of item.keywords) {
            if (keyword.toLowerCase().includes(word) || word.includes(keyword.toLowerCase())) {
              return item.answer;
            }
          }
        }
      }
    }

    // البحث حسب الفئة إذا لم نجد شيء
    for (const word of words) {
      if (word.length > 3) {
        for (const item of this.database) {
          if (item.category.toLowerCase().includes(word)) {
            return item.answer;
          }
        }
      }
    }

    return null;
  }

  // ── GET ALL ──
  getAll() {
    return this.database;
  }

  // ── SEARCH ──
  search(query) {
    const q = query.toLowerCase();
    return this.database.filter(item =>
      item.keywords.some(k => k.toLowerCase().includes(q)) ||
      item.answer.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    );
  }

  // ── ADD ──
  add(keywords, answer, category) {
    const newItem = {
      id: Math.max(...this.database.map(i => i.id), 0) + 1,
      keywords: Array.isArray(keywords) ? keywords : [keywords],
      answer,
      category,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.database.push(newItem);
    this.saveDatabase();
    return newItem;
  }

  // ── UPDATE ──
  update(id, keywords, answer, category) {
    const item = this.database.find(i => i.id === id);
    if (item) {
      item.keywords = Array.isArray(keywords) ? keywords : [keywords];
      item.answer = answer;
      item.category = category;
      item.updatedAt = new Date().toISOString();
      this.saveDatabase();
      return item;
    }
    return null;
  }

  // ── DELETE ──
  delete(id) {
    const index = this.database.findIndex(i => i.id === id);
    if (index !== -1) {
      this.database.splice(index, 1);
      this.saveDatabase();
      return true;
    }
    return false;
  }

  // ── EXPORT ──
  export() {
    return JSON.stringify(this.database, null, 2);
  }

  // ── IMPORT ──
  import(jsonData) {
    try {
      this.database = JSON.parse(jsonData);
      this.saveDatabase();
      return true;
    } catch (e) {
      console.error('❌ خطأ في استيراد البيانات:', e);
      return false;
    }
  }

  // ── RESET ──
  reset() {
    this.database = this.getDefaultDatabase();
    this.saveDatabase();
  }

  // ── GET STATS ──
  getStats() {
    return {
      total: this.database.length,
      categories: [...new Set(this.database.map(i => i.category))].length,
      keywords: this.database.reduce((sum, i) => sum + i.keywords.length, 0)
    };
  }
};

// ── GLOBAL INSTANCE ──
const qaManager = new QAManager();
