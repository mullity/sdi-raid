require('dotenv').config()

const knex = require('knex')( require('../knexfile')[process.env.NODE_ENV])

const units = () => {
  return knex(units)

}

function calcEquipmentScore(vehicles) {
  const total = vehicles.length;
  const fmc = vehicles.filter(vehicle => vehicle.status === 'FMC').length;
  return Math.round((fmc / total) * 100);
}

function getter(table) {
  return knex(table)
  .select()
  .from(table)
}

function getWithUnitId(table, unitId){
  return knex(table)
  .select()
  .from(table)
  .where('assigned_unit_id', unitId)
}

//SELECT * FROM soldier_task_status s INNER JOIN soldiers ON s.soldier_id = soldiers.id;
function joinTaskStatus() {
  return knex('soldier_task_status')
  .join('soldiers', 'soldier_task_status.soldier_id', 'soldiers.id')
  .select()
}


const vicSnapshot = async (unit, verbose) => {
  let vics = await getWithUnitId('vehicle', unit)
  let fmc = 0
  let pmc = 0
  let nmc = 0
  let nmcArray = []
  let bradleyArray = []
  let hmmwvArray = []
  let scissorArray = []

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
  let vicPercent = Number((fmc + pmc)/T) * 100
  let output
  if(verbose === "true"){
    output =
    {id: "Vics", data: {
      total: vics.length,
      FMC: fmc,
      PMC: pmc,
      NMC: nmc,
      PERCENT: vicPercent
    }}
  } else {
    output = {
      id: "Vics", data: {
        PERCENT: vicPercent
      }
    }
  }

  return output;
}

const trainingSnapshot = async (unit, verbose) => {
  let qualified = 0
  let notQualified = 0
  let joined = await joinTaskStatus()
  let tasks = []

  for(let join of joined){
    if(join.unit_id == 0){
      tasks.push(join)
    }
  }

  for(let task of tasks){
    if(task.status == "qualified" ) {
      qualified++
    } else if (task.status == "not_qualified"){
      notQualified++
    }
  }

  let tasksT = tasks.length
  let tasksPercent = Number(qualified/tasksT) * 100

  if(verbose === "true"){
    output =
    {id: 'Tasks', data: {
      total: tasks.length,
      QUALIFIED: qualified,
      NOTQUALIFIED: notQualified,
      PERCENT: tasksPercent
    }}
  } else {
    output =
    {id: 'Tasks', data: {
      PERCENT: tasksPercent
    }}
  }

  return output;
}

//will break
const snapshot = async (unit, verbose) => {
  //get initial data & set start state
  let vics = await vicSnapshot(unit, verbose)
  let troops = await getter('soldiers')
  let tasks = await trainingSnapshot(unit, verbose)
  let deployable = 0
  let nonDeployable = 0
  let qualified = 0
  let notQualified = 0

  //iterate through all data
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

  //calculate all percents/ process data
  let troopT = troops.length
  let troopPercent = Number(deployable/troopT) * 100
  let tasksT = tasks.length
  let tasksPercent = Number(qualified/tasksT) * 100

  // let actionItem = {
  //   combatPower: {
  //     message: `${bradleyArray.length} bradleys are NMC.`,
  //     data: bradleyArray
  //   },
  //   sustainmentPower: {
  //     message: `${hmmwvArray.length} HMMWV's are down and ${scissorArray.length} bridges are down`,
  //     data: {
  //       hmmwv: hmmwvArray,
  //       bridge: scissorArray
  //     }
  //   }
  // }

  //define output
  let output = [
    vics,
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
  units: units,
  calcEquipmentScore: calcEquipmentScore,
  getter: getter,
  snapshot: snapshot,
  vicSnapshot:vicSnapshot,
  getWithUnitId: getWithUnitId,
  trainingSnapshot:trainingSnapshot
}



