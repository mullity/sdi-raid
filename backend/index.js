// backend/index.js
const port = 3001;

const express = require('express');
const cors = require('cors');
const { priority, snapshot, vicSnapshot, trainingSnapshot, personnelSnapshot, medicalSnapshot } = require('./cookieUtils/utils')
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

app.get('/snapshot', async (req,res) => {
  //required query params: unit(number)
  //optional query params: verbose(true/false as string)
  let { verbose, unit } = req.query
  try {
    const got = await snapshot(unit, verbose)
    res.status(200).send(got)
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
})

app.get('/kpi', async (req, res) => {
  //required query params: unit(number)
  //optional query params: verbose(true/false as string), personnelReadinessScore(true/false as string), equipmentReadinessScore(true/false as string), trainingReadinessScore(true/false as string), medicalReadinessScore(true/false as string)
  let { verbose, unit, personnelReadinessScore, equipmentReadinessScore, trainingReadinessScore, medicalReadinessScore } = req.query
  try {
    let vicKpi = await vicSnapshot(unit, verbose)
    let trainingKpi = await trainingSnapshot(unit, verbose)
    let personnelKpi = await personnelSnapshot(unit, verbose)
    let medicalKpi = await medicalSnapshot(unit, verbose)
    let output= []
    if(equipmentReadinessScore == undefined && personnelReadinessScore == undefined && trainingReadinessScore == undefined && medicalReadinessScore == undefined){
      output.push({Error: 'Must select a KPI Score to recieve data'})
    }
    if(equipmentReadinessScore === "true"){
      output.push(vicKpi)
    }
    if (personnelReadinessScore === "true"){
      output.push(personnelKpi)
    }
    if (trainingReadinessScore=== "true"){
      output.push(trainingKpi)
    }
    if (medicalReadinessScore === "true"){
      output.push(medicalKpi)
    }

    res.status(200).send(output)
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ error: `${error}` });
  }
})
// Dashboard.jsx, passed to <KPIcard />
  // {
  //   value="87" number as a string
  //   unit="%" percent symbol as a string
  //   trend={2} number wrapped in curly
  //   status="good"
  // }
//  in data object, rewrite PERCENT key as value, add unit key with string percent sign as value, add trend (based off helper function???), if percent > 80 status = good/warning/critical

app.get('/priority', async (req,res) =>{
  //required query params: unit(number)
  //optional query params: verbose(true/false as string)
  let { verbose, unit } = req.query
  try {
    const got = await priority(unit, verbose)
    res.status(200).send(got)

  }
  catch (error) {
    console.error(error);
    res.status(500).json({ error: `${error}` });
  }
})

app.get('/leaderhub', async (req,res) => {


})




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


