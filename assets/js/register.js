// Registration page functionality
document.addEventListener('DOMContentLoaded', function() {
    let currentStep = 1;
    const totalSteps = 3;

    // Step navigation
    const nextBtns = document.querySelectorAll('.next-step');
    const prevBtns = document.querySelectorAll('.prev-step');
    const form = document.getElementById('register-form');

    nextBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            if (validateCurrentStep()) {
                nextStep();
            }
        });
    });

    prevBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            prevStep();
        });
    });

    function nextStep() {
        if (currentStep < totalSteps) {
            currentStep++;
            updateStepDisplay();
        }
    }

    function prevStep() {
        if (currentStep > 1) {
            currentStep--;
            updateStepDisplay();
        }
    }

    function updateStepDisplay() {
        // Update progress indicator
        const progressSteps = document.querySelectorAll('.progress-step');
        const progressLines = document.querySelectorAll('.progress-line');
        
        progressSteps.forEach((step, index) => {
            if (index + 1 <= currentStep) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });

        progressLines.forEach((line, index) => {
            if (index + 1 < currentStep) {
                line.style.background = '#0066FF';
            } else {
                line.style.background = '#374151';
            }
        });

        // Show current step
        const formSteps = document.querySelectorAll('.form-step');
        formSteps.forEach((step, index) => {
            if (index + 1 === currentStep) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
    }

    function validateCurrentStep() {
        const currentFormStep = document.querySelector(`.form-step[data-step="${currentStep}"]`);
        const inputs = currentFormStep.querySelectorAll('input[required], select[required]');
        let isValid = true;

        inputs.forEach(input => {
            const formGroup = input.closest('.form-group');
            const existingError = formGroup.querySelector('.error-message');
            
            if (existingError) {
                existingError.remove();
            }
            
            formGroup.classList.remove('error');

            if (!input.value.trim()) {
                showFieldError(input, 'This field is required');
                isValid = false;
            } else if (input.type === 'email' && !isValidEmail(input.value)) {
                showFieldError(input, 'Please enter a valid email address');
                isValid = false;
            } else if (input.type === 'password' && input.value.length < 6) {
                showFieldError(input, 'Password must be at least 6 characters');
                isValid = false;
            } else if (input.name === 'confirm_password') {
                const password = document.getElementById('password').value;
                if (input.value !== password) {
                    showFieldError(input, 'Passwords do not match');
                    isValid = false;
                }
            }
        });

        // Additional validation for step 3 (terms)
        if (currentStep === 3) {
            const termsAccepted = document.querySelector('input[name="terms_accepted"]').checked;
            const privacyAccepted = document.querySelector('input[name="privacy_accepted"]').checked;
            
            if (!termsAccepted || !privacyAccepted) {
                showErrorMessage('Please accept the required terms and conditions');
                isValid = false;
            }
        }

        return isValid;
    }

    // Password toggle functionality
    const passwordToggles = document.querySelectorAll('.password-toggle');
    passwordToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!validateCurrentStep()) {
            return;
        }

        const submitBtn = this.querySelector('button[type="submit"]');
        setLoadingState(submitBtn, true);

        // Get form data
        const formData = new FormData(this);
        
        // Simulate registration process
        setTimeout(() => {
            // Store user data in localStorage for demo
            const userData = {
                firstName: formData.get('first_name'),
                lastName: formData.get('last_name'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                companyName: formData.get('company_name'),
                companyType: formData.get('company_type'),
                address: formData.get('address'),
                city: formData.get('city'),
                state: formData.get('state'),
                zipCode: formData.get('zip_code'),
                country: formData.get('country')
            };

            localStorage.setItem('userData', JSON.stringify(userData));
            localStorage.setItem('userType', 'station');
            localStorage.setItem('userEmail', userData.email);

            showSuccessMessage('Account created successfully! Redirecting to dashboard...');
            
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 2000);
        }, 3000);
    });

    // Helper functions
    function showFieldError(input, message) {
        const formGroup = input.closest('.form-group');
        formGroup.classList.add('error');
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        formGroup.appendChild(errorDiv);
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Real-time validation
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            const formGroup = this.closest('.form-group');
            const existingError = formGroup.querySelector('.error-message');
            
            if (existingError) {
                existingError.remove();
            }
            
            formGroup.classList.remove('error');

            if (this.hasAttribute('required') && !this.value.trim()) {
                showFieldError(this, 'This field is required');
            } else if (this.type === 'email' && this.value && !isValidEmail(this.value)) {
                showFieldError(this, 'Please enter a valid email address');
            } else if (this.type === 'password' && this.value && this.value.length < 6) {
                showFieldError(this, 'Password must be at least 6 characters');
            } else if (this.name === 'confirm_password' && this.value) {
                const password = document.getElementById('password').value;
                if (this.value !== password) {
                    showFieldError(this, 'Passwords do not match');
                }
            }
        });
    });

    // Password strength indicator
    const passwordInput = document.getElementById('password');
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            const password = this.value;
            const strength = calculatePasswordStrength(password);
            updatePasswordStrengthIndicator(strength);
        });
    }

    function calculatePasswordStrength(password) {
        let strength = 0;
        if (password.length >= 6) strength++;
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        return strength;
    }

    function updatePasswordStrengthIndicator(strength) {
        // Remove existing indicator
        const existingIndicator = document.querySelector('.password-strength');
        if (existingIndicator) {
            existingIndicator.remove();
        }

        const passwordGroup = document.getElementById('password').closest('.form-group');
        const indicator = document.createElement('div');
        indicator.className = 'password-strength';
        
        let strengthText = '';
        let strengthClass = '';
        
        if (strength <= 2) {
            strengthText = 'Weak';
            strengthClass = 'weak';
        } else if (strength <= 4) {
            strengthText = 'Medium';
            strengthClass = 'medium';
        } else {
            strengthText = 'Strong';
            strengthClass = 'strong';
        }
        
        indicator.innerHTML = `
            <div class="strength-bar ${strengthClass}">
                <div class="strength-fill" style="width: ${(strength / 6) * 100}%"></div>
            </div>
            <span class="strength-text ${strengthClass}">${strengthText}</span>
        `;
        
        indicator.style.cssText = `
            margin-top: 8px;
            display: flex;
            align-items: center;
            gap: 8px;
        `;
        
        const strengthBar = indicator.querySelector('.strength-bar');
        strengthBar.style.cssText = `
            flex: 1;
            height: 4px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 2px;
            overflow: hidden;
        `;
        
        const strengthFill = indicator.querySelector('.strength-fill');
        strengthFill.style.cssText = `
            height: 100%;
            transition: width 0.3s ease;
            background: ${strength <= 2 ? '#ef4444' : strength <= 4 ? '#f59e0b' : '#10b981'};
        `;
        
        const strengthText = indicator.querySelector('.strength-text');
        strengthText.style.cssText = `
            font-size: 12px;
            font-weight: 500;
            color: ${strength <= 2 ? '#ef4444' : strength <= 4 ? '#f59e0b' : '#10b981'};
        `;
        
        passwordGroup.appendChild(indicator);
    }
});