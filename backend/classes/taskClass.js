class CatsRollup {
    /**
   * Creates a modal istance.
   * @param {string} id - string name of the modal being supplied
   * @param {number} value - percentage of satisfactory items, expressed as a whole number
   * @param {object} data - object of key:value pairs for other data, depending on modal type
   * @property {string} id - string name of the modal being supplied (also documented here for clarity).
   * @property {number} value - percentage of satisfactory items, expressed as a whole number (also documented here for clarity).
   * @property {object} data - object of key:value pairs for other verbose data, depending on modal type
   */

    constructor(id, name, data) {
        this.id = id
        this.name = value
        if (data) {
            this.data = data
        }
    }


}


class TaskSet {
    /**
   * Creates a modal istance.
   * @param {string} id - string name of the modal being supplied
   * @param {number} value - percentage of satisfactory items, expressed as a whole number
   * @param {object} data - object of key:value pairs for other data, depending on modal type
   * @property {string} id - string name of the modal being supplied (also documented here for clarity).
   * @property {number} value - percentage of satisfactory items, expressed as a whole number (also documented here for clarity).
   * @property {object} data - object of key:value pairs for other verbose data, depending on modal type
   */

    constructor(id, name, data) {
        this.id = id
        this.name = value
        if (data) {
            this.data = data
        }
    }


}

class Event {
    /**
   * Creates a modal istance.
   * @param {string} id - string name of the modal being supplied
   * @param {number} value - percentage of satisfactory items, expressed as a whole number
   * @param {object} data - object of key:value pairs for other data, depending on modal type
   * @property {string} id - string name of the modal being supplied (also documented here for clarity).
   * @property {number} value - percentage of satisfactory items, expressed as a whole number (also documented here for clarity).
   * @property {object} data - object of key:value pairs for other verbose data, depending on modal type
   */

    constructor(options = {}) {
        const{eventName, taskSets, iterationsActive, iterationsReserve, elements=[], resources=[]} = options
        for (let option in options){
            this[option] = options[option]
        }
    }

    addElement(elemOptions){
        const newElement = new EventElement(elemOptions)
        this.elements.push(newElement)
    }

    addResource(resOptions){
        const newResource = new EventResource(resOptions)
        this.resources.push(newResource)
    }

}

class EventElement {
    /**
   * Creates a modal istance.
   * @param {string} id - string name of the modal being supplied
   * @param {number} value - percentage of satisfactory items, expressed as a whole number
   * @param {object} data - object of key:value pairs for other data, depending on modal type
   * @property {string} id - string name of the modal being supplied (also documented here for clarity).
   * @property {number} value - percentage of satisfactory items, expressed as a whole number (also documented here for clarity).
   * @property {object} data - object of key:value pairs for other verbose data, depending on modal type
   */

    constructor(options = {}) {
        const {name, resources} = options
        this.resources=[]
        for (let option in options){
            this.option = options[option]
        }
    }

    addResource(resOptions){
        const newResource = new EventResource(resOptions)
        this.resources.push(newResource)
    }

}

class EventResource {
    /**
   * Creates a modal istance.
   * @param {string} id - string name of the modal being supplied
   * @param {number} value - percentage of satisfactory items, expressed as a whole number
   * @param {object} data - object of key:value pairs for other data, depending on modal type
   * @property {string} id - string name of the modal being supplied (also documented here for clarity).
   * @property {number} value - percentage of satisfactory items, expressed as a whole number (also documented here for clarity).
   * @property {object} data - object of key:value pairs for other verbose data, depending on modal type
   */

    constructor(options = {}) {
        const {lin = "SOLDIER", quantity = 0, nomenclature = "Employed by Soldiers", ammunition} = options
        this.ammunition=[]
        for (let option in options){
            this.option = options[option]
        }
    }

    addAmmunition(ammoOptions){
        const newAmmo = new ResourceAmmunition(ammoOptions)
        this.ammunition.push(newAmmo)
    }

}

class ResourceAmmunition {
    constructor(options = {}) {
        const {dodic, quantity = 0, nomenclature} = options
        this.dodic = dodic
        this.quantity = quantity
        this.nomenclature = nomenclature
    }
}

module.exports = {
    CatsRollup,TaskSet,Event,EventElement,EventResource,ResourceAmmunition
}