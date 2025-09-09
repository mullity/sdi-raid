/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('readiness_snapshots', table => {
    table.increments('id').primary()
    table.integer('unit_id').notNullable()
    table.date('snapshot_date').notNullable()
    table.decimal('overall_score', 4, 2)

    table.foreign('unit_id').references('units.id')

  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('readiness_snapshots')
};
