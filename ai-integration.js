/**
 * نظام تكامل الذكاء الاصطناعي مع جميع البطاقات
 * يسمح للطالب بطلب مساعدة الذكاء الاصطناعي من أي بطاقة سؤال
 */

const aiIntegration = {
  // ── CONFIGURATION ──
  config: {
    apiKey: 'sk-proj-', // سيتم ملؤه من المتغيرات
    model: 'gpt-4-mini',
    temperature: 0.7,
    maxTokens: 500,
  },

  // ── INITIALIZE ──
  init() {
    this.injectAIButtons();
    this.setupAIModal();
    this.setupEventListeners();
    console.log('✅ نظام الذكاء الاصطناعي جاهز');
  },

  // ── INJECT AI BUTTONS ──
  injectAIButtons() {
    // البحث عن جميع بطاقات الأسئلة
    const qCards = document.querySelectorAll('.q-card');
    
    qCards.forEach((card, index) => {
      // تجنب الإضافة المتكررة
      if (card.querySelector('.ai-help-btn')) return;

      // إنشاء زر المساعدة
      const aiBtn = document.createElement('button');
      aiBtn.className = 'ai-help-btn';
      aiBtn.innerHTML = '🤖 اسأل الذكاء الاصطناعي';
      aiBtn.onclick = (e) => {
        e.preventDefault();
        this.openAIHelper(card, index);
      };

      // إضافة الزر إلى البطاقة
      const qText = card.querySelector('.q-text');
      if (qText) {
        qText.parentNode.insertBefore(aiBtn, qText.nextSibling);
      }
    });
  },

  // ── SETUP AI MODAL ──
  setupAIModal() {
    if (document.getElementById('ai-modal')) return;

    const modal = document.createElement('div');
    modal.id = 'ai-modal';
    modal.className = 'ai-modal';
    modal.innerHTML = `
      <div class="ai-modal-content">
        <div class="ai-modal-header">
          <h2>🤖 مساعد الذكاء الاصطناعي</h2>
          <button class="ai-modal-close" onclick="aiIntegration.closeAIHelper()">✕</button>
        </div>
        
        <div class="ai-modal-body">
          <div class="ai-question-display"></div>
          <div class="ai-loading" style="display:none;">
            <div class="ai-spinner"></div>
            <p>جاري التفكير...</p>
          </div>
          <div class="ai-response"></div>
        </div>
        
        <div class="ai-modal-footer">
          <button class="ai-btn-copy" onclick="aiIntegration.copyResponse()">📋 نسخ الإجابة</button>
          <button class="ai-btn-close" onclick="aiIntegration.closeAIHelper()">إغلاق</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
  },

  // ── OPEN AI HELPER ──
  openAIHelper(card, index) {
    // استخراج السؤال من البطاقة
    const qText = card.querySelector('.q-text')?.textContent || '';
    const qNum = card.querySelector('.q-num')?.textContent || `السؤال ${index + 1}`;
    
    if (!qText) {
      alert('❌ لم يتم العثور على السؤال');
      return;
    }

    // عرض السؤال
    const modal = document.getElementById('ai-modal');
    const qDisplay = modal.querySelector('.ai-question-display');
    qDisplay.innerHTML = `
      <div class="ai-q-header">${qNum}</div>
      <div class="ai-q-text">${qText}</div>
    `;

    // عرض Modal
    modal.classList.add('show');

    // طلب الإجابة من الذكاء الاصطناعي
    this.getAIResponse(qText, card);
  },

  // ── GET AI RESPONSE ──
  async getAIResponse(question, card) {
    const modal = document.getElementById('ai-modal');
    const loading = modal.querySelector('.ai-loading');
    const response = modal.querySelector('.ai-response');

    // عرض التحميل
    loading.style.display = 'flex';
    response.innerHTML = '';

    try {
      // محاولة استخدام OpenAI API
      const answer = await this.fetchFromOpenAI(question);
      
      if (answer) {
        response.innerHTML = `
          <div class="ai-answer">
            <div class="ai-answer-title">💡 الإجابة:</div>
            <div class="ai-answer-text">${this.formatAnswer(answer)}</div>
          </div>
        `;
      } else {
        throw new Error('لم تأتِ إجابة');
      }
    } catch (error) {
      console.error('❌ خطأ:', error);
      
      // استخدام الإجابة المحلية كبديل
      const localAnswer = this.getLocalAnswer(question);
      
      response.innerHTML = `
        <div class="ai-answer">
          <div class="ai-answer-title">📚 الإجابة (من قاعدة البيانات):</div>
          <div class="ai-answer-text">${this.formatAnswer(localAnswer)}</div>
        </div>
      `;
    } finally {
      loading.style.display = 'none';
    }
  },

  // ── FETCH FROM OPENAI ──
  async fetchFromOpenAI(question) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`
        },
        body: JSON.stringify({
          model: this.config.model,
          messages: [
            {
              role: 'system',
              content: 'أنت مساعد قانوني متخصص في القوانين العمانية. قدم إجابات دقيقة وشاملة.'
            },
            {
              role: 'user',
              content: question
            }
          ],
          temperature: this.config.temperature,
          max_tokens: this.config.maxTokens
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.warn('⚠️ لم يتمكن من الاتصال بـ OpenAI:', error);
      return null;
    }
  },

  // ── GET LOCAL ANSWER ──
  getLocalAnswer(question) {
    // قاعدة بيانات محلية بسيطة
    const answers = {
      'تفتيش': 'التفتيش القضائي: إجراء تحقيقي يقوم به المحقق أو الشرطة للبحث عن الأدلة والأشياء المتعلقة بالجريمة.',
      'شهادة': 'الشهادة: إخبار الشاهد بما رآه أو سمعه أو علمه عن الواقعة المدعى بها.',
      'حكم': 'الحكم: قرار صادر من المحكمة بناءً على الأدلة والمرافعات.',
      'جريمة': 'الجريمة: فعل أو امتناع عن فعل يخالف القانون ويستحق العقاب.',
      'عقوبة': 'العقوبة: الجزاء الذي يفرضه القانون على من يرتكب جريمة.',
      'براءة': 'براءة الذمة: حالة الشخص الذي لم يثبت ارتكابه للجريمة.',
      'إدانة': 'الإدانة: قرار قضائي بإثبات ارتكاب الشخص للجريمة.',
      'استئناف': 'الاستئناف: طريقة طعن في الحكم أمام محكمة أعلى درجة.',
      'نقض': 'النقض: طريقة طعن في الحكم أمام محكمة النقض.',
      'تحقيق': 'التحقيق: إجراء قانوني للتحقق من صحة الاتهام والبحث عن الأدلة.'
    };

    // البحث عن كلمات مفتاحية
    for (const [keyword, answer] of Object.entries(answers)) {
      if (question.includes(keyword)) {
        return answer;
      }
    }

    // إجابة افتراضية
    return 'هذا موضوع قانوني مهم. يرجى مراجعة الكتاب المدرسي أو استشارة المعلم للحصول على إجابة دقيقة.';
  },

  // ── FORMAT ANSWER ──
  formatAnswer(text) {
    // تنسيق النص
    return text
      .replace(/\n/g, '<br>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/__(.*?)__/g, '<em>$1</em>');
  },

  // ── COPY RESPONSE ──
  copyResponse() {
    const response = document.querySelector('.ai-answer-text');
    if (!response) return;

    const text = response.textContent;
    navigator.clipboard.writeText(text).then(() => {
      alert('✅ تم نسخ الإجابة');
    }).catch(() => {
      alert('❌ فشل النسخ');
    });
  },

  // ── CLOSE AI HELPER ──
  closeAIHelper() {
    const modal = document.getElementById('ai-modal');
    if (modal) {
      modal.classList.remove('show');
    }
  },

  // ── SETUP EVENT LISTENERS ──
  setupEventListeners() {
    // إغلاق Modal عند الضغط خارجه
    const modal = document.getElementById('ai-modal');
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          this.closeAIHelper();
        }
      });
    }

    // إضافة الأزرار عند إضافة بطاقات جديدة
    const observer = new MutationObserver(() => {
      this.injectAIButtons();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
};

// ── STYLES ──
const styles = `
.ai-help-btn {
  background: rgba(88, 166, 255, 0.12);
  border: 1px solid rgba(88, 166, 255, 0.3);
  color: #58a6ff;
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.2s;
  margin-top: 10px;
  width: 100%;
}

.ai-help-btn:hover {
  background: rgba(88, 166, 255, 0.2);
  transform: translateY(-2px);
}

.ai-modal {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 1000;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.ai-modal.show {
  display: flex;
}

.ai-modal-content {
  background: #21262d;
  border: 1px solid #30363d;
  border-radius: 12px;
  max-width: 600px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.ai-modal-header {
  background: #1c2333;
  border-bottom: 2px solid #c9a84c;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ai-modal-header h2 {
  color: #c9a84c;
  font-size: 1.2rem;
  margin: 0;
}

.ai-modal-close {
  background: transparent;
  border: none;
  color: #8b949e;
  font-size: 1.5rem;
  cursor: pointer;
}

.ai-modal-close:hover {
  color: #e6edf3;
}

.ai-modal-body {
  padding: 20px;
  flex: 1;
  overflow-y: auto;
}

.ai-question-display {
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #30363d;
}

.ai-q-header {
  font-size: 0.85rem;
  color: #8b949e;
  margin-bottom: 8px;
}

.ai-q-text {
  font-size: 0.95rem;
  color: #e6edf3;
  line-height: 1.8;
  font-weight: 600;
}

.ai-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  gap: 16px;
}

.ai-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(201, 168, 76, 0.2);
  border-top-color: #c9a84c;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.ai-response {
  min-height: 100px;
}

.ai-answer {
  background: rgba(201, 168, 76, 0.06);
  border: 1px solid rgba(201, 168, 76, 0.2);
  border-right: 3px solid #c9a84c;
  border-radius: 8px;
  padding: 16px;
}

.ai-answer-title {
  font-size: 0.9rem;
  font-weight: 700;
  color: #c9a84c;
  margin-bottom: 10px;
}

.ai-answer-text {
  font-size: 0.9rem;
  color: #e8d48a;
  line-height: 1.8;
}

.ai-modal-footer {
  background: #1c2333;
  border-top: 1px solid #30363d;
  padding: 12px 16px;
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.ai-btn-copy,
.ai-btn-close {
  background: rgba(201, 168, 76, 0.12);
  border: 1px solid rgba(201, 168, 76, 0.3);
  color: #c9a84c;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.2s;
}

.ai-btn-copy:hover,
.ai-btn-close:hover {
  background: rgba(201, 168, 76, 0.2);
}

@media (max-width: 600px) {
  .ai-modal-content {
    max-width: 95vw;
    max-height: 90vh;
  }
}
`;

// ── INJECT STYLES ──
const styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

// ── AUTO INIT ──
document.addEventListener('DOMContentLoaded', () => {
  aiIntegration.init();
});
