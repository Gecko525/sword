import mongoose from 'mongoose'
import config from '../config'
import { resolve } from 'path'
import fs from 'fs'

const models = resolve(__dirname, '../database/schema')
fs.readdirSync(models)
  .filter(file => ~file.search(/^[^.].*.js$/))
  .forEach(file => require(resolve(models, file)))

export const database = app => {
  mongoose.set('debug', true)

  mongoose.connect(config.db)
  mongoose.connection.on('disconnected', function () {
    mongoose.connect(config.db)
  })
  mongoose.connection.on('error', function (err) {
    console.error(err)
  })
  mongoose.connection.on('open', async function () {
    console.log('Connected to MongoDB', config.db)
  })
}
