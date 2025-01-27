import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { Sequelize } from "sequelize";

import userController from "./controllers/UserController.js";
import gameController from "./controllers/GameController.js";
import betsController from "./controllers/BetController.js";
import messagesController from "./controllers/MessageController.js";

const app = express();
app.use(cors());
app.use(bodyParser.json());

const sequelize = new Sequelize("sqlite:stakeirb-database.db");

// No logging
sequelize.options.logging = false;

import createUserModel from "./models/User.js";
import createGameModel from "./models/Game.js";
import createBetsModel from "./models/Bet.js";
import createMessagesModel from "./models/Message.js";
import DiceController from "./controllers/games/DiceController.js";

const User = createUserModel(sequelize);
const Game = createGameModel(sequelize);
const Bets = createBetsModel(sequelize);
const Messages = createMessagesModel(sequelize);

User.hasMany(Bets, { foreignKey: "uuid_user" });
User.hasMany(Messages, { foreignKey: "uuid_user" });
Bets.belongsTo(User, { foreignKey: "uuid_user" });
Bets.belongsTo(Game, { foreignKey: "game_id" });
Messages.belongsTo(User, { foreignKey: "uuid_user" });

// Hydrate database with some data
const randomImage = () => {
  const images = [
    "https://i.imgur.com/0y8Ftya.png",
    "https://i.imgur.com/tkKwb.jpg",
    "https://i.imgur.com/bE3yub.png",
    "https://i.imgur.com/C5mTMb.png",
  ];
  return images[Math.floor(Math.random() * images.length)];
};

const hydrateDatabase = async () => {
  try {
    await sequelize.sync({ force: true });

    // Create some users with some messages
    const user1 = await User.create({
      username: "alice",
      email: "alice@example.com",
      password:
        "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8",
      uuid_user: "f7e727c6-257d-4f40-8017-52c31f1f82ca",
      balance: 1000,
      pfp_url: randomImage(),
      rank_pts: 700,
    });

    const user2 = await User.create({
      username: "bob",
      email: "bob@example.com",
      password:
        "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8",
      uuid_user: "f7e727c6-257d-4f40-8017-52c31f1f82cb",
      balance: 2000,
      pfp_url: randomImage(),
      rank_pts: 400,
    });

    const game1 = await Game.create({
      slug: "dice",
      name: "Dice",
    });

    const game2 = await Game.create({
      slug: "mines",
      name: "Mines",
    });

    // Create some messages
    await Messages.create({
      uuid_user: user1.uuid_user,
      message: "Hello from Alice",
    });

    await Messages.create({
      uuid_user: user2.uuid_user,
      message: "Greetings from Bob",
    });
  } catch (error) {
    console.error("Une erreur s'est produite : ", error);
  }
};

hydrateDatabase();

const server = app.listen(3000, () => {
  console.log("*-- Serveur démarré (port 3000) --*");
});

// Listen to / route
app.get("/", (req, res) => {
  res.send("Stakeirb API is up and running!");
});

// Setting * for CORS
import { Server } from "socket.io";
const io = new Server(server, {
  cors: { origin: "*" },
});

let usersOnline = [];

// Associate controllers to routes
app.use("/users", userController(User));
app.use("/games", gameController(Game));
app.use("/bets", betsController(Bets));
app.use("/messages", messagesController(Messages, User, io));
app.use("/games/dice", DiceController(Bets, User));

io.on("connection", (socket) => {
  if (!usersOnline.includes(socket.id)) {
    usersOnline.push(socket.id);
  }

  // Send the number of users online
  io.emit("usersOnline", usersOnline.length);

  // Handle disconnection
  socket.on("disconnect", () => {
    usersOnline = usersOnline.filter((user) => user !== socket.id);
    io.emit("usersOnline", usersOnline.length);
  });

  socket.on("getOnlineUsers", () => {
    io.emit("usersOnline", usersOnline.length);
  });
});
