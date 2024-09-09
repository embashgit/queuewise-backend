# QueueWise Backend

QueueWise is a web-based queuing system designed to streamline queue management for various services and appointments.

## Table of Contents

- [Setup Instructions](#setup-instructions)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [Seeding the Database](#seeding-the-database)
- [Admin Credentials](#admin-credentials)

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/embashgit/queuewise-backend.git
cd queuewise-backend

npm install

`Create a .env file in the root of the project with the following content (replace values as necessary):`
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=queuewise_db
DB_PORT=5432
PORT=5000
