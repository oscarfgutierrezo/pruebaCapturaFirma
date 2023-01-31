import { useEffect, useRef, useState } from "react";
import axios from "axios";
import './canvas.css';

const url = "http://localhost:4000";

export const Canvas = () => {
    const canvasRef = useRef(null);
    const contextRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
  
    useEffect(() => {
      // Configuracion del contexto de dibujo
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      canvas.width = 500;
      canvas.height= 200;
      context.lineCap = 'round'
      context.lineWidth = 3
      context.fillStyle = "white";
      context.fillRect(0, 0, canvas.width, canvas.height);

      // Referencia al contexto de dibujo
      contextRef.current = context;
    }, [])
    
  
    const startDrawing = ({ nativeEvent }) => {
      // Posición del evento en relación a los bordes del nodo (canvas)
      const { offsetX, offsetY } =  nativeEvent;
      contextRef.current.beginPath();
      contextRef.current.moveTo(offsetX, offsetY);
      setIsDrawing(true);
    };
  
    const draw = ({ nativeEvent }) => {
      if(isDrawing) {
        const { offsetX, offsetY } =  nativeEvent;
        contextRef.current.lineTo(offsetX, offsetY);
        contextRef.current.stroke();
      }
    };

    const finishDrawing = () => {
      contextRef.current.closePath();
      setIsDrawing(false);
    };
  
    const resetCanvas = () => {
      contextRef.current.fillStyle = "white";
      contextRef.current.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height)
    }

    const getCanvasImage = () => {
      // Crear un archivo jpg que contiene el contexto de dibujo
      canvasRef.current.toBlob( blob => {
        const file = new File([blob], 'prueba.jpg', { type: 'image/jpeg' });
        sendCanvasImageToServer(file);
      }, 'image/jpeg');
    }

    const sendCanvasImageToServer = async (file) => {
      // Crear un FormData, necesario para el uso de Multer en el servidor
      const data = new FormData();
      data.append("image", file);
      
      try {
        const res = await axios.post(`${url}/testForm`, data, { 
          headers: {
            'Content-type': 'multipart/form-data'
          }
        });
        console.log(res);
      } catch (error) {
        console.log(error);
      }
    };
  
    return (
      <>
        <div id="general-container">
          <canvas style={{ border: '1px solid black' }}
            onMouseDown={startDrawing}
            onMouseUp={finishDrawing}
            onMouseMove={draw}
            ref={canvasRef}
          />
          <div id="btn-container">
            <button id="btn-borrar" onClick={resetCanvas}>Borrar</button>
            <button id="btn-guardar" onClick={getCanvasImage}>Guardar</button>
          </div>
        </div>
      </>
    )
}
