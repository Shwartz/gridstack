import React, {useEffect, useState, useRef, useCallback} from "react";
import {GridStack} from "gridstack";
import '/node_modules/gridstack/dist/gridstack.min.css';
import {ApexChartExample} from './Apex';

const loremIpsum = '<p>Lorem ipsum dolor sit amet. Quo omnis doloribus ab rerum maiores aut labore autem in cupiditate velit sit voluptas nobis.|< END >|</p>'
const tableIpsum = '<br/><div class="scrollable"><table class="blueTable">\n' +
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
  '</table></div>'
const addText = (ref) => ref.current.innerHTML = `${ref.current.innerHTML} ${loremIpsum}`;
const addTable = (ref) => ref.current.innerHTML = `${ref.current.innerHTML} ${tableIpsum}`;
const removeText = (ref) => ref.current.innerHTML = '';

const useLocalStorageLayout = (key, initialValue) => {
  const [layoutFromStorage, setLayoutToStorage] = useState(() => {
    const storedLayout = localStorage.getItem(key);
    return storedLayout ? JSON.parse(storedLayout) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(layoutFromStorage));
  }, [key, layoutFromStorage]);

  return [layoutFromStorage, setLayoutToStorage];
};

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
      <h2>Component A</h2>
      <Buttons targetRef={targetRef}/>
      <div ref={targetRef}></div>
      <ApexChartExample/>
    </div>
  )
}

function CompB() {
  const targetRef = useRef(null);
  return (
    <div className='comp'>
      <h2>Component B</h2>
      <Buttons targetRef={targetRef}/>
      <div ref={targetRef}></div>
    </div>

  )
}

function CompC() {
  const targetRef = useRef(null);
  return (
    <div className='comp'>
      <h2>Component C</h2>
      <Buttons targetRef={targetRef}/>
      <div ref={targetRef}></div>
    </div>
  )
}

function CompD() {
  const targetRef = useRef(null);
  return (
    <div className='comp'>
      <h2>Component D</h2>
      <Buttons targetRef={targetRef}/>
      <div ref={targetRef}></div>
    </div>
  )
}

const serializedData = [
  {id: '1a', x: 0, y: 0, w: 4},
  {id: '2a', x: 6, y: 0, w: 2},
  {id: '3a', x: 1, y: 6, w: 3},
  {id: '4a', x: 0, y: 8, w: 4},
  {id: '5a', x: 4, y: 5, w: 4},
  {id: '6a', x: 8, y: 5, w: 4},
  {id: '7a', x: 8, y: 7, w: 4},
  {id: '8a', x: 4, y: 7, w: 4},
];

const serializedComponents = [
  {id: '1a', Comp: CompA},
  {id: '2a', Comp: CompB},
  {id: '3a', Comp: CompC},
  {id: '4a', Comp: CompD},
  {id: '5a', Comp: CompB},
  {id: '6a', Comp: CompC},
  {id: '7a', Comp: CompD},
  {id: '8a', Comp: CompC},
]

const getComponentById = (data, id) => data.find((item) => item.id === id)?.Comp;

export function GridWidget() {
  const [layoutFromStorage, setLayoutToStorage] = useLocalStorageLayout('gridStack-layout', serializedData);
  const [layout, setLayout] = useState(layoutFromStorage || serializedData);
  const [theme, toggleTheme] = useState(false);
  const gridInstanceRef = useRef(null);
  const gridDOMRef = useRef(null);
  const widgetRefs = useRef([]);

  const resizeObserverCallback = useCallback((entries) => {
    const grid = gridInstanceRef.current;
    if (!grid) return;

    for (let entry of entries) {
      const gridItem = entry.target.closest('.grid-stack-item');

      if (gridItem) {
        grid.resizeToContent(gridItem);
      }
    }
  }, []);

  useEffect(() => {
    if (!gridDOMRef.current) return;

    const grid = gridInstanceRef.current = GridStack.init({
      sizeToContent: true,
      acceptWidgets: true,
      margin: '8px',
      float: false,
      // minRow: 1,
      cellHeight: 1,
      columnOpts: {
        breakpointForWindow: true,
        breakpoints: [
          {w: 1024, c: 1},
          {w: 1025, c: 12},
        ],
      },
    }, gridDOMRef.current);

    grid.on('change', (event, movedItems) => {
      const newLayout = movedItems.map(item => ({
        id: item.id,
        x: item.x,
        y: item.y,
        w: item.w,
        h: item.h,
      }));
      // Create map of changed items by id
      const newLayoutMap = new Map(newLayout.map(item => [item.id, item]));
      // Update layout and update changed item by id
      const updatedLayout = layout.map(item =>
        newLayoutMap.has(item.id) ? {...item, ...newLayoutMap.get(item.id)} : item
      );
      console.log('--- onChange: ', updatedLayout);
      setLayoutToStorage(updatedLayout);
    });

    // Create a ResizeObserver
    const observer = new ResizeObserver(resizeObserverCallback);

    Object.values(widgetRefs.current).forEach((widgetRef) => {
      if (widgetRef) {
        observer.observe(widgetRef);
      }
    });

    return () => {
      grid.destroy();
      observer.disconnect();
    };
  }, []);

  const enrichedLayout = layout.map(item => ({
    id: item.id,
    x: item.x,
    y: item.y,
    w: item.w,
    h: item.h,
    Comp: getComponentById(serializedComponents, item.id)
  }))

  return (
    <>
      <button
        onClick={() => toggleTheme(!theme)}
        className={`btn ${theme ? 'gridStackContainer' : ''}`}
      >Toggle Theme
      </button>
      <div className="grid-stack" ref={gridDOMRef}>
        {enrichedLayout.map((item, index) => {
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
                <div className='gridStack-inner-wrap' ref={(el) => widgetRefs.current[item.id] = el}>
                  {Comp && <Comp/>}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </>
  );
}
