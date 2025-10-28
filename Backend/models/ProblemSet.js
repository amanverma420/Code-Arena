import mongoose from "mongoose";

const problemSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      required: true,
    },
    acceptance_rate: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true, 
    },
    companies: {
      type: [String],
      required: true,
    },
    related_topics: {
      type: [String],
      required: true,
    },
    testcases: {
      type: [
        {
          input: { type: String, required: true },
          output: { type: String, required: true },
        },
      ],
      //type: [String],
      required: true,
    },
  }
  // createdAt, updatedAt
);

const ProblemSet = mongoose.model("ProblemSet", problemSchema);

export default ProblemSet;