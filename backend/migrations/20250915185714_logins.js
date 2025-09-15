/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('logins', table => {
    table.increments('id').primary()
    table.string('token')
    table.integer('user_id')
    table.string('token_lifespan')

    table.foreign('user_id').references('users.id').deferrable('deferred')
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable('logins', table => {
    table.dropForeign('user_id')
  })
  .then(()=> {
    return knex.schema.dropTableIfExists('logins')
  })
};
