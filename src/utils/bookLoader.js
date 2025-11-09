// src/utils/bookLoader.js

export const loadAllBooks = async () => {
  // Simulate small loading delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // 🔹 Auto-import all files inside electrostatics folder
  const longQuestionModules = import.meta.glob(
    "../data/syllabus/physics/chapters/chapter1-electrostatics/Q*.jsx",
    { eager: true }
  );

  // Convert imported modules to array of question objects
  const longQuestions = Object.values(longQuestionModules).map((mod, index) => ({
    ...mod.default,
    id: mod.default?.id || index + 1,
  }));

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
            long: longQuestions, // ✅ Auto-loaded from files
            short: [],
            mcqs: [],
            numericals: [],
          },
        },
      ],
    },
  };
};

export const loadBook = async (bookName) => {
  const allBooks = await loadAllBooks();
  return allBooks[bookName];
};
