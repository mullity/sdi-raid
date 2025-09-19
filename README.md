# Unit-Readiness-Dashboard
A dashboard for providing unit readiness snapshots

## Setup

# Backend
- Spinup Docker
- docker run --rm --name pg-docker -e POSTGRES_PASSWORD=docker -d -p 5432:5432 \
-v $HOME/docker/volumes/postgres:/var/lib/postgresql/data postgres

- docker ps #take note of container ID

- docker exec -it <containerId> bash

- psql -U postgres

- CREATE DATABASE unit_readiness_db;

- navigate to /backend

- cp .env.template .env

- npm run spinup

# Frontend
- navigate to /frontend

- npm run dev