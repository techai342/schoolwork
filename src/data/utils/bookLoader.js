// src/utils/bookLoader.js

// This function automatically loads all books from the syllabus folder
export const loadAllBooks = async () => {
  try {
    // In a real app, you would fetch from an API or file system
    // For now, we'll use mock data that can be easily extended
    
    const booksData = {
      physics: await loadBook('physics'),
      chemistry: await loadBook('chemistry'),
      math: await loadBook('math')
    };
    
    return booksData;
  } catch (error) {
    console.error('Error loading books:', error);
    return {};
  }
};

// Load individual book with all chapters
export const loadBook = async (bookName) => {
  try {
    // This would be an API call in production
    // For demo, we return mock data
    const mockBooks = {
      physics: {
        bookInfo: {
          bookName: "Physics - Class 11th",
          author: "NCERT",
          totalChapters: 10,
          totalPages: 350,
          description: "Complete physics syllabus with numerical problems and theory",
          lastUpdated: "2024-01-15"
        },
        chapters: await loadChapters('physics')
      },
      chemistry: {
        bookInfo: {
          bookName: "Chemistry - Class 11th", 
          author: "NCERT",
          totalChapters: 8,
          totalPages: 300,
          description: "Complete chemistry syllabus with organic and inorganic chemistry",
          lastUpdated: "2024-01-10"
        },
        chapters: await loadChapters('chemistry')
      },
      math: {
        bookInfo: {
          bookName: "Mathematics - Class 11th",
          author: "NCERT",
          totalChapters: 12, 
          totalPages: 400,
          description: "Complete mathematics syllabus with algebra, calculus and geometry",
          lastUpdated: "2024-01-12"
        },
        chapters: await loadChapters('math')
      }
    };
    
    return mockBooks[bookName] || null;
  } catch (error) {
    console.error(`Error loading book ${bookName}:`, error);
    return null;
  }
};

// Load all chapters for a book
export const loadChapters = async (bookName) => {
  // Mock chapters data - in real app, this would come from API/database
  const allChapters = {
    physics: [
      createChapter(1, "Physical World and Measurement", "4 hours", 0),
      createChapter(2, "Motion in a Straight Line", "5 hours", 25),
      createChapter(3, "Laws of Motion", "6 hours", 0),
      createChapter(4, "Work, Energy and Power", "5 hours", 0),
      createChapter(5, "System of Particles and Rotational Motion", "6 hours", 0),
    ],
    chemistry: [
      createChapter(1, "Some Basic Concepts of Chemistry", "3 hours", 40),
      createChapter(2, "Structure of Atom", "4 hours", 0),
      createChapter(3, "Classification of Elements", "3 hours", 0),
    ],
    math: [
      createChapter(1, "Sets", "5 hours", 75),
      createChapter(2, "Relations and Functions", "6 hours", 0),
      createChapter(3, "Trigonometric Functions", "7 hours", 0),
    ]
  };
  
  return allChapters[bookName] || [];
};

// Helper function to create chapter structure
const createChapter = (number, name, duration, progress) => ({
  chapterNumber: number,
  chapterName: name,
  duration: duration,
  topics: getTopicsByChapter(name),
  progress: progress,
  questions: generateQuestions(name)
});

// Auto-generate topics based on chapter name
const getTopicsByChapter = (chapterName) => {
  const topicMap = {
    "Physical World and Measurement": [
      "Physical World", "Units and Measurements", 
      "Measurement of Length", "Accuracy and Precision"
    ],
    "Motion in a Straight Line": [
      "Position and Displacement", "Speed and Velocity", 
      "Acceleration", "Equations of Motion"
    ],
    "Laws of Motion": [
      "Newton's First Law", "Newton's Second Law", 
      "Newton's Third Law", "Friction"
    ],
    "Some Basic Concepts of Chemistry": [
      "Matter and its Classification", "Properties of Matter", 
      "Uncertainty in Measurement", "Laws of Chemical Combination"
    ],
    "Sets": [
      "Sets and their Representations", "Types of Sets", 
      "Venn Diagrams", "Operations on Sets"
    ]
  };
  
  return topicMap[chapterName] || ["Main Concepts", "Important Topics", "Key Points"];
};

// Auto-generate questions based on chapter
const generateQuestions = (chapterName) => {
  const questionTemplates = {
    long: [
      {
        question: `Explain the main concepts of ${chapterName} with examples.`,
        answer: `The main concepts of ${chapterName} include... (Detailed explanation would go here)`,
        marks: 5
      }
    ],
    short: [
      {
        question: `What is the basic principle of ${chapterName}?`,
        answer: `The basic principle involves...`,
        marks: 2
      },
      {
        question: `Define key terms in ${chapterName}.`,
        answer: `Key terms are defined as...`,
        marks: 2
      }
    ],
    mcqs: [
      {
        question: `Which of the following is related to ${chapterName}?`,
        options: ["Option A", "Option B", "Option C", "Option D"],
        answer: "Option A",
        marks: 1
      }
    ]
  };
  
  return questionTemplates;
};