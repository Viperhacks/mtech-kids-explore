import React, { useState } from 'react';
import HeroCarousel from '@/components/HeroCarousel';
import WelcomeCards from '@/components/WelcomeCards';
import CurriculumSection from '@/components/CurriculumSection';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import AuthForm from '@/components/AuthForm';
import { Button } from '@/components/ui/button';
import { ArrowRight, Award, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { InView } from 'react-intersection-observer';

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

const features = [
  {
    icon: <Award className="h-6 w-6 text-mtech-primary" />,
    title: 'Interactive Learning',
    description:
      'Our platform transforms traditional learning into an engaging experience with interactive videos and activities that children enjoy.',
    bgColor: 'bg-mtech-primary/10',
    iconColor: 'text-mtech-primary'
  },
  {
    icon: <GraduationCap className="h-6 w-6 text-mtech-secondary" />,
    title: 'Curriculum Aligned',
    description:
      'All content is aligned with the national curriculum to ensure students receive education that meets required standards.',
    bgColor: 'bg-mtech-secondary/10',
    iconColor: 'text-mtech-secondary'
  },
  {
    icon: (
      <svg
        className="h-6 w-6 text-mtech-accent"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
        />
      </svg>
    ),
    title: 'Progress Tracking',
    description:
      'Track student progress through our comprehensive reporting system to identify strengths and areas needing improvement.',
    bgColor: 'bg-mtech-accent/10',
    iconColor: 'text-mtech-accent'
  },
  {
    icon: (
      <svg
        className="h-6 w-6 text-mtech-warning"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    title: 'Learn at Your Pace',
    description:
      'Students can learn at their own speed, revisiting concepts as needed and advancing when they\'re ready for new challenges.',
    bgColor: 'bg-mtech-warning/10',
    iconColor: 'text-mtech-warning'
  }
];

const stats = [
  { number: 350, label: 'Students' },
  { number: 250, label: 'Teachers' },
  { number: 250, label: 'Video Lessons' },
  { number: 800, label: 'Practice Questions' }
];

const Index = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {/* Hero Carousel */}
        <HeroCarousel />

        {/* Welcome Cards */}
        <WelcomeCards />

        {/* Curriculum Section */}
        <CurriculumSection />

        {/* Statistics Section */}
        <section className="py-16 bg-gradient-to-r from-mtech-primary to-mtech-secondary">
          <div className="mtech-container">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-white text-center">
              {stats.map((stat, index) => (
                <div key={index} className="p-4">
                  <InView triggerOnce>
                    {({ inView, ref }) => (
                      <div ref={ref} className="text-4xl font-bold mb-2">
                        {inView && (
                          <CountUp 
                            end={stat.number}
                            preserveValue={true}
                            formattingFn={(value) => value.toLocaleString()}
                          />
                        )}
                        <span className="text-xl">+</span>
                      </div>
                    )}
                  </InView>
                  <div className="text-white/80">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 bg-gray-50">
          <div className="mtech-container">
            <h2 className="section-heading mb-12">Why Choose MTECH Kids Explore?</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <motion.div
                    initial="rest"
                    whileHover="hover"
                    animate="rest"
                    variants={iconVariants}
                    className={`${feature.bgColor} p-3 rounded-lg`}
                  >
                    {feature.icon}
                  </motion.div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-mtech-dark text-white text-center">
          <div className="mtech-container">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Learning?</h2>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of students using MTECH Kids Explore to enhance their education journey.
            </p>
            <Button
              onClick={() => setIsAuthModalOpen(true)}
              className="bg-mtech-accent hover:bg-green-600 text-white px-8 py-6 text-lg rounded-lg group"
            >
              Get Started Today
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </section>

        {/* Auth Modal */}
        <Dialog open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen}>
          <DialogContent className="sm:max-w-md">
            <AuthForm onClose={() => setIsAuthModalOpen(false)} />
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default Index;
