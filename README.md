# Air Holland ✈️

_A full-stack Airbnb-style clone built with Express, Sequelize, React, and Redux._

## 🧱 Tech Stack

- **Frontend**: React, Redux, React Router
- **Backend**: Node.js, Express
- **Database**: PostgreSQL (via Sequelize ORM)
- **Authentication**: Cookie-based sessions, CSRF protection
- **Deployment**: Render

---

## 🌍 Features

- User Signup / Login / Session Restore
- CRUD for:
  - Spots (Listings)
  - Reviews & Review Images
  - Bookings
  - Spot Images
- Authorization (owners can edit/delete their content)
- Pagination & Filter queries (price, coordinates)
- Dynamic average rating and preview images

---

## 🔌 API Overview

- Auth:  
  `GET /api/session`, `POST /api/session`, `POST /api/users`, `DELETE /api/session`

- Spots:  
  `GET /api/spots`, `GET /api/spots/current`, `GET /api/spots/:spotId`  
  `POST /api/spots`, `PUT /api/spots/:spotId`, `DELETE /api/spots/:spotId`  
  `POST /api/spots/:spotId/images`

- Reviews:  
  `GET /api/spots/:spotId/reviews`, `GET /api/reviews/current`  
  `POST /api/spots/:spotId/reviews`, `PUT /api/reviews/:reviewId`, `DELETE /api/reviews/:reviewId`  
  `POST /api/reviews/:reviewId/images`

- Bookings:  
  `GET /api/bookings/current`, `GET /api/spots/:spotId/bookings`  
  `POST /api/spots/:spotId/bookings`, `PUT /api/bookings/:bookingId`, `DELETE /api/bookings/:bookingId`

- Images:  
  `DELETE /api/spot-images/:imageId`, `DELETE /api/review-images/:imageId`

> 📄 Full docs: [`README-API-docs.md`](./README-API-docs.md)

---

## 🛠️ Getting Started (Local Dev)

```bash
# Clone the project
git clone https://github.com/your-username/air-holland.git
cd air-holland

# Backend
cd backend
npm install
npx sequelize db:create
npx sequelize db:migrate
npx sequelize db:seed:all
npm start

# Frontend
cd ../frontend
npm install
npm start
```

## Live Site: [Air-Holland](https://mod4-portfolio-project-6pyb.onrender.com/)
