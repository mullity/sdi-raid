/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('readiness_snapshots', table => {
    table.increments('id').primary();
    table.integer('user_id').notNullable();
    table.integer('unit_id').notNullable();
    table.timestamp('last_login').defaultTo(knex.fn.now()).notNullable()
    table.timestamp('last_logout');
    table.decimal('overall_score', 4, 2);
    table.string('personnel');
    table.string('training');
    table.string('maintenance');
    table.string('medical');

    table.foreign('unit_id').references('units.id');
    table.foreign('user_id').references('users.id').deferrable('deferred');

  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable('readiness_snapshots', table => {
    table.dropForeign('user_id');
    table.dropForeign('unit_id');
  })
  .then( () => {
    return knex.schema.dropTableIfExists('readiness_snapshots');
  })
};
