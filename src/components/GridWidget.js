import React, {useEffect, useState, useRef, useCallback} from "react";
import {GridStack} from "gridstack";
import '/node_modules/gridstack/dist/gridstack.min.css';
import {ApexChartExample} from './Apex';

const loremIpsum = '<p>Lorem ipsum dolor sit amet. Quo omnis doloribus ab rerum maiores aut labore autem in cupiditate velit sit voluptas nobis.|< END >|</p>'
const tableIpsum = '<br/><table class="blueTable">\n' +
  '<tr>\n' +
  '  <th>Column 1</th>\n' +
  '  <th>Column 2</th>\n' +
  '  <th>Column 3</th>\n' +
  '  <th>Column 4</th>\n' +
  '  <th>Column 5</th>\n' +
  '</tr>\n' +
  '<tr><td>Data 1-1</td><td>Data 1-2</td><td>Data 1-3</td><td>Data 1-4</td><td>Data 1-5</td></tr>\n' +
  '<tr><td>Data 2-1</td><td>Data 2-2</td><td>Data 2-3</td><td>Data 2-4</td><td>Data 2-5</td></tr>\n' +
  '<tr><td>Data 3-1</td><td>Data 3-2</td><td>Data 3-3</td><td>Data 3-4</td><td>Data 3-5</td></tr>\n' +
  '<tr><td>Data 4-1</td><td>Data 4-2</td><td>Data 4-3</td><td>Data 4-4</td><td>Data 4-5</td></tr>\n' +
  '<tr><td>Data 5-1</td><td>Data 5-2</td><td>Data 5-3</td><td>Data 5-4</td><td>Data 5-5</td></tr>\n' +
  '</table>'
const addText = (ref) => ref.current.innerHTML = `${ref.current.innerHTML} ${loremIpsum}`;
const addTable = (ref) => ref.current.innerHTML = `${ref.current.innerHTML} ${tableIpsum}`;
const removeText = (ref) => ref.current.innerHTML = '';

function Buttons({targetRef}) {
  if (!targetRef) return null
  return (
    <div className='flex'>
      <button className='btn' type='button' onClick={() => addText(targetRef)}>Add Text</button>
      <button className='btn' type='button' onClick={() => addTable(targetRef)}>Add Table</button>
      <button className='btn' type='button' onClick={() => removeText(targetRef)}>Remove Text</button>
    </div>
  )
}

function CompA() {
  const targetRef = useRef(null);
  return (
    <div className='comp'>
      <p>Component A</p>
      <Buttons targetRef={targetRef}/>
      <div ref={targetRef}></div>
      <ApexChartExample />
    </div>
  )
}

function CompB() {
  const targetRef = useRef(null);
  return (
    <div className='comp'>
      <p>Component B</p>
      <Buttons targetRef={targetRef}/>
      <div ref={targetRef}></div>
    </div>

  )
}

function CompC() {
  const targetRef = useRef(null);
  return (
    <div className='comp'>
      <p>Component C</p>
      <Buttons targetRef={targetRef}/>
      <div ref={targetRef}></div>
    </div>
  )
}

const replaceItem = (arr, newItem) => arr.map(item => item.id === newItem.id ? newItem : item);

const serializedData = [
  {id: 1, x: 0, y: 0, w: 6, Comp: CompA},
  {id: 2, x: 6, y: 0, w: 3, Comp: CompB},
  {id: 3, x: 1, y: 3, w: 3, Comp: CompC}
];

export function GridWidget() {
  const [layout, setLayout] = useState(serializedData);
  const gridRef = useRef(null);
  const widgetRefs = useRef([]);
  const gridInstanceRef = useRef(null);

  const resizeObserverCallback = useCallback((entries) => {
    console.log('calling resizeObserverCallback')
    const grid = gridInstanceRef.current;
    if (!grid) return;

    for (let entry of entries) {
      const {height} = entry.contentRect;
      const gridItem = entry.target.closest('.grid-stack-item');

      if (gridItem) {
        grid.resizeToContent(gridItem);
      } else {
        console.error('no item!')
      }
    }
  }, []);

  useEffect(() => {
    if (!gridRef.current) return;

    const grid = gridInstanceRef.current = GridStack.init({
      sizeToContent: true,
      acceptWidgets: true,
      margin: '8px',
      float: false,
      minRow: 1,
    }, gridRef.current);

    grid.on('change', (event, items) => {
      console.log(event.currentTarget)
      const newLayout = items.map(item => ({
        id: item.id,
        x: item.x,
        y: item.y,
        w: item.w,
        h: item.h,
        Comp: item.Comp,
      }));
      console.log('grid.on("change")');
      setLayout((item) => replaceItem(item, newLayout));
    });

    // Create a ResizeObserver
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
  }, []);

  return (
    <div className="grid-stack" ref={gridRef}>
      {layout.map((item, index) => {
        const {id, x, y, w, h, Comp, content} = item;
        console.log({item})
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
              <div className='gridStack-inner-wrap' ref={(el) => widgetRefs.current[item.id] = el}>
                <Comp/>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  );
}
