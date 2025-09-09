/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('units', table => {
    table.increments('id').primary()
    table.string('uic', 10).notNullable().unique()
    table.string('name').notNullable()
    table.integer('parent_unit_id')

    table.foreign('parent_unit_id').references('units.id').deferrable('deferred')

  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable('units', table => {
    table.dropForeign('parent_unit_id')
  })
  .then( () => {
    return knex.schema.dropTableIfExists('units')
  })
};
