/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const { faker } = require('@faker-js/faker');
const bcrypt = require('bcrypt');


exports.seed = async function(knex) {
  await knex('users').del();
  const output = await knex('units').select('id').from('units');
  const saltRounds = 10;
  let data = [];
  let fakeUnits = Number(output.length - 1);
  let idNum = 0;

  for (let i = 0; i < fakeUnits; i++) {
    let name1 = `${faker.person.firstName()}.${faker.string.alpha(1)}.${faker.person.lastName()}`.toLowerCase();
    let name2 = `${faker.person.firstName()}.${faker.string.alpha(1)}.${faker.person.lastName()}`.toLowerCase();
    let name3 = `${faker.person.firstName()}.${faker.string.alpha(1)}.${faker.person.lastName()}`.toLowerCase();

    idNum++;
    data.push({
      id: idNum,
      email: `${name1}.mil@army.mil`,
      password: await bcrypt.hash("pass", saltRounds),
      username: name1,
      role_id: 1,
      unit_id: i
    });
    idNum++;
    data.push({
      id: idNum,
      email: `${name2}.mil@army.mil`,
      password: await bcrypt.hash("pass", saltRounds),
      username: name2,
      role_id: 2,
      unit_id: i
    });
    idNum++;
    data.push({
      id: idNum,
      email: `${name3}.mil@army.mil`,
      password: await bcrypt.hash("pass", saltRounds),
      username: name3,
      role_id: 3,
      unit_id: i
    });
  }

  await knex('users').insert(data);
};