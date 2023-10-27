let loggedInUser = null;

function showRegistrationForm() {
    document.getElementById("registration-form").style.display = "block";
    document.getElementById("login-form").style.display = "none";
    document.getElementById("vaccine-schedule").style.display = "none";
    document.getElementById("admin-login-form").style.display = "none";
}

function showLoginForm() {
    document.getElementById("registration-form").style.display = "none";
    document.getElementById("admin-login-form").style.display = "block";
    document.getElementById("login-form").style.display = "block";

    // Adjust the width and layout to display forms side by side
    document.getElementById("admin-login-form").style.width = "50%";
    document.getElementById("login-form").style.width = "50%";
    document.getElementById("admin-login-form").style.float = "left";
    document.getElementById("login-form").style.float = "left";

    document.getElementById("vaccine-schedule").style.display = "none";
}


function registerUser() {
    console.log('Register button clicked');
    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const age = document.getElementById("age").value;
    const pincode = document.getElementById("pincode").value;
    const aadhar = document.getElementById("aadhar").value;
    const password = document.getElementById("password").value;

    const userData = {
        name,
        phone,
        age,
        pincode,
        aadhar,
        password,
    };

    fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        // Handle the server response here
        alert(data.message);
        // Call the function to show the login form
        showLoginForm();
    })
    .catch(error => {
        console.error('Fetch error:', error);
        // Handle the error or log it as needed
    });
    

}


function loginUser() {
    const loginPhone = document.getElementById('phone').value;
    const password = document.getElementById('password').value;

    const loginData = {
        phone: loginPhone,
        password: password,
    };

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
    })
    .then(response => response.json())
    .then(data => {
        // Handle the server response here
        if (data.message === 'Login successful') {
            alert('Login successful');
            loggedInUser = loginPhone; // Store user's phone number or use a session token
            showVaccineScheduling();
        } else {
            alert('Login failed. Please check your credentials.');
        }
    })
    .catch(error => {
        console.error(error);
    });
}

function showVaccineScheduling() {
    document.getElementById("vaccine-schedule").style.display = "block";
}


function registerVaccineSlot() {
    if (loggedInUser) {
        const dose = prompt('Enter dose (1 or 2):');
        const date = prompt('Enter appointment date (YYYY-MM-DD):');
        const time = prompt('Enter appointment time (HH:mm AM/PM):');

        if (dose && date && time) {
            const appointmentData = {
                user: loggedInUser,
                dose: parseInt(dose),
                date,
                time,
            };

            fetch('/schedule', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(appointmentData),
            })
                .then(response => response.json())
                .then(data => {
                    // Handle the server response here
                    alert(data.message);
                })
                .catch(error => {
                    console.error(error);
                });
        } else {
            alert('Invalid input. Please provide all the required details.');
        }
    } else {
        alert('Please log in to schedule an appointment.');
    }
}


function updateVaccineSlot() {
    if (loggedInUser) {
        const dose = prompt('Enter dose (1 or 2):');
        const date = prompt('Enter appointment date (YYYY-MM-DD):');
        const time = prompt('Enter appointment time (HH:mm AM/PM):');

        if (dose && date && time) {
            const appointmentData = {
                user: loggedInUser,
                dose: parseInt(dose),
                date,
                time,
            };

            fetch('/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(appointmentData),
            })
                .then(response => response.json())
                .then(data => {
                    // Handle the server response here
                    alert(data.message);
                })
                .catch(error => {
                    console.error(error);
                });
        } else {
            alert('Invalid input. Please provide all the required details.');
        }
    } else {
        alert('Please log in to update an appointment.');
    }
}


function markVaccinated() {
    if (loggedInUser) {
        const dose = prompt('Enter dose (1 or 2):');
        const date = prompt('Enter vaccination date (YYYY-MM-DD):');

        if (dose && date) {
            const vaccinationData = {
                user: loggedInUser,
                dose: parseInt(dose),
                date,
            };

            fetch('/vaccinated', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(vaccinationData),
            })
                .then(response => response.json())
                .then(data => {
                    // Handle the server response here
                    alert(data.message);
                })
                .catch(error => {
                    console.error(error);
                });
        } else {
            alert('Invalid input. Please provide all the required details.');
        }
    } else {
        alert('Please log in to mark as vaccinated.');
    }
}


showRegistrationForm();


let adminLoggedIn = false;

