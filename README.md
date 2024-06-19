# Task-Management-System-API

![Project Logo/Icon](https://cdn.iconscout.com/icon/premium/png-128-thumb/task-management-766093.png?f=webp) <!-- Optional: Add a logo or icon for visual appeal -->

## Overview

The task at hand involves the development of a powerful RESTful API using Node.js with the Express.js framework and MongoDB, tailored for efficient task management. This API facilitates fundamental CRUD operations—Create, Read, Update, Delete—for tasks, bolstered by JWT-based authentication to secure endpoints against unauthorized access. Robust validation ensures data integrity, while comprehensive error handling guarantees smooth operation. Admin-specific routes extend functionality to include user and task management, distinguishing the API with capabilities beyond standard CRUD operations. Clear documentation and rigorous testing further enhance reliability, making this API an ideal choice for implementing scalable and secure task management solutions.

### Postman Documentation
To ensure smooth and efficient interaction with our Task Management API, we have meticulously crafted detailed Postman documentation. This resource offers a user-friendly interface for exploring, testing, and understanding the full range of API capabilities. Featuring comprehensive descriptions, sample requests and responses, authentication instructions, and error handling guidelines, our Postman documentation simplifies the integration process and provides valuable insights into the API’s functionality. You can access the documentation and start experimenting with our API at Task Management API Documentation.

Check out our [API Documentation][postman-doc].

[postman-doc]: https://documenter.getpostman.com/view/33522302/2sA3XTefHQ "Postman Documentation"


## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
  - [Authentication](#authentication)
  - [Tasks](#tasks)
  - [Admin Routes](#admin-routes)
- [Testing](#testing)
- [Error Handling](#error-handling)
- [Logging](#logging)
- [Contributing](#contributing)

## Features

- User registration and authentication with JWT
- Role-based access control (admin vs. regular users)
- CRUD operations for managing tasks
- Secure password hashing using bcrypt
- Error handling and centralized logging

## Prerequisites

- Node.js (v12 or higher)
- MongoDB (local instance or connection URI)

## Getting Started

### Installation

#### Clone the repository from GitHub:

git clone https://github.com/mouni2619/Task-Management-System-API.git
cd task-management-api

#### Install dependencies using npm:
-npm install
#### Configuration
#### Create a .env file in the root directory and add the following configuration variables:
* PORT=5012          
* MONGO_URI=your_mongodb_uri 
* JWT_SECRET=your_secret_key
* NODE_ENV=main
#### Running the Application
##### Start the server:
* npm start
###### The server will start running on the specified port (default is 5012).
### API Endpoints

#### Authentication

##### **POST /api/auth/register**
- **Description:** Registers a new user.
- **Request Body:**
  - `username`: The desired username for the new user.
  - `password`: The desired password for the new user.
  - `isAdmin`: A boolean flag indicating if the user should have admin privileges.

- **Response:** Returns a JWT token for the newly registered user.

##### **POST /api/auth/login**
- **Description:** Logs in an existing user.
- **Request Body:**
  - `username`: The username of the existing user.
  - `password`: The password of the existing user.

- **Response:** Returns a JWT token for the authenticated user.

---

#### Tasks (Protected Routes)

Protected routes require a valid JWT token in the `Authorization` header (Bearer token).

##### **GET /api/tasks**
- **Description:** Retrieves all tasks for the authenticated user.
- **Response:** Returns a list of tasks associated with the authenticated user.

##### **GET /api/tasks/:id**
- **Description:** Retrieves a specific task by its ID.
- **Parameters:** `id` - The ID of the task to retrieve.
- **Response:** Returns the details of the specified task.

#### **POST /api/tasks**
- **Description:** Creates a new task for the authenticated user.
- **Request Body:**
  - `title`: The title of the task.
  - `description`: The description of the task.
  - `completed`: A boolean indicating whether the task is completed.

- **Response:** Returns the newly created task's details.

##### **PUT /api/tasks/:id**
- **Description:** Updates an existing task by its ID.
- **Parameters:** `id` - The ID of the task to update.
- **Request Body:**
  - `title`: The updated title of the task.
  - `description`: The updated description of the task.
  - `completed`: The updated completion status of the task.

- **Response:** Returns the updated task's details.

#### **DELETE /api/tasks/:id**
- **Description:** Deletes a specific task by its ID.
- **Parameters:** `id` - The ID of the task to delete.
- **Response:** Returns a confirmation message that the task was deleted.

---

#### Admin Routes

Admin routes require a valid admin user's JWT token in the `x-auth-token` header.

##### **GET /api/admin/users**
- **Description:** Retrieves all non-admin users.
- **Response:** Returns a list of non-admin users.

##### **DELETE /api/admin/users/:id**
- **Description:** Deletes a user by their ID.
- **Parameters:** `id` - The ID of the user to delete.
- **Response:** Returns a confirmation message that the user was deleted.

##### **POST /api/admin/users**
- **Description:** Creates a new user with optional admin privileges.
- **Request Body:**
  - `username`: The desired username for the new user.
  - `password`: The desired password for the new user.
  - `isAdmin`: A boolean flag indicating if the new user should have admin privileges.

- **Response:** Returns the details of the newly created user.

##### **GET /api/admin/users/:userId/tasks**
- **Description:** Retrieves all tasks for a specific user (admin-only).
- **Parameters:** `userId` - The ID of the user whose tasks are to be retrieved.
- **Response:** Returns a list of tasks associated with the specified user.

##### **GET /api/admin/tasks**
- **Description:** Retrieves all tasks across all users (admin-only).
- **Response:** Returns a list of all tasks in the system.

##### **POST /api/admin/users/:userId/tasks**
- **Description:** Creates a task for a specific user (admin-only).
- **Parameters:** `userId` - The ID of the user for whom the task is to be created.
- **Request Body:**
  - `title`: The title of the task.
  - `description`: The description of the task.
  - `completed`: A boolean indicating whether the task is completed.

- **Response:** Returns the newly created task's details for the specified user.

##### **PUT /api/admin/users/:userId/tasks/:taskId**
- **Description:** Updates a task by ID for a specific user (admin-only).
- **Parameters:** 
  - `userId` - The ID of the user to whom the task belongs.
  - `taskId` - The ID of the task to update.

- **Request Body:**
  - `title`: The updated title of the task.
  - `description`: The updated description of the task.
  - `completed`: The updated completion status of the task.

- **Response:** Returns the updated task's details for the specified user.

##### **DELETE /api/admin/users/:userId/tasks/:taskId**
- **Description:** Deletes a task by ID for a specific user (admin-only).
- **Parameters:** 
  - `userId` - The ID of the user to whom the task belongs.
  - `taskId` - The ID of the task to delete.

- **Response:** Returns a confirmation message that the task was deleted for the specified user.

#### Testing
##### Run tests using:
  - npm test
##### Error Handling
 - Errors are handled gracefully with appropriate status codes and error messages. Detailed logging provides insights into errors for debugging.
##### Logging
Centralized logging is implemented to capture application events, errors, and debugging information.
##### Contributing
Contributions are welcome! To contribute to this project, follow these steps:

###### Fork the repository
- Create your feature branch (git checkout -b feature/your-feature)
- Commit your changes (git commit -am 'Add some feature')
- Push to the branch (git push origin feature/your-feature)
- Create a new Pull Request
- Please ensure your code adheres to the existing code style and includes tests.

