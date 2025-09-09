require('dotenv').config()

const knex = require('knex')( require('./knexfile')[process.env.NODE_ENV])

const units = () => {
  return knex(units)

}



module.exports = {
  units: units
}