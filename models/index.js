const fs = require("node:fs");

const path = require("node:path");
const Sequelize = require("sequelize");
const configuration = require("../config/config");

const basename = path.basename(__filename);
const environment = process.env.NODE_ENV || "development";
const config = configuration[environment];
const database = {};

const sequelize = config.use_env_variable
  ? new Sequelize(process.env[config.use_env_variable], config)
  : new Sequelize(config.database, config.username, config.password, config);

// eslint-disable-next-line no-shadow
for (const file of fs.readdirSync(__dirname).filter((file) => {
  return (
    file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
  );
})) {
  // eslint-disable-next-line import/no-dynamic-require, global-require, security/detect-non-literal-require
  const model = require(path.join(__dirname, file))(
    sequelize,
    Sequelize.DataTypes
  );
  database[model.name] = model;
}

for (const modelName of Object.keys(database)) {
  if (database[modelName].associate) {
    database[modelName].associate(database);
  }
}

database.sequelize = sequelize;
database.Sequelize = Sequelize;

module.exports = database;
