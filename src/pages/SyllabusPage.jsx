// src/pages/SyllabusPage.jsx
import React, { useState } from "react";
import { BookOpen, Brain, Clock, Download, MessageCircle, ChevronRight, Target, CheckCircle } from "lucide-react";

export default function SyllabusPage() {
  const [selectedSubject, setSelectedSubject] = useState("Physics");
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [showAIExplain, setShowAIExplain] = useState(false);
  const [aiQuestion, setAiQuestion] = useState("");
  const [aiExplanation, setAiExplanation] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const syllabus = {
    Physics: {
      topics: [
        {
          name: "Laws of Motion",
          description: "Newton's three laws of motion and their applications",
          duration: "3 hours",
          progress: 75,
          questions: [
            {
              type: "short",
              question: "What is Newton's First Law of Motion?",
              answer: "An object at rest stays at rest and an object in motion stays in motion with the same speed and in the same direction unless acted upon by an unbalanced force."
            },
            {
              type: "mcq",
              question: "Which law explains why we wear seatbelts?",
              options: ["First Law", "Second Law", "Third Law", "Law of Gravitation"],
              answer: "First Law"
            },
            {
              type: "long",
              question: "Explain Newton's Third Law with examples from daily life.",
              answer: "For every action, there is an equal and opposite reaction. Examples: 1) When you push a wall, the wall pushes back with equal force. 2) Rocket propulsion - gases push downward, rocket moves upward."
            }
          ]
        },
        {
          name: "Electricity",
          description: "Electric current, circuits, and electrical properties",
          duration: "4 hours",
          progress: 50,
          questions: [
            {
              type: "short",
              question: "Define electric current.",
              answer: "Electric current is the flow of electric charge through a conductor."
            },
            {
              type: "mcq",
              question: "What is the unit of electrical resistance?",
              options: ["Volt", "Ampere", "Ohm", "Watt"],
              answer: "Ohm"
            }
          ]
        },
        {
          name: "Waves",
          description: "Wave properties, sound waves, and light waves",
          duration: "3 hours",
          progress: 30,
          questions: [
            {
              type: "short",
              question: "What is wavelength?",
              answer: "Wavelength is the distance between two consecutive crests or troughs of a wave."
            }
          ]
        },
        {
          name: "Optics",
          description: "Reflection, refraction, and lenses",
          duration: "3 hours",
          progress: 20,
          questions: [
            {
              type: "short",
              question: "What is the law of reflection?",
              answer: "The angle of incidence equals the angle of reflection."
            }
          ]
        }
      ]
    },
    Chemistry: {
      topics: [
        {
          name: "Atoms",
          description: "Atomic structure and properties",
          duration: "2 hours",
          progress: 80,
          questions: [
            {
              type: "short",
              question: "What are the three subatomic particles?",
              answer: "Protons, neutrons, and electrons."
            }
          ]
        },
        {
          name: "Periodic Table",
          description: "Elements and periodic trends",
          duration: "3 hours",
          progress: 60,
          questions: [
            {
              type: "short",
              question: "How many groups are in the periodic table?",
              answer: "18 groups"
            }
          ]
        }
      ]
    },
    Math: {
      topics: [
        {
          name: "Algebra",
          description: "Equations, functions, and graphs",
          duration: "5 hours",
          progress: 90,
          questions: [
            {
              type: "short",
              question: "What is the quadratic formula?",
              answer: "x = [-b ± √(b² - 4ac)] / 2a"
            }
          ]
        }
      ]
    }
  };

  const explainWithAI = async (question) => {
    setAiQuestion(question);
    setShowAIExplain(true);
    setIsLoading(true);
    
    try {
      // ChatGPT API call
      const response = await fetch('https://api.nekolabs.web.id/ai/cf/gpt-oss-120b', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Please explain this concept in simple terms with examples: ${question}`,
          context: "You are a helpful tutor explaining concepts to students. Keep it clear and engaging."
        })
      });

      const data = await response.json();
      setAiExplanation(data.response || "I'll help you understand this concept better. Let me break it down for you...");
    } catch (error) {
      setAiExplanation("I'd love to explain this! In simple terms, this concept deals with fundamental principles that help us understand how things work in the physical world. Would you like me to go into more specific details?");
    } finally {
      setIsLoading(false);
    }
  };

  const getQuestionIcon = (type) => {
    switch (type) {
      case 'mcq': return '🔘';
      case 'short': return '📝';
      case 'long': return '📄';
      default: return '❓';
    }
  };

  return (
    <div className="min-h-screen pb-24 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto p-4">
        {/* Header */}
        <div className="text-center mb-8 pt-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Syllabus & Study Materials
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Complete syllabus with questions, answers, and AI-powered explanations
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

        {/* Subject Selection */}
        <div className="flex gap-2 overflow-x-auto mb-6 pb-2">
          {Object.keys(syllabus).map((subject) => (
            <button
              key={subject}
              onClick={() => {
                setSelectedSubject(subject);
                setSelectedTopic(null);
              }}
              className={`px-6 py-3 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                selectedSubject === subject
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750"
              }`}
            >
              {subject}
            </button>
          ))}
        </div>

        {/* Topics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {syllabus[selectedSubject]?.topics.map((topic, index) => (
            <div
              key={topic.name}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
              onClick={() => setSelectedTopic(selectedTopic?.name === topic.name ? null : topic)}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">
                      {topic.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {topic.description}
                    </p>
                  </div>
                  <ChevronRight 
                    className={`w-5 h-5 text-gray-400 transition-transform ${
                      selectedTopic?.name === topic.name ? 'rotate-90' : ''
                    }`} 
                  />
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4 text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {topic.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <Target className="w-4 h-4" />
                      {topic.progress}%
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    <span>{topic.questions.length} Qs</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-3">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${topic.progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Expanded Questions */}
              {selectedTopic?.name === topic.name && (
                <div className="border-t border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-750">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    Questions & Answers
                  </h4>
                  
                  <div className="space-y-4">
                    {topic.questions.map((q, qIndex) => (
                      <div key={qIndex} className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-start gap-3">
                          <span className="text-lg">{getQuestionIcon(q.type)}</span>
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
                                </p>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  explainWithAI(q.question);
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
