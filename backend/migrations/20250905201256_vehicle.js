/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('vehicle', table => {
    table.increments('id').primary()
    table.string('name', 150).notNullable()
    table.string('lin',10).notNullable()
    table.enu('status', ['FMC','PMC', 'NMC'], {
      useNative: true,
      enumName: 'equipment_status'
    })
    table.integer('assigned_unit_id').notNullable()
    table.date('date_last_serviced');
    table.integer('fuel_level')

    table.foreign('assigned_unit_id').references('units.id')

  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
return knex.schema
  .alterTable('vehicle', table => {
    table.dropForeign('assigned_unit_id')
  })
  .then(() => {
    return knex.schema
    .dropTableIfExists('vehicle')
    .raw('DROP TYPE IF EXISTS equipment_status;')
  });

};

