import { DataTypes } from "sequelize";

export default function (sequelize) {
  const Bet = sequelize.define("Bet", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    uuid_user: {
      type: DataTypes.CHAR(36),
    },
    game_id: {
      type: DataTypes.INTEGER,
    },
    bet_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    multiplier: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
    },
    win: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    data: {
      type: DataTypes.JSON,
    },
  });

  return Bet;
}
