# PNB Developers | Real Estate Management Portal

A premium full-stack real estate management application designed for agents and development managers. Features an interactive interactive map for plot management, layout creation, and a public-facing land discovery portal.

## 🌟 Key Features

- **Interactive Plot Map**: Drag-and-drop support for layout creation and custom plot grid positioning.
- **Agent Dashboard**: Manage multiple layouts, track sales status (Available/Booked), and review visitor requests.
- **Modern UI**: Built with React, Framer Motion for animations, and Lucide icons.
- **Backend Infrastructure**: Node.js + Express with an SQLite database for persistence.
- **Responsive Design**: Mobile-friendly sidebar and dashboard interface.

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express, Better-SQLite3
- **Dev Tools**: ESLint, PostCSS, Axios

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/nadimicherlareddykumar/PNB_Developers.git
   cd PNB_Developers
   ```

2. Install dependencies for the Client:
   ```bash
   cd client
   npm install
   ```

3. Install dependencies for the Server:
   ```bash
   cd ../server
   npm install
   ```

### Running Locally

To run the full-stack application simultaneously:

1. **Start the Server** (Runs on port 3001):
   ```bash
   cd server
   npm start
   ```

2. **Start the Client** (Runs on port 5173):
   ```bash
   cd client
   npm run dev
   ```

Visit `http://localhost:5173` to view the public application and `http://localhost:5173/agent/login` for the Agent Portal.

### Database Seeding
To populate the database with initial demo data:
```bash
cd server
npm run seed
```

