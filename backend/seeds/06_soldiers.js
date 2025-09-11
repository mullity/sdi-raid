/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

const { faker } = require('@faker-js/faker');
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('table_name').del()
  await knex('table_name').insert(data);
};

exports.seed = function(knex) {
  return knex('soldiers').del()
    .then(one => {
      return knex('units').select('id').from('units')
        .then(output => {
          return knex('status').select().from('status')
          .then(multiStatus => {
            let data = []
            let fakeUnits = Number(output.length)
            let faked = 10
            let idNum = 0

            let grades = [
              {grade: 'E1'},
              {grade: 'E2'},
              {grade: 'E3'},
              {grade: 'E4'},
              {grade: 'E5'},
              {grade: 'E6'},
              {grade: 'E7'},
              {grade: 'E8'},
              {grade: 'E9'},

              {grade: 'O1'},
              {grade: 'O2'},
              {grade: 'O3'},
              {grade: 'O4'},
              {grade: 'O5'},
              {grade: 'O6'},
              {grade: 'O7'},
              {grade: 'O8'},
              {grade: 'O9'},
            ]

            for(let j = 0; j < fakeUnits; j++){
              for(let i = 0; i < faked; i++){
                let gradeNum = Math.floor(Math.random() * 18)
                let deployableNum = Math.floor(Math.random() * (7 - 5 + 1) + 5)

                data.push({
                  id: idNum,
                  first_name: faker.person.firstName(),
                  last_name: faker.person.lastName(),
                  pay_grade: `${grades[gradeNum].grade}`,
                  assigned_unit_id: j,
                  deployable_status: deployableNum,
                  medical_status: deployableNum,
                  //tasks_jsonb: ''
                })
                idNum++
              }
            }
          return data;
          })
          .then(data => {
            return knex('soldiers').insert(data)
          })
        })
    })
}