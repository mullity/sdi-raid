/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('tasks', table => {
    table.increments('id').primary();
    table.string('number', 180)
    table.string('title', 180)
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
  return knex.schema
    .dropTableIfExists('tasks')
    .raw('DROP TYPE IF EXISTS training_level;');
};
