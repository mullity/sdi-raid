/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('soldier_task_status', table => {
    table.increments('id').primary();
    table.integer('soldier_id').notNullable()
    table.integer('task_id').notNullable()
    table.enu('status', ['qualified','not_qualified'], {
      useNative: true,
      enumName: 'training_status'
    })

    table.foreign('soldier_id').references('soldiers.id')
    table.foreign('task_id').references('tasks.id')

  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema
  .alterTable('soldier_task_status', table => {
    table.dropForeign('soldier_id')
    table.dropForeign('task_id')
  })
  .then(() => {
    return knex.schema
    .dropTableIfExists('soldier_task_status')
    .raw('DROP TYPE IF EXISTS training_status;')
  });

};

