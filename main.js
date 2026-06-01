// Mobile Menu Toggle
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

// Close menu on link click (mobile)
const navItems = document.querySelectorAll('.nav-links a');
navItems.forEach(item => {
    item.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            navLinks.classList.remove('active');
        }
    });
});

// Active link highlight
const currentPage = window.location.pathname.split('/').pop();
const links = document.querySelectorAll('.nav-links a');
links.forEach(link => {
    const linkHref = link.getAttribute('href');
    if (linkHref === currentPage || (currentPage === '' && linkHref === 'index.html')) {
        link.classList.add('active');
    }
});

// Animated Counter for Stats
const statsSection = document.querySelector('.stats-section');
const statNumbers = document.querySelectorAll('.stat-number');

let animated = false;

function animateNumbers() {
    if (animated) return;
    
    statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-count'));
        let current = 0;
        const increment = target / 50;
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                stat.innerText = Math.ceil(current);
                requestAnimationFrame(updateCounter);
            } else {
                stat.innerText = target;
            }
        };
        updateCounter();
    });
    
    animated = true;
}

// Intersection Observer for stats animation
if (statsSection) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateNumbers();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    observer.observe(statsSection);
}











// طلب إذن الإشعارات
async function requestNotificationPermission() {
  if ('Notification' in window) {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      console.log('تم السماح بالإشعارات');
      subscribeToPushNotifications();
    } else {
      console.log('لم يتم السماح بالإشعارات');
    }
  }
}

// الاشتراك في الإشعارات
async function subscribeToPushNotifications() {
  if ('serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.ready;
    
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array('YOUR_VAPID_PUBLIC_KEY')
    });
    
    // حفظ الاشتراك في الخادم
    await fetch('/api/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subscription)
    });
  }
}

// تحويل المفتاح
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// عرض إشعار عند تحديث المحتوى
function showUpdateNotification(newContent) {
  if (Notification.permission === 'granted') {
    const notification = new Notification('📚 منصة مدرستنا علمتنا', {
      body: `تم إضافة محتوى جديد: ${newContent.title}`,
      icon: '/images/logo-192x192.png',
      badge: '/images/logo-72x72.png',
      tag: 'update',
      data: {
        url: newContent.url
      }
    });
    
    notification.onclick = () => {
      window.open(newContent.url, '_blank');
    };
  }
}


// التحقق من وجود تحديثات
async function checkForUpdates() {
  const lastUpdate = localStorage.getItem('lastUpdate');
  const response = await fetch('/data.json?t=' + Date.now());
  const data = await response.json();
  
  if (data.lastUpdate !== lastUpdate) {
    // هناك تحديث جديد
    const newCourses = data.courses.filter(course => 
      new Date(course.date) > new Date(lastUpdate)
    );
    
    if (newCourses.length > 0) {
      showUpdateNotification({
        title: `📚 ${newCourses.length} دورات جديدة`,
        url: '/#courses'
      });
      
      localStorage.setItem('lastUpdate', data.lastUpdate);
    }
  }
}

// التحقق كل 30 دقيقة
setInterval(checkForUpdates, 30 * 60 * 1000);












/* ==========================================
  تعديل الـ nav والـ header لإضافة ذكاء اصطناعي
============================================ */
// 1. استدعاء العناصر من الـ HTML
const openAiBtn = document.getElementById('open-ai-btn');
const aiPopup = document.getElementById('ai-response-popup');
const closePopupBtn = document.getElementById('close-popup-btn');
const sendBtn = document.getElementById('send-btn');
const userInput = document.getElementById('user-input');
const chatOutput = document.getElementById('chat-output');

// 2. دالة جلب البيانات من السيرفر السحابي (Netlify Function)
async function askMyAIChatbot(textFromUser) {
    try {
        const response = await fetch('//.netlify/functions/claude-agent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question: textFromUser })
        });
        
        const data = await response.json();
        
        if (data.reply) {
            chatOutput.innerText = data.reply; 
        } else {
            chatOutput.innerText = "عذراً، واجه السيرفر مشكلة في صياغة الرد.";
        }
    } catch (error) {
        chatOutput.innerText = "لم نتمكن من الوصول للذكاء الاصطناعي. يرجى تفعيل ntl dev محلياً أو رفع الملفات على نيتليفاي وتفعيل الـ API Key.";
        console.error("AI Error:", error);
    }
}

// 3. معالجة إرسال السؤال وإظهار جاري التفكير
function handleAISubmission() {
    const query = userInput.value.trim();
    if (!query) return;

    // إظهار نص الانتظار في مساحة النتائج بالأسفل دون إخفاء بوكس السيرش
    chatOutput.innerText = "جاري الاتصال بـ Claude وتجهيز الإجابة... 🤖📚";

    // إرسال الطلب
    askMyAIChatbot(query);

    // تفريغ حقل الكتابة ليصبح جاهزاً للسؤال التالي
    userInput.value = "";
}

// 4. التحكم في فتح وإغلاق النافذة من خلال الأيقونة والعلامة X
if (openAiBtn) {
    openAiBtn.addEventListener('click', () => {
        // تبديل ظهور النافذة (فتح / إغلاق) عند الضغط على أيقونة الروبوت
        if (aiPopup.style.display === 'block') {
            aiPopup.style.display = 'none';
        } else {
            aiPopup.style.display = 'block';
            userInput.focus(); // وضع مؤشر الكتابة داخل الحقل فوراً عند الفتح
        }
    });
}

if (closePopupBtn) {
    closePopupBtn.addEventListener('click', () => {
        aiPopup.style.display = 'none';
    });
}

// 5. ربط أزرار الإرسال
if (sendBtn) {
    sendBtn.addEventListener('click', handleAISubmission);
}

if (userInput) {
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleAISubmission();
        }
    });
}




/* اختبار 🛑 */

async function askMyAIChatbot(textFromUser) {
    const chatDisplay = document.getElementById('chat-output');
    if (!chatDisplay) return;

    // محاكاة انتظار السيرفر لمدة ثانيتين (علشان تشوف كلمة جاري الاتصال)
    setTimeout(() => {
        // الرد الوهمي الذكي للتأكد من حقن النصوص داخل الـ Popup
        const mockReply = `🤖 فحص محلي ناجح!
        أنا كلوود، ورسالتك وصليتني هنا على محرر أكواد الموبايل بنجاح.
        
        سؤالك المكتوب هو: "${textFromUser}"
        
        كود الفرونت إند والتصميم عندك شغالين 100% وبدون أخطاء!`;
        
        chatDisplay.innerText = mockReply;
    }, 2000);
}








