class Modal {
    /**
   * Creates a modal istance.
   * @param {string} id - string name of the modal being supplied
   * @param {number} percent - percentage of satisfactory items, expressed as a whole number
   * @param {object} verboseData - object of key:value pairs for other verbose data, depending on modal type
   * @property {string} id - string name of the modal being supplied (also documented here for clarity).
   * @property {number} percent - percentage of satisfactory items, expressed as a whole number (also documented here for clarity).
   * @property {object} verboseData - object of key:value pairs for other verbose data, depending on modal type
   */

    constructor(id, percent, verboseData) {
        this.id = id
        this.percent = percent
        if (verboseData) {
            this.verboseData = verboseData
        }
    }


}

module.exports = {
    Modal: Modal,
}