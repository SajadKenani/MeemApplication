package handlers

import (
	"database/sql"
	"encoding/json"
	"get-golang/db" // Ensure this path matches your project structure
	"log"
	"net/http"

	"github.com/gin-gonic/gin"

)

type Accounts struct {
	ID        int      `json:"id,omitempty" bson:"id,omitempty"`
	Name      string   `json:"name" bson:"name"`
	Password  string   `json:"password" bson:"password"`
	Phone     string   `json:"phone" bson:"phone"`
	Image     string   `json:"image" bson:"image"`
	Favorites string    `json:"favorites" bson:"favorites"`
}


// Handler to list all accounts
func ListAccountsHandler(ctx *gin.Context) {
	var accounts []Accounts
	err := db.DB.Select(&accounts, 
		"SELECT id, name, password, phone, image, favorites FROM accounts")
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, httpResponse{Error: err})
		return
	}
	ctx.JSON(http.StatusOK, httpResponse{Data: accounts})
}

func GetSpecifiedAccount(ctx *gin.Context) {
    var account Accounts
    id := ctx.Param("id")
    err := db.DB.Get(&account, `SELECT * FROM accounts WHERE id = ?`, id)
    if err != nil {
        if err.Error() == "sql: no rows in result set" {
            ctx.JSON(http.StatusNotFound, httpResponse{Error: err})
        } else {
            log.Printf("Database error: %v", err)
            ctx.JSON(http.StatusInternalServerError, httpResponse{Error: err})
        }
        return
    }

    ctx.JSON(http.StatusOK, httpResponse{Data: account})
}

func ListSpecifiedFavorite(ctx *gin.Context) {
    var account Accounts
    id := ctx.Param("id")

    // Fetch the favorites from the database for the specified account ID
    err := db.DB.Get(&account, "SELECT favorites FROM accounts WHERE id = ?", id)
    if err != nil {
        if err.Error() == "sql: no rows in result set" {
            ctx.JSON(http.StatusNotFound, httpResponse{Error: err})
        } else {
            log.Printf("Database error: %v", err)
            ctx.JSON(http.StatusInternalServerError, httpResponse{Error: err})
        }
        return
    }

    // Unmarshal the favorites string into a slice
    var favoritesList []int
    if account.Favorites != "" {
        err = json.Unmarshal([]byte(account.Favorites), &favoritesList)
        if err != nil {
            ctx.JSON(http.StatusInternalServerError, httpResponse{Error: err})
            return
        }
    }

    // Return the retrieved favorites
    ctx.JSON(http.StatusOK, httpResponse{Data: favoritesList})
}


// Handler to add a new account
func AddAccountHandler(ctx *gin.Context) {
	// Create new account from JSON data
	var accounts Accounts // Use a variable to bind JSON data

	// Bind incoming JSON to the accounts struct
	if err := ctx.ShouldBindJSON(&accounts); err != nil {
		log.Println("Failed to bind JSON", err)
		ctx.JSON(http.StatusBadRequest, httpResponse{Error: err})
		return
	}

	// Insert account into the database
	_, err := db.DB.Exec(`
		INSERT INTO accounts (name, password, phone, image, favorites) 
		VALUES (?, ?, ?, ?, ?)`,
		accounts.Name, accounts.Password, accounts.Phone, accounts.Image, "[]")
	if err != nil {
		log.Println("Failed to insert account", err)
		ctx.JSON(http.StatusInternalServerError, httpResponse{Error: err})
		return
	}

	// Successfully created account
	ctx.JSON(http.StatusCreated, httpResponse{
		Data: gin.H{"message": "Account created successfully!", "accounts": accounts},
	})
}
func SignInProcess(ctx *gin.Context) {
    var accounts Accounts

    // Bind JSON request to accounts struct
    if err := ctx.ShouldBindJSON(&accounts); err != nil {
        ctx.JSON(http.StatusBadRequest, httpResponse{Error: err})
        return
    }

    var hashedPassword string
    var accountID int

    // Query the database for the user by phone number
    err := db.DB.QueryRow(`SELECT id, password FROM accounts WHERE phone = ?`, accounts.Phone).Scan(&accountID, &hashedPassword)
    if err == sql.ErrNoRows {
        ctx.JSON(http.StatusUnauthorized, httpResponse{Error: err})
        return
    } else if err != nil {
        ctx.JSON(http.StatusInternalServerError, httpResponse{Error: err})
        return
    }

    // log.Printf("Hashed Password from DB: %s", hashedPassword)
    // log.Printf("Account ID: %d", accountID) // Correct logging for account ID
    // log.Printf("Provided Password: %s", accounts.Password)

    // Compare the provided password with the hashed password from the database
    if hashedPassword != accounts.Password {
        ctx.JSON(http.StatusUnauthorized, httpResponse{Error: err})
        log.Printf("Password mismatch for phone: %s", accounts.Phone)
        return
    }

    // If successful, return the account ID
    ctx.JSON(http.StatusOK, httpResponse{Data: accountID}) // Return account ID as int
}




