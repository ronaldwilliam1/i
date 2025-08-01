// ===== CONFIGURATION ===== 
const API_BASE_URL = 'http://localhost:3000/api'; // Cambiar por tu URL de backend
const TRON_NETWORK = 'mainnet'; // 'mainnet' o 'shasta' para testnet

// ===== UTILITY FUNCTIONS =====
function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    const errorTextElement = document.getElementById(elementId + 'Text');
    
    if (errorElement && errorTextElement) {
        errorTextElement.textContent = message;
        errorElement.classList.remove('d-none');
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            errorElement.classList.add('d-none');
        }, 5000);
    }
}

function showSuccess(elementId, message) {
    const successElement = document.getElementById(elementId);
    const successTextElement = document.getElementById(elementId + 'Text');
    
    if (successElement && successTextElement) {
        successTextElement.textContent = message;
        successElement.classList.remove('d-none');
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
            successElement.classList.add('d-none');
        }, 3000);
    }
}

function hideAlerts() {
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(alert => alert.classList.add('d-none'));
}

function setLoading(buttonId, isLoading) {
    const button = document.getElementById(buttonId);
    const btnText = button.querySelector('.btn-text');
    const btnSpinner = button.querySelector('.btn-spinner');
    
    if (isLoading) {
        button.disabled = true;
        btnText.classList.add('d-none');
        btnSpinner.classList.remove('d-none');
    } else {
        button.disabled = false;
        btnText.classList.remove('d-none');
        btnSpinner.classList.add('d-none');
    }
}

// ===== TRX ADDRESS VALIDATION =====
function isValidTrxAddress(address) {
    // TRX addresses start with 'T' and are 34 characters long
    const trxRegex = /^T[A-Za-z1-9]{33}$/;
    return trxRegex.test(address);
}

function validateTrxAddress(inputId, feedbackId) {
    const input = document.getElementById(inputId);
    const feedback = document.getElementById(feedbackId);
    const address = input.value.trim();
    
    if (!address) {
        input.classList.remove('is-valid', 'is-invalid');
        feedback.textContent = '';
        feedback.className = 'input-feedback';
        return false;
    }
    
    if (isValidTrxAddress(address)) {
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
        feedback.textContent = '✓ Dirección TRX válida';
        feedback.className = 'input-feedback valid';
        return true;
    } else {
        input.classList.remove('is-valid');
        input.classList.add('is-invalid');
        feedback.textContent = '✗ Dirección TRX inválida';
        feedback.className = 'input-feedback invalid';
        return false;
    }
}

// ===== PASSWORD UTILITIES =====
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const icon = document.getElementById(inputId + 'ToggleIcon');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

function checkPasswordStrength(password) {
    let strength = 0;
    let feedback = '';
    
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    switch (strength) {
        case 0:
        case 1:
        case 2:
            feedback = 'Contraseña débil';
            return { strength: 'weak', feedback };
        case 3:
        case 4:
            feedback = 'Contraseña media';
            return { strength: 'medium', feedback };
        case 5:
            feedback = 'Contraseña fuerte';
            return { strength: 'strong', feedback };
        default:
            return { strength: 'weak', feedback: 'Contraseña débil' };
    }
}

// ===== WALLET CONNECTION =====
async function connectWallet(walletType) {
    try {
        let address = null;
        
        switch (walletType) {
            case 'tronlink':
                address = await connectTronLink();
                break;
            case 'metamask':
                address = await connectMetaMask();
                break;
            case 'walletconnect':
                address = await connectWalletConnect();
                break;
            default:
                throw new Error('Tipo de wallet no soportado');
        }
        
        if (address) {
            // Auto-fill TRX address if on register page
            const trxInput = document.getElementById('trxAddress');
            if (trxInput) {
                trxInput.value = address;
                validateTrxAddress('trxAddress', 'trxAddressFeedback');
            }
            
            // Auto-login if on login page
            if (document.getElementById('loginForm')) {
                await loginWithWallet(address, walletType);
            }
        }
        
    } catch (error) {
        console.error('Error connecting wallet:', error);
        showError('loginError', 'Error al conectar wallet: ' + error.message);
    }
}

