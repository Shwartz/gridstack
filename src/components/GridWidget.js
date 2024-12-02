import React, {useEffect, useRef} from "react";
import {GridStack} from "gridstack";
import '/node_modules/gridstack/dist/gridstack.min.css';

const items = [
  {content: 'my first widget'}, // will default to location (0,0) and 1x1
  {w: 2, content: 'another longer widget!'}, // will be placed next at (1,0) and 2x1
  {h: 2, content: 'Some more'},
];

export function GridWidget() {
  const gridRef = useRef(null);

  useEffect(() => {
    console.log({gridRef});
    if (gridRef) {
      const grid = GridStack.init();
      grid.load(items);
    }

  }, []);

  return (
    <div ref={gridRef} className='grid-stack'></div>
  )
}
