# **QueueWise Backend**

QueueWise Backend is the server-side component of the QueueWise system, designed to provide robust and efficient APIs for managing queues, users, and other essential operations. Built with modern technologies, it ensures a seamless backend for the QueueWise application.

---

## **Table of Contents**

- [Dependencies](#dependencies)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [Seeding the Database](#seeding-the-database)
- [Admin Credentials](#admin-credentials)
- [Acknowledgments](#acknowledgments)

---

## **Dependencies**

The QueueWise backend leverages the following core technologies:

- **Node.js**: Backend runtime environment.
- **Express.js**: Web framework for building RESTful APIs.
- **Sequelize**: ORM for database operations.
- **PostgreSQL**: Relational database for storing application data.
- **Jest**: Testing framework for automated tests.
- **jsonwebtoken**: For token-based authentication.
- **dotenv**: To manage environment variables.

---

## **Environment Variables**

To configure the application, create a `.env` file in the project root and include the following keys:

```env
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=queuewise_db
DB_PORT=5432
DIALECT=postgres
JWT_SECRET=*yourANYJWTSec*
MAX_FILE_SIZE=10mb
PORT=5000
```


# **Database Setup**
- Install PostgreSQL:

Ensure PostgreSQL is installed on your system. Download PostgreSQL.
Create the Database:

Use the PostgreSQL CLI or a GUI tool like pgAdmin to create a new database named queuewise_db.
Set Up Migrations:

- Run the following command to set up the database schema:
```npx sequelize-cli db:migrate```

# **Seeding the Database**
The application includes a script to seed the database with initial data for testing and development.

Run the following command to seed the database:

```npx sequelize-cli db:seed:all```

# **Running the Application**
Development Mode
Start the application with live-reload for development:

```npm run dev```

# **Admin Credentials**: 
After running the seed script, use the following default admin credentials:
```
Email: admin@queueapp.com
Password: admin@queue123
```
# **Acknowledgments**
Special thanks to:

- [Ibrahim Bashir](https://github.com/embashgit): Lead developer and primary contributor to this project.
- [Holger Klus]: For their invaluable guidance and constructive feedback.