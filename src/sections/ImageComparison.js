import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import React, { useEffect, useRef, useState } from "react";

gsap.registerPlugin(Draggable);

const data = [
  {
    leftImage:
      "https://thewebmax.org/modern/images/main-slider/slider3/slide1-b.jpg",
    rightImage:
      "https://thewebmax.org/modern/images/main-slider/slider3/slide1.jpg",
    title: "Modern",
    text: "A design isn't finished until someone is using it.",
  },
  {
    leftImage:
      "https://thewebmax.org/modern/images/main-slider/slider3/slide2-b.jpg",
    rightImage:
      "https://thewebmax.org/modern/images/main-slider/slider3/slide2.jpg",
    title: "Perfect",
    text: "A whole different kind of architectural firm.",
  },
];

const ImageComparison = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const galleryRef = useRef(null);
  const clippedImageRef = useRef(null);
  const draggerRef = useRef(null);
  const ratio = useRef(0.5);
  const leftContentRef = useRef(null);
  const rightContentRef = useRef(null);
  const unClippedImageRef = useRef(null);
  const arrowRef = useRef(null);

  useEffect(() => {
    const gallery = galleryRef.current;
    const clipped = clippedImageRef.current;
    const initialX = ratio.current * gallery.getBoundingClientRect().width;
    const initialY = draggerRef.current?.getBoundingClientRect().height;

    const resizeHandler = () => {
      const width = gallery.getBoundingClientRect().width;
      const x = ratio.current * width;
      gsap.set(draggerRef.current, { x });
      gsap.set(clipped, { clipPath: `inset(0px ${width - x}px 0px 0px)` });
    };

    const updateDrag = () => {
      const width = gallery.getBoundingClientRect().width;
      const x = Number(
        (draggerRef.current._gsap.x || "0")
          .toString()
          .replace("px", "")
          .replace(" ", "")
      );

      gsap.set(clipped, {
        clipPath: `inset(0px ${initialX - x}px 0px 0px)`,
      });

      ratio.current = x / width;
    };

    const verticalDragUpdate = () => {
      const y = Number(
        (arrowRef.current._gsap.y || "0")
          .toString()
          .replace("px", "")
          .replace(" ", "")
      );
      gsap.set(arrowRef.current, {
        top: (initialY - y / 2) / 2,
      });
    };

    const draggable = Draggable.create(draggerRef.current, {
      type: "x",
      bounds: gallery,
      onDrag: updateDrag,
      onThrowUpdate: updateDrag,
      throwResistance: 2000,
      inertia: true,
    })[0];

    const verticalDrag = Draggable.create(arrowRef.current, {
      type: "y",
      bounds: draggerRef.current,
      onDrag: verticalDragUpdate,
      onThrowUpdate: verticalDragUpdate,
      throwResistance: 2000,
      inertia: true,
    })[0];

    const mouseMoveHandler = (e) => {
      const mouseX = gallery.getBoundingClientRect().width / 2 - e.clientX;
      const width = gallery.getBoundingClientRect().width;
      const moveX = (mouseX / width) * 50;
      gsap.to(leftContentRef.current, {
        x: moveX,
        ease: "power2.out",
      });
      gsap.to(rightContentRef.current, {
        x: moveX,
        ease: "power2.out",
      });
    };

    window.addEventListener("mousemove", mouseMoveHandler);

    window.addEventListener("resize", resizeHandler);

    return () => {
      draggable.kill();
      verticalDrag.kill();
      window.removeEventListener("mousemove", mouseMoveHandler);
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);

  useEffect(() => {
    gsap.fromTo(
      [leftContentRef.current],
      { filter: "blur(10px)", opacity: 0 },
      { filter: "blur(0px)", opacity: 1, duration: 1, ease: "power2.out" }
    );
    gsap.fromTo(
      [rightContentRef.current],
      { filter: "blur(10px)", opacity: 0 },
      {
        filter: "blur(0px)",
        opacity: 1,
        duration: 1,
        delay: 2,
        ease: "power2.out",
      }
    );

    gsap.fromTo(
      [draggerRef.current],
      { left: "100%" },
      { left: "50%", duration: 1.5, delay: 1, ease: "power2.out" }
    );

    gsap.fromTo(
      [clippedImageRef.current],
      { clipPath: "inset(0px 0% 0px 0px)" },
      {
        clipPath: "inset(0px 50% 0px 0px)",
        duration: 1.5,
        delay: 1,
        ease: "power2.out",
      }
    );
  }, [activeIndex]);

  return (
    <div
      ref={galleryRef}
      className="relative w-full h-screen overflow-hidden bg-gray-800 transition-all duration-500 ease-in-out"
    >
      <div
        ref={unClippedImageRef}
        className="absolute w-full h-full right-image flex justify-center items-end pb-[80px]"
        style={{
          backgroundImage: `url(${data[activeIndex].rightImage})`,
        }}
      >
        <div className="" ref={rightContentRef}>
          <h1 className="text-[120px] leading-[120px] uppercase text-white font-[400] pb-[25px] playfair-display tracking-[25px]">
            {data[activeIndex].title}
          </h1>
          <p className="text-[13px] font-[400] uppercase text-white pb-[50px] playfair-display tracking-[5px]">
            {data[activeIndex].text}
          </p>
          <button
            onClick={() => {
              console.log("right");
            }}
            className="bg-white uppercase tracking-[4px] font-[600] playfair-display text-black text-[13px] px-[40px] py-[15px]"
          >
            Make a Choice
          </button>
        </div>
      </div>
      <div
        ref={clippedImageRef}
        className="absolute w-full h-full filter saturate-0 contrast-150 left-image flex justify-center items-end pb-[80px]"
        style={{
          clipPath: "inset(0px 50% 0px 0px)",
          backgroundImage: `url(${data[activeIndex].leftImage})`,
        }}
      >
        <div className="" ref={leftContentRef}>
          <h1 className="text-[120px] leading-[120px] uppercase text-black font-[400] pb-[25px] playfair-display tracking-[25px]">
            {data[activeIndex].title}
          </h1>
          <p className="text-[13px] font-[400] uppercase text-black pb-[50px] playfair-display tracking-[5px]">
            {data[activeIndex].text}
          </p>
          <button
            onClick={() => {
              console.log("left");
            }}
            className="bg-black uppercase tracking-[4px] font-[600] playfair-display text-white text-[13px] px-[40px] py-[15px]"
          >
            Make a Choice
          </button>
        </div>
      </div>

      <div
        ref={draggerRef}
        className="absolute h-full w-0 flex justify-center items-center bg-red-500 opacity-75 cursor-pointer"
        style={{ left: `${ratio.current * 100}%` }}
      >
        <div className="absolute top-[50%] flex cursor-move" ref={arrowRef}>
          <div className="w-[20px] h-[20px]">
            <svg
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                <path
                  d="M4.205 8.72805L12.205 3.72805C13.2041 3.10363 14.5 3.82189 14.5 5.00004V15C14.5 16.1782 13.2041 16.8965 12.205 16.272L4.205 11.272C3.265 10.6845 3.265 9.31555 4.205 8.72805Z"
                  fill="#000000"
                ></path>
              </g>
            </svg>
          </div>
          <div className="w-[20px] h-[20px] ">
            <svg
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                <path
                  d="M15.795 11.272L7.795 16.272C6.79593 16.8964 5.5 16.1782 5.5 15L5.5 5.00002C5.5 3.82186 6.79593 3.1036 7.795 3.72802L15.795 8.72802C16.735 9.31552 16.735 10.6845 15.795 11.272Z"
                  fill="#000000"
                ></path>
              </g>
            </svg>
          </div>
        </div>
      </div>
      <div className="absolute flex bottom-0 left-[50%] -translate-x-[50%]">
        <div
          className="py-[10px] px-[10px] cursor-pointer bg-[#18171f7a]"
          onClick={() => setActiveIndex((pre) => (pre - 1 >= 0 ? pre - 1 : 0))}
        >
          <svg
            className="w-[20px] h-[20px]"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              <path
                d="M14.9991 19L9.83911 14C9.56672 13.7429 9.34974 13.433 9.20142 13.0891C9.0531 12.7452 8.97656 12.3745 8.97656 12C8.97656 11.6255 9.0531 11.2548 9.20142 10.9109C9.34974 10.567 9.56672 10.2571 9.83911 10L14.9991 5"
                stroke="#fff"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
            </g>
          </svg>
        </div>
        <div
          className="py-[10px] px-[10px] cursor-pointer bg-[#18171f7a]"
          onClick={() =>
            setActiveIndex((pre) =>
              pre + 1 < data.length ? pre + 1 : data.length - 1
            )
          }
        >
          <svg
            className="w-[20px] h-[20px]"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              <path
                d="M9 5L14.15 10C14.4237 10.2563 14.6419 10.5659 14.791 10.9099C14.9402 11.2539 15.0171 11.625 15.0171 12C15.0171 12.375 14.9402 12.7458 14.791 13.0898C14.6419 13.4339 14.4237 13.7437 14.15 14L9 19"
                stroke="#fff"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default ImageComparison;
