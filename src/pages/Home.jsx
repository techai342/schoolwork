export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
      <h1 className="text-5xl font-bold mb-4">Welcome to Study Planner</h1>
      <p className="text-lg mb-8 max-w-xl">
        Track your 120-day study plan easily. Manage theory, short questions, and MCQs with beautiful charts.
      </p>
      <button className="bg-blue-600 px-6 py-3 rounded-lg hover:bg-blue-700 transition">
        Get Started
      </button>
    </div>
  );
}