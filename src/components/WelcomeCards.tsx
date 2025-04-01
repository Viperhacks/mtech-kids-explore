
import React from 'react';
import { BookOpen, Video, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

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
    <section className="py-12 bg-gray-50">
      <div className="mtech-container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card) => (
            <div 
              key={card.id} 
              className="mtech-card p-6 flex flex-col h-full"
            >
              <div className="mb-4">
                <div className="inline-flex items-center justify-center p-3 bg-mtech-primary/10 rounded-lg">
                  <card.icon className="h-6 w-6 text-mtech-primary" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-mtech-dark">{card.title}</h3>
              <p className="text-gray-600 flex-grow mb-6">{card.description}</p>
              <div>
                <Button asChild className="mtech-button-primary">
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
