package main

import (
	"log"
	"net/http"
	"os"

	"backend-api/api"

	"github.com/joho/godotenv"
)

func main() {
	godotenv.Load()

	http.HandleFunc("GET /api/inventory/{id}", api.Handler)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server running on port %s", port)

	if err := http.ListenAndServe(":"+port, nil); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}

}
