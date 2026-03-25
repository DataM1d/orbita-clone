package service

import (
	"orbita/internal/models"
	"orbita/internal/repository"

	"github.com/google/uuid"
)

type ProjectService struct {
	Repo *repository.ProjectRepository
}

func (s *ProjectService) CreateNewProject(userID uuid.UUID, name string, magnets []models.Magnet) (*models.Project, error) {
	project := &models.Project{
		ID:      uuid.New(),
		UserID:  userID,
		Name:    name,
		Magnets: magnets,
	}

	err := s.Repo.CreateProject(project)
	if err != nil {
		return nil, err
	}
	return project, nil
}

func (s *ProjectService) GetProject(id string) (*models.Project, error) {
	return s.Repo.GetProjectByID(id)
}
