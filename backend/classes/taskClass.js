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

    constructor(options = {}) {
        const { id, name, collectiveTasks = [] } = options
        this.id, this.name, this.collectiveTasks = []
        for (let option in options) {
            this[option] = options[option]
        }
    }

    addCollectiveTask(id) {
        let myColTask = new CollectiveTask({ "id": id })
        this.collectiveTasks.push(myColTask)
        return myColTask.init()
    }

    getTaskUrls() {
        return this.collectiveTasks.map(task => task.getUrlPdf())
    }

    getTaskReferences() {
        return Promise.all(this.collectiveTasks.map(task => Promise.allSettled(task.getReferencePdfs())))
    }
}

class TrainingEvent {
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
        const { name, date, taskEvents = [], elements = [] } = options
        this.name, this.date, this.taskEvents = [], this.elements = []
        for (let option in options) {
            this[option] = options[option]
        }
    }

    addTaskEvent(taskEventOptions) {
        const newTaskEvent = new TaskEvent(taskEventOptions)
        this.taskEvents.push(newTaskEvent)
    }

    getAmmoRollup() {
        let ammoArray = []
        for (let task of this.taskEvents) {
            for (let element of task.elements) {
                for (let lin of element.resources) {
                    for (let linAmmo of lin.ammunition) {
                        //Check if ammo of a dodic exists already, if yes, up quanity, if no, add)
                        if (ammoArray.filter(item => item['dodic'] == linAmmo['dodic']).length > 0) {
                            ammoArray.find((item) => item['dodic'] == linAmmo['dodic']).quantity += linAmmo['quantity']
                        } else {
                            ammoArray.push(new ResourceAmmunition(linAmmo))
                        }
                    }
                }
            }
        }
        return ammoArray
    }
}

class TaskEvent {
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
        const { eventName, taskSets, iterationsActive, iterationsReserve, elements = [], resources = [] } = options
        for (let option in options) {
            this[option] = options[option]
        }
    }

    addElement(elemOptions) {
        const newElement = new EventElement(elemOptions)
        this.elements.push(newElement)
    }

    addResource(resOptions) {
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
        const { name, resources } = options
        this.resources = []
        for (let option in options) {
            this.option = options[option]
        }
    }

    addResource(resOptions) {
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
        const { lin = "SOLDIER", quantity = 0, nomenclature = "Employed by Soldiers", ammunition } = options
        this.ammunition = []
        for (let option in options) {
            this.option = options[option]
        }
    }

    addAmmunition(ammoOptions) {
        const newAmmo = new ResourceAmmunition(ammoOptions)
        this.ammunition.push(newAmmo)
    }

}

class ResourceAmmunition {
    constructor(options = {}) {
        const { dodic, quantity = 0, nomenclature } = options
        this.dodic = dodic
        this.quantity = quantity
        this.nomenclature = nomenclature
    }
}

class CollectiveTask {
    constructor(options = {}) {
        const { id } = options
        this.id = id
    }

    async init() {
        return this.getCarMetaData().then(() => this?.metadata?.formats ? this.getCarData() : false)
    }

    async getCarMetaData() {
        this.metadata = {}
        return carSearch(this.id)
                .then(carMetadata => {
                    for (let key in carMetadata) {
                        if (key == 'id') {
                            this['metadata']['carId'] = carMetadata[key]
                        } else {
                            this['metadata'][key] = carMetadata[key]
                        }

                    }
                })
    }

    async getCarData() {
        let metaURL = this['metadata']['formats'].find(item => item['path'] == 'metadata.json')?.['link']?.['href']
        console.log(metaURL)
        if(metaURL && !(metaURL.includes('atiam'))){
            return fetch(metaURL)
            .then(res => toJSON(res.body))
            .then(carData => {
                for (let key in carData['collectiveTask']) {
                    this[key] = carData['collectiveTask'][key]
                }
            })
        }
        else {
            return this['metadata']['formats'][0]['link']['href']
        }
        
        //     .then(jsonBody => jsonBody['catalogitems'][0])
        //     .then(carMetadata => {
        //         for (let key in carMetadata) {
        //             if (key == 'id') {
        //                 this['carId'] = carMetadata[key]
        //             } else {
        //                 this[key] = carMetadata[key]
        //             }

        //         }
        //     })
        // )
    }

    getUrlPdf() {
        return this['metadata']['formats'].find(item => item['path'] == 'report.pdf')['link']['href']
    }

    getReferencePdfs(){
        if (this['references']?.length<1){
            return []
        } else {
            return this['references'].map(reference=>carSearch(reference['id']).then(meta=>getPdfLink(meta))) || undefined
        }

    }
}

async function toJSON(body) {
    const reader = body.getReader(); // `ReadableStreamDefaultReader`
    const decoder = new TextDecoder();
    const chunks = [];

    async function read() {
        const { done, value } = await reader.read();

        // all chunks have been read?
        if (done) {
            return JSON.parse(chunks.join(''));
        }

        const chunk = decoder.decode(value, { stream: true });
        chunks.push(chunk);
        return read(); // read the next chunk
    }

    return read();
}

async function carSearch(docId) {
    encodedDocId=encodeURI(docId)
    console.log(`fetching to https://rdl.train.army.mil/catalog-ws/api/catalogitems.json?current=true
            &search_terms=${encodedDocId}&page=1&pagesize=20&field_list=`)
    return fetch(`https://rdl.train.army.mil/catalog-ws/api/catalogitems.json?current=true
            &search_terms=${encodedDocId}&page=1&pagesize=20&field_list=*`)
        .then(res => toJSON(res.body)
            .then(jsonBody => {
                return jsonBody['catalogitems'][0]})
            .then(firstReturn => {
                if (firstReturn['identifier']==docId || firstReturn['alternateid']==docId){
                    return firstReturn
                } else {
                    console.log(`SOFT-ERROR First return did not match requested document, wanted ${docId}, received ${firstReturn['identifier'] || firstReturn['alternateid'] || firstReturn['title']}`)
                    return undefined
                }
            })
        )
}

function getPdfLink(metadata){
    if (metadata['formats'].find(item => item['path'] == 'report.pdf')?.['link']?.['href']){
        return metadata['formats'].find(item => item['path'] == 'report.pdf')['link']['href']
    } else {
        return metadata['formats'][0]['link']['href']
    }
    
}

module.exports = {
    CatsRollup, TaskSet, TaskEvent, EventElement, EventResource, ResourceAmmunition, TrainingEvent, CollectiveTask
}