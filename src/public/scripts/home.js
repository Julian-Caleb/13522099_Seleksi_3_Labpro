document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    const logoutBtn = document.getElementById('logoutBtn');
    let username = 'Guest';
    let balance = null;

    try {
        const response = await fetch('/self-user', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (response.status === 200 && data.status !== 'error') {
            username = data.data.username;
            balance = `Your balance is ${data.data.balance}.`;
            logoutBtn.textContent = "Logout";
            logoutBtn.classList.remove('bg-blue-500', 'hover:bg-blue-700');
            logoutBtn.classList.add('bg-red-500', 'hover:bg-red-700');
        } else {
            logoutBtn.textContent = "Login";
            logoutBtn.classList.remove('bg-red-500', 'hover:bg-red-700');
            logoutBtn.classList.add('bg-blue-500', 'hover:bg-blue-700');
            logoutBtn.setAttribute('href', '/login-page');
        }

    } catch (error) {
        console.error('Error fetching self API:', error);
        logoutBtn.textContent = "Login";
        logoutBtn.classList.remove('bg-red-500', 'hover:bg-red-700');
        logoutBtn.classList.add('bg-blue-500', 'hover:bg-blue-700');
        logoutBtn.setAttribute('href', '/login-page');
    } finally {
        document.getElementById('username-display').textContent = username;
        document.getElementById('balance-display').textContent = balance;
    }

});

logoutBtn.addEventListener('click', () => {
    if (logoutBtn.textContent === "Logout") {
        localStorage.removeItem('token');
        console.log(localStorage.getItem('token'));
        window.location.href = '/home-page';
    } else {
        window.location.href = '/login-page';
    }
});
