Orbita Clone

A fullstack, circular MIDI style sequencer inspired by the Playtronica Orbita. This project translates physical motion and polar coordinates into real time synthesis using WebGL and the Web Audio API.

Tech Stack:
Frontend: React, TypeScript, Three.js (3D Engine), Tone.js (Audio Engine), Zustand (State Management).

Backend: Go (Golang), Fiber (Web Framework), PostgreSQL (Persistence).

Math: Polar coordinate systems (r, theta) and Raycasting for 3D interaction.

System Architecture:
The Motor: A Three.js animation loop drives a virtual platter.

The Sensor: A mathematical "collision" check triggers audio when the playhead passes a magnet's angle.

The Brain: A Go backend based REST API manages "Project Recipes" storing magnet positions, notes, and BPM in Postgres.

Getting Started:

Node.js (v18+)
Go (v1.20+)
PostgreSQL

1. Clone the repo:
git clone [https://github.com/DataM1d/orbita-clone.git](https://github.com/yourusername/orbita-clone.git)

2. Frontend Setup:
cd client
npm install
npm run dev

3. Backend Setup:
cd server
go mod tidy
go run cmd/main.go

Roadmap
[x] Phase 1: Skeleton (3D Scene, Audio Context, Go Server).

[ ] Phase 2: Circular Logic (Raycasting & Polar Math).

[ ] Phase 3: Audio Engine (Synth Synthesis).

[ ] Phase 4: Persistence (Database Integration).