/**
 * نظام تكامل الذكاء الاصطناعي المحسّن مع جميع البطاقات
 * يسمح للطالب بطلب مساعدة الذكاء الاصطناعي من أي بطاقة سؤال
 * مع قاعدة بيانات شاملة للقوانين العمانية
 */

const aiIntegration = {
  // ── CONFIGURATION ──
  config: {
    apiKey: 'sk-proj-', // سيتم ملؤه من المتغيرات
    model: 'gpt-4-mini',
    temperature: 0.7,
    maxTokens: 500,
  },

  // ── قاعدة البيانات الشاملة ──
  database: {
    'التلبس بالجريمة': 'التلبس بالجريمة (م.37): هو مشاهدة الجريمة حال ارتكابها أو مشاهدة الجاني بعدها بوقت قصير أو وجود آثار تدل على ارتكابه للجريمة.',
    'الجريمة': 'الجريمة: فعل أو امتناع عن فعل يخالف القانون ويستحق العقاب. تنقسم إلى: جنايات وجنح ومخالفات.',
    'الجنايات': 'الجنايات: الجرائم التي يعاقب عليها بالإعدام أو السجن المؤبد أو السجن لمدة تزيد على 3 سنوات.',
    'الجنح': 'الجنح: الجرائم التي يعاقب عليها بالسجن من 3 أيام إلى 3 سنوات أو بالغرامة من 50 إلى 1000 ريال عماني.',
    'المخالفات': 'المخالفات: الجرائم التي يعاقب عليها بالسجن من يوم إلى يومين أو بالغرامة من 10 إلى 50 ريال عماني.',
    'التفتيش': 'التفتيش القضائي (م.38): إجراء تحقيقي يقوم به المحقق أو الشرطة للبحث عن الأدلة والأشياء المتعلقة بالجريمة.',
    'الشهادة': 'الشهادة: إخبار الشاهد بما رآه أو سمعه أو علمه عن الواقعة المدعى بها. يجب أن تكون الشهادة صريحة وواضحة.',
    'الحكم': 'الحكم: قرار صادر من المحكمة بناءً على الأدلة والمرافعات. يجب أن يكون الحكم معللاً ومكتوباً.',
    'العقوبة': 'العقوبة: الجزاء الذي يفرضه القانون على من يرتكب جريمة. أنواع العقوبات: إعدام، سجن، غرامة، مصادرة.',
    'براءة الذمة': 'براءة الذمة: حالة الشخص الذي لم يثبت ارتكابه للجريمة. الأصل براءة الذمة إلا بإدانة قضائية.',
    'الإدانة': 'الإدانة: قرار قضائي بإثبات ارتكاب الشخص للجريمة. يجب أن تكون الإدانة بناءً على أدلة قاطعة.',
    'الاستئناف': 'الاستئناف: طريقة طعن في الحكم أمام محكمة أعلى درجة. يجب تقديم الاستئناف خلال 30 يوماً من صدور الحكم.',
    'النقض': 'النقض: طريقة طعن في الحكم أمام محكمة النقض. يكون النقض للأحكام النهائية فقط.',
    'التحقيق': 'التحقيق: إجراء قانوني للتحقق من صحة الاتهام والبحث عن الأدلة. يجريه المحقق أو الشرطة.',
    'الاعتقال': 'الاعتقال: حرمان الشخص من حريته بناءً على أمر قضائي. لا يجوز الاعتقال إلا بأمر من القاضي.',
    'المحاكمة': 'المحاكمة: إجراء قانوني تقيمه المحكمة للفصل في الدعوى. يجب أن تكون المحاكمة علنية وعادلة.',
    'الدفاع': 'الدفاع: حق المتهم في الدفاع عن نفسه أمام المحكمة. يجب أن يتمتع المتهم بحق الدفاع الكامل.',
    'الأدلة': 'الأدلة: كل ما يثبت أو ينفي واقعة معينة. أنواع الأدلة: شهادة، وثائق، خبرة، معاينة.',
    'الوثائق': 'الوثائق: أوراق مكتوبة تثبت واقعة معينة. يجب أن تكون الوثائق أصلية أو مصدقة.',
    'الخبرة': 'الخبرة: رأي الخبير في مسألة تتطلب معرفة فنية أو علمية خاصة. يجب أن يكون الخبير محايداً.',
    'المعاينة': 'المعاينة: فحص المحقق أو القاضي للمكان أو الشيء المتعلق بالجريمة. تتم المعاينة بحضور الأطراف.',
    'الجنسية': 'الجنسية: الرابطة القانونية بين الشخص والدولة. تكتسب الجنسية بالولادة أو التجنس.',
    'الحقوق': 'الحقوق: السلطات التي يتمتع بها الشخص. أنواع الحقوق: مدنية، سياسية، اقتصادية، اجتماعية.',
    'الواجبات': 'الواجبات: الالتزامات التي يجب على الشخص الوفاء بها. مثل: احترام القانون، دفع الضرائب.',
    'الشرطة': 'شرطة عمان السلطانية: جهاز أمني متخصص في المحافظة على الأمن والنظام. تتمتع بصلاحيات قانونية واسعة.',
    'المفتش العام': 'المفتش العام للشرطة والجمارك: القائد الأعلى لشرطة عمان السلطانية. رتبته فريق.',
    'الشرطة النسائية': 'الشرطة النسائية: وحدة متخصصة في شرطة عمان السلطانية تضم عنصراً نسائياً. بدأت عام 1973م.',
    'أكاديمية الشرطة': 'أكاديمية السلطان قابوس لعلوم الشرطة: مؤسسة تدريبية متخصصة. تقع في نزوى بالداخلية.',
    'السجون': 'الإدارة العامة للسجون: مسؤولة عن إدارة السجون والمعتقلات. تتبع وزارة الداخلية.',
    'المرور': 'الإدارة العامة للمرور: مسؤولة عن تنظيم المرور والحوادث. تتبع شرطة عمان السلطانية.',
    'خفر السواحل': 'قيادة شرطة خفر السواحل: مسؤولة عن مراقبة السواحل والمياه الإقليمية. تتبع شرطة عمان.',
    'المهام الخاصة': 'قيادة شرطة المهام الخاصة: مسؤولة عن مواجهة أعمال تخل بالنظام العام. تتبع شرطة عمان.',
    'الإنتربول': 'منظمة الإنتربول الدولية: منظمة دولية للتعاون الشرطي. انضمت عمان عام 1972م.',
    'القانون': 'القانون: مجموعة القواعد التي تحكم سلوك الأفراد والدول. يجب احترام القانون من قبل الجميع.',
    'العدالة': 'العدالة: المبدأ الأساسي للنظام القانوني. تقوم على المساواة والإنصاف والحق.',
    'الحرية': 'الحرية: حق أساسي للإنسان. لا يجوز انتهاك الحرية إلا بناءً على القانون.',
    'الكرامة': 'كرامة الإنسان: حق أساسي لا يجوز انتهاكه. يجب احترام كرامة الإنسان في جميع الأحوال.',
    'المساواة': 'المساواة: مبدأ أساسي في القانون. الجميع متساوون أمام القانون بغض النظر عن الجنس أو العرق.',
  },

  // ── INITIALIZE ──
  init() {
    this.injectAIButtons();
    this.setupAIModal();
    this.setupEventListeners();
    console.log('✅ نظام الذكاء الاصطناعي المحسّن جاهز');
  },

  // ── INJECT AI BUTTONS ──
  injectAIButtons() {
    const qCards = document.querySelectorAll('.q-card');
    
    qCards.forEach((card, index) => {
      if (card.querySelector('.ai-help-btn')) return;

      const aiBtn = document.createElement('button');
      aiBtn.className = 'ai-help-btn';
      aiBtn.innerHTML = '🤖 اسأل الذكاء الاصطناعي';
      aiBtn.onclick = (e) => {
        e.preventDefault();
        this.openAIHelper(card, index);
      };

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
            <p>جاري البحث عن الإجابة...</p>
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
    const qText = card.querySelector('.q-text')?.textContent || '';
    const qNum = card.querySelector('.q-num')?.textContent || `السؤال ${index + 1}`;
    
    if (!qText) {
      alert('❌ لم يتم العثور على السؤال');
      return;
    }

    const modal = document.getElementById('ai-modal');
    const qDisplay = modal.querySelector('.ai-question-display');
    qDisplay.innerHTML = `
      <div class="ai-q-header">${qNum}</div>
      <div class="ai-q-text">${qText}</div>
    `;

    modal.classList.add('show');
    this.getAIResponse(qText, card);
  },

  // ── GET AI RESPONSE ──
  async getAIResponse(question, card) {
    const modal = document.getElementById('ai-modal');
    const loading = modal.querySelector('.ai-loading');
    const response = modal.querySelector('.ai-response');

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
      
      // استخدام الإجابة المحلية
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
    // تحويل السؤال إلى أحرف صغيرة للبحث
    const q = question.toLowerCase();
    
    // البحث عن كلمات مفتاحية
    for (const [keyword, answer] of Object.entries(this.database)) {
      if (q.includes(keyword.toLowerCase())) {
        return answer;
      }
    }

    // البحث عن كلمات جزئية
    const words = q.split(' ');
    for (const word of words) {
      if (word.length > 3) {
        for (const [keyword, answer] of Object.entries(this.database)) {
          if (keyword.toLowerCase().includes(word)) {
            return answer;
          }
        }
      }
    }

    // إجابة افتراضية
    return 'هذا موضوع قانوني مهم. يرجى مراجعة الكتاب المدرسي أو استشارة المعلم للحصول على إجابة دقيقة. أو يمكنك إعادة صياغة السؤال بطريقة أخرى.';
  },

  // ── FORMAT ANSWER ──
  formatAnswer(text) {
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
    const modal = document.getElementById('ai-modal');
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          this.closeAIHelper();
        }
      });
    }

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

const styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

// ── AUTO INIT ──
document.addEventListener('DOMContentLoaded', () => {
  aiIntegration.init();
});
