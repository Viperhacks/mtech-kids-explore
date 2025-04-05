
import React, { useState } from 'react';
import HeroCarousel from '@/components/HeroCarousel';
import WelcomeCards from '@/components/WelcomeCards';
import CurriculumSection from '@/components/CurriculumSection';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import AuthForm from '@/components/AuthForm';
import { Button } from '@/components/ui/button';
import { ArrowRight, Award, GraduationCap } from 'lucide-react';

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
              <div className="p-4">
                <div className="text-4xl font-bold mb-2">2,500+</div>
                <div className="text-white/80">Students</div>
              </div>
              <div className="p-4">
                <div className="text-4xl font-bold mb-2">50+</div>
                <div className="text-white/80">Teachers</div>
              </div>
              <div className="p-4">
                <div className="text-4xl font-bold mb-2">1,000+</div>
                <div className="text-white/80">Video Lessons</div>
              </div>
              <div className="p-4">
                <div className="text-4xl font-bold mb-2">5,000+</div>
                <div className="text-white/80">Practice Questions</div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 bg-gray-50">
          <div className="mtech-container">
            <h2 className="section-heading mb-12">Why Choose MTECH Kids Explore?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex items-start space-x-4">
                <div className="bg-mtech-primary/10 p-3 rounded-lg">
                  <Award className="h-6 w-6 text-mtech-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Interactive Learning</h3>
                  <p className="text-gray-600">
                    Our platform transforms traditional learning into an engaging experience with interactive videos and activities that children enjoy.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-mtech-secondary/10 p-3 rounded-lg">
                  <GraduationCap className="h-6 w-6 text-mtech-secondary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Curriculum Aligned</h3>
                  <p className="text-gray-600">
                    All content is aligned with the national curriculum to ensure students receive education that meets required standards.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-mtech-accent/10 p-3 rounded-lg">
                  <svg className="h-6 w-6 text-mtech-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Progress Tracking</h3>
                  <p className="text-gray-600">
                    Track your child's progress through our comprehensive reporting system to identify strengths and areas needing improvement.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-mtech-warning/10 p-3 rounded-lg">
                  <svg className="h-6 w-6 text-mtech-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Learn at Your Pace</h3>
                  <p className="text-gray-600">
                    Students can learn at their own speed, revisiting concepts as needed and advancing when they're ready for new challenges.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-mtech-dark text-white text-center">
          <div className="mtech-container">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Start Learning?
            </h2>
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
