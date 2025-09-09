// backend/index.js
const port = 3001;

const express = require('express');
const cors = require('cors');

const environment = process.env.NODE_ENV || 'development';
const knexConfig = require('./knexfile')[environment];
const knex = require('knex')(knexConfig);

const app = express();
app.use(cors());
app.use(express.json());


function calcEquipmentScore(vehicles = []) {
  const total = vehicles.length || 1;
  const fmc = vehicles.filter(v => v.status === 'FMC').length;
  return Math.round((fmc / total) * 100);
}

app.listen(port, () => {
  console.log(`Express has started on ${port} (${environment})`);
});

app.get('/', (_req, res) => {
  res.status(200).send('server is up');
});


app.get('/api/:uic', async (req, res) => {
  try {
    const unit = await knex('units')
    .where({ uic: req.params.uic }).first();
    if (!unit) return res.status(404).json({ error: 'Unit not found' });
    res.json(unit);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});


app.get('/api/equipment/:uic', async (req, res) => {
  try {
    const unit = await knex('units')
    .where({ uic: req.params.uic }).first();
    if (!unit) return res.status(404).json({ error: 'Unit not found' });


    const vehicles = await knex('vehicle')
      .where('assigned_unit_id', unit.id)
      .select('status');

    const value = calcEquipmentScore(vehicles);
    res.json({ value });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});



// app.get('/api/training/350-1', function(request, response) {
//   const trainingData = {
//     name: '350-1 Individual Training',
//     completionRate: 87,
//     totalPersonnel: 343,
//     completed: 298,
//     pending: 45,
//     overdue: 12
//   };

//   response.json({ training: trainingData });
// });


