const fs = require('fs');
const {TaskEvent, TrainingEvent}=require('./taskClass.js')
let data = JSON.parse(fs.readFileSync('../testdata/bradQualEvent.json','utf-8'))
let myNewEvent = new TaskEvent(data)
let myNewEvent2 = new TaskEvent(data)
console.log(myNewEvent['elements'])

let myTrainingEvent = new TrainingEvent({
    'name':'Gunnery Test',
    'date':new Date(Date.now()),
    'taskEvents':[myNewEvent,myNewEvent2]
})

console.log(myTrainingEvent.taskEvents)
console.log(myTrainingEvent.getAmmoRollup())

console.log(JSON.stringify(myTrainingEvent.getAmmoRollup()))