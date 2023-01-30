import { useEffect, useRef, useState } from "react";
import axios from "axios";
import './canvas.css';

const url = "http://localhost:4000";

export const Canvas = () => {
    const canvasRef = useRef(null);
    const contextRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
  
    useEffect(() => {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      canvas.width = 500;
      canvas.height= 200;
      context.lineCap = 'round'
      context.lineWidth = 3
      context.fillStyle = "white";
      context.fillRect(0, 0, canvas.width, canvas.height);
      contextRef.current = context;
    }, [])
    
  
    const startDrawing = ({ nativeEvent }) => {
      const { offsetX, offsetY } =  nativeEvent;
      contextRef.current.beginPath();
      contextRef.current.moveTo(offsetX, offsetY);
      setIsDrawing(true);
    };
  
    const finishDrawing = () => {
      contextRef.current.closePath();
      setIsDrawing(false);
    };
  
    const draw = ({ nativeEvent }) => {
      if(isDrawing) {
        const { offsetX, offsetY } =  nativeEvent;
        contextRef.current.lineTo(offsetX, offsetY);
        contextRef.current.stroke();
      }
    };
  
    const reset = () => {
      contextRef.current.fillStyle = "white";
      contextRef.current.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height)
    }

    const canvasToBlob = () => {
      canvasRef.current.toBlob( blob => {
        console.log(blob);
        save(blob);
      }, 'image/jpeg', 0.8)
    }

    const save = async (blob) => {
      const data = new FormData();
      data.append("signatureImage", "123");
      console.log(data);
      
      try {
        const res = await axios.post(`${url}/signature`, {"signatureImage": "123"}, { 
          headers: {
            'Content-type': 'multipart/form-data'
          }
        });
        console.log(res);
      } catch (error) {
        console.log(error);
      }
    }
  
    return (
      <div id="general-container">
        <canvas style={{ border: '1px solid black' }}
          onMouseDown={startDrawing}
          onMouseUp={finishDrawing}
          onMouseMove={draw}
          ref={canvasRef}
        />
        <div id="btn-container">
          <button id="btn-borrar" onClick={reset}>Borrar</button>
          <button id="btn-guardar" onClick={canvasToBlob}>Guardar</button>
        </div>
      </div>
    )
}
