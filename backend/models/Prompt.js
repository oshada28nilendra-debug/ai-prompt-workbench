const mongoose = require('mongoose');

const PromptSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    default: "Untitled Generation"
  },
  positivePrompt: {
    type: String,
    required: true,
    trim: true
  },
  negativePrompt: {
    type: String,
    trim: true,
    default: ""
  },
  // Captures specialized generation parameters for high-quality adjustments
  parameters: {
    seed: { type: Number, default: -1 },
    aspectRatio: { type: String, default: "16:9" },
    model: { type: String, default: "Midjourney v6" },
    stylize: { type: Number, default: 100 },
    chaos: { type: Number, default: 0 }
  },
  // Array of image links showcasing the 4K rendering outputs
  imageUrls: [{
    type: String,
    trim: true
  }],
  // Self-referencing field to track prompt lineage and versions
  parentPrompt: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Prompt',
    default: null
  },
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true // Automatically creates createdAt and updatedAt fields
});

module.exports = mongoose.model('Prompt', PromptSchema);