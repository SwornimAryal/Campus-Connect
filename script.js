// Campus Connect - Frontend JavaScript (Multi-Page Version)
class CampusConnect {
    constructor() {
        this.currentUser = null;
        this.posts = [];
        this.isLoggedIn = false;
        // The init method is now called at the end of the script after the DOM is loaded.
    }

    init() {
        this.loadState();
        this.setupEventListeners();
        this.setActiveNav();
        this.renderPageContent();
        this.updateAuthUI();
    }

    // --- STATE MANAGEMENT (using localStorage) ---
    
    loadState() {
        const posts = localStorage.getItem('campusConnectPosts');
        const user = localStorage.getItem('campusConnectUser');
        const loggedIn = localStorage.getItem('campusConnectLoggedIn');

        if (posts) {
            this.posts = JSON.parse(posts);
        } else {
            this.loadSampleData(); // Load sample data if nothing is in storage
            this.savePosts();
        }

        if (user) {
            this.currentUser = JSON.parse(user);
        }
        
        this.isLoggedIn = loggedIn === 'true';
    }
    
    savePosts() {
        localStorage.setItem('campusConnectPosts', JSON.stringify(this.posts));
    }

    saveUser() {
        localStorage.setItem('campusConnectUser', JSON.stringify(this.currentUser));
    }

    saveLoginState() {
        localStorage.setItem('campusConnectLoggedIn', this.isLoggedIn);
    }

    clearState() {
        localStorage.removeItem('campusConnectPosts');
        localStorage.removeItem('campusConnectUser');
        localStorage.removeItem('campusConnectLoggedIn');
        this.currentUser = null;
        this.isLoggedIn = false;
        this.posts = [];
    }

    // --- PAGE-SPECIFIC RENDERING ---

    renderPageContent() {
        // This function checks which page we're on and calls the relevant render functions.
        if (document.getElementById('posts-grid')) {
            this.renderPosts();
        }
        if (document.querySelector('.profile-container')) {
            this.updateProfileDisplay();
            this.renderUserPosts();
        }
    }
    
    // --- EVENT LISTENERS (with existence checks) ---

