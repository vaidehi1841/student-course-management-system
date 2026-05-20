# Student Course Management System

A full-stack web application designed to simplify student course management and academic workflow within an educational institution. The system allows students, faculty, and administrators to efficiently manage courses, enrollments, assignments, and user-specific operations through a secure and user-friendly interface.

## Features

- User Authentication & Authorization
  - Secure login/signup functionality
  - Role-based access control for Admin, Faculty, and Students

- Student Dashboard
  - View enrolled courses
  - Track assignments and deadlines
  - Access course materials

- Faculty Dashboard
  - Create and manage courses
  - Upload assignments and resources
  - Monitor student enrollments

- Admin Panel
  - Manage students and faculty records
  - Add/remove courses
  - Control platform access and permissions

- Course Management
  - Add, update, and delete courses
  - Course enrollment system
  - Dynamic course allocation

- Responsive UI
  - Clean and modern frontend
  - Mobile-friendly design

## Tech Stack

### Frontend
- React.js
- HTML5
- CSS3
- JavaScript

### Backend
- Node.js
- Express.js

### Database
- MongoDB

### Authentication
- JWT (JSON Web Token)
- bcrypt.js

## Project Architecture

The application follows a client-server architecture:

``` id="d3dqyv"
Frontend (React)
       ↓
REST APIs (Express.js)
       ↓
MongoDB Database
```

## Installation & Setup

### Clone the repository

```bash id="5i7t0u"
git clone <repository-url>
```

### Navigate to project folder

```bash id="6rj0g2"
cd student-course-management-system
```

### Install dependencies

#### Backend

```bash id="ldhfxz"
cd backend
npm install
```

#### Frontend

```bash id="jlwmz6"
cd frontend
npm install
```

### Configure Environment Variables

Create a `.env` file in backend folder and add:

```env id="m34rdp"
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

### Run the project

#### Backend

```bash id="h3z7hm"
npm start
```

#### Frontend

```bash id="j6j5s5"
npm run dev
```

## Future Enhancements

- Attendance management
- Online examination module
- Email notifications
- Real-time chat system
- Performance analytics dashboard

## Learning Outcomes

Through this project, I gained hands-on experience in:

- Full-stack web development
- REST API integration
- Authentication & authorization
- Database schema design
- State management
- Role-based access implementation
- Deployment and version control

## Author

Vaidehi Singh  
B.Tech CSE Student
