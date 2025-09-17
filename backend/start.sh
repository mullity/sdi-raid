#!/bin/bash
npm i && \
npx knex migrate:rollback && \
npx knex migrate:latest && \
npx knex seed:run --specific=00_status.js && \
npx knex seed:run --specific=01_tasks.js && \
npx knex seed:run --specific=02_roles.js && \
npx knex seed:run --specific=03_units.js && \
npx knex seed:run --specific=04_vehicles.js && \
npx knex seed:run --specific=06_soldiers.js && \
npx knex seed:run --specific=07_users.js && \
npx knex seed:run --specific=08_soldier_task_status.js && \
npx knex seed:run --specific=09_readiness_snapshots.js && \
npx knex seed:run --specific=10_crews.js && \
npm run dev