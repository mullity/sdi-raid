/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('crews', table => {
    table.increments('id').primary()
    table.integer('gunnery_level').notNullable()
    table.integer('night_qualified').notNullable()
    table.integer('vehicle_id').notNullable()
    table.integer('soldier_id_1')
    table.integer('soldier_id_2')
    table.integer('soldier_id_3')
    table.integer('soldier_id_4')
    table.integer('soldier_id_5')

    table.foreign('night_qualified').references('status.id').deferrable('deferred')
    table.foreign('vehicle_id').references('vehicle.id').deferrable('deferred')
    table.foreign('soldier_id_1').references('soldiers.id').deferrable('deferred')
    table.foreign('soldier_id_2').references('soldiers.id').deferrable('deferred')
    table.foreign('soldier_id_3').references('soldiers.id').deferrable('deferred')
    table.foreign('soldier_id_4').references('soldiers.id').deferrable('deferred')
    table.foreign('soldier_id_5').references('soldiers.id').deferrable('deferred')
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable('crews', table => {
    table.dropForeign('night_qualified')
    table.dropForeign('vehicle_id')
    table.dropForeign('soldier_id_1')
    table.dropForeign('soldier_id_2')
    table.dropForeign('soldier_id_3')
    table.dropForeign('soldier_id_4')
    table.dropForeign('soldier_id_5')
  })
  .then(()=> {
    return knex.schema.dropTableIfExists('crews')
  })
};
