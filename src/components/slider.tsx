import { useState,useEffect,} from "react"
import slideImg1 from "../assets/images/pexels-godisable-jacob-818992.jpg"
import slideImg2 from "../assets/images/pexels-chloe-1043474.jpg"
import slideImg3 from "../assets/images/pexels-evg-kowalievska-1055691.jpg"



type Slide = ({
 img?:string,
 caption:string
})

function Slider() {
  let [bgSlide] = useState<Slide[]>([{img:slideImg1,caption:'Summer sale'},{img:slideImg2,caption:' Suits'},{img: slideImg3,caption:'Glamour Galore'}])
  let [currentIndex,setCurrentIndex] = useState(0)
  let [slideTransition,setSlideTransition] = useState(true)
  const slideWidth = 100
  const slideDiv = document.querySelector<HTMLElement>('.inner-container')
  let intervalId:NodeJS.Timeout;

 useEffect(()=>{
   if(currentIndex == 3){
  setSlideTransition(false)
  if(!slideDiv)return
  setCurrentIndex(0)
}
 },[currentIndex])
 
  function StartSlide():void{
    intervalId = setInterval(()=>{
      setSlideTransition(true)
     setCurrentIndex((prev)=>(prev + 1))
    },5000)
  }
 
    useEffect(()=>{ 
        StartSlide()
   return ()=>clearInterval(intervalId)
     },[])
    

  const slideStyles = {
    transform:`translateX(-${ currentIndex * slideWidth}vw)`,
    transition: slideTransition ? 'all 1000ms ease-in' : ''
}
  return (
    <div className="overall-container" >
      <div style ={slideStyles} className="inner-container" >
      {bgSlide.map((eachSlide,index)=>(
      <div key={index} className="slider-container" style={{backgroundImage:`url(${eachSlide.img})`,backgroundPosition: 'center center',backgroundSize:'cover',
      }}>
        <div className="slider-img-div">
       
        </div>
        <div className="slider-text-div">
          <h1>
            {eachSlide.caption}
          </h1>
          <p>Buy all you can possible imagine</p>
          <button>
            <a href="#categories">Shop now</a>
          </button>
        </div>
      </div>
    ))}
      </div>
    
    </div>
    
  )
}

export default Slider