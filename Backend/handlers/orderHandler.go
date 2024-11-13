package handlers

import (
	"log"
	"net/http"

	"get-golang/db"

	"github.com/gin-gonic/gin"
)

type Order struct {
	ID          int     `json:"id,omitempty" db:"id"`
	ProductID   string  `json:"productID" db:"productID"`
	Name        string  `json:"name" db:"name"`
	Price       float64 `json:"price" db:"price"`
	Description string  `json:"description" db:"description"`
	Department  string  `json:"department" db:"department"`
	Image       string  `json:"image" db:"image"`
	AccName     string  `json:"accName" db:"accName"`
	AccPhone    string  `json:"accPhone" db:"accPhone"`
	AccID       string  `json:"accID" db:"accID"` // Add db tag here
}


func ListOrdersHandler(ctx *gin.Context) {
	var orders []Order
	query := "SELECT id, productID, name, price, department, description, image, accName, accPhone FROM orders"

	rows, err := db.DB.Query(query)
	if err != nil {
		log.Printf("Error fetching orders: %v", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Error fetching orders"})
		return
	}
	defer rows.Close()

	for rows.Next() {
		var order Order
		if err := rows.Scan(&order.ID, &order.ProductID, &order.Name, &order.Price, &order.Department, &order.Description, &order.Image, &order.AccName, &order.AccPhone); err != nil {
			log.Printf("Error scanning order: %v", err)
			continue // You might want to handle this differently
		}
		orders = append(orders, order)
	}

	ctx.JSON(http.StatusOK, gin.H{"data": orders})
}

func ListSpecificOrderHandler(ctx *gin.Context) {
	id := ctx.Param("id")
	log.Printf("Fetching orders for accID: %s", id)

	var orders []Order
	query := "SELECT id, name, price, department, description, image, accID FROM orders WHERE accID = ?"
	err := db.DB.Select(&orders, query, id)

	if err != nil {
		log.Printf("Error fetching orders for accID %s: %v", id, err)
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to fetch orders",
			"details": err.Error(), // Adding detailed error for debugging
		})
		return
	}

	if len(orders) == 0 {
		ctx.JSON(http.StatusNotFound, gin.H{"message": "No orders found for this ID"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"data": orders})
}



// AddOrderHandler adds a new order to the database
func AddOrderHandler(ctx *gin.Context) {
	var order struct {
		ProductID   string  `json:"productID"`
		Name        string  `json:"name"`
		Price       float64 `json:"price"` // Change to float64
		Description string  `json:"description"`
		Department  string  `json:"department"`
		Image       string  `json:"image"`
		AccName     string  `json:"accName"`
		AccPhone    string  `json:"accPhone"`
		AccID       string  `json:"accID"`
	}

	// Bind JSON data to the temporary struct
	if err := ctx.ShouldBindJSON(&order); err != nil {
		log.Println("Error binding JSON:", err)
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}

	// Create the Order struct for insertion
	newOrder := Order{
		ProductID:   order.ProductID,
		Name:        order.Name,
		Price:       order.Price, // Use the float64 price
		Department:  order.Department,
		Description: order.Description,
		Image:       order.Image,
		AccName:     order.AccName,
		AccPhone:    order.AccPhone,
		AccID:       order.AccID,
	}

	// Insert the order into the database
	result, err := db.DB.Exec(`INSERT INTO orders (productID, name, price, department, description, image, accName, accPhone, accID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
		newOrder.ProductID, newOrder.Name, newOrder.Price, newOrder.Department, newOrder.Description, newOrder.Image, newOrder.AccName, newOrder.AccPhone, newOrder.AccID)

	if err != nil {
		log.Printf("Error inserting order: %v", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to insert order"})
		return
	}

	// Optionally retrieve the inserted order with its ID
	id, err := result.LastInsertId()
	if err != nil {
		log.Println("Error retrieving last insert ID:", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Order created, but failed to retrieve ID"})
		return
	}

	// Retrieve the inserted order details
	err = db.DB.QueryRow("SELECT id, productID, name, price, department, description, image, accName, accPhone, accID FROM orders WHERE id = ?", id).Scan(
		&newOrder.ID, &newOrder.ProductID, &newOrder.Name, &newOrder.Price, &newOrder.Department, &newOrder.Description, &newOrder.Image, &newOrder.AccName, &newOrder.AccPhone, &newOrder.AccID)
	if err != nil {
		log.Println("Error retrieving inserted order:", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Order created, but failed to retrieve it"})
		return
	}

	// Return the newly created order
	ctx.JSON(http.StatusCreated, gin.H{"data": newOrder})
}
