const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    messages: [
      {
        content: {
          type: String,
          required: true,
        },
        sender: {
          type: String,
          enum: ["user", "bot"],
          required: true,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

// Add index for better query performance
chatSchema.index({ userId: 1 });

module.exports = mongoose.model("Chat", chatSchema);
