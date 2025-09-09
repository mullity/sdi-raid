/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
  let data = []
  let idNum = 0

  data.push({id: idNum, status: 'GO'})
  idNum++

  data.push({id: idNum, status: 'NO-GO'})
  idNum++

  data.push({id: idNum, status: 'FMC'})
  idNum++

  data.push({id: idNum, status: 'PMC'})
  idNum++

  data.push({id: idNum, status: 'NMC'})
  idNum++

  data.push({id: idNum, status: 'Green'})
  idNum++

  data.push({id: idNum, status: 'Amber'})
  idNum++

  data.push({id: idNum, status: 'Red'})
  idNum++


exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('status').del()
  await knex('status').insert(data);
};
