// componenets/AnimatedButton.js
'use client';
import { motion } from "framer-motion";

export default function AnimatedButton({
  text = "Schedule a Call",
  href = "#",
  Icon, // Custom SVG icon passed here as a prop
}) {
  return (
    <motion.a
      href={href}
      className="relative flex items-center justify-center py-[0.10rem] px-2 bg-[#010101] text-[#dadada] rounded-md  focus:outline-none focus:ring-2 focus:ring-offset-2  transition-all"
      initial="rest"
      whileHover="hover"
      animate="rest"
    >
      <span className="mr-1">{text}</span>

      {/* Icon animation */}
      <div className="relative w-6 h-6 overflow-hidden">
        {/* First icon (moves up and disappears) */}
        <motion.div
          className="absolute w-6 h-6 mt-[0.18rem]"
          variants={{
            rest: { y: 0, opacity: 1 },
            hover: { y: -40, opacity: 1 },
          }}
          transition={{ duration: 0.5 }}
        >
          {Icon && <Icon className="w-6 h-6" />}
        </motion.div>

        {/* Second icon (appears from below and moves up) */}
        <motion.div
          className="absolute w-6 h-6 mt-[0.18rem]"
          variants={{
            rest: { y: 40, opacity: 1 },
            hover: { y: 0, opacity: 1 },
          }}
          transition={{ duration: 0.5 }}
        >
          {Icon && <Icon className="w-6 h-6 " />}
        </motion.div>
      </div>
    </motion.a>
  );
}