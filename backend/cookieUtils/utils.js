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

//add a fuel status marker
//search by date last serviced, if > 6 months === not up to date on service
//
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
    {id: "Equipment", data: {
      total: vics.length,
      FMC: fmc,
      PMC: pmc,
      NMC: nmc,
      PERCENT: vicPercent
    }}
  } else {
    output = {
      id: "Equipment", data: {
        PERCENT: vicPercent
      }
    }
  }

  return output;
}

const trainingSnapshot = async (unitString, verbose) => {
  let qualified = 0
  let notQualified = 0
  let unit = Number(unitString)
  let joined = await joinTaskStatus()
  let tasks = []

  for(let join of joined){
    if(join.assigned_unit_id == unit){
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
    {id: 'Training', data: {
      total: tasks.length,
      QUALIFIED: qualified,
      NOTQUALIFIED: notQualified,
      PERCENT: tasksPercent
    }}
  } else {
    output =
    {id: 'Training', data: {
      PERCENT: tasksPercent
    }}
  }

  return output;
}

const personnelSnapshot = async (unit, verbose) => {
  let troops = await getWithUnitId('soldiers', unit)
  let deployable = 0
  let nonDeployable = 0

  for(let troop of troops){
    if(troop.deployable_status == "5" || troop.deployable_status == "6" ) {
      deployable++
    } else if (troop.deployable_status == "7"){
      nonDeployable++
    }
  }

  let troopT = troops.length
  let troopPercent = Number(deployable/troopT) * 100



    if(verbose === "true"){
      output =
      {id: "Personnel", data: {
        total: troops.length,
        DEPLOYABLE: deployable,
        NONDEPLOYABLE: nonDeployable,
        PERCENT: troopPercent
      }}
    } else {
      output =
      {id: "Personnel", data: {
        PERCENT: troopPercent
      }}
    }

  return output;

}

const medicalSnapshot = async (unit, verbose) => {
  let troops = await getWithUnitId('soldiers', unit)
  let green = 0
  let red = 0
  let amber = 0

  for(let troop of troops){
    if(troop.medical_status == "5"){
      green++
    }
    if(troop.medical_status == "6"){
      amber++
    }
    if (troop.medical_status == "7"){
      red++
    }
  }

  let troopT = troops.length
  let troopPercent = Number(green/troopT) * 100



    if(verbose === "true"){
      output =
      {id: "Medical", data: {
        total: troops.length,
        GREEN: green,
        AMBER: amber,
        RED: red,
        PERCENT: troopPercent
      }}
    } else {
      output =
      {id: "Medical", data: {
        PERCENT: troopPercent
      }}
    }

  return output;

}

const snapshot = async (unit, verbose) => {
  let vics = await vicSnapshot(unit, 'true')
  let troops = await personnelSnapshot(unit, 'true')
  let tasks = await trainingSnapshot(unit, 'true')
  let meds = await medicalSnapshot(unit, 'true')

  let output = [
    vics,
    troops,
    tasks,
    meds
  ]

  return output;
}

const priority = async (unit, verbose) => {
  let safetyNet = await snapshot(unit, verbose)
  let data = JSON.parse(JSON.stringify(safetyNet.slice()))
  data.sort((a,b) => a.data.PERCENT - b.data.PERCENT)

  return data

}

//get all fields in  a table
async function getAllFields (table){
  const columns = await knex('information_schema.columns')
    .select('column_name')
    .where({ table_name: table, table_schema: 'public' })
  return columns.map(col => col.column_name);
}

module.exports = {
  units: units,
  calcEquipmentScore: calcEquipmentScore,
  getter: getter,
  snapshot: snapshot,
  vicSnapshot:vicSnapshot,
  getWithUnitId: getWithUnitId,
  trainingSnapshot:trainingSnapshot,
  personnelSnapshot:personnelSnapshot,
  medicalSnapshot:medicalSnapshot,
  priority:priority,
  getAllFields: getAllFields,
}



