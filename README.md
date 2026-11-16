# 🍕 Forno & Fiamma - Food Ordering Website

A modern, full-stack food ordering platform built for **Forno & Fiamma**, offering customers a convenient way to explore the menu and order their favorite food online. From delicious pizzas and traditional Karhai to rolls, Pepsi, chips, and more, the platform provides a smooth and user-friendly ordering experience with WhatsApp integration.

## 🚀 Tech Stack

- **Frontend:** Next.js
- **Styling:** Custom CSS
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Backend:** Next.js Server-side APIs
- **Order Integration:** WhatsApp

## ✨ Key Features

### 🛒 Customer Website
- Modern, responsive food ordering interface
- Browse food categories and menu items
- Explore pizzas, Karhai, rolls, chips, Pepsi, and more
- View product details and pricing
- Easy ordering experience
- WhatsApp order integration
- Mobile-friendly design

### ⚙️ Admin Dashboard
- Centralized admin dashboard
- Manage food products and categories
- View and manage customer orders
- Track order activity and status
- Manage website content and menu items
- Monitor overall ordering activity

### 📦 Order Management
- Store orders in PostgreSQL
- Manage customer and order information
- Track order status and history
- WhatsApp-based order communication

## 🗄️ Database & Architecture

The application uses **PostgreSQL** for reliable data storage and **Prisma ORM** for database management and type-safe queries.

## 🛠️ Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd forno-fiamma
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
```

### 4. Generate Prisma Client

```bash
npx prisma generate
```

### 5. Run Database Migrations

```bash
npx prisma migrate dev
```

### 6. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Highlights

- Full-stack Next.js architecture
- Custom CSS-based UI
- PostgreSQL database integration
- Prisma-powered database operations
- WhatsApp ordering workflow
- Dedicated admin dashboard
- Responsive customer-facing website

## 📌 Project

**Forno & Fiamma** is built to simplify online food ordering while giving restaurant administrators an efficient way to manage products, customers, and orders from a centralized dashboard.
