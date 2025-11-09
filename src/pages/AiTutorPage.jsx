// src/pages/AiTutorPage.jsx
import React, { useState } from "react";
import { Bot, Send, BookOpen, Lightbulb, Zap } from "lucide-react";

export default function AiTutorPage() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = { role: "user", content: inputMessage };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await fetch('https://api.nekolabs.web.id/ai/cf/gpt-oss-120b', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          context: "You are an AI tutor helping students with their studies. Provide clear, concise explanations and helpful guidance."
        })
      });

      const data = await response.json();
      
      if (data.response) {
        const aiMessage = { role: "assistant", content: data.response };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        throw new Error("No response from AI");
      }
    } catch (error) {
      const errorMessage = { 
        role: "assistant", 
        content: "Sorry, I'm having trouble connecting. Please try again later." 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickQuestions = [
    "Explain quantum physics in simple terms",
    "Help me solve this math problem",
    "What is photosynthesis?",
    "Explain Python programming basics",
    "Help me understand calculus"
  ];

  return (
    <div className="min-h-screen pb-24">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Bot className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Tutor
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Get instant help with any subject. Ask questions and get detailed explanations!
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
            <BookOpen className="w-6 h-6 text-blue-600 mb-2" />
            <h3 className="font-semibold text-blue-900 dark:text-blue-100">Study Help</h3>
            <p className="text-sm text-blue-700 dark:text-blue-300">Get explanations for complex topics</p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-200 dark:border-green-800">
            <Lightbulb className="w-6 h-6 text-green-600 mb-2" />
            <h3 className="font-semibold text-green-900 dark:text-green-100">Problem Solving</h3>
            <p className="text-sm text-green-700 dark:text-green-300">Step-by-step solutions</p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl border border-purple-200 dark:border-purple-800">
            <Zap className="w-6 h-6 text-purple-600 mb-2" />
            <h3 className="font-semibold text-purple-900 dark:text-purple-100">Quick Answers</h3>
            <p className="text-sm text-purple-700 dark:text-purple-300">Instant help 24/7</p>
          </div>
        </div>

        {/* Quick Questions */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Quick Questions</h3>
          <div className="flex flex-wrap gap-2">
            {quickQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => setInputMessage(question)}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                {question}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Container */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
          {/* Messages */}
          <div className="h-96 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 dark:text-gray-400 mt-20">
                <Bot className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p>Hello! I'm your AI Tutor. How can I help you with your studies today?</p>
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      message.role === "user"
                        ? "bg-blue-600 text-white rounded-br-none"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-none"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-2xl rounded-bl-none">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Ask any question about your studies..."
                className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={isLoading || !inputMessage.trim()}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
