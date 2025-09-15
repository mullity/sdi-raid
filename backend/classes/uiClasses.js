class UiCard {
    /**
   * Creates a modal istance.
   * @param {string} id - string name of the modal being supplied
   * @param {number} value - percentage of satisfactory items, expressed as a whole number
   * @param {object} data - object of key:value pairs for other data, depending on modal type
   * @property {string} id - string name of the modal being supplied (also documented here for clarity).
   * @property {number} value - percentage of satisfactory items, expressed as a whole number (also documented here for clarity).
   * @property {object} data - object of key:value pairs for other verbose data, depending on modal type
   */

    constructor(id, value, data) {
        this.id = id
        this.value = value
        if (data) {
            this.data = data
        }
    }


}

class Snapshot extends UiCard {
    constructor() {
        super()
    }

    generateDataResponse(valueType = 'percent', verboseData = {}) {
        const dataResponse = {
            'id': this.id,
            'value': this.value,
            'valueType': valueType,
            'data': verboseData
        }
        return dataResponse
    }
    async checkAuthorizedUnit(unit){
        //if user is authorized to view unit data && unit id exists
        //return true
        // else
        //return false
        return true;
    }
}

class TrainingSnapshot extends Snapshot {

    constructor() {
        super()
        this.id = "training"
        this.value = 0
        this.data = {}
        this.qualified = 0
        this.notQualified = 0
        this.tasks = []
        this.joined = []
    }

    async init(unit) {
        const { selectParentsAndChildren, parentsAndChildrenToArray, joinTaskStatus } = require('../cookieUtils/utils.js')
        this.units = parentsAndChildrenToArray(await selectParentsAndChildren(unit))
        this.tasks = await joinTaskStatus(this.units)
    }

    generateCard(verbose) {
        for (let task of this.tasks) {
            if (task.status == "qualified") {
                this.qualified++
            } else if (task.status == "not_qualified") {
                this.notQualified++
            }
        }

        let tasksT = this.tasks.length
        this.value = Number(this.qualified / tasksT) * 100

        if (verbose === "true") {
            let snapData = {
                total: this.tasks.length,
                qualified: this.qualified,
                notqualified: this.notQualified
            }
            return this.generateDataResponse('percent', snapData)
        } else {
            return this.generateDataResponse()
        }
    }

}

class MedicalSnapshot extends Snapshot {

    constructor() {
        super()
        this.id = "medical"
        this.value = 0
        this.data = {}
        this.green = 0
        this.red = 0
        this.amber = 0
        this.troops = []

    }

    async init(unit) {
        const { getWithUnitId, selectParentsAndChildren, parentsAndChildrenToArray } = require('../cookieUtils/utils.js')
        this.units = parentsAndChildrenToArray(await selectParentsAndChildren(unit))

        this.troops = await getWithUnitId('soldiers', this.units)


    }

    generateCard(verbose) {
        for (let troop of this.troops) {
            if (troop.medical_status == "5") {
                this.green++
            }
            if (troop.medical_status == "6") {
                this.amber++
            }
            if (troop.medical_status == "7") {
                this.red++
            }
        }

        let troopT = this.troops.length
        this.value = Number(this.green / troopT) * 100

        if (verbose === "true") {
            let snapData = {
                total: this.troops.length,
                green: this.green,
                amber: this.amber,
                red: this.red
            }
            return this.generateDataResponse('percent', snapData)
        } else {
            return this.generateDataResponse()
        }
    }
}

class PersonnelSnapshot extends Snapshot {

    constructor() {
        super()
        this.id = "personnel"
        this.value = 0
        this.data = {}
        this.deployable = 0
        this.nonDeployable = 0
        this.troops = []

    }

    async init(unit) {
        const { getWithUnitId, selectParentsAndChildren, parentsAndChildrenToArray } = require('../cookieUtils/utils.js')
        this.units = parentsAndChildrenToArray(await selectParentsAndChildren(unit))
        this.troops = await getWithUnitId('soldiers', this.units)
    }

