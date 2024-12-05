import React, {useEffect, useState, useRef} from "react";
import {GridStack} from "gridstack";
import '/node_modules/gridstack/dist/gridstack.min.css';

const loremIpsum = 'Lorem ipsum dolor sit amet. Quo omnis doloribus ab rerum maiores aut labore autem in cupiditate velit sit voluptas nobis.|< END >|'

const addText = (ref) => ref.current.innerHTML = `${ref.current.innerHTML} + ${loremIpsum}`;
const removeText = (ref) => ref.current.innerHTML = '';

function Buttons({targetRef}) {
  if (!targetRef) return null
  return (
    <div className='flex'>
      <button type='button' onClick={() => addText(targetRef)}>Add Text</button>
      <button type='button' onClick={() => removeText(targetRef)}>Remove Text</button>
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
  {id: 1, x: 0, y: 0, w: 2, h: 2, Comp: CompA},
  {id: 2, x: 2, y: 3, w: 3, Comp: CompB},
  {id: 3, x: 1, y: 3, Comp: CompC}
];

export function GridWidget() {
  const [layout, setLayout] = useState(serializedData);
  const gridRef = useRef(null);
  const widgetRefs = useRef([]);

  useEffect(() => {
    const grid = GridStack.init({
      sizeToContent: true,
      margin: '8px',
      acceptWidgets: true,
      float: false,
      minRow: 1,
    }, gridRef.current);

    grid.on('change', (event, items) => {
      const newLayout = items.map(item => ({
        id: item.id,
        x: item.x,
        y: item.y,
        w: item.w,
        h: item.h,
        Comp: item.Comp,
      }));
      console.log('grid.on("change")');
      setLayout((item) => replaceItem(item, layout));
    });

    // Create a ResizeObserver
    const observers = widgetRefs.current.map((widgetRef, index) => {
      const observer = new ResizeObserver(entries => {
        for (let entry of entries) {
          const { height} = entry.contentRect;
          grid.update(widgetRef.parentElement.parentElement, {
            h: Math.ceil(height / grid.opts.cellHeight)
          });
        }
      });

      if (widgetRefs) {
       observer.observe(widgetRef);
      }

      return observer;
    });

    return () => {
      grid.destroy();
      observers.forEach(observer => observer.disconnect());
    };
  }, [layout.length]);

  return (
    <div className="grid-stack" ref={gridRef}>
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
              <div className='gridStack-inner-wrap' ref={(el) => widgetRefs.current[index] = el}>
                <Comp />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  );
}
