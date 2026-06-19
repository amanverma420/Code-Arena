const fallbackProblems = [
  {
    id: 1,
    title: "Add Two Numbers",
    difficulty: "Easy",
    acceptance_rate: 95.5,
    description: "Read two space-separated integers from standard input and print their sum to standard output.",
    companies: ["Google", "Meta", "Amazon"],
    related_topics: ["Basic Math", "Input/Output"],
    testcases: [
      { input: "5 7", output: "12" },
      { input: "-3 8", output: "5" }
    ]
  },
  {
    id: 2,
    title: "Reverse a String",
    difficulty: "Medium",
    acceptance_rate: 85.0,
    description: "Read a string from standard input and print its reversed version to standard output.",
    companies: ["Netflix", "Apple", "Microsoft"],
    related_topics: ["Strings", "Two Pointers"],
    testcases: [
      { input: "hello", output: "olleh" },
      { input: "CodeArena", output: "anerAedoC" }
    ]
  },
  {
    id: 3,
    title: "Fibonacci Number",
    difficulty: "Hard",
    acceptance_rate: 70.2,
    description: "Read an integer N from standard input and print the Nth Fibonacci number to standard output (where F(0)=0, F(1)=1, and F(N) = F(N-1) + F(N-2)).",
    companies: ["Bloomberg", "Uber"],
    related_topics: ["Recursion", "Dynamic Programming"],
    testcases: [
      { input: "5", output: "5" },
      { input: "10", output: "55" }
    ]
  }
];

export const getFallbackProblem = (difficulty) => {
  const filtered = fallbackProblems.filter(
    (p) => p.difficulty.toLowerCase() === difficulty.toLowerCase()
  );
  if (filtered.length === 0) return [fallbackProblems[0]]; // fallback to first
  
  // Return random problem from the filtered list in an array (to match aggregate response)
  const randomIndex = Math.floor(Math.random() * filtered.length);
  return [filtered[randomIndex]];
};

export default fallbackProblems;
