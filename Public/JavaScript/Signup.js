document.getElementById("signupForm").addEventListener("submit", function(event) {
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
    }else if(password != confirm ){
        counterpoint.innerHTML="both are not matching."
    }else{ 
   // Send the data to the backend
        // Register Request
        fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username:username,
                email: emailID,
                password:password
            }),
        })
            .then(response => response.json())
            .then(data => console.log(data))
            .catch(error => console.error('Error:', error));

        
}
});

