/**
 * مدير قاعدة البيانات المحلية للأسئلة والأجوبة
 * يتعامل مع حفظ وتحميل واسترجاع الأسئلة والأجوبة
 */

class QAManager {
  constructor() {
    this.storageKey = 'bawaba_qa_database';
    this.defaultQA = this.getDefaultQA();
    this.loadDatabase();
  }

  // ── GET DEFAULT Q&A ──
  getDefaultQA() {
    return [
      {
        id: 1,
        keywords: ['تفتيش قضائي', 'التفتيش القضائي'],
        answer: 'التفتيش القضائي: إجراء تحقيقي للكشف عن الأدلة المادية.\n\nشروطه:\n• إذن من المحكمة المختصة\n• وجود دلائل كافية\n• في أوقات محددة (النهار عادة)\n\nالاستثناء: يجوز ليلاً في حالة التلبس أو الخطر الداهم.',
        category: 'إجراءات جزائية',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 2,
        keywords: ['تلبس', 'جريمة'],
        answer: 'التلبس بالجريمة (م.37):\n• مشاهدة الجريمة حال ارتكابها\n• ضبط الجاني بعدها بوقت قصير\n• وجود آثار تدل على ارتكابها\n\nأثره: يجيز القبض بدون أمر قضائي.',
        category: 'جرائم',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 3,
        keywords: ['استجواب', 'محاكمة'],
        answer: 'الاستجواب: مناقشة المتهم في الأدلة المنسوبة إليه.\n\nضماناته:\n• بحضور المحامي\n• حق الصمت\n• لا إكراه أو تهديد\n• الإقرار تحت الإكراه باطل',
        category: 'إجراءات جزائية',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 4,
        keywords: ['قبض', 'توقيف'],
        answer: 'القبض والتوقيف:\n• لا يجوز إلا بأمر قضائي أو حالة التلبس\n• مدة التوقيف الأولى: 48 ساعة\n• أقصى مدة في الجنح: 6 أشهر\n• أقصى مدة في الجنايات: سنة قابلة للتمديد',
        category: 'إجراءات جزائية',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 5,
        keywords: ['جريمة', 'تعريف'],
        answer: 'الجريمة: كل فعل أو امتناع يعاقب عليه القانون.\n\nأنواعها:\n• جنايات: الإعدام أو السجن المؤبد أو المؤقت\n• جنح: السجن قصير أو الغرامة\n• مخالفات: أخف الجرائم',
        category: 'تعريفات',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 6,
        keywords: ['زواج', 'أركان'],
        answer: 'أركان عقد الزواج:\n• الإيجاب والقبول\n• الولي\n• شاهدان عدلان\n• الزوجان خاليان من الموانع الشرعية\n• المهر',
        category: 'أحوال شخصية',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 7,
        keywords: ['طلاق', 'أنواع'],
        answer: 'أنواع الطلاق:\n• رجعي: للزوج المراجعة خلال العدة\n• بائن صغرى: يحتاج عقدا جديدا\n• بائن كبرى (الثلاث): لا تحل له حتى تنكح زوجا آخر',
        category: 'أحوال شخصية',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 8,
        keywords: ['جنسية', 'تجنيس'],
        answer: 'شروط التجنيس (م.8):\n• إقامة قانونية متواصلة 20 سنة\n• بلوغ سن الرشد\n• حسن السيرة\n• زوجة العماني: بعد 3 سنوات من الزواج',
        category: 'جنسية',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 9,
        keywords: ['إرهاب', 'عقوبة'],
        answer: 'عقوبات الإرهاب:\n• قيادة المنظمة: السجن المؤبد (م.11)\n• الانضمام كعضو: 10-20 سنة (م.12)\n• تمويل الإرهاب: 7-15 سنة (م.20)\n• الاعتداء على السلطان: الإعدام (م.9)',
        category: 'جرائم',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 10,
        keywords: ['شرطة', 'تعيين'],
        answer: 'شروط التعيين في الشرطة (م.12):\n• عماني الجنسية\n• بالغ سن الرشد\n• غير محكوم عليه بجريمة مخلة بالشرف\n• لائق طبيا\n• حسن السيرة',
        category: 'قانون الشرطة',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
  }

  // ── LOAD DATABASE ──
  loadDatabase() {
    const stored = localStorage.getItem(this.storageKey);
    if (stored) {
      try {
        this.database = JSON.parse(stored);
      } catch (e) {
        console.error('خطأ في تحميل قاعدة البيانات:', e);
        this.database = this.defaultQA;
        this.saveDatabase();
      }
    } else {
      this.database = this.defaultQA;
      this.saveDatabase();
    }
  }

  // ── SAVE DATABASE ──
  saveDatabase() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.database));
      return true;
    } catch (e) {
      console.error('خطأ في حفظ قاعدة البيانات:', e);
      return false;
    }
  }

  // ── GET ALL Q&A ──
  getAll() {
    return this.database;
  }

  // ── GET BY ID ──
  getById(id) {
    return this.database.find(qa => qa.id === id);
  }

  // ── SEARCH Q&A ──
  search(query) {
    const lower = query.toLowerCase();
    return this.database.filter(qa =>
      qa.keywords.some(k => k.includes(lower)) ||
      qa.answer.includes(lower) ||
      qa.category.includes(lower)
    );
  }

  // ── GET BY CATEGORY ──
  getByCategory(category) {
    return this.database.filter(qa => qa.category === category);
  }

  // ── GET CATEGORIES ──
  getCategories() {
    return [...new Set(this.database.map(qa => qa.category))];
  }

  // ── ADD Q&A ──
  add(keywords, answer, category) {
    const newId = Math.max(...this.database.map(qa => qa.id), 0) + 1;
    const newQA = {
      id: newId,
      keywords: Array.isArray(keywords) ? keywords : [keywords],
      answer: answer,
      category: category || 'عام',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.database.push(newQA);
    this.saveDatabase();
    return newQA;
  }

  // ── UPDATE Q&A ──
  update(id, keywords, answer, category) {
    const qa = this.getById(id);
    if (!qa) return null;
    
    qa.keywords = Array.isArray(keywords) ? keywords : [keywords];
    qa.answer = answer;
    qa.category = category || qa.category;
    qa.updatedAt = new Date().toISOString();
    
    this.saveDatabase();
    return qa;
  }

  // ── DELETE Q&A ──
  delete(id) {
    const index = this.database.findIndex(qa => qa.id === id);
    if (index === -1) return false;
    
    this.database.splice(index, 1);
    this.saveDatabase();
    return true;
  }

  // ── FIND ANSWER ──
  findAnswer(question) {
    const lower = question.toLowerCase();
    for (let qa of this.database) {
      for (let keyword of qa.keywords) {
        if (lower.includes(keyword)) {
          return qa.answer;
        }
      }
    }
    return null;
  }

  // ── EXPORT DATA ──
  exportData() {
    return JSON.stringify(this.database, null, 2);
  }

  // ── IMPORT DATA ──
  importData(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      if (Array.isArray(data)) {
        this.database = data;
        this.saveDatabase();
        return true;
      }
      return false;
    } catch (e) {
      console.error('خطأ في استيراد البيانات:', e);
      return false;
    }
  }

  // ── RESET TO DEFAULT ──
  resetToDefault() {
    this.database = this.getDefaultQA();
    this.saveDatabase();
    return true;
  }

  // ── GET STATISTICS ──
  getStatistics() {
    return {
      totalQA: this.database.length,
      categories: this.getCategories().length,
      categoryBreakdown: this.getCategories().map(cat => ({
        category: cat,
        count: this.getByCategory(cat).length
      }))
    };
  }
}

// Create global instance
const qaManager = new QAManager();
