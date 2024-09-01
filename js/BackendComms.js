document.addEventListener("DOMContentLoaded", function() {
    let currentProfile = "Profile1"; // Default profile

    // Define the odjava function for logging out
    function odjava() {
        window.localStorage.removeItem('access_token');
        window.localStorage.removeItem('user');
        window.location.href = "login.html"; // Redirect to login page after logout
    }

    // Function to fetch and set slider values based on user and profile
    function fetchAndSetSliders(user, profile) {
        // Ensure we don't fetch data for the "Log_out" profile
        if (profile === "Log_out") {
            return; // Exit early, don't fetch anything for Log_out
        }

        fetch(`http://localhost/louder/profiles.php?user=${user}&profile=${profile}`)
            .then(response => response.json())
            .then(data => {
                console.log('Fetched data for', profile, ':', data);

                if (data && data.length > 0) {
                    const channels = data[0];
                    document.getElementById('volumeSliderLive').value = channels.CH1;
                    document.getElementById('volumeSlider1').value = channels.CH2;
                    document.getElementById('volumeSlider2').value = channels.CH3;
                    document.getElementById('volumeSlider3').value = channels.CH4;
                    document.getElementById('bassSliderLive').value = channels.Bass1;
                    document.getElementById('midSliderLive').value = channels.Mid1;
                    document.getElementById('trebleSlider1').value = channels.Treble1;
                    document.getElementById('bassSlider1').value = channels.Bass2;
                    document.getElementById('midSlider1').value = channels.Mid2;
                    document.getElementById('trebleSlider1').value = channels.Treble2;
                    document.getElementById('bassSlider2').value = channels.Bass3;
                    document.getElementById('midSlider2').value = channels.Mid3;
                    document.getElementById('trebleSlider2').value = channels.Treble3;
                    document.getElementById('bassSlider3').value = channels.Bass4;
                    document.getElementById('midSlider3').value = channels.Mid4;
                    document.getElementById('trebleSlider3').value = channels.Treble4;
                    
                }
            })
            .catch(error => console.error('Error fetching data:', error));
    }

    // Function to save the profile settings
    function saveProfileSettings(profile) {
        const ch1Value = document.getElementById('volumeSliderLive').value;
        const ch2Value = document.getElementById('volumeSlider1').value;
        const ch3Value = document.getElementById('volumeSlider2').value;
        const ch4Value = document.getElementById('volumeSlider3').value;
        const Bass1Value = document.getElementById('bassSliderLive').value;
        const Mid1Value = document.getElementById('midSliderLive').value;
        const Treble1Value = document.getElementById('trebleSliderLive').value;
        const Bass2Value = document.getElementById('bassSlider1').value;
        const Mid2Value = document.getElementById('midSlider1').value;
        const Treble2Value = document.getElementById('trebleSlider1').value;
        const Bass3Value = document.getElementById('bassSlider2').value;
        const Mid3Value = document.getElementById('midSlider2').value;
        const Treble3Value = document.getElementById('trebleSlider2').value;
        const Bass4Value = document.getElementById('bassSlider3').value;
        const Mid4Value = document.getElementById('midSlider3').value;
        const Treble4Value = document.getElementById('trebleSlider3').value;

        const putData = {
            CH1: ch1Value,
            CH2: ch2Value,
            CH3: ch3Value,
            CH4: ch4Value,
            Bass1: Bass1Value,
            Mid1: Mid1Value,
            Treble1:Treble1Value,
            Bass2: Bass2Value,
            Mid2: Mid2Value,
            Treble2:Treble2Value,
            Bass3: Bass3Value,
            Mid3: Mid3Value,
            Treble3:Treble3Value,
            Bass4: Bass4Value,
            Mid4: Mid4Value,
            Treble4:Treble4Value,
        };

        console.log('Saving data for', profile, ':', putData);

        fetch(`http://localhost/louder/profiles.php?profile=${profile}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(putData)
        })
        .then(response => {
            if (response.ok) {
                console.log('Settings saved successfully for', profile);
            } else {
                console.error('Failed to save settings for', profile);
            }
        })
        .catch(error => console.error('Error saving settings:', error));
    }

    // Event listener for profile selection and logout
    document.querySelectorAll('ul li a[data-profile]').forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent the default anchor behavior
            const selectedProfile = this.getAttribute('data-profile');
            if (selectedProfile === "Log_out") {
                odjava(); // Explicitly call odjava here
            } else {
                currentProfile = selectedProfile;
                fetchAndSetSliders(window.localStorage.getItem('user'), currentProfile);
            }
        });
    });

    // Verify user authentication and fetch profile settings if authenticated
    const zeton = window.localStorage.getItem('access_token');
    const user = window.localStorage.getItem('user');

    if (!zeton || !user) {
        // Redirect to login page if not authenticated
        window.location.href = "login.html";
    } else {
        // Log the user's token
        console.log("User is logged in with token:", zeton);

        // Set up profile fetching and saving
        fetchAndSetSliders(user, currentProfile);

        document.querySelector('.save-settings').addEventListener('click', function() {
            saveProfileSettings(currentProfile);
        });
    }
});
