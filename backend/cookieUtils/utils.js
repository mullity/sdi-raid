const {
  WeaponModal,
  MedicalModal,
  MedicalIssuesActions,
  CrewModal,
  CrewIssuesActions,
  CrewSnapshot,
  VehicleSnapshot,
  TrainingSnapshot,
  PersonnelSnapshot,
  MedicalSnapshot,
  VehicleModal,
  DeploymentModal,
  VehicleIssuesActions,
  PersonnelIssuesActions,
} = require("../classes/uiClasses");
const bcrypt = require("bcrypt");
const { TrainingEvent } = require("../classes/taskClass.js");
require("dotenv").config();

const saltRounds = 10;

const knex = require("knex")(require("../knexfile")[process.env.NODE_ENV]);

const selectParentsAndChildren = (uicVar) => {
  if (typeof uicVar === "number" || !isNaN(uicVar)) {
    let numericUic = Number.parseInt(uicVar);
    return knex("units")
      .select("uic")
      .from("units")
      .where("id", numericUic)
      .then((res) => {
        return knex("units")
          .select()
          .from("units")
          .whereLike("uic", res[0].uic)
          .orWhereLike("parent_unit_uic", res[0].uic);
      });
  } else if (typeof uicVar === "string") {
    return knex("units")
      .select()
      .from("units")
      .whereLike("uic", uicVar)
      .orWhereLike("parent_unit_uic", uicVar)
      .then((res) => {
        return res;
      });
  }
};

const getByUIC = (uic) => {
  return knex("units")
    .select("id")
    .where("uic", uic)
    .then((res) => {
      return res;
    });
};

const postToTable = async (table, input) => {
  if (table == "users") {
    let { email, password, unit_id, username, role_id } = input;
    let roleId = await getByRole(role_id);
    let unitId = await getByUIC(unit_id);
    try {
      //Filterinputs to only matching
      const columns = await getAllFields(table);
      const required = columns.filter((col) => col !== "id");

      const getId = await getter(table);

      const inputKeys = Object.keys(input);

      if (!required.every((key) => inputKeys.includes(key))) {
        return "All fields have not been entered";
      }
      if (inputKeys.length > required.length) {
        return "Too many fields have been entered";
      }

      input["id"] = getId.length;

      const inserted = await knex(table)
        .insert({
          id: getId.length + 1,
          email: email,
          password: await bcrypt.hash(password, saltRounds),
          unit_id: Number(unitId[0].id),
          username: username,
          role_id: Number(roleId[0].id),
        })
        .returning("*");
      return inserted;
    } catch (error) {
      console.error(error);
      return error;
    }
  } else {
    try {
      const columns = await getAllFields(table);
      const required = columns.filter((col) => col !== "id");

      const getId = await getter(table);

      const inputKeys = Object.keys(input);

      if (!required.every((key) => inputKeys.includes(key))) {
        return "All fields have not been entered";
      }
      if (inputKeys.length > required.length) {
        return "Too many fields have been entered";
      }

      input["id"] = getId.length;

      const inserted = await knex(table).insert(input).returning("*");
      return inserted;
    } catch (error) {
      console.error(error);
      return error;
    }
  }
};

const destructureUsers = (request) => {
  const reqArray = Object.keys(request);
  return reqArray;
};

const getByRole = (input) => {
  if (typeof input === "number" || !isNaN(input)) {
    let numericId = Number.parseInt(input);
    return knex("roles").select("id").from("roles").where("id", numericId);
  } else if (typeof input === "string") {
    return knex("roles").select("id").from("roles").where("name", input);
  }
};

const parentsAndChildrenToArray = (unitArray) => {
  return unitArray.map((unit) => unit.id);
};

/**
 *
 * @param {Array} vehicles Array of vehicles
 * @returns {number} percentage of FMC vehicles as a whole number
 */
function calcEquipmentScore(vehicles) {
  const total = vehicles.length;
  const fmc = vehicles.filter((vehicle) => vehicle.status === "FMC").length;
  return Math.round((fmc / total) * 100);
}

const checkUnitId = async (table, unit) => {
  let data = await getWithUnitId(table, unit);

  if (data.length !== 0) {
    return true;
  } else {
    return false;
  }
};

function getter(table) {
  return knex(table).select().from(table);
}

/**
 *
 * @param {string} table table name to check for entities with an assigned_unit_id
 * @param {number} unitId id to check for matches
 * @returns array of all columns for any matching entity
 */
function getWithUnitId(table, unitId) {
  let arrayId;
  if (Array.isArray(unitId) === false) {
    arrayId = selectParentsAndChildren(unitId);
  } else {
    arrayId = unitId;
  }
  return knex(table).select().from(table).whereIn("assigned_unit_id", unitId);
}

/**
 *
 * @returns array of all task statuses joined with their respective soldiers
 */
