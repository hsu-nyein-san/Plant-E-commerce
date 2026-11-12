# Leafly – Plant E-commerce

**Leafly** is a plant e-commerce web application that helps users explore indoor plants, discover suitable plants, and manage their online shopping experience.

I built this project to improve my full-stack development skills, especially working with REST APIs, backend development, database management, and frontend–backend integration.

## Features

### Customer Features
- Browse and explore indoor plants.
- Search and filter plants by different categories and preferences.
- View plant details and care information.
- User registration and login.
- Manage shopping cart and wishlist.
- Manage delivery addresses.
- Checkout and place orders.
- View order information and order status.
- 2C2P Sandbox payment integration.


## Technologies Used

- **Frontend:** React, JavaScript, Tailwind CSS
- **Backend:** Python, FastAPI
- **Database:** MySQL
- **ORM:** SQLAlchemy
- **Authentication:** JWT
- **Payment:** 2C2P Sandbox
- **Tools:** Git, GitHub, Postman

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/hsu-nyein-san/Plant-E-commerce.git

cd Plant-E-commerce
```

### 2. Frontend Setup

```bash
npm install
npm run dev
```

### 3. Backend Setup

Navigate to the backend folder:

```bash
cd backend
```

Create and activate a virtual environment:

```bash
python -m venv venv
source venv/bin/activate
```

Install the required dependencies:

```bash
pip install -r requirements.txt
```

Configure the database and environment variables using `.env.example`.

Start the backend:

```bash
python -m app.leafly_api
```

### 4. Database Setup

- Create a MySQL database named `leafly_db`.
- Configure your database credentials.
- Start the backend to initialize the database tables.

## Payment Integration

Leafly includes a 2C2P Sandbox payment integration for testing online payment functionality.

**Note:** Sandbox mode is intended for development and testing, not real transactions.

## What I Learned

Through this project, I gained practical experience in:

- Building REST APIs with FastAPI.
- Connecting a React frontend to a Python backend.
- Designing and managing relational databases with MySQL.
- Implementing JWT-based authentication.
- Handling shopping cart, wishlist, and order management.
- Integrating a third-party payment gateway in sandbox mode.

## Developer

**Hsu Nyein San**

GitHub: [@hsu-nyein-san](https://github.com/hsu-nyein-san)

Project Repository: [Plant-E-commerce](https://github.com/hsu-nyein-san/Plant-E-commerce)