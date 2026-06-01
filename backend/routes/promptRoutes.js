const express = require('express');
const router = express.Router();
const Prompt = require('../models/Prompt');

// @route   POST /api/prompts
// @desc    Create a new base prompt OR a new version/variation of an existing prompt
router.post('/', async (req, res) => {
  try {
    const { title, positivePrompt, negativePrompt, parameters, imageUrls, parentPrompt, tags } = req.body;

    // If a parentPrompt ID is provided, optionally verify it exists first
    if (parentPrompt) {
      const parentExists = await Prompt.findById(parentPrompt);
      if (!parentExists) {
        return res.status(404).json({ message: 'Parent prompt version not found.' });
      }
    }

    const newPrompt = new Prompt({
      title,
      positivePrompt,
      negativePrompt,
      parameters,
      imageUrls,
      parentPrompt: parentPrompt || null,
      tags
    });

    const savedPrompt = await newPrompt.save();
    res.status(201).json(savedPrompt);
  } catch (error) {
    res.status(500).json({ message: 'Error saving prompt version', error: error.message });
  }
});

// @route   GET /api/prompts
// @desc    Get all root-level prompts (useful for the main dashboard feed)
router.get('/', async (req, res) => {
  try {
    // Only fetch root prompts (where parentPrompt is null) to avoid cluttering the main grid
    const rootPrompts = await Prompt.find({ parentPrompt: null }).sort({ createdAt: -1 });
    res.status(200).json(rootPrompts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard prompts', error: error.message });
  }
});

// @route   GET /api/prompts/:id
// @desc    Get a specific prompt details
router.get('/:id', async (req, res) => {
  try {
    const prompt = await Prompt.findById(req.params.id);
    if (!prompt) {
      return res.status(404).json({ message: 'Prompt variation not found.' });
    }
    res.status(200).json(prompt);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching prompt details', error: error.message });
  }
});

// @route   GET /api/prompts/:id/history
// @desc    Get the entire evolutionary lineage (all variations) originating from or linked to a prompt
router.get('/:id/history', async (req, res) => {
  try {
    const currentId = req.params.id;
    
    // Find variations that consider this prompt (or its parent) part of their tree
    // For the MVP, this fetches direct sub-versions of the targeted prompt
    const variations = await Prompt.find({
      $or: [
        { _id: currentId },
        { parentPrompt: currentId }
      ]
    }).sort({ createdAt: 1 });

    res.status(200).json(variations);
  } catch (error) {
    res.status(500).json({ message: 'Error compiling lineage tree', error: error.message });
  }
});

module.exports = router;