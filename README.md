# 🏰 PNB Developers | Real Estate Excellence
> **A Premium Real Estate Management Ecosystem**

![Status](https://img.shields.io/badge/Status-Live-success?style=for-the-badge)
![Tech](https://img.shields.io/badge/Stack-MERN-blue?style=for-the-badge)
![UI](https://img.shields.io/badge/UI-Modern_Dark-purple?style=for-the-badge)

PNB Developers is a sophisticated, full-stack real estate management application designed for high-end land development agencies. It features a stunning public discovery portal and a powerful Agent Dashboard for managing complex plot layouts with ease.

---

## ✨ Core Features

### 💎 Premium Discovery Portal
- **High-End Hero Section**: Modern, interactive dual-image composition with smooth animations.
- **Dynamic Layout Explorer**: Browse verified land investments across Bangalore, Hyderabad, and more.
- **Real-Time Booking**: Customers can schedule site visits directly with instant email confirmations.

### 🛠️ Advanced Agent Dashboard
- **Plot Management**: Visual grid-based plot management system for precise layout control.
- **Automated Statistics**: Real-time tracking of available vs. booked inventory.
- **Workflow Automation**: Manage visitor requests, approve/reject bookings, and send automated notifications.
- **Secure Authentication**: JWT-based secure login with protected routes.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS, Framer Motion, Lucide Icons |
| **Backend** | Node.js, Express.js, JWT, Bcrypt |
| **Database** | MongoDB Atlas (Cloud Database), Mongoose ODM |
| **Email** | Nodemailer (Gmail SMTP Integration) |

---

## 🚀 Getting Started

### 📦 Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/nadimicherlareddykumar/PNB_Developers.git
   cd PNB_Developers
   ```

2. **Install Client Dependencies:**
   ```bash
   cd client && npm install
   ```

3. **Install Server Dependencies:**
   ```bash
   cd ../server && npm install
   ```

### ⚙️ Configuration

Create a `.env` file in the `server` directory and add the following:
```env
PORT=3001
JWT_SECRET=your_jwt_secret
MONGODB_URI=your_mongodb_atlas_uri
SMTP_USER=your_gmail@gmail.com
SMTP_PASS=your_gmail_app_password
```

### 🏃 Running Locally

**Start the Backend:**
```bash
cd server
npm start
```

**Start the Frontend:**
```bash
cd client
npm run dev
```

Visit `http://localhost:5173` (or the port shown in your terminal) to experience the platform!

---

## 🧪 Database Seeding

To populate your MongoDB Atlas cluster with the premium demo layouts (Sai Sumana, Silver Oaks, etc.), run:
```bash
cd server
node db/seedMongo.js
```

---

## 🛡️ License
Built with passion for **PNB Developers**. 🚀
