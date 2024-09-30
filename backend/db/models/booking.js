"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
	// define your schema in options object
	options.schema = process.env.SCHEMA;
}

const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Booking extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			Booking.belongsTo(models.User, { foreignKey: "userId" });
			Booking.belongsTo(models.Spot, { foreignKey: "spotId" });
		}
	}
	Booking.init(
		{
			spotId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: { model: "Spots", key: "id" },
			},
			userId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: { model: "Users", key: "id" },
			},
			startDate: {
				type: DataTypes.DATEONLY,
				allowNull: false,
				validate: {
					isDate: true,
				},
			},
			endDate: {
				type: DataTypes.DATEONLY,
				allowNull: false,
				validate: {
					isDate: true,
					isAfterStart(value) {
						if (new Date(value) <= new Date(this.startDate)) {
							throw new Error("End date must be after start date.");
						}
					},
				},
			},
		},

		{
			sequelize,
			modelName: "Booking",
			...options,
		}
	);
	return Booking;
};
