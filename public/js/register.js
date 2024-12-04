document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Prevent form submission

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const role = document.getElementById('role').value;

        try {
            const response = await fetch('/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password, role }),
            });

            if (response.ok) {
                // Show success message
                showMessage('Registered successfully!', 'success');

                // Wait for 2 seconds before redirecting to login
                setTimeout(() => {
                    window.location.href = '/auth/login?email=' + encodeURIComponent(email) + '&password=' + encodeURIComponent(password); // Redirect to login page with email and password
                }, 2000);
            } else {
                const errorData = await response.json();
                
                // Check for specific error messages
                if (errorData.error === 'Email already registered') {
                    showMessage('Already registered! Please log in.', 'error');

                    // Redirect to login page after 2 seconds with email and password
                    setTimeout(() => {
                        window.location.href = '/auth/login?email=' + encodeURIComponent(email) + '&password=' + encodeURIComponent(password);
                    }, 2000);
                } else {
                    showMessage(errorData.error || 'Registration failed. Please try again.', 'error');
                }
            }
        } catch (error) {
            console.error('Error:', error);
            showMessage('An error occurred during registration. Please try again.', 'error');
        }
    });

    // Function to display messages
    function showMessage(message, type) {
        const messageBox = document.createElement('div');
        messageBox.className = `message-box ${type}`; // Add 'success' or 'error' class
        messageBox.textContent = message;
        document.body.appendChild(messageBox);

        // Automatically remove the message after 2 seconds
        setTimeout(() => {
            messageBox.remove();
        }, 2000);
    }
});
