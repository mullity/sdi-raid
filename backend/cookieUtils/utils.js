require('dotenv').config()

const knex = require('knex')( require('./knexfile')[process.env.NODE_ENV])

const units = () => {
  return knex(units)

}

function calcEquipmentScore(vehicles) {
  const total = vehicles.length;
  const fmc = vehicles.filter(vehicle => vehicle.status === 'FMC').length;
  return Math.round((fmc / total) * 100);
}




module.exports = {
  units: units,
  calcEquipmentScore: calcEquipmentScore
}

