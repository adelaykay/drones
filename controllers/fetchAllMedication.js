const handleFetchAllMedication = (req, res, db, ObjectId) => {
  let medication = []
  db.collection('medication')
    .find()
    .sort({ name: 1 })
    .forEach(med => {
      medication.push(med)
    })
    .then(() => {
      if (medication.length) res.status(200).json(medication)
      else res.status(404).json({ message: 'No medication found' })
    })
    .catch(err => res.status(500).json('Could not fetch medication'))
}

export default handleFetchAllMedication