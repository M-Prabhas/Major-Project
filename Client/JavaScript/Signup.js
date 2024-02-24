document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent the default form submission

    // Get the values from the input fields
    var username = document.getElementById("username").value;
    var emailID = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    var confirm=document.getElementById("confirm").value;
    var counterpoint=document.getElementById("warning");

    // Array of elements to check for in the password
var elementsToCheck = ["@", "#", "$","_","?","%"];
// Variable to track if the password contains any special element
var containsElement = false;

// Iterate over each element in the array and check if it's present in the password
elementsToCheck.forEach(function(element) {
    if (password.includes(element) && confirm.includes(element)) {
        containsElement = true;
    }
});
    if(password.length<8 || password.length>21){
          counterpoint.innerHTML="password length must be between 8 and 21 only";
    }else if(!containsElement){
          counterpoint.innerHTML="password should contain atleast one special character like ?_@#$%";
    }else{ 
   // Send the data to the backend
    fetch('/signup', {
        method: 'POST',
        body: JSON.stringify({ username: username, password: password ,emailID: emailID })
    })
    .then(response => {
        if (response.ok) {
            // Handle successful login
            console.log('signup successful');
        } else {
            // Handle login failure
            console.error('Signup Failed');
            // Update the warning message
            document.getElementById("warning").innerHTML = "userName already Exists";
        }
    })
    .catch(error => {
        console.error('Error:', error);
        // Update the warning message
        document.getElementById("warning").innerHTML = "An error occurred. Please try again later.";
    });
}
});

