import React, { useEffect, useRef } from 'react';
import { GridStack } from 'gridstack';

const MyGridComponent = ({ widgets }) => {
  const gridRef = useRef(null);
  const widgetRefs = useRef([]);

  useEffect(() => {
    const grid = GridStack.init({/* options */}, gridRef.current);
    const observers = widgetRefs.current.map((widgetRef, index) => {

      const observer = new ResizeObserver(entries => {
        for (let entry of entries) {
          const { height } = entry.contentRect;
          grid.update(widgetRef, { h: Math.ceil(height / grid.opts.cellHeight) });
        }
      });

      if (widgetRefs) {
        observer.observe(widgetRef);
      }

      return observer;
    });

    return () => {
      observers.forEach(observer => observer.disconnect());
      grid.destroy();
    };
  }, [widgets.length]);

  return (
    <div className="grid-stack" ref={gridRef}>
      {widgets.map((widget, index) => (
        <div
          key={widget.id}
          className="grid-stack-item"
          ref={el => widgetRefs.current[index] = el}
        >
          <div className="grid-stack-item-content">
            {/* Widget content */}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyGridComponent;
