import { MongoClient } from 'mongodb'
import { config } from 'dotenv'

config()
let database
const uri = process.env.URI
const client = new MongoClient(uri)

export const connectToDb = async cb => {
  try {
    database = client.db('DDS')
    return cb()
  } catch (error) {
    return cb(error)
  }
}
export const getDb = () => database
