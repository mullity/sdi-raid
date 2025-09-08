/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('soldiers', table => {
    table.increments('id').primary();
    table.string('first_name').notNullable()
    table.string('last_name').notNullable()
    table.integer('unit_id').notNullable()

    table.foreign('unit_id').references('units.id').deferrable('deferred')
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable('soldiers', table => {
    table.dropForeign('unit_id')
  })
  .then( () => {
    return knex.schema.dropTableIfExists('soldiers')
  })
};
