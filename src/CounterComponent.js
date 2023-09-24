import React, { useState, useRef, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
// import Modal from '@mui/material/Modal';
import { auth } from "./firebaseConfig";
import axios from "axios";
import "./CounterComponent.css";
import "./Style.css";
import defaultImage from "./camera-solid.svg";
import image1 from "./image2.jpeg";
import image2 from "./image1.jpg";
import image3 from "./image3.jpeg";
import { Modal } from "@mui/material";
import Results from "./Results";
import { Carousel } from "react-responsive-carousel";
import DataAdder from "./DataAdder";
import Auth from "./Auth";
// import 'react-responsive-carousel/lib/styles/carousel.min.css';

const CounterComponent = () => {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [processedImageSrc, setProcessedImageSrc] = useState("");
  const [output, setOutput] = useState([]);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const processedImageRef = useRef(null);
  const captureBtnRef = useRef(null);
  const [isModal, setModel] = useState(false);

  const [btn, setBtn] = useState(false);

  const [loggedIn, setLoggedIn] = useState(false);

  const getloggedIn = () => {
    setLoggedIn((prev) => !prev);
  };

  useEffect(() => {
    // Set the default image source on component mount
    setProcessedImageSrc(defaultImage);
  }, []);

  const updateOutput = (data) => {
    console.log(data);
    setOutput(data);
  };
  const openCamera = () => {
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "environment" } })
      .then((stream) => {
        processedImageRef.current.style.display = "none";
        videoRef.current.style.display = "block";
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsCameraOpen(true);
        captureBtnRef.current.textContent = "Capture";
      })
      .catch((error) => {
        console.error("Error accessing the rear camera: ", error);
      });
  };

  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    video.pause();
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataURL = canvas.toDataURL("image/jpeg");

    const stream = video.srcObject;
    const tracks = stream.getTracks();
    tracks.forEach((track) => track.stop());

    axios
      .post("https://ivashlok.pythonanywhere.com/process-image", {
        image: dataURL,
      })
      .then((response) => {
        const timestamp = Date.now();
        const processedImageUrl = `https://ivashlok.pythonanywhere.com/processed-image/processed_image.jpg?t=${timestamp}`;
        setProcessedImageSrc(processedImageUrl);
        processedImageRef.current.style.display = "block";
        videoRef.current.style.display = "none";

        captureBtnRef.current.textContent = "Capture Image";
        captureBtnRef.current.disabled = false;
        updateOutput(response.data.output);
        setIsCameraOpen(false);
        setModel(true);
      })
      .catch((error) => {
        console.error("Error processing the image:", error);
      });
  };

  const toggleCapture = () => {
    if (!isCameraOpen) {
      setIsCameraOpen(true);
      captureBtnRef.current.textContent = "Capture";
      openCamera();
    } else {
      captureBtnRef.current.disabled = true;
      captureBtnRef.current.textContent = "Processing...";
      captureImage();
    }
  };

  // modal //

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const modal_style = {
    position: "absolute",
    color: "black",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    border: "2px solid #000",
    backgroundColor: "white",
    boxShadow: 24,
    p: 4,
  };

  return (
    <>
      {loggedIn == false ? (
        <>
          <div>
            <p className="moving-text">
              welcome to I mart!! you are logged in as Cashier
            </p>
            <section class="pimg2">
              <div class="ptext">
                <span class="textBg">
                  Scroll down to Proceed towards billing
                </span>
              </div>
            </section>
            <section class="section section-dark" id="sectionp1">
              {/* <button class="icon-button">
      <i class="fa fa-user fa-4x" id='user'></i>
    </button> */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div class="icon-button">
                  <Button onClick={handleOpen}>ADMIN ACCESS</Button>
                </div>
              </div>

              <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box sx={modal_style}>
                  <Auth getloggedIn={getloggedIn}></Auth>
                </Box>
              </Modal>

              {/* <button class="icon-button" >
        Admin Access
    </button> */}
              {/* <p id="p1"><br/>Only Admin can access this portal</p> */}
            </section>
            <section class="pimg3">
              <div class="ptext">
                <span class="textBg">CASHIERLESS COUNTER</span>
              </div>
            </section>
            <section class="section section-dark">
              <h2 class="textBg">WE Ensure Barcode Free scan</h2>
              <p id="p2">Capture all Items in a one go</p>
            </section>
            <section class="pimg1">
              <div class="ptext">
                <span class="textBg"></span>
              </div>
            </section>
            <div className="center">
              <div id="video-container">
                <video
                  id="video"
                  width="640"
                  height="480"
                  style={{
                    height: "450px",
                    width: "600px",
                    borderRadius: "10%",
                    boxShadow: "0 0 10px rgba(0.3, 0.3, 0.3, 0.7)",
                    display: "none",
                  }}
                  ref={videoRef}
                ></video>
                <img
                  id="processed-image"
                  src={processedImageSrc}
                  style={{
                    height: "450px",
                    width: "600px",
                    borderRadius: "10%",
                    boxShadow: "0 0 10px rgba(0.3, 0.3, 0.3, 0.7)",
                  }}
                  ref={processedImageRef}
                ></img>
              </div>
              <canvas
                id="canvas"
                style={{ display: "none" }}
                ref={canvasRef}
              ></canvas>
            </div>
            <div className="center">
              <button
                id="capture-btn"
                onClick={toggleCapture}
                ref={captureBtnRef}
              >
                Capture Image
              </button>
            </div>
            <div className="modaldiv">
              <Modal
                open={isModal}
                className={`modal ${isModal ? "fade-in" : "fade-out"}`}
                closeAfterTransition
              >
                <Results
                  path={processedImageSrc}
                  output={output}
                  closeModel={setModel}
                  processimage={setProcessedImageSrc}
                />
              </Modal>
            </div>
          </div>
        </>
      ) : (
        <DataAdder getloggedIn={getloggedIn}></DataAdder>
      )}
    </>
  );
};

export default CounterComponent;

// pre written code.........................................................

// <section class="pimg1">
//       <div class="ptext">
//           <span class="textBg">Cashierless Counter

//           </span>
//       </div>
//   </section>
//   <section class="section section-light">
//       <h2>Section One</h2>
//       <p>Everything we see around us constitutes nature, including the sun, the moon, trees, flowers, fruits, human beings, birds, animals, etc. In nature, everyone depends on one another to keep the ecosystem healthy. For survival, every creature is interrelated and reliant on one another. Humans, for example, rely on nature for their survival, and nature provides us with oxygen, food, water, shelter, medicines, and clothing, among other things. Many shades may be seen in nature, contributing to the planet’s beauty.
//       </p>
//   </section>
//   <section class="pimg2">
//       <div class="ptext">
//           <span class="textBg"> Explore Nature </span>
//       </div>
//   </section>
//   <section class="section section-dark">
//       <h2>Section Two</h2>
//       <p>Nature is the ultimate source of our living. Both living and non-living things include nature, and everyone is interdependent, which helps maintain the ecosystem. Plants, animals, and humans all depend on nature for their survival. It supplies oxygen, sunlight, soil, water, and other necessary components. But deforestation has been the primary cause of global warming, destroying nature.
//       </p>
//   </section>
//   <section class="pimg3">
//       <div class="ptext">
//           <span class="textBg"> LOOK, DEEP INTO NATURE </span>
//       </div>
//   </section>
//   <section class="section section-dark">
//       <h2>Section Three</h2>
//       <p>shop with uss its your user friendly interface</p>
//   </section>
//   <section class="pimg1">
//       <div class="ptext">
//           <span class="textBg">

//           </span>

//       </div>
//     </section>
