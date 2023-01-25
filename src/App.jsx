import { useEffect, useRef, useState } from "react";

export const App = () => {

  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    canvas.width = 1000;
    canvas.height= 400;
    canvas.style.width = `500px`;
    canvas.style.height = `200px`;
    context.scale(2,2)
    context.lineCap = 'round'
    context.lineWidth = 3
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

  return (
    <>
      <canvas style={{ border: '1px solid black' }}
        onMouseDown={startDrawing}
        onMouseUp={finishDrawing}
        onMouseMove={draw}
        ref={canvasRef}
      />
      <div></div>
    </>
  )
}