async function connectTronLink() {
    if (typeof window.tronWeb === 'undefined') {
        throw new Error('TronLink no está instalado');
    }
    
    if (!window.tronWeb.ready) {
        throw new Error('TronLink no está conectado');
    }
    
    return window.tronWeb.defaultAddress.base58;
}

async function connectMetaMask() {
    if (typeof window.ethereum === 'undefined') {
        throw new Error('MetaMask no está instalado');
    }
    
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    if (accounts.length === 0) {
        throw new Error('No se pudo conectar con MetaMask');
    }
    
    // Note: MetaMask provides Ethereum addresses, not TRX addresses
    // You might need to convert or handle this differently
    return accounts[0];
}

async function connectWalletConnect() {
    // WalletConnect implementation would go here
    throw new Error('WalletConnect no implementado aún');
}

// ===== AUTO-FILL TRX ADDRESS =====
async function autoFillTrxAddress() {
    try {
        // Try TronLink first
        if (typeof window.tronWeb !== 'undefined' && window.tronWeb.ready) {
            const address = window.tronWeb.defaultAddress.base58;
            document.getElementById('trxAddress').value = address;
            validateTrxAddress('trxAddress', 'trxAddressFeedback');
            return;
        }
        
        // If TronLink not available, show options
        const walletOptions = `
            <div class="wallet-selection">
                <p>Selecciona tu wallet para auto-completar:</p>
                <button class="btn btn-wallet mb-2" onclick="connectWallet('tronlink')">
                    <img src="images/tronlink-icon.png" alt="TronLink" class="wallet-icon">
                    TronLink
                </button>
                <button class="btn btn-wallet" onclick="connectWallet('metamask')">
                    <img src="images/metamask-icon.png" alt="MetaMask" class="wallet-icon">
                    MetaMask
                </button>
            </div>
        `;
        
        // You could show this in a modal or alert
        alert('Por favor instala TronLink o MetaMask para auto-completar tu dirección');
        
    } catch (error) {
        console.error('Error auto-filling TRX address:', error);
        showError('registerError', 'Error al conectar wallet: ' + error.message);
    }
}

// ===== REGISTRATION FUNCTIONS =====
async function registerUser(userData) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Error en el registro');
        }
        
        return data;
    } catch (error) {
        throw error;
    }
}

async function checkUsernameAvailability(username) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/check-username?username=${encodeURIComponent(username)}`);
        const data = await response.json();
        return data.available;
    } catch (error) {
        console.error('Error checking username:', error);
        return false;
    }
}

async function checkEmailAvailability(email) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/check-email?email=${encodeURIComponent(email)}`);
        const data = await response.json();
        return data.available;
    } catch (error) {
        console.error('Error checking email:', error);
        return false;
    }
}

