import mongoose from 'mongoose';

// Subject Schema
const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  // ... other fields
});

// Rubrics Schema
const rubricsSchema = new mongoose.Schema({
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true
  },
  criteria: [{
    title: String,
    description: String,
    marks: Number,
    order: Number
  }],
}, { timestamps: true });

// Export models only if they haven't been compiled yet
export const Subject = mongoose.models.Subject || mongoose.model('Subject', subjectSchema);
export const Rubrics = mongoose.models.Rubrics || mongoose.model('Rubrics', rubricsSchema); 