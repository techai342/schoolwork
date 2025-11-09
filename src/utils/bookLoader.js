// src/utils/bookLoader.js

// Mock data loader for books and chapters
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
          progress: 0,
          difficulty: "medium",
          importance: "high",
          questions: {
            long: [
              {
                id: "lq1",
                question: "State and explain Coulomb's law.",
                answer: "Coulomb's law states that the force between two point charges is directly proportional to the product of their charges and inversely proportional to the square of the distance between them.",
                marks: 6,
                difficulty: "medium"
              },
              {
                id: "lq2", 
                question: "Define electric field intensity and derive its expression for a point charge.",
                answer: "Electric field intensity at a point is defined as the force experienced per unit positive charge placed at that point...",
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
              }
            ]
          }
        },
        {
          chapterNumber: 2,
          chapterName: "Current Electricity", 
          duration: "6 hours",
          topics: ["Ohm's Law", "Resistance", "Kirchhoff's Laws", "Electrical Power"],
          progress: 0,
          difficulty: "medium",
          importance: "high",
          questions: {
            long: [],
            short: [],
            mcqs: []
          }
        }
      ]
    }
  };
};

export const loadBook = async (bookName) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const sampleBooks = {
    biology: {
      bookInfo: {
        bookName: "Biology - Class 12th",
        author: "Punjab Textbook Board", 
        totalChapters: 12,
        totalPages: 280,
        description: "Complete biology syllabus covering botany, zoology and human physiology",
        lastUpdated: "2024-01-10",
        subjectCode: "BIO-12"
      },
      chapters: [
        {
          chapterNumber: 1,
          chapterName: "Cell Biology",
          duration: "6 hours",
          topics: ["Cell Structure", "Cell Division", "Cell Functions"],
          progress: 0,
          difficulty: "medium",
          importance: "high",
          questions: {
            long: [
              {
                id: "lq1",
                question: "Describe the structure and functions of mitochondria.",
                answer: "Mitochondria are double-membraned organelles found in eukaryotic cells...",
                marks: 5,
                difficulty: "medium"
              }
            ],
            short: [],
            mcqs: []
          }
        }
      ]
    },
    english: {
      bookInfo: {
        bookName: "English - Class 12th",
        author: "Punjab Textbook Board",
        totalChapters: 8, 
        totalPages: 200,
        description: "English literature and grammar for class 12th",
        lastUpdated: "2024-01-12",
        subjectCode: "ENG-12"
      },
      chapters: [
        {
          chapterNumber: 1,
          chapterName: "Prose and Poetry",
          duration: "4 hours", 
          topics: ["Comprehension", "Grammar", "Writing Skills"],
          progress: 0,
          difficulty: "easy",
          importance: "medium",
          questions: {
            long: [],
            short: [],
            mcqs: []
          }
        }
      ]
    },
    computer: {
      bookInfo: {
        bookName: "Computer Science - Class 12th", 
        author: "Punjab Textbook Board",
        totalChapters: 10,
        totalPages: 320,
        description: "Programming and computer fundamentals for class 12th",
        lastUpdated: "2024-01-18",
        subjectCode: "CS-12"
      },
      chapters: [
        {
          chapterNumber: 1,
          chapterName: "Programming Fundamentals",
          duration: "7 hours",
          topics: ["C++ Basics", "Data Types", "Control Structures"],
          progress: 0, 
          difficulty: "hard",
          importance: "high",
          questions: {
            long: [],
            short: [],
            mcqs: []
          }
        }
      ]
    }
  };
  
  return sampleBooks[bookName] || null;
};
