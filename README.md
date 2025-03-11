# 🌍 Product Management Monorepo

## 📌 About
This is a **monorepo** containing both the **backend (server)** and **frontend (client)** for a Product Management System.

## 📂 Repository Structure
```
📦 product-management
├── 📁 server   # Backend (Node.js + Express + Prisma)
├── 📁 client   # Frontend (React + TypeScript) **coming soon**
└── 📄 README.md (You are here!)
```

## 🚀 Getting Started

### 1️⃣ Clone the repository
```sh
git clone https://github.com/YOUR_GITHUB_USERNAME/product-management.git
cd product-management
```

### 2️⃣ Install dependencies
If using **npm workspaces** or **pnpm/yarn workspaces**, install all dependencies from the root:
```sh
npm install
```

### 3️⃣ Running the Backend
Go to the **server/** folder and follow the [backend setup instructions](server/README.md).
```sh
cd server
npm run dev
```

### 4️⃣ Running the Frontend
**comming soon**

---

## 📜 Subprojects
Each part of this monorepo has its own documentation:

- 🔹 **[Backend (server)](server/README.md)** → REST API with **Express, TypeScript, Prisma, JWT, and Swagger**  
- 🔹 **Frontend (client)** → Web application built with **React, TypeScript, and Tailwind**  

---

## 🛠 Technologies Used

### 🔹 Backend (server)
- **Node.js** (Express)
- **TypeScript**
- **Prisma** (ORM)
- **Zod** (Request validation)
- **JWT Authentication**
- **Swagger UI** (API documentation)

### 🔹 Frontend (client)
- **React.js**
- **TypeScript**
- **Tailwind**
- **TanStack Query (React Query)**
- **React Router**

---

## 🔑 Authentication
This project uses **JWT authentication**. For API details, check [server/README.md](server/README.md).

---


## 📜 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
