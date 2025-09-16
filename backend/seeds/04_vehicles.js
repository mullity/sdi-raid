/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const { faker } = require('@faker-js/faker');

exports.seed = function(knex) {
  return knex('vehicle').del()
    .then(one => {
      return knex('units').select().from('units')
        .then(output => {
          let data = []
          let fakeUnits = Number(output.length)
          let faked = 10
          let vicName = [
            {name: 'M2A4 BRADLEY FIGHTING VEHICLE (BFV)', lin: 'M05073'},
            {name: 'LOADER SKID STEER: TYPE II', lin: 'L77147'},
            {name: 'JOINT LIGHT TACTICAL VEHICLE: A1 FOUR SEAT GEN PURPO:', lin: 'J05029'},
            {name: 'HMMWV', lin: 'M1079'},
            {name: 'Truck, Cargo', lin: 'M1078A2'},
            {name: 'ASSAULT BREACHER VEHICLE', lin: 'A05001'},
            {name: 'MOTORIZED GRADER', lin: 'M05001'},
            {name: 'COMMAND POST CARRIER', lin: 'C05105'},
            {name: 'JOINT LIGHT TACTICAL VEHICLE: A1 TWO SEAT UTILITY', lin: 'J05028'},
            {name: 'BRIDGE : HEAVY ASSAULT SCISSORING', lin: 'B31098'},
          ]
          let equipmentStatus = [
            {name: 'FMC'},
            {name: 'PMC'},
            {name: 'NMC'}
          ]

          let idNum = 0
          for(let j = 0; j < fakeUnits; j++) {
            let unitNumber = `${output[j].name}`.slice(0,3)
            for(let i = 0; i < faked; i++){
              let nameNum = Math.floor(Math.random() * 10)
              let statusNum = Math.floor(Math.random() * 3)
              let date = faker.date.past()
              let fuelNum = Math.floor(Math.random() * 100)

              idNum++
              data.push({
                id: idNum,
                name: `${vicName[nameNum].name}`,
                lin: `${vicName[nameNum].lin}`,
                status: `${equipmentStatus[statusNum].name}`,
                assigned_unit_id: j,
                date_last_serviced: date,
                fuel_level: fuelNum,
                bumper_number: `${unitNumber}-${i}`
              })
            }
          }
          return data;
        })
        .then(data => {
          return knex('vehicle').insert(data)
        })
    })
}