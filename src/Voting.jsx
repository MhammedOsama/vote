import React, { useState, useEffect } from "react";
import truth from "../src/assets/Truth.mp4";
import liar from "../src/assets/Liar.mp4";
import "./App.css";

function Voting() {
  const [selectedLiar, setSelectedLiar] = useState(null);
  const [results, setResults] = useState({
    correct: 0,
    wrong: 0,
    allResponses: [],
  });
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const authToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJTaGVyaW4iLCJqdGkiOiJhM2ZhYmQ3Zi04NzBkLTRiY2YtOWM2Ny0wYTI2YTcyZGRiMTMiLCJlbWFpbCI6IlNoZXJpbjEyQHlhaG9vLmNvbSIsInVpZCI6ImQyNjYwYmQ2LTY4MjUtNDc2Yy05MzJmLTVkZTIwMzk2OWRmYyIsInJvbGVzIjpbIlVzZXIiLCJBZG1pbiJdLCJleHAiOjE3NDU3MTQ2ODYsImlzcyI6Imh0dHBzOi8vbG9jYWxob3N0OjcxNDUiLCJhdWQiOiJodHRwczovL2xvY2FsaG9zdDo0MjAwIn0.KrD-P8oBiJE9ILLtfWILYiO2CCggrXfGi4XlGcQ_zXI";

  // Video assignments
  const correctAnswer = { liar: "video1", truth: "video2" };

  // Check for admin access on component mount
  useEffect(() => {
    const verifyAdminAccess = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const adminKey = urlParams.get("admin");

      if (!adminKey) return;

      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(
          "https://apipermisson.runasp.net/api/Auth/adminAccess",
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error(
            `Admin verification failed with status ${response.status}`
          );
        }

        const data = await response.json();
        if (adminKey === data.secretKey) {
          setIsAdmin(true);
        }
        if (data.isAdmin) {
          setIsAdmin(true);
          window.history.replaceState({}, "", window.location.pathname);
        }
      } catch (error) {
        console.error("Admin verification error:", error);
        setError("Failed to verify admin access");
      } finally {
        setIsLoading(false);
      }
    };

    verifyAdminAccess();
    fetchVotes();
  }, []);

  // Fetch votes from API with proper authentication
  const fetchVotes = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        "https://apipermisson.runasp.net/api/Auth/GetVotes",
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch votes with status ${response.status}`);
      }

      const data = await response.json();
      processVotes(data);
    } catch (err) {
      console.error("Error fetching votes:", err);
      setError("Failed to load voting data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Process vote data
  const processVotes = (votes) => {
    const userVotes = Array.isArray(votes) ? votes : [];
    const correctCount = userVotes.reduce((acc, vote) => {
      return vote.selected_liar === "video1" ? acc + 1 : acc;
    }, 0);
    console.log(correctCount);
    console.log(userVotes);
    // const correctCount = userVotes.filter((vote) => vote.is_correct).length;

    setResults({
      correct: correctCount,
      wrong: userVotes.length - correctCount,
      allResponses: isAdmin ? userVotes : [],
    });
  };

  const sendChoice = async (liarChoice) => {
    setIsLoading(true);
    setError(null);
    try {
      const isCorrect = liarChoice === correctAnswer.liar;
      const choiceValue =
        liarChoice === "video1" ? "liar_video1" : "liar_video2";

      const response = await fetch(
        "https://apipermisson.runasp.net/api/Auth/Vote",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            choicee: choiceValue,
            is_correct: isCorrect,
            userType: "voter",
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message ||
            `Vote submission failed with status ${response.status}`
        );
      }

      const updatedVotes = await response.json();
      processVotes(updatedVotes);
    } catch (err) {
      console.error("Error submitting vote:", err);
      setError(err.message || "Failed to submit your vote. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle user choice
  const handleChoice = (liarChoice) => {
    if (selectedLiar !== null) return;
    setSelectedLiar(liarChoice);
    sendChoice(liarChoice);
  };

  // Admin view
  if (isAdmin) {
    return (
      <div style={{ padding: "20px", fontFamily: "Arial" }}>
        <h1>Admin Dashboard</h1>
        {isLoading && <p>Loading data...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        <div
          style={{
            background: "#f5f5f5",
            padding: "15px",
            borderRadius: "5px",
            marginBottom: "20px",
          }}>
          <h3>Total Votes: {results.correct + results.wrong}</h3>
          <p>✅ Correct: {results.correct}</p>
          <p>❌ Wrong: {results.wrong}</p>
          <p>
            Success Rate:{" "}
            {Math.round(
              (results.correct / (results.correct + results.wrong || 1)) * 100
            )}
            %
          </p>
        </div>

        <h3>All Responses</h3>
        {results.allResponses.length > 0 ? (
          <div style={{ maxHeight: "400px", overflowY: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#eee" }}>
                  <th style={{ padding: "8px", border: "1px solid #ddd" }}>
                    Time
                  </th>
                  <th style={{ padding: "8px", border: "1px solid #ddd" }}>
                    Choice
                  </th>
                  <th style={{ padding: "8px", border: "1px solid #ddd" }}>
                    Correct?
                  </th>
                </tr>
              </thead>
              <tbody>
                {results.allResponses.map((response, index) => (
                  <tr key={index} style={{ borderBottom: "1px solid #ddd" }}>
                    <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                      {new Date(response.timestamp).toLocaleString()}
                    </td>
                    <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                      {response.choice === "liar_video1"
                        ? "Video 1"
                        : "Video 2"}
                    </td>
                    <td
                      style={{
                        padding: "8px",
                        border: "1px solid #ddd",
                        color: response.is_correct ? "green" : "red",
                      }}>
                      {response.is_correct ? "✅" : "❌"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No votes recorded yet</p>
        )}

        <button
          onClick={fetchVotes}
          disabled={isLoading}
          style={{
            marginTop: "20px",
            padding: "10px 15px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}>
          {isLoading ? "Refreshing..." : "Refresh Data"}
        </button>
      </div>
    );
  }

  // Regular user view
  return (
    <div className='all bg-[#0B1223] min-h-screen text-white'>
      <div className='container mx-auto px-4 py-10'>
        {/* Title */}
        <div className='head text-center'>
          <h1 className='lg:text-5xl text-3xl font-bold'>EYE OF VERITAS</h1>
        </div>

        {/* Loading / Error / Vote Result */}
        <div className='text-center mt-6'>
          {isLoading && <p>Loading...</p>}
          {error && <p className='text-red-400'>{error}</p>}
          {selectedLiar && (
            <div className='bg-[#1F2937] p-4 rounded-lg shadow-lg mt-4 inline-block'>
              <p>
                ✅ Thank you for voting! You selected Video{" "}
                <span className='font-semibold'>
                  {selectedLiar === "video1" ? 1 : 2}
                </span>{" "}
                as the liar.
              </p>
            </div>
          )}
        </div>

        {/* Videos */}
        <div className='video flex md:gap-14 gap-6 justify-center items-center mt-10 flex-wrap'>
          <video
            className='md:w-96 md:h-64 w-44 h-32 rounded-lg shadow-lg object-cover'
            controls>
            <source src={truth} type='video/mp4' />
          </video>
          <video
            className='md:w-96 md:h-64 w-44 h-32 rounded-lg shadow-lg object-cover'
            controls>
            <source src={liar} type='video/mp4' />
          </video>
        </div>

        {/* Buttons */}
        <div className='btn flex justify-evenly items-center pt-10 flex-wrap gap-4'>
          <button
            onClick={() => handleChoice("video1")}
            disabled={selectedLiar !== null || isLoading}
            className={`text-white font-medium rounded-lg text-sm md:px-12 px-6 md:py-2 py-2 transition duration-300 ${
              selectedLiar === null
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-500 cursor-not-allowed"
            }`}>
            Choose Video 1 as Liar
          </button>
          <button
            onClick={() => handleChoice("video2")}
            disabled={selectedLiar !== null || isLoading}
            className={`text-white font-medium rounded-lg text-sm md:px-12 px-6 md:py-2 py-2 transition duration-300 ${
              selectedLiar === null
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-500 cursor-not-allowed"
            }`}>
            Choose Video 2 as Liar
          </button>
        </div>
      </div>
    </div>
  );
}

export default Voting;
