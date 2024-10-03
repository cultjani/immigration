'use client';
import { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import Section from '../components/Section'; 
import Navbar from '../components/Navbar'; 
import MapIcon from '../components/MapIcon'; 
import { motion } from 'framer-motion';
import LocomotiveScroll from 'locomotive-scroll'; // Make sure to install this

// Dynamically import components with SSR disabled
const GlobeWithRoutes = dynamic(() => import('../components/Globe'), { ssr: false });
const ClientOnlyScroll = dynamic(() => import('../components/ClientOnlyScroll'), { ssr: false });

const AnimatedText = ({ text }) => {
  const words = text.split(' ');

  return (
    <motion.div className='inline-block' style={{ perspective: 1000 }} initial="hidden" animate="visible" variants={{
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
    }}>
      {words.map((word, index) => (
        <motion.span key={index} className='inline-block mr-2' variants={{
          hidden: { opacity: 0, y: 100, scale: 0.9, rotateX: -90 },
          visible: { opacity: 1, y: 0, scale: 1, rotateX: 0 }
        }} transition={{ duration: 2, ease: "easeInOut" }}>
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
};

export default function Home() {
  const [gsapInstance, setGsapInstance] = useState(null); 
  const scrollContainerRef = useRef(null); 

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const loadGsap = async () => {
        try {
          const { gsap } = await import('gsap'); 
          const { ScrollTrigger } = await import('gsap/ScrollTrigger'); 

          gsap.registerPlugin(ScrollTrigger);
          setGsapInstance(gsap);

          const locoScroll = new LocomotiveScroll({
            el: scrollContainerRef.current,
            smooth: true,
            smartphone: { smooth: false },
            tablet: { smooth: false }
          });

          ScrollTrigger.scrollerProxy(scrollContainerRef.current, {
            scrollTop(value) {
              return arguments.length ? locoScroll.scrollTo(value, 0, 0) : locoScroll.scroll.instance.scroll.y;
            },
            getBoundingClientRect() {
              return {
                top: 0,
                left: 0,
                width: window.innerWidth,
                height: window.innerHeight
              };
            },
            pinType: scrollContainerRef.current.style.transform ? "transform" : "fixed"
          });

          locoScroll.on('scroll', ScrollTrigger.update);
          ScrollTrigger.addEventListener('refresh', () => locoScroll.update());
          ScrollTrigger.refresh();

        } catch (error) {
          console.error("Error loading GSAP or ScrollTrigger:", error);
        }
      };

      loadGsap(); 
    }
  }, []);

  useEffect(() => {
    if (gsapInstance) {
      const tl = gsapInstance.timeline({
        scrollTrigger: {
          trigger: ".home-briefcase",
          start: "top top",
          end: "300% bottom",
          scroller: scrollContainerRef.current,
          scrub: true,
          pin: true,
          invalidateOnRefresh: true,
          markers: false
        }
      });

      tl.fromTo(
        ".briefcase-h1 .char",
        { opacity: 0.5, y: 100 }, 
        { opacity: 1, y: 0, stagger: 0.05 }
      );
    }
  }, [gsapInstance]);  

  const splitTextIntoChars = (text) => {
    return text.split('').map((char, index) => (
      <span key={index} className="char">{char}</span>
    ));
  };

  return (
    <>
      <Navbar />
      <div ref={scrollContainerRef} className="smooth-scroll">
        <div className='w-full h-screen bg-black' data-scroll data-scroll-speed="-5">
          <div className='w-full absolute top-[30%] md:top-[20%] bg-transparent flex items-center justify-center text-center'>
            <h1 className='text-sec-clr font-pp-neue text-3xl md:text-6xl lg:text-5xl xl:text-7xl' id='3d-heading'>
              <AnimatedText text="Your Gateway to Global Opportunities" />
            </h1>
          </div>

          <GlobeWithRoutes />
        </div>

        <Section customClass="home-briefcase">
          <div className="bg-sec-clr w-screen h-screen p-8 flex items-start justify-center flex-col relative">
            <span className='uppercase font-pp-neue'>- Short Briefcase</span>
            <h1 className="briefcase-h1 text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl leading-tight">
              {splitTextIntoChars("We provide personalized visa solutions for study, work, and travel to help you achieve your international dreams.")}
            </h1>
            <div className='w-full h-40 bg-transparent flex items-center justify-end absolute bottom-0 right-0 p-5'>
              <MapIcon />
            </div>
          </div>
        </Section>
      </div>
    </>
  );
}
