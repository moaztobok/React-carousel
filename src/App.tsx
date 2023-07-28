import {useState,useRef,MouseEvent, MouseEventHandler, TouchEventHandler, useEffect} from 'react'
//slides used in the carousel
const Slides = [
  'https://images.pexels.com/photos/1166209/pexels-photo-1166209.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  'https://images.pexels.com/photos/808465/pexels-photo-808465.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  'https://images.pexels.com/photos/2086917/pexels-photo-2086917.png?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1']
function App() {
  const [current,setCurrent]=useState<number>(0)
  const [isDragging,setIsDragging]= useState<boolean>(false)
   const [startPos,setStartPos]=useState<number>()
   const [stopPos,setStopPos]=useState<number>()
   const [drag,setDrag]=useState<number>()
   const THRESHOLD = 15;

 const carousel = useRef<HTMLDivElement>(null)

  const container: React.CSSProperties = {
    display :'grid',
    background:'grey',
    placeItems:'center',
    position:'relative',
    overflow:'hidden'
  }
  const slides: React.CSSProperties ={
    minWidth:'100vw',
    display: 'flex',
    overflow:'hidden',
    color:'black',
    fontSize:'200px'
  }
  const card : React.CSSProperties  = {
    userSelect:'none',
    textAlign:'center',
    background:'red',
    minHeight:'400px',
    minWidth:'100%',
    //using transform to change between the slides 
    //each slide had a percentage of the carousel's width 
    //this way you can easly ajust and augment the code to your liking
    //the drag is a persentage of the x value moved with regards to the carousel
    transform:`translateX(-${!isDragging ? current * 100 : drag ? ((current*100)+drag) : ''}%)`,
    transition : `${isDragging ? 'none' : 'ease 0.2s'}`,
    backgroundSize:'cover',
    backgroundRepeat :'no-repeat',
    display:'flex',
    justifyContent:'center',
    alignItems:'center',
    color:'white'
    }

    //whilst moving over the carousel this will be taking the curson x-axis value of it
  
    const handleMove = (pageX : number) : void=>{
      if (carousel.current && isDragging){
        const width = carousel.current.offsetWidth

        if(typeof startPos !== 'undefined'){
          setDrag(((startPos-pageX)*100)/width)
        }
      }
    }
    //these function are seperated into two MouseEvenHandler & touchEventHandler and have the same logic
    
    const dragging: MouseEventHandler<HTMLDivElement> = (event : MouseEvent)  => {
      handleMove(event.pageX)
    }
    const draggingTouch: TouchEventHandler<HTMLDivElement> = (event)  => {
      handleMove(event.touches[0].pageX)
    }
    const handleDragStart = (pageX : number) : void =>{
      setIsDragging(true)
      setStartPos(pageX)
    }
    
    const dragStart: MouseEventHandler<HTMLDivElement> = (event: MouseEvent) =>{
      handleDragStart(event.pageX)
    }
    const touchStart: TouchEventHandler<HTMLDivElement> = (event) =>{
      handleDragStart(event.touches[0].pageX)
    }
    const handleDragStop = (pageX:number) : void =>{
      setIsDragging(false)
      setStopPos(pageX)
      if( stopPos && startPos){
        const distanceMoved = stopPos - startPos;
        //THRESHOLD is the value of x should be moved for any change of current slide to take place
        if (Math.abs(distanceMoved) >= THRESHOLD) {
          setCurrent((prevCurrent) =>
          distanceMoved > 0 ? (prevCurrent + Slides.length - 1) % Slides.length : (prevCurrent + 1) % Slides.length
          );
          setStartPos(0)
          setStopPos(0)
        }    
      }
    }
    const dragStop:  MouseEventHandler<HTMLDivElement> = (event: MouseEvent) => { 
      handleDragStop(event.pageX)
    }
    const touchStop: TouchEventHandler<HTMLDivElement> = (event) => { 
      handleDragStop(event.changedTouches[0].pageX)
    }
    const intervall = 5000
    //this use effect is responsable autoAdvance
    useEffect(() => {
      const handleAutoAdvance = () => {
        setCurrent((prevCurrent) => (prevCurrent + 1) % Slides.length);
     
      };    
      //reseting drag is important the cards might jump on touch if you dont
      if (!isDragging) {
        setDrag(0); 

      }
    const intervalId = window.setInterval(handleAutoAdvance,intervall);
      return () => {
        window.clearInterval(intervalId);
      };
  
    }, [isDragging,intervall]);

  return (
    <div style={container}>
      <div style={slides} ref={carousel}
      onMouseDown={dragStart}
      onMouseMove={dragging}
      onMouseUp={dragStop}
      onTouchStart={touchStart}
      onTouchMove={draggingTouch}
      onTouchEnd={touchStop}
      >
      {/* map the Slides */}
        {Slides.map((image,index)=>
        <div style={{...card,...{backgroundImage:`url(${image})`,backgroundSize:'cover'}}}>
          {index}
          </div>
        )}
      </div>
      <div
      style={
        {position:'absolute',
      bottom:'20px',
    display:'flex',
  gap:'20px'}
      }>
        {/* map circles according to number of slides each circle has a onClick to change the carousel to it slide */}
        {Slides.map((image,index)=>
        <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 18 18"
        className='cursor-pointer'
        onClick={()=>setCurrent(index)}>
        <circle id={image} key={index} data-name="Ellipse 14" cx="9" cy="9" r="9" fill= {`#FFFFFF`} opacity= {index===current?`100%`:`
        50%`}/>            
        </svg>)}
      </div>
        
    </div>
  )
}

export default App