/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const { faker } = require('@faker-js/faker');

let data = []

let nameType = [
  {name: 'Engineer Co'},
  {name: 'Signal Co'},
  {name: 'Infantry Co'},
  {name: 'Military Intelligence Co'},
  {name: 'Forward Support Co'}
]

// Dynamic UIC
// let faked = 10
// for(let i = 0; i < faked; i++){
//   let unitNum = Math.floor(Math.random() * (300 - 1 + 1)) + 1
//   let nameNum = Math.floor(Math.random() * 5)

//   data.push({
//     id: i,
//     uic: `W${faker.string.alphanumeric(3)}AA`.toUpperCase(),
//     name: `${unitNum} ${nameType[nameNum].name}`,
//     parent_unit_id: Number('')
//   })
// }

//Static UIC

let unitNum0 = Math.floor(Math.random() * (300 - 100 + 1)) + 100
let unitNum1 = Math.floor(Math.random() * (300 - 100 + 1)) + 100
let unitNum2 = Math.floor(Math.random() * (300 - 100 + 1)) + 100
let unitNum3 = Math.floor(Math.random() * (300 - 100 + 1)) + 100
let unitNum4 = Math.floor(Math.random() * (300 - 100 + 1)) + 100
let unitNum5 = Math.floor(Math.random() * (300 - 100 + 1)) + 100
let unitNum6 = Math.floor(Math.random() * (300 - 100 + 1)) + 100
let unitNum7 = Math.floor(Math.random() * (300 - 100 + 1)) + 100
let unitNum8 = Math.floor(Math.random() * (300 - 100 + 1)) + 100
let unitNum9 = Math.floor(Math.random() * (300 - 100 + 1)) + 100

data.push({
  id: 0,
  uic: `WAMZA0`,
  name: `${unitNum0} ${nameType[0].name}`,
  parent_unit_uic: 'WAMZAA'
})
data.push({
  id: 1,
  uic: `WAMZB0`,
  name: `${unitNum1} ${nameType[1].name}`,
  parent_unit_uic: 'WAMZAA'
})
data.push({
  id: 2,
  uic: `WAMZC0`,
  name: `${unitNum2} ${nameType[2].name}`,
  parent_unit_uic: 'WAMZAA'
})
data.push({
  id: 3,
  uic: `WAMZD0`,
  name: `${unitNum3} ${nameType[3].name}`,
  parent_unit_uic: 'WAMZAA'
})
data.push({
  id: 4,
  uic: `WAMZAA`,
  name: `${unitNum4} ${nameType[4].name}`,
  parent_unit_uic: null
})


data.push({
  id: 5,
  uic: `WEMZA0`,
  name: `${unitNum5} ${nameType[0].name}`,
  parent_unit_uic: 'WEMZAA'
})
data.push({
  id: 6,
  uic: `WEMZB0`,
  name: `${unitNum6} ${nameType[1].name}`,
  parent_unit_uic: 'WEMZAA'
})
data.push({
  id: 7,
  uic: `WEMZC0`,
  name: `${unitNum7} ${nameType[2].name}`,
  parent_unit_uic: 'WEMZAA'
})
data.push({
  id: 8,
  uic: `WEMZD0`,
  name: `${unitNum8} ${nameType[3].name}`,
  parent_unit_uic: 'WEMZAA'
})
data.push({
  id: 9,
  uic: `WEMZAA`,
  name: `${unitNum9} ${nameType[4].name}`,
  parent_unit_uic: null
})




exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('units').del()
  await knex('units').insert(data);
};
