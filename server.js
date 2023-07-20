import express from 'express'
import { connectToDb, getDb } from './db.js'
import { ObjectId } from 'mongodb'
import handleDroneRegister from './controllers/registerDrone.js'
import handleLoadDrone from './controllers/loadDrone.js'
import handleBatteryCheck from './controllers/checkBattery.js'
import handleCheckAvailableDrones from './controllers/availableDrones.js'
import handleGetDroneLoadInfo from './controllers/droneMeds.js'
import handleFetchAllMedication from './controllers/fetchAllMedication.js'
import handleFetchAllDrones from './controllers/fetchAllDrones.js'
import { config } from 'dotenv'

config()

let PORT = process.env.PORT
let db
const app = express()

// app.use(cors())
// app.use(bodyParser.json())
app.use(express.json())

// db connection
connectToDb(err => {
  if (!err) {
    app.listen(PORT, () => {
      console.log('listening on port: ' + PORT)
    })
    db = getDb()
  }
})

// routes
// get all drones
app.get('/api/drones/', (req, res) => {
  if(req.query.state){
    handleCheckAvailableDrones(req, res, db)
  }
  else handleFetchAllDrones(req, res, db, ObjectId)
})

// get all medication
app.get('/api/medication', (req, res) => {
  handleFetchAllMedication(req, res, db, ObjectId)
})

// register a drone (serial_number, model, weight_limit, battery_capacity)
app.post('/api/drones', (req, res) => {
  handleDroneRegister(req, res, db, ObjectId)
})

// Load drone with medication
app.post('/api/drones/:id/load', async (req, res) => {
  handleLoadDrone(req, res, db, ObjectId)
})

// get drone load information
app.get('/api/drones/:id/medications', async (req, res) => {
  handleGetDroneLoadInfo(req, res, db, ObjectId)
})

// check available drones for loading
app.get('/api/drones', (req, res) => {
  handleCheckAvailableDrones(req, res, db)
})

// check drone battery level
app.get('/api/drones/:id/battery', (req, res) => {
  handleBatteryCheck(req, res, db, ObjectId)
})
