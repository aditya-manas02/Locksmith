import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Github, ArrowUpRight } from 'lucide-react';

import safetywatchImg from '../assets/safetywatch.png';
import sevantraImg from '../assets/sevantra.png';

const allProjects = [
    {
        title: 'Sevantra',
        subtitle: 'Civic Engagement Platform',
        description: 'Engineered a full-stack civic engagement platform enabling citizens and NGOs to seamlessly connect, manage organizations, and collaborate on local events. Implemented secure authentication with OTP verification and Google OAuth, alongside a robust role-based system and an admin dashboard with real-time analytics. Architected as a scalable Turborepo monorepo with a Next.js frontend and Express.js backend, utilizing Prisma ORM with PostgreSQL, deployed on Vercel and Render.',
        tech: ['Next.js', 'Node.js', 'Express.js', 'PostgreSQL', 'Prisma', 'Tailwind CSS', 'Turborepo'],
        link: 'https://sevantra.vercel.app/',
        github: 'https://github.com/aditya-manas02/sevantra',
        image: sevantraImg,
        live: true,
    },
    {
        title: 'SafetyWatch',
        subtitle: 'Community Safety Platform',
        description: 'Developed a comprehensive neighborhood safety application enabling users to report incidents, track local crime via interactive heatmaps, and participate in gamified safety challenges. Built a real-time private messaging system with Cloudinary-backed screenshot moderation, alongside a life-saving SOS feature that instantly alerts contacts via Telegram webhooks and SMS. Created Nexus AI, an intelligent security assistant powered by Google Gemini, programmed with strict system prompts to provide hyper-focused safety guidance. Managed JWT & Firebase authentication, comprehensive administrative dashboards for bulk incident management, and automated system audit logging.',
        tech: ['React (Vite)', 'Node.js', 'Express', 'MongoDB (Mongoose)', 'Google Gemini AI', 'Telegram Bot API', 'Cloudinary', 'Firebase', 'JWT', 'Zod'],
        link: 'https://www.safetywatch.me/',
        github: 'https://github.com/aditya-manas02/safetywatch-frontend',
        image: safetywatchImg,
        live: true,
    }
];

const ProjectCard = ({ project, index, range, targetScale, progress }: any) => {
    const container = useRef(null);
    const scale = useTransform(progress, range, [1, targetScale]);
    
    // Parallax effect for the image inside the card
    const imageScale = useTransform(progress, range, [1, 1.2]);

    return (
        <div ref={container} className="h-auto md:h-screen py-10 md:py-0 flex items-center justify-center md:sticky top-0 px-4">
            <motion.div 
                style={{ scale, '--card-top': `calc(-5vh + ${index * 25}px)` } as any} 
                className="relative w-full max-w-5xl h-auto md:h-[600px] luxury-card overflow-hidden flex flex-col md:flex-row shadow-[0_20px_50px_rgba(0,0,0,0.1)] origin-top md:top-[var(--card-top)]"
            >
                {/* Image Section */}
                <div className="relative w-full md:w-1/2 h-[250px] sm:h-[300px] md:h-full overflow-hidden bg-zinc-100 shrink-0">
                    <motion.div style={{ scale: imageScale }} className="w-full h-full">
                        <img 
                            src={project.image} 
                            alt={project.title} 
                            className="w-full h-full object-cover"
                        />
                    </motion.div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/10 pointer-events-none" />
                </div>

                {/* Content Section */}
                <div className="w-full md:w-1/2 h-auto md:h-full p-6 sm:p-8 md:p-12 flex flex-col justify-between bg-white z-10 gap-8 md:gap-0">
                    <div>
                        <div className="text-accent text-xs md:text-sm font-extrabold tracking-widest uppercase mb-2 md:mb-3">
                            {project.subtitle}
                        </div>
                        <h3 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-primary tracking-tight mb-3 md:mb-4">
                            {project.title}
                        </h3>
                        <p className="text-secondary text-sm sm:text-base md:text-lg leading-relaxed mb-6 md:mb-8">
                            {project.description}
                        </p>
                        
                        <div className="flex flex-wrap gap-2 mb-2 md:mb-8">
                            {project.tech.map((t: string, i: number) => (
                                <span key={i} className="px-3 md:px-4 py-1.5 bg-zinc-50 text-zinc-700 text-[10px] md:text-xs font-bold rounded-full border border-zinc-200 shadow-sm">
                                    {t}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-wrap sm:flex-nowrap gap-3 md:gap-4 pt-6 border-t border-zinc-100">
                        {project.live && (
                            <a 
                                href={project.link} 
                                className="flex-1 sm:flex-none flex justify-center items-center gap-2 text-xs md:text-sm font-bold text-white bg-primary px-4 md:px-6 py-3 rounded-full hover:bg-zinc-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                                target="_blank"
                                rel="noreferrer"
                            >
                                Live Demo
                                <ArrowUpRight className="w-4 h-4" />
                            </a>
                        )}
                        <a 
                            href={project.github} 
                            target="_blank" 
                            rel="noreferrer"
                            className="flex-1 sm:flex-none flex justify-center items-center gap-2 text-xs md:text-sm font-bold text-secondary bg-white border-2 border-zinc-200 px-4 md:px-6 py-3 rounded-full hover:bg-zinc-50 transition-all shadow-sm hover:shadow hover:-translate-y-0.5"
                        >
                            Source
                            <Github className="w-4 h-4" />
                        </a>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

const Projects = () => {
    const container = useRef(null);
    const { scrollYProgress } = useScroll({
        target: container,
        offset: ['start start', 'end end']
    });

    return (
        <section id="projects" ref={container} className="relative z-10 bg-background pb-12 md:pb-[10vh] mt-12 md:mt-24">
            
            <div className="md:sticky top-0 h-auto md:h-[20vh] flex items-center justify-center pointer-events-none z-0 mb-8 md:mb-0">
                <div className="text-center pt-10 md:pt-20 px-4">
                    <h2 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tighter text-primary mb-4">
                        Selected Works
                    </h2>
                    <p className="text-base md:text-lg text-secondary font-medium max-w-xl mx-auto">
                        Scroll down to explore my latest creations.
                    </p>
                </div>
            </div>
            
            <div className="md:mt-[-20vh]">
                {allProjects.map((project, i) => {
                    const targetScale = 1 - ( (allProjects.length - i) * 0.05);
                    return (
                        <ProjectCard 
                            key={i} 
                            index={i} 
                            project={project} 
                            progress={scrollYProgress} 
                            range={[i * 0.25, 1]} 
                            targetScale={targetScale} 
                        />
                    );
                })}
            </div>
        </section>
    );
};

export default Projects;
