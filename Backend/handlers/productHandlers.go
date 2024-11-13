package handlers

import (
	"errors"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
	"get-golang/db" // Ensure this path matches your project structure
)

type Product struct {
	ID          int     `json:"id,omitempty" bson:"id,omitempty"`
	Name        string  `json:"name" bson:"name"`
	Price       string `json:"price" bson:"price"`
	Description string  `json:"description" bson:"description"`
	Department  string  `json:"department" bson:"department"`
	Image       string  `json:"image" bson:"image"`
}

type httpResponse struct {
	Data  any   `json:"data"`
	Error error `json:"error,omitempty"`
}
// Add a new product
func AddProducts(ctx *gin.Context) {
	err := os.MkdirAll("./uploads", os.ModePerm)
	if err != nil {
		log.Println("Failed to create uploads directory", err)
		ctx.JSON(http.StatusInternalServerError, httpResponse{Error: err})
		return
	} 

	product := Product{
		Name:        ctx.PostForm("name"),
		Price:       ctx.PostForm("price"),
		Description: ctx.PostForm("description"),
		Department:  ctx.PostForm("department"),
	}

	file, err := ctx.FormFile("image")
	if err != nil {
		log.Println("Failed to upload image", err)
		ctx.JSON(http.StatusBadRequest, httpResponse{Error: err})
		return
	}

	if !strings.HasPrefix(file.Header.Get("Content-Type"), "image/") {
		ctx.JSON(http.StatusBadRequest, httpResponse{Error: errors.New("only image files are allowed")})
		return
	}

	imagePath := "./uploads/" + file.Filename
	if err := ctx.SaveUploadedFile(file, imagePath); err != nil {
		log.Println("Failed to save image", err)
		ctx.JSON(http.StatusInternalServerError, httpResponse{Error: err})
		return
	}

	product.Image = imagePath

	_, err = db.DB.Exec(`INSERT INTO products 
	(name, price, department, description, image) VALUES (?, ?, ?, ?, ?)`,
		product.Name, product.Price, product.Department, product.Description, product.Image)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, httpResponse{Error: err})
		return
	}

	ctx.JSON(http.StatusCreated, httpResponse{
		Data: gin.H{"product": product, "image_url": "/uploads/" + file.Filename},
	})
}

// Get list of all products
func ListProductsHandler(ctx *gin.Context) {
	var products []Product
	err := db.DB.Select(&products, 
		"SELECT id, name, price, department, description, image FROM products")
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, httpResponse{Error: err})
		return
	}
	ctx.JSON(http.StatusOK, httpResponse{Data: products})
}

// Get a specific product by ID
func ListSpecifiedProduct(ctx *gin.Context) {
	var product Product
	id := ctx.Param("id")

	err := db.DB.Get(&product, 
		"SELECT id, name, price, department, description, image FROM products WHERE id = ?", id)
	if err != nil {
		if err.Error() == "sql: no rows in result set" {
			ctx.JSON(http.StatusNotFound, httpResponse{Error: errors.New("product not found")})
		} else {
			ctx.JSON(http.StatusInternalServerError, httpResponse{Error: err})
		}
		return
	}

	ctx.JSON(http.StatusOK, httpResponse{Data: product})
}

// List product depending on the chosen department
func ListProductDependingOnDepartment(ctx *gin.Context) {
	var product []Product
	department := ctx.Param("dept")

	err := db.DB.Select(&product,
	"SELECT id, name, price, department, description, image FROM products WHERE department = ?", department)

	if err != nil {
		if err.Error() == "sql: no rows in result set" {
			ctx.JSON(http.StatusNotFound, httpResponse{Error: errors.New("department not found")})
		}else {
			ctx.JSON(http.StatusInternalServerError, httpResponse{Error: err })
		}
	}

	ctx.JSON(http.StatusOK, httpResponse{Data: product})
}

// Edit an existing product
func EditProduct(ctx *gin.Context) {
	var product Product
	if err := ctx.BindJSON(&product); err != nil {
		log.Printf("data binding error: %v", err)
		ctx.JSON(http.StatusBadRequest, httpResponse{Error: err})
		return
	}

	_, err := db.DB.Exec(`UPDATE products 
		SET name = ?, price = ?, department = ?, description = ?, image = ?
		WHERE id = ?`,
		product.Name, product.Price, product.Department, product.Description, product.Image, product.ID)

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, httpResponse{Error: err})
		return
	}

	ctx.JSON(http.StatusOK, httpResponse{Data: gin.H{"message": "Product updated successfully"}})
}

// Delete a product by ID
func DeleteProduct(ctx *gin.Context) {
	id := ctx.Param("id")

	_, err := db.DB.Exec(`DELETE FROM products WHERE id = ?`, id)
	if err != nil {
		log.Printf("Operation failed: %v", err)
		ctx.JSON(http.StatusInternalServerError, httpResponse{Error: err})
		return
	}

	ctx.JSON(http.StatusOK, httpResponse{Data: gin.H{"message": "Product deleted successfully!"}})
}
