# 🎮 Game Bar - Backend API

**Game Bar** is a backend RESTful API built with **Express.js** and **MySQL** to manage game listings, user authentication, game reviews, replies, and likes/dislikes. It also supports image uploads via **Cloudinary** and uses **JWT** for authentication.

---

## 🚀 Features

- JWT Authentication (Register, Login, Refresh Token, Logout)
- User roles (`user`, `admin`)
- Upload games (admin only) with profile image and multiple gallery images
- Many-to-many genres per game
- One review per user per game (with optional comment)
- Replies to other users' reviews
- Like/dislike system for reviews and replies (one vote per user)
- Game detail endpoint with all related data
- Cloudinary image upload support

---

## 🛠️ Project Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/AdityaDwiputraSubroto/game_bar.git
   cd game_bar
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env` file in the project root:

   ```env
   PORT=8080

   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=game_bar

   JWT_SECRET=your_access_secret
   REFRESH_SECRET=your_refresh_secret

   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

4. **Set up the database:**

   - Make sure MySQL is running
   - Run the SQL script to create the necessary schema and tables:
     ```bash
     mysql -u root -p game_bar < game_bar_db.sql
     ```
     > The file `game_bar_db.sql` contains **only the table structures**, no seed/sample data.

5. **Start the server:**
   ```bash
   npm start
   ```

---

## 📁 Folder Structure

```
game_bar/
├── config/                # Database & Cloudinary config
│   ├── db.js
│   └── cloudinary.js
│
├── controllers/           # Route logic
├── models/                # Database queries
├── middlewares/           # Auth and role-checking
├── routes/                # API endpoints
│
├── game_bar_db.sql        # SQL file to create DB structure
├── .env                   # Environment variables
├── app.js                 # Main application entry
└── README.md
```

---

## ✅ Usage Tips

- Use **Postman** to test the API.
- For authenticated routes, add the `Authorization` header:
  ```
  Bearer <accessToken>
  ```
- Only users with role `admin` can upload new games.

---
