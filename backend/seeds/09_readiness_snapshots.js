/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

const { faker } = require('@faker-js/faker');

exports.seed = function(knex){
  return knex('readiness_snapshots').del()
    .then(one => {
      return knex('users').select('*').from('users')
        .then(users => {
          let data = []
          let idNum = 0
          for(let user of users){
            let scoreNum = Math.floor(Math.random() * 100)
            data.push({
              id: idNum,
              user_id: Number(user.id),
              unit_id: Number(user.unit_id),
              last_login: faker.date.recent(),
              last_logout: faker.date.past(),
              overall_score: scoreNum,
              personnel: null,
              training: null,
              maintenance: null,
              medical: null
            })

            idNum++
          }
          return data;
        })
        .then(data => {
          return knex('readiness_snapshots').insert(data)
        })
    })
}