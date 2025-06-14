'use client';
import { type JSX } from 'react';
import { motion, Transition } from 'framer-motion';
import { cn } from '@/lib/utils';

type TextShimmerWave = {
    children: string;
    as?: React.ElementType;
    className?: string;
    duration?: number;
    xDistance?: number;
    yDistance?: number;
    spread?: number;
    scaleDistance?: number;
    rotateYDistance?: number;
    transition?: Transition;
};

export function TextShimmerWave({
    children,
    as: Component = 'p',
    className,
    duration = 1,
    xDistance = 2,
    yDistance = -2,
    spread = 1,
    scaleDistance = 1.1,
    rotateYDistance = 10,
    transition,
}: TextShimmerWave) {
    const MotionComponent = motion.create(
        Component as keyof JSX.IntrinsicElements
    );

    return (
        <MotionComponent
            className={cn(
                'relative inline-block [perspective:500px]',
                '[--base-color:#a1a1aa] [--base-gradient-color:#000]',
                'dark:[--base-color:#71717a] dark:[--base-gradient-color:#ffffff]',
                className
            )}
            style={{ color: 'var(--base-color)' }}
        >
            {children.split('').map((char, i) => {
                const delay = (i * duration * (1 / spread)) / children.length;

                return (
                    <motion.span
                        key={i}
                        className={cn(
                            'inline-block whitespace-pre [transform-style:preserve-3d]'
                        )}
                        initial={{
                            scale: 1,
                            rotateY: 0,
                            color: 'var(--base-color)',
                            x: 0,
                            y: 0,
                        }}
                        animate={{
                            x: [0, xDistance, 0],
                            y: [0, yDistance, 0],
                            scale: [1, scaleDistance, 1],
                            rotateY: [0, rotateYDistance, 0],
                            color: [
                                'var(--base-color)',
                                'var(--base-gradient-color)',
                                'var(--base-color)',
                            ],
                        }}
                        transition={{
                            duration: duration,
                            repeat: Infinity,
                            repeatDelay: (children.length * 0.05) / spread,
                            delay,
                            ease: 'easeInOut',
                            ...transition,
                        }}
                    >
                        {char}
                    </motion.span>
                );
            })}
        </MotionComponent>
    );
}
