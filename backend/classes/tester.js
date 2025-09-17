const fs = require('fs');
const {TaskEvent, TrainingEvent, CollectiveTask, TaskSet}=require('./taskClass.js')
let data = JSON.parse(fs.readFileSync('../testdata/bradQualEvent.json','utf-8'))
let myNewEvent = new TaskEvent(data)
let myNewEvent2 = new TaskEvent(data)


let myTrainingEvent = new TrainingEvent({
    'name':'Gunnery Test',
    'date':new Date(Date.now()),
    'taskEvents':[myNewEvent,myNewEvent2]
})

let myColTask = new CollectiveTask({"id":'17-CW-5969'})
//myColTask.init().then(()=>console.log(myColTask['conditionAndStandard']))

let myTaskSet = new TaskSet()
myTaskSet.addCollectiveTask('17-CW-5969').then(()=>myTaskSet.getTaskReferences().then(ref=>console.log(ref)))
myTaskSet.addCollectiveTask('17-CW-5424').then(()=>console.log(myTaskSet.getTaskUrls()))