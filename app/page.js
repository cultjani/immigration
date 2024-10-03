'use client';
import { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import Section from '../components/Section'; 
import Navbar from '../components/Navbar'; 
import MapIcon from '../components/MapIcon'; 
import { motion } from 'framer-motion';
import LocomotiveScroll from 'locomotive-scroll'; // Make sure to install this

// Dynamically import the components with SSR disabled
const GlobeWithRoutes = dynamic(() => import('../components/Globe'), { ssr: false });
const ClientOnlyScroll = dynamic(() => import('../components/ClientOnlyScroll'), { ssr: false });

// Helper function to split the text into words and animate them with 3D rotation
const AnimatedText = ({ text }) => {
  const words = text.split(' ');

  return (
    <motion.div 
      className='inline-block' 
      style={{ perspective: 1000 }}  // Adding perspective for 3D effect
      initial="hidden" 
      animate="visible" 
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
      }}
    >
      {words.map((word, index) => (
        <motion.span 
          key={index} 
          className='inline-block mr-2'
          variants={{
            hidden: { opacity: 0, y: 100, scale: 0.9, rotateX: -90 },
            visible: { opacity: 1, y: 0, scale: 1, rotateX: 0 }
          }}
          transition={{ duration: 2, ease: "easeInOut" }}
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
};

export default function Home() {
  const [gsapInstance, setGsapInstance] = useState(null); // Track GSAP instance readiness
  const scrollContainerRef = useRef(null); // Ref for Locomotive Scroll container

  useEffect(() => {
    // Dynamically import GSAP and ScrollTrigger only on the client side
    const loadGsap = async () => {
      try {
        const { gsap } = await import('gsap');  // Import GSAP
        const { ScrollTrigger } = await import('gsap/ScrollTrigger');  // Import ScrollTrigger

        // Register ScrollTrigger plugin
        gsap.registerPlugin(ScrollTrigger);

        // Set GSAP instance
        setGsapInstance(gsap);

        // Initialize Locomotive Scroll
        const locoScroll = new LocomotiveScroll({
          el: scrollContainerRef.current,
          smooth: true,
          smartphone: { smooth: false },  // Disable smooth scroll on mobile
          tablet: { smooth: false }       // Disable smooth scroll on tablet
        });

        // Set up GSAP's scrollerProxy for Locomotive Scroll
        ScrollTrigger.scrollerProxy(scrollContainerRef.current, {
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
              height: window.innerHeight
            };
          },
          pinType: scrollContainerRef.current.style.transform ? "transform" : "fixed"
        });

        // Refresh ScrollTrigger and Locomotive Scroll after loading
        locoScroll.on('scroll', ScrollTrigger.update);
        ScrollTrigger.addEventListener('refresh', () => locoScroll.update());
        ScrollTrigger.refresh();

      } catch (error) {
        console.error("Error loading GSAP or ScrollTrigger:", error);
      }
    };

    loadGsap(); // Call the function to load GSAP and ScrollTrigger
  }, []);

  useEffect(() => {
    if (gsapInstance) {
      // Create a timeline for briefcase-h1 animation and pinning
      const tl = gsapInstance.timeline({
        scrollTrigger: {
          trigger: ".home-briefcase",
          start: "top top",  // Pin starts when the section enters the viewport
          end: "300% bottom", // End trigger at the bottom of the section
          scroller: scrollContainerRef.current, // LocomotiveScroll container
          scrub: true,
          pin: true,  // Pin the home-briefcase section
          invalidateOnRefresh: true, // Invalidate positions on refresh to avoid flickering
          markers: false  // Enable markers for debugging
        }
      });

      // Add animation to the timeline
      tl.fromTo(
        ".briefcase-h1 .char",
        { opacity: 0.5, y: 100 }, // Start with opacity and y offset
        { opacity: 1, y: 0, stagger: 0.05 }
      );
    }
  }, [gsapInstance]);  // Run this effect only after gsapInstance is loaded

  const splitTextIntoChars = (text) => {
    return text.split('').map((char, index) => (
      <span key={index} className="char">{char}</span>
    ));
  };

  return (
    <>
      {/* Navbar with fixed position */}
      <Navbar />

      {/* Content inside Locomotive Scroll */}
      <div ref={scrollContainerRef} className="smooth-scroll">
        {/* 3D Globe Component */}
        <div 
          className='w-full h-screen bg-black'
          data-scroll 
          data-scroll-speed="-5"
        >
          <div className='w-full absolute top-[30%] md:top-[20%] bg-transparent flex items-center justify-center text-center'>
            {/* Animated Text with Framer Motion */}
            <h1 className='text-sec-clr font-pp-neue text-3xl md:text-6xl lg:text-5xl xl:text-7xl' id='3d-heading'>
              <AnimatedText text="Your Gateway to Global Opportunities" />
            </h1>
          </div>

          <GlobeWithRoutes />
        </div>

        {/* Short Briefcase Section */}
        <Section customClass="home-briefcase">
  <div className="bg-sec-clr w-screen h-screen p-8 flex items-start justify-center flex-col relative">
    <span className='uppercase font-pp-neue'>- Short Briefcase</span>
    <h1 className="briefcase-h1 text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl leading-tight">
      {splitTextIntoChars("We provide personalized visa solutions for study, work, and travel to help you achieve your international dreams.")}
    </h1>
    <div className='w-full h-40 bg-transparent flex items-center justify-end absolute bottom-0 right-0 p-5'>
    <MapIcon/>
    </div>
  </div>
</Section>

      </div>
    </>
  );
}
