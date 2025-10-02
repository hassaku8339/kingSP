// DOM読み込み完了後に実行
document.addEventListener('DOMContentLoaded', function() {
    // ヒーローセクションのスライドショー
    initSlideshow();
    
    // スムーススクロール
    initSmoothScroll();
    
    // スクロールアニメーション
    initScrollAnimations();
    
    // プライバシーポリシーモーダル
    initPrivacyModal();

    // お知らせモーダル
    initNewsModal();
    
    // ヘッダーのスクロール効果
    initHeaderScroll();
});

// スライドショー機能
function initSlideshow() {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;
    const slideInterval = 5000; // 5秒間隔

    // 次のスライドに切り替え
    function nextSlide() {
        slides[currentSlide].classList.remove('active');
        dots[currentSlide].classList.remove('active');
        
        currentSlide = (currentSlide + 1) % slides.length;
        
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }

    // 特定のスライドに切り替え
    function goToSlide(slideIndex) {
        slides[currentSlide].classList.remove('active');
        dots[currentSlide].classList.remove('active');
        
        currentSlide = slideIndex;
        
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }

    // ドットクリックイベント
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToSlide(index);
        });
    });

    // 自動スライド
    setInterval(nextSlide, slideInterval);

    // キーボード操作対応
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            const prevSlide = currentSlide === 0 ? slides.length - 1 : currentSlide - 1;
            goToSlide(prevSlide);
        } else if (e.key === 'ArrowRight') {
            nextSlide();
        }
    });
}

// スムーススクロール
function initSmoothScroll() {
    const scrollLinks = document.querySelectorAll('a[href^="#"]');

    scrollLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href').substring(1);
            if (!targetId) {
                return;
            }
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                const scrollTarget = targetElement.tagName === 'SECTION'
                    ? targetElement
                    : (targetElement.closest('section') || targetElement);
                const headerHeight = document.querySelector('.header').offsetHeight;
                const navHeight = document.querySelector('.main-nav').offsetHeight;
                const sectionPadding = parseInt(window.getComputedStyle(scrollTarget).paddingTop, 10) || 0;
                const offset = headerHeight + navHeight - sectionPadding;
                const targetPosition = scrollTarget.offsetTop - Math.max(offset, 0);

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// スクロールアニメーション
function initScrollAnimations() {
    const animateElements = document.querySelectorAll('.service-item, .case-item, .recruit-card');
    
    // Intersection Observer API を使用
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animateElements.forEach(element => {
        observer.observe(element);
    });
}

// プライバシーポリシーモーダル
function initPrivacyModal() {
    const modal = document.getElementById('privacy-modal');
    const btn = document.getElementById('privacy-policy-btn');
    const closeBtn = modal.querySelector('.close');
    
    // モーダルを開く
    btn.addEventListener('click', () => {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // スクロール防止
    });
    
    // モーダルを閉じる
    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // スクロール復活
    }
    
    closeBtn.addEventListener('click', closeModal);
    
    // モーダル外をクリックで閉じる
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // ESCキーで閉じる
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });
}

// お知らせモーダル
function initNewsModal() {
    const modal = document.getElementById('news-modal');
    if (!modal) return;

    const links = Array.from(document.querySelectorAll('.news-link'));
    if (!links.length) return;

    const titleEl = document.getElementById('news-modal-title');
    const dateEl = document.getElementById('news-modal-date');
    const bodyEl = document.getElementById('news-modal-body');
    const closeBtn = modal.querySelector('.close');
    const prevBtn = modal.querySelector('.news-nav.prev');
    const nextBtn = modal.querySelector('.news-nav.next');
    if (!prevBtn || !nextBtn || !closeBtn || !titleEl || !dateEl || !bodyEl) {
        return;
    }

    let currentIndex = 0;

    function updateNavButtons() {
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex === links.length - 1;
    }

    function openModal(index) {
        currentIndex = index;
        const link = links[currentIndex];
        const listItem = link.closest('li');
        const dateText = listItem.querySelector('.news-date')?.textContent || '';
        const content = listItem.querySelector('.news-content');

        titleEl.textContent = link.textContent.trim();
        dateEl.textContent = dateText;
        bodyEl.innerHTML = content ? content.innerHTML : '';

        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        updateNavButtons();
    }

    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    function showNext(step) {
        const newIndex = currentIndex + step;
        if (newIndex >= 0 && newIndex < links.length) {
            openModal(newIndex);
        }
    }

    links.forEach((link, index) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            openModal(index);
        });
    });

    prevBtn.addEventListener('click', () => showNext(-1));
    nextBtn.addEventListener('click', () => showNext(1));
    closeBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (modal.style.display === 'block') {
            if (e.key === 'Escape') {
                closeModal();
            } else if (e.key === 'ArrowLeft') {
                showNext(-1);
            } else if (e.key === 'ArrowRight') {
                showNext(1);
            }
        }
    });
}

// ヘッダーのスクロール効果
function initHeaderScroll() {
    const header = document.querySelector('.header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // スクロール時の透明度調整
        if (scrollTop > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.96)';
        }
        
        lastScrollTop = scrollTop;
    });
}

// ナビゲーションのアクティブ状態管理
function initActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.main-nav a[href^="#"]');
    
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY + 200;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
}

// フォームバリデーション（将来のGoogleフォーム用）
function initFormValidation() {
    // Googleフォーム実装時に使用
    console.log('フォームバリデーション準備完了');
}

// パフォーマンス最適化：画像遅延読み込み
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// エラーハンドリング
window.addEventListener('error', (e) => {
    console.error('JavaScript Error:', e.error);
});

// ページ読み込み完了時の処理
window.addEventListener('load', () => {
    // ローディングアニメーション終了など
    document.body.classList.add('loaded');
});

// ページ離脱前の処理
window.addEventListener('beforeunload', (e) => {
    // 必要に応じて保存処理など
});

// レスポンシブ対応：ウィンドウサイズ変更時の処理
window.addEventListener('resize', debounce(() => {
    // 必要に応じてレイアウト調整
}, 250));

// デバウンス関数
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ユーティリティ関数：要素の可視性チェック
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// SNS共有機能（将来的な拡張用）
function shareOnSocial(platform, url, text) {
    const shareUrls = {
        twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    };
    
    if (shareUrls[platform]) {
        window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
}

// アナリティクス用イベント追跡
function trackEvent(category, action, label = '') {
    // Google Analytics 4 対応
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            event_category: category,
            event_label: label
        });
    }
}

// アクセシビリティ向上：フォーカス管理
function initAccessibility() {
    // タブキー操作の可視化
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            document.body.classList.add('user-is-tabbing');
        }
    });
    
    document.addEventListener('mousedown', () => {
        document.body.classList.remove('user-is-tabbing');
    });
}

// 初期化完了後にアクセシビリティ機能を有効化
document.addEventListener('DOMContentLoaded', () => {
    initAccessibility();
    initActiveNavigation();
});
