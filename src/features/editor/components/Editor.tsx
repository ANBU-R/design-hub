"use client";

import { useEffect, useRef } from "react";
import { useEditor } from "../hooks/useEditor";
import { fabric } from "fabric";
const Editor = () => {
  const { init } = useEditor();
  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current!, {
      controlsAboveOverlay: true,
      preserveObjectStacking: true,
    });
    init({
      initialCanvas: canvas,
      initialContainer: containerRef.current!,
    });
  }, [init]);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  return (
    <div className="h-full flex flex-col">
      <div className=" flex-1 h-full bg-muted" ref={containerRef}>
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
};
export default Editor;
