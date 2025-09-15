#!/bin/bash
npm i && \
npx knex migrate:rollback && \
npx knex migrate:latest && \
npx knex seed:run && \
npm run dev