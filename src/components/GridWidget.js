import React, {useEffect, useRef} from "react";
import {GridStack} from "gridstack";
import '/node_modules/gridstack/dist/gridstack.min.css';

const CompA = () => {
  return (
    <div className="grid-stack-item-content">Tiny A component</div>
  )
}

const items = [
  {content: 'my first widget'}, // will default to location (0,0) and 1x1
  {w: 2, content: 'another longer widget!'}, // will be placed next at (1,0) and 2x1
  {h: 2, content: 'Some more'},
  {content: <CompA/>}
];

const serializedData = [
  {x: 0, y: 0, w: 2, h: 2, content: 'C1 -> x: 0, y: 0, w: 2, h: 2'},
  {x: 2, y: 3, w: 3, content: 'C2 -> x: 2, y: 3, w: 3'},
  {x: 1, y: 3, content: 'C3 -> x: 1, y: 3'}
];



export function GridWidget() {
  const gridRef = useRef(null);

  useEffect(() => {
    console.log({gridRef});
    if (gridRef) {
      const grid = GridStack.init();
      grid.load(serializedData);
    }

  }, []);

  return (
    <div ref={gridRef} className='grid-stack'></div>
  )
}
