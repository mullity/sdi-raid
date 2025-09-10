class Soldier{
  constructor(options = {}) {
    const{uic, nameFirst, nameLast, payGrade} = options
    this.uic = uic || "000000"
    this.nameFirst = nameFirst || "NOFIRSTNAME"
    this.nameLast = nameLast || "NOLASTNAME"
    this.payGrade = payGrade || "E00"
    }
}