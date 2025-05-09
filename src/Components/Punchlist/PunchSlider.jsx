import React, { useRef } from "react";
import Slider from "react-slick";
import styles from "./SliderPunch.module.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { url2 } from "../../config/url";

export default function SimpleSlider({ images = [] }) {
  const sliderRef = useRef(null);

  const settings = {
    dots: false,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: "40px",
    autoplay: true,
    responsive: [
      {
        breakpoint: 400,
        settings: { slidesToShow: 3, centerPadding: "15px" },
      },
      {
        breakpoint: 350,
        settings: { slidesToShow: 2, centerPadding: "35px" },
      },
    ],
  };

  const nextSlide = () => sliderRef.current.slickNext();
  const prevSlide = () => sliderRef.current.slickPrev();

  const showSlider = images.length >= 3;

  return (
    <div className={styles.PunchImageSlider}>
      {showSlider ? (
        <>
          <button
            className={`${styles.arrow} ${styles.left}`}
            onClick={prevSlide}
          >
            <img src="/Svg/leftArrow.svg" alt="Previous Slide" />
          </button>

          <button
            className={`${styles.arrow} ${styles.right}`}
            onClick={nextSlide}
          >
            <img src="/Svg/rightArrow.svg" alt="Next Slide" />
          </button>

          <Slider ref={sliderRef} {...settings}>
            {images.slice(0, 5).map((img, i) => (
              <div className={styles.slideImg} key={i}>
                <a
                  href={`${url2}/${img}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={`${url2}/${img}`} alt={`Image ${i + 1}`} />
                </a>
              </div>
            ))}
          </Slider>
        </>
      ) : (
        <div className={styles.flexImages}>
          {images.map((img, i) => (
            <div className={styles.slideImg} key={i}>
              <a
                href={`${url2}/${img}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={`${url2}/${img}`} alt={`Image ${i + 1}`} />
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
