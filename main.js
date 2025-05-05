// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.navbar')) {
            if (window.innerWidth <= 768) {
                navLinks.style.display = 'none';
            }
        }
    });

    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            navLinks.style.display = 'flex';
        }
    });

    // Active link highlighting
    const currentPath = window.location.pathname;
    const navLinksList = document.querySelectorAll('.nav-links a');
    
    navLinksList.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Form validation
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!form.checkValidity()) {
                e.preventDefault();
                e.stopPropagation();
            }
            form.classList.add('was-validated');
        });
    });

    // Add animation to feature cards on scroll
    const featureCards = document.querySelectorAll('.feature-card');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-float');
            }
        });
    }, {
        threshold: 0.1
    });

    featureCards.forEach(card => {
        observer.observe(card);
    });
});

// Authentication functions
const auth = {
    login: async (email, password) => {
        try {
            // For demonstration, we'll use hardcoded credentials
            // In a real application, this would be handled by a server
            if (email === "demo@fuellens.com" && password === "demo123") {
                const userData = {
                    email: email,
                    name: "Demo User",
                    role: "station_owner"
                };
                localStorage.setItem('user', JSON.stringify(userData));
                window.location.href = 'dashboard.html';
                return;
            }
            
            // Check if the user exists in localStorage (for registered users)
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const user = users.find(u => u.email === email && u.password === password);
            
            if (user) {
                const userData = {
                    email: user.email,
                    name: user.name,
                    role: "station_owner"
                };
                localStorage.setItem('user', JSON.stringify(userData));
                window.location.href = 'dashboard.html';
            } else {
                throw new Error('Invalid credentials');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('Login failed. Please try again. (Use demo@fuellens.com / demo123 for demo access)');
        }
    },

    register: async (userData) => {
        try {
            // Get existing users or initialize empty array
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            
            // Check if email already exists
            if (users.some(user => user.email === userData.email)) {
                throw new Error('Email already registered');
            }
            
            // Add new user
            users.push(userData);
            localStorage.setItem('users', JSON.stringify(users));
            
            alert('Registration successful! Please login with your credentials.');
            window.location.href = 'login.html';
        } catch (error) {
            console.error('Registration error:', error);
            alert(error.message || 'Registration failed. Please try again.');
        }
    },

    logout: () => {
        localStorage.removeItem('user');
        window.location.href = 'index.html';
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('user');
    },

    getCurrentUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }
};

// Protected route check
function checkAuth() {
    if (!auth.isAuthenticated() && window.location.pathname.includes('dashboard')) {
        window.location.href = 'login.html';
    }
}

// Initialize auth check
checkAuth(); 