document.getElementById('login-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const usernameOrEmail = document.getElementById('usernameOrEmail').value;
    const password = document.getElementById('password').value;

    try {
      const response = await fetch('/login-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ usernameOrEmail, password }),
      });
      const data = await response.json();
  
      if (data.status === 'success') {
        const token = data.data.token;
        localStorage.setItem('token', token);
        window.location.href = '/home-page';
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      alert('An error occurred. Please try again.');
    }
  });
  