/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('users', table => {
    table.increments('id').primary();
    table.string('email', 200).notNullable().unique();
    table.string('password').notNullable()
    table.integer('role_id').notNullable();
    table.integer('soldier_id')

    table.foreign('role_id').references('roles.id').deferrable('deferred')
    table.foreign('soldier_id').references('soldiers.id').deferrable('deferred')
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable('users', table => {
    table.dropForeign('role_id')
    table.dropForeign('soldier_id')
  })
  .then( () => {
    return knex.schema.dropTableIfExists('users')
  })
};