//(SELECT * FROM soldier_task_status s INNER JOIN soldiers ON s.soldier_id = soldiers.id;)
function joinTaskStatus(unitId) {
  let arrayId;
  if (Array.isArray(unitId) === false) {
    arrayId = selectParentsAndChildren(unitId);
  } else {
    arrayId = unitId;
  }

  return knex("soldier_task_status")
    .innerJoin("soldiers", "soldier_task_status.soldier_id", "soldiers.id")
    .select()
    .whereIn("assigned_unit_id", unitId);
}

/**
 *
 * @param {number} unit unitId
 * @param {string} verbose indicates if extra data (total, functionality numbers) is returned in the response
 * @returns promise that resolves into a JSON object containing values
 */
const vicSnapshot = async (unit, verbose) => {
  let myNewSnap = new VehicleSnapshot();
  return myNewSnap.init(unit).then(() => myNewSnap.generateCard(verbose));
};

/**
 *
 * @param {string} unitString unitId in string form, is converted to Number
 * @param {string} verbose indicates if extra data (total, qualified numbers) is returned in the response
 * @returns promise that resolves into a JSON object containing values
 */
const trainingSnapshot = async (unit, verbose) => {
  let myNewSnap = new TrainingSnapshot();
  return myNewSnap.init(unit).then(() => myNewSnap.generateCard(verbose));
};

/**
 *
 * @param {number} unit unitId
 * @param {string} verbose indicates if extra data (total, deployability numbers) is returned in the response
 * @returns promise that resolves into a JSON object containing values
 */
const personnelSnapshot = async (unit, verbose) => {
  let myNewSnap = new PersonnelSnapshot();
  return myNewSnap.init(unit).then(() => myNewSnap.generateCard(verbose));
};

/**
 *
 * @param {number} unit unitId
 * @param {string} verbose indicates if extra data (total, medical status numbers) is returned in the response
 * @returns promise that resolves into a JSON object containing values
 */
const medicalSnapshot = async (unit, verbose) => {
  let myNewSnap = new MedicalSnapshot();
  return myNewSnap.init(unit).then(() => myNewSnap.generateCard(verbose));
};

const crewSnapshot = async (unit, verbose) => {
  let myNewSnap = new CrewSnapshot();
  return myNewSnap.init(unit).then(() => myNewSnap.generateCard(verbose));
};

/**
 *
 * @param {number} unit unitId
 * @param {string} verbose NOT USED - indicates if extra data is returned in the response
 * @returns {Promise} promise that resolves into a JSON Array containing values
 */
const snapshot = async (unit, verbose) => {
  let vics = await vicSnapshot(unit, "true");
  let troops = await personnelSnapshot(unit, "true");
  let tasks = await trainingSnapshot(unit, "true");
  let meds = await medicalSnapshot(unit, "true");

  let output = [vics, troops, tasks, meds];

  return output;
};

/**
 * Gets snapshots and returns values in ascending order (worst category first)
 * @param {number} unit unitId
 * @param {string} verbose indicates if extra data is returned in the response from various snapshots
 * @returns {Promise} promise that resolves into a JSON Array containing values
 */
const priority = async (unit, verbose) => {
  let safetyNet = await snapshot(unit, verbose);
  let data = JSON.parse(JSON.stringify(safetyNet.slice()));
  data.sort((a, b) => a.value - b.value);

  return data;
};

/**
 * PLACEHOLDER - get maintenance_currancy from vehicle by unit
 * @param {number} unit unitId
 * @param {string} verbose indicates if extra data is returned in the response from various snapshots
 * @returns % of vehicles w/lin true && % of vehicles w/lin false && average fuel percentage
 */
const vicMaint = async (unit) => {
  let myNewSnap = new VehicleSnapshot();
  return myNewSnap.init(unit).then(() => myNewSnap.generateCard("verbose"));

  // let output = {
  //     true: 75,
  //     trueData: [
  //       {
  //         id: 1,
  //         assigned_unit_id: 0,
  //         lin: 'C05105'
  //       },
  //       {
  //         id: 1,
  //         assigned_unit_id: 0,
  //         lin: 'C05105'
  //       },
  //       {
  //         id: 1,
  //         assigned_unit_id: 0,
  //         lin: 'C05105'
  //       }
  //     ],
  //     false: 25,
  //     falseData: [
  //       {
  //         id: 11,
  //         assigned_unit_id: 1,
  //         lin: 'X05105'
  //       }
  //     ],
  //     fuelLevel: 75
  //   }

  // return output;
};

/**
 * TODO - PLACEHOLDER - get maintenance_currancy from vehicle by unit
 * @param {number} unit unitId
 * @param {string} verbose indicates if extra data is returned in the response from various snapshots
 * @returns % of vehicles w/lin true && % of vehicles w/lin false && average fuel percentage
 */
const vicIssuesActions = async (percent, fuelLevel, unit, verbose) => {
  let myNewSnap = new VehicleIssuesActions(percent, fuelLevel, unit, verbose);
  return myNewSnap.generateCard(percent, fuelLevel, unit, verbose);
};

