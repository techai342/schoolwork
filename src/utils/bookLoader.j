// src/utils/bookLoader.js

export const loadAllBooks = async () => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    physics: {
      bookInfo: {
        bookName: "Physics - Class 12th",
        author: "Punjab Textbook Board",
        totalChapters: 15,
        totalPages: 350,
        description: "Complete physics syllabus with electrostatics, current electricity, electromagnetism, and modern physics",
        lastUpdated: "2024-01-15",
        subjectCode: "PHY-12"
      },
      chapters: [
        {
          chapterNumber: 1,
          chapterName: "Electrostatics",
          duration: "8 hours",
          topics: [
            "Coulomb's Law",
            "Electric Field and Field Intensity", 
            "Electric Field Lines",
            "Electric Flux",
            "Gauss's Law",
            "Electric Potential",
            "Capacitors and Capacitance",
            "Millikan's Oil Drop Experiment"
          ],
          progress: 35,
          difficulty: "medium",
          importance: "high",
          questions: {
            long: [
              {
                id: "lq1",
                question: "State and explain Coulomb's law.",
                answer: "Coulomb's law states that the force between two point charges is directly proportional to the product of their charges and inversely proportional to the square of the distance between them. F = k(q1q2)/r²",
                marks: 6,
                difficulty: "medium"
              },
              {
                id: "lq2",
                question: "Define electric field intensity and derive its expression.",
                answer: "Electric field intensity at a point is defined as the force experienced per unit positive charge placed at that point. E = F/q",
                marks: 5,
                difficulty: "medium"
              }
            ],
            short: [
              {
                id: "sq1",
                question: "What is electric flux?",
                answer: "Electric flux is the number of electric field lines passing through a given area.",
                marks: 2,
                difficulty: "easy"
              },
              {
                id: "sq2",
                question: "Define electric potential.",
                answer: "Electric potential at a point is the work done in bringing a unit positive charge from infinity to that point.",
                marks: 2,
                difficulty: "easy"
              }
            ],
            mcqs: [
              {
                id: "mcq1",
                question: "The SI unit of electric charge is:",
                options: ["Ampere", "Coulomb", "Volt", "Ohm"],
                answer: "Coulomb",
                marks: 1,
                difficulty: "easy"
              },
              {
                id: "mcq2",
                question: "Which of the following is a vector quantity?",
                options: ["Charge", "Potential", "Field Intensity", "Energy"],
                answer: "Field Intensity",
                marks: 1,
                difficulty: "medium"
              }
            ],
            numericals: [
              {
                id: "num1",
                question: "Calculate the force between two charges of 2μC and 3μC separated by 0.1m in air.",
                answer: "Using Coulomb's law: F = (9×10^9 × 2×10^-6 × 3×10^-6)/(0.1)^2 = 5.4N",
                marks: 3,
                difficulty: "medium"
              }
            ]
          }
        },
        {
          chapterNumber: 2,
          chapterName: "Current Electricity",
          duration: "6 hours",
          topics: ["Ohm's Law", "Resistance", "Kirchhoff's Laws", "Electrical Power"],
          progress: 20,
          difficulty: "medium",
          importance: "high",
          questions: {
            long: [
              {
                id: "lq1",
                question: "State and explain Ohm's law.",
                answer: "Ohm's law states that the current through a conductor between two points is directly proportional to the voltage across the two points, provided the physical conditions remain unchanged.",
                marks: 5,
                difficulty: "easy"
              }
            ],
            short: [
              {
                id: "sq1",
                question: "Define resistance.",
                answer: "Resistance is the opposition offered by a material to the flow of electric current.",
                marks: 2,
                difficulty: "easy"
              }
            ],
            mcqs: [
              {
                id: "mcq1",
                question: "The SI unit of resistance is:",
                options: ["Volt", "Ampere", "Ohm", "Watt"],
                answer: "Ohm",
                marks: 1,
                difficulty: "easy"
              }
            ],
            numericals: []
          }
        }
      ]
    },
    chemistry: {
      bookInfo: {
        bookName: "Chemistry - Class 12th",
        author: "Punjab Textbook Board",
        totalChapters: 12,
        totalPages: 300,
        description: "Complete chemistry syllabus with organic, inorganic and physical chemistry",
        lastUpdated: "2024-01-10",
        subjectCode: "CHEM-12"
      },
      chapters: [
        {
          chapterNumber: 1,
          chapterName: "Atomic Structure",
          duration: "5 hours",
          topics: ["Atomic Models", "Electron Configuration", "Quantum Numbers"],
          progress: 0,
          difficulty: "hard",
          importance: "high",
          questions: {
            long: [],
            short: [],
            mcqs: [],
            numericals: []
          }
        },
        {
          chapterNumber: 2,
          chapterName: "Chemical Bonding",
          duration: "6 hours",
          topics: ["Covalent Bond", "Ionic Bond", "Metallic Bond"],
          progress: 10,
          difficulty: "medium",
          importance: "high",
          questions: {
            long: [],
            short: [],
            mcqs: [],
            numericals: []
          }
        }
      ]
    },
    mathematics: {
      bookInfo: {
        bookName: "Mathematics - Class 12th",
        author: "Punjab Textbook Board",
        totalChapters: 13,
        totalPages: 400,
        description: "Complete mathematics syllabus with calculus, algebra, and geometry",
        lastUpdated: "2024-01-12",
        subjectCode: "MATH-12"
      },
      chapters: [
        {
          chapterNumber: 1,
          chapterName: "Functions and Limits",
          duration: "7 hours",
          topics: ["Types of Functions", "Limits", "Continuity"],
          progress: 0,
          difficulty: "hard",
          importance: "high",
          questions: {
            long: [],
            short: [],
            mcqs: [],
            numericals: []
          }
        }
      ]
    }
  };
};

export const loadBook = async (bookName) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const allBooks = await loadAllBooks();
  return allBooks[bookName] || null;
};
