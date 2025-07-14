import React from 'react';
import { BookOpen, Video, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const iconVariants = {
  rest: { scale: 1 },
  hover: {
    scale: 1.2,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 10
    }
  }
};

const WelcomeCards: React.FC = () => {
  const cards = [
    {
      id: 1,
      title: 'Welcome to MTECH Kids Explore',
      description: 'An interactive learning platform designed to make education fun and engaging for primary school students. Discover exciting ways to learn new subjects.',
      icon: BookOpen,
      link: '/about',
      linkText: 'Learn More'
    },
    {
      id: 2,
      title: 'Tutorial Videos',
      description: 'Watch engaging educational videos created by expert teachers. Our visual learning approach helps students understand complex topics easily.',
      icon: Video,
      link: '/tutorials',
      linkText: 'Watch Videos'
    },
    {
      id: 3,
      title: 'Interactive Exercises',
      description: 'Practice what you learn with our interactive exercises and quizzes designed to reinforce understanding and track your progress.',
      icon: FileText,
      link: '/exercises',
      linkText: 'Try Exercises'
    }
  ];

  return (
    <section className="py-12 bg-gradient-to-br from-white via-[#f0f9ff] to-mtech-primary/5">
      <div className="mtech-container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card) => (
            <div key={card.id} className="mtech-card p-6 flex flex-col h-full bg-gradient-to-br from-mtech-primary/10 to-mtech-secondary/10  shadow-sm rounded-lg">
              <motion.div
                className="mb-4"
                initial="rest"
                whileHover="hover"
                animate="rest"
              >
                <motion.div
  variants={iconVariants}
  className="inline-flex items-center justify-center p-4 bg-mtech-primary/10 rounded-full shadow-sm"
>
  <card.icon className="h-6 w-6 text-mtech-primary" />
</motion.div>

              </motion.div>

              <h3 className="text-xl font-bold mb-3 text-mtech-primary">
  {card.title}
</h3>
<p className="text-mtech-dark/80 flex-grow mb-6">{card.description}</p>

              <div>
               <Button 
  asChild 
  className="bg-mtech-secondary text-white hover:bg-blue-600 transition-colors rounded-full px-6 py-2"
>

                  <Link to={card.link}>{card.linkText}</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WelcomeCards;
