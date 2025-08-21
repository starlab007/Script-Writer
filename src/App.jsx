import { useState } from "react";
import './App.css';

export default function ScriptWriter() {
  const [title, setTitle] = useState("");
  const [tone, setTone] = useState("");
  const [length, setLength] = useState("10mins");
  const [loading, setLoading] = useState(false);
  const [script, setScript] = useState("");

  const handleSubmit = async () => {
    if (!title.trim()) return;

    setLoading(true);
    setScript("");

    try {
      const response = await fetch("/api/generate", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ title, tone, length }), // send the correct keys
});

      const data = await response.json();

      // ✅ Check for backend error response
      if (data.error) {
        setScript(`❌ ${data.error}`);
      } else {
        setScript(data.script || "No response from server");
      }
    } catch (err) {
      console.error(err);
      setScript("❌ Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen w-screen bg-gradient-to-b from-blue-900 via-blue-950 to-black text-white flex flex-col items-center p-10">
      <h1 className="text-3xl font-bold mb-2">AI Script Writer ✍️</h1>
      <p className="text-gray-400 mb-10 text-center">
        Turn your idea into a complete script that hooks viewers and keeps them watching.
      </p>

      {/* Input box */}
      <div className="w-full max-w-2xl bg-gray-900 rounded-xl p-6 shadow-lg">
        <input
          type="text"
          placeholder="Enter a working title or main topic..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 rounded-lg bg-gray-800 text-white outline-none mb-4"
        />

        {/* Options */}
        <div className="flex gap-4 mb-4">
          <select
            value={length}
            onChange={(e) => setLength(e.target.value)}
            className="bg-gray-800 px-4 py-2 rounded-lg"
          >
            <option>1 mins</option>
            <option>5 mins</option>
            <option>10 mins</option>
            <option>15 mins</option>
            <option>20 mins</option>
            <option>30 mins</option>
          </select>

          <input
            type="text"
            placeholder="Tone (Optional)"
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="bg-gray-800 px-4 py-2 rounded-lg flex-1"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={!title || loading}
          className="w-full bg-blue-600 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Generating..." : "Generate Script"}
        </button>
      </div>

      {/* Output */}
      {script && (
        <div className="w-full max-w-2xl mt-10 bg-gray-900 rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-bold mb-3">Generated Script</h2>
          <p className="whitespace-pre-wrap">{script}</p>
        </div>
      )}
    </div>
  );
}
