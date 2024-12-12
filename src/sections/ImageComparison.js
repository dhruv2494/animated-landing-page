import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import React, { useEffect, useRef } from "react";

gsap.registerPlugin(Draggable);

const ImageComparison = () => {
  const galleryRef = useRef(null);
  const clippedImageRef = useRef(null);
  const draggerRef = useRef(null);
  const ratio = useRef(0.5);
  const leftContentRef = useRef(null);
  const rightContentRef = useRef(null);

  useEffect(() => {
    const gallery = galleryRef.current;
    const clipped = clippedImageRef.current;
    const initialX = ratio.current * gallery.getBoundingClientRect().width;

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

    const draggable = Draggable.create(draggerRef.current, {
      type: "x",
      bounds: gallery,
      onDrag: updateDrag,
      onThrowUpdate: updateDrag,
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

    return () => {
      draggable.kill();
      window.removeEventListener("mousemove", mouseMoveHandler);
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);

  return (
    <div
      ref={galleryRef}
      className="relative w-full h-screen overflow-hidden bg-gray-800"
    >
      <div className="absolute w-full h-full right-image flex justify-center items-end pb-[80px]">
        <div className="" ref={rightContentRef}>
          <h1 className="text-[120px] leading-[120px] uppercase text-white font-[400] pb-[25px] playfair-display tracking-[25px]">
            Modern
          </h1>
          <p className="text-[13px] font-[400] uppercase text-white pb-[50px] playfair-display tracking-[5px]">
            A design isn't finished until someone is using it.
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
        style={{ clipPath: "inset(0px 50% 0px 0px)" }}
      >
        <div className="" ref={leftContentRef}>
          <h1 className="text-[120px] leading-[120px] uppercase text-black font-[400] pb-[25px] playfair-display tracking-[25px]">
            Modern
          </h1>
          <p className="text-[13px] font-[400] uppercase text-black pb-[50px] playfair-display tracking-[5px]">
            A [600] isn't finished until someone is using it.
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
        className="absolute h-full w-0 bg-red-500 opacity-75 cursor-pointer"
        style={{ left: `${ratio.current * 100}%` }}
      >
        <div className="relative h-full cursor-move">
          <div className="absolute w-[20px] top-[50%] right-0 h-[20px] ">
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
          <div className="absolute top-[50%] left-0 w-[20px] h-[20px] ">
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
    </div>
  );
};

export default ImageComparison;
