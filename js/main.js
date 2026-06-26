/**
 * =========================================================================
 * منصة الراسخون في العلم - ملف التحكم البرمجي الرئيسي (main.js)
 * المطور والمؤسس: المهندس محمد عصام الفيومي
 * =========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    
    /* =========================================================================
       القسم الأول: القائمة الجانبية للموبايل والتنقل (Mobile Menu & Navigation)
       ========================================================================= */
    
    // استهداف عناصر القائمة من الـ HTML
    const menuToggle = document.querySelector('.menu-toggle') || document.getElementById('mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links') || document.getElementById('nav-menu');

    // فتح وإغلاق القائمة عند الضغط على أيقونة المنيو (تأثير الهمبرجر)
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }

    // إغلاق القائمة تلقائياً عند الضغط على أي رابط بالداخل (مهم لتجربة الموبايل)
    const navItems = document.querySelectorAll('.nav-links a');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            if (window.innerWidth <= 768 && navLinks.classList.contains('active')) {
                if (menuToggle) menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
    });

    // تمييز وتلوين الرابط الحالي المفتوح تلقائياً (Active Link Highlight)
    const currentPage = window.location.pathname.split('/').pop();
    navItems.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage || (currentPage === '' && linkHref === 'index.html')) {
            link.classList.add('active');
        }
    });


    /* =========================================================================
       القسم الثاني: عداد الإحصائيات المتحرك (Animated Counter for Stats)
       ========================================================================= */
    
    const statsSection = document.querySelector('.stats-section');
    const statNumbers = document.querySelectorAll('.stat-number');
    let animated = false; // متغير لمنع تكرار الحركة بعد اشتغالها أول مرة

    // دالة حساب وزيادة الأرقام تصاعدياً بشكل جمالي
    function animateNumbers() {
        if (animated) return;
        
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-count')) || 0;
            let current = 0;
            const increment = target / 50; // سرعة العداد
            
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

    // تشغيل العداد فقط عندما يصل الزائر بقسم الإحصائيات أثناء السكرول
    if (statsSection && statNumbers.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateNumbers();
                    observer.unobserve(entry.target); // إيقاف المراقبة بعد الحركة
                }
            });
        }, { threshold: 0.3 });
        
        observer.observe(statsSection);
    }


    /* =========================================================================
       القسم الثالث: مساعد كلوود الذكي (AI Chatbot Client)
       ========================================================================= */
    
    // استدعاء عناصر صندوق الشات والذكاء الاصطناعي
    const openAiBtn = document.getElementById('open-ai-btn');
    const closePopupBtn = document.getElementById('close-popup-btn');
    const aiPopup = document.getElementById('ai-response-popup');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const chatOutput = document.getElementById('chat-output');

    // التحكم في فتح وإغلاق نافذة الشات من الأيقونة بالهيدر
    if (openAiBtn && aiPopup) {
        openAiBtn.addEventListener('click', () => {
            aiPopup.classList.toggle('active');
            if (aiPopup.classList.contains('active') && userInput) {
                userInput.focus(); // وضع مؤشر الكتابة داخل الحقل فوراً عند الفتح
            }
        });
    }

    // إغلاق الشات عند الضغط على زر X
    if (closePopupBtn && aiPopup) {
        closePopupBtn.addEventListener('click', () => {
            aiPopup.classList.remove('active');
        });
    }

    // الدالة المسؤولة عن معالجة وإرسال الرسائل إلى خادم Netlify السري
    async function handleSend() {
        const text = userInput.value.trim();
        if (!text) return;

        // 1. طباعة رسالة المستخدم داخل شاشة الشات
        chatOutput.innerHTML += `<div class="user-msg" style="text-align: right; margin: 8px 0; color: #BF9B30;"><b>أنت:</b> ${text}</div>`;
        userInput.value = ''; // تفريغ الحقل
        
        // 2. إظهار تأثير جاري الكتابة والانتظار
        chatOutput.innerHTML += `<div class="loading-msg" style="color: #aaa; margin: 5px 0;">جاري التفكير مع كلوود... 🤖📚</div>`;
        chatOutput.scrollTop = chatOutput.scrollHeight; // النزول لأسفل الشات

        try {
            // 3. استدعاء الـ API الخاص بـ Netlify Functions المربوط بـ Claude 
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userMessage: text })
            });

            const data = await response.json();
            
            // إزالة مؤشر الانتظار (جاري التفكير) بعد وصول الرد
            const loading = chatOutput.querySelector('.loading-msg');
            if (loading) loading.remove();

            // 4. طباعة رد كلوود الذكي المليء بمعلومات "الراسخون في العلم"
            if (data.reply) {
                chatOutput.innerHTML += `<div class="ai-msg" style="margin: 12px 0; line-height: 1.6; text-align: right; color: #ffffff;"><b>كلوود:</b> ${data.reply}</div>`;
            } else {
                chatOutput.innerHTML += `<div class="ai-msg-error" style="color: red; margin: 5px 0;">عذراً، واجه السيرفر مشكلة في صياغة الرد.</div>`;
            }
        } catch (error) {
            console.error("AI Fetch Error:", error);
            const loading = chatOutput.querySelector('.loading-msg');
            if (loading) loading.remove();
            chatOutput.innerHTML += `<div class="ai-msg-error" style="color: red; margin: 5px 0;">مشكلة في الاتصال بالسيرفر. تأكد من رفع الفانكشن على Netlify.</div>`;
        }
        
        // نزول تلقائي لآخر المحادثة
        chatOutput.scrollTop = chatOutput.scrollHeight;
    }

    // ربط أحداث الإرسال عند الضغط على زر الإرسال أو زر Enter بكيبورد المستخدم
    if (sendBtn) sendBtn.addEventListener('click', handleSend);
    if (userInput) {
        userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSend();
        });
    }


    /* =========================================================================
       القسم الرابع: نظام التحقق من التحديثات الدوري (Check for Content Updates)
       ========================================================================= */
    
    const updateInterval = 30 * 60 * 1000; // فحص دوري كل 30 دقيقة تلقائياً
    setInterval(checkForUpdates, updateInterval);

});


