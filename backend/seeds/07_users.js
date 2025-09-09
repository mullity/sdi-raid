/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const { faker } = require('@faker-js/faker');


exports.seed = function(knex) {
  return knex('users').del()
    .then(one => {
      return knex('units').select('id').from('units')
        .then(output => {
          let data = []
          let fakeUnits = Number(output.length -1)
          let idNum = 0

          for(let i = 0; i < fakeUnits; i++ ){
            let name1 = `${faker.person.firstName()}.${faker.string.alpha(1)}.${faker.person.lastName()}`.toLowerCase()
            let name2 = `${faker.person.firstName()}.${faker.string.alpha(1)}.${faker.person.lastName()}`.toLowerCase()
            let name3 = `${faker.person.firstName()}.${faker.string.alpha(1)}.${faker.person.lastName()}`.toLowerCase()

            idNum++
            data.push({
              id: idNum,
              email: `${name1}.mil@army.mil`,
              password: 'pass',
              username: name1,
              role_id: 1,
              unit_id: i
            })
            idNum++
            data.push({
              id: idNum,
              email: `${name2}.mil@army.mil`,
              password: 'pass',
              username: name2,
              role_id: 2,
              unit_id: i
            })
            idNum++
            data.push({
              id: idNum,
              email: `${name3}.mil@army.mil`,
              password: 'pass',
              username: name3,
              role_id: 3,
              unit_id: i
            })

          }

          return data;
        })
        .then(data => {
          return knex('users').insert(data)
        })
    })
  }