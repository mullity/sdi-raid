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
let echelonNum = [
  {name: 'CO'},
  {name: 'BN'},
  {name: 'BDE'}
]
let taskNumbers = [
  {name: 'Perform Deployment Alert Activities'},
  {name: 'Conduct Rail Load Operations'},
  {name: 'Direct Unit Mobilization'},
  {name: 'Conduct Expeditionary Deployment Operations'},
  {name: 'Prepare Personnel for Deployment'},
  {name: 'Conduct Troop Leading Procedures'},
]

for(let i = 0; i < faked; i++){
  let trainingNum = Math.floor(Math.random() * 3)
  let taskNum = Math.floor(Math.random() * 3)
  let fakeNum = Math.floor(Math.random() * 71)
  let itemNum = Math.floor(Math.random() * 9999)

  data.push({
    id: i,
    number: `${fakeNum}-${echelonNum[trainingNum].name}-${itemNum}`,
    title: `${taskNumbers[taskNum].name}`,
    level: `${trainingLevel[trainingNum].name}`,
  })
}

exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('tasks').del()
  await knex('tasks').insert(data);
};