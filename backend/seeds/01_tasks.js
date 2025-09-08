/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

const { faker } = require('@faker-js/faker');

let data = []
let faked = 10
let trainingLevel = [
  {name: 'individual'},
  {name: 'crew'},
  {name: 'collective'}
]

for(let i = 0; i < faked; i++){
  let trainingNum = Math.floor(Math.random() * 3)

  data.push({id: i, name: ``, level: `${trainingLevel[trainingNum].name}`})

  console.log(i)
  console.log(``)
  console.log(`${trainingLevel[trainingNum].name}`)
}

exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('tasks').del()
  await knex('tasks').insert(data);
};
