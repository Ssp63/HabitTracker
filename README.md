# 🚀 HabitTracker Backend API

A robust Node.js REST API for the HabitTracker application, providing secure user authentication, habit management, and progress tracking capabilities. Built with Express.js, MongoDB, and deployed on Azure Web App.

## 🌐 Live API

**🔗 [API Base URL](https://habit-tracker-api-fndzdyctcgd5bvg3.eastus2-01.azurewebsites.net)**

**📊 [Health Check](https://habit-tracker-api-fndzdyctcgd5bvg3.eastus2-01.azurewebsites.net/health)**

## 🛠️ Tech Stack

### **Core Technologies**
- **Node.js** - Runtime environment
- **Express.js 5.1.0** - Web application framework
- **MongoDB** - NoSQL database with Mongoose ODM
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing and security

### **Key Dependencies**
- **Mongoose 8.17.1** - MongoDB object modeling
- **jsonwebtoken 9.0.2** - JWT implementation
- **bcryptjs 3.0.2** - Password encryption
- **cors 2.8.5** - Cross-origin resource sharing
- **dotenv 17.2.1** - Environment variable management
- **date-fns 4.1.0** - Date manipulation utilities
- **express-async-handler 1.2.0** - Async error handling

## 📁 Project Structure

```
├── server.js                 # Main application entry point
├── config/
│   └── db.js                 # MongoDB connection configuration
├── controllers/              # Business logic handlers
│   ├── habitController.js    # Habit CRUD operations
│   └── userController.js     # User authentication & management
├── middleware/               # Custom middleware functions
│   └── authMiddleware.js     # JWT authentication middleware
├── models/                   # MongoDB data models
│   ├── habitModel.js         # Habit schema definition
│   └── userModel.js          # User schema definition
├── routes/                   # API route definitions
│   ├── habitRoutes.js        # Habit-related endpoints
│   └── userRoutes.js         # User-related endpoints
├── .github/workflows/        # CI/CD automation
│   ├── azure-deploy.yml      # Azure deployment workflow
│   └── main_habit-tracker-api.yml # GitHub Actions workflow
├── Dockerfile                # Container configuration
├── package.json              # Project dependencies
└── README.md                 # Project documentation
```

## 🔐 API Endpoints

### **Authentication Endpoints**

#### **POST** `/api/users/register`
Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "_id": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "token": "jwt_token_here"
}
```

#### **POST** `/api/users/login`
Authenticate existing user.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "_id": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "token": "jwt_token_here"
}
```

#### **GET** `/api/users/me`
Get current user profile (Protected).

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "_id": "user_id",
  "name": "John Doe",
  "email": "john@example.com"
}
```

### **Habit Management Endpoints**

#### **GET** `/api/habits`
Get all habits for authenticated user.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
[
  {
    "_id": "habit_id",
    "name": "Daily Exercise",
    "description": "30 minutes of cardio",
    "frequency": "daily",
    "createdAt": "2025-01-01T00:00:00.000Z",
    "completions": []
  }
]
```

#### **POST** `/api/habits`
Create a new habit.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "Daily Reading",
  "description": "Read for 30 minutes",
  "frequency": "daily"
}
```

#### **GET** `/api/habits/:id`
Get specific habit by ID.

#### **PUT** `/api/habits/:id`
Update existing habit.

#### **DELETE** `/api/habits/:id`
Delete a habit.

#### **POST** `/api/habits/:id/track`
Track habit completion for a specific date.

**Request Body:**
```json
{
  "date": "2025-01-01",
  "completed": true
}
```

#### **GET** `/api/habits/:id/stats`
Get habit statistics and analytics.

**Response:**
```json
{
  "totalDays": 30,
  "completedDays": 25,
  "completionRate": 83.33,
  "currentStreak": 5,
  "longestStreak": 10
}
```

#### **GET** `/api/habits/chart-data`
Get data formatted for charts and visualizations.

### **Utility Endpoints**

#### **GET** `/health`
Health check endpoint for monitoring.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2025-01-01T12:00:00.000Z"
}
```

## 🚀 Getting Started

### **Prerequisites**
- Node.js 16+
- MongoDB (local or MongoDB Atlas)
- npm or yarn
- Git

### **Installation**

1. **Clone the repository**
```bash
git clone https://github.com/Ssp63/HabitTracker.git
cd HabitTracker/habit-tracker-backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
Create a `.env` file in the root directory:
```env
NODE_ENV=development
PORT=3000
MONGO_URI=mongodb://localhost:27017/habittracker
JWT_SECRET=your_jwt_secret_key_here
FRONTEND_URL=http://localhost:5173
```

4. **Start the server**
```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

