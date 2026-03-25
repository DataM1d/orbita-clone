package repository

import (
	"database/sql"
	"log"
	"orbita/internal/models"
)

type ProjectRepository struct {
	DB *sql.DB
}

func (r *ProjectRepository) CreateProject(p *models.Project) error {
	tx, err := r.DB.Begin()
	if err != nil {
		return err
	}

	//Saving project MetaData
	query := `INSERT INTO projects (id, user_id, name) VALUES ($1, $2, $3)`
	_, err = tx.Exec(query, p.ID, p.UserID, p.Name)
	if err != nil {
		log.Printf("Error inserting project: %v", err)
		tx.Rollback()
		return err
	}

	//Saving all Magnets
	magnetQuery := `INSERT INTO magnets (id, project_id, angle, radius, track_index, note, color) 
                VALUES ($1, $2, $3, $4, $5, $6, $7)`

	for _, m := range p.Magnets {
		_, err := tx.Exec(magnetQuery, m.ID, p.ID, m.Angle, m.Radius, m.TrackIndex, m.Note, m.Color)
		if err != nil {
			log.Printf("Error inserting magnet: %v", err)
			tx.Rollback()
			return err
		}
	}

	return tx.Commit()
}

func (r *ProjectRepository) GetProjectByID(id string) (*models.Project, error) {
	var p models.Project
	err := r.DB.QueryRow("SELECT id, user_id, name, created_at FROM projects WHERE id = $1", id).
		Scan(&p.ID, &p.UserID, &p.Name, &p.CreatedAt)
	if err != nil {
		return nil, err
	}

	rows, err := r.DB.Query("SELECT id, angle, radius, track_index, note, color FROM magnets WHERE project_id = $1", id)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var m models.Magnet
		if err := rows.Scan(&m.ID, &m.Angle, &m.Radius, &m.TrackIndex, &m.Note, &m.Color); err != nil {
			return nil, err
		}
		p.Magnets = append(p.Magnets, m)
	}

	return &p, nil
}