    setupEventListeners() {
        // This function adds listeners only for elements that exist on the current page.
        const hamburger = document.getElementById('hamburger');
        if (hamburger) hamburger.addEventListener('click', this.toggleMobileMenu.bind(this));

        const loginBtn = document.getElementById('login-btn');
        if (loginBtn) loginBtn.addEventListener('click', () => this.showModal('login-modal'));
        
        const registerBtn = document.getElementById('register-btn');
        if (registerBtn) registerBtn.addEventListener('click', () => this.showModal('register-modal'));

        document.querySelectorAll('.modal-close').forEach(btn => btn.addEventListener('click', () => this.hideModal(btn.closest('.modal').id)));
        
        const loginForm = document.getElementById('login-form');
        if (loginForm) loginForm.addEventListener('submit', this.handleLogin.bind(this));

        const registerForm = document.getElementById('register-form');
        if (registerForm) registerForm.addEventListener('submit', this.handleRegister.bind(this));
        
        const showRegister = document.getElementById('show-register');
        if(showRegister) showRegister.addEventListener('click', (e) => {
            e.preventDefault();
            this.hideModal('login-modal');
            this.showModal('register-modal');
        });

        const showLogin = document.getElementById('show-login');
        if(showLogin) showLogin.addEventListener('click', (e) => {
            e.preventDefault();
            this.hideModal('register-modal');
            this.showModal('login-modal');
        });

        const createPostBtn = document.getElementById('create-post-btn');
        if(createPostBtn) createPostBtn.addEventListener('click', () => this.showModal('create-post-modal'));

        const createPostForm = document.getElementById('create-post-form');
        if(createPostForm) createPostForm.addEventListener('submit', this.handleCreatePost.bind(this));

        const cancelPost = document.getElementById('cancel-post');
        if(cancelPost) cancelPost.addEventListener('click', () => this.hideModal('create-post-modal'));

        const editProfileBtn = document.getElementById('edit-profile-btn');
        if(editProfileBtn) editProfileBtn.addEventListener('click', () => this.showModal('edit-profile-modal'));

        const editProfileForm = document.getElementById('edit-profile-form');
        if(editProfileForm) editProfileForm.addEventListener('submit', this.handleEditProfile.bind(this));

        const cancelEdit = document.getElementById('cancel-edit');
        if(cancelEdit) cancelEdit.addEventListener('click', () => this.hideModal('edit-profile-modal'));

        const searchInput = document.getElementById('search-input');
        if(searchInput) searchInput.addEventListener('input', this.handleSearch.bind(this));

        const categoryFilter = document.getElementById('category-filter');
        if(categoryFilter) categoryFilter.addEventListener('change', this.handleFilter.bind(this));
        
        const getStartedBtn = document.getElementById('get-started');
        if(getStartedBtn) getStartedBtn.addEventListener('click', () => this.showModal('register-modal'));

        const learnMoreBtn = document.getElementById('learn-more');
        if(learnMoreBtn) learnMoreBtn.addEventListener('click', () => window.location.href = 'about.html');
        
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) this.hideModal(modal.id);
            });
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const activeModal = document.querySelector('.modal.active');
                if (activeModal) this.hideModal(activeModal.id);
            }
        });
    }
    
    // --- NAVIGATION ---

    setActiveNav() {
        const currentPage = window.location.pathname.split('/').pop();
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === currentPage) {
                link.classList.add('active');
            }
        });
    }

    toggleMobileMenu() {
        const navMenu = document.getElementById('nav-menu');
        if (navMenu) navMenu.classList.toggle('active');
    }

    // --- MODALS ---

    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }

    // --- AUTHENTICATION & PROFILE ---

    handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        // Dummy user data
        this.currentUser = {
            id: 1, name: 'John Doe', email: email, major: 'Computer Science',
            skills: ['JavaScript', 'React', 'Node.js', 'Python', 'Machine Learning'],
            interests: ['Web Development', 'AI/ML', 'Mobile Apps', 'Data Science']
        };
        this.isLoggedIn = true;

        this.saveUser();
        this.saveLoginState();
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

        this.currentUser = {
            id: Date.now(), name, email, major, skills: [], interests: []
        };
        this.isLoggedIn = true;

        this.saveUser();
        this.saveLoginState();
        this.updateAuthUI();
        this.hideModal('register-modal');
        this.showNotification('Registration successful!', 'success');
    }

    updateAuthUI() {
        const navAuth = document.querySelector('.nav-auth');
        if (!navAuth) return;

        if (this.isLoggedIn && this.currentUser) {
            navAuth.innerHTML = `
                <div class="user-menu" style="display: flex; align-items: center; gap: 15px; color: var(--gray-700);">
                    <span>Welcome, ${this.currentUser.name.split(' ')[0]}</span>
                    <button class="btn btn-outline" id="logout-btn">Logout</button>
                </div>
            `;
            document.getElementById('logout-btn').addEventListener('click', this.handleLogout.bind(this));
        } else {
            navAuth.innerHTML = `
                <button class="btn btn-outline" id="login-btn">Login</button>
                <button class="btn btn-primary" id="register-btn">Sign Up</button>
            `;
            document.getElementById('login-btn').addEventListener('click', () => this.showModal('login-modal'));
            document.getElementById('register-btn').addEventListener('click', () => this.showModal('register-modal'));
        }
    }

    handleLogout() {
        this.clearState();
        this.loadSampleData(); // reload sample data after logout
        this.savePosts();
        this.updateAuthUI();
        this.showNotification('Logged out successfully!', 'success');
        if (document.querySelector('.profile-container')) {
            window.location.href = 'index.html'; // Redirect from profile page on logout
        }
    }

    handleEditProfile(e) {
        e.preventDefault();
        if (!this.currentUser) return;

        this.currentUser.name = document.getElementById('edit-name').value;
        this.currentUser.major = document.getElementById('edit-major').value;
        this.currentUser.skills = document.getElementById('edit-skills').value.split(',').map(s => s.trim()).filter(Boolean);
        this.currentUser.interests = document.getElementById('edit-interests').value.split(',').map(i => i.trim()).filter(Boolean);
        
        this.saveUser();
        this.updateProfileDisplay();
        this.hideModal('edit-profile-modal');
        this.showNotification('Profile updated successfully!', 'success');
    }

    updateProfileDisplay() {
        if (!this.currentUser || !document.querySelector('.profile-container')) return;

        document.getElementById('profile-name').textContent = this.currentUser.name;
        document.getElementById('profile-email').textContent = this.currentUser.email;
        document.getElementById('profile-major').textContent = this.currentUser.major;

        const skillsContainer = document.getElementById('skills-container');
        skillsContainer.innerHTML = this.currentUser.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('');
        
        const interestsContainer = document.getElementById('interests-container');
        interestsContainer.innerHTML = this.currentUser.interests.map(interest => `<span class="interest-tag">${interest}</span>`).join('');
    
        // also update the edit form placeholders
        document.getElementById('edit-name').value = this.currentUser.name;
        document.getElementById('edit-major').value = this.currentUser.major;
        document.getElementById('edit-skills').value = this.currentUser.skills.join(', ');
        document.getElementById('edit-interests').value = this.currentUser.interests.join(', ');
    }

    // --- POSTS ---
    
    handleCreatePost(e) {
        e.preventDefault();
        const title = document.getElementById('post-title').value;
        const category = document.getElementById('post-category').value;
        const content = document.getElementById('post-content').value;
        const tags = document.getElementById('post-tags').value.split(',').map(tag => tag.trim()).filter(tag => tag);
        const authorName = (this.isLoggedIn && this.currentUser) ? this.currentUser.name : 'Anonymous';
        const authorInitials = authorName.split(' ').map(n => n[0]).join('');

        const newPost = {
            id: Date.now(), title, category, content, tags,
            author: authorName, authorInitials,
            date: new Date().toLocaleDateString(),
            likes: 0, comments: 0
        };

        this.posts.unshift(newPost);
        this.savePosts();
        this.renderPosts();
        this.hideModal('create-post-modal');
        this.showNotification('Post created successfully!', 'success');
        document.getElementById('create-post-form').reset();
    }

    handleSearch(e) {
        const searchTerm = e.target.value.toLowerCase();
        const category = document.getElementById('category-filter').value;
        this.filterPosts(searchTerm, category);
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
    
    renderPosts(postsToRender = this.posts) {
        const postsGrid = document.getElementById('posts-grid');
        if (!postsGrid) return;
        
        if (postsToRender.length === 0) {
            postsGrid.innerHTML = `
                <div class="no-posts">
                    <h3>No posts found</h3>
                    <p>Try adjusting your search or filter criteria, or create a new post!</p>
                </div>`;
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
                    <p>${post.content.substring(0, 150)}${post.content.length > 150 ? '...' : ''}</p>
                    <div class="post-tags">
                        ${post.tags.map(tag => `<span class="post-tag">${tag}</span>`).join('')}
                    </div>
                </div>
                <div class="post-footer">
                    <div class="post-actions">
                        <span class="post-action" onclick="campusConnect.likePost(${post.id})">
                            <i class="fas fa-heart"></i> ${post.likes}
                        </span>
                        <span class="post-action"><i class="fas fa-comment"></i> ${post.comments}</span>
                        <span class="post-action"><i class="fas fa-share"></i> Share</span>
                    </div>
                    <div class="post-date">${post.date}</div>
                </div>
            </div>
        `).join('');
    }

    renderUserPosts() {
        const userPostsContainer = document.getElementById('user-posts');
        if (!userPostsContainer || !this.currentUser) return;

        const userPosts = this.posts.filter(post => post.author === this.currentUser.name);
        
        if (userPosts.length === 0) {
            userPostsContainer.innerHTML = '<p>You have not created any posts yet.</p>';
            return;
        }

        userPostsContainer.innerHTML = userPosts.map(post => `
            <div class="post-card" style="margin-bottom: 20px;">
                <div class="post-header"><h3 class="post-title">${post.title}</h3></div>
                <div class="post-content"><p>${post.content.substring(0, 100)}...</p></div>
                <div class="post-footer"><div class="post-date">${post.date}</div></div>
            </div>
        `).join('');
    }

    likePost(postId) {
        const post = this.posts.find(p => p.id === postId);
        if (post) {
            post.likes++;
            this.savePosts();
            this.filterPosts( // re-render with current filters
                document.getElementById('search-input')?.value || '',
                document.getElementById('category-filter')?.value || ''
            );
        }
    }
    
    // --- UTILITIES ---

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `<span>${message}</span>`;
        notification.style.cssText = `
            position: fixed; top: 80px; right: 20px;
            background: ${type === 'success' ? 'var(--success-color)' : 'var(--danger-color)'};
            color: white; padding: 15px; border-radius: var(--border-radius);
            box-shadow: var(--shadow-lg); z-index: 3000;
            animation: slideInRight 0.3s ease;
        `;
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    loadSampleData() {
        this.posts = [
            { id: 1, title: "Looking for React Developer for E-commerce Project", category: "project", content: "We're building a modern e-commerce platform using React and Node.js. Looking for a frontend developer with experience in React hooks, Redux, and modern CSS frameworks.", tags: ["React", "JavaScript", "E-commerce"], author: "Sarah Johnson", authorInitials: "SJ", date: "2024-01-15", likes: 12, comments: 5 },
            { id: 2, title: "Study Group for Machine Learning Course", category: "study", content: "Forming a study group for CS 229 Machine Learning. We meet twice a week to discuss assignments and prepare for exams. All skill levels welcome!", tags: ["Machine Learning", "Study Group", "CS 229"], author: "Mike Chen", authorInitials: "MC", date: "2024-01-14", likes: 8, comments: 3 },
            { id: 3, title: "Free Python Tutorial Resources", category: "resource", content: "Sharing a collection of free Python tutorials and coding challenges. Perfect for beginners and intermediate learners.", tags: ["Python", "Tutorial", "Programming"], author: "Alex Rodriguez", authorInitials: "AR", date: "2024-01-13", likes: 15, comments: 7 },
            { id: 4, title: "Tech Talk: Future of AI in Healthcare", category: "event", content: "Join us for an exciting tech talk by Dr. Emily Watson on AI applications in healthcare. Free pizza and networking after the talk!", tags: ["AI", "Healthcare", "Tech Talk"], author: "Tech Society", authorInitials: "TS", date: "2024-01-12", likes: 20, comments: 12 }
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
}

// Add required CSS animations for notifications
const addAnimationStyles = () => {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
};

// Initialize the application once the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    addAnimationStyles();
    window.campusConnect = new CampusConnect();
    window.campusConnect.init();
});
