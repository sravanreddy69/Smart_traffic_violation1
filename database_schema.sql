-- Database schema for Smart Traffic Violation System

CREATE DATABASE IF NOT EXISTS traffic_violation_db;
USE traffic_violation_db;

-- Users table (Admins, Traffic Officers, Citizens, Review Officers)
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone_number VARCHAR(50) NOT NULL,
    role VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Violation Types reference table
CREATE TABLE IF NOT EXISTS violation_types (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    violation_name VARCHAR(255) NOT NULL,
    base_fine_amount DOUBLE NOT NULL,
    description TEXT
);

-- Vehicles registered to citizens
CREATE TABLE IF NOT EXISTS vehicles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    license_plate VARCHAR(50) NOT NULL UNIQUE,
    owner_id BIGINT NOT NULL,
    vehicle_make VARCHAR(100),
    vehicle_model VARCHAR(100),
    color VARCHAR(50),
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Violation Tickets (the actual fines)
CREATE TABLE IF NOT EXISTS violation_tickets (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    vehicle_id BIGINT NOT NULL,
    violation_type_id BIGINT NOT NULL,
    issued_by_id BIGINT NOT NULL,
    violation_date DATETIME NOT NULL,
    violation_location VARCHAR(255) NOT NULL,
    fine_amount DOUBLE NOT NULL,
    due_date DATE NOT NULL,
    ticket_status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id),
    FOREIGN KEY (violation_type_id) REFERENCES violation_types(id),
    FOREIGN KEY (issued_by_id) REFERENCES users(id)
);

-- Disputes raised by citizens
CREATE TABLE IF NOT EXISTS disputes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    ticket_id BIGINT NOT NULL UNIQUE,
    citizen_id BIGINT NOT NULL,
    dispute_reason TEXT NOT NULL,
    dispute_status VARCHAR(50) NOT NULL,
    review_remarks TEXT,
    reviewed_by_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (ticket_id) REFERENCES violation_tickets(id) ON DELETE CASCADE,
    FOREIGN KEY (citizen_id) REFERENCES users(id),
    FOREIGN KEY (reviewed_by_id) REFERENCES users(id)
);

-- Payment Transactions
CREATE TABLE IF NOT EXISTS payment_transactions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    ticket_id BIGINT NOT NULL,
    transaction_reference VARCHAR(255) UNIQUE,
    amount_paid DOUBLE NOT NULL,
    payment_date DATETIME NOT NULL,
    payment_method VARCHAR(50),
    payment_status VARCHAR(50) NOT NULL,
    FOREIGN KEY (ticket_id) REFERENCES violation_tickets(id) ON DELETE CASCADE
);

-- Initial Mock Data (Optional, for easy testing)
INSERT INTO users (name, email, phone_number, role) VALUES 
('System Admin', 'admin@traffic.com', '1234567890', 'ADMIN'),
('Officer John', 'john@traffic.com', '0987654321', 'TRAFFIC_OFFICER'),
('Citizen Alice', 'alice@gmail.com', '1112223333', 'CITIZEN'),
('Reviewer Bob', 'bob@traffic.com', '4445556666', 'REVIEW_OFFICER');

INSERT INTO violation_types (violation_name, base_fine_amount, description) VALUES 
('Speeding', 150.00, 'Exceeding the speed limit by over 10mph'),
('Red Light', 200.00, 'Running a red light at an intersection'),
('Illegal Parking', 75.00, 'Parking in a no-parking zone or fire lane');
