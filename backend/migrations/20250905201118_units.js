/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('units', table => {
    table.increments('id').primary()
    table.string('uic', 10).notNullable().unique()
    table.string('name').notNullable()
    table.string('parent_unit_uic')
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('units')

};
