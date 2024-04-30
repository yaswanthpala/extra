module.exports = (sequelize, dataType) => {
    return sequelize.define('transit', {
        id: {
        type: dataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: dataType.STRING,
      },
      pickup_location: {
        type: dataType.STRING,
      },
      drop_location: {
        type: dataType.STRING,
      },
      pick_lat_long: {
        type: dataType.STRING,
      },
      drop_lat_long: {
        type: dataType.STRING,
      },
      distance: {
        type: dataType.DECIMAL(10,2),
      },
      status: {
        type: dataType.ENUM('PENDING', 'CONFIRMED', 'ARRIVED','COMPLETED','IN_TRANSIT'),
        defaultValue: 'PENDING',
      },
      total:{
        type: dataType.DECIMAL(10,2),
      },
      qoute_id:{
        type: dataType.STRING,
      },
      createdAt: {
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
      tableName: 'transit'
    });
  }