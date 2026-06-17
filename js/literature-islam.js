document.addEventListener("DOMContentLoaded", () => {
    // 1. تحديث سنة حقوق النشر تلقائياً في الفوتر
    const yearSpan = document.getElementById("year");
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // 2. حركة ظهور صندوق المقدمة بانسيابية
    const introBox = document.querySelector(".intro-box-modern");
    if (introBox) {
        setTimeout(() => {
            introBox.classList.add("fade-in-up");
        }, 150);
    }

    // 3. تحريك الأزرار ودخولها بشكل تتابعي متقدم (Staggered Animation)
    const islamicButtons = document.querySelectorAll(".custom-islamic-card-btn");
    islamicButtons.forEach((button, index) => {
        setTimeout(() => {
            button.classList.add("slide-in");
        }, 350 + (index * 120)); // كل زر يظهر بعد الآخر بفارق 120ms لجمالية بصرية فائقة
    });
});
