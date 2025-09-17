/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
let data = []
let faked = 10


data.push({id: 1, name: 'DEV'})
data.push({id: 2, name: 'ADMIN'})
data.push({id: 3, name: 'USER'})

exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('roles').del()
  await knex('roles').insert(data);
};