const vicCertified = async (unit) => {
  //get appropriate flag from soldiers.tasks_jsonb
  //return percent certified by soldier and overall
  let output = {
    overall: 75,
    soldier: [
      {
        id: 0,
      },
    ],
  };

  return output;
};

const vicModal = async (unit, verbose) => {
  let myNewSnap = new VehicleModal();
  return myNewSnap
    .init(unit, verbose)
    .then(() => myNewSnap.generateCard(verbose));
};

const personnelIssuesActions = async (nondeployable, verbose) => {
  let myNewSnap = new PersonnelIssuesActions(nondeployable, verbose);
  return myNewSnap.generateCard(nondeployable, verbose);
};

const crewIssuesActions = async (nondeployable, verbose) => {
  let myNewSnap = new CrewIssuesActions(nondeployable, verbose);
  return myNewSnap.generateCard(nondeployable, verbose);
};

const medicalIssuesActions = async (nondeployable, verbose) => {
  let myNewSnap = new MedicalIssuesActions(nondeployable, verbose);
  return myNewSnap.generateCard(nondeployable, verbose);
};

const deploymentModal = async (unit, verbose) => {
  let myNewSnap = new DeploymentModal();
  return myNewSnap
    .init(unit, verbose)
    .then(() => myNewSnap.generateCard(verbose));
};

const crewModal = async (unit, verbose) => {
  let myNewSnap = new CrewModal();
  return myNewSnap
    .init(unit, verbose)
    .then(() => myNewSnap.generateCard(verbose));
};

const medModal = async (unit, verbose) => {
  let myNewSnap = new MedicalModal();
  return myNewSnap
    .init(unit, verbose)
    .then(() => myNewSnap.generateCard(verbose));
};

const weaponModal = async (unit, verbose) => {
  let myNewSnap = new WeaponModal();
  return myNewSnap
    .init(unit, verbose)
    .then(() => myNewSnap.generateCard(verbose));
};

const modal = async (
  unit,
  verbose,
  vicModalValue,
  deploymentModalValue,
  crewModalValue,
  medModalValue,
  weaponModalValue
) => {
  let vicModaldata;
  let deploymentModaldata;
  let crewModaldata;
  let medModaldata;
  let weaponModaldata;
  let modalData = [];

  if (vicModalValue == "true") {
    vicModaldata = await vicModal(unit, verbose);
    modalData.push(vicModaldata);
  }
  if (deploymentModalValue == "true") {
    deploymentModaldata = await deploymentModal(unit, verbose);
    modalData.push(deploymentModaldata);
  }
  if (crewModalValue == "true") {
    crewModaldata = await crewModal(unit, verbose);
    modalData.push(crewModaldata);
  }
  if (medModalValue == "true") {
    medModaldata = await medModal(unit, verbose);
    modalData.push(medModaldata);
  }
  if (weaponModalValue == "true") {
    weaponModaldata = await weaponModal(unit, verbose);
    modalData.push(weaponModaldata);
  }
  return modalData;
};

const formParser = (form, ammoRollup, vehicleRollup) => {
  let output = [];
  let ammo;
  let vehicle;

  if (ammoRollup === "true") {
    ammo = new TrainingEvent(form).getAmmoRollup();
    output.push({ ammunition: ammo });
  }
  if (vehicleRollup === "true") {
    ammo = new TrainingEvent(form).getAmmoRollup();
    output.push({ vehicles: ammo });
  }

  return output;
};

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
async function getAllFields(table) {
  const columns = await knex("information_schema.columns")
    .select("column_name")
    .where({ table_name: table, table_schema: "public" });
  return columns.map((col) => col.column_name);
}

module.exports = {
  calcEquipmentScore: calcEquipmentScore,
  getter: getter,
  snapshot: snapshot,
  vicSnapshot: vicSnapshot,
  getWithUnitId: getWithUnitId,
  trainingSnapshot: trainingSnapshot,
  personnelSnapshot: personnelSnapshot,
  medicalSnapshot: medicalSnapshot,
  crewSnapshot: crewSnapshot,
  priority: priority,
  getAllFields: getAllFields,
  vicMaint: vicMaint,
  modal: modal,
  joinTaskStatus: joinTaskStatus,
  checkUnitId: checkUnitId,
  selectParentsAndChildren: selectParentsAndChildren,
  parentsAndChildrenToArray: parentsAndChildrenToArray,
  vicIssuesActions: vicIssuesActions,
  personnelIssuesActions: personnelIssuesActions,
  crewIssuesActions: crewIssuesActions,
  medicalIssuesActions: medicalIssuesActions,
  vicCertified: vicCertified,
  formParser: formParser,
  getByRole: getByRole,
  postToTable: postToTable,
};

// vicModal:vicModal,
//   deploymentModal:deploymentModal,
//   crewModal:crewModal,
//   medModal:medModal,
//   weaponModal:weaponModal
