import React, { useState, useEffect } from "react";
import { 
  BookOpen, Brain, Clock, Download, MessageCircle, ChevronRight, 
  CheckCircle, FolderOpen, RefreshCw, Plus, ArrowLeft, Grid, List,
  FileText, Hash, Edit3, Calculator
} from "lucide-react";

// CORRECT IMPORT - Use the actual bookLoader
import { loadAllBooks, loadBook } from "../utils/bookLoader";

export default function SyllabusPage() {
  const [currentView, setCurrentView] = useState("books");
  const [selectedBook, setSelectedBook] = useState("");
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [selectedQuestionType, setSelectedQuestionType] = useState("long");
  const [booksData, setBooksData] = useState({});
  const [isLoadingBooks, setIsLoadingBooks] = useState(true);
  const [availableBooks, setAvailableBooks] = useState([]);

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    setIsLoadingBooks(true);
    try {
      const data = await loadAllBooks();
      setBooksData(data);
      const bookNames = Object.keys(data);
      setAvailableBooks(bookNames);
    } catch (error) {
      console.error('Error loading books:', error);
    } finally {
      setIsLoadingBooks(false);
    }
  };

  const handleBookSelect = (bookName) => {
    setSelectedBook(bookName);
    setCurrentView("chapters");
  };

  const handleChapterSelect = (chapter) => {
    setSelectedChapter(chapter);
    setCurrentView("questions");
  };

  const handleBackToBooks = () => {
    setCurrentView("books");
    setSelectedBook("");
  };

  const handleBackToChapters = () => {
    setCurrentView("chapters");
    setSelectedChapter(null);
  };

  const getQuestionTypeIcon = (type) => {
    switch (type) {
      case 'long': return <FileText className="w-5 h-5" />;
      case 'short': return <Edit3 className="w-5 h-5" />;
      case 'mcqs': return <List className="w-5 h-5" />;
      case 'numericals': return <Calculator className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  const getQuestionTypeColor = (type) => {
    switch (type) {
      case 'long': return "bg-blue-500";
      case 'short': return "bg-green-500";
      case 'mcqs': return "bg-purple-500";
      case 'numericals': return "bg-orange-500";
      default: return "bg-gray-500";
    }
  };

  if (isLoadingBooks) {
    return (
      <div className="min-h-screen pb-24 bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading books...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto p-4">
        {/* Header */}
        <div className="text-center mb-8 pt-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Smart Syllabus
            </h1>
          </div>
          
          {/* Breadcrumb Navigation */}
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
            {currentView !== "books" && (
              <>
                <button 
                  onClick={handleBackToBooks}
                  className="hover:text-blue-600 transition-colors"
                >
                  Books
                </button>
                <ChevronRight className="w-4 h-4" />
              </>
            )}
            {currentView === "questions" && (
              <>
                <button 
                  onClick={handleBackToChapters}
                  className="hover:text-blue-600 transition-colors"
                >
                  {booksData[selectedBook]?.bookInfo.bookName}
                </button>
                <ChevronRight className="w-4 h-4" />
              </>
            )}
            <span className="font-semibold text-gray-900 dark:text-white">
              {currentView === "books" && "All Books"}
              {currentView === "chapters" && booksData[selectedBook]?.bookInfo.bookName}
              {currentView === "questions" && selectedChapter?.chapterName}
            </span>
          </div>
        </div>

        {/* LEVEL 1: BOOKS LIST */}
        {currentView === "books" && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Select Your Book
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Choose a subject to explore chapters and questions
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableBooks.map((bookName) => {
                const book = booksData[bookName];
                return (
                  <div
                    key={bookName}
                    onClick={() => handleBookSelect(bookName)}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                          {book.bookInfo.bookName}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {book.bookInfo.author}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex justify-between">
                        <span>Chapters:</span>
                        <span className="font-semibold">{book.bookInfo.totalChapters}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Pages:</span>
                        <span className="font-semibold">{book.bookInfo.totalPages}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {book.bookInfo.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* LEVEL 2: CHAPTERS LIST */}
        {currentView === "chapters" && booksData[selectedBook] && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={handleBackToBooks}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Books
              </button>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {booksData[selectedBook].bookInfo.bookName}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Select a chapter to view questions
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {booksData[selectedBook].chapters.map((chapter) => (
                <div
                  key={chapter.chapterNumber}
                  onClick={() => handleChapterSelect(chapter)}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 cursor-pointer hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-2">
                        Chapter {chapter.chapterNumber}: {chapter.chapterName}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                        {chapter.topics?.slice(0, 3).join(', ')}
                        {chapter.topics?.length > 3 && '...'}
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 mt-1" />
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-3">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {chapter.duration}
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs ${
                        chapter.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                        chapter.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {chapter.difficulty}
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${chapter.progress}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Progress</span>
                    <span>{chapter.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* LEVEL 3: QUESTIONS LIST */}
        {currentView === "questions" && selectedChapter && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={handleBackToChapters}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Chapters
              </button>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {selectedChapter.chapterName}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Choose question type to practice
                </p>
              </div>
            </div>

            {/* Question Type Tabs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {['long', 'short', 'mcqs', 'numericals'].map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedQuestionType(type)}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                    selectedQuestionType === type
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                      : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-gray-300"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    selectedQuestionType === type ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600'
                  }`}>
                    {getQuestionTypeIcon(type)}
                  </div>
                  <div className="text-left">
                    <div className="font-semibold capitalize">
                      {type === 'mcqs' ? 'MCQs' : type === 'numericals' ? 'Numericals' : type + ' Questions'}
                    </div>
                    <div className="text-sm opacity-75">
                      {selectedChapter.questions[type]?.length || 0} questions
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Questions List */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  {getQuestionTypeIcon(selectedQuestionType)}
                  {selectedQuestionType === 'mcqs' ? 'MCQ Questions' : 
                   selectedQuestionType === 'numericals' ? 'Numerical Problems' : 
                   selectedQuestionType.charAt(0).toUpperCase() + selectedQuestionType.slice(1) + ' Questions'}
                </h3>
              </div>

              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {selectedChapter.questions[selectedQuestionType]?.map((q, index) => (
                  <div key={q.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${getQuestionTypeColor(selectedQuestionType)}`}>
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900 dark:text-white mb-2 text-lg">
                              {q.question}
                            </p>
                            
                            {q.options && (
                              <div className="space-y-2 mb-3">
                                {q.options.map((option, optIndex) => (
                                  <div key={optIndex} className="flex items-center gap-3">
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                      option === q.answer 
                                        ? 'border-green-500 bg-green-500 text-white' 
                                        : 'border-gray-300 text-transparent'
                                    }`}>
                                      {option === q.answer && '✓'}
                                    </div>
                                    <span className={`text-sm ${
                                      option === q.answer 
                                        ? 'text-green-600 font-semibold' 
                                        : 'text-gray-600 dark:text-gray-400'
                                    }`}>
                                      {option}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}
                            
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                              <p className="text-blue-800 dark:text-blue-200">
                                <strong className="text-blue-900 dark:text-blue-100">Answer: </strong>
                                {q.answer}
                              </p>
                              {q.marks && (
                                <div className="mt-2 inline-block px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300 rounded text-sm font-semibold">
                                  {q.marks} marks
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {(!selectedChapter.questions[selectedQuestionType] || selectedChapter.questions[selectedQuestionType].length === 0) && (
                  <div className="p-8 text-center">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400 text-lg">
                      No {selectedQuestionType} questions available for this chapter yet.
                    </p>
                    <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
                      Check back later or try another question type.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
