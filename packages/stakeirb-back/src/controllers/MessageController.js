import express from "express";

import { jwtMiddleware } from "../jwt/jwtAuth.js";

const router = express.Router();

export default function (Message, User, io) {
  // Create a message
  router.post("/", jwtMiddleware, async (req, res) => {
    try {
      const { message } = req.body;
      const uuid_user = req.user.uuid_user;

      if (!uuid_user || !message) {
        return res.status(400).send("Missing fields");
      }

      if (message.length > 140) {
        return res
          .status(400)
          .send("Message too long, should be 140 characters maximum");
      }

      const newMessage = {
        uuid_user,
        message,
      };

      const response = await Message.create(newMessage);

      if (!response) {
        return res.status(500).send("An error occurred");
      }

      const user = await User.findOne({
        where: { uuid_user: uuid_user },
        attributes: ["uuid_user", "username", "pfp_url"],
      });

      if (!user) {
        return res.status(500).send("User not found");
      }

      newMessage.User = user;
      delete newMessage.uuid_user;

      io.emit("newMessage", newMessage);

      res.status(201).json(response);
    } catch (error) {
      res.status(500).send("An error occurred");
    }
  });

  // Get all messages
  router.get("/", async (req, res) => {
    try {
      let { orderBy, direction, limit } = req.query;

      const order = [];

      orderBy = orderBy || "createdAt";
      direction = direction || "DESC";

      order.push([orderBy, direction]);

      const limitInt = limit ? parseInt(limit, 10) : 100;

      const messages = await Message.findAll({
        order,
        limit: limitInt,
      });

      res.json(messages);
    } catch (error) {
      res.status(500).send("An error occurred");
    }
  });

  // Get a specific message by ID
  router.get("/:id", async (req, res) => {
    try {
      const message = await Message.findOne({ where: { id: req.params.id } });
      res.json(message);
    } catch (error) {
      res.status(500).send("An error occurred");
    }
  });

  // Send all messages to the client when a new user connects
  io.on("connection", (socket) => {
    socket.on("getMessages", async () => {
      try {
        const messages = await Message.findAll({
          order: [["createdAt", "ASC"]],
          limit: 100,
          include: {
            model: User,
          },
        });

        socket.emit("messages", messages);
      } catch (error) {
        console.error("An error occurred:", error);
      }
    });
  });

  return router;
}
