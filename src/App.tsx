import { useRef,useEffect,useState,MouseEvent  } from 'react'
import createEnemy from './classes/Enemy';
// import Player from './classes/Player';
import Actor from './classes/Actor';
import createPlayer,{Player} from './classes/Player';

import './App.css'
import { canvasHeight, canvasWidth } from './config';


const Canvas = () =>{
  const [coords, setCoords] = useState({x: 0, y: 0});
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasCtxRef = useRef<CanvasRenderingContext2D | null>(null);
  const fpsRef = useRef<number>(0); 
  const requestRef=useRef<undefined|number>(); 
  const oldTimeStampRef = useRef<Date|undefined>();

  function handleClick(event: MouseEvent<HTMLCanvasElement>){

    let newX= event.clientX - (event?.target as HTMLInputElement).offsetLeft;
    let newY= event.clientY - (event?.target as HTMLInputElement).offsetTop;
    if(Math.hypot(newX-(Actor.player as Player).x,newY-(Actor.player as Player).y)>(Actor.player as Player).radius){
      setCoords({
        x: newX,
        y: newY,
      });
      (Actor.player as Player).target={x:newX,y:newY};
      (Actor.player as Player).updateSpeedAndAngle();
    }
  };

  function drawEverything(ctx:CanvasRenderingContext2D){
    Actor.instanceList.forEach(a=>a.draw(ctx)) 
  }

  function moveEverything(secondsPassed:number){
    Actor.instanceList.forEach(a=>a.updateSpeedAndAngle())
    Actor.instanceList.forEach(a=>a.move(secondsPassed))
  }

  let secondsPassed:number=0;
  function gameLoop(ctx:CanvasRenderingContext2D) {
    let timeStamp = new Date();
    if (oldTimeStampRef.current != undefined) {
      secondsPassed = (Number(timeStamp) - Number(oldTimeStampRef.current))/1000;
      ctx.clearRect ( 0 , 0 , canvasWidth , canvasHeight );
      moveEverything(secondsPassed);
      Actor.detectCollisions();
      drawEverything(ctx);      
      fpsRef.current = Math.round(1 / secondsPassed);
    }

    oldTimeStampRef.current = timeStamp;
    requestRef.current = window.requestAnimationFrame(()=>gameLoop(ctx));
  }


  // function replaceEverything(ctx:CanvasRenderingContext2D){
  //   Enemy.instanceList.forEach(a=>
  //     {
  //       a.replace();
  //       a.draw(ctx);        
  //     }) 
  // }

  useEffect(() => {

    if (!Actor.player){
      // new Player({x:canvasWidth/2,y:canvasHeight/2});
      createPlayer({x:canvasWidth/2,y:canvasHeight/2});

    }
    createEnemy({x:(Actor.player as Player).x,y:(Actor.player as Player).y});
    
    

    
    if (canvasRef.current!==null){
      canvasCtxRef.current = canvasRef.current.getContext('2d');
      canvasRef.current.width  = canvasWidth;
      canvasRef.current.height = canvasHeight;
    }
    else{
      throw new Error('No canvas is found.');
    }
    if(canvasCtxRef.current!==null){
      drawEverything(canvasCtxRef.current as CanvasRenderingContext2D)       
    }
    else{
      throw new Error('No canvas context is found.');
    }
    requestRef.current = window.requestAnimationFrame(()=>gameLoop(canvasCtxRef.current as CanvasRenderingContext2D));
    return () => cancelAnimationFrame(requestRef.current as number);


  }, []);

  return (
    <>
      <p>x:{coords.x} y:{coords.y}</p>
      <canvas tabIndex={0} ref={canvasRef} 
      // onKeyDown={()=>replaceEverything(canvasCtxRef.current as CanvasRenderingContext2D)}
      onClick={handleClick}/>
    </>
  )
}
function App() {  
   
  return (
    <div className="App">      
      <Canvas/>
    </div>
  )
}

export default App
