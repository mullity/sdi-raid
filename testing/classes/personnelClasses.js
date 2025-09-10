class Soldier{
  constructor(options = {}) {
    const{uic, nameFirst, nameLast, payGrade} = options
    this.uic = uic
    this.nameFirst = nameFirst || "NOFIRSTNAME"
    this.nameLast = nameLast || "NOLASTNAME"
    this.payGrade = payGrade || "E00"
    }
}

module.exports = {
  Soldier: Soldier,
}