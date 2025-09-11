// backend/index.js
const port = 3001;

const express = require('express');
const cors = require('cors');
const { modal, priority, snapshot, vicSnapshot, trainingSnapshot, personnelSnapshot, medicalSnapshot } = require('./cookieUtils/utils')
const environment = process.env.NODE_ENV || 'development';
const knexConfig = require('./knexfile')[environment];
const knex = require('knex')(knexConfig);

const app = express();
app.use(cors());
app.use(express.json());


app.post("/api/:table", async (req, res) => {
    const table = req.params.table;
    const input = req.body;

    try {
    const columns = await getAllFields(table);
    const required = columns.filter(col => col !== 'id');
console.log(JSON.stringify(required ))  

    const inputKeys = Object.keys(input);
    console.log(JSON.stringify(inputKeys));
    
    if (!required.every(key => inputKeys.includes(key))) {  
      return res.status(400).json({error: "All fields have not been entered"})
    }

    const inserted = await knex(table).insert(input).returning('*');
    res.status(201).json(inserted[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }

})

app.patch('/api/soldiers/:id', async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  console.log(req.body);

  try{
      const updated = await knex ('soldiers')
        .where('id', id)
        .update(updateData)
        .returning('*');
      res.json(updated[0]);
  }catch (err) {
    res.status(500).send({ error: err.message })
  }
});

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

app.get('/modal', async (req,res) => {
  //required query params: unit(number)
  //optional query params: verbose(true/false as string), vicModalValue(true/false as string), deploymentModalValue(true/false as string), crewModalValue(true/false as string), medModalValue(true/false as string), weaponModalValue(true/false as string)
  let { verbose, unit, vicModalValue, deploymentModalValue, crewModalValue, medModalValue, weaponModalValue } = req.query
  try {
    const got = await modal(unit, verbose, vicModalValue, deploymentModalValue, crewModalValue, medModalValue, weaponModalValue)
    res.status(200).send(got)

  }
  catch (error) {
    console.error(error);
    res.status(500).json({ error: `${error}` });
  }

  // let vicModal = await vicModal(unit, verbose)
  // let deploymentModal = await deploymentModal(unit, verbose)
  // let crewModal = await crewModal(unit, verbose)
  // let medModal = await medModal(unit, verbose)
  // let weaponModal = await weaponModal(unit, verbose)

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


