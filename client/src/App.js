import "./App.css";
import { useState, useEffect } from "react";

function App() {
  const [overlays, setOverlays] = useState([]);
  const [content, setContent] = useState("");
  const [top, setTop] = useState(10);
  const [left, setLeft] = useState(10);
  const [width, setWidth] = useState(20);
  const [height, setHeight] = useState(10);
  const [setSelectedOverlayId, setsetSelectedOverlayId] = useState("");

  useEffect(() => {
    fetchOverlays();
  }, []);

  const fetchOverlays = async () => {
    try {
      await fetch("/overlays", {
        method: "GET",
        headers: { "Content-type": "application/json" },
      })
        .then((response) =>
          response.json().then((data) => setOverlays(data.overlays))
        )
        .catch((error) => console.log("error : ", error));
    } catch (error) {
      console.error("Error fetching overlays!", error);
    }
  };

  const addCustomOverlay = async () => {
    const newOverlay = {
      content,
      top,
      left,
      width,
      height,
    };

    try {
      const response = await fetch("/overlays", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(newOverlay),
      });
      await response.json();
      fetchOverlays();
      resetForm();
    } catch (error) {
      console.error("Error adding overlay:", error);
    }
  };

  const selectOverlay = (overlay) => {
    setContent(overlay.content);
    setTop(overlay.top);
    setLeft(overlay.left);
    setWidth(overlay.width);
    setHeight(overlay.height);
    setsetSelectedOverlayId(overlay._id);
  };

  const resetForm = () => {
    setContent("");
    setTop(10);
    setLeft(10);
    setWidth(20);
    setHeight(10);
    setSelectedOverlayId("");
  };

  const updateOverlay = async () => {
    const updatedOverlay = {
      content,
      top,
      left,
      width,
      height,
    };
    try {
      const response = await fetch(`/overlays/${setSelectedOverlayId.$oid}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedOverlay),
      });
      await response.json();
      fetchOverlays();

      resetForm();
    } catch (error) {
      console.error("Error updating overlay:", error);
    }
  };

  const deleteOverlay = async () => {
    try {
      const response = await fetch(`/overlays/${setSelectedOverlayId.$oid}`, {
        method: "DELETE",
      });
      await response.json();
      fetchOverlays();
      resetForm();
    } catch (error) {
      console.error("Error deleting overlay:", error);
    }
  };

  return (
    <div className="app-container">
      <div className="video-overlay-container">
        <div className="video-container">
          <div>
            <iframe
              title="LiveStream"
              width="1200"
              height="600"
              src="https://rtsp.me/embed/rRTSrGQF/"
              frameBorder="0"
              allowFullScreen
            ></iframe>
          </div>
        </div>
        <div className="overlay-container">
          {overlays.map((overlay, index) => (
            <div
              key={index}
              className="overlay"
              style={{
                top: `${overlay.top}px`,
                left: `${overlay.left}px`,
                width: `${overlay.width}px`,
                height: `${overlay.height}px`,
              }}
              onClick={() => selectOverlay(overlay)}
            >
              {overlay.content}
            </div>
          ))}
        </div>
      </div>
      <div className="overlay-form">
        <h2>{setSelectedOverlayId ? "Update" : "Add"} custom overlay</h2>
        <form>
          <label>
            Content:{" "}
            <input
              type="text"
              name="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </label>
          <label>
            Top Position:{" "}
            <input
              type="number"
              name="top"
              value={top}
              onChange={(e) => setTop(e.target.value)}
            />
          </label>
          <label>
            Left Position:{" "}
            <input
              type="number"
              name="left"
              value={left}
              onChange={(e) => setLeft(e.target.value)}
            />
          </label>
          <label>
            Height:{" "}
            <input
              type="number"
              name="height"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
            />
          </label>
          <label>
            Width:{" "}
            <input
              type="number"
              name="width"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
            />
          </label>
          <button
            type="button"
            onClick={setSelectedOverlayId ? updateOverlay : addCustomOverlay}
          >
            {setSelectedOverlayId ? "Update" : "Add"} Overlay
          </button>
          {setSelectedOverlayId ? (
            <button
              type="button"
              style={{ backgroundColor: "red" }}
              onClick={deleteOverlay}
            >
              Delete Overlay
            </button>
          ) : (
            <></>
          )}
        </form>
      </div>
    </div>
  );
}

export default App;
