# 🛠️ Product Management API (Backend)

## 📌 About
This is the backend REST API for the **Product Management System**, built with **Node.js, Express, TypeScript, Prisma, Zod**, and **JWT authentication**.

## 🚀 Setup & Running

### 1️⃣ Navigate to the `server/` directory
```sh
cd server
```

### 2️⃣ Install dependencies
```sh
npm install
```

### 3️⃣ Set up environment variables
Create a `.env` file in the `server/` directory based on `.env.example`:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/mydatabase
JWT_SECRET=your_secret_key
```

### 4️⃣ Run database migrations
```sh
npx prisma migrate dev
```

### 5️⃣ Start the API
```sh
npm run dev
```
The API will be available at:  
👉 **http://localhost:5000**

---

## 📖 API Documentation
Swagger documentation is available at:  
👉 **[http://localhost:3000/api-docs](http://localhost:5000/api-docs)**  

---

## 📂 Project Structure
```
📦 server
├── 📁 src
│   ├── 📁 config       # Configuration files (Swagger)
│   ├── 📁 controllers  # API controllers
│   ├── 📁 middlewares  # Authentication & validation middlewares
│   ├── 📁 routes       # Express routes
│   ├── 📁 services     # Business logic
│   ├── server.ts       # Express server entry point
├── 📄 .env.example     # Example environment variables
├── 📄 README.md        # API documentation
├── 📄 package.json     # Dependencies and scripts
└── 📄 tsconfig.json    # TypeScript configuration
```

---

## 🔑 Authentication
This API uses **JWT (Bearer Token)** authentication.

**Register & Login:**
- `POST /auth/register`
- `POST /auth/login`

**Include token in requests:**
```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

---

## 📜 Routes Overview

### 🔹 Authentication (`/auth`)
| Method | Endpoint       | Description                |
|--------|--------------|----------------------------|
| `POST` | `/auth/register` | Register a new user |
| `POST` | `/auth/login` | Authenticate and get JWT token |

### 🔹 Products (`/products`)
| Method | Endpoint       | Description                |
|--------|--------------|----------------------------|
| `POST` | `/products` | Create a new product (🔒 requires auth) |
| `GET`  | `/products` | Get all products |
| `GET`  | `/products/{id}` | Get product by ID |
| `PUT`  | `/products/{id}` | Update product (🔒 requires auth) |
| `DELETE` | `/products/{id}` | Delete product (🔒 requires auth) |

---

## 🛠 Technologies Used
- **Node.js** (Express)
- **TypeScript**
- **Prisma** (ORM)
- **Zod** (Request validation)
- **JWT Authentication**
- **Swagger UI** (API documentation)

---

## 📜 License
This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

