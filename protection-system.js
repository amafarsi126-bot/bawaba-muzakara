/**
 * نظام الحماية من النسخ والسرقة
 * يمنع نسخ الأكواد ويكشف محاولات الاختراق
 */

class ProtectionSystem {
  constructor() {
    this.storageKey = 'bawaba_security_logs';
    this.maxLogs = 1000;
    this.suspiciousAttempts = 0;
    this.blockThreshold = 10; // عدد المحاولات قبل الحظر
    this.initializeProtection();
  }

  // ── INITIALIZE PROTECTION ──
  initializeProtection() {
    this.disableCopyPaste();
    this.disableRightClick();
    this.disableDevTools();
    this.disableSelection();
    this.disablePrinting();
    this.addWatermark();
    this.monitorActivity();
    this.preventIframe();
    this.preventConsoleAccess();
  }

  // ── DISABLE COPY/PASTE ──
  disableCopyPaste() {
    document.addEventListener('copy', (e) => {
      e.preventDefault();
      this.logSecurityEvent('محاولة نسخ', 'warning');
      this.showNotification('❌ النسخ معطل لأسباب أمنية');
      return false;
    });

    document.addEventListener('cut', (e) => {
      e.preventDefault();
      this.logSecurityEvent('محاولة قص', 'warning');
      this.showNotification('❌ القص معطل لأسباب أمنية');
      return false;
    });

    document.addEventListener('paste', (e) => {
      e.preventDefault();
      this.logSecurityEvent('محاولة لصق', 'warning');
      this.showNotification('❌ اللصق معطل لأسباب أمنية');
      return false;
    });
  }

