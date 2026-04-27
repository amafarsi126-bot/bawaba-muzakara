/**
 * نظام الملاحة الموحد لجميع الصفحات
 * يضيف أزرار العودة والرئيسية بشكل موحد
 */

// إضافة أزرار الملاحة إلى الـ topbar
function initNavigation() {
  const topbar = document.querySelector('.topbar');
  if (!topbar) return;
  
  // تحقق من وجود أزرار الملاحة مسبقاً
  if (topbar.querySelector('.nav-buttons')) return;
  
  // إنشاء حاوية الأزرار
  const navButtons = document.createElement('div');
  navButtons.className = 'nav-buttons';
  navButtons.style.cssText = 'display:flex;gap:8px;align-items:center;';
  
  // زر العودة
  const backBtn = document.createElement('button');
  backBtn.className = 'nav-btn back-nav-btn';
  backBtn.innerHTML = '← عودة';
  backBtn.style.cssText = `
    background: rgba(201,168,76,.12);
    border: 1px solid rgba(201,168,76,.3);
    color: var(--gold);
    padding: 7px 14px;
    border-radius: 10px;
    font-size: .86rem;
    font-weight: 700;
    cursor: pointer;
    font-family: 'Segoe UI', sans-serif;
    transition: all .2s;
  `;
  backBtn.onclick = () => window.history.back();
  
  // زر الرئيسية
  const homeBtn = document.createElement('button');
  homeBtn.className = 'nav-btn home-nav-btn';
  homeBtn.innerHTML = '🏠 الرئيسية';
  homeBtn.style.cssText = `
    background: rgba(63,185,80,.12);
    border: 1px solid rgba(63,185,80,.3);
    color: var(--green);
    padding: 7px 14px;
    border-radius: 10px;
    font-size: .86rem;
    font-weight: 700;
    cursor: pointer;
    font-family: 'Segoe UI', sans-serif;
    transition: all .2s;
  `;
  homeBtn.onclick = () => {
    // تحقق من تسجيل الدخول
    const user = localStorage.getItem('pwa_user');
    if (user === '__admin__') {
      window.location.href = 'index.html?admin=true';
    } else if (user) {
      window.location.href = 'index.html';
    } else {
      window.location.href = 'index.html';
    }
  };
  
  // أضف تأثيرات الـ hover
  [backBtn, homeBtn].forEach(btn => {
    btn.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-2px)';
      this.style.boxShadow = '0 4px 12px rgba(0,0,0,.3)';
    });
    btn.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
      this.style.boxShadow = 'none';
    });
  });
  
  // أضف الأزرار إلى الـ topbar
  navButtons.appendChild(backBtn);
  navButtons.appendChild(homeBtn);
  
  // أضفها في بداية الـ topbar (بعد الزر الأول إن وجد)
  const firstBtn = topbar.querySelector('.back-btn');
  if (firstBtn) {
    firstBtn.parentNode.insertBefore(navButtons, firstBtn.nextSibling);
  } else {
    topbar.insertBefore(navButtons, topbar.firstChild);
  }
}

// تهيئة الملاحة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', initNavigation);

// تهيئة الملاحة عند تحميل الصفحة بالكامل
window.addEventListener('load', initNavigation);

// إعادة محاولة التهيئة بعد تأخير قصير للتأكد
setTimeout(initNavigation, 500);
