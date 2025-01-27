import { DataTypes } from "sequelize";

export default function (sequelize) {
  const Game = sequelize.define("Game", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    slug: {
      type: DataTypes.STRING(255),
      unique: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    bets_placed: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  });

  return Game;
}
