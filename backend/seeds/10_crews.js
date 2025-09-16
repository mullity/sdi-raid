/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.seed = function(knex){
  return knex('crews').del()
    .then(one => {
      return knex('vehicle').select().from('vehicle')
        .then(vehicles => {
          return knex('soldiers').select().from('soldiers')
            .then(soldiers => {
              let data = []
              let bradleys = []
              let loaders = []
              let jtlv4 = []
              let hmmwv = []
              let truck = []
              let breacher = []
              let grader = []
              let command = []
              let jtlv2 = []
              let bridge = []
              let idTicker = 0
              let soldierTicker = 0
              for (let vic of vehicles) {
                if (vic.lin == 'M05073') {
                  bradleys.push(vic)
                }
                else if (vic.lin == 'M1079') {
                  hmmwv.push(vic)
                }
                else if (vic.lin == 'B31098') {
                  bridge.push(vic)
                }
                else if (vic.lin == 'L77147') {
                  loaders.push(vic)
                }
                else if (vic.lin == 'J05029') {
                  jtlv4.push(vic)
                }
                else if (vic.lin == 'M1078A2') {
                  truck.push(vic)
                }
                else if (vic.lin == 'A05001') {
                  breacher.push(vic)
                }
                else if (vic.lin == 'M05001') {
                  grader.push(vic)
                }
                else if (vic.lin == 'C05105') {
                  command.push(vic)
                }
                else if (vic.lin == 'J05028') {
                  jtlv2.push(vic)
                }
            }


            for(let brad of bradleys){
              let levelNum = Math.floor(Math.random() * 6)
              let nightNum = Math.floor(Math.random() * 2)
              let soldier1 = soldierTicker
              soldierTicker++
              let soldier2 = soldierTicker
              soldierTicker++
              let soldier3 = soldierTicker
              soldierTicker++
              data.push({
                id: idTicker,
                gunnery_level: levelNum,
                night_qualified: nightNum,
                vehicle_id: brad.id,
                soldier_id_1: soldier1,
                soldier_id_2: soldier2,
                soldier_id_3: soldier3,
              })
              idTicker++
            }
            return data;
            })
            .then(data => {
              return knex('crews').insert(data)
            })
        })
    })
}