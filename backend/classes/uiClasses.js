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
        this.allVics = []
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
                this.allVics.push({
                    id: vic.id,
                    bumpernumber: vic.bumper_number,
                    lin: vic.lin,
                    status: 'fmc',
                    lastService: vic.date_last_serviced.toLocaleDateString(),
                    unit: vic.assigned_unit_id,
                    name: vic.name
                })
                this.fmc++
            } else if (vic.status == 'PMC') {
                this.allVics.push({
                    id: vic.id,
                    bumpernumber: vic.bumper_number,
                    lin: vic.lin,
                    status: 'pmc',
                    lastService: vic.date_last_serviced.toLocaleDateString(),
                    unit: vic.assigned_unit_id,
                    name: vic.name
                })
                this.pmc++
            } else if (vic.status == 'NMC') {
                this.allVics.push({
                    id: vic.id,
                    bumpernumber: vic.bumper_number,
                    lin: vic.lin,
                    status: 'nmc',
                    lastService: vic.date_last_serviced.toLocaleDateString(),
                    unit: vic.assigned_unit_id,
                    name: vic.name
                })
                this.nmc++
                this.nmcArray.push({
                    id: vic.id,
                    bumpernumber: vic.bumper_number,
                    lin: vic.lin,
                    status: 'nmc',
                    lastService: vic.date_last_serviced.toLocaleDateString(),
                    unit: vic.assigned_unit_id,
                    name: vic.name
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
                    M05073: {name: 'm2a4_bradley_fighting_vehicle',
                        data: this.bradleyArray,
                    },
                    M1079: {name: 'hmmwv',
                        data: this.hmmwvArray,
                    },
                    B31098: {name: 'bride_heavy_assault_scissoring',
                        data: this.scissorArray,
                    },
                    L77147: {name: 'loader_skid_steed_type_ii',
                        data: this.loaderArray,
                    },
                    J05029: {name: 'joint_light_tactical_vehicle_a1_four_seat_gen_purpo',
                        data: this.jltvArray,
                    },
                    M1078A2: {name: 'truck_cargo',
                        data: this.truckArray,
                    },
                    A05001: {name: 'assault_breacher_vehicle',
                        data: this.breacherArray,
                    },
                    M05001: {name: 'motorized_grader',
                        data: this.grader,
                    },
                    C05105: {name: 'command_post_carrier',
                        data: this.commandArray,
                    },
                    J05028: {name: 'joint_light_tactical_vehcile_a1_two_seat_utility',
                        data: this.jltv2Array
                    },
                }

            }
            return this.generateDataResponse('percent', snapData)
        } else {
            return this.generateDataResponse()
        }
    }

}

class CrewSnapshot extends Snapshot{
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
        this.crews = await getWithUnitId('crews', this.units)
    }

    generateCard(verbose) {
        let crewsArray = []

        for(let crew of this.crews){
            crewsArray.push(crew)
            if(crew.gunnery_level < 6){
                this.nonDeployable++
            }
            else if(crew.gunnery_level = 6){
                this.deployable++
            }
        }



        if (verbose === "true") {
            let snapData = {
                total: this.crews.length,
                deployable: this.deployable,
                nondeployable: this.nonDeployable,
                data: {
                    crews: crewsArray
                }
            }
            return this.generateDataResponse('percent', snapData)
        } else {
            return this.generateDataResponse()
        }
    }
}

class IssuesActions{
    constructor(id, data){
        this.id = id
        this.data = data
    }
    generateDataResponse(id, verboseData = {}){
        const dataResponse = {
            'id': id,
            'data': verboseData
        }
        return dataResponse
    }
}

class Modal extends UiCard {

    constructor(id, percent, data, title, description) {
        super(id, percent, data);
        this.title = title
        this.description = description

    }
    generateDataResponse(id, verboseData = {}){
        const dataResponse = {
            'id': id,
            'data': verboseData
        }
        return dataResponse
    }
}

