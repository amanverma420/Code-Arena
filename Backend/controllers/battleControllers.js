import ProblemSet from "../models/ProblemSet.js";

export async function allocateProblem(req, res) {
  try {
    const { difficulty } = req.body;
    const problem = await ProblemSet.aggregate([
      { $match: { difficulty: difficulty} },
      { $sample: { size: 1 } }
    ]); 
    if (problem) {
      res.status(200).json({ message: "Problem allocated", problem: problem });
    } else {
      res.status(404).json({ message: "No available problem found" });
    }
  } catch (error) {
    console.error("Error in allocateProblem controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}