/* =========================================================================
   القسم الخامس: تحديث بيانات الفوتر التلقائي (Footer Auto-Updates)
   ========================================================================= */

// تحديث سنة الحقوق الملكية في أسفل الموقع تلقائياً لتوافق السنة الحالية
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();


/* =========================================================================
   القسم السادس: نظام الإشعارات الفورية (Push Notifications System)
   ========================================================================= */

// طلب إذن تفعيل الإشعارات من متصفح الزائر
async function requestNotificationPermission() {
    if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            subscribeToPushNotifications();
        }
    }
}

// تسجيل واشتراك المستخدم في خادم الإشعارات الخاص بك
async function subscribeToPushNotifications() {
    if ('serviceWorker' in navigator) {
        try {
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array('YOUR_VAPID_PUBLIC_KEY')
            });
            
            // إرسال كود التفعيل للـ Backend لحفظه
            await fetch('/api/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(subscription)
            });
        } catch (e) {
            console.error("Push Subscription Error:", e);
        }
    }
}

// دالة مساعدة لتحويل مفتاح التشفير (VAPID Key) ليقبله المتصفح
function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

// إظهار الإشعار المرئي على شاشة جهاز المستخدم عند نزول محتوى جديد
function showUpdateNotification(newContent) {
    if (Notification.permission === 'granted') {
        const notification = new Notification('📚 منصة الراسخون في العلم', {
            body: `تم إضافة محتوى جديد: ${newContent.title}`,
            icon: '/images/logo.png',
            badge: '/images/logo.png',
            tag: 'update',
            data: { url: newContent.url }
        });
        notification.onclick = () => { window.open(newContent.url, '_blank'); };
    }
}

// الدالة الدورية المبرمجة لمقارنة آخر تحديث للموقع مع ملف data.json
async function checkForUpdates() {
    try {
        const lastUpdate = localStorage.getItem('lastUpdate');
        const response = await fetch('/data.json?t=' + Date.now());
        const data = await response.json();
        
        if (data.lastUpdate !== lastUpdate) {
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
    } catch (err) {
        console.log("Updates Check Bypass:", err);
    }
}
