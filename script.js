// Плавная прокрутка к секциям
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Обработка отправки формы
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Получаем данные формы
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        // Здесь можно добавить отправку данных на сервер
        console.log('Отправка формы:', data);
        
        // Показываем уведомление об успешной отправке
        alert('Спасибо! Ваше сообщение отправлено.');
        this.reset();
    });
}

// Анимация появления элементов при скролле
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Добавляем анимацию для элементов портфолио
document.querySelectorAll('.portfolio-item').forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
    item.style.transition = 'all 0.6s ease-out';
    observer.observe(item);
});

// Обработка перетаскивания картинок
document.querySelectorAll('.floating-image').forEach(img => {
    let isDragging = false;
    let startX, startY;
    let currentX = 0, currentY = 0;

    function onMouseDown(e) {
        isDragging = true;
        e.preventDefault();
        
        const rect = img.getBoundingClientRect();
        
        // Сохраняем текущую позицию
        currentX = rect.left;
        currentY = rect.top;
        
        // Вычисляем смещение курсора относительно картинки
        startX = e.clientX - rect.left;
        startY = e.clientY - rect.top;
        
        // Подготавливаем картинку к перетаскиванию
        img.style.position = 'fixed';
        img.style.left = `${currentX}px`;
        img.style.top = `${currentY}px`;
        img.style.animation = 'none';
        img.style.transform = 'none';
        img.classList.add('dragging');
        
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    }

    function onMouseMove(e) {
        if (!isDragging) return;
        e.preventDefault();

        // Вычисляем новую позицию
        const newX = e.clientX - startX;
        const newY = e.clientY - startY;

        // Ограничиваем перемещение в пределах окна
        const maxX = window.innerWidth - img.offsetWidth;
        const maxY = window.innerHeight - img.offsetHeight;
        
        currentX = Math.max(0, Math.min(newX, maxX));
        currentY = Math.max(0, Math.min(newY, maxY));

        // Обновляем позицию
        img.style.left = `${currentX}px`;
        img.style.top = `${currentY}px`;
    }

    function onMouseUp() {
        if (!isDragging) return;
        isDragging = false;
        
        // Возвращаем анимацию с новой позиции
        const currentAnimation = img.getAttribute('data-animation') || 'float1';
        img.classList.remove('dragging');
        
        // Устанавливаем базовую позицию для анимации
        img.style.position = 'fixed';
        img.style.left = `${currentX}px`;
        img.style.top = `${currentY}px`;
        img.style.animation = `${currentAnimation} 20s infinite ease-in-out`;
        
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    }

    // Сохраняем название анимации для каждой картинки
    const computedStyle = window.getComputedStyle(img);
    const animation = computedStyle.getPropertyValue('animation-name');
    img.setAttribute('data-animation', animation);

    // Устанавливаем начальную позицию
    const rect = img.getBoundingClientRect();
    img.style.position = 'fixed';
    img.style.left = `${rect.left}px`;
    img.style.top = `${rect.top}px`;

    // Добавляем обработчик только на mousedown
    img.addEventListener('mousedown', onMouseDown);
});

// Управление музыкой
document.addEventListener('DOMContentLoaded', function() {
    const musicToggle = document.getElementById('musicToggle');
    const bgMusic = document.getElementById('bgMusic');
    const volumeSlider = document.getElementById('volumeSlider');
    let isPlaying = false;

    // Функция для обновления состояния кнопки
    const updateButtonState = (playing) => {
        if (playing) {
            musicToggle.innerHTML = '<i class="fas fa-pause"></i>';
            musicToggle.classList.add('playing');
        } else {
            musicToggle.innerHTML = '<i class="fas fa-music"></i>';
            musicToggle.classList.remove('playing');
        }
    };

    // Функция для установки громкости
    const setVolume = (value) => {
        const volume = Math.min(1, Math.max(0, value / 100));
        bgMusic.volume = volume;
        volumeSlider.value = value;
        localStorage.setItem('musicVolume', value);
    };

    // Инициализация начальной громкости
    const savedVolume = localStorage.getItem('musicVolume') || "20";
    setVolume(savedVolume);

    // Обработчик изменения громкости
    volumeSlider.addEventListener('input', function() {
        setVolume(this.value);
    });

    // Функция для начала воспроизведения
    const startPlayback = async () => {
        try {
            await bgMusic.play();
            isPlaying = true;
            updateButtonState(true);
        } catch (error) {
            console.log("Ошибка автовоспроизведения:", error);
            isPlaying = false;
            updateButtonState(false);
        }
    };

    // Обработчик клика по кнопке
    musicToggle.addEventListener('click', async function() {
        try {
            if (isPlaying) {
                bgMusic.pause();
                isPlaying = false;
                updateButtonState(false);
            } else {
                await bgMusic.play();
                isPlaying = true;
                updateButtonState(true);
            }
        } catch (error) {
            console.log("Ошибка воспроизведения:", error);
            isPlaying = false;
            updateButtonState(false);
        }
    });

    // Обработчики событий аудио
    bgMusic.addEventListener('play', () => {
        isPlaying = true;
        updateButtonState(true);
    });

    bgMusic.addEventListener('pause', () => {
        isPlaying = false;
        updateButtonState(false);
    });

    bgMusic.addEventListener('ended', () => {
        isPlaying = false;
        updateButtonState(false);
    });

    // Пытаемся начать воспроизведение при загрузке
    document.addEventListener('click', () => {
        if (!isPlaying) {
            startPlayback();
        }
    }, { once: true });
});

