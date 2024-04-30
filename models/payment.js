module.exports = (sequelize, dataType) => {
    return sequelize.define('payment', {
        id: {
        type: dataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      transit_id: {
        type: dataType.INTEGER,
      },
      amount: {
        type: dataType.INTEGER,
      },
      discount: {
        type: dataType.INTEGER,
      },
      status: {
        type:  dataType.ENUM('PAID', 'UNPAID','DUE'),
      },
      total_amount: {
        type: dataType.DECIMAL(10, 2),
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
      tableName: 'payment'
    });
  }