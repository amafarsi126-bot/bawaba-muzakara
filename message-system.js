/**
 * نظام الرسائل والإشعارات
 * يتعامل مع إرسال رسائل للمستخدمين المحظورين والمحظورين
 */

class MessageSystem {
  constructor() {
    this.storageKey = 'bawaba_messages';
    this.bannedUsersKey = 'bawaba_banned_users';
    this.supervisorKey = 'bawaba_supervisor_info';
    this.loadSupervisorInfo();
  }

  // ── SUPERVISOR INFO ──
  loadSupervisorInfo() {
    const stored = localStorage.getItem(this.supervisorKey);
    if (stored) {
      this.supervisorInfo = JSON.parse(stored);
    } else {
      this.supervisorInfo = {
        name: 'المشرف',
        phone: '96898981098',
        whatsapp: '96898981098',
        email: 'supervisor@bawaba.om',
        workHours: '8:00 - 16:00'
      };
      this.saveSupervisorInfo();
    }
  }

  saveSupervisorInfo() {
    localStorage.setItem(this.supervisorKey, JSON.stringify(this.supervisorInfo));
  }

  // ── UPDATE SUPERVISOR INFO ──
  updateSupervisorInfo(info) {
    this.supervisorInfo = { ...this.supervisorInfo, ...info };
    this.saveSupervisorInfo();
  }

  // ── GET SUPERVISOR INFO ──
  getSupervisorInfo() {
    return this.supervisorInfo;
  }

  // ── BAN USER ──
  banUser(phone, reason = 'انتهاك القوانين', duration = null) {
    const bannedUsers = this.getBannedUsers();
    
    // تحقق من عدم وجود الرقم مسبقاً
    const existingBan = bannedUsers.find(b => b.phone === phone);
    if (existingBan) {
      return { success: false, message: 'الرقم محظور بالفعل' };
    }

    const banRecord = {
      phone: phone,
      reason: reason,
      bannedAt: new Date().toISOString(),
      duration: duration, // null للحظر الدائم، أو عدد الساعات
      message: this.generateBanMessage(phone, reason, duration),
      status: 'active'
    };

    bannedUsers.push(banRecord);
    localStorage.setItem(this.bannedUsersKey, JSON.stringify(bannedUsers));
    
    return { success: true, message: 'تم حظر الرقم بنجاح', banRecord };
  }

  // ── UNBAN USER ──
  unbanUser(phone) {
    const bannedUsers = this.getBannedUsers();
    const index = bannedUsers.findIndex(b => b.phone === phone);
    
    if (index === -1) {
      return { success: false, message: 'الرقم غير محظور' };
    }

    bannedUsers.splice(index, 1);
    localStorage.setItem(this.bannedUsersKey, JSON.stringify(bannedUsers));
    
    return { success: true, message: 'تم رفع الحظر بنجاح' };
  }

  // ── GET BANNED USERS ──
  getBannedUsers() {
    const stored = localStorage.getItem(this.bannedUsersKey);
    return stored ? JSON.parse(stored) : [];
  }

  // ── IS USER BANNED ──
  isUserBanned(phone) {
    const bannedUsers = this.getBannedUsers();
    const ban = bannedUsers.find(b => b.phone === phone);
    
    if (!ban) return false;

    // تحقق من انتهاء مدة الحظر
    if (ban.duration) {
      const bannedTime = new Date(ban.bannedAt);
      const now = new Date();
      const hours = (now - bannedTime) / (1000 * 60 * 60);
      
      if (hours > ban.duration) {
        this.unbanUser(phone);
        return false;
      }
    }

    return true;
  }

  // ── GET BAN INFO ──
  getBanInfo(phone) {
    const bannedUsers = this.getBannedUsers();
    return bannedUsers.find(b => b.phone === phone);
  }

  // ── GENERATE BAN MESSAGE ──
  generateBanMessage(phone, reason, duration) {
    const supervisor = this.supervisorInfo;
    const durationText = duration 
      ? `مدة الحظر: ${duration} ساعة`
      : 'الحظر: دائم';

    return `
🚫 تم حظر حسابك

رقم الهاتف: ${phone}
السبب: ${reason}
${durationText}

📞 للتواصل مع المشرف:
الاسم: ${supervisor.name}
الواتس: ${supervisor.whatsapp}
البريد: ${supervisor.email}
ساعات العمل: ${supervisor.workHours}

⚠️ يرجى التواصل مع المشرف لمعرفة المزيد من التفاصيل.
    `.trim();
  }

