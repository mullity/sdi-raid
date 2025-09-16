const fs = require('fs');
const {Event}=require('./taskClass.js')
let data = JSON.parse(fs.readFileSync('../testdata/bradQualEvent.json','utf-8'))
let myNewEvent = new Event(data)
console.log(myNewEvent['elements'])