function adminLogin() {
    const username = document.getElementById('admin-username').value;
    const password = document.getElementById('admin-password').value;

    // Verify admin credentials (mocking admin credentials for simplicity)
    if (username === 'admin' && password === 'adminpass') {
        adminLoggedIn = true;
        //showUserInterface(adminLoggedIn);
        document.getElementById('user-interface').style.display = 'block';
        document.getElementById('admin-login-form').style.display = 'none';
        document.getElementById('login-form').style.display = 'none';
    } else {
        alert('Invalid admin credentials.');
    }
}
/*
function showUserInterface(adminLoggedIn) {
    if (adminLoggedIn) {
        document.getElementById('admin-login').style.display = 'none';
        document.getElementById('user-interface').style.display = 'block';
    }
}*/

function getTotalUsers() {
    if (adminLoggedIn) {
        fetch('/getTotalUsers', {
            method: 'GET',
        })
            .then(response => response.json())
            .then(data => {
                // Handle the server response here
                alert(`Total Registered Users: ${data.totalUsers}`);
            })
            .catch(error => {
                console.error(error);
            });
    } else {
        alert('Please log in as admin.');
    }
}

function filterUsersByAge() {
    if (adminLoggedIn) {
        const minAge = prompt('Enter minimum age:');
        const maxAge = prompt('Enter maximum age:');

        if (minAge && maxAge) {
            fetch(`/filterUsersByAge?minAge=${minAge}&maxAge=${maxAge}`, {
                method: 'GET',
            })
                .then(response => response.json())
                .then(data => {
                    // Handle the server response here
                    if (data.filteredUsers.length === 0) {
                        alert('No users found in the specified age range.');
                    } else {
                        const userList = data.filteredUsers.map(user => user.name).join(', ');
                        alert(`Users in the age range ${minAge}-${maxAge}: ${userList}`);
                    }
                })
                .catch(error => {
                    console.error(error);
                });
        } else {
            alert('Invalid input. Please provide both minimum and maximum ages.');
        }
    } else {
        alert('Please log in as admin.');
    }
}

function filterUsersByPincode() {
    if (adminLoggedIn) {
        const pincode = prompt('Enter pincode:');

        if (pincode) {
            fetch(`/filterUsersByPincode?pincode=${pincode}`, {
                method: 'GET',
            })
                .then(response => response.json())
                .then(data => {
                    // Handle the server response here
                    if (data.filteredUsers.length === 0) {
                        alert('No users found in the specified pincode.');
                    } else {
                        const userList = data.filteredUsers.map(user => user.name).join(', ');
                        alert(`Users in pincode ${pincode}: ${userList}`);
                    }
                })
                .catch(error => {
                    console.error(error);
                });
        } else {
            alert('Invalid input. Please provide a pincode.');
        }
    } else {
        alert('Please log in as admin.');
    }
}

function filterUsersByVaccinationStatus() {
    if (adminLoggedIn) {
        const status = prompt('Enter vaccination status ("none", "first dose completed", "all completed"):');

        if (status) {
            fetch(`/filterUsersByVaccinationStatus?status=${status}`, {
                method: 'GET',
            })
                .then(response => response.json())
                .then(data => {
                    // Handle the server response here
                    if (data.filteredUsers.length === 0) {
                        alert(`No users found with vaccination status: ${status}`);
                    } else {
                        const userList = data.filteredUsers.map(user => user.name).join(', ');
                        alert(`Users with vaccination status ${status}: ${userList}`);
                    }
                })
                .catch(error => {
                    console.error(error);
                });
        } else {
            alert('Invalid input. Please provide a valid vaccination status.');
        }
    } else {
        alert('Please log in as admin.');
    }
}

function getRegisteredSlots() {
    if (adminLoggedIn) {
        const date = document.getElementById('slot-date').value;

        if (date) {
            fetch(`/getRegisteredSlots?date=${date}`, {
                method: 'GET',
            })
                .then(response => response.json())
                .then(data => {
                    // Handle the server response here
                    if (data.registeredSlots.length === 0) {
                        alert(`No registered slots found for ${date}.`);
                    } else {
                        const slotList = data.registeredSlots.map(slot => slot.time).join(', ');
                        alert(`Registered slots for ${date}: ${slotList}`);
                    }
                })
                .catch(error => {
                    console.error(error);
                });
        } else {
            alert('Please select a date.');
        }
    } else {
        alert('Please log in as admin.');
    }
}
