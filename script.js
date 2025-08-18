// আপনার Google Apps Script ওয়েব অ্যাপের URL এখানে বসানো হয়েছে
const API_URL = 'https://script.google.com/macros/s/AKfycby1Hi5YDqhE_4j4OaeVOBlZgWdvAsSyCL6xcFVPDBVtsGKlZU-ZtvBKMSLd5roPtw8r7A/exec';

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

// Function to open a popup
function openPopup(popupId) {
    document.getElementById(popupId).style.display = 'flex';
}

// Function to close a popup
function closePopup(popupId) {
    document.getElementById(popupId).style.display = 'none';
}

// Function to update user data on UI and save to localStorage
function updateUI(userData) {
    document.getElementById('user-name').textContent = userData.name;
    document.getElementById('user-id').textContent = `ID: ${userData.userId}`;
    document.getElementById('user-balance').textContent = `৳${userData.balance}`;
    localStorage.setItem('currentUser', JSON.stringify(userData));
    
    // Update profile page info
    document.getElementById('profile-name').textContent = userData.name;
    document.getElementById('profile-id').textContent = userData.userId;
    document.getElementById('profile-wallet').textContent = userData.wallet || 'Not set';
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
document.getElementById('home-link').addEventListener('click', () => {
    showPage('raffle-categories');
    document.getElementById('menu-popup').style.display = 'none';
});

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
    localStorage.removeItem('currentUser'); // Clear user data
});

// Handle Registration form submission
document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('reg-name').value;
    const phone = document.getElementById('reg-phone').value;
    const password = document.getElementById('reg-password').value;
    
    const response = await callBackend('register', { name, phone, password });
    
    if (response.status === 'success') {
        alert(`Registration successful! Your User ID is ${response.userId}. You received ৳50 bonus!`);
        document.getElementById('dashboard-page').style.display = 'block';
        document.getElementById('auth-page').style.display = 'none';
        updateUI({
            userId: response.userId,
            name: name,
            balance: response.balance
        });
    } else {
        alert(response.message || 'Registration failed. Please try again.');
    }
});

// Handle Login form submission
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const phone = document.getElementById('login-phone').value;
    const password = document.getElementById('login-password').value;

    const response = await callBackend('login', { phone, password });

    if (response.status === 'success') {
        alert('Login successful!');
        document.getElementById('dashboard-page').style.display = 'block';
        document.getElementById('auth-page').style.display = 'none';
        updateUI(response); // Use the response to update UI and save to localStorage
    } else {
        alert(response.message || 'Login failed. Invalid credentials.');
    }
});

// Profile edit logic
let currentEditTarget = '';
document.querySelectorAll('.edit-icon').forEach(icon => {
    icon.addEventListener('click', (e) => {
        const target = e.target.dataset.target;
        const editField = document.getElementById('edit-field');
        const popup = document.getElementById('edit-profile-popup');
        
        if (target === 'name') {
            editField.placeholder = "Enter new name";
        } else if (target === 'wallet') {
            editField.placeholder = "Enter new wallet number";
        }
        currentEditTarget = target;
        openPopup('edit-profile-popup');
    });
});

document.getElementById('edit-profile-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const newValue = document.getElementById('edit-field').value;
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!currentUser) {
        alert('User data not found. Please log in again.');
        return;
    }
    
    const data = {
        userId: currentUser.userId,
        target: currentEditTarget,
        newValue: newValue
    };
    
    const response = await callBackend('updateProfile', data);
    
    if (response.status === 'success') {
        alert('Profile updated successfully!');
        if (currentEditTarget === 'name') {
            currentUser.name = newValue;
        } else if (currentEditTarget === 'wallet') {
            currentUser.wallet = newValue;
        }
        updateUI(currentUser);
        closePopup('edit-profile-popup');
    } else {
        alert(response.message || 'Failed to update profile.');
    }
});


// Recharge button and popup logic
document.getElementById('recharge-btn').addEventListener('click', () => {
    openPopup('recharge-popup');
});

document.getElementById('recharge-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const amount = document.getElementById('recharge-amount').value;
    const phone = document.getElementById('recharge-phone').value;
    const transactionId = document.getElementById('recharge-transaction-id').value;

    const response = await callBackend('rechargeRequest', { userId: currentUser.userId, amount, phone, transactionId });
    if (response.status === 'success') {
        alert('Recharge request submitted successfully. Please wait for approval.');
        closePopup('recharge-popup');
    } else {
        alert('Failed to submit recharge request. Please try again.');
    }
});

// Withdraw button and popup logic
document.getElementById('withdraw-btn').addEventListener('click', () => {
    const withdrawAmount = document.getElementById('withdraw-amount').value;
    const currentBalance = parseFloat(document.getElementById('user-balance').textContent.replace('৳', ''));

    if (withdrawAmount < 500) {
        alert('Minimum withdrawal amount is ৳500.');
        return;
    }
    if (withdrawAmount > currentBalance) {
        alert('Insufficient balance.');
        return;
    }

    const vat = withdrawAmount * 0.10;
    const finalAmount = withdrawAmount - vat;
    
    document.getElementById('confirm-message').textContent = `You will withdraw ৳${withdrawAmount}. A 10% VAT (৳${vat.toFixed(2)}) will be deducted. You will receive ৳${finalAmount.toFixed(2)}.`;
    openPopup('withdraw-confirm-popup');
});

document.getElementById('confirm-withdraw-btn').addEventListener('click', async () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const withdrawAmount = document.getElementById('withdraw-amount').value;

    const response = await callBackend('withdrawRequest', { userId: currentUser.userId, amount: withdrawAmount });
    if (response.status === 'success') {
        alert('Withdrawal request submitted successfully. Please wait for approval.');
        closePopup('withdraw-confirm-popup');
    } else {
        alert('Failed to submit withdrawal request. Please try again.');
    }
});

// Popup close button handlers
document.querySelectorAll('.close-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const popupId = e.target.dataset.popup;
        closePopup(popupId);
    });
});

// Initial page load check for saved user session
document.addEventListener('DOMContentLoaded', () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        document.getElementById('dashboard-page').style.display = 'block';
        document.getElementById('auth-page').style.display = 'none';
        updateUI(currentUser);
    } else {
        document.getElementById('dashboard-page').style.display = 'none';
        document.getElementById('auth-page').style.display = 'flex';
    }
});
