module.exports = (sequelize, dataType) => {
    return sequelize.define('user', {
        id: {
        type: dataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: dataType.STRING,
      },
      email: {
        type: dataType.STRING,
      },
      address: {
        type: dataType.STRING,
      },
      contact_no: {
        type: dataType.STRING,
      },
      password: {
        type: dataType.STRING,
      },createdAt: {
        type: dataType.DATE,
        defaultValue:  sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false,
    },
    updatedAt: {
        type: dataType.DATE,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false,
    },
    }, {
      timestamps: true,
      freezeTableName: true,
      tableName: 'user'
    });
  }