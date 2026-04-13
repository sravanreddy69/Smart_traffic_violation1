# Smart Traffic Violation System 🚦

Hey there! This is my project, the **Smart Traffic Violation System**. I built this to understand how a real-world ticketing and fine payment system works. It handles everything from creating a ticket to paying for it, and even disputing it if someone thinks they were wrongly charged!

## What does it do?
- **Admin Dashboard**: For managing officers and monitoring the overall system.
- **Traffic Officer Dashboard**: Officers can log in, create tickets, and see their issued tasks.
- **Citizen Portal**: Regular users can check their fines, pay them, or raise a dispute.
- **Review Officer Panel**: For checking the disputes raised by citizens and either approving or rejecting them.

## Tech Stack Used 💻
- **Frontend**: React.js (Using vanilla CSS/Tailwind for styling)
- **Backend**: Spring Boot (Java)
- **Database**: MySQL 

## How to run this locally?

### 1. Database Setup
Make sure you have MySQL installed. Create a database named `traffic_violation_db` (or whatever is in the `application.properties`).

### 2. Backend (Spring Boot)
- Open the `backend` folder in your favorite IDE like IntelliJ or Eclipse.
- Update the `application.properties` with your MySQL username and password.
- Run the `TrafficSystemApplication.java` file. It will start up on `localhost:8080`.

### 3. Frontend (React)
- Open a terminal and CD into the `frontend` directory.
- Run `npm install` to grab all the node modules.
- Run `npm run dev` or `npm start` to fire up the frontend server.

## Features I implemented:
- Authentication & Authorization based on roles.
- APIs for creating, updating, and fetching tickets.
- Dispute workflow to match real-world scenarios.
- Payment status updates.

Feel free to check out the code! I learned a huge amount about full-stack development while working on this. Let me know if you spot any bugs! 🐛
