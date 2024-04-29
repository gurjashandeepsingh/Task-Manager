# TASK-MANAGER

This is the backend for an Task-Manager platform built with Node.js and MongoDB.

## Introduction

This project provides the backend functionality for an Task-Manager platform. It includes features such as user authentication and Task Management.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js installed on your local machine. You can download it from [nodejs.org](https://nodejs.org/).
- MongoDB installed and running on your local machine. You can download it from [mongodb.com](https://www.mongodb.com/).

## Installation

To install the project, follow these steps:

1. Clone the repository:
   `git@github.com:gurjashandeepsingh/Task-Manager.git`

2. Navigate to the project directory if not already:

   `cd Backend`

3. Install dependencies:

   `npm install`

## Configuration

For the simiplicity of project i have decided to not include the valiables in .env file.

## MongoDB connection URI

MONGODB_URI = "mongodb://127.0.0.1:27017/TaskManager-Database"

## JWT secret key for authentication

JWT_GENERATION_KEY = "TaskManagerJwtSecretKey"
Replace your_secret_key with a random string used to sign JWT tokens.

## Usage

Run seed file using the following command:

`npm run seed`

To start the server, run the following command:

`npm run start`

The server will start running on port 3000 by default.

# Usage

Steps for Login functionality:

1. Register User using registration API

2. Login that User usgin login API

3. Save the token returned and use it under `token` Request Header in all protected API routes.

`To access most of the routes, you need to pass the JWT Tokens for authorization as most of the routes are protected`

Time taken to complete : 4 Hours
