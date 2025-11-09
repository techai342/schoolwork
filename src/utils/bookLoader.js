// src/utils/bookLoader.js
import longQuestions from "../data/syllabus/physics/chapters/chapter1-electrostatics/longQuestions.json";

export const loadAllBooks = async () => {
  // Simulate small loading delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  return {
    physics: {
      bookInfo: {
        bookName: "Physics - Class 12th",
        author: "Punjab Textbook Board",
        totalChapters: 15,
        totalPages: 350,
        description:
          "Complete physics syllabus with electrostatics, current electricity, electromagnetism, and modern physics",
        lastUpdated: "2024-01-15",
        subjectCode: "PHY-12",
      },
      chapters: [
        {
          chapterNumber: 1,
          chapterName: "Electrostatics",
          duration: "8 hours",
          topics: [
            "Coulomb's Law",
            "Electric Field and Field Intensity",
            "Electric Flux",
            "Gauss's Law",
            "Capacitors and Capacitance",
          ],
          progress: 35,
          difficulty: "medium",
          importance: "high",
          questions: {
            long: longQuestions, // ✅ Loaded from JSON file
            short: [],
            mcqs: [],
            numericals: [],
          },
        },
      ],
    },
  };
};

// (Optional helper) - load specific book if needed
export const loadBook = async (bookName) => {
  const allBooks = await loadAllBooks();
  return allBooks[bookName];
};
