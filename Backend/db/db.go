package db

import (
	"log"

	_ "github.com/go-sql-driver/mysql" // MySQL driver
	"github.com/jmoiron/sqlx"
)

var DB *sqlx.DB

// InitDB initializes the database connection and creates tables if necessary
func InitDB() {
	var err error
	// Updated DSN with the correct MySQL connection details
	dsn := ""
	// Open a connection to the MySQL database
	DB, err = sqlx.Open("mysql", dsn)
	if err != nil {
		log.Fatalf("Error opening MySQL database: %v", err)
		return
	}
	// Verify the connection by pinging the database
	err = DB.Ping()
	if err != nil {
		log.Fatalf("Error pinging MySQL database: %v", err)
		return
	}
	log.Println("Successfully connected to the MySQL database")

	// Create the products table if it doesn't exist
	createTables()
}

// createTables creates the necessary tables if they don't exist
func createTables() {
	schema := `
	CREATE TABLE IF NOT EXISTS products (
		id INT AUTO_INCREMENT PRIMARY KEY,
		name VARCHAR(255) NOT NULL,
		price DECIMAL(10, 2) NOT NULL,
		description TEXT,
		department TEXT,
		image VARCHAR(255)
	);
	`
	// Execute the schema
	_, err := DB.Exec(schema)
	if err != nil {
		log.Fatalf("Error creating tables: %v", err)
		return
	}

	log.Println("Tables created or verified successfully")
}
