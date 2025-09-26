# Source Code Structure

This directory contains the organized source code for the 3D Model Serving Platform.

## 📁 Directory Structure

```
src/
├── config/           # Configuration files
│   ├── database.js   # MongoDB connection
│   └── upload.js     # File upload configuration
├── controllers/      # Route controllers
│   ├── adminController.js    # Admin operations
│   ├── teacherController.js  # Teacher operations
│   ├── studentController.js  # Student operations
│   └── publicController.js   # Public operations
├── middleware/       # Custom middleware
│   ├── auth.js       # Authentication middleware
│   └── errorHandler.js # Global error handling
├── models/          # Database models
│   └── Model.js     # 3D Model schema
├── routes/          # Route definitions
│   ├── adminRoutes.js    # Admin routes
│   ├── teacherRoutes.js  # Teacher routes
│   ├── studentRoutes.js  # Student routes
│   ├── publicRoutes.js   # Public routes
│   └── index.js     # Route aggregator
└── utils/           # Utility functions
    ├── response.js  # Standardized responses
    └── validation.js # Data validation
```

## 🔧 Architecture Overview

### MVC Pattern
- **Models**: Database schemas and data access
- **Views**: HTML templates and static files
- **Controllers**: Business logic and request handling

### Route Organization
- **Teacher Routes** (`/api/*`): JWT-protected teacher operations
- **Admin Routes** (`/admin/*`): API key-protected admin operations
- **Student Routes** (`/view/*`): Token-protected student access
- **Public Routes** (`/`, `/status`): Public endpoints

### Middleware Stack
1. **Authentication**: JWT validation for teachers, API key for admins
2. **File Upload**: Multer configuration for GLB files
3. **Error Handling**: Global error management
4. **Validation**: Data validation utilities

## 🚀 Usage

### Adding New Routes
1. Create controller function in appropriate controller file
2. Add route definition in corresponding route file
3. Import and mount in `routes/index.js`

### Adding New Models
1. Create schema in `models/` directory
2. Export model for use in controllers
3. Add validation if needed

### Adding New Middleware
1. Create middleware function in `middleware/` directory
2. Import and use in route files or main server

## 📝 Best Practices

- Keep controllers focused on single responsibility
- Use middleware for cross-cutting concerns
- Validate data before processing
- Use standardized response formats
- Handle errors gracefully
- Document complex business logic
