// controllers/GameController.js

import express from 'express';

const router = express.Router();

export default function (Game) {
  // Create a game
  router.post('/', async (req, res) => {
    try {
      const game = await Game.create(req.body);
      res.json(game);
    } catch (error) {
      console.error('An error occurred:', error);
      res.status(500).send('An error occurred');
    }
  });

  // Get all games
  router.get('/', async (req, res) => {
    try {
      const games = await Game.findAll();
      res.json(games);
    } catch (error) {
      console.error('An error occurred:', error);
      res.status(500).send('An error occurred');
    }
  });

  // Get a specific game by slug
  router.get('/:slug', async (req, res) => {
    try {
      const game = await Game.findOne({ where: { slug: req.params.slug } });
      res.json(game);
    } catch (error) {
      console.error('An error occurred:', error);
      res.status(500).send('An error occurred');
    }
  });

  // Update a game by slug
  router.put('/:slug', async (req, res) => {
    try {
      const game = await Game.findOne({ where: { slug: req.params.slug } });
      game.update(req.body);
      res.json(game);
    } catch (error) {
      console.error('An error occurred:', error);
      res.status(500).send('An error occurred');
    }
  });

  // Delete a game by slug
  router.delete('/:slug', async (req, res) => {
    try {
      const game = await Game.findOne({ where: { slug: req.params.slug } });
      game.destroy();
      res.json(game);
    } catch (error) {
      console.error('An error occurred:', error);
      res.status(500).send('An error occurred');
    }
  });

  return router;
}