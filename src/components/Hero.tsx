import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Github, Linkedin, ArrowRight, MapPin, Download, Sparkles } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import profilePic from '../assets/formal-pic-2.jpg';

import TextPressure from './TextPressure';

// Reusable 3D Tilt Card Component
const TiltCard = ({ children, className }: { children: React.ReactNode, className?: string }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x, { stiffness: 300, damping: 20 });
    const mouseYSpring = useSpring(y, { stiffness: 300, damping: 20 });

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={`luxury-card relative flex-col flex overflow-hidden ${className}`}
        >
            <div style={{ transform: "translateZ(30px)" }} className="h-full w-full flex flex-col">
                {children}
            </div>
        </motion.div>
    );
};

const Hero = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section id="hero" className="relative min-h-screen pt-32 pb-20 flex items-center justify-center overflow-hidden mesh-bg">
            <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px]" />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                
                {/* BENTO GRID */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[auto]">
                    
                    {/* 1. Main Intro Card (Spans 8 cols) */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="md:col-span-8 luxury-card p-10 md:p-14 flex flex-col justify-between min-h-[400px]"
                    >
                        <div>
                            <span className="luxury-pill px-5 py-2 text-xs font-semibold tracking-wide text-secondary mb-8 inline-block">
                                AVAILABLE FOR WORK
                            </span>
                            <div className="flex items-center gap-2 mb-6 w-full" style={{ height: '80px', maxWidth: '600px' }}>
                                <div className="flex-1 h-full">
                                    <TextPressure 
                                        text="Aditya" 
                                        textColor="#18181b" 
                                        flex={true} 
                                        alpha={false} 
                                        stroke={false} 
                                        width={true} 
                                        weight={true} 
                                        italic={true} 
                                    />
                                </div>
                                <div className="flex-1 h-full">
                                    <TextPressure 
                                        text="Manas" 
                                        textColor="#a1a1aa" 
                                        flex={true} 
                                        alpha={false} 
                                        stroke={false} 
                                        width={true} 
                                        weight={true} 
                                        italic={true} 
                                    />
                                </div>
                            </div>
                            <h2 className="text-xl sm:text-2xl font-medium tracking-tight text-secondary max-w-xl">
                                Full-Stack Developer crafting elegant, high-performance web experiences.
                            </h2>
                        </div>
                        
                        <div className="mt-12 flex flex-wrap items-center gap-4">
                            <a 
                                href="#projects"
                                className="group flex items-center justify-center gap-2 bg-primary text-white px-6 py-3.5 rounded-full font-semibold text-sm hover:bg-zinc-800 transition-colors shadow-lg shadow-black/10"
                            >
                                View Projects
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </a>
                            <div className="flex gap-2">
                                <a href="https://github.com/aditya-manas02" target="_blank" rel="noreferrer" className="w-12 h-12 bg-zinc-50 border border-zinc-200 text-primary rounded-full flex items-center justify-center hover:bg-zinc-100 transition-colors shadow-sm">
                                    <Github className="w-5 h-5" />
                                </a>
                                <a href="https://www.linkedin.com/in/adityamanas08/" target="_blank" rel="noreferrer" className="w-12 h-12 bg-zinc-50 border border-zinc-200 text-primary rounded-full flex items-center justify-center hover:bg-zinc-100 transition-colors shadow-sm">
                                    <Linkedin className="w-5 h-5" />
                                </a>
                            </div>
                        </div>
                    </motion.div>

                    {/* 2. 3D Profile Picture (Spans 4 cols) */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="md:col-span-4 min-h-[400px] perspective-[1000px]"
                    >
                        <TiltCard className="w-full h-full p-2">
                            <div className="w-full h-full rounded-2xl overflow-hidden relative group">
                                <img 
                                    src={profilePic} 
                                    alt="Aditya Manas" 
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.1)] pointer-events-none" />
                            </div>
                        </TiltCard>
                    </motion.div>

                    {/* 3. Location & Time Card */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="md:col-span-4 luxury-card p-8 flex flex-col items-center justify-center text-center group"
                    >
                        <div className="w-12 h-12 bg-blue-50 text-accent rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <MapPin className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-lg text-primary">Patna, India</h3>
                        <p className="text-secondary font-mono text-sm mt-1">
                            {time.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour12: true })} IST
                        </p>
                    </motion.div>

                    {/* 4. Currently Learning */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="md:col-span-4 luxury-card p-8 flex flex-col items-center justify-center text-center group"
                    >
                        <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Sparkles className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-lg text-primary">Exploring AI & LLMs</h3>
                        <p className="text-secondary text-sm mt-1">Prompt Engineering & GenAI Apps</p>
                    </motion.div>

                    {/* 5. Download Resume */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="md:col-span-4 perspective-[1000px]"
                    >
                        <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                            <TiltCard className="w-full h-full p-8 flex items-center justify-center group bg-primary !border-none !text-white cursor-pointer hover:bg-zinc-800 transition-colors">
                                <div className="flex flex-col items-center gap-3">
                                    <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center group-hover:-translate-y-2 transition-transform duration-300">
                                        <Download className="w-6 h-6 text-white" />
                                    </div>
                                    <span className="font-bold text-lg tracking-tight">Download Resume</span>
                                </div>
                            </TiltCard>
                        </a>
                    </motion.div>

                </div>
            </div>
        </section>
    );
};

export default Hero;
