const sequelize = require("./dbConnection");
const { DataTypes } = require("sequelize");

const Soldier = sequelize.define("soldier", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  mispar_ishi: {
    type: DataTypes.TEXT,
  },
  user_name: {
    type: DataTypes.TEXT,
  },
  first_name: {
    type: DataTypes.TEXT,
  },
  last_name: {
    type: DataTypes.TEXT,
  },
  gender: {
    type: DataTypes.CHAR,
  },
  role: {
    type: DataTypes.TEXT,
  },
  rank: {
    type: DataTypes.TEXT,
  },
  city: {
    type: DataTypes.TEXT,
  },
  city_location: {
    type: DataTypes.TEXT,
  },
  is_officer: {
    type: DataTypes.BOOLEAN,
  },
  age: {
    type: DataTypes.INTEGER,
  },
},
{
    freezeTableName: true,
    timestamps: false,
});

const getAllSoldiers = async () => {
    const soldiers = await Soldier.findAll({attributes: { exclude: ['createdAt', 'updatedAt'] }});

    return soldiers;
}

const updateMadorSoldiers = async (newSoldiers) => {
    try {
        await sequelize.transaction(async (t) => {

            await Soldier.destroy({ where: {}, transaction: t });

            await Soldier.bulkCreate(newSoldiers, { transaction: t,  fields: [
                'mispar_ishi', 'user_name', 'first_name', 'last_name',
                'gender', 'role', 'rank', 'city', 'city_location',
                'is_officer', 'age'
            ]});
        });

        console.log('Soldiers updated successfully.');
    } catch (error) {
        console.error('Error updating soldiers:', error);
        throw error; 
    }
}

module.exports = { getAllSoldiers, updateMadorSoldiers };