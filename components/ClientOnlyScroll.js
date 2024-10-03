// componenets/ClientOnlyScroll.js
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import LocomotiveScroll from 'locomotive-scroll';

gsap.registerPlugin(ScrollTrigger);

export default function ClientOnlyScroll({ children }) {
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const scrollEl = scrollContainerRef.current;

    // Initialize Locomotive Scroll
    const locoScroll = new LocomotiveScroll({
      el: scrollEl,
      smooth: true,
      tablet: { smooth: true },
      smartphone: { smooth: true },
    });

    locoScroll.on('scroll', ScrollTrigger.update);

    // Set up GSAP ScrollTrigger scrollerProxy
    ScrollTrigger.scrollerProxy(scrollEl, {
      scrollTop(value) {
        return arguments.length
          ? locoScroll.scrollTo(value, 0, 0)
          : locoScroll.scroll.instance.scroll.y;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
      pinType: scrollEl.style.transform ? "transform" : "fixed"  // Fallback for scroll mechanics
    });

    // Refresh ScrollTrigger and Locomotive Scroll on page load
    ScrollTrigger.addEventListener('refresh', () => locoScroll.update());
    ScrollTrigger.refresh();

    return () => {
      // Clean up Locomotive Scroll and ScrollTrigger
      locoScroll.destroy();
      ScrollTrigger.removeEventListener('refresh', locoScroll.update);
    };
  }, []);

  return <div ref={scrollContainerRef} className="smooth-scroll">{children}</div>;
}