// func SignInProcess(ctx *gin.Context) {
// 	var request struct {
// 		Phone string `json:"phone"`
// 		Password string `json:"password"`
// 	}

// 	request.Phone = ctx.Param("phone")
// 	request.Password = ctx.Param("password")

// 	err := ctx.ShouldBindJSON(&request);

// 	if err != nil {
// 		ctx.JSON(http.StatusBadRequest, httpResponse{Error: err})
// 		return
// 	}

// 	var accountID int
// 	err = db.AccDB.Get(&accountID, `SELECT id FROM accounts WHERE phone = ?`, request.Phone)

// 	if err != nil {
// 		ctx.JSON(http.StatusInternalServerError, httpResponse{Error: err})
// 		return
// 	}

// 	ctx.JSON(http.StatusOK, httpResponse{Data: accountID})

// }

// Handler to add a favorite to an account
func AddFavoriteHandler(ctx *gin.Context) {
	var request struct {
		ID       int   `json:"id"`
		Favorite int   `json:"favorite"` // Single favorite number to add
	}

	// Bind incoming JSON to the request struct
	if err := ctx.ShouldBindJSON(&request); err != nil {
		log.Printf("data binding error: %v", err)
		ctx.JSON(http.StatusBadRequest, httpResponse{Error: err})
		return
	}

	// Fetch current favorites from the database
	var currentFavorites string
	err := db.DB.Get(&currentFavorites, `SELECT favorites FROM accounts WHERE id = ?`, request.ID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, httpResponse{Error: err})
		return
	}

	// Unmarshal the current favorites into a slice
	var favoritesList []int
	if currentFavorites != "" {
		err = json.Unmarshal([]byte(currentFavorites), &favoritesList)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, httpResponse{Error: err})
			return
		}
	}

	// Append new favorite to the current favorites
	favoritesList = append(favoritesList, request.Favorite)

	// Marshal the updated favorites back to JSON
	updatedFavorites, err := json.Marshal(favoritesList)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, httpResponse{Error: err})
		return
	}

	// Update the database with the new favorites
	_, err = db.DB.Exec(`UPDATE accounts 
		SET favorites = ? 
		WHERE id = ?`,
		string(updatedFavorites), request.ID) // Store the JSON string

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, httpResponse{Error: err})
		return
	}

	ctx.JSON(http.StatusOK, httpResponse{Data: gin.H{"message": "Favorites updated successfully"}})
}

func RemoveFavoriteHandler(ctx *gin.Context) {
    var request struct {
        ID       int `json:"id"`
        Favorite int `json:"favorite"`
    }

    if err := ctx.ShouldBindJSON(&request); err != nil {
        log.Printf("data binding error: %v", err)
        ctx.JSON(http.StatusBadRequest, httpResponse{Error: err})
        return
    }

    var currentFavorites string
    err := db.DB.Get(&currentFavorites, `SELECT favorites FROM accounts WHERE id = ?`, request.ID)
    if err != nil {
        ctx.JSON(http.StatusInternalServerError, httpResponse{Error: err})
        return
    }

    var favoritesList []int
    if currentFavorites != "" {
        err = json.Unmarshal([]byte(currentFavorites), &favoritesList)
        if err != nil {
            ctx.JSON(http.StatusInternalServerError, httpResponse{Error: err})
            return
        }
    }

    for i, fav := range favoritesList {
        if fav == request.Favorite {
            favoritesList = append(favoritesList[:i], favoritesList[i+1:]...)
            break
        }
    }

    updatedFavorites, err := json.Marshal(favoritesList)
    if err != nil {
        ctx.JSON(http.StatusInternalServerError, httpResponse{Error: err})
        return
    }

    _, err = db.DB.Exec(`UPDATE accounts SET favorites = ? WHERE id = ?`, string(updatedFavorites), request.ID)
    if err != nil {
        ctx.JSON(http.StatusInternalServerError, httpResponse{Error: err})
        return
    }

    ctx.JSON(http.StatusOK, httpResponse{Data: gin.H{"message": "Favorites updated successfully"}})
}
