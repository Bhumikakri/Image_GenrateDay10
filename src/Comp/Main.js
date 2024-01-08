import "./main.css";
import { useState } from "react";
import axios from "axios";

const Main = () => {
  const [searchInput, setSearchInput] = useState(""); // Input for search term
  const [searchResults, setSearchResults] = useState([]); // Array to store fetched image URLs
  const [error, setError] = useState("");

  const fetchImageData = async (input) => {
    try {
      if (input.trim() !== "") {
        const response = await axios.post(
          'https://api-inference.huggingface.co/models/prompthero/openjourney-v4',
          { inputs: input },
          {
            headers: {
              Authorization: 'Bearer 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',
              'Content-Type': 'application/json',
            },
            responseType: 'blob',
          }
        );

        const blob = response.data;
        const imageUrl = URL.createObjectURL(blob);

        setSearchResults((prevResults) => [...prevResults, imageUrl]);
        setError("");
      } else {
        setError("Please enter a valid input.");
      }
    } catch (error) {
      console.error('Error:', error);
      setError("Failed to fetch image. Please try again.");
    }
  };

  const handleSearch = () => {
    setSearchResults([]); // Clear previous search results
    fetchImageData(searchInput);
  };

  return (
    <div>
      <h1>Image Search</h1>
      <input
        type="text"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        placeholder="Enter search term"
      />
      <button onClick={handleSearch}>Search</button>
      {error && <p className="error">{error}</p>}
      <div className="image-container">
        {searchResults.map((imageUrl, index) => (
          <div key={index} className="image-item">
            <img src={imageUrl} alt={`Result ${index + 1}`} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Main;
