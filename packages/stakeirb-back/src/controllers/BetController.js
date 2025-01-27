import express from "express";

const router = express.Router();

export default function (Bet) {
  // Create a bet
  router.post("/", async (req, res) => {
    try {
      const bet = await Bet.create(req.body);
      res.json(bet);
    } catch (error) {
      console.error("An error occurred:", error);
      res.status(500).send("An error occurred");
    }
  });

  // Get all bets
  router.get("/", async (req, res) => {
    try {
      const bets = await Bet.findAll();
      res.json(bets);
    } catch (error) {
      console.error("An error occurred:", error);
      res.status(500).send("An error occurred");
    }
  });

  // Get a specific bet by ID
  router.get("/:id", async (req, res) => {
    try {
      const bet = await Bet.findOne({
        where: { id: req.params.id },
        include: ["User", "Game"],
      });
      res.json(bet);
    } catch (error) {
      console.error("An error occurred:", error);
      res.status(500).send("An error occurred");
    }
  });

  // Get all bets from a specific user
  router.get("/user/:uuid_user", async (req, res) => {
    try {
      const bets = await Bet.findAll({
        where: { uuid_user: req.params.uuid_user },
        include: ["User", "Game"],
      });
      res.json(bets);
    } catch (error) {
      console.error("An error occurred:", error);
      res.status(500).send("An error occurred");
    }
  });

  return router;
}
