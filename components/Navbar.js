'use client'; // Ensure this is a client-side component

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedButton from '../components/AnimatedButton'; // Import AnimatedButton
import PaymentIcon from '../components/PaymentIcon'; // Import your custom icon
import Logo from '../components/Logo';  

const Navbar = () => {
  const [isHovered, setIsHovered] = useState(false); // For desktop hover
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // For mobile menu toggle
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // For mobile dropdown toggle
  const mobileMenuRef = useRef(null); // To detect outside clicks
  const hamburgerRef = useRef(null); // Reference for the hamburger button

  // Desktop hover events for programs dropdown
  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  // Mobile menu toggle
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prevState) => {
      if (!prevState) setIsDropdownOpen(false); // Close the dropdown when closing the menu
      return !prevState;
    });
  };

  // Mobile dropdown toggle
  const toggleDropdown = () => setIsDropdownOpen((prevState) => !prevState);

  // Close the mobile menu if clicked outside
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        !hamburgerRef.current.contains(event.target)
      ) {
        setIsMobileMenuOpen(false); // Close the mobile menu
        setIsDropdownOpen(false); // Close the dropdown
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    } else {
      document.removeEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isMobileMenuOpen]);

  return (
    <div className="w-full fixed top-0 left-0 z-[1000] bg-transparent flex items-center justify-center">
      <div className="w-[95%] h-12 px-6 flex items-center justify-between bg-sec-clr rounded-[0.5rem] mt-4">
        
        {/* Logo Section */}
        <Link href="/" className="z-[100000000000] w-[11%]">
          <Logo className="h-8 w-auto" /> {/* Use your custom logo SVG */}
        </Link>

        {/* Custom Animated Hamburger Menu for Mobile */}
        <div ref={hamburgerRef} className="md:hidden" onClick={toggleMobileMenu}>
          <motion.div
            className="flex flex-col justify-center space-y-1 cursor-pointer z-[10000000] relative"
            initial={false}
            animate={{ rotate: isMobileMenuOpen ? 0 : 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Top Line */}
            <motion.span
              className="block h-0.5 w-6 bg-pri-clr"
              animate={{ rotate: isMobileMenuOpen ? -45 : 0, y: isMobileMenuOpen ? 3 : 0 }}
              transition={{ duration: 0.3 }}
            />
            {/* Bottom Line */}
            <motion.span
              className="block h-0.5 w-6 bg-pri-clr"
              style={{ transformOrigin: 'right' }}
              animate={{ rotate: isMobileMenuOpen ? 45 : 0, y: isMobileMenuOpen ? 5.5 : 0, x: isMobileMenuOpen ? -3.2 : 0 }}
              transition={{ duration: 0.8 }}
            />
          </motion.div>
        </div>

        {/* Desktop Links Section */}
        <div className="hidden md:flex space-x-3 items-center justify-center text-pri-clr font">
          <Link href="/">HOME</Link>
          <Link href="/About">ABOUT</Link>

          {/* Programs Dropdown for Desktop */}
          <div className="relative flex items-center" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <motion.button className="py-4 flex items-center space-x-1 focus:outline-none bg-transparent">
              <span>PROGRAMS</span>
              {/* Animate + icon rotation with Framer Motion */}
              <motion.span className="ml-1" animate={{ rotate: isHovered ? 45 : 0 }} transition={{ duration: 0.3 }}>
                +
              </motion.span>
            </motion.button>

            {/* Dropdown Menu with Framer Motion for opacity and scale */}
            <motion.div
              className="absolute top-full left-0 bg-[#dadada] shadow-lg rounded-md py-2 w-auto uppercase"
              initial={{ opacity: 0, scale: 1 }}
              animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.95 }}
              transition={{ duration: 0.2 }}
              style={{ pointerEvents: isHovered ? 'auto' : 'none' }}
            >
              <Link href="/programs/program1" className="block px-6 py-2 w-full whitespace-nowrap hover:text-[#3f3f3f] duration-300">
                Program 1
              </Link>
              <Link href="/programs/program2" className="block px-6 py-2 w-full whitespace-nowrap hover:text-[#3f3f3f] duration-300">
                Program 2
              </Link>
              <Link href="/programs/program3" className="block px-6 py-2 w-full whitespace-nowrap hover:text-[#3f3f3f] duration-300">
                Program 3
              </Link>
            </motion.div>
          </div>
          <Link href="/About">ABOUT</Link>
        </div>

        {/* Desktop Animated Button Section */}
        <div className="hidden md:block">
          <AnimatedButton text="INSTANT PAYMENT" href="/contact" Icon={PaymentIcon} />
        </div>
      </div>

      {/* Full-Screen Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div ref={mobileMenuRef} className="w-full fixed top-0 left-0 z-50 bg-transparent flex items-center justify-center">
            <motion.div
              className="z-50 mt-4 top-0 fixed rounded-[0.5rem] w-[95%] bg-[#dadada] text-[#101010] flex flex-col items-start  px-3 md:hidden"
              initial={{ height: '0%' }}
              animate={{ height: 'auto' }}
              exit={{ height: '0' }}
              transition={{ type: 'tween', duration: 0.8, ease: [0.77, 0, 0.18, 1] }}
            >
              {/* Mobile Links */}
              <motion.div
                className="flex flex-col gap-4 mt-16 h-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.5 } }}
                transition={{ delay: 0.3, duration: 1 }}
                style={{
                  maxHeight: isMobileMenuOpen ? '500px' : '0',
                  transition: 'max-height 0.5s ease-in-out',
                  overflow: 'hidden',
                }}
              >
                <Link href="/" className="text-5xl" onClick={toggleMobileMenu}>
                  HOME
                </Link>
                <Link href="/About" className="text-5xl" onClick={toggleMobileMenu}>
                  ABOUT
                </Link>

                {/* Programs Dropdown for Mobile */}
                <div className="w-full">
                  <div className="flex justify-between items-center text-5xl" onClick={toggleDropdown}>
                    <span>PROGRAMS</span>
                    <motion.span className="ml-1" animate={{ rotate: isDropdownOpen ? 45 : 0 }} transition={{ duration: 0.3 }}>
                      +
                    </motion.span>
                  </div>

                  {/* Programs Submenu for Mobile */}
                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        className="flex flex-col space-y-2 mt-2"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{ overflow: 'hidden' }}
                      >
                        <Link href="/programs/program1" className="text-4xl text-[#3d3d3d]" onClick={toggleMobileMenu}>
                          Program 1
                        </Link>
                        <Link href="/programs/program2" className="text-4xl text-[#3d3d3d]" onClick={toggleMobileMenu}>
                          Program 2
                        </Link>
                        <Link href="/programs/program3" className="text-4xl text-[#3d3d3d]" onClick={toggleMobileMenu}>
                          Program 3
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <Link href="/Contact" className="text-5xl" onClick={toggleMobileMenu}>
                  CONTACT
                </Link>

                {/* Mobile Button at the Bottom */}
                <div className="h-full flex items-end py-5">
                  <AnimatedButton 
                   className="text-4xl uppercase bg-black text-[#dadada] px-10 py-4 rounded-md" // Custom styles for the button
                   text="INSTANT PAYMENT"
                   href="/contact"
                   Icon={PaymentIcon}
                   iconClassName="w-8 h-8 text-white" // Custom size and color for the icon using Tailwind
                   />
                </div>
              </motion.div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;
