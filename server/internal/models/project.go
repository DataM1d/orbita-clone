package models

import (
	"time"

	"github.com/google/uuid"
)

type Magnet struct {
	ID         string  `json:"id"`
	Angle      float64 `json:"angle"`
	Radius     float64 `json:"radius"`
	TrackIndex int     `json:"trackIndex"`
	Note       string  `json:"note"`
	Color      string  `json:"color"`
}

type Project struct {
	ID        uuid.UUID `json:"id"`
	UserID    uuid.UUID `json:"user_id"`
	Name      string    `json:"name"`
	Magnets   []Magnet  `json:"magnets"`
	CreatedAt time.Time `json:"created_at"`
}
