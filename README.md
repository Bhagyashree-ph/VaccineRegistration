# VaccineRegistration

This is a simple web-based vaccine appointment system that allows users to register, schedule vaccine appointments, and manage vaccination status. The system is designed with Express.js for the backend, HTML/CSS for the frontend, and MongoDB for data storage.

## Features

- **User Registration:** Users can register by providing their name, phone number, age, pincode, Aadhar number, and a password. The password is hashed and stored securely in the database using bcrypt.

- **User Login:** Registered users can log in using their phone number and password. Passwords are securely compared with the hashed version in the database.

- **Admin Login:** Admin can log in using a predefined username and password to access admin functionalities.

- **Admin Functionalities:** Admin can perform the following actions:
  - Get the total number of registered users.
  - Filter users by age range.
  - Filter users by pincode.
  - Filter users by vaccination status.

- **Vaccine Appointment Scheduling:** Registered users can schedule vaccine appointments, specifying the dose (first or second), date, and time.

- **Update Vaccine Appointments:** Users can update their scheduled vaccine appointments by changing the dose, date, or time.

- **Mark Vaccinated:** Users can mark themselves as vaccinated for a specific dose and date.

## Prerequisites

Before using this system, you need to have the following software and services installed:

- Node.js and npm (Node Package Manager)
- MongoDB (You should configure the MongoDB connection URI in `server.js`)

## Installation

1. Clone this repository to your local machine:

   ```bash
   git clone https://github.com/yourusername/vaccine-appointment-system.git
   ```

2. Change to the project directory:

   ```bash
   cd vaccine-appointment-system
   ```

3. Install the project dependencies:

   ```bash
   npm install
   ```

4. Start the server:

   ```bash
   node server.js
   ```

5. Open your web browser and navigate to `http://localhost:3000` to access the system.

## Usage

- Register as a user with your personal information.
- Log in as a user with your phone number and password.
- Schedule vaccine appointments, update appointments, and mark yourself as vaccinated.
- Log in as an admin with predefined admin credentials.
- Access admin functionalities to retrieve user statistics and filter users by age, pincode, and vaccination status.


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- This project is a simple example of a vaccine appointment system.
- Feel free to extend and modify it for your specific needs.

Enjoy using the Vaccine Appointment System!
```

You can modify the sections and content to fit your project's specifics. Remember to update the GitHub repository's README with this content to provide clear and useful information to potential users and contributors.