    generateCard(verbose) {
        for (let troop of this.troops) {
            if (troop.deployable_status == "5" || troop.deployable_status == "6") {
                this.deployable++
            } else if (troop.deployable_status == "7") {
                this.nonDeployable++
            }
        }

        let troopT = this.troops.length
        this.value = Number(this.deployable / troopT) * 100

        if (verbose === "true") {
            let snapData = {
                total: this.troops.length,
                deployable: this.deployable,
                nondeployable: this.nonDeployable
            }
            return this.generateDataResponse('percent', snapData)
        } else {
            return this.generateDataResponse()
        }
    }
}

class VehicleSnapshot extends Snapshot {

    constructor() {
        super()
        this.id = "vehicle"
        this.value = 0
        this.data = {}
        this.fmc = 0
        this.pmc = 0
        this.nmc = 0
        this.fuelLevel = 0
        this.nmcArray = []
        this.bradleyArray = []
        this.hmmwvArray = []
        this.scissorArray = []
        this.loaderArray = []
        this.jltvArray = []
        this.truckArray = []
        this.breacherArray = []
        this.grader = []
        this.commandArray = []
        this.jltv2Array = []
    }

    async init(unit) {
        //const { getWithUnitId, checkUnitId } = require('../cookieUtils/utils.js')
        const { getWithUnitId, selectParentsAndChildren, parentsAndChildrenToArray } = require('../cookieUtils/utils.js')
        this.units = parentsAndChildrenToArray(await selectParentsAndChildren(unit))
        this.vics = await getWithUnitId('vehicle', this.units)
        // return checkUnitId('vehicle', unit).then(out => {
        //     if(out){
        //         return this.checkAuthorizedUnit(unit).then(res => {
        //             if(res){
        //                 return getWithUnitId('vehicle', unit).then(data => {
        //                     this.vics = data
        //                 })
        //             }
        //         })
        //     }
        //     else {
        //         this.vics = null
        //         return false
        //     }
        // })
    }



    generateCard(verbose) {
        if(this.vics === null){
            return false
        }
        for (let vic of this.vics) {
            if (vic.status == 'FMC') {
                this.fmc++
            } else if (vic.status == 'PMC') {
                this.pmc++
            } else if (vic.status == 'NMC') {
                let date = vic.date_last_serviced
                this.nmc++
                this.nmcArray.push({
                    lin: vic.lin,
                    unit: vic.assigned_unit_id,
                    lastService: `${date}`.slice(4, 15)
                })
            }
        }

        for (let broke of this.nmcArray) {
            if (broke.lin == 'M05073') {
                this.bradleyArray.push(broke)
            }
            else if (broke.lin == 'M1079') {
                this.hmmwvArray.push(broke)
            }
            else if (broke.lin == 'B31098') {
                this.scissorArray.push(broke)
            }
            else if (broke.lin == 'L77147') {
                this.loaderArray.push(broke)
            }
            else if (broke.lin == 'J05029') {
                this.jltvArray.push(broke)
            }
            else if (broke.lin == 'M1078A2') {
                this.truckArray.push(broke)
            }
            else if (broke.lin == 'A05001') {
                this.breacherArray.push(broke)
            }
            else if (broke.lin == 'M05001') {
                this.grader.push(broke)
            }
            else if (broke.lin == 'C05105') {
                this.commandArray.push(broke)
            }
            else if (broke.lin == 'J05028') {
                this.jltv2Array.push(broke)
            }
        }

        for(let i = 0; i < this.vics.length; i++){
            this.fuelLevel += this.vics[i].fuel_level
        }

        //calculate all percents/ process data
        let T = this.vics.length
        this.value = Number((this.fmc + this.pmc) / T) * 100
        this.fuelLevel = Math.round(this.fuelLevel/T)





        if (verbose === "true") {
            let snapData = {
                total: this.vics.length,
                fmc: this.fmc,
                pmc: this.pmc,
                nmc: this.nmc,
                fuellevel: this.fuelLevel,
                nmcVics: {
                    m2a4_bradley_fighting_vehicle: this.bradleyArray,
                    hmmwv: this.hmmwvArray,
                    bride_heavy_assault_scissoring: this.scissorArray,
                    loader_skid_steed_type_ii: this.loaderArray,
                    joint_light_tactical_vehcile_a1_four_seat_gen_purpo: this.jltvArray,
                    truck_cargo: this.truckArray,
                    assault_breacher_vehicle: this.breacherArray,
                    motorized_grader: this.grader,
                    command_post_carrier: this.commandArray,
                    joint_light_tactical_vehcile_a1_two_seat_utility: this.jltv2Array
                }

            }
            return this.generateDataResponse('percent', snapData)
        } else {
            return this.generateDataResponse()
        }
    }

}

