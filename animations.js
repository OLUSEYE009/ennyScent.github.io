// Animation on scroll
function animateOnScroll() {
    const elements = document.querySelectorAll('.about-content, .product-card, .contact-info, .contact-form');
    
    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;
        
        if (elementPosition < screenPosition) {
            if (element.classList.contains('about-content')) {
                element.style.animation = 'slideInLeft 1s ease forwards';
            } else if (element.classList.contains('contact-info')) {
                element.style.animation = 'slideInLeft 1s ease forwards';
            } else if (element.classList.contains('contact-form')) {
                element.style.animation = 'slideInRight 1s ease forwards';
            } else {
                element.style.animation = 'fadeInUp 1s ease forwards';
            }
        }
    });
}

// Initialize animations
window.addEventListener('load', animateOnScroll);
window.addEventListener('scroll', animateOnScroll);

// Add hover animation to product cards
document.addEventListener('DOMContentLoaded', () => {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-1rem)';
            card.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.1)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
        });
    });
});

// Cart notification animation
const cartNotificationStyle = document.createElement('style');
cartNotificationStyle.textContent = `
    .cart-notification {
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        background: var(--primary);
        color: white;
        padding: 1.5rem 2rem;
        border-radius: 0.5rem;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        transform: translateX(150%);
        transition: transform 0.3s ease;
        z-index: 1000;
    }
    
    .cart-notification.show {
        transform: translateX(0);
    }
    
    .cart-notification p {
        font-size: 1.6rem;
        margin: 0;
    }
`;

document.head.appendChild(cartNotificationStyle);