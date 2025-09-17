// backend/index.js
const port = 3001;
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const {
  selectParentsAndChildren,
  getter,
  getAllFields,
  modal,
  priority,
  snapshot,
  vicSnapshot,
  trainingSnapshot,
  personnelSnapshot,
  medicalSnapshot,
  formParser,
  postToTable,
  destructureUsers,
} = require("./cookieUtils/utils");
const environment = process.env.NODE_ENV || "development";
const knexConfig = require("./knexfile")[environment];
const knex = require("knex")(knexConfig);
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const {
  createNewToken,
  authenticateToken,
} = require("./cookieUtils/authUtils");

//Secret_Key from .env
const secretKey = process.env.SECRET_KEY;

const app = express();
app.use(
  cors({
    origin: ["http://127.0.0.1:5173", "http://localhost:5173"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.post("/login", async (req, res) => {
  console.log(req.body);
  const { username, password } = req.body;
  console.log(password);
  try {
    knex("users")
      .select("users.*", "roles.name as role_name")
      .leftJoin("roles", "users.role_id", "roles.id")
      .where({ username })
      .first()
      .then((user) => {
        console.log(user);
        if (!user) {
          return res
            .status(401)
            .send("Username and password combination does not exist");
        }
        return bcrypt.compare(password, user.password).then((match) => {
          if (!match) {
            return res
              .status(401)
              .send("Username and password combination does not exist");
          }
          createNewToken(username, secretKey, knex).then((token) => {
            res.cookie("loginToken", token, {
              expires: new Date(Date.now() + 8 * 3600000),
            });

            // Map database roles to frontend roles
            let role = "viewer"; // default
            if (user.role_name === "ADMIN") {
              role = "administrator";
            } else if (user.role_name === "DEV") {
              role = "commander";
            } else if (user.role_name === "USER") {
              role = "viewer";
            }

            res.status(200).json({
              HttpResponse: "Login successful",
              user: {
                username: user.username,
                role: role,
              },
            });
          });
        });
      });
  } catch (err) {
    res.status(500).send("Server error");
  }
});

app.post("/api/:table", async (req, res) => {
  const table = req.params.table;
  const keys = await destructureUsers(req.body);
  let {} = req.body;
  // const reqObject = keys.split(",")
  if (table == "users") {
    let { email, password, unit_id, username, role_id } = req.body;
  } else if (table == "") {
  }

  console.log(keys);

  try {
    const columns = await getAllFields(table);
    const required = columns.filter((col) => col !== "id"); // all fields not ID
    console.log(JSON.stringify(required));
    const getId = await getter(table);

    if (input.userType !== null) {
      const roleId = getByRole(input.userType);
    } else {
      const inputKeys = Object.keys(input); //front-end key:value pairs
      console.log(JSON.stringify(inputKeys));

      if (!required.every((key) => inputKeys.includes(key))) {
        return res
          .status(400)
          .json({ error: "All fields have not been entered" });
      }
      if (inputKeys.length > required.length) {
        return res
          .status(400)
          .json({ error: "Too many fields have been entered" });
      }

      input["id"] = getId.length;

      const inserted = await knex(table).insert(input).returning("*");
      res.status(201).json(inserted[0]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

app.patch("/api/soldiers/:id", async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  console.log(req.body);

  try {
    const updated = await knex("soldiers")
      .where("id", id)
      .update(updateData)
      .returning("*");
    res.json(updated[0]);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Express has started on ${port} (${environment})`);
});

app.get("/", (_req, res) => {
  res.status(200).send("server is up");
});

app.get("/api/:uic", async (req, res) => {
  try {
    const unit = await knex("units").where({ uic: req.params.uic }).first();
    if (!unit) return res.status(404).json({ error: "Unit not found" });
    res.json(unit);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/equipment/:uic", async (req, res) => {
  try {
    const unit = await knex("units").where({ uic: req.params.uic }).first();
    if (!unit) return res.status(404).json({ error: "Unit not found" });

    const vehicles = await knex("vehicle")
      .where("assigned_unit_id", unit.id)
      .select("status");

    const value = calcEquipmentScore(vehicles);
    res.json({ value });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/snapshot", async (req, res) => {
  //required query params: unit(number)
  //optional query params: verbose(true/false as string)
  let { verbose, unit } = req.query;
  try {
    const got = await snapshot(unit, verbose);
    res.status(200).send(got);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});
//TODO-READD AUTHENTICATE TOKEN
app.get("/kpi", async (req, res) => {
  //required query params: unit(number)
  //optional query params: verbose(true/false as string), personnelReadinessScore(true/false as string), equipmentReadinessScore(true/false as string), trainingReadinessScore(true/false as string), medicalReadinessScore(true/false as string)
  let {
    verbose,
    unit,
    personnelReadinessScore,
    equipmentReadinessScore,
    trainingReadinessScore,
    medicalReadinessScore,
  } = req.query;
  if (unit === undefined) {
    res.status(400).send("Bad Request");
  } else {
    try {
      let vicKpi, trainingKpi, personnelKpi, medicalKpi;
      let output = [];
      if (
        equipmentReadinessScore == undefined &&
        personnelReadinessScore == undefined &&
        trainingReadinessScore == undefined &&
        medicalReadinessScore == undefined
      ) {
        output.push({ Error: "Must select a KPI Score to recieve data" });
      }
      if (equipmentReadinessScore === "true") {
        vicKpi = await vicSnapshot(unit, verbose);
        output.push(vicKpi);
      }
      if (personnelReadinessScore === "true") {
        personnelKpi = await personnelSnapshot(unit, verbose);
        output.push(personnelKpi);
      }
      if (trainingReadinessScore === "true") {
        trainingKpi = await trainingSnapshot(unit, verbose);
        output.push(trainingKpi);
      }
      if (medicalReadinessScore === "true") {
        medicalKpi = await medicalSnapshot(unit, verbose);
        output.push(medicalKpi);
      }
      if (
        vicKpi === false ||
        trainingKpi === false ||
        personnelKpi === false ||
        medicalKpi === false
      ) {
        res
          .status(404)
          .send("One or more of the requested parameters does not exist");
      } else {
        res.status(200).send(output);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: `${error}` });
    }
  }
});

app.get("/priority", async (req, res) => {
  //required query params: unit(number)
  //optional query params: verbose(true/false as string)
  let { verbose, unit } = req.query;
  try {
    const got = await priority(unit, verbose);
    res.status(200).send(got);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: `${error}` });
  }
});

app.get("/modal", async (req, res) => {
  //required query params: unit(number)
  //optional query params: verbose(true/false as string), vicModalValue(true/false as string), deploymentModalValue(true/false as string), crewModalValue(true/false as string), medModalValue(true/false as string), weaponModalValue(true/false as string)
  let {
    verbose,
    unit,
    vicModalValue,
    deploymentModalValue,
    crewModalValue,
    medModalValue,
    weaponModalValue,
  } = req.query;
  try {
    const got = await modal(
      unit,
      verbose,
      vicModalValue,
      deploymentModalValue,
      crewModalValue,
      medModalValue,
      weaponModalValue
    );
    res.status(200).send(got);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: `${error}` });
  }

  // let vicModal = await vicModal(unit, verbose)
  // let deploymentModal = await deploymentModal(unit, verbose)
  // let crewModal = await crewModal(unit, verbose)
  // let medModal = await medModal(unit, verbose)
  // let weaponModal = await weaponModal(unit, verbose)
});

app.get("/users/uic", async (req, res) => {
  //required query params: unit(number or all caps UIC)
  const { uic } = req.query;
  try {
    let out = await selectParentsAndChildren(uic);
    res.status(200).send(out);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: `${error}` });
  }
});

app.get("/training/rollup", async (req, res) => {
  const { uic, ammoRollup, vehicleRollup } = req.query;
  try {
    const rows = [
      { dodic: "A131", quantity: 16500, nomenclature: "7.62mm LNKD4 Ball-1TR" },
      { dodic: "A940", quantity: 1200, nomenclature: "Ctg 25mm TPDS-T M910" },
      { dodic: "A976", quantity: 880, nomenclature: "Ctg 25mm TP-T M793" },
      {
        dodic: "L367",
        quantity: 220,
        nomenclature: "Sim Launch Antitank (ATWESS) M22",
      },
      { dodic: "LA53", quantity: 1010, nomenclature: "SIMULATOR, TARGET" },
      {
        dodic: "LA54",
        quantity: 1010,
        nomenclature: "Simulator, Hostile Fire",
      },
    ];
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: String(error) });
  }
});

app.post("/training", async (req, res) => {
  let form = req.body;
  const { ammoRollup, vehicleRollup } = req.query;
  if (ammoRollup === undefined && vehicleRollup === undefined) {
    res.status(404).send("Please select a type of rollup");
  } else {
    if (
      Array.isArray(form.taskEvents) === false ||
      form.taskEvents.length < 1 === true
    ) {
      res
        .status(404)
        .send(
          "Improperly formated training event. Please select at least one Task Event"
        );
    } else {
      try {
        let output = await formParser(form, ammoRollup, vehicleRollup);
        res.status(200).send(output);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: `${error}` });
      }
    }
  }
});

// app.get('/api/training/350-1', function(request, response) {
//   const trainingData = {
//     name: '350-1 Individual Training',
//     completionRate: 87,
//     totalPersonnel: 343,
//     completed: 298,
//     pending: 45,
//     overdue: 12
//   };

//   response.json({ training: trainingData });
// });
