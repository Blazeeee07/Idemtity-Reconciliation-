const { encryptField, decrypt } = require("../utils/encrypt");

module.exports = (sequelize, DataTypes) => {
  const Contacts = sequelize.define(
    "Contacts",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        get() {
          return encryptField(this, "id");
        },
      },
      phone: {
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING,
        // unique: {
        //   msg: "Email already exists",
        // },
        // validate: {
        //   isEmail: true,
        // },
      },
      linkedId: {
        type: DataTypes.INTEGER,
        get() {
            return encryptField(this, "linkedId")
          },
        allowNull: true
      },
      linkPrecedence: {
        type: DataTypes.ENUM('primary', 'secondary'),
        allowNull: false
      },
    },
    {
      underscored: true,
      createdAt: true,
      updatedAt: true,
    }
  );

  return Contacts;
};
