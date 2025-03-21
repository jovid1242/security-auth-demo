'use strict'

const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const basename = path.basename(__filename)
const env = process.env.NODE_ENV || 'development'
const config = require(__dirname + '/../config/config.json')[env]
const db = {}

let sequelize
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config)
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  )
}

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
    )
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    )
    if (process.env.APP_MODE === 'local') {
      model.tableName = String(model.tableName).toLowerCase()
    }
    db[model.name] = model
  })

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})
sequelize.addHook('beforeCount', function (options) {
  if (this._scope.include && this._scope.include.length > 0) {
    options.distinct = true
    options.col =
      this._scope.col || options.col || `"${this.options.name.singular}".id`
  }
  if (options.include && options.include.length > 0) {
    const newIncludes = []
    options.include.forEach((el) => {
      if (el?.where && el?.required) {
        newIncludes.push(el)
      }
    })
    options.include = newIncludes
  }
})
db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db
