# Mobile Store Application

## Overview
This mobile store application is designed to allow users to browse products, add them to their favorites, and place orders. Orders are processed and sent to a dashboard for easy management. The system consists of a mobile app, dashboard, and server, each with specific features and functions. 

- **Frontend (Mobile)**: React Native for user-facing mobile app.
- **Frontend (Dashboard)**: React for the admin dashboard.
- **Backend**: Golang server integrated with MySQL database.

## Features
- **User Authentication**: Users can sign up and sign in.
- **Product Management**: Products can be viewed, favorited, and ordered.
- **Order Management**: Orders placed by users are displayed in the admin dashboard.
- **Favorites**: Users can add products to their favorites for quick access.

## Database Structure

### Tables
- **Products**
  - `id`: Integer, Primary Key
  - `name`: String
  - `price`: Float
  - `description`: String
  - `image`: String (URL or file path)
  
- **Accounts**
  - `id`: Integer, Primary Key
  - `name`: String
  - `password`: String (hashed)
  - `phone`: String
  - `favorites`: Array of Product IDs (for quick access to favorites)

- **Orders**
  - `id`: Integer, Primary Key
  - `product_id`: Foreign Key to Products
  - `account_id`: Foreign Key to Accounts
  - `product_info`: JSON (includes all relevant product details)
  - `account_info`: JSON (includes account details relevant to the order)

## Technologies Used
- **Frontend**
  - Mobile App: React Native
  - Admin Dashboard: React
- **Backend**
  - Server: Golang
  - Database: MySQL

## Installation & Setup

### Prerequisites
- Node.js and npm
- Golang
- MySQL Server

### Setup Instructions

#### 1. Clone the Repository
```bash
git clone <repository-url>
cd <repository-name>
