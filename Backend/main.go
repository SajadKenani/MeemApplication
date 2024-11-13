package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"get-golang/db"       // Adjust to your module path
	"get-golang/handlers" // Import the handlers package correctly

	"github.com/dgrijalva/jwt-go" // Import the JWT package
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv" // Import the godotenv package
)
type httpResponse struct {
	Data  any   `json:"data"`
	Error error `json:"error,omitempty"`
}

type Value struct {
	Currency int `json:"currency"`
}
// Load JWT secret key from environment variables
var jwtSecretKey = []byte(os.Getenv("JWT_SECRET_KEY")) // Define a strong secret key for JWT

// GenerateJWT generates a JWT token for authentication with an expiration time
func GenerateJWT(username string) (string, error) {
	token := jwt.New(jwt.SigningMethodHS256)

	// Set token claims
	claims := token.Claims.(jwt.MapClaims)
	claims["authorized"] = true
	claims["user"] = username
	claims["exp"] = time.Now().Add(time.Hour * 999999).Unix() // Token expires in 72 hours

	// Sign the token with the secret key
	tokenString, err := token.SignedString(jwtSecretKey)
	if err != nil {
		return "", err
	}

	return tokenString, nil
}

// AuthenticateMiddleware ensures that the request has a valid JWT token
func AuthenticateMiddleware() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		tokenString := ctx.GetHeader("Authorization")
		if tokenString == "" || !strings.HasPrefix(tokenString, "Bearer ") {
			ctx.JSON(http.StatusUnauthorized, 
				gin.H{"error": "Authorization header format must be Bearer {token}"})
			ctx.Abort()
			return
		}

		tokenString = strings.TrimPrefix(tokenString, "Bearer ")

		// Parse and validate token
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method")
			}
			return jwtSecretKey, nil
		})

		if err != nil {
			ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			ctx.Abort()
			return
		}

		if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
			ctx.Set("user", claims["user"])
			ctx.Next()
		} else {
			ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			ctx.Abort()
		}
	}
}

func LoginHandler(ctx *gin.Context) {
    var loginData struct {
        Username string `json:"username"`
        Password string `json:"password"`
    }

    // Bind the incoming JSON body to the `loginData` struct
    if err := ctx.BindJSON(&loginData); err != nil {
        ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON provided"})
        return
    }

    username := loginData.Username
    password := loginData.Password

    log.Printf("Received username: %s, password: %s", username, password) // This should print the values correctly

    // Dummy username and password, replace with database check in real apps
    if username == "" && password == "" {
        token, err := GenerateJWT(username)
        if err != nil {
            ctx.JSON(http.StatusInternalServerError, 
				gin.H{"error": "Failed to generate token"})
            return
        }
        ctx.JSON(http.StatusOK, gin.H{"token": token})
    } else {
        ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
    }
}

func main() {
	// Load .env file
	err := godotenv.Load()
	if err != nil {
		log.Fatalf("Error loading .env file")
	}

	// Initialize the product and department database connections
	db.InitDB()
	r := gin.Default()

	// Enable CORS with specific configurations
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"}, // it should accept everything
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
		AllowHeaders:     []string{"Authorization", "Content-Type"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	// Serve static files from the "uploads" directory
	r.Static("/uploads", "./uploads")

	// Public route for login
	r.POST("/login", LoginHandler)
	r.GET("/orders", handlers.ListOrdersHandler)
	r.POST("/orders", handlers.AddOrderHandler)
	r.GET("/order/:id", handlers.ListSpecificOrderHandler)

	r.GET("/exchangerate", func(ctx *gin.Context) {
		var value Value

		err = db.DB.Get(&value, `SELECT currency FROM currency`)
		log.Print(value)

		if err != nil {
			ctx.JSON(http.StatusInternalServerError, httpResponse{Error: err})
			return
		}

		ctx.JSON(http.StatusOK, httpResponse{Data: value})
		
	})

	// Routes for Products (protected by JWT authentication)
	auth := r.Group("/").Use(AuthenticateMiddleware())
	{
		auth.GET("/products", handlers.ListProductsHandler) // Using handlers package
		auth.GET("/products/:id", handlers.ListSpecifiedProduct)
		auth.GET("/products/dept/:dept", handlers.ListProductDependingOnDepartment)
		auth.POST("/products", handlers.AddProducts)
		auth.PUT("/products", handlers.EditProduct)
		auth.DELETE("/products/:id", handlers.DeleteProduct)
		auth.POST("/signin", handlers.SignInProcess)

		auth.GET("/departments", handlers.ListDepartmentsHandler)
		auth.POST("/departments", handlers.AddDepartmentHandler)
		auth.DELETE("/departments/:id", handlers.DeleteDepartmentHandler)

		auth.GET("/accounts", handlers.ListAccountsHandler)
		auth.POST("/accounts", handlers.AddAccountHandler)
		auth.PUT("/accounts/add", handlers.AddFavoriteHandler)
		auth.PUT("/accounts/remove", handlers.RemoveFavoriteHandler)
		auth.GET("/accounts/:id", handlers.ListSpecifiedFavorite)
		auth.GET("account/:id", handlers.GetSpecifiedAccount)
	}

	fmt.Println("Server running at http://localhost:8080")
	if err := http.ListenAndServe(":8080", r); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
