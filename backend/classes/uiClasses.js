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
        const { joinTaskStatus } = require('../cookieUtils/utils.js')
        this.joined = await joinTaskStatus()
        this.unit = unit
    }

    generateCard(verbose) {
        for (let join of this.joined) {
            if (join.assigned_unit_id == Number(this.unit)) {
                this.tasks.push(join)
            }
        }

        for (let task of this.tasks) {
            if (task.status == "qualified") {
                this.qualified++
            } else if (task.status == "not_qualified") {
                this.notQualified++
            }
        }

        let tasksT = this.tasks.length
        this.value = Number(this.qualified / tasksT) * 100
        let output

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
        const { getWithUnitId } = require('../cookieUtils/utils.js')
        this.troops = await getWithUnitId('soldiers', unit)
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
        const { getWithUnitId } = require('../cookieUtils/utils.js')
        this.troops = await getWithUnitId('soldiers', unit)
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
        this.nmcArray = []
        this.bradleyArray = []
        this.hmmwvArray = []
        this.scissorArray = []
    }

    async init(unit) {
        const { getWithUnitId } = require('../cookieUtils/utils.js')
        this.vics = await getWithUnitId('vehicle', unit)
    }

    generateCard(verbose) {
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
        }

        //calculate all percents/ process data
        let T = this.vics.length
        this.value = Number((this.fmc + this.pmc) / T) * 100

        if (verbose === "true") {
            let snapData = {
                total: this.vics.length,
                fmc: this.fmc,
                pmc: this.pmc,
                nmc: this.nmc,
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
}




module.exports = {
    VehicleSnapshot: VehicleSnapshot,
    TrainingSnapshot: TrainingSnapshot,
    PersonnelSnapshot: PersonnelSnapshot,
    MedicalSnapshot: MedicalSnapshot,
    UiCard: UiCard,
    Modal: Modal
}