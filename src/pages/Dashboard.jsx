import ProgressChart from "../components/ProgressChart";

export default function Dashboard() {
  return (
    <div className="p-6 text-center">
      <h1 className="text-4xl font-bold mb-6">📈 Study Dashboard</h1>
      <ProgressChart />
    </div>
  );
}
