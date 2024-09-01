type="text/javascript">
        // Function to check if user is already logged in
        function checkIfLoggedIn() {
            var zeton = window.localStorage.getItem('access_token');
            if (zeton) {  // If a token is present, redirect to Mixer.html
                window.location.href = "Mixer.html";
            }
        }
    
        // Function to handle user login
        function prijava() {
            var params = "upime=" + document.getElementById("upime").value + "&geslo=" + document.getElementById("geslo").value;
    
            var xhr = new XMLHttpRequest();
            xhr.open("POST", "login.php", true);
            xhr.setRequestHeader("Accept", "application/json");
            xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        var response = JSON.parse(xhr.responseText);
                        window.localStorage.setItem("access_token", response["token"]); // Store the token in localStorage
                        window.localStorage.setItem("user", response["user"]);
    
                        // Redirect to Mixer.html after successful login
                        window.location.href = "Mixer.html";
                    } else {
                        alert("Prijava ni uspela!"); // Login failed
                    }
                }
            };
    
            xhr.send(params);
        }
    
        // Function to toggle between login and signup forms
        function toggleSignup() {
            document.getElementById("prijava").style.display = "none";
            document.getElementById("signupForm").style.display = "block";
            document.getElementById("signupButton").style.display = "none"; // Hide the signup button
            document.getElementById("backToLoginButton").style.display = "block"; // Show the back button
        }
    
        // Function to handle user signup
        function signup(event) {
            event.preventDefault(); // Prevent form submission
    
            var user = document.getElementById("newUsername").value;
            var password = document.getElementById("newPassword").value;
    
            if (user && password) {
                var data = {
                    user: user,
                    password: password,
                };
    
                var xhr = new XMLHttpRequest();
                xhr.open("POST", "user.php", true);
                xhr.setRequestHeader("Accept", "application/json");
                xhr.setRequestHeader('Content-type', 'application/json');
    
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4) {
                        var response = JSON.parse(xhr.responseText);
                        if (xhr.status === 201) {
                            alert("User created successfully. Please log in.");
                            toggleLogin(); // Switch back to login form after successful signup
                        } else if (xhr.status === 409) {
                            // Specific error handling for user already exists
                            alert(response.error_message); // Display descriptive error message
                        } else {
                            alert(response.error_message || "Error creating user. Please try again.");
                        }
                    }
                };
    
                xhr.send(JSON.stringify(data));
            }
        }
    
        // Function to switch back to the login form
        function toggleLogin() {
            document.getElementById("signupForm").style.display = "none";
            document.getElementById("prijava").style.display = "block";
            document.getElementById("signupButton").style.display = "block"; // Show the signup button
            document.getElementById("backToLoginButton").style.display = "none"; // Hide the back button
        }
    
        // Check if user is already logged in on page load
        document.addEventListener("DOMContentLoaded", function () {
            checkIfLoggedIn();
        });