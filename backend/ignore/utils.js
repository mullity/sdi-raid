require('dotenv').config()

const knex = require('knex')( require('../knexfile')[process.env.NODE_ENV])

function getter(table) {
  return knex(table)
  .select()
  .from(table)
}


const snapshot = async () => {
  //get initial data & set start state
  let vics = await getter('vehicle')
  let troops = await getter('soldiers')
  let tasks = await getter('soldier_task_status')
  let fmc = 0
  let pmc = 0
  let nmc = 0
  let nmcArray = []
  let deployable = 0
  let nonDeployable = 0
  let qualified = 0
  let notQualified = 0
  let bradleyArray = []
  let hmmwvArray = []
  let scissorArray = []

  //iterate through all data
  for(let vic of vics){
    if(vic.status == 'FMC') {
      fmc++
    } else if (vic.status == 'PMC'){
      pmc++
    } else if(vic.status == 'NMC') {
      let date = vic.date_last_serviced
      nmc++
      nmcArray.push({
        lin: vic.lin,
        unit: vic.assigned_unit_id,
        lastService: `${date}`.slice(4,15)
      })
    }
  }

  for(let troop of troops){
    if(troop.deployable_status == "5" || troop.deployable_status == "6" ) {
      deployable++
    } else if (troop.deployable_status == "7"){
      nonDeployable++
    }
  }

  for(let task of tasks){
    if(task.status == "qualified" ) {
      qualified++
    } else if (task.status == "not_qualified"){
      notQualified++
    }
  }

  for(let broke of nmcArray){
    if(broke.lin == 'M05073') {
      bradleyArray.push(broke)
    }
    else if(broke.lin == 'M1079') {
      hmmwvArray.push(broke)
    }
    else if(broke.lin == 'B31098') {
      scissorArray.push(broke)
    }
  }

  //calculate all percents/ process data
  let T = vics.length
  //let vicPercent = Number((fmc + pmc) / T >= 1 - (nmc / T)) * 100
  let vicPercent = Number((fmc + pmc)/T) * 100
  let troopT = troops.length
  let troopPercent = Number(deployable/troopT) * 100
  let tasksT = tasks.length
  let tasksPercent = Number(qualified/tasksT) * 100

  let actionItem = {
    combatPower: {
      message: `${bradleyArray.length} bradleys are NMC.`,
      data: bradleyArray
    },
    sustainmentPower: {
      message: `${hmmwvArray.length} HMMWV's are down and ${scissorArray.length} bridges are down`,
      data: {
        hmmwv: hmmwvArray,
        bridge: scissorArray
      }
    }
  }

  //define output
  let output = [
    {id: "Vics", data: {
      total: `${vics.length}`,
      FMC: fmc,
      PMC: pmc,
      NMC: nmc,
      PERCENT: vicPercent,
      ACTIONITEM: actionItem
    }},
    {id: "Troops", data: {
      total: `${troops.length}`,
      DEPLOYABLE: deployable,
      NONDEPLOYABLE: nonDeployable,
      PERCENT: troopPercent
    }},
    {id: 'Tasks', data: {
      total: `${tasks.length}`,
      QUALIFIED: qualified,
      NOTQUALIFIED: notQualified,
      PERCENT: tasksPercent
    }}
  ]
  //return output
  return output;
}




module.exports = {
  snapshot: snapshot,
  getter: getter
}