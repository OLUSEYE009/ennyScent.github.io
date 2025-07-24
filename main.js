// DOM Elements
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
const searchBtn = document.getElementById('search-btn');
const searchForm = document.getElementById('search-form');
const cartBtn = document.getElementById('cart-btn');
const shoppingCart = document.getElementById('shopping-cart');
const userBtn = document.getElementById('user-btn');
const loginForm = document.getElementById('login-form');
const closeModalBtns = document.querySelectorAll('.close-modal');
const productModal = document.getElementById('product-modal');
const checkoutModal = document.getElementById('checkout-modal');
const confirmationModal = document.getElementById('confirmation-modal');
const filterBtns = document.querySelectorAll('.filter-btn');
const priceRange = document.getElementById('price-range');
const priceValue = document.getElementById('price-value');
const productGrid = document.getElementById('product-grid');
const searchBox = document.getElementById('search-box');
const searchResults = document.getElementById('search-results');
const checkoutForm = document.getElementById('checkout-form');
const complaintForm = document.getElementById('complaint-form');
const newsletterForm = document.getElementById('newsletter-form');

// Cart Data
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Preloader
window.addEventListener('load', () => {
    const preloader = document.querySelector('.preloader');
    setTimeout(() => {
        preloader.classList.add('fade-out');
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }, 1500);
});

// Mobile Menu Toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
});

// Search Form Toggle
searchBtn.addEventListener('click', (e) => {
    e.preventDefault();
    searchForm.classList.toggle('active');
    searchBox.focus();
});

// Shopping Cart Toggle
cartBtn.addEventListener('click', (e) => {
    e.preventDefault();
    shoppingCart.classList.toggle('active');
    updateCart();
});

// Login Form Toggle
userBtn.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.classList.toggle('active');
});

// Close Modals
closeModalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        productModal.classList.remove('active');
        checkoutModal.classList.remove('active');
        confirmationModal.classList.remove('active');
    });
});

// Close modals when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === productModal) {
        productModal.classList.remove('active');
    }
    if (e.target === checkoutModal) {
        checkoutModal.classList.remove('active');
    }
    if (e.target === confirmationModal) {
        confirmationModal.classList.remove('active');
    }
});

// Close confirmation modal
document.querySelector('.close-confirmation')?.addEventListener('click', () => {
    confirmationModal.classList.remove('active');
});

// Price Range Filter
priceRange.addEventListener('input', () => {
    const maxPrice = priceRange.value;
    priceValue.textContent = `₦0 - ₦${maxPrice}`;
    filterProducts();
});

// Filter Products
function filterProducts() {
    const filter = document.querySelector('.filter-btn.active').dataset.filter;
    const maxPrice = priceRange.value;
    const searchTerm = searchBox.value.toLowerCase();
    
    let filteredProducts = products;
    
    // Apply category filter
    if (filter !== 'all') {
        filteredProducts = filteredProducts.filter(product => product.category === filter);
    }
    
    // Apply price filter
    filteredProducts = filteredProducts.filter(product => product.price <= maxPrice);
    
    // Apply search filter
    if (searchTerm) {
        filteredProducts = filteredProducts.filter(product => 
            product.name.toLowerCase().includes(searchTerm) || 
            product.description.toLowerCase().includes(searchTerm))
    }
    
    displayProducts(filteredProducts);
}

// Filter Buttons
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(btn => btn.classList.remove('active'));
        btn.classList.add('active');
        filterProducts();
    });
});

// Search Functionality
searchBox.addEventListener('input', () => {
    if (searchBox.value) {
        searchResults.classList.add('active');
        searchResults.textContent = `Search results for "${searchBox.value}"`;
    } else {
        searchResults.classList.remove('active');
    }
    filterProducts();
});

