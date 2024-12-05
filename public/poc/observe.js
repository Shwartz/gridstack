import React, { useEffect, useRef } from 'react';
import { GridStack } from 'gridstack';

const MyGridComponent = () => {
  const gridRef = useRef(null);
  const widgetRef = useRef(null);

  useEffect(() => {
    // Initialize GridStack
    const grid = GridStack.init({/* options */}, gridRef.current);

    // Create a ResizeObserver
    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        // Get the new size of the widget
        const { height } = entry.contentRect;

        // Update GridStack layout
        grid.update(widgetRef.current, { h: Math.ceil(height / grid.opts.cellHeight) });
      }
    });

    // Start observing the widget content
    if (widgetRef.current) {
      resizeObserver.observe(widgetRef.current);
    }

    // Cleanup on component unmount
    return () => {
      resizeObserver.disconnect();
      grid.destroy();
    };
  }, []);

  return (
    <div className="grid-stack" ref={gridRef}>
      <div className="grid-stack-item" ref={widgetRef}>
        <div className="grid-stack-item-content">
          {/* Your dynamic content here */}
        </div>
      </div>
    </div>
  );
};

export default MyGridComponent;
