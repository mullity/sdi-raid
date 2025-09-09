const port = 3001;

const express = require('express')
const cors = require('cors')
const environment = process.env.NODE_ENV || 'development';
const knexConfig = require('./knexfile')[environment];
const knex = require('knex')(knexConfig);
const app = express()


app.use(cors())
app.use(express.json())

app.listen(port, () => `Express has started on ${port}`)

// app.get('/api/health', function(request, response) {
//   response.json({ 
//     status: 'OK', 
//     message: 'Server is working!'
//   });
// });

app.get('/', function (request, response) {
    response.status(200).send('server is up');
})

app.get('/api/:uic', function(request, response) {
  const {uic} = request.params;
  knex('units')
  .select('*')
  .where('uic', uic)
  .then(unit => response.status(200).json(unit))

  
//   response.json({ units: unit });ap
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


