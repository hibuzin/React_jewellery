import { useState, useEffect } from "react";
import img from "../assets/image.png";
import img1 from "../assets/image1.png";
import img2 from "../assets/image2.png";

const images = [img, img1, img2];

export default function Slider() {
  const [current, setCurrent] = useState(0);
  const [transition, setTransition] = useState(true);

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
    <div style={styles.slider}>
      <div
        style={{
          ...styles.slideTrack,
          transition: transition ? "transform 0.6s ease-in-out" : "none",
          transform: `translateX(-${current * 100}%)`,
        }}
      >
        {[...images, images[0]].map((image, index) => (
          <img key={index} src={image} style={styles.image} />
        ))}
      </div>
    </div>
  );
}

const styles = {
  slider: {
    width: "100%",
    height: "350px",
    overflow: "hidden",
  },
  slideTrack: {
    display: "flex",
  },
  image: {
    width: "100%",
    height: "350px",
    objectFit: "cover",
    flexShrink: 0,
  },
};