import { useState, useEffect, useRef } from "react";
import img from "../assets/image.png";
import img1 from "../assets/image1.png";
import img2 from "../assets/image2.png";

const images = [img, img1, img2];
const extended = [images[images.length - 1], ...images, images[0]];

export default function Slider() {
  const [current, setCurrent] = useState(1);
  const [transition, setTransition] = useState(true);
  const [sliderHeight, setSliderHeight] = useState("350px");
  const isJumping = useRef(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 480) setSliderHeight("180px");
      else if (window.innerWidth <= 768) setSliderHeight("250px");
      else setSliderHeight("350px");
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isJumping.current) {
        setTransition(true);
        setCurrent((prev) => prev + 1);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (current === extended.length - 1) {
      isJumping.current = true;
      setTimeout(() => {
        setTransition(false);
        setCurrent(1);
        setTimeout(() => {
          isJumping.current = false;
        }, 50);
      }, 600);
    }

    if (current === 0) {
      isJumping.current = true;
      setTimeout(() => {
        setTransition(false);
        setCurrent(extended.length - 2);
        setTimeout(() => {
          isJumping.current = false;
        }, 50);
      }, 600);
    }
  }, [current]);

  const realIndex = current === 0
    ? images.length - 1
    : current === extended.length - 1
    ? 0
    : current - 1;

  return (
    <div style={{ ...styles.wrapper, height: sliderHeight }}>
      <div
        style={{
          ...styles.slideTrack,
          transition: transition ? "transform 0.6s ease-in-out" : "none",
          transform: `translateX(-${current * 100}%)`,
        }}
      >
        {extended.map((image, index) => (
          <img
            key={index}
            src={image}
            style={{ ...styles.image, height: sliderHeight }}
            alt={`slide-${index}`}
          />
        ))}
      </div>

      {/* Dots */}
      <div style={styles.dots}>
        {images.map((_, i) => (
          <span
            key={i}
            style={{
              ...styles.dot,
              background: i === realIndex ? "#fff" : "rgba(255,255,255,0.4)",
              transform: i === realIndex ? "scale(1.3)" : "scale(1)",
            }}
          />
        ))}
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    width: "100%",
    overflow: "hidden",
    position: "relative",
  },
  slideTrack: {
    display: "flex",
    willChange: "transform",
  },
  image: {
    width: "100%",
    objectFit: "cover",
    flexShrink: 0,
  },
  dots: {
    position: "absolute",
    bottom: "10px",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    gap: "8px",
  },
  dot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    transition: "all 0.3s ease",
    display: "inline-block",
  },
};