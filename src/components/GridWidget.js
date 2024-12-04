import React, {useEffect, useState, useRef} from "react";
import {GridStack} from "gridstack";
import '/node_modules/gridstack/dist/gridstack.min.css';

function CompA() {
  return (
    <div>Component A</div>
  )
}

function CompB() {
  return (
    <div>Component B</div>
  )
}

function CompC() {
  return (
    <div>Component C</div>
  )
}

const replaceItem = (arr, newItem) => {
  return arr.map(item => item.id === newItem.id ? newItem : item);
};

const serializedData = [
  {id: 1, x: 0, y: 0, w: 2, h: 2, content: 'C1 -> x: 0, y: 0, w: 2, h: 2', Comp: CompA},
  {id: 2, x: 2, y: 3, w: 3, content: 'C2 -> x: 2, y: 3, w: 3', Comp: CompB},
  {id: 3, x: 1, y: 3, content: 'C3 -> x: 1, y: 3', Comp: CompC}
];

GridStack.init();

export function GridWidget() {
  const [layout, setLayout] = useState(serializedData);
  const gridRef = useRef(null);

  useEffect(() => {
    const grid = GridStack.init();

    grid.on('change', (event, items) => {
      console.log({items})
      const newLayout = items.map(item => ({
        id: item.id,
        x: item.x,
        y: item.y,
        w: item.w,
        h: item.h,
        content: item.el.textContent,
        Comp: item.Comp,
      }));
      setLayout((item) => replaceItem(item, layout));
    });

    return () => {
      grid.destroy();
    };
  }, []);

  return (
    <div className="grid-stack">
      {layout.map((item, index) => {
        const {id, x, y, w, h, Comp, content} = item;
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
              {content}
              <Comp />
            </div>
          </div>
        )
      })}
    </div>
  );
}
