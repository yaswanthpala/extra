module.exports = (sequelize, dataType) => {
    return sequelize.define('feedback', {
        id: {
        type: dataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      transit_id: {
        type: dataType.INTEGER,
      },
      comment: {
        type: dataType.STRING,
      },
      rating:{
        type: dataType.INTEGER,
        validate: {
          min: 1,
          max: 5,
          isInt: true,
        },
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
      tableName: 'feedback'
    });
  }