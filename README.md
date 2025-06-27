# Cobber-web-app

This is a monorepo for the Cobbler Sandbox project.

Demo: https://youtu.be/nMuRl0Hx3z4

## How to Run

`npm install`
To install dependencies

`npm run dev`
This runs both the frontend and backend apps.

- frontend at http://localhost:3000/
- backend at http://localhost:3001/

Or run the frontend/backend individually
Frontend

- `cd apps/frontend`
- `npm run dev`

Backend

- `cd apps/backend`
- `npm run dev`

## Tech Stack

- Frontend: [Next.js](https://nextjs.org/)
- Backend: [Node.js](https://nodejs.org/) and [Express](https://expressjs.com/)
- Monorepo (run front/backend functionality) [Turborepo](https://turbo.build/)
- Shared Packages: Typescript types and validators

## Project Structure

- cobbler-web-app/
  - base root files, like package.json
  - apps/
    - frontend/ # Next.js app
    - backend/ # Express server
  - packages/
    - shared-types/ # Shared data types

## App Responsibilities

Frontend

- Authentication layer
  - OAuth
  - credientials login
  - session management (like JWT or cookies)
  - enforce authenitated routes
- Frontend of pages and user facing interaction poitns

Backend

- APIs, with individual auth guarding
