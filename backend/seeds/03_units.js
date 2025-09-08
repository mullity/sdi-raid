/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const { faker } = require('@faker-js/faker');

let data = []
let faked = 10
let nameType = [
  {name: 'Engineer Co'},
  {name: 'Signal Co'},
  {name: 'Infantry Co'},
  {name: 'Military Intelligence Co'},
  {name: 'Forward Support Co'}
]

for(let i = 0; i < faked; i++){
  let unitNum = Math.floor(Math.random() * (300 - 1 + 1)) + 1
  let nameNum = Math.floor(Math.random() * 5)

  data.push({
    id: i,
    uic: `W${faker.string.alphanumeric(3)}AA`.toUpperCase(),
    name: `${unitNum} ${nameType[nameNum].name}`,
    parent_unit_id: Number('')
  })
}


exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('units').del()
  await knex('units').insert(data);
};
