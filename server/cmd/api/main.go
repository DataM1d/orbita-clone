package main

import (
	"log"
	"net/http"
	"orbita/internal/handlers"
	"orbita/internal/middleware"
	"orbita/internal/repository"
	"orbita/internal/service"
	"orbita/pkg/database"
	"os"

	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load("./.env")
	if err != nil {
		log.Println("Warning: .env file not found in current directory. Using fallbacks.e")
	}

	db, err := database.NewPostgresDB(
		os.Getenv("DB_HOST"),
		os.Getenv("DB_PORT"),
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_NAME"),
	)

	if err != nil {
		log.Fatal("Could not connect to database:", err)
	}
	defer db.Close()

	projectRepo := &repository.ProjectRepository{DB: db}
	projectService := &service.ProjectService{Repo: projectRepo}
	projectHandler := &handlers.ProjectHandler{Service: projectService}

	mux := http.NewServeMux()

	mux.HandleFunc("POST /api/projects", projectHandler.SaveProject)
	mux.HandleFunc("GET /api/projects/{id}", projectHandler.GetProject)

	var handler http.Handler = mux
	handler = middleware.DeviceIDMiddleware(handler)
	handler = middleware.RateLimit(handler)
	handler = middleware.CORS(handler)

	port := "localhost:8080"
	log.Printf("Orbita Backend strictly operational on %s", port)

	if err := http.ListenAndServe(port, handler); err != nil {
		log.Fatal(err)
	}
}
