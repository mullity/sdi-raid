/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('tasks', table => {
    table.increments().primary();
    table.string('name', 180)
    table.enu('level', ['individual','crew','collective'], {
      useNative: true,
      enumName: 'training_level'
    })

  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('tasks')
};
