package main

import (
	"context"
	"log"
	"os"
	"time"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// Product struct: This is our 'Blueprint'.
// The `bson` tags tell Go which fields in Atlas to look for.
type Product struct {
	ID    primitive.ObjectID `bson:"_id"`
	Name  string             `bson:"name"`
	Stock int                `bson:"stock"`
}

func main() {
	app := fiber.New()

	// 1. Database Connection Logic
	uri := os.Getenv("MONGODB_URI")
	if uri == "" {
		log.Fatal("MONGODB_URI is not defined")
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, options.Client().ApplyURI(uri))
	if err != nil {
		log.Fatal(err)
	}

	// 2. The Inventory Route
	app.Get("/api/inventory/:id", func(c *fiber.Ctx) error {
		idParam := c.Params("id")

		// Convert string ID to MongoDB ObjectID
		objID, err := primitive.ObjectIDFromHex(idParam)
		if err != nil {
			return c.Status(400).JSON(fiber.Map{"error": "Invalid Product ID format"})
		}

		var product Product
		// We explicitly point to your 'eCommerce' database and 'products' collection
		collection := client.Database("eCommerce").Collection("products")

		queryCtx, queryCancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer queryCancel()

		// Find the document and 'Decode' (unmarshal) it into our struct
		err = collection.FindOne(queryCtx, bson.M{"_id": objID}).Decode(&product)
		if err != nil {
			if err == mongo.ErrNoDocuments {
				return c.Status(404).JSON(fiber.Map{"error": "Product not found in Atlas"})
			}
			return c.Status(500).JSON(fiber.Map{"error": "Database query failed"})
		}

		// Return the real data from the cloud!
		return c.JSON(fiber.Map{
			"product_name":  product.Name,
			"current_stock": product.Stock,
			"id":            product.ID.Hex(),
			"provider":      "Go Inventory Engine",
		})
	})

	log.Fatal(app.Listen(":8080"))
}
