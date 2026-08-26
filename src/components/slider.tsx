import { useState, useEffect, useRef } from "react";

import slideImg1 from "../assets/images/pexels-godisable-jacob-818992.jpg";
import slideImg2 from "../assets/images/pexels-chloe-1043474.jpg";
import slideImg3 from "../assets/images/pexels-evg-kowalievska-1055691.jpg";

type Slide = {
  id: number;
  img?: string;
  caption: string;
};

function Slider() {
  let [bgSlide] = useState<Slide[]>([
    { id: 1, img: slideImg1, caption: "Summer sale" },
    { id: 2, img: slideImg2, caption: " Suits" },
    { id: 3, img: slideImg3, caption: "Glamour Galore" },
    { id: 4, img: slideImg1, caption: "Summer sale" },
  ]);

  let [currentIndex, setCurrentIndex] = useState(0);
  let [slideTransition, setSlideTransition] = useState(true);
  const slideWidth = 100;
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const intervalId = setInterval(
      () => {
        setSlideTransition(true);
        setCurrentIndex((prev) => prev + 1);
        if (currentIndex == 3) {
          setSlideTransition(false);
          setCurrentIndex(0);
        }
      },
      slideTransition ? 5000 : 300
    );
    return () => clearInterval(intervalId);
  }, [currentIndex]);

  let slideStyles = {
    transform: `translateX(-${slideWidth * currentIndex}vw)`,
    transition: `${slideTransition ? "all 1000ms ease-in" : ""}`,
  };
  return (
    <div className='overall-container'>
      <div style={slideStyles} ref={sliderRef} className='inner-container'>
        {bgSlide.map((eachSlide) => (
          <div
            key={eachSlide.id}
            className='slider-container'
            style={{
              backgroundImage: `url(${eachSlide.img})`,
              backgroundPosition: "center center",
              backgroundSize: "cover",
            }}
          >
            <div className='slider-img-div'></div>
            <div className='slider-text-div'>
              <h1>{eachSlide.caption}</h1>
              <p>Buy all you can possible imagine</p>
              <button>
                <a href='#categories'>Shop now</a>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Slider;
