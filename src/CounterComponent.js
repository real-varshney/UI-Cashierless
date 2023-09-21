import React, { useState, useRef,useEffect  } from 'react';
import axios from 'axios';
import './CounterComponent.css';
import defaultImage from './camera.svg';
import image1 from './image2.jpeg';
import image2 from './image1.jpg';
import image3 from './image3.jpeg';
import { Modal } from '@mui/material';
import  Results  from './Results';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

const CounterComponent = () => {
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [processedImageSrc, setProcessedImageSrc] = useState('');
    const [output, setOutput] = useState([]);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const processedImageRef = useRef(null);
    const captureBtnRef = useRef(null);
    const [isModal,setModel]=useState(false);
    

    useEffect(() => {
      // Set the default image source on component mount
      setProcessedImageSrc(defaultImage);
    }, []);

    const updateOutput = (data) => {
               console.log(data)
            setOutput(data);
    };
    const openCamera = () => { 
   navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } }) 
     .then((stream) => { 
         processedImageRef.current.style.display = 'none'; 
         videoRef.current.style.display = 'block'; 
       videoRef.current.srcObject = stream; 
       videoRef.current.play(); 
       setIsCameraOpen(true); 
       captureBtnRef.current.textContent = 'Capture'; 
     }) 
     .catch((error) => { 
       console.error('Error accessing the rear camera: ', error); 
     }); 
};

    const captureImage = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
      
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
      
        video.pause();
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
        const dataURL = canvas.toDataURL('image/jpeg');
      
        const stream = video.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
      
        axios
          .post('https://ivashlok.pythonanywhere.com/process-image', { image: dataURL })
          .then((response) => {
            const timestamp = Date.now();
            const processedImageUrl = `https://ivashlok.pythonanywhere.com/processed-image/processed_image.jpg?t=${timestamp}`;
            setProcessedImageSrc(processedImageUrl);
            processedImageRef.current.style.display = 'block';
            videoRef.current.style.display = 'none';

            captureBtnRef.current.textContent = 'Capture Image';
            captureBtnRef.current.disabled = false;
            updateOutput(response.data.output);
            setIsCameraOpen(false);
            setModel(true);
          })
          .catch((error) => {
            console.error('Error processing the image:', error);
          });
      };
  
    const toggleCapture = () => {
      if (!isCameraOpen) {
        setIsCameraOpen(true);
        captureBtnRef.current.textContent = 'Capture';
        openCamera();
      } else {
        captureBtnRef.current.disabled = true;
        captureBtnRef.current.textContent = 'Processing...';
        captureImage();
      }
    };
  
    return (
      
      <div>
        <Carousel showThumbs={false} autoPlay infiniteLoop interval={1300}>
      <div>
        <img src={image1}  style={{ width: 1920, height: 600 }}/>
        
      </div>
      <div>
        <img src={image2} alt="Image 2" style={{ width: 1920, height: 600 }}/>
        
      </div>
      <div>
        <img src={image3} alt="Image 3" style={{ width: 1920, height: 600 }}/>
      </div>
    </Carousel>

        <div className="container">
          <h1>Welcome To I-MART</h1>
          <h2>Scroll Down</h2>
          <h2>To Proceed Towards</h2>
          <h2>Billing</h2>
        </div>
        <div className="center">
          <div id="video-container">
            <video id="video" width="640" height="480" style={{ height: '450px', width: '600px', borderRadius: '10%', boxShadow: '0 0 10px rgba(0.3, 0.3, 0.3, 0.7)', display: 'none' }} ref={videoRef}></video>
            <img id="processed-image" src={processedImageSrc} style={{ height: '450px', width: '600px', borderRadius: '10%', boxShadow: '0 0 10px rgba(0.3, 0.3, 0.3, 0.7)' }}ref={processedImageRef}></img>
          </div>
          <canvas id="canvas" style={{ display: 'none' }} ref={canvasRef}></canvas>
        </div>
        <div className="center">
          <button id="capture-btn" onClick={toggleCapture} ref={captureBtnRef}>Capture Image</button>
        </div>
        <div className='modaldiv'>

        <Modal 
        open={isModal}
        className={`modal ${isModal ? 'fade-in' : 'fade-out'}`}
        closeAfterTransition
       >
      <Results path={processedImageSrc} output={output} closeModel={setModel} processimage={setProcessedImageSrc} />
       
       
       </Modal>
        </div>
       
      </div>
    );
  };
  
  export default CounterComponent;
  