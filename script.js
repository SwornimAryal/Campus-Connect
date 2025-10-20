// Campus Connect - Frontend JavaScript
class CampusConnect {
    constructor() {
        this.currentUser = null;
        this.posts = [];
        this.isLoggedIn = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadSampleData();
        this.renderPosts();
        this.setupNavigation();
    }

    setupEventListeners() {
        // Navigation
        document.getElementById('hamburger').addEventListener('click', this.toggleMobileMenu.bind(this));
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', this.handleNavigation.bind(this));
        });

        // Auth buttons
        document.getElementById('login-btn').addEventListener('click', () => this.showModal('login-modal'));
        document.getElementById('register-btn').addEventListener('click', () => this.showModal('register-modal'));

        // Modal controls
        document.getElementById('login-close').addEventListener('click', () => this.hideModal('login-modal'));
        document.getElementById('register-close').addEventListener('click', () => this.hideModal('register-modal'));
        document.getElementById('create-post-close').addEventListener('click', () => this.hideModal('create-post-modal'));
        document.getElementById('edit-profile-close').addEventListener('click', () => this.hideModal('edit-profile-modal'));

        // Auth forms
        document.getElementById('login-form').addEventListener('submit', this.handleLogin.bind(this));
        document.getElementById('register-form').addEventListener('submit', this.handleRegister.bind(this));

        // Auth switch
        document.getElementById('show-register').addEventListener('click', (e) => {
            e.preventDefault();
            this.hideModal('login-modal');
            this.showModal('register-modal');
        });
        document.getElementById('show-login').addEventListener('click', (e) => {
            e.preventDefault();
            this.hideModal('register-modal');
            this.showModal('login-modal');
        });

        // Post creation
        document.getElementById('create-post-btn').addEventListener('click', () => this.showModal('create-post-modal'));
        document.getElementById('create-post-form').addEventListener('submit', this.handleCreatePost.bind(this));
        document.getElementById('cancel-post').addEventListener('click', () => this.hideModal('create-post-modal'));

        // Profile editing
        document.getElementById('edit-profile-btn').addEventListener('click', () => this.showModal('edit-profile-modal'));
        document.getElementById('edit-profile-form').addEventListener('submit', this.handleEditProfile.bind(this));
        document.getElementById('cancel-edit').addEventListener('click', () => this.hideModal('edit-profile-modal'));

        // Search and filter
        document.getElementById('search-input').addEventListener('input', this.handleSearch.bind(this));
        document.getElementById('category-filter').addEventListener('change', this.handleFilter.bind(this));

        // Hero buttons
        document.getElementById('get-started').addEventListener('click', () => this.showModal('register-modal'));
        document.getElementById('learn-more').addEventListener('click', () => this.scrollToSection('about'));

        // Close modals on outside click
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hideModal(modal.id);
                }
            });
        });
    }

    setupNavigation() {
        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href').substring(1);
                this.scrollToSection(targetId);
            });
        });
    }

    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    }

    toggleMobileMenu() {
        const navMenu = document.getElementById('nav-menu');
        const hamburger = document.getElementById('hamburger');
        
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    }

    handleNavigation(e) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href').substring(1);
        
        // Update active nav link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        e.target.classList.add('active');

        // Show corresponding section
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(targetId).classList.add('active');

        // Close mobile menu if open
        const navMenu = document.getElementById('nav-menu');
        const hamburger = document.getElementById('hamburger');
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    }

    showModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        // Simulate login
        this.currentUser = {
            id: 1,
            name: 'John Doe',
            email: email,
            major: 'Computer Science',
            skills: ['JavaScript', 'React', 'Node.js', 'Python', 'Machine Learning'],
            interests: ['Web Development', 'AI/ML', 'Mobile Apps', 'Data Science']
        };
        this.isLoggedIn = true;

        this.updateAuthUI();
        this.hideModal('login-modal');
        this.showNotification('Login successful!', 'success');
    }

    handleRegister(e) {
        e.preventDefault();
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const major = document.getElementById('register-major').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm').value;

        if (password !== confirmPassword) {
            this.showNotification('Passwords do not match!', 'error');
            return;
        }

        // Simulate registration
        this.currentUser = {
            id: Date.now(),
            name: name,
            email: email,
            major: major,
            skills: [],
            interests: []
        };
        this.isLoggedIn = true;

        this.updateAuthUI();
        this.hideModal('register-modal');
        this.showNotification('Registration successful!', 'success');
    }

    updateAuthUI() {
        const navAuth = document.querySelector('.nav-auth');
        if (this.isLoggedIn) {
            navAuth.innerHTML = `
                <div class="user-menu">
                    <span>Welcome, ${this.currentUser.name}</span>
                    <button class="btn btn-outline" id="logout-btn">Logout</button>
                </div>
            `;
            document.getElementById('logout-btn').addEventListener('click', this.handleLogout.bind(this));
        } else {
            navAuth.innerHTML = `
                <button class="btn btn-outline" id="login-btn">Login</button>
                <button class="btn btn-primary" id="register-btn">Sign Up</button>
            `;
            // Re-attach event listeners
            document.getElementById('login-btn').addEventListener('click', () => this.showModal('login-modal'));
            document.getElementById('register-btn').addEventListener('click', () => this.showModal('register-modal'));
        }
    }

    handleLogout() {
        this.currentUser = null;
        this.isLoggedIn = false;
        this.updateAuthUI();
        this.showNotification('Logged out successfully!', 'success');
    }

    handleCreatePost(e) {
        e.preventDefault();
        const title = document.getElementById('post-title').value;
        const category = document.getElementById('post-category').value;
        const content = document.getElementById('post-content').value;
        const tags = document.getElementById('post-tags').value.split(',').map(tag => tag.trim()).filter(tag => tag);

        const newPost = {
            id: Date.now(),
            title: title,
            category: category,
            content: content,
            tags: tags,
            author: this.currentUser ? this.currentUser.name : 'Anonymous',
            authorInitials: this.currentUser ? this.currentUser.name.split(' ').map(n => n[0]).join('') : 'A',
            date: new Date().toLocaleDateString(),
            likes: 0,
            comments: 0
        };

        this.posts.unshift(newPost);
        this.renderPosts();
        this.hideModal('create-post-modal');
        this.showNotification('Post created successfully!', 'success');

        // Clear form
        document.getElementById('create-post-form').reset();
    }

    handleEditProfile(e) {
        e.preventDefault();
        const name = document.getElementById('edit-name').value;
        const major = document.getElementById('edit-major').value;
        const bio = document.getElementById('edit-bio').value;
        const skills = document.getElementById('edit-skills').value.split(',').map(skill => skill.trim()).filter(skill => skill);
        const interests = document.getElementById('edit-interests').value.split(',').map(interest => interest.trim()).filter(interest => interest);

        if (this.currentUser) {
            this.currentUser.name = name;
            this.currentUser.major = major;
            this.currentUser.bio = bio;
            this.currentUser.skills = skills;
            this.currentUser.interests = interests;

            this.updateProfileDisplay();
            this.hideModal('edit-profile-modal');
            this.showNotification('Profile updated successfully!', 'success');
        }
    }

    updateProfileDisplay() {
        if (this.currentUser) {
            document.getElementById('profile-name').textContent = this.currentUser.name;
            document.getElementById('profile-email').textContent = this.currentUser.email;
            document.getElementById('profile-major').textContent = this.currentUser.major;

            // Update skills
            const skillsContainer = document.getElementById('skills-container');
            skillsContainer.innerHTML = this.currentUser.skills.map(skill => 
                `<span class="skill-tag">${skill}</span>`
            ).join('');

            // Update interests
            const interestsContainer = document.getElementById('interests-container');
            interestsContainer.innerHTML = this.currentUser.interests.map(interest => 
                `<span class="interest-tag">${interest}</span>`
            ).join('');
        }
    }

    handleSearch(e) {
        const searchTerm = e.target.value.toLowerCase();
        this.filterPosts(searchTerm, document.getElementById('category-filter').value);
    }

    handleFilter(e) {
        const category = e.target.value;
        const searchTerm = document.getElementById('search-input').value.toLowerCase();
        this.filterPosts(searchTerm, category);
    }

    filterPosts(searchTerm, category) {
        const filteredPosts = this.posts.filter(post => {
            const matchesSearch = !searchTerm || 
                post.title.toLowerCase().includes(searchTerm) ||
                post.content.toLowerCase().includes(searchTerm) ||
                post.tags.some(tag => tag.toLowerCase().includes(searchTerm));
            
            const matchesCategory = !category || post.category === category;
            
            return matchesSearch && matchesCategory;
        });

        this.renderPosts(filteredPosts);
    }

    loadSampleData() {
        this.posts = [
            {
                id: 1,
                title: "Looking for React Developer for E-commerce Project",
                category: "project",
                content: "We're building a modern e-commerce platform using React and Node.js. Looking for a frontend developer with experience in React hooks, Redux, and modern CSS frameworks. Project duration: 3 months.",
                tags: ["React", "JavaScript", "E-commerce", "Frontend"],
                author: "Sarah Johnson",
                authorInitials: "SJ",
                date: "2024-01-15",
                likes: 12,
                comments: 5
            },
            {
                id: 2,
                title: "Study Group for Machine Learning Course",
                category: "study",
                content: "Forming a study group for CS 229 Machine Learning. We meet twice a week to discuss assignments and prepare for exams. All skill levels welcome!",
                tags: ["Machine Learning", "Study Group", "CS 229"],
                author: "Mike Chen",
                authorInitials: "MC",
                date: "2024-01-14",
                likes: 8,
                comments: 3
            },
            {
                id: 3,
                title: "Free Python Tutorial Resources",
                category: "resource",
                content: "Sharing a collection of free Python tutorials and coding challenges. Perfect for beginners and intermediate learners. Includes data structures, algorithms, and web development.",
                tags: ["Python", "Tutorial", "Programming", "Free"],
                author: "Alex Rodriguez",
                authorInitials: "AR",
                date: "2024-01-13",
                likes: 15,
                comments: 7
            },
            {
                id: 4,
                title: "Tech Talk: Future of AI in Healthcare",
                category: "event",
                content: "Join us for an exciting tech talk by Dr. Emily Watson on AI applications in healthcare. Free pizza and networking after the talk!",
                tags: ["AI", "Healthcare", "Tech Talk", "Networking"],
                author: "Tech Society",
                authorInitials: "TS",
                date: "2024-01-12",
                likes: 20,
                comments: 12
            },
            {
                id: 5,
                title: "Mobile App Development Team Needed",
                category: "project",
                content: "Looking for iOS and Android developers to join our startup team. We're building a social networking app for students. Equity-based compensation available.",
                tags: ["Mobile", "iOS", "Android", "Startup"],
                author: "David Kim",
                authorInitials: "DK",
                date: "2024-01-11",
                likes: 6,
                comments: 4
            },
            {
                id: 6,
                title: "Database Design Study Materials",
                category: "resource",
                content: "Comprehensive notes and practice problems for Database Systems course. Covers SQL, normalization, indexing, and query optimization.",
                tags: ["Database", "SQL", "Study Materials", "CS 145"],
                author: "Lisa Wang",
                authorInitials: "LW",
                date: "2024-01-10",
                likes: 9,
                comments: 2
            }
        ];
    }

    renderPosts(postsToRender = this.posts) {
        const postsGrid = document.getElementById('posts-grid');
        
        if (postsToRender.length === 0) {
            postsGrid.innerHTML = `
                <div class="no-posts">
                    <i class="fas fa-search" style="font-size: 3rem; color: var(--gray-400); margin-bottom: 20px;"></i>
                    <h3>No posts found</h3>
                    <p>Try adjusting your search or filter criteria.</p>
                </div>
            `;
            return;
        }

        postsGrid.innerHTML = postsToRender.map(post => `
            <div class="post-card">
                <div class="post-header">
                    <div class="post-meta">
                        <div class="post-avatar">${post.authorInitials}</div>
                        <div>
                            <div class="post-author">${post.author}</div>
                            <div class="post-category">${post.category}</div>
                        </div>
                    </div>
                    <h3 class="post-title">${post.title}</h3>
                </div>
                <div class="post-content">
                    <p>${post.content}</p>
                    <div class="post-tags">
                        ${post.tags.map(tag => `<span class="post-tag">${tag}</span>`).join('')}
                    </div>
                </div>
                <div class="post-footer">
                    <div class="post-actions">
                        <span class="post-action" onclick="campusConnect.likePost(${post.id})">
                            <i class="fas fa-heart"></i>
                            ${post.likes}
                        </span>
                        <span class="post-action">
                            <i class="fas fa-comment"></i>
                            ${post.comments}
                        </span>
                        <span class="post-action">
                            <i class="fas fa-share"></i>
                            Share
                        </span>
                    </div>
                    <div class="post-date">${post.date}</div>
                </div>
            </div>
        `).join('');
    }

    likePost(postId) {
        const post = this.posts.find(p => p.id === postId);
        if (post) {
            post.likes++;
            this.renderPosts();
            this.showNotification('Post liked!', 'success');
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'var(--success-color)' : type === 'error' ? 'var(--danger-color)' : 'var(--info-color)'};
            color: white;
            padding: 15px 20px;
            border-radius: var(--border-radius);
            box-shadow: var(--shadow-lg);
            z-index: 3000;
            animation: slideInRight 0.3s ease;
        `;

        document.body.appendChild(notification);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Add notification animations to CSS
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }
`;
document.head.appendChild(notificationStyles);

// Initialize the application
const campusConnect = new CampusConnect();

// Add some interactive animations
document.addEventListener('DOMContentLoaded', function() {
    // Animate feature cards on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
            }
        });
    }, observerOptions);

    // Observe feature cards
    document.querySelectorAll('.feature-card').forEach(card => {
        observer.observe(card);
    });

    // Add fadeInUp animation
    const fadeInUpStyles = document.createElement('style');
    fadeInUpStyles.textContent = `
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .feature-card {
            opacity: 0;
        }
    `;
    document.head.appendChild(fadeInUpStyles);
});

