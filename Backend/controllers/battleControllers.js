import ProblemSet from "../models/ProblemSet.js";
import { getFallbackProblem } from "../services/fallbackProblemStore.js";
import { dbConnected } from "../config/db.js";

export async function allocateProblem(req, res) {
  try {
    const { difficulty } = req.body;
    let problem = null;

    if (dbConnected) {
      try {
        problem = await ProblemSet.aggregate([
          { $match: { difficulty: difficulty} },
          { $sample: { size: 1 } }
        ]); 
      } catch (dbError) {
        console.error("Database problem fetch failed, using fallback:", dbError);
      }
    }

    if (!problem || problem.length === 0) {
      console.log(`Using fallback problem for difficulty: ${difficulty}`);
      problem = getFallbackProblem(difficulty);
    }

    if (problem && problem.length > 0) {
      res.status(200).json({ message: "Problem allocated", problem: problem });
    } else {
      res.status(404).json({ message: "No available problem found" });
    }
  } catch (error) {
    console.error("Error in allocateProblem controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}