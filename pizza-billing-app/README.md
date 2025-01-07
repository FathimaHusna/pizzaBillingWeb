# Pizza Shop Billing Web Application

## Prerequisites
Before setting up the project, ensure you have the following installed:
1. **Node.js**: [Download and Install Node.js](https://nodejs.org/)
2. **Go (Golang)**: [Download and Install Go](https://golang.org/dl/)
3. **PostgreSQL**: [Download and Install PostgreSQL](https://www.postgresql.org/download/)

---

## Setting Up the Project

### Step 1: Clone the Repository
First, clone this repository to your local machine using the following command:
```bash
git clone https://github.com/FathimaHusna/pizzaBillingWeb
cd pizzaBillingWeb

### Step 2 Set Up the Backend (Go)
####1. Install Dependencies: Navigate to the backend folder and install necessary Go dependencies:

go mod tidy
cd pizza-billing-backend

####2.Configure Database:

Make sure your PostgreSQL server is running.
Create a database and configure it in the db.go file in the backend

dsn := "host=localhost user=your_user password=your_db_password dbname=your_db_name port=your_port_number sslmode=disable"

####3. Run Database Migrations:
The database schema will be automatically managed by the ORM.
Note: No manual schema setup is required.

####4. Run the Backend Server: Run the Go backend server:

go run main.go

The backend server will run on
http://localhost:3000

### Step 3: Set Up the Frontend (React)
Install Dependencies: Navigate to the frontend folder and install required node modules:

cd pizza-billing-app
npm install
Configure API Base URL: In the src/services/Api.js file, configure the base URL for the API:

const BASE_URL = "http://localhost:3000/api";  // Go backend URL
Run the Frontend Development Server: Start the React development server:

npm start
The frontend will run on http://localhost:3001.

####Database Note
The database schema is automatically managed by the ORM (Object-Relational Mapping) in the backend application. There is no need for manual schema creation using SQL scripts.

### Running the Application
Once you have both the backend and frontend servers running, you can access the application in your browser at:

Frontend: http://localhost:3001
Backend: http://localhost:3000