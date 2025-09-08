/**
* @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = function(knex) {
  return knex('soldier_task_status').del()
    .then(one => {
      return knex('soldiers').select('id').from('soldiers')
      .then(soldiers => {
        return knex('tasks').select('id').from('tasks')
        .then(tasks => {
          let data = []
          let fakeTasks = Number(tasks.length)
          let fakeSoldiers = Number(soldiers.length)
          let idNum = 0
          let status = [
            {name: 'qualified'},
            {name: 'not_qualified'}
          ]


          for(let j = 0; j < fakeTasks; j++){
            for(let i = 0; i < fakeSoldiers; i++){
              let statusNum = Math.floor(Math.random() * 2)
              idNum++
              data.push({
                id: idNum,
                soldier_id: i,
                task_id: j,
                status: `${status[statusNum].name}`
              })
            }
          }
          return data
        })
      })
      .then(data => {
        return knex('soldier_task_status').insert(data)
      })
    })
}