// Display Products
function displayProducts(productsToDisplay) {
    productGrid.innerHTML = '';
    
    if (productsToDisplay.length === 0) {
        productGrid.innerHTML = '<p class="no-results">No products found matching your criteria.</p>';
        return;
    }
    
    productsToDisplay.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.dataset.id = product.id;
        productCard.dataset.category = product.category;
        
        productCard.innerHTML = `
            ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                <div class="product-actions">
                    <a href="#" class="quick-view" data-id="${product.id}"><i class="fas fa-eye"></i></a>
                    <a href="#" class="add-to-wishlist"><i class="fas fa-heart"></i></a>
                </div>
            </div>
            <div class="product-content">
                <p class="product-category">${product.category}</p>
                <h3 class="product-title">${product.name}</h3>
                <div class="product-rating">
                    ${getRatingStars(product.rating)}
                    <span>(${product.reviews})</span>
                </div>
                <div class="product-price">
                    <div>
                        <span class="price">₦${product.price.toFixed(2)}</span>
                        ${product.oldPrice ? `<span class="old-price">₦${product.oldPrice.toFixed(2)}</span>` : ''}
                    </div>
                    <a href="#" class="add-to-cart" data-id="${product.id}"><i class="fas fa-shopping-cart"></i></a>
                </div>
            </div>
        `;
        
        productGrid.appendChild(productCard);
    });
    
    // Add event listeners to new elements
    document.querySelectorAll('.quick-view').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const productId = parseInt(btn.dataset.id);
            showProductModal(productId);
        });
    });
    
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const productId = parseInt(btn.dataset.id);
            addToCart(productId);
        });
    });
}

// Get Rating Stars
function getRatingStars(rating) {
    let stars = '';
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    if (halfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

// Show Product Modal
function showProductModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const modalBody = document.querySelector('.modal-body');
    modalBody.innerHTML = `
        <div class="modal-image">
            <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="modal-details">
            <h2>${product.name}</h2>
            <div class="price">
                $${product.price.toFixed(2)}
                ${product.oldPrice ? `<span class="old-price">$${product.oldPrice.toFixed(2)}</span>` : ''}
            </div>
            <div class="rating">
                ${getRatingStars(product.rating)}
                <span>(${product.reviews} reviews)</span>
            </div>
            <p class="description">${product.description}</p>
            
            <div class="fragrance-notes">
                <h4>Fragrance Notes:</h4>
                <ul>
                    ${product.notes.map(note => `<li>${note}</li>`).join('')}
                </ul>
            </div>
            
            <div class="quantity">
                <label>Quantity:</label>
                <div class="quantity-input">
                    <button class="decrease">-</button>
                    <input type="number" value="1" min="1">
                    <button class="increase">+</button>
                </div>
            </div>
            
            <button class="btn add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
            
            <p class="product-meta">
                <span>Category:</span> ${product.category} | 
                <span>Brand:</span> ${product.brand} | 
                <span>Size:</span> ${product.size}
            </p>
        </div>
    `;
    
    // Quantity controls
    const quantityInput = modalBody.querySelector('.quantity-input input');
    modalBody.querySelector('.decrease').addEventListener('click', (e) => {
        e.preventDefault();
        if (quantityInput.value > 1) {
            quantityInput.value--;
        }
    });
    
    modalBody.querySelector('.increase').addEventListener('click', (e) => {
        e.preventDefault();
        quantityInput.value++;
    });
    
    // Add to cart from modal
    modalBody.querySelector('.add-to-cart-btn').addEventListener('click', (e) => {
        e.preventDefault();
        const quantity = parseInt(quantityInput.value);
        addToCart(productId, quantity);
        productModal.classList.remove('active');
    });
    
    productModal.classList.add('active');
}

// Add to Cart
function addToCart(productId, quantity = 1) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: quantity
        });
    }
    
    updateCart();
    showCartNotification(product.name, quantity);
}

