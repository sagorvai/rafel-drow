// আপনার Google Apps Script ওয়েব অ্যাপের URL এখানে বসানো হয়েছে
const API_URL = 'https://script.google.com/macros/s/AKfycbzhWMdjJPH-n2LsOqXunT-X2WqR-AVlBTTuKVtWwGwNbgWQRt00W1aC6F5XrMgHMeDU/exec';

// backend-এ ডেটা পাঠানোর জন্য ফাংশন
async function callBackend(action, data) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            body: JSON.stringify({ action, ...data }),
            headers: {
                'Content-Type': 'text/plain' // Apps Script-এর জন্য এটি প্রয়োজন
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Backend call failed:", error);
        return { status: 'error', message: 'Failed to connect to the backend.' };
    }
}

// Function to show a specific page and hide others
function showPage(pageId) {
    document.querySelectorAll('.section').forEach(page => {
        page.style.display = 'none';
    });
    document.getElementById(pageId).style.display = 'block';
}

// Example to switch between Login and Register forms
document.getElementById('toggle-auth').addEventListener('click', () => {
    const isRegister = document.getElementById('register-form').style.display !== 'none';
    document.getElementById('register-form').style.display = isRegister ? 'none' : 'block';
    document.getElementById('login-form').style.display = isRegister ? 'block' : 'none';
    document.getElementById('auth-title').textContent = isRegister ? 'Login' : 'Register';
    document.querySelector('#toggle-auth .link-text').textContent = isRegister ? 'Register' : 'Login';
});

// Handling menu button click
document.getElementById('menu-btn').addEventListener('click', () => {
    const menu = document.getElementById('menu-popup');
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
});

// Menu item click handlers
document.getElementById('profile-link').addEventListener('click', () => {
    showPage('profile-section');
    document.getElementById('menu-popup').style.display = 'none';
});

document.getElementById('balance-link').addEventListener('click', () => {
    showPage('balance-section');
    document.getElementById('menu-popup').style.display = 'none';
});

document.getElementById('withdraw-link').addEventListener('click', () => {
    showPage('withdraw-section');
    document.getElementById('menu-popup').style.display = 'none';
});

// Sign Out logic
document.getElementById('signout-link').addEventListener('click', () => {
    document.getElementById('dashboard-page').style.display = 'none';
    document.getElementById('auth-page').style.display = 'flex';
});

// Handle Registration form submission
document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('reg-name').value;
    const phone = document.getElementById('reg-phone').value;
    const password = document.getElementById('reg-password').value;
    
    // Call backend to register user
    const response = await callBackend('register', { name, phone, password });
    
    if (response.status === 'success') {
        alert(`Registration successful! Your User ID is ${response.userId}. You received ৳50 bonus!`);
        document.getElementById('dashboard-page').style.display = 'block';
        document.getElementById('auth-page').style.display = 'none';
        document.getElementById('user-name').textContent = name;
        document.getElementById('user-id').textContent = `ID: ${response.userId}`;
        document.getElementById('user-balance').textContent = `৳${response.balance}`;
    } else {
        alert(response.message || 'Registration failed. Please try again.');
    }
});

// Handle Login form submission
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const phone = document.getElementById('login-phone').value;
    const password = document.getElementById('login-password').value;

    // Call backend to log in user
    const response = await callBackend('login', { phone, password });

    if (response.status === 'success') {
        alert('Login successful!');
        document.getElementById('dashboard-page').style.display = 'block';
        document.getElementById('auth-page').style.display = 'none';
        document.getElementById('user-name').textContent = response.name;
        document.getElementById('user-id').textContent = `ID: ${response.userId}`;
        document.getElementById('user-balance').textContent = `৳${response.balance}`;
    } else {
        alert(response.message || 'Login failed. Invalid credentials.');
    }
});