


function checkQualification(qualDate, taskId) {
    if (!(qualDate instanceof Date)) {
        qualDate = new Date(Date.parse(qualDate))
    }
    //console.log(qualDate)
    const trainingCutoff = getQualcodeExpirationCutoff(getTrainingQualCode(taskId))
    //console.log(trainingCutoff,"cutoff")
    if (qualDate <= trainingCutoff) {
        return false
    }
    else if (qualDate > trainingCutoff) {
        return true
    }
    else {
        return null
    }

}

function getQualcodeExpirationCutoff(qualCode) {
    //console.log("code",qualCode)
    const today = new Date()
    const expirationDate = new Date(
        Date.UTC(
            today.getFullYear(),
            today.getMonth(),
            today.getDate())
    )
    if (qualCode == "A")
        expirationDate.setFullYear(expirationDate.getFullYear() - 1)
    else if (qualCode == "B")
        expirationDate.setFullYear(expirationDate.getFullYear() - 2)
    else if (qualCode == "S")
        expirationDate.setMonth(expirationDate.getMonth() - 6)
    return expirationDate
}

function getTrainingQualCode(taskId) {
    const fs = require('fs');
    //PLACEHOLDER, change me
    const myData = fs.readFileSync('test_data/350-1.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return;
        }
        try {
            return data
        } catch (parseError) {
            console.error('Error parsing JSON:', parseError);
        }
    });

    const myJson = JSON.parse(myData)



    const taskFreqCodes = myJson.find((element) => element['350-1Id'] == taskId)['Frequency']['RA']
    //console.log(taskFreqCodes)
    qualCode = taskFreqCodes.find(elem => elem === "A" || elem === "B" || elem === "S")
    return qualCode
}

const today = new Date()
console.log(today)
console.log("annual", getQualcodeExpirationCutoff("A"))
console.log("biennial", getQualcodeExpirationCutoff("B"))
console.log("semiannual", getQualcodeExpirationCutoff("S"))
console.log(getTrainingQualCode(12))
console.log(checkQualification(today,12))
console.log(checkQualification("2024-10-10",12))