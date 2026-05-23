import React, { useState, useEffect } from "react";
import LoadingIndicator from "./LoadingIndicator";

const AIAdGenerate = () => {
  const [ads, setAds] = useState([]);
  const [selectedAd, setSelectedAd] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [aiOutput, setAiOutput] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [threadId, setThreadId] = useState("");
  const [interruption, setInterruption] = useState(null); // { message, question }
  const [logs, setLogs] = useState([]); // To track "update" event messages
  const [imageUrl, setImageUrl] = useState("");
  const [feedbackCount, setFeedbackCount] = useState(0);

  const token = sessionStorage.getItem("accessToken");

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const apiUrl = `${import.meta.env.VITE_BACKEND_API_URL}/api/my-ads`;
        const response = await fetch(apiUrl, {
          headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });

        if (!response.ok) {
          throw new Error(`Error ${response.status}: Failed to fetch your ads.`);
        }

        const data = await response.json();
        setAds(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Failed to load ads:", e);
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchAds();
    }
  }, [token]);

  const processAiEvent = (json, currentCount) => {
    // Check for image_url in the data payload regardless of event type
    if (json.data && json.data.image_url) {
      setImageUrl(json.data.image_url);
    }

    if (json.event === "update") {
      setLogs((prev) => [...prev, json.data.message]);
    } else if (json.event === "interrupt") {
      if (currentCount >= 3) {
        setLogs((prev) => [...prev, "Maximum feedback limit reached (3 times). Finalizing..."]);
        setIsGenerating(false);
        return false;
      }
      setInterruption({
        message: json.data.message,
        question: json.data.question
      });
      setIsGenerating(false);
      return false; // Stop reading the current stream as we await user feedback
    } else if (json.event === "end") {
      setLogs((prev) => [...prev, "Execution finished"]);
    }
    return true;
  };

  const handleAiStream = async (reader, currentCount) => {
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      
      buffer += decoder.decode(value, { stream: true });
      const parts = buffer.split("\n");
      buffer = parts.pop();

      for (const part of parts) {
        if (!part.trim()) continue;
        try {
          const json = JSON.parse(part);
          const keepGoing = processAiEvent(json, currentCount);
          if (!keepGoing) return;
        } catch (err) {
          console.warn("Could not parse stream chunk", part);
        }
      }
    }

    if (buffer.trim()) {
      try { processAiEvent(JSON.parse(buffer), currentCount); } catch(e) {}
    }
  };

  const handleStartGeneration = async () => {
    if (!selectedAd) return;

    const newThreadId = `ad_gen_${selectedAd}_${Date.now()}`;
    setThreadId(newThreadId);
    setAiOutput("");
    setImageUrl("");
    setLogs([]);
    setFeedbackCount(0);
    setInterruption(null);
    setIsGenerating(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/ai/generate-image`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          thread_id: newThreadId,
          prompt: "Generate a advertisement for real estate purchase in kerala based on the property detail provided. Create a 4x3 feet billboard size ad with relevant details.",
          params: {
            propertyId: selectedAd,
            model_choice: "gemini",
            type: "paid"
          }
        }),
      });

      if (!response.ok) throw new Error("Generation failed");

      const reader = response.body.getReader();
      await handleAiStream(reader, 0);
    } catch (e) {
      console.error("Streaming error:", e);
      setAiOutput((prev) => prev + "\n[Error during generation. Please try again.]");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleResumeWithFeedback = async () => {
    if (!feedback || !threadId) return;

    if (feedbackCount >= 3) {
      setError("Maximum feedback limit reached.");
      return;
    }

    const nextCount = feedbackCount + 1;
    setFeedbackCount(nextCount);
    setIsGenerating(true);
    setInterruption(null);
    setImageUrl(""); // Clear previous image when resuming to indicate fresh processing

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/ai/resume-generation`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          thread_id: threadId, 
          user_feedback: feedback 
        }),
      });

      if (response.ok) {
        const reader = response.body.getReader();
        await handleAiStream(reader, nextCount);
        setFeedback("");
      } else {
        throw new Error("Resume request failed");
      }
    } catch (e) {
      console.error("Resume error:", e);
    } finally {
      setIsGenerating(false);
    }
  };

  if (loading) return <LoadingIndicator />;
  if (error) return <div className="container py-5 text-center"><div className="alert alert-danger">Error: {error}</div></div>;

  return (
    <div className="container py-5" style={{ maxWidth: "800px" }}>
      <h2 className="fw-bold mb-2">AI Ad Generator</h2>
      <p className="text-muted mb-4">Select an ad and collaborate with AI to create the perfect description.</p>
      
      <div className="card shadow-sm border-0 p-4 mb-4">
        <label className="form-label fw-bold">Select Property Ad</label>
        <select className="form-select mb-3" value={selectedAd} onChange={(e) => setSelectedAd(e.target.value)}>
          <option value="">Choose from your listings...</option>
          {ads.map((ad) => (
            <option key={ad.propertyId || ad._id} value={ad.propertyId || ad._id}>{ad.title}</option>
          ))}
        </select>
        <button className="btn btn-primary px-4" onClick={handleStartGeneration} disabled={!selectedAd || isGenerating}>
          {isGenerating ? "AI Processing..." : "Start Generation"}
        </button>
      </div>

      {logs.length > 0 && (
        <div className="card shadow-sm border-0 p-3 mb-4 bg-dark text-light font-monospace" style={{ fontSize: "0.85rem" }}>
          <h6 className="text-secondary border-bottom border-secondary pb-2">AI Execution Logs</h6>
          <div style={{ maxHeight: "200px", overflowY: "auto" }}>
            {logs.map((log, i) => (
              <div key={i}>{`> ${log}`}</div>
            ))}
          </div>
        </div>
      )}

      {interruption && (
        <div className="card shadow border-warning p-4 mb-4" style={{ backgroundColor: "#fff9e6" }}>
          <div className="d-flex align-items-center mb-3 text-warning">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            <h5 className="fw-bold mb-0">{interruption.message}</h5>
          </div>
          <p className="mb-3 text-dark" style={{ whiteSpace: "pre-wrap" }}>
            {interruption.question}
          </p>
          <label className="form-label fw-bold">Your Response</label>
          <textarea className="form-control mb-3" rows="4" placeholder="Enter details (e.g., number of rooms, specific features...)" value={feedback} onChange={(e) => setFeedback(e.target.value)} />
          <button className="btn btn-success" onClick={handleResumeWithFeedback} disabled={!feedback}>
            Resume with Feedback
          </button>
        </div>
      )}

      {imageUrl && (
        <div className="card shadow-sm border-0 p-3 mb-4 text-center">
          <h5 className="fw-bold mb-3">Generated Advertisement</h5>
          <img 
            src={imageUrl} 
            alt="AI Generated Ad" 
            className="img-fluid rounded shadow-sm mb-3"
            onError={(e) => {
              // Fallback logic if the image fails to load
              e.target.onerror = null; 
              e.target.src="https://via.placeholder.com/800x600?text=Image+Load+Failed";
            }}
          />
          <div>
            <a href={imageUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary btn-sm">
              View Full Image
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAdGenerate;