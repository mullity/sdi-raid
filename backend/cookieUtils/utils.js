const { VehicleSnapshot, TrainingSnapshot, PersonnelSnapshot, MedicalSnapshot } = require('../classes/uiClasses');

require('dotenv').config()

const knex = require('knex')( require('../knexfile')[process.env.NODE_ENV])



const units = () => {
  return knex(units)

}

/**
 *
 * @param {Array} vehicles Array of vehicles
 * @returns {number} percentage of FMC vehicles as a whole number
 */
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

/**
 *
 * @param {string} table table name to check for entities with an assigned_unit_id
 * @param {number} unitId id to check for matches
 * @returns array of all columns for any matching entity
 */
function getWithUnitId(table, unitId){
  return knex(table)
  .select()
  .from(table)
  .where('assigned_unit_id', unitId)
}

/**
 *
 * @returns array of all task statuses joined with their respective soldiers
 */
//SELECT * FROM soldier_task_status s INNER JOIN soldiers ON s.soldier_id = soldiers.id;
function joinTaskStatus() {
  return knex('soldier_task_status')
  .join('soldiers', 'soldier_task_status.soldier_id', 'soldiers.id')
  .select()
}

/**
 *
 * @param {number} unit unitId
 * @param {string} verbose indicates if extra data (total, functionality numbers) is returned in the response
 * @returns promise that resolves into a JSON object containing values
 */
const vicSnapshot = async (unit, verbose) => {
  let myNewSnap = new VehicleSnapshot()
  return myNewSnap.init(unit)
  .then(()=>(myNewSnap.generateCard(verbose)))
}

/**
 *
 * @param {string} unitString unitId in string form, is converted to Number
 * @param {string} verbose indicates if extra data (total, qualified numbers) is returned in the response
 * @returns promise that resolves into a JSON object containing values
 */
const trainingSnapshot = async (unit, verbose) => {
  let myNewSnap = new TrainingSnapshot()
  return myNewSnap.init(unit)
  .then(()=>(myNewSnap.generateCard(verbose)))
}

/**
 *
 * @param {number} unit unitId
 * @param {string} verbose indicates if extra data (total, deployability numbers) is returned in the response
 * @returns promise that resolves into a JSON object containing values
 */
const personnelSnapshot = async (unit, verbose) => {
  let myNewSnap = new PersonnelSnapshot()
  return myNewSnap.init(unit)
  .then(()=>(myNewSnap.generateCard(verbose)))
}

/**
 *
 * @param {number} unit unitId
 * @param {string} verbose indicates if extra data (total, medical status numbers) is returned in the response
 * @returns promise that resolves into a JSON object containing values
 */
const medicalSnapshot = async (unit, verbose) => {
  let myNewSnap = new MedicalSnapshot()
  return myNewSnap.init(unit)
  .then(()=>(myNewSnap.generateCard(verbose)))
  // let troops = await getWithUnitId('soldiers', unit)
  // let green = 0
  // let red = 0
  // let amber = 0

  // for(let troop of troops){
  //   if(troop.medical_status == "5"){
  //     green++
  //   }
  //   if(troop.medical_status == "6"){
  //     amber++
  //   }
  //   if (troop.medical_status == "7"){
  //     red++
  //   }
  // }

  // let troopT = troops.length
  // let troopPercent = Number(green/troopT) * 100
  // let output




  //   if(verbose === "true"){
  //     output =
  //     {id: "Medical", data: {
  //       total: troops.length,
  //       GREEN: green,
  //       AMBER: amber,
  //       RED: red,
  //       PERCENT: troopPercent
  //     }}
  //   } else {
  //     output =
  //     {id: "Medical", data: {
  //       PERCENT: troopPercent
  //     }}
  //   }

  // return output;

}

/**
 *
 * @param {number} unit unitId
 * @param {string} verbose NOT USED - indicates if extra data is returned in the response
 * @returns {Promise} promise that resolves into a JSON Array containing values
 */
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

/**
 * Gets snapshots and returns values in ascending order (worst category first)
 * @param {number} unit unitId
 * @param {string} verbose indicates if extra data is returned in the response from various snapshots
 * @returns {Promise} promise that resolves into a JSON Array containing values
 */
const priority = async (unit, verbose) => {
  let safetyNet = await snapshot(unit, verbose)
  let data = JSON.parse(JSON.stringify(safetyNet.slice()))
  data.sort((a,b) => a.data.PERCENT - b.data.PERCENT)

  return data

}

/**
 * PLACEHOLDER - get maintenance_currancy from vehicle by unit
 * @param {number} unit unitId
 * @param {string} verbose indicates if extra data is returned in the response from various snapshots
 * @returns % of vehicles w/lin true && % of vehicles w/lin false && average fuel percentage
 */
const vicMaint = async (unit) => {

  let output = {
      true: 75,
      trueData: [
        {
          id: 1,
          assigned_unit_id: 0,
          lin: 'C05105'
        },
        {
          id: 1,
          assigned_unit_id: 0,
          lin: 'C05105'
        },
        {
          id: 1,
          assigned_unit_id: 0,
          lin: 'C05105'
        }
      ],
      false: 25,
      falseData: [
        {
          id: 11,
          assigned_unit_id: 1,
          lin: 'X05105'
        }
      ],
      fuelLevel: 75
    }

  return output;
}

/**
 * TODO - PLACEHOLDER - get maintenance_currancy from vehicle by unit
 * @param {number} unit unitId
 * @param {string} verbose indicates if extra data is returned in the response from various snapshots
 * @returns % of vehicles w/lin true && % of vehicles w/lin false && average fuel percentage
 */
const vicIssuesActions = async (percent, maintenance, fuelLevel, unit) => {
  let issues= []
  let actions= []
  let issueTick = 0
  let actionTick = 0
  let certified = await vicCertified(unit)

  if(percent < 75){
    issues.push({id: issueTick, text: `${percent}% of vehicles are non-operational`})
    issueTick++
    actions.push({id: actionTick, text: 'Ensure all crew is scheduled for crew training, and all vehicles are on the maintenance schedule'})
    actionTick++
  }
  if(maintenance < 75){
    issues.push({id: issueTick, text: `${maintenance}% of vehicles are non-operational due to maintenance`})
    issueTick++
    actions.push({id: actionTick, text: 'Ensure all vehicles are on the maintenance schedule'})
    actionTick++
  }
  if(fuelLevel < 75){
    issues.push({id: issueTick, text: `Average fuel level across the motorpool is ${fuelLevel}.`})
    issueTick++
    actions.push({id: actionTick, text: 'Ensure operators fill vehicles and fuelers are available for refill of on-site storage'})
    actionTick++
  }
  if(certified.overall < 75){
    issues.push({id: issueTick, text: `Average operator certification level across the motorpool is ${certified.overall}.`})
    issueTick++
    actions.push({id: actionTick, text: 'Schedule drivers training or refresher training for out of date operators'})
    actionTick++
  }
  let output =
    {
      issues: issues,
      actions: actions
    }
  return output;

}

const vicCertified = async (unit) => {
  //get appropriate flag from soldiers.tasks_jsonb
  //return percent certified by soldier and overall
  let output =
    {
      overall: 75,
      soldier: [
        {
          id: 0,
        }
      ]
    }

  return output
}

const vicModal = async (unit, verbose) => {
  let vics = await vicSnapshot(unit, 'true')
  let fullMC = vics.data.FMC
  let partialMC = vics.data.PMC
  let nonMC = vics.data.NMC
  let percent = vics.data.PERCENT
  let vicMaintdata = await vicMaint(unit)
  let issuesActions = await vicIssuesActions(percent, vicMaint.true, vicMaint.fuelLevel, unit)
  let certified = await vicCertified(unit)
  let vicOutput

  if(verbose == "true"){
    vicOutput = {
      id: 'vehicle',
      title: 'Vehicle Readiness',
      description: 'Equipment and vehicle operational status',
      percentage: percent,
      data: {
        FMC: fullMC,
        PMC: partialMC,
        NMC: nonMC,
        metrics: [
          { label: 'Operational Vehicles', value: percent},
          { label: 'Maintenance Current', value: vicMaintdata.true},
          { label: 'Fuel Readiness', value: vicMaintdata.fuelLevel},
          { label: 'Driver Certification', value: certified.overall}
        ],
        issues: issuesActions.issues,
        actions: issuesActions.actions
      }
    }
  } else {
    vicOutput = {
      id: 'vehicle',
      title: 'Vehicle Readiness',
      description: 'Equipment and vehicle operational status',
      percentage: percent,
      }
    }
  return vicOutput
}

const deploymentModal = async (unit, verbose) => {
  let percent = 75
  let deploymentOutput
  //let issuesActions = await deploymentIssuesActions(percent, vicMaint.true, vicMaint.fuelLevel, unit)
  let issuesActions = {
    issues: "seed data in utils.js",
    actions: "seed data in utils.js"
  }
  if(verbose == "true") {
    deploymentOutput = {
      id: 'deployment',
      title: 'Deployment Readiness',
      description: 'Mission deployment preparation status',
      percentage: percent,
      data: {
        metrics:
          [
            { label: 'Personnel Ready', value: '45%', status: 'critical' },
            { label: 'Equipment Staged', value: '23%', status: 'critical' },
            { label: 'Transport Available', value: '67%', status: 'medium' },
            { label: 'Mission Planning', value: '12%', status: 'critical' }
          ],
        issues: issuesActions.issues,
        actions: issuesActions.actions
      }
    }
  } else {
    deploymentOutput = {
      id: 'deployment',
      title: 'Deployment Readiness',
      description: 'Mission deployment preparation status',
      percentage: percent,
    }
  }

  return deploymentOutput
}

const crewModal = async (unit, verbose) => {
  let crewModal
  let percent = 75
  let issuesActions = {
    issues: "seed data in utils.js",
    actions: "seed data in utils.js"
  }
  if(verbose == "true"){
    crewModal = {
      id: 'crew',
      title: 'Crew Qualification',
      description: 'Combat Readiness Evaluation Assessment',
      percentage: percent,
      data: {
        metrics: [
          { label: 'Combat Ready', value: '89%', status: 'high' },
          { label: 'Team Cohesion', value: '92%', status: 'high' },
          { label: 'Equipment Proficiency', value: '85%', status: 'high' },
          { label: 'Mission Rehearsals', value: '78%', status: 'medium' }
        ],
        issues: issuesActions.issues,
        actions: issuesActions.actions
      }
    }
  } else {
    crewModal = {
      id: 'crew',
      title: 'Crew Qualification',
      description: 'Combat Readiness Evaluation Assessment',
      percentage: percent
    }
  }

  return crewModal;
}

const medModal = async (unit, verbose) => {
  let percent = 75
  let issuesActions = {
    issues: "seed data in utils.js",
    actions: "seed data in utils.js"
  }
  let medOutput
  if(verbose == "true"){
    medOutput = {
      id: 'medical',
      title: 'Medical Readiness',
      description: 'Health and medical certification status',
      percentage: percent,
      data: {
        metrics: [
          { label: 'Medical Readiness', value: '92%', status: 'high' },
          { label: 'Vaccinations Current', value: '98%', status: 'high' },
          { label: 'Physical Fitness', value: '87%', status: 'high' },
          { label: 'Medical Equipment', value: '94%', status: 'high' }
        ],
        issues: issuesActions.issues,
        actions: issuesActions.actions
      }
    }
  } else {
    medOutput = {
      id: 'medical',
      title: 'Medical Readiness',
      description: 'Health and medical certification status',
      percentage: percent
    }
  }

  return medOutput;
}

const weaponModal = async (unit, verbose) => {
  let percent = 75
  let issuesActions = {
    issues: "seed data in utils.js",
    actions: "seed data in utils.js"
  }
  let weaponOutput
  if(verbose == "true"){
    weaponOutput = {
      id: 'weapons',
      title: 'Weapons Qualification',
      description: 'Weapons training and marksmanship status',
      percentage: percent,
      data: {
        metrics: [
          { label: 'Qualified Personnel', value: '68%', status: 'medium' },
          { label: 'Range Time Current', value: '45%', status: 'low' },
          { label: 'Equipment Status', value: '82%', status: 'high' },
          { label: 'Safety Certification', value: '95%', status: 'high' }
        ],
        issues: issuesActions.issues,
        actions: issuesActions.actions
      }
    }
  } else {
    weaponOutput = {
      id: 'weapons',
      title: 'Weapons Qualification',
      description: 'Weapons training and marksmanship status',
      percentage: percent
    }
  }

  return weaponOutput;
}

const modal = async (unit, verbose, vicModalValue, deploymentModalValue, crewModalValue, medModalValue, weaponModalValue) => {
  let vicModaldata = await vicModal(unit, verbose)
  let deploymentModaldata = await deploymentModal(unit, verbose)
  let crewModaldata = await crewModal(unit, verbose)
  let medModaldata = await medModal(unit, verbose)
  let weaponModaldata = await weaponModal(unit, verbose)
  let modalData = []

  if(vicModalValue == "true"){
    modalData.push(vicModaldata)
  }
  if(deploymentModalValue == "true"){
    modalData.push(deploymentModaldata)
  }
  if(crewModalValue == "true"){
    modalData.push(crewModaldata)
  }
  if(medModalValue == "true"){
    modalData.push(medModaldata)
  }
  if(weaponModalValue == "true"){
    modalData.push(weaponModaldata)
  }
  return modalData;
}



// //selectable by type,
// let actionItems = [
//   {type: equipment,
//     data: [{
//     status: '55% of vehicles are non-operational due to maintenance issues',
//     reason: [
//       {
//         equipSn: 1234,
//         equipStatus: 'parts on order'
//       },
//       {
//         equipSn: 1234,
//         equipStatus: 'needs annual services'
//       },
//       {
//         equipSn: 1234,
//         equipStatus: 'X fault due to lighting'
//       },
//     ],
//     fix: "Implement emergency maintenance schedule for critical vehicles"
//   }
// ]
//   },
//   {type: personnel,
//     data: [{
//     status: '20% down on Rifle Qual',
//     reason: 'Last Rifle Range was 13 months ago',
//     fix: "Schedule Rifle Range"
//   }
// ]
//   },
//   {type: medical,
//     data: [{
//     status: '',
//     reason: 'Track thrown',
//     fix: "reason"
//   }
// ]
//   },
//   {type: trainingCurrent,
//     data: [{
//     status: 'NMC',
//     reason: 'Track thrown',
//     fix: "reason"
//   }
// ]
//   },
//   {type: deploymentReadiness,
//     percent: 70,
//     data: [
//       {type: training,
//         message: "8 Soldiers red on SHARP"
//       },
//       {type: equipment,
//         message: "8 tracks NMC"
//       },
//       {type: medical,
//         message: "8 Soldiers red on Dental"
//       }
//     ]
//   }
// ]


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
  vicMaint:vicMaint,
  modal:modal,
  joinTaskStatus:joinTaskStatus
}

// vicModal:vicModal,
//   deploymentModal:deploymentModal,
//   crewModal:crewModal,
//   medModal:medModal,
//   weaponModal:weaponModal

