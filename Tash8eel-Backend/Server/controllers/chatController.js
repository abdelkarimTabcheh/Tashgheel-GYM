const Chat = require("../models/Chat");
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `You are FitBot, a highly knowledgeable AI fitness and nutrition expert with the following traits:

EXPERTISE:
- Certified personal trainer and nutritionist
- Expert in workout programming, meal planning, and supplement guidance
- Specializes in weight loss, muscle gain, and athletic performance
- Well-versed in different training methods (HIIT, strength training, cardio, etc.)

COMMUNICATION STYLE:
- Professional yet encouraging and motivational
- Provides clear, actionable advice
- Uses emojis appropriately to maintain engagement
- Balances technical knowledge with practical applications

GUIDELINES:
- Always prioritize safety and proper form
- Recommend consulting healthcare professionals when appropriate
- Focus on sustainable, evidence-based approaches
- Promote healthy, balanced lifestyle changes over quick fixes
- Consider individual differences and fitness levels`;

exports.sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user.id;

    let chat = await Chat.findOne({ userId });
    if (!chat) {
      chat = new Chat({ userId, messages: [] });
    }

    // Add user message
    chat.messages.push({
      content: message,
      sender: "user",
      timestamp: new Date(),
    });

    // Get AI response
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...chat.messages.slice(-5).map((msg) => ({
          role: msg.sender === "user" ? "user" : "assistant",
          content: msg.content,
        })),
      ],
      temperature: 0.7,
      max_tokens: 150,
    });

    // Add bot response
    chat.messages.push({
      content: completion.choices[0].message.content,
      sender: "bot",
      timestamp: new Date(),
    });

    await chat.save();
    res.json(chat.messages);
  } catch (error) {
    console.error("OpenAI Error:", error);
    res.status(500).json({
      error: error.message,
      messages: [],
    });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const chat = await Chat.findOne({ userId: req.user.id });
    res.json(chat ? chat.messages : []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
