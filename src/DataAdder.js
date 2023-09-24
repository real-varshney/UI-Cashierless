import { useState, useRef, useEffect } from "react";
import { FaUserCheck } from "react-icons/fa";
import './DataAdder.css';
import { AiFillCamera,AiOutlineArrowLeft } from "react-icons/ai";
import { BsFillPlayFill ,BsStopCircle, BsFillCameraReelsFill} from "react-icons/bs";

const DataAdder = ({getloggedIn}) => {
  const [seed, setSeed] = useState(1);
  const reset = () => {
       setSeed(Math.random());
   }
  const [permission, setPermission] = useState(false);
  const mimeType = "video/webm";
  const[available, secAvailable] = useState(false);
  const mediaRecorder = useRef(null);
  const liveVideoFeed = useRef(null);
  const [recordingStatus, setRecordingStatus] = useState("inactive");
  const [videoChunks, setVideoChunks] = useState([]);
  const [recordedVideo, setRecordedVideo] = useState(null);



  const getCameraPermission = async () => {
    setRecordedVideo(null);
    setRecordingStatus('Active')
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
    setRecordingStatus("Recorded");
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


  const signOut =  ()=>{
    return 0
  }


  return (
    <div className="v_main">
      <div className="v_head_main"> 
      <h1 className="v_head_1">Video Recorder</h1>
      <button className="btn_spc" onClick={()=> signOut()}> <AiOutlineArrowLeft size={22}/> Return </button>
      </div>
      {/* <div className="v_icon"><FaUserCheck size={32}/></div> */}
      <div className="v_status"><BsFillCameraReelsFill size={16} color={"black"} className="v_icon"/> {recordingStatus}</div>
      <main>
        <div className="v_video_controls">
          {!permission ? (
            <button onClick={getCameraPermission} type="button" className="v_btn">
              Get Started <AiFillCamera size={22} color={"black"} className="v_icon"/>
            </button>
          ) : null}
          {permission && recordingStatus === "Active" ? (
            <button onClick={startRecording} type="button" className="v_btn">
              Start Recording <BsFillPlayFill className="v_icon" size={22}/>
            </button>
          ) : null}
          {recordingStatus === "recording" ? (
            <button onClick={stopRecording} type="button" className="v_btn">
              Stop Recording <BsStopCircle className="v_icon" size={22}/>
            </button>
          ) : null}
        </div>
        {liveVideoFeed !== null ? (
          <div className="v_video">

          
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
          </div>
        ) : null}
        {recordedVideo !== null ? (
          <>
          <video controls width="250" className="v_recorded">
            <source src={recordedVideo} type="video/webm" />
          </video>
          <div className="v_submit">
          <button className="v_btn">Submit</button>
          <button className="v_btn"onClick={()=>getloggedIn()}>Retake</button>
          </div>
           </>
        ) : null}
      </main>
    </div>
  );
};

export default DataAdder;
