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
} = require("./cookieUtils/utils");
const environment = process.env.NODE_ENV || "development";
const knexConfig = require("./knexfile")[environment];
const knex = require("knex")(knexConfig);
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const {
  createNewToken,
  authenticateToken,
} = require("./cookieUtils/authUtils");

//Secret_Key from .env
const secretKey = process.env.SECRET_KEY;

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads', 'training');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: function (req, file, cb) {
    // Allow specific file types
    const allowedTypes = /pdf|doc|docx|ppt|pptx|xls|xlsx|txt/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype) ||
                     file.mimetype.includes('document') ||
                     file.mimetype.includes('presentation') ||
                     file.mimetype.includes('spreadsheet') ||
                     file.mimetype.includes('text');

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only PDF, DOC, PPT, XLS, and TXT files are allowed'));
    }
  }
});

const app = express();
app.use(
  cors({
    origin: ["http://127.0.0.1:5173","http://localhost:5173"],
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
      .select('users.*', 'roles.name as role_name')
      .leftJoin('roles', 'users.role_id', 'roles.id')
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
            let role = 'viewer'; // default
            if (user.role_name === 'ADMIN') {
              role = 'administrator';
            } else if (user.role_name === 'DEV') {
              role = 'commander';
            } else if (user.role_name === 'USER') {
              role = 'viewer';
            }

            res.status(200).json({
              HttpResponse: "Login successful",
              user: {
                username: user.username,
                role: role,
                mos: user.mos || '12B'
              }
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
  const input = req.body;

  try {
    const columns = await getAllFields(table);
    const required = columns.filter((col) => col !== "id");
    console.log(JSON.stringify(required));
    const getId = await getter(table);

    const inputKeys = Object.keys(input);
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

// API endpoint to get all roles
app.get('/api/roles', async (req, res) => {
  try {
    const roles = await knex('roles').select('*').orderBy('name');
    res.json(roles);
  } catch (error) {
    console.error('Error fetching roles:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// API endpoint to get all units
app.get('/api/units', async (req, res) => {
  try {
    const units = await knex('units').select('*').orderBy('name');
    res.json(units);
  } catch (error) {
    console.error('Error fetching units:', error);
    res.status(500).json({ error: 'Server error' });
  }
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

app.get('/training/rollup', async (req, res) => {
  const { uic, ammoRollup, vehicleRollup } = req.query;
  try {
    const rows = [
      {"dodic":"A131","quantity":16500,"nomenclature":"7.62mm LNKD4 Ball-1TR"},
      {"dodic":"A940","quantity":1200,"nomenclature":"Ctg 25mm TPDS-T M910"},
      {"dodic":"A976","quantity":880,"nomenclature":"Ctg 25mm TP-T M793"},
      {"dodic":"L367","quantity":220,"nomenclature":"Sim Launch Antitank (ATWESS) M22"},
      {"dodic":"LA53","quantity":1010,"nomenclature":"SIMULATOR, TARGET"},
      {"dodic":"LA54","quantity":1010,"nomenclature":"Simulator, Hostile Fire"}
    ];
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: String(error) });
  }
});

app.post('/training' , async (req, res) => {
  let form = req.body
  const { ammoRollup, vehicleRollup } = req.query
  if( ammoRollup === undefined && vehicleRollup === undefined){
    res.status(404).send('Please select a type of rollup')
  } else {
    if(Array.isArray(form.taskEvents) === false || form.taskEvents.length < 1 === true){
      res.status(404).send('Improperly formated training event. Please select at least one Task Event')
    } else {
      try {
        let output = await formParser(form, ammoRollup, vehicleRollup)
        res.status(200).send(output)
      }
      catch (error) {
        console.error(error);
        res.status(500).json({ error: `${error}` });
      }
    }
  }

})

// API endpoint to get tasks by MOS
app.get('/api/tasks/mos/:mos', async (req, res) => {
  try {
    const { mos } = req.params;
    const tasks = await knex('tasks')
      .select('*')
      .where('mos', mos)
      .orderBy('number');

    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks by MOS:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// API endpoint to create a new training program with file uploads
app.post('/api/training', upload.array('documents', 10), async (req, res) => {
  try {
    const { name, type, duration, requirements } = req.body;

    // Validate required fields
    if (!name || !type || !duration) {
      return res.status(400).json({ error: 'Name, type, and duration are required' });
    }

    // Process uploaded files
    const uploadedFiles = req.files || [];
    const fileData = uploadedFiles.map(file => ({
      originalName: file.originalname,
      filename: file.filename,
      path: file.path,
      size: file.size,
      mimetype: file.mimetype
    }));

    // For now, we'll store training data as a simple log
    // In a real application, you'd save this to a database table
    const trainingData = {
      name,
      type,
      duration: parseInt(duration),
      requirements: requirements || '',
      documents: fileData,
      created_at: new Date().toISOString()
    };

    console.log('Training program created:', trainingData);

    res.status(201).json({
      message: 'Training program created successfully',
      training: {
        name: trainingData.name,
        type: trainingData.type,
        duration: trainingData.duration,
        documentsCount: fileData.length
      }
    });
  } catch (error) {
    console.error('Error creating training program:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// API endpoint to create a new user
app.post('/api/users', async (req, res) => {
  try {
    const { email, username, password, role_id, unit_id, mos } = req.body;

    // Validate required fields
    if (!email || !username || !password || !role_id || !unit_id) {
      return res.status(400).json({ error: 'All required fields must be provided' });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Check if user already exists
    const existingUser = await knex('users')
      .where('username', username)
      .orWhere('email', email)
      .first();

    if (existingUser) {
      return res.status(400).json({ error: 'User with this username or email already exists' });
    }

    // Insert new user
    const newUser = await knex('users')
      .insert({
        email,
        username,
        password: hashedPassword,
        role_id,
        unit_id,
        mos: mos || null
      })
      .returning(['id', 'email', 'username', 'role_id', 'unit_id', 'mos']);

    res.status(201).json({
      message: 'User created successfully',
      user: newUser[0]
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Server error' });
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
