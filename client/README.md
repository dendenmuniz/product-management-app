# 👑 QueenBee — Product Management Dashboard

A modern frontend dashboard built with **React + TypeScript** for managing product catalogs across sales channels. This application allows authenticated users to import, view, update, and manage product inventory.

---

## 🔐 Features

- 🔑 **Authentication**: Login, forgot/reset password with JWT support
- 📤 **Import Products** via JSON file
- 🧾 **Editable Product Table** with inline editing
- 📦 **Product Details** with images and attributes
- 🌓 **Theme Toggle** (Light/Dark mode using DaisyUI)
- 🧠 Built with **Context API**, **React Router**, and **Tailwind CSS**

---

## 🛠️ Technologies

- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) + [DaisyUI](https://daisyui.com/)
- [React Router](https://reactrouter.com/)
- [TanStack Table](https://tanstack.com/table) (planned)
- [Axios](https://axios-http.com/)
- [Vite](https://vitejs.dev/)

---

## 🚧 Project Structure (Client)

```
client/
├── public/
├── src/
│   ├── components/         # Reusable UI components
│   ├── context/            # Theme, Auth, Product providers
│   ├── hooks/              # Custom React hooks
│   ├── layouts/            # Layouts
│   ├── pages/              # Login, Home, Products
│   ├── services/           # API service
│   ├── utils/              # Utilities like token decoder
│   ├── App.tsx             # Main app with routing
│   └── main.tsx            # Entry point
├── index.html
├── tailwind.config.js
├── postcss.config.js
└── vite.config.ts
```

---

## ✅ Product Interface (Frontend)

```ts
export interface Product {
  id: string;
  name: string;
  description?: string;
  price: string;
  stock: number;
  merchantId?: string;
  variantId?: string;
  supplierModelNumber?: string;
  ean: string[];
  size?: string;
  vendor?: string;
  productType: string[];
  productGroup: string[];
  department: string[];
  imageUrl?: string;
  variantCreated?: string;
  variantUpdated?: string;
  inventoryLevelCreated?: string;
  inventoryLevelUpdated?: string;
  createdAt?: string;
  updatedAt?: string;
}
```

---

## 🚀 Getting Started

```bash
git clone https://github.com/dendenmuniz/product-management-app.git
cd product-management-app/client
npm install
npm run dev
```

Server should be running on `http://localhost:8000` and frontend on `http://localhost:3000`.

---

## 🔒 Security (Development Only)

> ⚠️ **Warning:** This project stores JWT tokens in `Context` (and optionally `localStorage`) for demonstration purposes. For production, always use **HttpOnly cookies** and follow secure authentication practices.

---

## 🧪 Test Coverage (Coming Soon)

Tests will be implemented using **Jest** and **React Testing Library**.

---

## 📄 License

MIT License.

---

## 🙌 Acknowledgements

This project was developed as part of Denise Muniz's personal portfolio.