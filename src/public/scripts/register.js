document.getElementById('register-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const firstName = document.getElementById('first-name').value;
    const lastName = document.getElementById('last-name').value;
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
  
    try {
      const response = await fetch('/register-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password, firstName, lastName }),
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
  