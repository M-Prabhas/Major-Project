document.getElementById("loginForm").addEventListener("submit", function(event) {
        event.preventDefault(); // Prevent the default form submission
    
        // Get the values from the input fields
        var username = document.getElementById("username").value;
        var password = document.getElementById("password").value;
    
        // Send the data to the backend
        fetch('/login', {
            method: 'POST',
            body: JSON.stringify({ username: username, password: password })
        })
        .then(response => {
            if (response.ok) {
                // Handle successful login
                console.log('Login successful');
                // Redirect to another page or perform other actions
            } else {
                // Handle login failure
                console.error('Login failed');
                // Update the warning message
                document.getElementById("warning").innerHTML = "Invalid username or password";
            }
        })
        .catch(error => {
            console.error('Error:', error);
            // Update the warning message
            document.getElementById("warning").innerHTML = "An error occurred. Please try again later.";
        });
    });
    
