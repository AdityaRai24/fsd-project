import mongoose, { Schema } from "mongoose";

const criterionSchema = new Schema({
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  marks: { 
    type: Number, 
    required: true,
    min: 0,
    max: 7,
    default: 5
  },
  isNull : {
    type : Boolean,
    default : false
  },
  order: {
    type: Number,
    required: true
  }
});

const rubricsSchema = new Schema({
  subject: { 
    type: Schema.Types.ObjectId, 
    ref: "Subject",
    required: true 
  },
  criteria: [criterionSchema],
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true // This will automatically handle createdAt and updatedAt
});

rubricsSchema.pre('save', function(next) {
  if (this.criteria.length < 1 || this.criteria.length > 10) {
    next(new Error('Rubrics must have between 1 and 10 criteria'));
  }
  next();
});

const Rubrics = mongoose.model("Rubrics", rubricsSchema);

export default Rubrics; 