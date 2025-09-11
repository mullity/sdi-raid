class UiCard {
    /**
   * Creates a modal istance.
   * @param {string} id - string name of the modal being supplied
   * @param {number} percent - percentage of satisfactory items, expressed as a whole number
   * @param {object} data - object of key:value pairs for other data, depending on modal type
   * @property {string} id - string name of the modal being supplied (also documented here for clarity).
   * @property {number} percent - percentage of satisfactory items, expressed as a whole number (also documented here for clarity).
   * @property {object} data - object of key:value pairs for other verbose data, depending on modal type
   */

    constructor(id, percent, data) {
        this.id = id
        this.percent = percent
        if (data) {
            this.data = data
        }
    }

}

class Snapshot extends UiCard {

}

class VehicleSnapshot extends Snapshot {

    constructor() {
        this.id="vehicle"
        this.percent=0
        this.data={}
        this.fmc = 0
        this.pmc = 0
        this.nmc = 0
        this.nmcArray = []
        this.bradleyArray = []
        this.hmmwvArray = []
        this.scissorArray = []
    }

    async init(unit) {
        this.vics = await getWithUnitId('vehicle', unit)
    }

    generateCard() {
        for (let vic of this.vics) {
            if (vic.status == 'FMC') {
                fmc++
            } else if (vic.status == 'PMC') {
                pmc++
            } else if (vic.status == 'NMC') {
                let date = vic.date_last_serviced
                nmc++
                nmcArray.push({
                    lin: vic.lin,
                    unit: vic.assigned_unit_id,
                    lastService: `${date}`.slice(4, 15)
                })
            }
        }

        for (let broke of nmcArray) {
            if (broke.lin == 'M05073') {
                bradleyArray.push(broke)
            }
            else if (broke.lin == 'M1079') {
                hmmwvArray.push(broke)
            }
            else if (broke.lin == 'B31098') {
                scissorArray.push(broke)
            }
        }

        //calculate all percents/ process data
        let T = vics.length
        let vicPercent = Number((fmc + pmc) / T) * 100
        let output

        if (verbose === "true") {
            output =
            {
                id: "Equipment", data: {
                    total: vics.length,
                    FMC: fmc,
                    PMC: pmc,
                    NMC: nmc,
                    PERCENT: vicPercent
                }
            }
        } else {
            output = {
                id: "Equipment", data: {
                    PERCENT: vicPercent
                }
            }
        }

        return output;
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
    VehicleSnapshot:VehicleSnapshot,
    UiCard: UiCard,
    Modal: Modal
}