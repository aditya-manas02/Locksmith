import { motion } from 'framer-motion';

const skillCategories = [
    {
        category: 'Languages',
        items: ['Python', 'C++', 'JavaScript', 'C', 'PHP', 'Java']
    },
    {
        category: 'Frameworks',
        items: ['HTML', 'CSS', 'Node.js', 'React', 'Tailwind CSS']
    },
    {
        category: 'Tools & Platforms',
        items: ['MySQL', 'MongoDB', 'Linux', 'Git', 'GitHub', 'Vercel']
    },
    {
        category: 'Soft Skills',
        items: ['Problem-Solving', 'Leadership', 'Teamwork', 'Time Management', 'Adaptability']
    }
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const allSkills = skillCategories.flatMap(group => group.items);

const Skills = () => {
    return (
        <section id="skills" className="py-24 relative overflow-hidden z-10 bg-white border-y border-zinc-100">
            
            {/* Infinite Tech Stack Marquee (Top) */}
            <div className="absolute top-12 left-0 w-full overflow-hidden flex whitespace-nowrap pointer-events-none select-none mask-edges">
                <div className="flex animate-marquee min-w-full">
                    {[...allSkills, ...allSkills, ...allSkills].map((item, idx) => (
                        <span key={idx} className="mx-4 text-4xl font-extrabold text-zinc-900/20 tracking-tighter uppercase">
                            {item}
                        </span>
                    ))}
                </div>
            </div>
            
            {/* Infinite Tech Stack Marquee (Bottom, Reverse) */}
            <div className="absolute bottom-12 left-0 w-full overflow-hidden flex whitespace-nowrap pointer-events-none select-none mask-edges">
                <div className="flex animate-marquee-reverse min-w-full">
                    {[...allSkills, ...allSkills, ...allSkills].reverse().map((item, idx) => (
                        <span key={idx} className="mx-4 text-4xl font-extrabold text-zinc-900/20 tracking-tighter uppercase">
                            {item}
                        </span>
                    ))}
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-10">
                
                <div className="text-center mb-20">
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-primary mb-4">
                        Technical Expertise
                    </h2>
                    <p className="text-lg text-secondary font-normal max-w-2xl mx-auto">
                        A curated selection of the tools, languages, and frameworks I use to build robust digital solutions.
                    </p>
                </div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
                >
                    {skillCategories.map((group) => (
                        <motion.div 
                            key={group.category} 
                            variants={itemVariants}
                            className="luxury-card p-8 group relative overflow-hidden"
                        >
                            <h3 className="text-xl font-semibold tracking-tight text-primary mb-6 border-b border-zinc-100 pb-3 relative z-10">
                                {group.category}
                            </h3>
                            <div className="flex flex-wrap gap-2.5 relative z-10">
                                {group.items.map((item) => (
                                    <span
                                        key={item}
                                        className="px-3.5 py-1.5 bg-white border border-zinc-200 text-sm font-medium text-secondary rounded-lg hover:bg-primary hover:text-white hover:border-primary transition-all cursor-default shadow-sm"
                                    >
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default Skills;
