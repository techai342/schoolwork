// src/pages/SyllabusPage.jsx
import React, { useState, useEffect } from "react";
import { BookOpen, Brain, Clock, Download, MessageCircle, ChevronRight, Target, CheckCircle, FolderOpen, RefreshCw, Plus } from "lucide-react";
import { loadAllBooks, loadBook } from "../utils/bookLoader";

export default function SyllabusPage() {
  const [selectedBook, setSelectedBook] = useState("");
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [selectedQuestionType, setSelectedQuestionType] = useState("long");
  const [showAIExplain, setShowAIExplain] = useState(false);
  const [aiQuestion, setAiQuestion] = useState("");
  const [aiExplanation, setAiExplanation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [booksData, setBooksData] = useState({});
  const [isLoadingBooks, setIsLoadingBooks] = useState(true);
  const [availableBooks, setAvailableBooks] = useState([]);

  // Load all books on component mount
  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    setIsLoadingBooks(true);
    try {
      const data = await loadAllBooks();
      setBooksData(data);
      
      // Extract available book names
      const bookNames = Object.keys(data);
      setAvailableBooks(bookNames);
      
      // Auto-select first book if available
      if (bookNames.length > 0 && !selectedBook) {
        setSelectedBook(bookNames[0]);
      }
    } catch (error) {
      console.error('Error loading books:', error);
    } finally {
      setIsLoadingBooks(false);
    }
  };

  // Add new book dynamically
  const addNewBook = async (bookName) => {
    setIsLoadingBooks(true);
    try {
      const newBook = await loadBook(bookName);
      if (newBook) {
        setBooksData(prev => ({
          ...prev,
          [bookName]: newBook
        }));
        setAvailableBooks(prev => [...prev, bookName]);
        setSelectedBook(bookName);
      }
    } catch (error) {
      console.error('Error adding new book:', error);
    } finally {
      setIsLoadingBooks(false);
    }
  };

  // Sample new books that can be added
  const sampleNewBooks = [
    { id: 'biology', name: 'Biology' },
    { id: 'english', name: 'English' },
    { id: 'computer', name: 'Computer Science' }
  ];

  const explainWithAI = async (question, answer) => {
    setAiQuestion(question);
    setShowAIExplain(true);
    setIsLoading(true);
    
    try {
      const response = await fetch('https://api.nekolabs.web.id/ai/cf/gpt-oss-120b', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Question: ${question}\nAnswer: ${answer}\n\nPlease explain this question and answer in simple terms with examples that a student can understand easily.`,
          context: "You are a helpful tutor explaining concepts to students. Keep it clear and engaging."
        })
      });

      const data = await response.json();
      setAiExplanation(data.response || `I'll help you understand this concept: ${question}. Let me break it down for you...`);
    } catch (error) {
      setAiExplanation(`I'd love to explain this! The question "${question}" has the answer: "${answer}". In simple terms, this is an important concept that helps build your foundation. Would you like me to go into more specific details?`);
    } finally {
      setIsLoading(false);
    }
  };

  const getQuestionIcon = (type) => {
    switch (type) {
      case 'mcqs': return '🔘';
      case 'short': return '📝';
      case 'long': return '📄';
      default: return '❓';
    }
  };

  const currentBook = booksData[selectedBook];
  const questionTypes = ["long", "short", "mcqs"];

  if (isLoadingBooks) {
    return (
      <div className="min-h-screen pb-24 bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading books and chapters...</p>
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
              Smart Syllabus & Study Materials
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Auto-detected books and chapters with AI-powered explanations
          </p>
        </div>

        {/* AI Explanation Modal */}
        {showAIExplain && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
              <div className="flex items-center gap-3 p-6 border-b border-gray-200 dark:border-gray-700">
                <Brain className="w-6 h-6 text-purple-600" />
                <h3 className="text-xl font-bold">AI Explanation</h3>
                <button 
                  onClick={() => setShowAIExplain(false)}
                  className="ml-auto text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-4">
                  <p className="font-semibold text-blue-900 dark:text-blue-100">Your Question:</p>
                  <p className="mt-1 text-blue-800 dark:text-blue-200">{aiQuestion}</p>
                </div>
                
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="w-4 h-4 text-purple-600" />
                    <p className="font-semibold text-purple-900 dark:text-purple-100">AI Explanation:</p>
                  </div>
                  {isLoading ? (
                    <div className="flex items-center gap-2 text-purple-600">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-purple-600 border-t-transparent"></div>
                      <p>AI is thinking...</p>
                    </div>
                  ) : (
                    <p className="text-purple-800 dark:text-purple-200 leading-relaxed">
                      {aiExplanation}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex gap-2 p-6 border-t border-gray-200 dark:border-gray-700">
                <button 
                  onClick={() => setShowAIExplain(false)}
                  className="flex-1 px-4 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Close
                </button>
                <button className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Ask Follow-up
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Book Selection with Add New */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {availableBooks.map((book) => (
              <button
                key={book}
                onClick={() => {
                  setSelectedBook(book);
                  setSelectedChapter(null);
                }}
                className={`px-6 py-3 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                  selectedBook === book
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750"
                }`}
              >
                {booksData[book]?.bookInfo.bookName || book}
              </button>
            ))}
          </div>

          {/* Add New Books Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add More Books
            </h3>
            <div className="flex gap-2 overflow-x-auto">
              {sampleNewBooks.map((book) => (
                <button
                  key={book.id}
                  onClick={() => addNewBook(book.id)}
                  disabled={availableBooks.includes(book.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                    availableBooks.includes(book.id)
                      ? "bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed"
                      : "bg-green-500 text-white hover:bg-green-600"
                  }`}
                >
                  {book.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Book Info */}
        {currentBook && (
          <>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 mb-6">
              <div className="flex items-center gap-4">
                <FolderOpen className="w-12 h-12 text-blue-600" />
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {currentBook.bookInfo.bookName}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400">
                        Author: {currentBook.bookInfo.author} | 
                        Chapters: {currentBook.bookInfo.totalChapters} | 
                        Pages: {currentBook.bookInfo.totalPages}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {currentBook.bookInfo.description}
                      </p>
                    </div>
                    <button
                      onClick={loadBooks}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Refresh
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Chapters Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {currentBook.chapters.map((chapter) => (
                <div
                  key={chapter.chapterNumber}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
                  onClick={() => setSelectedChapter(selectedChapter?.chapterNumber === chapter.chapterNumber ? null : chapter)}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">
                          Chapter {chapter.chapterNumber}: {chapter.chapterName}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Topics: {chapter.topics?.join(', ')}
                        </p>
                      </div>
                      <ChevronRight 
                        className={`w-5 h-5 text-gray-400 transition-transform ${
                          selectedChapter?.chapterNumber === chapter.chapterNumber ? 'rotate-90' : ''
                        }`} 
                      />
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4 text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {chapter.duration}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        <span>{
                          (chapter.questions.long?.length || 0) + 
                          (chapter.questions.short?.length || 0) + 
                          (chapter.questions.mcqs?.length || 0)
                        } Qs</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-3">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${chapter.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Expanded Questions */}
                  {selectedChapter?.chapterNumber === chapter.chapterNumber && (
                    <div className="border-t border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-750">
                      {/* Question Type Tabs */}
                      <div className="flex gap-2 mb-4 overflow-x-auto">
                        {questionTypes.map((type) => (
                          <button
                            key={type}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedQuestionType(type);
                            }}
                            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                              selectedQuestionType === type
                                ? "bg-blue-600 text-white"
                                : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600"
                            }`}
                          >
                            {type.toUpperCase()} Questions
                          </button>
                        ))}
                      </div>

                      <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <MessageCircle className="w-4 h-4" />
                        {selectedQuestionType.toUpperCase()} Questions
                      </h4>
                      
                      <div className="space-y-4 max-h-96 overflow-y-auto">
                        {chapter.questions[selectedQuestionType]?.map((q, qIndex) => (
                          <div key={qIndex} className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                            <div className="flex items-start gap-3">
                              <span className="text-lg">{getQuestionIcon(selectedQuestionType)}</span>
                              <div className="flex-1">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex-1">
                                    <p className="font-semibold text-gray-900 dark:text-white mb-2">
                                      {q.question}
                                    </p>
                                    {q.options && (
                                      <div className="space-y-1 mb-2">
                                        {q.options.map((option, optIndex) => (
                                          <div key={optIndex} className="flex items-center gap-2 text-sm">
                                            <div className={`w-4 h-4 rounded-full border-2 ${
                                              option === q.answer 
                                                ? 'border-green-500 bg-green-500' 
                                                : 'border-gray-300'
                                            }`}></div>
                                            <span className={option === q.answer ? 'text-green-600 font-semibold' : 'text-gray-600 dark:text-gray-400'}>
                                              {option}
                                            </span>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                    <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                                      <strong>Answer:</strong> {q.answer}
                                      {q.marks && <span className="ml-2 text-blue-600">({q.marks} marks)</span>}
                                    </p>
                                  </div>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      explainWithAI(q.question, q.answer);
                                    }}
                                    className="flex items-center gap-1 px-3 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 transition-colors whitespace-nowrap"
                                  >
                                    <Brain className="w-3 h-3" />
                                    AI Explain
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-lg mb-4 text-gray-900 dark:text-white">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
              <Download className="w-4 h-4" />
              Download PDF
            </button>
            <button className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
              <Brain className="w-4 h-4" />
              Ask AI Tutor
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
