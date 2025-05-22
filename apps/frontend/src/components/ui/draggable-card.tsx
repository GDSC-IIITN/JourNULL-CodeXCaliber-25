"use client";
import { cn } from "@/lib/utils";
import React, { useRef, useState, useEffect } from "react";
import {
    motion,
    useMotionValue,
    useSpring,
    useTransform,
    animate,
    useVelocity,
    useAnimationControls,
} from "motion/react";

export const DraggableCardBody = ({
    className,
    children,
    id,
}: {
    className?: string;
    children?: React.ReactNode;
    id: string;
}) => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const cardRef = useRef<HTMLDivElement>(null);
    const controls = useAnimationControls();
    const [constraints, setConstraints] = useState({
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    });

    // physics biatch
    const velocityX = useVelocity(mouseX);
    const velocityY = useVelocity(mouseY);

    const springConfig = {
        stiffness: 100,
        damping: 20,
        mass: 0.5,
    };

    const rotateX = useSpring(
        useTransform(mouseY, [-300, 300], [25, -25]),
        springConfig,
    );
    const rotateY = useSpring(
        useTransform(mouseX, [-300, 300], [-25, 25]),
        springConfig,
    );

    const opacity = useSpring(
        useTransform(mouseX, [-300, 0, 300], [0.8, 1, 0.8]),
        springConfig,
    );

    const glareOpacity = useSpring(
        useTransform(mouseX, [-300, 0, 300], [0.2, 0, 0.2]),
        springConfig,
    );

    // Get initial position from localStorage
    const getInitialPosition = () => {
        if (typeof window === 'undefined') return { x: 0, y: 0 };
        const savedPosition = localStorage.getItem(`card-position-${id}`);
        if (savedPosition) {
            try {
                return JSON.parse(savedPosition);
            } catch (e) {
                return { x: 0, y: 0 };
            }
        }
        return { x: 0, y: 0 };
    };

    const initialPosition = getInitialPosition();

    useEffect(() => {
        // Update constraints when component mounts or window resizes
        const updateConstraints = () => {
            if (typeof window !== "undefined") {
                const container = cardRef.current?.closest('.draggable-container');
                if (container) {
                    const containerRect = container.getBoundingClientRect();
                    const extraSpace = {
                        x: containerRect.width * 0.2,
                        y: containerRect.height * 0.2
                    };
                    setConstraints({
                        top: -containerRect.height / 2 - extraSpace.y,
                        left: -containerRect.width / 2 - extraSpace.x,
                        right: containerRect.width / 2 + extraSpace.x,
                        bottom: containerRect.height / 2 + extraSpace.y,
                    });
                }
            }
        };

        updateConstraints();
        window.addEventListener("resize", updateConstraints);
        return () => window.removeEventListener("resize", updateConstraints);
    }, []);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const { clientX, clientY } = e;
        const { width, height, left, top } =
            cardRef.current?.getBoundingClientRect() ?? {
                width: 0,
                height: 0,
                left: 0,
                top: 0,
            };
        const centerX = left + width / 2;
        const centerY = top + height / 2;
        const deltaX = clientX - centerX;
        const deltaY = clientY - centerY;
        mouseX.set(deltaX);
        mouseY.set(deltaY);
    };

    const handleMouseLeave = () => {
        mouseX.set(0);
        mouseY.set(0);
    };

    return (
        <motion.div
            ref={cardRef}
            drag
            dragConstraints={constraints}
            initial={initialPosition}
            onDragStart={() => {
                document.body.style.cursor = "grabbing";
            }}
            onDragEnd={(event, info) => {
                document.body.style.cursor = "default";

                // Store the relative position in localStorage
                if (cardRef.current) {
                    const container = cardRef.current.closest('.draggable-container');
                    if (container) {
                        const cardRect = cardRef.current.getBoundingClientRect();
                        const containerRect = container.getBoundingClientRect();

                        // Calculate position relative to container center, matching the constraint system
                        const relativeX = (cardRect.left + cardRect.width / 2) - (containerRect.left + containerRect.width / 2);
                        const relativeY = (cardRect.top + cardRect.height / 2) - (containerRect.top + containerRect.height / 2);

                        const position = {
                            x: relativeX,
                            y: relativeY,
                        };
                        localStorage.setItem(
                            `card-position-${id}`,
                            JSON.stringify(position)
                        );
                    }
                }

                controls.start({
                    rotateX: 0,
                    rotateY: 0,
                    transition: {
                        type: "spring",
                        ...springConfig,
                    },
                });

                const currentVelocityX = velocityX.get();
                const currentVelocityY = velocityY.get();

                const velocityMagnitude = Math.sqrt(
                    currentVelocityX * currentVelocityX +
                    currentVelocityY * currentVelocityY,
                );
                const bounce = Math.min(0.8, velocityMagnitude / 1000);

                animate(info.point.x, info.point.x + currentVelocityX * 0.3, {
                    duration: 0.8,
                    ease: [0.2, 0, 0, 1],
                    bounce,
                    type: "spring",
                    stiffness: 50,
                    damping: 15,
                    mass: 0.8,
                });

                animate(info.point.y, info.point.y + currentVelocityY * 0.3, {
                    duration: 0.8,
                    ease: [0.2, 0, 0, 1],
                    bounce,
                    type: "spring",
                    stiffness: 50,
                    damping: 15,
                    mass: 0.8,
                });
            }}
            style={{
                rotateX,
                rotateY,
                opacity,
                willChange: "transform",
            }}
            animate={controls}
            whileHover={{ scale: 1.02 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={cn(
                "relative min-h-96 w-80 overflow-hidden rounded-md bg-neutral-100 p-6 shadow-2xl transform-3d dark:bg-neutral-900",
                className,
            )}
        >
            {children}
            <motion.div
                style={{
                    opacity: glareOpacity,
                }}
                className="pointer-events-none absolute inset-0 bg-white select-none"
            />
        </motion.div>
    );
};

export const DraggableCardContainer = ({
    className,
    children,
}: {
    className?: string;
    children?: React.ReactNode;
}) => {
    return (
        <div className={cn("[perspective:3000px] draggable-container", className)}>{children}</div>
    );
};
