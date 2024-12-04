document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Prevent form submission

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                // Handle successful login (e.g., redirect to dashboard)
                window.location.href = `/api/dashboard/${data.role.toLowerCase()}`;
            } else {
                const errorData = await response.json();
                // Display error message if login fails
                showMessage(errorData.error || 'Login failed. Please try again.', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            // Display error message in case of an exception
            showMessage('An error occurred during login. Please try again.', 'error');
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