class VehicleIssuesActions extends IssuesActions{
    constructor(){
        super()
        this.issues= []
        this.actions= []
        this.issueTick = 0
        this.actionTick = 0
    }
    generateCard(percent, fuelLevel, unit, verbose){
        let snapData
        if(percent < 75){
            this.issues.push({id: this.issueTick, text: `${percent}% of vehicles are non-operational`})
            this.issueTick++
            this.actions.push({id: this.actionTick, text: 'Ensure all crew is scheduled for crew training, and all vehicles are on the maintenance schedule'})
            this.actionTick++
        }
        if(fuelLevel < 75){
            this.issues.push({id: this.issueTick, text: `Average fuel level across the motorpool is ${fuelLevel}%.`})
            this.issueTick++
            this.actions.push({id: this.actionTick, text: 'Ensure operators fill vehicles and fuelers are available for refill of on-site storage'})
            this.actionTick++
        }


        if(verbose === 'true'){
            snapData = {
                issues: this.issues,
                actions: this.actions
            }
            return this.generateDataResponse('issuesActions', snapData)
        }
        else {
            snapData = {
                issues: this.issues.length
            }
            return this.generateDataResponse('issuesActions', snapData)
        }
    }

}

class VehicleModal extends Modal{
    constructor(){
        super()
    }

    async init(unit, verbose) {
        const { vicSnapshot, selectParentsAndChildren, parentsAndChildrenToArray,vicIssuesActions,vicCertified } = require('../cookieUtils/utils.js')
        this.intermediate = await selectParentsAndChildren(unit)
        this.units = parentsAndChildrenToArray(this.intermediate)
        this.vics = await vicSnapshot(unit, 'true')
        this.issuesActions = await vicIssuesActions((Number((this.vics.data.pmc + this.vics.data.nmc)/this.vics.data.total)*100), this.vics.data.fuellevel, this.units, verbose)
        this.certified = await vicCertified(this.units)
    }



    generateCard(verbose){
        let snapData
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
                    issues: this.issuesActions.data.issues,
                    actions: this.issuesActions.data.actions
                }
            }
            return this.generateDataResponse('vehicle', snapData)
        } else {
            snapData = {
                title: 'Vehicle Readiness',
                description: 'Equipment and vehicle operational status',
                percentage: this.vics.value,
                issues: this.issuesActions.data.issues
                }
            return this.generateDataResponse('vehicle', snapData)
            }

    }
}

class PersonnelIssuesActions extends IssuesActions{
    constructor(){
        super()
        this.issues= []
        this.actions= []
        this.issueTick = 0
        this.actionTick = 0
    }
    generateCard(nondeployable, verbose){
        let snapData
        if(nondeployable > 25){
            this.issues.push({id: this.issueTick, text: `${nondeployable}% of soldiers are non-deployable`})
            this.issueTick++
            this.actions.push({id: this.actionTick, text: 'Ensure all soldiers are green on MEDPROS, have completed DD-93, SGLV, AT LVL1, and have a GTC'})
            this.actionTick++
        }

        if(verbose === 'true'){
            snapData = {
                issues: this.issues,
                actions: this.actions
            }
            return this.generateDataResponse('issuesActions', snapData)
        }
        else {
            snapData = {
                issues: this.issues.length
            }
            return this.generateDataResponse('issuesActions', snapData)
        }
    }

}

class DeploymentModal extends Modal{

    constructor(){
        super()
    }

    async init(unit, verbose) {
        const { personnelSnapshot, selectParentsAndChildren, parentsAndChildrenToArray, personnelIssuesActions ,vicCertified } = require('../cookieUtils/utils.js')
        this.units = parentsAndChildrenToArray(await selectParentsAndChildren(unit))
        this.troops = await personnelSnapshot(unit, 'true')
        this.issuesActions = await personnelIssuesActions(Number((this.troops.data.nondeployable / this.troops.data.total) * 100), verbose)
    }

