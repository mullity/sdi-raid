/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('soldiers', table => {
    table.increments('id').primary();
    table.string('first_name').notNullable()
    table.string('last_name').notNullable()
    table.string('pay_grade').notNullable()
    table.integer('assigned_unit_id').notNullable()
    table.integer('deployable_status').notNullable()

    table.foreign('assigned_unit_id').references('units.id').deferrable('deferred')
    table.foreign('deployable_status').references('status.id').deferrable('deferred')
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable('soldiers', table => {
    table.dropForeign('assigned_unit_id')
    table.dropForeign('deployable_status')
  })
  .then( () => {
    return knex.schema.dropTableIfExists('soldiers')
  })
};
