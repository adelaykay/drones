const handleLoadDrone = (req, res, db, ObjectId) => {
  if (
    ObjectId.isValid(req.params.id) &&
    ObjectId.isValid(req.body.medication_id)
  ) {
    // console.log('first')
    const load = {
      _id: new ObjectId(),
      drone_id: ObjectId(req.params.id),
      medication_id: ObjectId(req.body.medication_id),
      created_at: new Date(),
      updated_at: new Date(),
    }
    let droneWeightLimit,
      droneBatteryLevel,
      medicationWeight,
      loadedMedsWeight = 0,
      medsList = [],
      droneState
    Promise.all([
      db
        .collection('medication')
        .findOne({ _id: ObjectId(load.medication_id) })
        .then(med => {
          // console.log(med)
          medicationWeight = med.weight
        }),
      db
        .collection('drones')
        .findOne({ _id: load.drone_id })
        .then(drone => {
          // console.log('third')
          droneWeightLimit = drone.weight_limit
          droneBatteryLevel = drone.battery_capacity
          droneState = drone.state
        }),
      db
        .collection('drone_medication')
        .aggregate([
          {
            $match: { drone_id: ObjectId(req.params.id) },
          },
          {
            $lookup: {
              from: 'medication',
              localField: 'medication_id',
              foreignField: '_id',
              as: 'medication',
            },
          },
        ])
        .forEach(doc => {
          medsList.push(doc.medication[0])
        })
        .then(() => {
          if (medsList.length) {
            medsList.forEach(med => {
              console.log(med.weight)
              loadedMedsWeight += med.weight
            })
          }
        }),
    ]).then(result => {
      if (
        medicationWeight + loadedMedsWeight <= droneWeightLimit &&
        droneBatteryLevel >= 25 &&
        (droneState === 'IDLE' || droneState === 'LOADING')
      ) {
        // console.log(loadedMedsWeight + ', ' + medicationWeight + ', ' + droneWeightLimit)
        db.collection('drone_medication')
          .insertOne(load)
          .then(result => {
            if (droneWeightLimit - (loadedMedsWeight + medicationWeight) < 50) {
              db.collection('drone').updateOne(
                { _id: load.drone_id },
                { $set: { state: 'LOADED', updated_at: new Date() } }
              )
            }
            else if (result.acknowledged === true) {
              db.collection('drones').updateOne(
                { _id: load.drone_id },
                { $set: { state: 'LOADING', updated_at: new Date() } }
              )
            }
            console.log(droneWeightLimit - (loadedMedsWeight + medicationWeight))
            res.status(200).json(result)
          })
          .catch(err => {
            console.log(err.message)
            res.status(500).json('Could not load drone')
          })
      } else if (medicationWeight + loadedMedsWeight > droneWeightLimit) {
        res.status(500).json('Drone weight limit exceeded')
      } else if (droneBatteryLevel < 25) {
        res.status(500).json('Drone battery level too low')
      } else if (!(droneState === 'IDLE' || droneState === 'LOADING')) {
        res.status(500).json('Drone is not available')
      } else {
        res.json(
          'Drone Battery Level: ' +
            droneBatteryLevel +
            '\n ' +
            'Medication Weight: ' +
            medicationWeight +
            '\n' +
            'Loaded Medication Weight: ' +
            loadedMedsWeight +
            '\n' +
            'Drone Weight Limit: ' +
            droneWeightLimit +
            '\n' +
            'Drone State: ' +
            droneState
        )
      }
    })
  } else {
    res.status(500).json('Invalid drone or medication Id')
  }
}

export default handleLoadDrone