async function checkTrxAddressAvailability(address) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/check-trx-address?address=${encodeURIComponent(address)}`);
        const data = await response.json();
        return data.available;
    } catch (error) {
        console.error('Error checking TRX address:', error);
        return false;
    }
}

// ===== LOGIN FUNCTIONS =====
async function loginUser(credentials) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials)
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Error en el inicio de sesión');
        }
        
        return data;
    } catch (error) {
        throw error;
    }
}

async function loginWithWallet(address, walletType) {
    try {
        setLoading('loginBtn', true);
        
        const credentials = {
            trxAddress: address,
            walletType: walletType,
            loginMethod: 'wallet'
        };
        
        const result = await loginUser(credentials);
        
        if (result.success) {
            // Store authentication token
            localStorage.setItem('authToken', result.token);
            localStorage.setItem('userAddress', address);
            
            showSuccess('loginSuccess', 'Inicio de sesión exitoso. Redirigiendo...');
            
            // Redirect to dashboard after 2 seconds
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 2000);
        }
        
    } catch (error) {
        showError('loginError', error.message);
    } finally {
        setLoading('loginBtn', false);
    }
}

// ===== SOCIAL REGISTRATION =====
async function registerWithSocial(provider) {
    try {
        // This would integrate with OAuth providers
        alert(`Registro con ${provider} - Funcionalidad en desarrollo`);
    } catch (error) {
        showError('registerError', 'Error en registro social: ' + error.message);
    }
}

async function registerWithWallet(walletType) {
    try {
        const address = await connectWallet(walletType);
        if (address) {
            // Check if address is already registered
            const isAvailable = await checkTrxAddressAvailability(address);
            if (!isAvailable) {
                showError('registerError', 'Esta dirección TRX ya está registrada');
                return;
            }
            
            // Auto-fill form and proceed with wallet registration
            document.getElementById('trxAddress').value = address;
            validateTrxAddress('trxAddress', 'trxAddressFeedback');
            
            // You could auto-submit or let user fill remaining fields
            alert('Dirección TRX auto-completada. Complete los campos restantes para continuar.');
        }
    } catch (error) {
        showError('registerError', 'Error en registro con wallet: ' + error.message);
    }
}

// ===== FORGOT PASSWORD =====
function showForgotPassword() {
    const modal = new bootstrap.Modal(document.getElementById('forgotPasswordModal'));
    modal.show();
}

async function sendPasswordReset(trxAddress) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ trxAddress })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Error al enviar instrucciones');
        }
        
        return data;
    } catch (error) {
        throw error;
    }
}

// ===== EMAIL VERIFICATION =====
async function resendVerificationEmail() {
    try {
        const email = localStorage.getItem('pendingVerificationEmail');
        if (!email) {
            alert('No se encontró email pendiente de verificación');
            return;
        }
        
        const response = await fetch(`${API_BASE_URL}/auth/resend-verification`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            alert('Email de verificación reenviado');
        } else {
            alert('Error al reenviar email: ' + data.message);
        }
        
    } catch (error) {
        alert('Error al reenviar email: ' + error.message);
    }
}

// ===== EVENT LISTENERS =====
document.addEventListener('DOMContentLoaded', function() {
    
    // ===== REGISTRATION FORM =====
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        // Username validation
        const usernameInput = document.getElementById('username');
        const usernameFeedback = document.getElementById('usernameFeedback');
        
        if (usernameInput) {
            let usernameTimeout;
            usernameInput.addEventListener('input', function() {
                clearTimeout(usernameTimeout);
                const username = this.value.trim();
                
                if (username.length < 3) {
                    this.classList.remove('is-valid', 'is-invalid');
                    usernameFeedback.textContent = '';
                    return;
                }
                
                usernameFeedback.textContent = 'Verificando disponibilidad...';
                usernameFeedback.className = 'input-feedback checking';
                
                usernameTimeout = setTimeout(async () => {
                    try {
                        const isAvailable = await checkUsernameAvailability(username);
                        if (isAvailable) {
                            usernameInput.classList.remove('is-invalid');
                            usernameInput.classList.add('is-valid');
                            usernameFeedback.textContent = '✓ Nombre de usuario disponible';
                            usernameFeedback.className = 'input-feedback valid';
                        } else {
                            usernameInput.classList.remove('is-valid');
                            usernameInput.classList.add('is-invalid');
                            usernameFeedback.textContent = '✗ Nombre de usuario no disponible';
                            usernameFeedback.className = 'input-feedback invalid';
                        }
                    } catch (error) {
                        usernameFeedback.textContent = 'Error al verificar disponibilidad';
                        usernameFeedback.className = 'input-feedback invalid';
                    }
                }, 500);
            });
        }
        
        // Email validation
        const emailInput = document.getElementById('email');
        const emailFeedback = document.getElementById('emailFeedback');
        
        if (emailInput) {
            let emailTimeout;
            emailInput.addEventListener('input', function() {
                clearTimeout(emailTimeout);
                const email = this.value.trim();
                
                if (!email || !email.includes('@')) {
                    this.classList.remove('is-valid', 'is-invalid');
                    emailFeedback.textContent = '';
                    return;
                }
                
                emailFeedback.textContent = 'Verificando disponibilidad...';
                emailFeedback.className = 'input-feedback checking';
                
                emailTimeout = setTimeout(async () => {
                    try {
                        const isAvailable = await checkEmailAvailability(email);
                        if (isAvailable) {
                            emailInput.classList.remove('is-invalid');
                            emailInput.classList.add('is-valid');
                            emailFeedback.textContent = '✓ Email disponible';
                            emailFeedback.className = 'input-feedback valid';
                        } else {
                            emailInput.classList.remove('is-valid');
                            emailInput.classList.add('is-invalid');
                            emailFeedback.textContent = '✗ Email ya registrado';
                            emailFeedback.className = 'input-feedback invalid';
                        }
                    } catch (error) {
                        emailFeedback.textContent = 'Error al verificar email';
                        emailFeedback.className = 'input-feedback invalid';
                    }
                }, 500);
            });
        }
        
        // TRX Address validation
        const trxAddressInput = document.getElementById('trxAddress');
        if (trxAddressInput) {
            let trxTimeout;
            trxAddressInput.addEventListener('input', function() {
                clearTimeout(trxTimeout);
                const address = this.value.trim();
                
                if (!validateTrxAddress('trxAddress', 'trxAddressFeedback')) {
                    return;
                }
                
                const feedback = document.getElementById('trxAddressFeedback');
                feedback.textContent = 'Verificando disponibilidad...';
                feedback.className = 'input-feedback checking';
                
                trxTimeout = setTimeout(async () => {
                    try {
                        const isAvailable = await checkTrxAddressAvailability(address);
                        if (isAvailable) {
                            feedback.textContent = '✓ Dirección TRX disponible';
                            feedback.className = 'input-feedback valid';
                        } else {
                            trxAddressInput.classList.remove('is-valid');
                            trxAddressInput.classList.add('is-invalid');
                            feedback.textContent = '✗ Dirección TRX ya registrada';
                            feedback.className = 'input-feedback invalid';
                        }
                    } catch (error) {
                        feedback.textContent = 'Error al verificar dirección';
                        feedback.className = 'input-feedback invalid';
                    }
                }, 500);
            });
        }
        
        // Password strength check
        const passwordInput = document.getElementById('password');
        const passwordStrength = document.getElementById('passwordStrength');
        
        if (passwordInput && passwordStrength) {
            passwordInput.addEventListener('input', function() {
                const password = this.value;
                if (password.length === 0) {
                    passwordStrength.textContent = '';
                    passwordStrength.className = 'password-strength';
                    return;
                }
                
                const result = checkPasswordStrength(password);
                passwordStrength.textContent = result.feedback;
                passwordStrength.className = `password-strength ${result.strength}`;
            });
        }
        
        // Confirm password validation
        const confirmPasswordInput = document.getElementById('confirmPassword');
        const confirmPasswordFeedback = document.getElementById('confirmPasswordFeedback');
        
        if (confirmPasswordInput && confirmPasswordFeedback) {
            confirmPasswordInput.addEventListener('input', function() {
                const password = document.getElementById('password').value;
                const confirmPassword = this.value;
                
                if (confirmPassword.length === 0) {
                    this.classList.remove('is-valid', 'is-invalid');
                    confirmPasswordFeedback.textContent = '';
                    return;
                }
                
                if (password === confirmPassword) {
                    this.classList.remove('is-invalid');
                    this.classList.add('is-valid');
                    confirmPasswordFeedback.textContent = '✓ Las contraseñas coinciden';
                    confirmPasswordFeedback.className = 'input-feedback valid';
                } else {
                    this.classList.remove('is-valid');
                    this.classList.add('is-invalid');
                    confirmPasswordFeedback.textContent = '✗ Las contraseñas no coinciden';
                    confirmPasswordFeedback.className = 'input-feedback invalid';
                }
            });
        }
        
        // Form submission
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            hideAlerts();
            
            try {
                setLoading('registerBtn', true);
                
                const formData = new FormData(this);
                const userData = {
                    username: formData.get('username'),
                    email: formData.get('email'),
                    trxAddress: formData.get('trxAddress'),
                    password: formData.get('password'),
                    acceptTerms: formData.get('acceptTerms') === 'on',
                    ageVerification: formData.get('ageVerification') === 'on',
                    marketingConsent: formData.get('marketingConsent') === 'on'
                };
                
                // Validate required fields
                if (!userData.acceptTerms || !userData.ageVerification) {
                    throw new Error('Debes aceptar los términos y confirmar tu edad');
                }
                
                const result = await registerUser(userData);
                
                if (result.success) {
                    showSuccess('registerSuccess', 'Registro exitoso. Revisa tu email para verificar tu cuenta.');
                    
                    // Store email for verification resend
                    localStorage.setItem('pendingVerificationEmail', userData.email);
                    
                    // Show email verification modal
                    setTimeout(() => {
                        const modal = new bootstrap.Modal(document.getElementById('emailVerificationModal'));
                        modal.show();
                    }, 2000);
                    
                    // Reset form
                    this.reset();
                }
                
            } catch (error) {
                showError('registerError', error.message);
            } finally {
                setLoading('registerBtn', false);
            }
        });
    }
    
    // ===== LOGIN FORM =====
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        // TRX Address validation
        const trxAddressInput = document.getElementById('trxAddress');
        if (trxAddressInput) {
            trxAddressInput.addEventListener('input', function() {
                validateTrxAddress('trxAddress', 'addressFeedback');
            });
        }
        
        // Form submission
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            hideAlerts();
            
            try {
                setLoading('loginBtn', true);
                
                const formData = new FormData(this);
                const credentials = {
                    trxAddress: formData.get('trxAddress'),
                    password: formData.get('password'),
                    rememberMe: formData.get('rememberMe') === 'on',
                    loginMethod: 'password'
                };
                
                const result = await loginUser(credentials);
                
                if (result.success) {
                    // Store authentication token
                    const storage = credentials.rememberMe ? localStorage : sessionStorage;
                    storage.setItem('authToken', result.token);
                    storage.setItem('userAddress', credentials.trxAddress);
                    
                    showSuccess('loginSuccess', 'Inicio de sesión exitoso. Redirigiendo...');
                    
                    // Redirect to dashboard after 2 seconds
                    setTimeout(() => {
                        window.location.href = 'dashboard.html';
                    }, 2000);
                }
                
            } catch (error) {
                showError('loginError', error.message);
            } finally {
                setLoading('loginBtn', false);
            }
        });
    }
    
    // ===== FORGOT PASSWORD FORM =====
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            try {
                const formData = new FormData(this);
                const trxAddress = formData.get('recoveryTrxAddress');
                
                if (!isValidTrxAddress(trxAddress)) {
                    alert('Por favor ingresa una dirección TRX válida');
                    return;
                }
                
                const result = await sendPasswordReset(trxAddress);
                
                if (result.success) {
                    alert('Instrucciones de recuperación enviadas a tu email registrado');
                    bootstrap.Modal.getInstance(document.getElementById('forgotPasswordModal')).hide();
                }
                
            } catch (error) {
                alert('Error: ' + error.message);
            }
        });
    }
});

// ===== GLOBAL ERROR HANDLER =====
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
});

// ===== EXPORT FOR TESTING =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        isValidTrxAddress,
        checkPasswordStrength,
        validateTrxAddress
    };
}

