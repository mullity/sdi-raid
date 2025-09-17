#!/bin/bash
npm i && \
npx knex migrate:rollback && \
npx knex migrate:latest && \
npx knex seed:run --specific=00_status.js && \
npx knex seed:run --specific=21_tasks.js && \
npx knex seed:run --specific=22_roles.js && \
npx knex seed:run --specific=23_units.js && \
npx knex seed:run --specific=24_vehicles.js && \
npx knex seed:run --specific=26_soldiers.js && \
npx knex seed:run --specific=27_users.js && \
npx knex seed:run --specific=28_soldier_task_status.js && \
npx knex seed:run --specific=29_readiness_snapshots.js && \
npx knex seed:run --specific=30_crews.js && \
npm run dev