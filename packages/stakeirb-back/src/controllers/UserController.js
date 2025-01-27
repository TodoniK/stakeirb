import express from "express";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { jwtMiddleware } from "../jwt/jwtAuth.js";

const router = express.Router();

export default function (User) {
  // Get a specific user by UUID
  router.get("/:uuid_user", async (req, res) => {
    try {
      const { uuid_user } = req.params;

      if (!uuid_user) return res.status(400).send("No user uuid provided");

      const user = await User.findOne({
        where: { uuid_user: uuid_user },
      });

      if (!user) return res.status(404).send("User not found");

      const newUser = {
        uuid_user: user.uuid_user,
        username: user.username,
        pfp_url: user.pfp_url,
        rank_pts: user.rank_pts,
        balance: user.balance,
        createdAt: user.createdAt,
      };

      res.json(newUser);
    } catch (error) {
      res.status(500).send("An error occurred");
    }
  });

  // Delete a user by UUID
  router.delete("/:uuid_user", jwtMiddleware, async (req, res) => {
    try {
      const user = await User.findOne({
        where: { uuid_user: req.params.uuid_user },
      });
      user.destroy();
      res.json(user);
    } catch (error) {
      res.status(500).send("An error occurred");
    }
  });

  // Update user balance
  router.put("/balance", jwtMiddleware, async (req, res) => {
    try {
      const uuid_user = req.user.uuid_user;

      const user = await User.findOne({
        where: { uuid_user: uuid_user },
      });

      if (!user) {
        return res.status(404).send("User not found");
      }

      const newBalance =
        parseInt(user.balance) + parseInt(req.body.money_amount);

      // Update user balance
      const response = await user.update({ balance: newBalance });

      if (!response) {
        return res.status(500).send("An error occurred");
      }

      return res.status(200).json({ balance: response.balance });
    } catch (error) {
      res.status(500).send("An error occurred");
    }
  });

  router.post("/register", async (req, res) => {
    const { username, email, hashedPassword } = req.body;
    try {
      const user = await User.create({
        username,
        email,
        password: hashedPassword,
      });
      const privateUser = {
        uuid_user: user.uuid_user,
        username: user.username,
        email: user.email,
        balance: user.balance,
        pfp_url: user.pfp_url,
        rank_pts: user.rank_pts,
      };
      const token = jwt.sign(
        { user: privateUser },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "1h" },
      );
      return res.status(200).json({ accessToken: token });
    } catch (error) {
      res.status(500).send("User already exists");
    }
  });

  router.post("/login", async (req, res) => {
    const { email, hashedPassword } = req.body;
    try {
      const user = await User.findOne({ where: { email } });
      if (!user) return res.status(400).json({ message: "User not found!" });
      if (!(hashedPassword === user.password)) {
        return res.status(400).json({ message: "Invalid password!" });
      }
      const privateUser = {
        uuid_user: user.uuid_user,
        username: user.username,
        email: user.email,
        balance: user.balance,
        pfp_url: user.pfp_url,
        rank_pts: user.rank_pts,
      };
      const token = jwt.sign(
        { user: privateUser },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "1h" },
      );
      return res.status(200).json({ accessToken: token });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  });

  router.post("/tip", jwtMiddleware, async (req, res) => {
    const { receiver, tip_amount } = req.body;
    const uuid_user = receiver;
    try {
      if (tip_amount <= 0)
        return res.status(400).json({ message: "Invalid tip amount!" });

      const receiver = await User.findOne({ where: { uuid_user } });
      const sender = await User.findOne({
        where: { uuid_user: req.user.uuid_user },
      });

      if (tip_amount > sender.balance)
        return res
          .status(400)
          .json({ message: "You don't have enough money!" });

      if (!receiver || !sender)
        return res.status(400).json({ message: "User not found!" });
      if (sender === receiver)
        return res.status(400).json({ message: "You can't tip yourself!" });

      const newReceiverBalance =
        parseInt(receiver.balance) + parseInt(tip_amount);
      await receiver.update({ balance: newReceiverBalance });

      const newSenderBalance = parseInt(sender.balance) - parseInt(tip_amount);
      await sender.update({ balance: newSenderBalance });

      return res
        .status(200)
        .json({ message: "Tip successful!", new_balance: newSenderBalance });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  });

  return router;
}
