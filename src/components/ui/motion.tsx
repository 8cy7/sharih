"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import React from "react";

const EASE = [0.16, 1, 0.3, 1] as const;
const DURATION = 0.6;

export const FadeIn = React.forwardRef<HTMLDivElement, HTMLMotionProps<"div"> & { delay?: number }>(
  ({ children, delay = 0, ...props }, ref) => {
    const [isMounted, setIsMounted] = React.useState(false);

    React.useEffect(() => {
      setIsMounted(true);
    }, []);

    return (
      <motion.div
        ref={ref}
        initial={isMounted ? { opacity: 0, y: 15 } : { opacity: 1, y: 0 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: DURATION, ease: EASE, delay }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);
FadeIn.displayName = "FadeIn";

export const StaggerContainer = React.forwardRef<HTMLDivElement, HTMLMotionProps<"div"> & { staggerDelay?: number }>(
  ({ children, staggerDelay = 0.08, ...props }, ref) => {
    const [isMounted, setIsMounted] = React.useState(false);
    React.useEffect(() => setIsMounted(true), []);

    return (
      <motion.div
        ref={ref}
        initial={isMounted ? "hidden" : "visible"}
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={{
          visible: {
            transition: {
              staggerChildren: staggerDelay,
            },
          },
          hidden: {},
        }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);
StaggerContainer.displayName = "StaggerContainer";

export const StaggerItem = React.forwardRef<HTMLDivElement, HTMLMotionProps<"div">>(
  ({ children, ...props }, ref) => {
    const [isMounted, setIsMounted] = React.useState(false);
    React.useEffect(() => setIsMounted(true), []);

    return (
      <motion.div
        ref={ref}
        variants={{
          hidden: { opacity: 0, y: 15 },
          visible: { opacity: 1, y: 0, transition: { duration: DURATION, ease: EASE } },
        }}
        initial={isMounted ? "hidden" : "visible"}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);
StaggerItem.displayName = "StaggerItem";

export const PageTransition = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15, scale: 0.98, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -15, scale: 0.98, filter: "blur(4px)" }}
      transition={{ duration: DURATION + 0.1, ease: EASE }}
    >
      {children}
    </motion.div>
  );
};
