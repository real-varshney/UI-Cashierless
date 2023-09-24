import { useState, useRef, useEffect } from "react";

const DataAdder = () => {
  const [permission, setPermission] = useState(false);
  const [stream, setStream] = useState(null);
  const mimeType = "video/webm";

  const mediaRecorder = useRef(null);
  const liveVideoFeed = useRef(null);
  const [recordingStatus, setRecordingStatus] = useState("inactive");
  const [videoChunks, setVideoChunks] = useState([]);
  const [recordedVideo, setRecordedVideo] = useState(null);
  const [ten, setTen] = useState(false);

  const getCameraPermission = async () => {
    setRecordedVideo(null);
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "environment" } })
      .then((stream) => {
        liveVideoFeed.current.style.display = "block";
        liveVideoFeed.current.srcObject = stream;
        liveVideoFeed.current.play();
        setPermission(true);
      })
      .catch((error) => {
        console.error("Error accessing the rear camera: ", error);
      });
  };



  const startRecording = async () => {
    setRecordingStatus("recording");
    const media = new MediaRecorder(liveVideoFeed.current.srcObject, {
      mimeType,
    });
    mediaRecorder.current = media;
    mediaRecorder.current.start();
    let localVideoChunks = [];
    mediaRecorder.current.ondataavailable = (event) => {
      if (typeof event.data === "undefined") return;
      if (event.data.size === 0) return;
      localVideoChunks.push(event.data);
    };
    setVideoChunks(localVideoChunks);
    console.log(localVideoChunks);
  };

  const stopRecording = async () => {
    setRecordingStatus("inactive");
    mediaRecorder.current.stop();
    mediaRecorder.current.onstop = () => {
      const videoBlob = new Blob(videoChunks, { type: mimeType });
      const videoUrl = URL.createObjectURL(videoBlob);
      setRecordedVideo(videoUrl);
      console.log(recordedVideo);
      setVideoChunks([]);
    };

    const stream = liveVideoFeed.current.srcObject;
    const tracks = stream.getTracks();
    tracks.forEach((track) => track.stop());
  };

  useEffect(() => {
    let timeout_id;
    if(recordingStatus== 'recording'){
        timeout_id = setTimeout(() => {
          stopRecording();
        }, 10000);
    }
    else if(recordingStatus== 'inactive'){
        if(timeout_id) {
            clearTimeout(timeout_id);
        }
    }
  }, [recordingStatus]);




  return (
    <div>
      <h2>Video Recorder</h2>
      <div>status {recordingStatus}</div>
      <main>
        <div className="video-controls">
          {!permission ? (
            <button onClick={getCameraPermission} type="button">
              Get Camera
            </button>
          ) : null}
          {permission && recordingStatus === "inactive" ? (
            <button onClick={startRecording} type="button">
              Start Recording
            </button>
          ) : null}
          {recordingStatus === "recording" ? (
            <button onClick={stopRecording} type="button">
              Stop Recording
            </button>
          ) : null}
        </div>
        {liveVideoFeed !== null ? (
          <video
            id="video"
            width="640"
            height="480"
            style={{
              height: "450px",
              width: "600px",
              borderRadius: "10%",
              boxShadow: "0 0 10px rgba(0.3, 0.3, 0.3, 0.7)",
            }}
            ref={liveVideoFeed}
            // src={liveVideoFeed}
          ></video>
        ) : null}
        {recordedVideo !== null ? (
          <video controls width="250">
            <source src={recordedVideo} type="video/webm" />
          </video>
        ) : null}
      </main>
    </div>
  );
};

export default DataAdder;
