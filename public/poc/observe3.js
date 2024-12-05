import React, { useEffect, useState, useRef, useCallback } from "react";
import { GridStack } from "gridstack";
import '/node_modules/gridstack/dist/gridstack.min.css';

// ... (keep your existing code for CompA, CompB, CompC, etc.)

export function GridWidget() {
  const [layout, setLayout] = useState(serializedData);
  const gridRef = useRef(null);
  const widgetRefs = useRef([]);
  const gridInstanceRef = useRef(null);

  const resizeObserverCallback = useCallback((entries) => {
    const grid = gridInstanceRef.current;
    if (!grid) return;

    for (let entry of entries) {
      const { height } = entry.contentRect;
      const gridItem = entry.target.closest('.grid-stack-item');
      if (gridItem) {
        grid.update(gridItem, {
          h: Math.max(1, Math.ceil(height / grid.opts.cellHeight)),
        });
      } else {
        console.warn('no item!')
      }
    }
  }, []);

  useEffect(() => {
    if (!gridRef.current) return;

    gridInstanceRef.current = GridStack.init({
      sizeToContent: true,
      margin: '8px',
      acceptWidgets: true,
      float: false,
      minRow: 1,
    }, gridRef.current);

    const grid = gridInstanceRef.current;

    grid.on('change', (event, items) => {
      const newLayout = items.map(item => ({
        id: item.id,
        x: item.x,
        y: item.y,
        w: item.w,
        h: item.h,
        Comp: item.Comp,
      }));
      setLayout(newLayout);
    });

    const observer = new ResizeObserver(resizeObserverCallback);

    widgetRefs.current.forEach((widgetRef) => {
      if (widgetRef) {
        observer.observe(widgetRef);
      }
    });

    return () => {
      grid.destroy();
      observer.disconnect();
    };
  }, []); // Empty dependency array, run only once on mount

  return (
    <div className="grid-stack" ref={gridRef}>
      {layout.map((item, index) => {
        const { id, x, y, w, h, Comp } = item;
        return (
          <div
            className="grid-stack-item"
            key={id}
            gs-id={id}
            id={`id-${id}`}
            data-gs-x={x}
            data-gs-y={y}
            data-gs-width={w}
            data-gs-height={h}
            gs-x={x}
            gs-y={y}
            gs-w={w}
            gs-h={h}
          >
            <div className="grid-stack-item-content">
              <div className='gridStack-inner-wrap' ref={(el) => widgetRefs.current[index] = el}>
                <Comp />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
