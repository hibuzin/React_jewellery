import { useState, useEffect } from "react";
import img from "../assets/image.png";
import img1 from "../assets/image1.png";
import img2 from "../assets/image2.png";

const images = [img, img1, img2];

export default function Slider() {
  const [current, setCurrent] = useState(0);
  const [transition, setTransition] = useState(true);
  const [sliderHeight, setSliderHeight] = useState("350px"); // default desktop height

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 480) setSliderHeight("200px"); // mobile
      else if (window.innerWidth <= 768) setSliderHeight("250px"); // tablet
      else setSliderHeight("350px"); // desktop
    };

    handleResize(); // set initial height
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => prev + 1);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (current === images.length) {
      setTimeout(() => {
        setTransition(false);
        setCurrent(0);
      }, 600);
    } else {
      setTransition(true);
    }
  }, [current]);

  return (
    <div style={{ ...styles.slider, height: sliderHeight }}>
      <div
        style={{
          ...styles.slideTrack,
          transition: transition ? "transform 0.6s ease-in-out" : "none",
          transform: `translateX(-${current * 100}%)`,
        }}
      >
        {[...images, images[0]].map((image, index) => (
          <img
            key={index}
            src={image}
            style={{ ...styles.image, height: sliderHeight }}
          />
        ))}
      </div>
    </div>
  );
}

const styles = {
  slider: {
    width: "100%",
    overflow: "hidden",
  },
  slideTrack: {
    display: "flex",
  },
  image: {
    width: "100%",
    objectFit: "cover",
    flexShrink: 0,
  },
};