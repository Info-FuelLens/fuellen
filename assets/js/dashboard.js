// Dashboard functionality
document.addEventListener('DOMContentLoaded', function() {
    // Load user data
    loadUserData();
    
    // Tab navigation
    const navItems = document.querySelectorAll('.nav-item[data-tab]');
    const tabContents = document.querySelectorAll('.tab-content');

    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const tabId = this.getAttribute('data-tab');
            
            // Update active nav item
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding tab content
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === `${tabId}-tab`) {
                    content.classList.add('active');
                }
            });
        });
    });

    // Profile form handling
    const profileForm = document.getElementById('profile-form');
    if (profileForm) {
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveProfile();
        });
    }

    // Avatar upload
    const avatarUploadBtn = document.querySelector('.avatar-upload-btn');
    if (avatarUploadBtn) {
        avatarUploadBtn.addEventListener('click', function() {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = handleAvatarUpload;
            input.click();
        });
    }

    function loadUserData() {
        // Get user data from localStorage (in a real app, this would come from the server)
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        const userEmail = localStorage.getItem('userEmail');
        
        // Update header
        const userName = document.getElementById('user-name');
        if (userName) {
            userName.textContent = userData.firstName || 'User';
        }

        // Update profile section
        const profileName = document.getElementById('profile-name');
        const profileCompany = document.getElementById('profile-company');
        
        if (profileName) {
            profileName.textContent = `${userData.firstName || 'John'} ${userData.lastName || 'Doe'}`;
        }
        
        if (profileCompany) {
            profileCompany.textContent = userData.companyName || 'Green Energy CNG';
        }

        // Populate profile form
        const formFields = {
            'profile_first_name': userData.firstName || 'John',
            'profile_last_name': userData.lastName || 'Doe',
            'profile_email': userData.email || userEmail || 'john.doe@example.com',
            'profile_phone': userData.phone || '+91 9876543210',
            'profile_company_name': userData.companyName || 'Green Energy CNG',
            'profile_company_type': userData.companyType || 'CNG Filling Station'
        };

        Object.keys(formFields).forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.value = formFields[fieldId];
            }
        });
    }

    function saveProfile() {
        const formData = new FormData(document.getElementById('profile-form'));
        const submitBtn = document.querySelector('#profile-form button[type="submit"]');
        
        setLoadingState(submitBtn, true);

        // Simulate API call
        setTimeout(() => {
            // Update localStorage
            const userData = JSON.parse(localStorage.getItem('userData') || '{}');
            userData.firstName = formData.get('first_name');
            userData.lastName = formData.get('last_name');
            userData.email = formData.get('email');
            userData.phone = formData.get('phone');
            userData.companyName = formData.get('company_name');
            userData.companyType = formData.get('company_type');
            
            localStorage.setItem('userData', JSON.stringify(userData));
            localStorage.setItem('userEmail', userData.email);

            // Update display
            loadUserData();
            
            setLoadingState(submitBtn, false);
            showSuccessMessage('Profile updated successfully!');
        }, 1500);
    }

    function handleAvatarUpload(event) {
        const file = event.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                showErrorMessage('Please select a valid image file');
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                showErrorMessage('File size must be less than 5MB');
                return;
            }

            const reader = new FileReader();
            reader.onload = function(e) {
                // Update avatar display
                const avatars = document.querySelectorAll('.profile-avatar, .user-avatar');
                avatars.forEach(avatar => {
                    avatar.innerHTML = `<img src="${e.target.result}" alt="Profile" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`;
                });

                // Store in localStorage (in a real app, upload to server)
                localStorage.setItem('userAvatar', e.target.result);
                showSuccessMessage('Profile picture updated successfully!');
            };
            reader.readAsDataURL(file);
        }
    }

    // Load saved avatar
    const savedAvatar = localStorage.getItem('userAvatar');
    if (savedAvatar) {
        const avatars = document.querySelectorAll('.profile-avatar, .user-avatar');
        avatars.forEach(avatar => {
            avatar.innerHTML = `<img src="${savedAvatar}" alt="Profile" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`;
        });
    }

    // Simulate real-time data updates
    function updateDashboardData() {
        // Update stats with slight variations
        const statNumbers = document.querySelectorAll('.stat-info h3');
        statNumbers.forEach(stat => {
            const currentValue = parseInt(stat.textContent);
            if (!isNaN(currentValue)) {
                // Add small random variation
                const variation = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
                const newValue = Math.max(0, currentValue + variation);
                stat.textContent = stat.textContent.replace(currentValue.toString(), newValue.toString());
            }
        });
    }

    // Update data every 30 seconds
    setInterval(updateDashboardData, 30000);

    // Notification handling
    const notificationBtn = document.querySelector('.notification-btn');
    if (notificationBtn) {
        notificationBtn.addEventListener('click', function() {
            showNotifications();
        });
    }

    function showNotifications() {
        const notifications = [
            {
                title: 'Tank Verification Complete',
                message: 'Tank CNG-001 has been successfully verified',
                time: '2 hours ago',
                type: 'success'
            },
            {
                title: 'Inspection Due',
                message: 'Tank CNG-015 inspection due in 3 days',
                time: '4 hours ago',
                type: 'warning'
            },
            {
                title: 'Compliance Report',
                message: 'Monthly compliance report is ready',
                time: '1 day ago',
                type: 'info'
            }
        ];

        // Create notification panel
        const panel = document.createElement('div');
        panel.className = 'notification-panel';
        panel.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            width: 350px;
            max-height: 500px;
            background: rgba(15, 23, 42, 0.95);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 16px;
            padding: 20px;
            z-index: 10000;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;

        panel.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                <h3 style="color: white; font-weight: 600; margin: 0;">Notifications</h3>
                <button class="close-notifications" style="background: none; border: none; color: #94a3b8; cursor: pointer; font-size: 18px;">×</button>
            </div>
            <div class="notification-list">
                ${notifications.map(notif => `
                    <div class="notification-item" style="padding: 12px; background: rgba(255, 255, 255, 0.05); border-radius: 8px; margin-bottom: 8px;">
                        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                            <div style="width: 8px; height: 8px; border-radius: 50%; background: ${
                                notif.type === 'success' ? '#10b981' : 
                                notif.type === 'warning' ? '#f59e0b' : '#0066FF'
                            };"></div>
                            <h4 style="color: white; font-size: 14px; font-weight: 500; margin: 0;">${notif.title}</h4>
                        </div>
                        <p style="color: #94a3b8; font-size: 12px; margin: 0 0 4px 16px;">${notif.message}</p>
                        <span style="color: #64748b; font-size: 11px; margin-left: 16px;">${notif.time}</span>
                    </div>
                `).join('')}
            </div>
        `;

        document.body.appendChild(panel);

        // Animate in
        setTimeout(() => {
            panel.style.transform = 'translateX(0)';
        }, 100);

        // Close button
        panel.querySelector('.close-notifications').addEventListener('click', function() {
            panel.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(panel);
            }, 300);
        });

        // Auto close after 10 seconds
        setTimeout(() => {
            if (document.body.contains(panel)) {
                panel.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    document.body.removeChild(panel);
                }, 300);
            }
        }, 10000);
    }

    // Mobile sidebar toggle
    const sidebarToggle = document.createElement('button');
    sidebarToggle.innerHTML = '<i class="fas fa-bars"></i>';
    sidebarToggle.className = 'sidebar-toggle';
    sidebarToggle.style.cssText = `
        display: none;
        position: fixed;
        top: 20px;
        left: 20px;
        z-index: 10001;
        background: rgba(0, 102, 255, 0.9);
        border: none;
        border-radius: 8px;
        color: white;
        padding: 12px;
        cursor: pointer;
        font-size: 18px;
    `;

    document.body.appendChild(sidebarToggle);

    sidebarToggle.addEventListener('click', function() {
        const sidebar = document.querySelector('.sidebar');
        sidebar.classList.toggle('active');
    });

    // Show sidebar toggle on mobile
    function checkMobile() {
        if (window.innerWidth <= 768) {
            sidebarToggle.style.display = 'block';
        } else {
            sidebarToggle.style.display = 'none';
            document.querySelector('.sidebar').classList.remove('active');
        }
    }

    window.addEventListener('resize', checkMobile);
    checkMobile();
});