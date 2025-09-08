/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const { faker } = require('@faker-js/faker');

let data = []
let faked = 10

data.push({
  id: 1,
  email: `${faker.person.firstName()}.${faker.string.alpha(1)}.${faker.person.lastName()}.mil@army.mil`.toLowerCase(),
  password: 'pass',
  role_id: 1
})
data.push({
  id: 2,
  email: `${faker.person.firstName()}.${faker.string.alpha(1)}.${faker.person.lastName()}.mil@army.mil`.toLowerCase(),
  password: 'pass',
  role_id: 2
})

data.push({
  id: 3,
  email: `${faker.person.firstName()}.${faker.string.alpha(1)}.${faker.person.lastName()}.mil@army.mil`.toLowerCase(),
  password: 'pass',
  role_id: 3
})




exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('users').del()
  await knex('users').insert(data);
};
