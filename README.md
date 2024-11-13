# Mobile Store Application

## Overview
The Mobile Store Application enables users to browse products, add items to favorites, and place orders, which are then managed via an admin dashboard. This application is divided into three main parts:
- **Mobile App (React Native)**: User-facing app for browsing and ordering.
- **Admin Dashboard (React)**: Web dashboard for managing orders.
- **Backend Server (Golang)**: Handles API requests and interacts with a MySQL database.

## Features
- **User Registration & Authentication**: Users can create accounts, log in, and log out.
- **Product Browsing**: Users can view a list of available products with detailed information.
- **Favorites**: Users can add products to their favorites for quick access.
- **Order Placement**: Users can place orders, which are then sent to the admin dashboard for tracking.
- **Admin Dashboard**: Admins can view and manage orders placed by users.

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
  - `favorites`: Array of Product IDs

- **Orders**
  - `id`: Integer, Primary Key
  - `product_id`: Integer, Foreign Key to Products table
  - `account_id`: Integer, Foreign Key to Accounts table
  - **Product Details** (Stored as separate columns, not JSON):
    - `product_name`: String
    - `product_price`: Float
    - `product_description`: String
    - `product_image`: String
  - **Account Details**:
    - `account_name`: String
    - `account_phone`: String

## Technologies Used
- **Frontend**
  - Mobile App: React Native
  - Admin Dashboard: React
- **Backend**
  - Server: Golang
  - Database: MySQL

## Prerequisites
- Node.js and npm
- Golang
- MySQL

## Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd <repository-name>