5. **Verify installation**
Visit `http://localhost:3000/health` to confirm the server is running.

### **Available Scripts**

```bash
npm start        # Start production server
npm run dev      # Start development server with nodemon
npm run prod     # Start production server with NODE_ENV=production
npm test         # Run tests (placeholder)
```

## 🔧 Configuration

### **Environment Variables**

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `3000` |
| `MONGO_URI` | MongoDB connection string | Required |
| `JWT_SECRET` | JWT signing secret | Required |
| `FRONTEND_URL` | Frontend URL for CORS | Optional |

### **CORS Configuration**
The API allows requests from:
- `http://localhost:5173` (Vite dev server)
- `http://localhost:3000` (Local frontend)
- `https://habit-tracker-tan-zeta.vercel.app` (Production frontend)
- Additional URLs via `FRONTEND_URL` environment variable

### **Database Schema**

#### **User Model**
```javascript
{
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Hashed with bcrypt
  createdAt: { type: Date, default: Date.now }
}
```

#### **Habit Model**
```javascript
{
  user: { type: ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  description: { type: String },
  frequency: { type: String, enum: ['daily', 'weekly', 'monthly'], default: 'daily' },
  completions: [{
    date: { type: Date, required: true },
    completed: { type: Boolean, default: true },
    notes: { type: String }
  }],
  createdAt: { type: Date, default: Date.now }
}
```

## 🛡️ Security Features

### **Authentication & Authorization**
- JWT-based stateless authentication
- Password hashing with bcryptjs (10 salt rounds)
- Protected routes with middleware validation
- Token expiration handling

### **Data Validation**
- Input sanitization and validation
- MongoDB injection prevention
- CORS protection
- Error handling without sensitive data exposure

### **Security Headers**
- CORS properly configured
- JSON payload size limits (10MB)
- Express security best practices

## 🌐 Deployment

### **Azure Web App Deployment**
The API is deployed on Azure with automated CI/CD:

**Live URL:** `https://habit-tracker-api-fndzdyctcgd5bvg3.eastus2-01.azurewebsites.net`

#### **Deployment Process**
1. **GitHub Actions** trigger on push to main branch
2. **Azure Web App** pulls code and builds
3. **Environment variables** configured in Azure
4. **Database** connected to MongoDB Atlas
5. **Health checks** ensure successful deployment

#### **CI/CD Pipeline**
- **GitHub Actions** workflow in `.github/workflows/`
- **Automated testing** and linting
- **Zero-downtime deployment**
- **Rollback capabilities**

### **Docker Support**
The application includes a Dockerfile for containerized deployment:

```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 📊 Monitoring & Logging

### **Health Monitoring**
- `/health` endpoint for load balancer checks
- Database connection monitoring
- Error logging and tracking

### **Performance**
- Async/await patterns for non-blocking operations
- Database indexing for optimized queries
- Connection pooling with Mongoose

## 🧪 Testing

### **API Testing**
Test the API endpoints using tools like:

**PowerShell Example:**
```powershell
# Health check
Invoke-RestMethod -Uri "https://habit-tracker-api-fndzdyctcgd5bvg3.eastus2-01.azurewebsites.net/health"

# User registration
$body = @{
    name = "Test User"
    email = "test@example.com"
    password = "password123"
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://your-api-url/api/users/register" -Method Post -Body $body -ContentType "application/json"
```

**curl Example:**
```bash
# Health check
curl https://habit-tracker-api-fndzdyctcgd5bvg3.eastus2-01.azurewebsites.net/health

# Login
curl -X POST https://your-api-url/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## 🔗 Related Repositories

- **Frontend Application:** [HabitTracker Frontend](https://github.com/Ssp63/HabitTracker-Frontend)
- **Main Repository:** [HabitTracker Full-Stack](https://github.com/Ssp63/HabitTracker)

## 📈 API Response Codes

| Code | Description |
|------|-------------|
| `200` | Success |
| `201` | Created successfully |
| `400` | Bad request / Validation error |
| `401` | Unauthorized / Invalid credentials |
| `403` | Forbidden / Insufficient permissions |
| `404` | Resource not found |
| `500` | Internal server error |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Shreyash Pawar**
- GitHub: [@Ssp63](https://github.com/Ssp63)
- Email: ssp@gmail.com

---

⭐ **Star this repository if you found it helpful!**