  // ── DISABLE RIGHT CLICK ──
  disableRightClick() {
    document.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      this.logSecurityEvent('محاولة الضغط بزر الفأرة الأيمن', 'warning');
      this.showNotification('❌ هذا الإجراء غير مسموح');
      return false;
    });
  }

  // ── DISABLE DEV TOOLS ──
  disableDevTools() {
    // منع F12
    document.addEventListener('keydown', (e) => {
      if (e.key === 'F12' || e.keyCode === 123) {
        e.preventDefault();
        this.logSecurityEvent('محاولة فتح أدوات المطورين (F12)', 'critical');
        this.showNotification('⚠️ أدوات المطورين معطلة');
        return false;
      }

      // منع Ctrl+Shift+I
      if (e.ctrlKey && e.shiftKey && e.key === 'I') {
        e.preventDefault();
        this.logSecurityEvent('محاولة فتح أدوات المطورين (Ctrl+Shift+I)', 'critical');
        this.showNotification('⚠️ أدوات المطورين معطلة');
        return false;
      }

      // منع Ctrl+Shift+J
      if (e.ctrlKey && e.shiftKey && e.key === 'J') {
        e.preventDefault();
        this.logSecurityEvent('محاولة فتح وحدة التحكم (Ctrl+Shift+J)', 'critical');
        this.showNotification('⚠️ وحدة التحكم معطلة');
        return false;
      }

      // منع Ctrl+Shift+C
      if (e.ctrlKey && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        this.logSecurityEvent('محاولة فتح مفتش العناصر (Ctrl+Shift+C)', 'critical');
        this.showNotification('⚠️ مفتش العناصر معطل');
        return false;
      }

      // منع Ctrl+S
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        this.logSecurityEvent('محاولة حفظ الصفحة (Ctrl+S)', 'warning');
        this.showNotification('❌ حفظ الصفحة معطل');
        return false;
      }
    });
  }

  // ── DISABLE SELECTION ──
  disableSelection() {
    document.addEventListener('selectstart', (e) => {
      e.preventDefault();
      return false;
    });

    document.addEventListener('mousedown', (e) => {
      if (e.detail > 1) { // Double click
        e.preventDefault();
        this.logSecurityEvent('محاولة تحديد نص (نقرة مزدوجة)', 'warning');
        return false;
      }
    });

    // منع التحديد عبر CSS
    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';
    document.body.style.msUserSelect = 'none';
    document.body.style.mozUserSelect = 'none';
  }

  // ── DISABLE PRINTING ──
  disablePrinting() {
    window.addEventListener('beforeprint', (e) => {
      e.preventDefault();
      this.logSecurityEvent('محاولة طباعة الصفحة', 'warning');
      this.showNotification('❌ الطباعة معطلة');
    });

    // منع Ctrl+P
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.key === 'p') {
        e.preventDefault();
        this.logSecurityEvent('محاولة طباعة (Ctrl+P)', 'warning');
        this.showNotification('❌ الطباعة معطلة');
        return false;
      }
    });
  }

  // ── ADD WATERMARK ──
  addWatermark() {
    const watermark = document.createElement('div');
    watermark.id = 'protection-watermark';
    watermark.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(-45deg);
      font-size: 4rem;
      opacity: 0.05;
      color: #c9a84c;
      font-weight: 900;
      z-index: -1;
      pointer-events: none;
      white-space: nowrap;
      user-select: none;
      font-family: Arial, sans-serif;
    `;
    watermark.textContent = '🔒 محمي بواسطة بوابة المذاكرة';
    document.body.appendChild(watermark);
  }

  // ── MONITOR ACTIVITY ──
  monitorActivity() {
    // مراقبة محاولات الوصول للـ localStorage
    const originalSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = function(key, value) {
      if (key.includes('admin') || key.includes('password')) {
        protectionSystem.logSecurityEvent(`محاولة الوصول لـ localStorage: ${key}`, 'critical');
      }
      return originalSetItem.apply(this, arguments);
    };

    // مراقبة محاولات الوصول للـ console
    const originalLog = console.log;
    console.log = function(...args) {
      protectionSystem.logSecurityEvent('محاولة استخدام console.log', 'warning');
      return originalLog.apply(console, args);
    };
  }

  // ── PREVENT IFRAME ──
  preventIframe() {
    if (window.self !== window.top) {
      window.top.location = window.self.location;
      this.logSecurityEvent('محاولة تحميل الموقع داخل iframe', 'critical');
    }

    // منع تحميل الموقع في iframe
    const meta = document.createElement('meta');
    meta.httpEquiv = 'X-UA-Compatible';
    meta.content = 'IE=edge';
    document.head.appendChild(meta);
  }

  // ── PREVENT CONSOLE ACCESS ──
  preventConsoleAccess() {
    // منع الوصول للـ console
    Object.defineProperty(window, 'console', {
      get: () => {
        this.logSecurityEvent('محاولة الوصول للـ console', 'critical');
        throw new Error('وحدة التحكم معطلة');
      },
      set: () => {
        this.logSecurityEvent('محاولة تعديل console', 'critical');
      }
    });
  }

  // ── SHOW NOTIFICATION ──
  showNotification(message) {
    // إنشاء إشعار مؤقت
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: rgba(248, 81, 73, 0.9);
      color: white;
      padding: 16px 24px;
      border-radius: 8px;
      font-size: 14px;
      z-index: 10000;
      animation: slideIn 0.3s ease;
      font-family: Arial, sans-serif;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  // ── LOG SECURITY EVENT ──
  logSecurityEvent(event, level = 'info') {
    const log = {
      timestamp: new Date().toISOString(),
      event: event,
      level: level, // info, warning, critical
      userAgent: navigator.userAgent,
      url: window.location.href,
      ip: this.getClientIP()
    };

    // حفظ في localStorage
    let logs = this.getSecurityLogs();
    logs.push(log);

    // الحفاظ على حد أقصى من السجلات
    if (logs.length > this.maxLogs) {
      logs = logs.slice(-this.maxLogs);
    }

    localStorage.setItem(this.storageKey, JSON.stringify(logs));

    // إذا كانت محاولة حرجة، زيادة العداد
    if (level === 'critical') {
      this.suspiciousAttempts++;
      if (this.suspiciousAttempts >= this.blockThreshold) {
        this.blockAccess();
      }
    }

    return log;
  }

  // ── GET SECURITY LOGS ──
  getSecurityLogs() {
    const stored = localStorage.getItem(this.storageKey);
    return stored ? JSON.parse(stored) : [];
  }

  // ── GET CLIENT IP ──
  getClientIP() {
    // محاولة الحصول على IP من خلال WebRTC (للاختبار فقط)
    return 'unknown';
  }

  // ── BLOCK ACCESS ──
  blockAccess() {
    document.body.innerHTML = `
      <div style="
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100vh;
        background: linear-gradient(135deg, #0d1117, #1c2333);
        font-family: Arial, sans-serif;
        color: white;
      ">
        <div style="
          text-align: center;
          background: rgba(248, 81, 73, 0.1);
          border: 2px solid #f85149;
          border-radius: 16px;
          padding: 40px;
          max-width: 500px;
        ">
          <div style="font-size: 4rem; margin-bottom: 20px;">🚫</div>
          <h1 style="color: #f85149; margin-bottom: 16px;">تم حظر الوصول</h1>
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            تم اكتشاف محاولات اختراق متعددة. تم حظر حسابك لأسباب أمنية.
          </p>
          <p style="color: #8b949e; font-size: 14px;">
            يرجى التواصل مع المسؤول للمزيد من المعلومات.
          </p>
        </div>
      </div>
    `;
    
    // منع أي تفاعل
    document.body.style.pointerEvents = 'none';
  }

  // ── GET STATISTICS ──
  getStatistics() {
    const logs = this.getSecurityLogs();
    
    return {
      totalEvents: logs.length,
      criticalEvents: logs.filter(l => l.level === 'critical').length,
      warningEvents: logs.filter(l => l.level === 'warning').length,
      infoEvents: logs.filter(l => l.level === 'info').length,
      suspiciousAttempts: this.suspiciousAttempts,
      lastEvent: logs[logs.length - 1] || null
    };
  }

  // ── EXPORT LOGS ──
  exportLogs() {
    const logs = this.getSecurityLogs();
    return JSON.stringify(logs, null, 2);
  }

  // ── CLEAR LOGS ──
  clearLogs() {
    localStorage.removeItem(this.storageKey);
    this.suspiciousAttempts = 0;
  }

  // ── GET EVENTS BY LEVEL ──
  getEventsByLevel(level) {
    const logs = this.getSecurityLogs();
    return logs.filter(l => l.level === level);
  }

  // ── GET EVENTS BY DATE ──
  getEventsByDate(date) {
    const logs = this.getSecurityLogs();
    const targetDate = new Date(date).toDateString();
    return logs.filter(l => new Date(l.timestamp).toDateString() === targetDate);
  }

  // ── RESET SUSPICIOUS ATTEMPTS ──
  resetSuspiciousAttempts() {
    this.suspiciousAttempts = 0;
  }
}

// Create global instance
const protectionSystem = new ProtectionSystem();

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
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

  body {
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
  }
`;
document.head.appendChild(style);