class Modal extends UiCard {

    constructor(id, percent, data, title, description) {
        super(id, percent, data);
        this.title = title
        this.description = description

    }
    generateDataResponce(id, verboseData = {}){
        const dataResponse = {
            'id': id,
            'data': verboseData
        }
        return dataResponse
    }
}

class VehicleModal extends Modal{
    constructor(){
        super()
    }

    async init(unit) {
        const { vicSnapshot, selectParentsAndChildren, parentsAndChildrenToArray,vicIssuesActions,vicCertified } = require('../cookieUtils/utils.js')
        this.units = parentsAndChildrenToArray(await selectParentsAndChildren(unit))
        this.vics = await vicSnapshot(this.units, 'true')
        this.issuesActions = await vicIssuesActions(Number(this.vics.data.pmc + this.vics.data.nmc), 75, this.vics.data.fuelLevel, this.units)
        this.certified = await vicCertified(this.units)
    }

    generateCard(verbose){
        let snapData
        console.log(this.issuesActions)
        if(verbose == "true"){
            snapData = {
                title: 'Vehicle Readiness',
                description: 'Equipment and vehicle operational status',
                percentage: this.vics.value,
                data: {
                    fmc: this.vics.data.fmc,
                    pmc: this.vics.data.pmc,
                    nmc: this.vics.data.nmc,
                    metrics: [
                    { label: 'Operational Vehicles', value: this.vics.value},
                    //{ label: 'Maintenance Current', value: vicMaintdata.true},
                    { label: 'Fuel Readiness', value: this.vics.data.fuellevel},
                    //{ label: 'Driver Certification', value: certified.overall}
                    ],
                    issues: this.issuesActions.issues,
                    actions: this.issuesActions.actions
                }
            }
            return this.generateDataResponce('vehicle', snapData)
        } else {
            snapData = {
                title: 'Vehicle Readiness',
                description: 'Equipment and vehicle operational status',
                percentage: this.vics.value,
                }
            return this.generateDataResponce('vehicle', snapData)
            }

    }
}


// [
//     {
//         "id": "vehicle",
//         "value": 70,
//         "valueType": "percent",
//         "data": snapData = {
//                 total: this.vics.length,
//                 fmc: this.fmc,
//                 pmc: this.pmc,
//                 nmc: this.nmc,
//                 fuellevel: this.fuelLevel,
//                 nmcVics: {
//                     m2a4_bradley_fighting_vehicle: this.bradleyArray,
//                     hmmwv: this.hmmwvArray,
//                     bride_heavy_assault_scissoring: this.scissorArray,
//                     loader_skid_steed_type_ii: this.loaderArray,
//                     joint_light_tactical_vehcile_a1_four_seat_gen_purpo: this.jltvArray,
//                     truck_cargo: this.truckArray,
//                     assault_breacher_vehicle: this.breacherArray,
//                     motorized_grader: this.grader,
//                     command_post_carrier: this.commandArray,
//                     joint_light_tactical_vehcile_a1_two_seat_utility: this.jltv2Array
//                 }

//         }
//     }
// ]




module.exports = {
    VehicleSnapshot: VehicleSnapshot,
    TrainingSnapshot: TrainingSnapshot,
    PersonnelSnapshot: PersonnelSnapshot,
    MedicalSnapshot: MedicalSnapshot,
    UiCard: UiCard,
    Modal: Modal,
    VehicleModal:VehicleModal
}