package handlers

import (
	"encoding/json"
	"log"
	"net/http"
	"orbita/internal/middleware"
	"orbita/internal/models"
	"orbita/internal/service"

	"github.com/google/uuid"
)

type ProjectHandler struct {
	Service *service.ProjectService
}

func (h *ProjectHandler) GetProject(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	if id == "" {
		http.Error(w, "ID is required", http.StatusBadRequest)
		return
	}

	project, err := h.Service.GetProject(id)
	if err != nil {
		http.Error(w, "Project not found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(project)
}

func (h *ProjectHandler) SaveProject(w http.ResponseWriter, r *http.Request) {
	// Retrieve the DeviceID injected by middleware
	deviceIDStr, ok := r.Context().Value(middleware.DeviceIDKey).(string)
	if !ok || deviceIDStr == "" {
		http.Error(w, "Unauthorized: No Device ID", http.StatusUnauthorized)
		return
	}

	// Convert string to UUID for the DB
	deviceID, err := uuid.Parse(deviceIDStr)
	if err != nil {
		http.Error(w, "Invalid Device ID format", http.StatusBadRequest)
		return
	}

	var input struct {
		Name    string          `json:"name"`
		Magnets []models.Magnet `json:"magnets"`
	}

	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		http.Error(w, "Invalid payload", http.StatusBadRequest)
		return
	}

	// Use the real deviceID here
	project, err := h.Service.CreateNewProject(deviceID, input.Name, input.Magnets)
	if err != nil {
		log.Printf("ERROR: Failed to create project: %v", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(project)
}
