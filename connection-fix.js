/**
 * نظام تحسين الاتصال بالسيرفر
 * يحل مشاكل الاتصال والتأخير
 */

const connectionFix = {
  // ── CONFIGURATION ──
  config: {
    timeout: 30000, // 30 ثانية
    retries: 3,
    retryDelay: 2000, // 2 ثانية
    useCache: true,
    cacheExpiry: 3600000, // ساعة واحدة
  },

  // ── INITIALIZE ──
  init() {
    this.setupNetworkListener();
    this.setupFallback();
    this.setupCache();
    console.log('✅ نظام تحسين الاتصال جاهز');
  },

  // ── SETUP NETWORK LISTENER ──
  setupNetworkListener() {
    window.addEventListener('online', () => {
      console.log('✅ الاتصال بالإنترنت متاح');
      this.showNotification('✅ الاتصال بالإنترنت متاح', 'success');
    });

    window.addEventListener('offline', () => {
      console.log('❌ لا يوجد اتصال بالإنترنت');
      this.showNotification('❌ لا يوجد اتصال بالإنترنت', 'error');
    });

    // التحقق من الاتصال الأولي
    if (!navigator.onLine) {
      this.showNotification('❌ لا يوجد اتصال بالإنترنت', 'error');
    }
  },

  // ── SETUP FALLBACK ──
  setupFallback() {
    // إذا فشل الاتصال، استخدم البيانات المحلية
    window.addEventListener('fetch', (event) => {
      if (event.request.method === 'GET') {
        event.respondWith(
          fetch(event.request)
            .catch(() => {
              // محاولة الحصول على البيانات من الكاش
              return caches.match(event.request)
                .then(response => response || this.getLocalData(event.request.url));
            })
        );
      }
    });
  },

  // ── SETUP CACHE ──
  setupCache() {
    if ('caches' in window) {
      caches.open('bawaba-cache-v1').then(cache => {
        console.log('✅ الكاش جاهز');
      });
    }
  },

  // ── GET LOCAL DATA ──
  getLocalData(url) {
    // محاولة الحصول على البيانات من localStorage
    const cached = localStorage.getItem(`cache_${url}`);
    if (cached) {
      const data = JSON.parse(cached);
      if (data.expiry > Date.now()) {
        console.log('✅ تم استخدام البيانات المخزنة محلياً');
        return new Response(JSON.stringify(data.content), {
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }
    return new Response('لا توجد بيانات متاحة', { status: 404 });
  },

  // ── FETCH WITH RETRY ──
  async fetchWithRetry(url, options = {}, retries = this.config.retries) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      // حفظ في الكاش
      if (this.config.useCache) {
        this.cacheData(url, response.clone());
      }

      return response;
    } catch (error) {
      clearTimeout(timeoutId);

      if (retries > 0) {
        console.warn(`⚠️ محاولة إعادة الاتصال... (${this.config.retries - retries + 1}/${this.config.retries})`);
        await this.delay(this.config.retryDelay);
        return this.fetchWithRetry(url, options, retries - 1);
      }

      console.error('❌ فشل الاتصال:', error);
      throw error;
    }
  },

  // ── CACHE DATA ──
  async cacheData(url, response) {
    try {
      const data = await response.json();
      const cacheData = {
        content: data,
        expiry: Date.now() + this.config.cacheExpiry
      };
      localStorage.setItem(`cache_${url}`, JSON.stringify(cacheData));
    } catch (error) {
      console.warn('⚠️ فشل حفظ البيانات في الكاش:', error);
    }
  },

  // ── DELAY ──
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  // ── SHOW NOTIFICATION ──
  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `connection-notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 12px 20px;
      border-radius: 8px;
      font-weight: 700;
      z-index: 10000;
      animation: slideIn 0.3s ease;
      ${type === 'success' ? 'background: #3fb950; color: white;' : ''}
      ${type === 'error' ? 'background: #f85149; color: white;' : ''}
      ${type === 'info' ? 'background: #58a6ff; color: white;' : ''}
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  },

  // ── CHECK CONNECTION ──
  async checkConnection() {
    try {
      const response = await fetch('https://www.google.com/favicon.ico', { mode: 'no-cors' });
      return true;
    } catch (error) {
      return false;
    }
  },

  // ── GET CONNECTION STATUS ──
  getStatus() {
    return {
      online: navigator.onLine,
      type: navigator.connection?.effectiveType || 'unknown',
      downlink: navigator.connection?.downlink || 'unknown',
      rtt: navigator.connection?.rtt || 'unknown'
    };
  }
};

// ── INJECT STYLES ──
const styles = `
@keyframes slideIn {
  from {
    transform: translateX(400px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideOut {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(400px);
    opacity: 0;
  }
}
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

// ── AUTO INIT ──
document.addEventListener('DOMContentLoaded', () => {
  connectionFix.init();
});

// ── EXPORT ──
window.connectionFix = connectionFix;
