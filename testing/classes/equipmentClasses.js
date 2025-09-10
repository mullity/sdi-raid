class Equipment {

  constructor() {
    if (this.constructor == Equipment) {
      throw new Error("Abstract class Equipment can't be instantiated.");
    }
  }

}

class Vehicle extends Equipment {

  constructor(options = {}) {
    const{uic, lin, name, status} = options
    this.uic = uic || "000000"
    this.lin = lin || "000000"
    this.name = name || "NO NAME"
    this.status = status || "ZZZ"
    }
}

