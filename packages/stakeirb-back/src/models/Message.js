import { DataTypes } from "sequelize";

export default function (sequelize) {
  const Message = sequelize.define("Message", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    uuid_user: {
      type: DataTypes.CHAR(36),
    },
    message: {
      type: DataTypes.STRING(140),
      allowNull: false,
    },
  });

  return Message;
}