  // ── ADD MESSAGE ──
  addMessage(phone, title, content, type = 'info') {
    const messages = this.getMessages();
    
    const message = {
      id: Date.now(),
      phone: phone,
      title: title,
      content: content,
      type: type, // info, warning, error, success
      createdAt: new Date().toISOString(),
      read: false
    };

    messages.push(message);
    localStorage.setItem(this.storageKey, JSON.stringify(messages));
    
    return message;
  }

  // ── GET MESSAGES ──
  getMessages(phone = null) {
    const stored = localStorage.getItem(this.storageKey);
    let messages = stored ? JSON.parse(stored) : [];
    
    if (phone) {
      messages = messages.filter(m => m.phone === phone);
    }

    return messages;
  }

  // ── GET UNREAD MESSAGES ──
  getUnreadMessages(phone) {
    return this.getMessages(phone).filter(m => !m.read);
  }

  // ── MARK AS READ ──
  markAsRead(messageId) {
    const messages = this.getMessages();
    const message = messages.find(m => m.id === messageId);
    
    if (message) {
      message.read = true;
      localStorage.setItem(this.storageKey, JSON.stringify(messages));
      return true;
    }
    
    return false;
  }

  // ── DELETE MESSAGE ──
  deleteMessage(messageId) {
    const messages = this.getMessages();
    const index = messages.findIndex(m => m.id === messageId);
    
    if (index !== -1) {
      messages.splice(index, 1);
      localStorage.setItem(this.storageKey, JSON.stringify(messages));
      return true;
    }
    
    return false;
  }

  // ── CLEAR MESSAGES ──
  clearMessages(phone) {
    const messages = this.getMessages();
    const filtered = messages.filter(m => m.phone !== phone);
    localStorage.setItem(this.storageKey, JSON.stringify(filtered));
  }

  // ── GET STATISTICS ──
  getStatistics() {
    const bannedUsers = this.getBannedUsers();
    const messages = this.getMessages();
    
    return {
      totalBanned: bannedUsers.length,
      totalMessages: messages.length,
      unreadMessages: messages.filter(m => !m.read).length,
      permanentBans: bannedUsers.filter(b => !b.duration).length,
      temporaryBans: bannedUsers.filter(b => b.duration).length
    };
  }

  // ── EXPORT BAN RECORDS ──
  exportBanRecords() {
    return JSON.stringify(this.getBannedUsers(), null, 2);
  }

  // ── IMPORT BAN RECORDS ──
  importBanRecords(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      if (Array.isArray(data)) {
        localStorage.setItem(this.bannedUsersKey, JSON.stringify(data));
        return true;
      }
      return false;
    } catch (e) {
      console.error('خطأ في استيراد سجلات الحظر:', e);
      return false;
    }
  }

  // ── GET BAN HISTORY ──
  getBanHistory(phone) {
    const bannedUsers = this.getBannedUsers();
    return bannedUsers.filter(b => b.phone === phone);
  }

  // ── GENERATE BAN REPORT ──
  generateBanReport() {
    const bannedUsers = this.getBannedUsers();
    const report = {
      generatedAt: new Date().toISOString(),
      totalBanned: bannedUsers.length,
      byReason: {},
      byDuration: {
        permanent: 0,
        temporary: 0
      },
      details: bannedUsers
    };

    bannedUsers.forEach(ban => {
      // حساب الأسباب
      if (!report.byReason[ban.reason]) {
        report.byReason[ban.reason] = 0;
      }
      report.byReason[ban.reason]++;

      // حساب نوع الحظر
      if (ban.duration) {
        report.byDuration.temporary++;
      } else {
        report.byDuration.permanent++;
      }
    });

    return report;
  }

  // ── SEND NOTIFICATION ──
  sendNotification(phone, title, content) {
    // إضافة الرسالة للنظام
    this.addMessage(phone, title, content, 'info');

    // إذا كان الطالب محظور، أضف رسالة خاصة
    if (this.isUserBanned(phone)) {
      const banInfo = this.getBanInfo(phone);
      this.addMessage(phone, '⚠️ تنبيه الحظر', banInfo.message, 'error');
    }

    return true;
  }
}

// Create global instance
const messageSystem = new MessageSystem();
