import React, { useRef, useEffect } from 'react';

function CameraPreview() {
  const canvasRef = useRef(null);

  useEffect(() => {


      navigator.mediaDevices.getUserMedia({ video: { facingMode: { exact: "environment" } } }, (stream) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const video = document.createElement('video');

        video.srcObject = stream;
        video.play();

        const draw = () => {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          requestAnimationFrame(draw);
        }

        draw();
      }, (error) => {
        console.error(error);
      });

  }, []);

  return (
    <div>
      <canvas ref={canvasRef} />
    </div>
  );
}

export default CameraPreview