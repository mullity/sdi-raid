class Unit{
  constructor(options = {}) {
    const{id, uic, name, equipment=[], soldiers=[], parentUic=''} = options
    this.id = id
    this.uic = uic
    this.name = name
    this.equipment = equipment
    this.soldiers = soldiers
    this.parentUic = parentUic
    }

    reparent(newParent){
        if (!isString(newParent)){
            return false
        }
        this.parentUic = newParent
        return true
    }

    getSubordinates(){
        let subUnits = []
        return subUnits
    }


}