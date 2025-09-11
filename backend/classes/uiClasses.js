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

class Modal extends UiCard{

    constructor(id, percent, data,title,description) {
    super(id,percent,data);
    this.title=title
    this.description=description
    
  }



}

module.exports = {
    UiCard: UiCard,
    Modal:Modal
}