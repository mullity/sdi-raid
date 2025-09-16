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

  // fetch('http://localhost:3001/training/rollup')
  // .then(res => res.json())
  // .then(data=> {
  //   let url = 'http://localhost:3001/training/rollup'
  //   let fetchName = 'GET: ROLLUP'
  //   let vars = 'const { uic, ammoRollup, vehicleRollup } = req.query'
  //   console.log(
  //     `${fetchName}\n${vars}\nURL:${url}\n`,
  //   )
  //   console.dir(data, { depth: null });
  // })

  let trainingEventTestData = {
    "name": "Company Bradley Qual Range",
    "date": "Tue Sep 30 2025",
    "taskEvents": [
        {
            "eventName": "Qualification for Engage Targets from a BFV - Crew",
            "taskSets": [
                {
                    "number": "71-TS-5322",
                    "name": "Engage Targets from a BFV - Crew"
                }
            ],
            "iterationsActive": "PLACEHOLDER",
            "iterationsReserve": "PLACEHOLDER",
            "condition": "Run",
            "trainingAudience": "IMPORTANT-PLACEHOLDER",
            "facilities": "IMPORTANT-PLACEHOLDER",
            "purpose": "IMPORTANT-PLACEHOLDER",
            "outcome": "IMPORTANT-PLACEHOLDER",
            "executionGuidance": "IMPORTANT-PLACEHOLDER",
            "elements": [
                {
                    "name": "COMPANY HQ",
                    "resources": [
                        {
                            "lin": "M92420",
                            "quantity": 1,
                            "nomenclature": "MACHINE GUN 7.62 MILLIMETER: FIXED RH FEED",
                            "ammunition": [
                                {
                                    "dodic": "A131",
                                    "quantity": 1650,
                                    "nomenclature": "7.62mm LNKD4 Ball-1TR"
                                }
                            ]
                        },
                        {
                            "lin": "M05073",
                            "quantity": 1,
                            "nomenclature": "M2A4 BRADLEY FIGHTING VEHICLE (BFV)",
                            "ammunition": [
                                {
                                    "dodic": "A940",
                                    "quantity": 120,
                                    "nomenclature": "Ctg 25mm TPDS-T M910"
                                },
                                {
                                    "dodic": "A976",
                                    "quantity": 88,
                                    "nomenclature": "Ctg 25mm TP-T M793"
                                },
                                {
                                    "dodic": "L367",
                                    "quantity": 22,
                                    "nomenclature": "Sim Launch Antitank (ATWESS) M22"
                                },
                                {
                                    "dodic": "LA53",
                                    "quantity": 101,
                                    "nomenclature": "SIMULATOR, TARGET"
                                },
                                {
                                    "dodic": "LA54",
                                    "quantity": 101,
                                    "nomenclature": "Simulator, Hostile Fire"
                                }
                            ]
                        }
                    ]
                },
                {
                    "name": "COMBAT ENGINEER PLATOON HEADQUARTERS",
                    "resources": [
                        {
                            "lin": "M92420",
                            "quantity": 1,
                            "nomenclature": "MACHINE GUN 7.62 MILLIMETER: FIXED RH FEED",
                            "ammunition": [
                                {
                                    "dodic": "A131",
                                    "quantity": 1650,
                                    "nomenclature": "7.62mm LNKD4 Ball-1TR"
                                }
                            ]
                        },
                        {
                            "lin": "M05073",
                            "quantity": 1,
                            "nomenclature": "M2A4 BRADLEY FIGHTING VEHICLE (BFV)",
                            "ammunition": [
                                {
                                    "dodic": "A940",
                                    "quantity": 120,
                                    "nomenclature": "Ctg 25mm TPDS-T M910"
                                },
                                {
                                    "dodic": "A976",
                                    "quantity": 88,
                                    "nomenclature": "Ctg 25mm TP-T M793"
                                },
                                {
                                    "dodic": "L367",
                                    "quantity": 22,
                                    "nomenclature": "Sim Launch Antitank (ATWESS) M22"
                                },
                                {
                                    "dodic": "LA53",
                                    "quantity": 101,
                                    "nomenclature": "SIMULATOR, TARGET"
                                },
                                {
                                    "dodic": "LA54",
                                    "quantity": 101,
                                    "nomenclature": "Simulator, Hostile Fire"
                                }
                            ]
                        }
                    ]
                },
                {
                    "name": "COMBAT ENGINEER SQUAD",
                    "resources": [
                        {
                            "lin": "M92420",
                            "quantity": 3,
                            "nomenclature": "MACHINE GUN 7.62 MILLIMETER: FIXED RH FEED",
                            "ammunition": [
                                {
                                    "dodic": "A131",
                                    "quantity": 4950,
                                    "nomenclature": "7.62mm LNKD4 Ball-1TR"
                                }
                            ]
                        },
                        {
                            "lin": "M05073",
                            "quantity": 3,
                            "nomenclature": "M2A4 BRADLEY FIGHTING VEHICLE (BFV)",
                            "ammunition": [
                                {
                                    "dodic": "A940",
                                    "quantity": 360,
                                    "nomenclature": "Ctg 25mm TPDS-T M910"
                                },
                                {
                                    "dodic": "A976",
                                    "quantity": 264,
                                    "nomenclature": "Ctg 25mm TP-T M793"
                                },
                                {
                                    "dodic": "L367",
                                    "quantity": 66,
                                    "nomenclature": "Sim Launch Antitank (ATWESS) M22"
                                },
                                {
                                    "dodic": "LA53",
                                    "quantity": 303,
                                    "nomenclature": "SIMULATOR, TARGET"
                                },
                                {
                                    "dodic": "LA54",
                                    "quantity": 303,
                                    "nomenclature": "Simulator, Hostile Fire"
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "eventName": "Qualification for Engage Targets from a BFV - Crew",
            "taskSets": [
                {
                    "number": "71-TS-5322",
                    "name": "Engage Targets from a BFV - Crew"
                }
            ],
            "iterationsActive": "PLACEHOLDER",
            "iterationsReserve": "PLACEHOLDER",
            "condition": "Run",
            "trainingAudience": "IMPORTANT-PLACEHOLDER",
            "facilities": "IMPORTANT-PLACEHOLDER",
            "purpose": "IMPORTANT-PLACEHOLDER",
            "outcome": "IMPORTANT-PLACEHOLDER",
            "executionGuidance": "IMPORTANT-PLACEHOLDER",
            "elements": [
                {
                    "name": "COMPANY HQ",
                    "resources": [
                        {
                            "lin": "M92420",
                            "quantity": 1,
                            "nomenclature": "MACHINE GUN 7.62 MILLIMETER: FIXED RH FEED",
                            "ammunition": [
                                {
                                    "dodic": "A131",
                                    "quantity": 1650,
                                    "nomenclature": "7.62mm LNKD4 Ball-1TR"
                                }
                            ]
                        },
                        {
                            "lin": "M05073",
                            "quantity": 1,
                            "nomenclature": "M2A4 BRADLEY FIGHTING VEHICLE (BFV)",
                            "ammunition": [
                                {
                                    "dodic": "A940",
                                    "quantity": 120,
                                    "nomenclature": "Ctg 25mm TPDS-T M910"
                                },
                                {
                                    "dodic": "A976",
                                    "quantity": 88,
                                    "nomenclature": "Ctg 25mm TP-T M793"
                                },
                                {
                                    "dodic": "L367",
                                    "quantity": 22,
                                    "nomenclature": "Sim Launch Antitank (ATWESS) M22"
                                },
                                {
                                    "dodic": "LA53",
                                    "quantity": 101,
                                    "nomenclature": "SIMULATOR, TARGET"
                                },
                                {
                                    "dodic": "LA54",
                                    "quantity": 101,
                                    "nomenclature": "Simulator, Hostile Fire"
                                }
                            ]
                        }
                    ]
                },
                {
                    "name": "COMBAT ENGINEER PLATOON HEADQUARTERS",
                    "resources": [
                        {
                            "lin": "M92420",
                            "quantity": 1,
                            "nomenclature": "MACHINE GUN 7.62 MILLIMETER: FIXED RH FEED",
                            "ammunition": [
                                {
                                    "dodic": "A131",
                                    "quantity": 1650,
                                    "nomenclature": "7.62mm LNKD4 Ball-1TR"
                                }
                            ]
                        },
                        {
                            "lin": "M05073",
                            "quantity": 1,
                            "nomenclature": "M2A4 BRADLEY FIGHTING VEHICLE (BFV)",
                            "ammunition": [
                                {
                                    "dodic": "A940",
                                    "quantity": 120,
                                    "nomenclature": "Ctg 25mm TPDS-T M910"
                                },
                                {
                                    "dodic": "A976",
                                    "quantity": 88,
                                    "nomenclature": "Ctg 25mm TP-T M793"
                                },
                                {
                                    "dodic": "L367",
                                    "quantity": 22,
                                    "nomenclature": "Sim Launch Antitank (ATWESS) M22"
                                },
                                {
                                    "dodic": "LA53",
                                    "quantity": 101,
                                    "nomenclature": "SIMULATOR, TARGET"
                                },
                                {
                                    "dodic": "LA54",
                                    "quantity": 101,
                                    "nomenclature": "Simulator, Hostile Fire"
                                }
                            ]
                        }
                    ]
                },
                {
                    "name": "COMBAT ENGINEER SQUAD",
                    "resources": [
                        {
                            "lin": "M92420",
                            "quantity": 3,
                            "nomenclature": "MACHINE GUN 7.62 MILLIMETER: FIXED RH FEED",
                            "ammunition": [
                                {
                                    "dodic": "A131",
                                    "quantity": 4950,
                                    "nomenclature": "7.62mm LNKD4 Ball-1TR"
                                }
                            ]
                        },
                        {
                            "lin": "M05073",
                            "quantity": 3,
                            "nomenclature": "M2A4 BRADLEY FIGHTING VEHICLE (BFV)",
                            "ammunition": [
                                {
                                    "dodic": "A940",
                                    "quantity": 360,
                                    "nomenclature": "Ctg 25mm TPDS-T M910"
                                },
                                {
                                    "dodic": "A976",
                                    "quantity": 264,
                                    "nomenclature": "Ctg 25mm TP-T M793"
                                },
                                {
                                    "dodic": "L367",
                                    "quantity": 66,
                                    "nomenclature": "Sim Launch Antitank (ATWESS) M22"
                                },
                                {
                                    "dodic": "LA53",
                                    "quantity": 303,
                                    "nomenclature": "SIMULATOR, TARGET"
                                },
                                {
                                    "dodic": "LA54",
                                    "quantity": 303,
                                    "nomenclature": "Simulator, Hostile Fire"
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
}
fetch('http://localhost:3001/training?ammoRollup=true&vehicleRollup=true', {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(trainingEventTestData)
})
  .then(res => res.json())
  .then(data=> {
    let url = 'http://localhost:3001/training?ammoRollup=true&vehicleRollup=true'
    let fetchName = 'GET: ROLLUP'
    let vars = 'let form = req.body const { ammoRollup, vehicleRollup } = req.query'
    console.log(
      `${fetchName}\n${vars}\nURL:${url}\n`,
    )
    console.dir(data, { depth: null });
  })