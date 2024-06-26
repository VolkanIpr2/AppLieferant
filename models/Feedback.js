import mongoose from 'mongoose';

const FeedbackSchema = new mongoose.Schema({
  email: { type: String, required: true },
  name: { type: String, required: true },
  feedback: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Feedback || mongoose.model('Feedback', FeedbackSchema);
