package handlers

import (
	"errors"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"get-golang/db"
)

type Departments struct {
	ID   int    `json:"id,omitempty" bson:"id,omitempty"`
	Name string `json:"name" bson:"name"`
}

// List all departments
func ListDepartmentsHandler(ctx *gin.Context) {
	var depts []Departments
	err := db.DB.Select(&depts, "SELECT id, name FROM departments")
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, httpResponse{Error: err})
		return
	}
	ctx.JSON(http.StatusOK, httpResponse{Data: depts})
}

// Add a new department
func AddDepartmentHandler(ctx *gin.Context) {
	departmentName := ctx.PostForm("name")
	if departmentName == "" {
		ctx.JSON(http.StatusBadRequest, httpResponse{Error: errors.New("department name is required")})
		return
	}

	_, err := db.DB.Exec(`INSERT INTO departments (name) VALUES (?)`, departmentName)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, httpResponse{Error: err})
		return
	}

	ctx.JSON(http.StatusCreated, httpResponse{Data: gin.H{"name": departmentName}})
}

// Delete a department by ID
func DeleteDepartmentHandler(ctx *gin.Context) {
	id := ctx.Param("id")

	result, err := db.DB.Exec(`DELETE FROM departments WHERE id = ?`, id)
	if err != nil {
		log.Printf("Failed to delete department: %v", err)
		ctx.JSON(http.StatusInternalServerError, httpResponse{Error: err})
		return
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		log.Printf("Failed to check affected rows: %v", err)
		ctx.JSON(http.StatusInternalServerError, httpResponse{Error: err})
		return
	}

	if rowsAffected == 0 {
		ctx.JSON(http.StatusNotFound, httpResponse{Error: errors.New("department not found")})
		return
	}

	ctx.JSON(http.StatusOK, httpResponse{Data: gin.H{"message": "Department deleted successfully"}})
}