    generateCard(verbose){
        let snapData
        let percent = Number((this.troops.data.deployable / this.troops.data.total) * 100)
        if(verbose == "true"){
            snapData = {
                title: 'Deployment Readiness',
                description: 'Mission deployment preparation status',
                percentage: percent,
                data: {
                    metrics:
                    [
                        { label: 'Personnel Ready', value: percent},
                        //{ label: 'Equipment Staged', value: '23%', status: 'critical' },
                        //{ label: 'Transport Available', value: '67%', status: 'medium' },
                        //{ label: 'Mission Planning', value: '12%', status: 'critical' }
                    ],
                    issues: this.issuesActions.data.issues,
                    actions: this.issuesActions.data.actions
                }
            }
            return this.generateDataResponse('deployment', snapData)
        } else {
            snapData = {
                title: 'Deployment Readiness',
                description: 'Mission deployment preparation status',
                percentage: percent,
                issues: this.issuesActions.data.issues
                }
            return this.generateDataResponse('deployment', snapData)
            }

    }

}

class CrewIssuesActions extends IssuesActions{
    constructor(){
        super()
        this.issues= []
        this.actions= []
        this.issueTick = 0
        this.actionTick = 0
    }
    generateCard(nondeployable, verbose){
        let snapData
        if(nondeployable > 25){
            this.issues.push({id: this.issueTick, text: `${nondeployable}% of crews are non-deployable`})
            this.issueTick++
            this.actions.push({id: this.actionTick, text: 'Schedule remedial or initial gunnery training'})
            this.actionTick++
        }

        if(verbose === 'true'){
            snapData = {
                issues: this.issues,
                actions: this.actions
            }
            return this.generateDataResponse('issuesActions', snapData)
        }
        else {
            snapData = {
                issues: this.issues.length
            }
            return this.generateDataResponse('issuesActions', snapData)
        }
    }
}

class CrewModal extends Modal{
    constructor(){
        super()
    }

    async init(unit, verbose) {
        const { crewSnapshot, selectParentsAndChildren, parentsAndChildrenToArray, crewIssuesActions } = require('../cookieUtils/utils.js')
        this.units = parentsAndChildrenToArray(await selectParentsAndChildren(unit))
        this.crews = await crewSnapshot(unit, 'true')
        this.issuesActions = await crewIssuesActions(Number((this.crews.data.nondeployable/this.crews.data.total)*100), verbose)
    }

    generateCard(verbose){
        let snapData
        let percent = Number((this.crews.data.deployable / this.crews.data.total) * 100)
        if(verbose == "true"){
            snapData = {
                title: 'Crew Qualification',
                description: 'Combat Readiness Evaluation Assessment',
                percentage: percent,
                data: {
                    metrics: [
                        { label: 'Combat Ready', value: '89%', status: 'high' },
                        { label: 'Team Cohesion', value: '92%', status: 'high' },
                        { label: 'Equipment Proficiency', value: '85%', status: 'high' },
                        { label: 'Mission Rehearsals', value: '78%', status: 'medium' }
                    ],
                    issues: this.issuesActions.data.issues,
                    actions: this.issuesActions.data.actions
                }
            }
            return this.generateDataResponse('crew', snapData)
        } else {
            snapData = {
                title: 'Crew Qualification',
                description: 'Combat Readiness Evaluation Assessment',
                percentage: percent,
                issues: this.issuesActions.data.issues
            }
            return this.generateDataResponse('crew', snapData)
            }
    }
}




module.exports = {
    VehicleSnapshot: VehicleSnapshot,
    TrainingSnapshot: TrainingSnapshot,
    PersonnelSnapshot: PersonnelSnapshot,
    MedicalSnapshot: MedicalSnapshot,
    CrewSnapshot:CrewSnapshot,
    UiCard: UiCard,
    Modal: Modal,
    VehicleModal:VehicleModal,
    DeploymentModal:DeploymentModal,
    CrewModal:CrewModal,
    VehicleIssuesActions:VehicleIssuesActions,
    PersonnelIssuesActions:PersonnelIssuesActions,
    CrewIssuesActions:CrewIssuesActions
}