import { motion } from 'framer-motion';
import { Briefcase, Calendar, Award } from 'lucide-react';

const experiences = [
    {
        title: 'Java Fundamentals Trainee',
        company: 'Skill Stones',
        period: 'June 2025 - July 2025',
        description: 'Learned core Java programming concepts and Object-Oriented Programming (OOP). Implemented Java programs using classes, objects, inheritance, polymorphism, abstraction, and encapsulation. Gained knowledge of control structures, arrays, strings, methods, and exception handling.',
        icon: <Briefcase className="w-8 h-8 text-primary group-hover:text-white transition-colors" />
    },
    {
        title: 'Problem Solver',
        company: 'LeetCode & HackerRank',
        period: 'July 2026',
        description: 'Solved 100+ coding problems on LeetCode, strengthening data structures and algorithms, and problem-solving skills. Achieved a 5-Star C++ rating on HackerRank through consistent problem-solving performance.',
        icon: <Award className="w-8 h-8 text-primary group-hover:text-white transition-colors" />
    },
    {
        title: 'Participant',
        company: 'University Level Hackathons',
        period: 'March 2024',
        description: 'Participated in BinaryBlitz and CodeOffDuty university level Hackathons.',
        icon: <Award className="w-8 h-8 text-primary group-hover:text-white transition-colors" />
    }
];

const Experience = () => {
    return (
        <section id="experience" className="py-24 relative overflow-hidden z-10 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-primary mb-4">
                        Training & Extracurriculars
                    </h2>
                </motion.div>

                <div className="max-w-4xl mx-auto space-y-6">
                    {experiences.map((exp, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
                            className="luxury-card p-8 md:p-10 flex flex-col md:flex-row gap-6 items-start group"
                        >
                            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 group-hover:bg-primary group-hover:border-primary transition-colors shrink-0 shadow-sm">
                                {exp.icon}
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-bold tracking-tight text-primary mb-1">{exp.title}</h3>
                                <div className="text-base text-accent font-semibold mb-4">{exp.company}</div>
                                <p className="text-secondary leading-relaxed font-normal mb-6">
                                    {exp.description}
                                </p>
                                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-zinc-50 border border-zinc-200 rounded-full text-xs text-secondary font-medium shadow-sm">
                                    <Calendar className="w-3.5 h-3.5" />
                                    {exp.period}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Experience;
