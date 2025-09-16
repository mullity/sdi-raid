fetch('http://localhost:3001/snapshot?unit=1')
  .then(res => res.json())
  .then(data=> {
    let url = 'http://localhost:3001/snapshot?unit=1'
    let fetchName = 'GET: SNAPSHOT'
    let vars = 'required query params: unit(number) \noptional query params: verbose(true/false as string) *Not implemented. No effect on return at this time*'
    console.log(
      `${fetchName}\n${vars}\nURL:${url}\n`,
    )
    console.dir(data, { depth: null });
  })

fetch('http://localhost:3001/kpi?unit=8&verbose=true&personnelReadinessScore=true&equipmentReadinessScore=true&trainingReadinessScore=true&medicalReadinessScore=true')
  .then(res => res.json())
  .then(data=> {
    let url = 'http://localhost:3001/kpi?unit=8&verbose=true&personnelReadinessScore=true&equipmentReadinessScore=true&trainingReadinessScore=true&medicalReadinessScore=true'
    let fetchName = 'GET: KPI'
    let vars = 'required query params: unit(number) \noptional query params: verbose(true/false as string), personnelReadinessScore(true/false as string), equipmentReadinessScore(true/false as string), trainingReadinessScore(true/false as string), medicalReadinessScore(true/false as string)'
    console.log(
      `${fetchName}\n${vars}\nURL:${url}\n`,
    )
    console.dir(data, { depth: null });
  })

fetch('http://localhost:3001/kpi?unit=1&personnelReadinessScore=true')
  .then(res => res.json())
  .then(data=> {
    let url = 'http://localhost:3001/kpi?unit=1&personnelReadinessScore=true'
    let fetchName = 'GET: KPI'
    let vars = 'required query params: unit(number) \noptional query params: verbose(true/false as string), personnelReadinessScore(true/false as string), equipmentReadinessScore(true/false as string), trainingReadinessScore(true/false as string), medicalReadinessScore(true/false as string)'
    console.log(
      `${fetchName}\n${vars}\nURL:${url}\n`,
    )
    console.dir(data, { depth: null });
  })

fetch('http://localhost:3001/priority?unit=1')
  .then(res => res.json())
  .then(data=> {
    let url = 'http://localhost:3001/priority?unit=1'
    let fetchName = 'GET: PRIORITY'
    let vars = 'Same as snapshot, but ordered by value lowest first \nrequired query params: unit(number) \noptional query params: verbose(true/false as string) *Not implemented. No effect on return at this time*'
    console.log(
      `${fetchName}\n${vars}\nURL:${url}\n`,
    )
    console.dir(data, { depth: null });
  })

fetch('http://localhost:3001/modal?unit=8&vicModalValue=true&deploymentModalValue=true&verbose=true')
  .then(res => res.json())
  .then(data=> {
    let url = 'http://localhost:3001/modal?unit=8&vicModalValue=true&deploymentModalValue=true&verbose=true'
    let fetchName = 'GET: MODAL'
    let vars = 'Other params not implemented at this time, will be by EOD tuesday following same format as below \nrrequired query params: unit(number) \noptional query params: verbose(true/false as string), vicModalValue(true/false as string), deploymentModalValue(true/false as string), crewModalValue(true/false as string), medModalValue(true/false as string), weaponModalValue(true/false as string)'
    console.log(
      `${fetchName}\n${vars}\nURL:${url}\n`,
    )
    console.dir(data, { depth: null });
  })

fetch('http://localhost:3001/modal?unit=8&vicModalValue=true&deploymentModalValue=true')
  .then(res => res.json())
  .then(data=> {
    let url = 'http://localhost:3001/modal?unit=8&vicModalValue=true&deploymentModalValue=true'
    let fetchName = 'GET: MODAL'
    let vars = 'Other params not implemented at this time, will be by EOD tuesday following same format as below \nrrequired query params: unit(number) \noptional query params: verbose(true/false as string), vicModalValue(true/false as string), deploymentModalValue(true/false as string), crewModalValue(true/false as string), medModalValue(true/false as string), weaponModalValue(true/false as string)'
    console.log(
      `${fetchName}\n${vars}\nURL:${url}\n`,
    )
    console.dir(data, { depth: null });
  })

fetch('http://localhost:3001/users/uic?uic=WAMZAA')
  .then(res => res.json())
  .then(data=> {
    let url = 'http://localhost:3001/users/uic?uic=WAMZAA'
    let fetchName = 'GET: USERS/UIC'
    let vars = '\nrequired query params: unit(number or all caps UIC)'
    console.log(
      `${fetchName}\n${vars}\nURL:${url}\n`,
    )
    console.dir(data, { depth: null });
  })