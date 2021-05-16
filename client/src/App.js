import './App.css';
import { PlayCircleFilled } from "@material-ui/icons";
import React, { useState } from "react";

// Backend url constant
const backend_uri = "http://localhost:5000"

async function downloadRequest(url, downloadFormat) {
  // Send download request to custom url
  let customUrl = `${backend_uri}/download?url=${url}&format=${downloadFormat}`;
  const res = await fetch(customUrl);

  try {
    if (res.status === 200) {
      // Open custom url to initiate download
      window.location.assign(customUrl);
    }
  } catch (e) {
    console.error(e);
  }
}

function App() {
  // State
  const [selectedDownloadOption, setSelectedDownloadOption] = useState("mp4");

  // Web page html
  return (
    <div className="App">
      <div className="container">
        <button id="downloadBtn" onClick={() => downloadRequest(document.getElementById("url_input").value, selectedDownloadOption)}>
          <PlayCircleFilled className="playBtnIcon" />
        </button>

        <div className="row">
          <input type="text" id="url_input" autoComplete="off" placeholder="Paste video URL here"></input>
        </div>

        <div className="row" id="buttonRow">
          <button 
            className={selectedDownloadOption === "mp4" ? "selectedDownloadOption" : "downloadOption"} 
            onClick={() => {setSelectedDownloadOption("mp4")}}
          >
            mp4
          </button>

          <button 
            className={selectedDownloadOption === "mp3" ? "selectedDownloadOption" : "downloadOption"} 
            onClick={() => {setSelectedDownloadOption("mp3")}}
          >
            mp3
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