// Предзагрузка изображений
const preloadImages = () => {
    const images = [
        'persona_wallpaper.png',
        'P5X_Joker.png',
        'P5_Morgana.png',
        'wallpaper.png',
        '200px-Th14Cirno.png'
    ];
    
    images.forEach(src => {
        const img = new Image();
        img.src = src;
    });
};

// Вызываем функцию предзагрузки при загрузке страницы
document.addEventListener('DOMContentLoaded', preloadImages);

// Переключение темы
const themeToggle = document.querySelector('.theme-toggle');
let currentTheme = 'default';

themeToggle.addEventListener('click', () => {
    // Создаем новый элемент анимации при каждом клике
    const themeTransition = document.createElement('div');
    themeTransition.className = 'theme-transition';
    document.body.appendChild(themeTransition);
    
    // Форсируем перерисовку
    void themeTransition.offsetWidth;
    
    // Добавляем нужный класс анимации и создаем снежинки для Cirno темы
    if (document.documentElement.getAttribute('data-theme') === 'persona5') {
        themeTransition.classList.add('ice');
        
        // Создаем снежинки
        for (let i = 0; i < 20; i++) {
            const snowflake = document.createElement('div');
            snowflake.className = 'snowflake';
            snowflake.style.left = `${Math.random() * 100}vw`;
            snowflake.style.animationDelay = `${Math.random() * 1.5}s`;
            snowflake.style.opacity = Math.random();
            snowflake.innerHTML = '❄';
            themeTransition.appendChild(snowflake);
        }
    } else {
        themeTransition.classList.add('active');
    }
    
    // Удаляем элемент после завершения анимации
    themeTransition.addEventListener('animationend', () => {
        themeTransition.remove();
    });
    
    // Меняем тему после небольшой задержки
    setTimeout(() => {
        const floatingImages = document.querySelectorAll('.floating-image');
        const bgMusic = document.getElementById('bgMusic');
        const wasPlaying = !bgMusic.paused;
        const currentVolume = bgMusic.volume;
        
        if (currentTheme === 'default') {
            document.documentElement.setAttribute('data-theme', 'persona5');
            themeToggle.textContent = 'Cirno Theme';
            currentTheme = 'persona5';
            
            // Меняем музыку на тему Persona 5
            bgMusic.pause();
            bgMusic.src = 'persona_theme_music.mp3';
            bgMusic.volume = currentVolume;
            
            // После загрузки новой музыки
            bgMusic.addEventListener('canplaythrough', function playHandler() {
                if (wasPlaying) {
                    const playPromise = bgMusic.play();
                    if (playPromise !== undefined) {
                        playPromise.catch(error => {
                            console.log("Ошибка воспроизведения:", error);
                        });
                    }
                }
                bgMusic.removeEventListener('canplaythrough', playHandler);
            });
            
            // Меняем изображения для темы Persona 5
            floatingImages[0].src = 'P5X_Joker.png';
            floatingImages[1].src = 'P5_Morgana.png';
            floatingImages[2].src = 'P5X_Joker.png';
            floatingImages[3].src = 'P5_Morgana.png';
            
            // Обновляем анимации
            floatingImages.forEach((img, index) => {
                img.style.animation = `personaFloat${index + 1} ${20 + index * 2}s infinite ease-in-out`;
            });
        } else {
            document.documentElement.removeAttribute('data-theme');
            themeToggle.textContent = 'Persona Theme';
            currentTheme = 'default';
            
            // Возвращаем оригинальную музыку
            bgMusic.pause();
            bgMusic.src = 'background-music.mp3';
            bgMusic.volume = currentVolume;
            
            // После загрузки новой музыки
            bgMusic.addEventListener('canplaythrough', function playHandler() {
                if (wasPlaying) {
                    const playPromise = bgMusic.play();
                    if (playPromise !== undefined) {
                        playPromise.catch(error => {
                            console.log("Ошибка воспроизведения:", error);
                        });
                    }
                }
                bgMusic.removeEventListener('canplaythrough', playHandler);
            });
            
            // Возвращаем изображения Cirno
            floatingImages.forEach(img => {
                img.src = '200px-Th14Cirno.png';
            });
            
            // Возвращаем оригинальные анимации
            floatingImages.forEach((img, index) => {
                img.style.animation = `float${index + 1} ${20 + index * 2}s infinite ease-in-out`;
            });
        }
        
        // Сбрасываем анимации всех элементов
        document.querySelectorAll('.section, .bio, .social-link').forEach(el => {
            el.style.animation = 'none';
            setTimeout(() => {
                el.style.animation = '';
            }, 10);
        });
    }, 750);
});

// Устанавливаем начальный текст кнопки
themeToggle.textContent = 'Persona Theme'; 