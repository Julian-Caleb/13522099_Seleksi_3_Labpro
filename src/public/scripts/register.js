document.getElementById('register-form').addEventListener('submit', async (event) => {
    console.log("among us");
    event.preventDefault();
    const firstName = document.getElementById('first-name').value;
    const lastName = document.getElementById('last-name').value;
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
  
    try {
      const response = await fetch('/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password, firstName, lastName }),
      });
      const data = await response.json();
  
      if (data.status === 'success') {
        // alert('Registration successful!');
        window.location.href = '/index.html';
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      alert('An error occurred. Please try again.');
    }
  });
  