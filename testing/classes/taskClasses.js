class Task {

  constructor() {
    if (this.constructor == Task) {
      throw new Error("Abstract class Task can't be instantiated.");
    }
  }

}

