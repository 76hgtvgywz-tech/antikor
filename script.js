// Слайдер фотографий (БЕЗ автоматической прокрутки)
function initPhotoSlider() {
    const slider = document.querySelector('.slider');
    if (!slider) return;
    
    const track = slider.querySelector('.slider-track');
    const slides = Array.from(slider.querySelectorAll('.slide'));
    const prevBtn = slider.querySelector('.prev-btn');
    const nextBtn = slider.querySelector('.next-btn');
    const dots = Array.from(slider.querySelectorAll('.dot'));
    const currentSlideEl = slider.querySelector('.current-slide');
    const totalSlidesEl = slider.querySelector('.total-slides');
    
    let currentSlide = 0;
    const slideCount = slides.length;
    
    // Устанавливаем общее количество слайдов
    if (totalSlidesEl) {
        totalSlidesEl.textContent = slideCount;
    }
    
    // Функция для обновления позиции слайдера
    function updateSlider() {
        track.style.transform = `translateX(-${currentSlide * 100}%)`;
        
        // Обновляем активную точку
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
        
        // Обновляем счетчик
        if (currentSlideEl) {
            currentSlideEl.textContent = currentSlide + 1;
        }
        
        // Обновляем aria-атрибуты для доступности
        slides.forEach((slide, index) => {
            slide.setAttribute('aria-hidden', index !== currentSlide);
        });
    }
    
    // Функция для перехода к следующему слайду
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slideCount;
        updateSlider();
    }
    
    // Функция для перехода к предыдущему слайду
    function prevSlide() {
        currentSlide = (currentSlide - 1 + slideCount) % slideCount;
        updateSlider();
    }
    
    // Функция для перехода к конкретному слайду
    function goToSlide(index) {
        currentSlide = index;
        updateSlider();
    }
    
    // Инициализация
    updateSlider();
    
    // Обработчики событий
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
        });
    }
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToSlide(index);
        });
    });
    
    // Обработка свайпов для мобильных устройств
    let touchStartX = 0;
    let touchEndX = 0;
    
    slider.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    slider.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const swipeThreshold = 50; // Минимальная дистанция свайпа
        
        if (touchStartX - touchEndX > swipeThreshold) {
            // Свайп влево - следующий слайд
            nextSlide();
        } else if (touchEndX - touchStartX > swipeThreshold) {
            // Свайп вправо - предыдущий слайд
            prevSlide();
        }
    }
    
    // Обработка клавиатуры
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
        }
    });
}

// Мобильное меню
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mobileMenu = document.querySelector('.mobile-menu');
const body = document.body;

if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        mobileMenu.classList.toggle('active');
        mobileMenuBtn.classList.toggle('active');
        body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        
        // Меняем иконку
        const icon = mobileMenuBtn.querySelector('i');
        if (mobileMenu.classList.contains('active')) {
            icon.className = 'fas fa-times';
        } else {
            icon.className = 'fas fa-bars';
        }
    });
    
    // Закрытие меню при клике на ссылку
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
            mobileMenuBtn.querySelector('i').className = 'fas fa-bars';
            body.style.overflow = '';
        });
    });
    
    // Закрытие меню при клике вне его
    document.addEventListener('click', (e) => {
        if (mobileMenu.classList.contains('active') && 
            !mobileMenu.contains(e.target) && 
            !mobileMenuBtn.contains(e.target)) {
            mobileMenu.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
            mobileMenuBtn.querySelector('i').className = 'fas fa-bars';
            body.style.overflow = '';
        }
    });
    
    // Закрытие меню при нажатии Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
            mobileMenuBtn.querySelector('i').className = 'fas fa-bars';
            body.style.overflow = '';
        }
    });
}

// FAQ аккордеон (для страницы 2) - переписан, чтобы не конфликтовал с другими
function initFAQ() {
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            const isActive = answer.style.display === 'block';
            
            // Закрыть все ответы
            document.querySelectorAll('.faq-answer').forEach(item => {
                item.style.display = 'none';
            });
            
            // Показать/скрыть текущий ответ
            answer.style.display = isActive ? 'none' : 'block';
        });
    });
}

// Валидация телефона
function validatePhone(phone) {
    const phoneRegex = /^[\+]?[7]?[8]?[\s]?[\(]?[0-9]{3}[\)]?[\s]?[0-9]{3}[\s]?[0-9]{2}[\s]?[0-9]{2}$/;
    return phoneRegex.test(phone.replace(/\D/g, ''));
}

// Маска для телефона
document.querySelectorAll('input[type="tel"]').forEach(input => {
    input.addEventListener('input', function(e) {
        let value = this.value.replace(/\D/g, '');
        
        if (value.length > 0) {
            if (value[0] === '7' || value[0] === '8') {
                value = value.substring(1);
            }
            
            let formattedValue = '+7';
            
            if (value.length > 0) {
                formattedValue += ' (' + value.substring(0, 3);
            }
            if (value.length >= 4) {
                formattedValue += ') ' + value.substring(3, 6);
            }
            if (value.length >= 7) {
                formattedValue += '-' + value.substring(6, 8);
            }
            if (value.length >= 9) {
                formattedValue += '-' + value.substring(8, 10);
            }
            
            this.value = formattedValue;
        }
    });
});

// Обработка всех форм
document.querySelectorAll('.contact-form').forEach(form => {
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const name = formData.get('name');
        const phone = formData.get('phone');
        const message = formData.get('message') || '';
        const page = window.location.pathname.split('/').pop() || 'index.html';
        
        // Валидация
        if (!name || !phone) {
            alert('Пожалуйста, заполните все обязательные поля');
            return;
        }
        
        if (!validatePhone(phone)) {
            alert('Пожалуйста, введите корректный номер телефона');
            return;
        }
        
        // Показать загрузку
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Отправка...';
        submitBtn.disabled = true;
        
        try {
            // Отправка на Telegram
            const telegramResponse = await fetch('telegram-bot.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: name,
                    phone: phone,
                    message: message,
                    page: page
                })
            });
            
            const result = await telegramResponse.json();
            
            if (result.success) {
                // Показать модальное окно успеха
                showSuccessModal();
                
                // Сбросить форму
                this.reset();
                
                // Отправка в Яндекс.Метрику (если есть)
                if (typeof ym !== 'undefined') {
                    ym(XXXXXX, 'reachGoal', 'lead'); // Замените XXXXXX на ID счетчика
                }
                
                // Отправка в Google Analytics (если есть)
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'lead', {
                        'event_category': 'form',
                        'event_label': page
                    });
                }
            } else {
                throw new Error('Ошибка отправки');
            }
            
        } catch (error) {
            console.error('Error:', error);
            alert('Произошла ошибка при отправке. Пожалуйста, позвоните нам по телефону: +7 962 628-97-77');
        } finally {
            // Восстановить кнопку
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
});

// Модальное окно успеха
const successModal = document.getElementById('successModal');
const closeModalBtn = document.querySelector('.close-modal');

function showSuccessModal() {
    if (successModal) {
        successModal.style.display = 'flex';
    }
}

if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
        successModal.style.display = 'none';
    });
}

// Закрытие модального окна при клике вне его
window.addEventListener('click', (e) => {
    if (e.target === successModal) {
        successModal.style.display = 'none';
    }
});

// Плавная прокрутка к форме при клике на ссылки с якорем
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        if (href === '#') return;
        
        const targetElement = document.querySelector(href);
        
        if (targetElement) {
            e.preventDefault();
            window.scrollTo({
                top: targetElement.offsetTop - 100,
                behavior: 'smooth'
            });
        }
    });
});

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    initPhotoSlider();
    initFAQ();
});