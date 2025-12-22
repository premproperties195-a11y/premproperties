"use client";

import { motion } from "framer-motion";

interface TeamMember {
    id: string;
    name: string;
    role: string;
    image: string;
    bio: string;
}

export default function TeamGrid({ team }: { team: TeamMember[] }) {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
    };

    return (
        <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid md:grid-cols-3 gap-8"
        >
            {team.map((member) => (
                <motion.div
                    key={member.id}
                    variants={item}
                    whileHover={{
                        y: -15,
                        transition: { duration: 0.4, ease: "easeOut" }
                    }}
                    className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden group hover:shadow-[0_20px_50px_rgba(var(--primary-rgb),0.15)] transition-all duration-500 relative"
                >
                    {/* Background accent that reveals on hover */}
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-[var(--primary)] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left z-20" />

                    <div className="relative h-80 overflow-hidden">
                        <motion.img
                            src={member.image}
                            alt={member.name}
                            className="w-full h-full object-cover transition-all duration-700"
                            initial={{ scale: 1 }}
                            whileHover={{ scale: 1.05 }}
                        />
                        {/* More vibrant colorful gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[var(--primary-dark)]/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                            <p className="text-white text-sm font-medium leading-relaxed transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-100">
                                {member.bio}
                            </p>
                        </div>
                    </div>

                    <div className="p-8 text-center bg-white relative z-10">
                        <h3 className="text-2xl font-serif font-bold text-gray-900 mb-1 group-hover:text-[var(--primary)] transition-colors duration-300">
                            {member.name}
                        </h3>
                        <p className="text-[var(--primary)] text-sm font-bold uppercase tracking-[0.2em] mb-4">
                            {member.role}
                        </p>
                        <div className="h-1 w-12 bg-gray-100 mx-auto group-hover:w-20 group-hover:bg-[var(--primary)] transition-all duration-500 rounded-full" />
                    </div>
                </motion.div>
            ))}
        </motion.div>
    );
}