// Update Cart
function updateCart() {
    const cartItems = document.querySelector('.cart-items');
    const cartTotal = document.querySelector('.cart-total span');
    const cartCount = document.querySelector('.cart-count');
    
    cartItems.innerHTML = '';
    
    let total = 0;
    let count = 0;
    
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="item-details">
                <h4>${item.name}</h4>
                <p>$${item.price.toFixed(2)} x ${item.quantity}</p>
                <p class="price">₦${(item.price * item.quantity).toFixed(2)}</p>
            </div>
            <span class="remove-item" data-id="${item.id}">&times;</span>
        `;
        
        cartItems.appendChild(cartItem);
        total += item.price * item.quantity;
        count += item.quantity;
    });
    
    cartTotal.textContent = `₦${total.toFixed(2)}`;
    cartCount.textContent = count;
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Add event listeners to remove buttons
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const productId = parseInt(btn.dataset.id);
            removeFromCart(productId);
        });
    });
    
    // Update checkout summary
    updateCheckoutSummary();
}

// Remove from Cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

// Show Cart Notification
function showCartNotification(productName, quantity) {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `
        <p>${quantity} x ${productName} added to cart</p>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Update Checkout Summary
function updateCheckoutSummary() {
    const summaryItems = document.querySelector('.summary-items');
    const summaryTotal = document.querySelector('.summary-total span');
    
    summaryItems.innerHTML = '';
    
    let total = 0;
    
    cart.forEach(item => {
        const summaryItem = document.createElement('div');
        summaryItem.className = 'summary-item';
        summaryItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="summary-item-details">
                <h4>${item.name}</h4>
                <p>${item.quantity} x ₦${item.price.toFixed(2)}</p>
            </div>
            <div class="summary-item-price">₦${(item.price * item.quantity).toFixed(2)}</div>
        `;
        
        summaryItems.appendChild(summaryItem);
        total += item.price * item.quantity;
    });
    
    summaryTotal.textContent = `₦${total.toFixed(2)}`;
}

// Checkout Button
document.querySelector('.checkout-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    if (cart.length === 0) {
        alert('Your cart is empty. Please add some products first.');
        return;
    }
    
    shoppingCart.classList.remove('active');
    checkoutModal.classList.add('active');
});

// Checkout Form Submission
checkoutForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // In a real app, you would process the payment here
    // For this demo, we'll just show the confirmation
    
    checkoutModal.classList.remove('active');
    confirmationModal.classList.add('active');
    
    // Clear the cart
    cart = [];
    updateCart();
    localStorage.removeItem('cart');
    
    // Send email (this would be handled by the server in a real app)
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    sendOrderConfirmationEmail(name, email);
});

// Complaint Form Submission
complaintForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Thank you for your message. We will get back to you soon.');
    complaintForm.reset();
});

// Newsletter Form Submission
newsletterForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Thank you for subscribing to our newsletter!');
    newsletterForm.reset();
});

// Send Order Confirmation Email (simulated)
function sendOrderConfirmationEmail(name, email) {
    // In a real app, this would be handled by the server
    console.log(`Sending order confirmation to ${name} at ${email}`);
    // You would typically use Node.js with Nodemailer or similar to send actual emails
}

// Sample Product Data
const products = [
    {
        id: 1,
        name: 'Eternal Elegance',
        category: 'women',
        price: 19000.99,
        oldPrice: 20000,
        image: 'perfume1.jpg',
        rating: 4.5,
        reviews: 128,
        description: 'A timeless floral fragrance with notes of jasmine, rose, and vanilla. Perfect for evening wear.',
        notes: ['Jasmine', 'Rose', 'Vanilla', 'Sandalwood'],
        brand: 'Luxuria',
        size: '100ml',
        badge: 'Bestseller'
    },
    {
        id: 2,
        name: 'Midnight Mystique',
        category: 'men',
        price: 1700.99,
        image: 'perfume2.jpg',
        rating: 4.2,
        reviews: 95,
        description: 'A bold and mysterious scent with woody and spicy notes. Ideal for confident individuals.',
        notes: ['Cedar', 'Black Pepper', 'Amber', 'Patchouli'],
        brand: 'Nocturne',
        size: '100ml'
    },
    {
        id: 3,
        name: 'Sunset Serenade',
        category: 'unisex',
        price: 5000,
        image: 'perfume3.jpg',
        rating: 4.7,
        reviews: 156,
        description: 'A fresh and vibrant fragrance that captures the essence of a summer sunset.',
        notes: ['Citrus', 'Sea Salt', 'Driftwood', 'Amber'],
        brand: 'Horizon',
        size: '75ml',
        badge: 'New'
    },
    {
        id: 4,
        name: 'Velvet Embrace',
        category: 'women',
        price: 1950.99,
        image: 'perfume4.jpg',
        rating: 4.8,
        reviews: 210,
        description: 'A luxurious and sensual fragrance with rich floral and gourmand notes.',
        notes: ['Peony', 'Caramel', 'Tonka Bean', 'Musk'],
        brand: 'Opulence',
        size: '100ml',
        badge: 'Popular'
    },
    {
        id: 5,
        name: 'Iron Will',
        category: 'men',
        price: 18599,
        oldPrice: 99.99,
        image: 'perfume5.jpg',
        rating: 4.3,
        reviews: 87,
        description: 'A powerful and masculine scent with leather and tobacco accords.',
        notes: ['Leather', 'Tobacco', 'Whiskey', 'Oakmoss'],
        brand: 'Fortitude',
        size: '100ml'
    },
    {
        id: 6,
        name: 'Morning Dew',
        category: 'unisex',
        price: 50000,
        image: 'perfume6.jpg',
        rating: 4.6,
        reviews: 134,
        description: 'A clean and refreshing fragrance that evokes the freshness of morning dew.',
        notes: ['Green Tea', 'Lemon', 'Mint', 'White Musk'],
        brand: 'Pure',
        size: '75ml'
    },
    {
        id: 7,
        name: 'Golden Orchid',
        category: 'women',
        price: 10999,
        image: 'perfume7.jpg',
        rating: 4.9,
        reviews: 187,
        description: 'An exotic and opulent fragrance featuring rare orchids and golden amber.',
        notes: ['Orchid', 'Saffron', 'Amber', 'Vanilla'],
        brand: 'Luxuria',
        size: '100ml',
        badge: 'Luxury'
    },
    {
        id: 8,
        name: 'Oceanic',
        category: 'men',
        price: 17599,
        image: 'perfume8.jpg',
        rating: 4.4,
        reviews: 102,
        description: 'A fresh aquatic fragrance that captures the spirit of the open sea.',
        notes: ['Seaweed', 'Bergamot', 'Ambergris', 'Driftwood'],
        brand: 'Horizon',
        size: '100ml'
    },
    {
        id: 9,
        name: 'loquacius Aqua',
        category: 'men',
        price: 1000,
        image: 'perfume8.jpg',
        rating: 4.4,
        reviews: 102,
        description: 'A fresh aquatic fragrance that captures the spirit of the open sea.',
        notes: ['Seaweed', 'Bergamot', 'Ambergris', 'Driftwood'],
        brand: 'Horizon',
        size: '100ml'
    }
];

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    filterProducts();
    updateCart();
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Close mobile menu if open
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
                
                // Scroll to target
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Update active nav link
                document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(link => {
                    link.classList.remove('active');
                });
                
                this.classList.add('active');
            }
        });
    });
    
    // Update active nav link on scroll
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        
        document.querySelectorAll('section').forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
        
        // Sticky header
        if (window.scrollY > 100) {
            document.querySelector('.header').classList.add('scrolled');
        } else {
            document.querySelector('.header').classList.remove('scrolled');
        }
    });
});
/*Note from the developer:
Please keep in mind that am a beginner and some part of the code used are not mine instead they are examples that i copied 
Thanks A Lot 
*/