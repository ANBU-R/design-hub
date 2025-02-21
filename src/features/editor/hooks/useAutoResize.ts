import { useCallback, useEffect } from "react";
import { fabric } from "fabric";

type useAutoResizeProps = {
  canvas: fabric.Canvas | null;
  container: HTMLDivElement | null;
};

const useAutoResize = ({ canvas, container }: useAutoResizeProps) => {
  const autoResize = useCallback(() => {
    if (!canvas || !container) return;
    const height = container.offsetHeight;
    const width = container.offsetWidth;
    canvas.setHeight(height);
    canvas.setWidth(width);
    const center = canvas.getCenter();
    const slide = canvas.getObjects().find((el) => el.name === "slide");
    // @ts-expect-error findScaleToFit method doesn't support typescript
    const scale = fabric.util.findScaleToFit(slide, {
      width,
      height,
    });
    // console.log(scale);
    const zoomRatio = 0.85;
    const zoom = zoomRatio * scale;
    canvas.setViewportTransform(fabric.iMatrix.concat());
    canvas.zoomToPoint(new fabric.Point(center.top, center.left), zoom);
    if (slide) {
      const slideCenter = slide.getCenterPoint();
      const viewPortTransform = canvas.viewportTransform;
      // viewPortTransform =[scaleX, skewY, skewX, scaleY, translation, translationY]
      /* 0 scaleX - Horizontal scaling (zooming)
         1 skewY - Vertical skewing
         2 skewX - Horizontal skewing
         3 scaleY - Vertical scaling (zooming)
         4 translateX - Horizontal translation 
         5 translateY - Vertical translation 
        */

      if (
        canvas.width !== undefined ||
        canvas.height !== undefined ||
        viewPortTransform
      ) {
        viewPortTransform![4] =
          canvas.width! / 2 - slideCenter.x * viewPortTransform![0];
        viewPortTransform![5] =
          canvas.height! / 2 - slideCenter.y * viewPortTransform![3];
        canvas.setViewportTransform(viewPortTransform!);
        slide.clone((cloned: fabric.Rect) => {
          canvas.clipPath = cloned;
          canvas.requestRenderAll();
        });
      }
    }
  }, [canvas, container]);
  useEffect(() => {
    let resizeObserver: ResizeObserver | null = null;
    if (canvas && container) {
      resizeObserver = new ResizeObserver(() => {
        autoResize();
      });
      resizeObserver.observe(container);
    }
    console.log(canvas);
    return () => {
      if (resizeObserver) resizeObserver.disconnect();
    };
  }, [canvas, container, autoResize]);
};

export default useAutoResize;