// Add smooth scrolling for all anchor links
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

// Add loading states for better UX
function showLoading(element) {
    element.innerHTML = '<div class="loading"><div class="spinner"></div></div>';
}

function hideLoading(element, content) {
    element.innerHTML = content;
}

// Add form validation
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;

    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.style.borderColor = 'var(--danger-color)';
            isValid = false;
        } else {
            input.style.borderColor = 'var(--gray-200)';
        }
    });

    return isValid;
}

// Add input validation on blur
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('input, select, textarea').forEach(input => {
        input.addEventListener('blur', function() {
            if (this.hasAttribute('required') && !this.value.trim()) {
                this.style.borderColor = 'var(--danger-color)';
            } else {
                this.style.borderColor = 'var(--gray-200)';
            }
        });

        input.addEventListener('input', function() {
            if (this.style.borderColor === 'rgb(239, 68, 68)') {
                this.style.borderColor = 'var(--gray-200)';
            }
        });
    });
});

// Add keyboard navigation support
document.addEventListener('keydown', function(e) {
    // Close modals with Escape key
    if (e.key === 'Escape') {
        const activeModal = document.querySelector('.modal.active');
        if (activeModal) {
            campusConnect.hideModal(activeModal.id);
        }
    }
});

// Add touch support for mobile
let touchStartY = 0;
let touchEndY = 0;

document.addEventListener('touchstart', function(e) {
    touchStartY = e.changedTouches[0].screenY;
});

document.addEventListener('touchend', function(e) {
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartY - touchEndY;

    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swipe up
            console.log('Swipe up detected');
        } else {
            // Swipe down
            console.log('Swipe down detected');
        }
    }
}
