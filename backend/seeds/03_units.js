/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

  let unitNum = Math.floor(Math.random() * (300 - 1 + 1)) + 1
  let nameNum = Math.floor(Math.random() * 5)

let nameType = [
  {name: 'Engineer Co'},
  {name: 'Signal Co'},
  {name: 'Infantry Co'},
  {name: 'Military Intelligence Co'},
  {name: 'Forward Support Co'}
]
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('table_name').del()
  await knex('table_name').insert([
    {id: 1, colName: 'rowValue1'},
    {id: 2, colName: 'rowValue2'},
    {id: 3, colName: 'rowValue3'}
  ]);
};
