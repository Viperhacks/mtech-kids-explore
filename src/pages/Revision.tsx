
import React from 'react';
import { Separator } from '@/components/ui/separator';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Revision = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <div className="container mx-auto py-10 px-4">
          <h1 className="text-3xl font-bold text-center text-mtech-primary mb-6">Revision Resources</h1>
          <Separator className="my-4" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-3 text-mtech-secondary">Study Guides</h2>
              <p className="text-gray-600 mb-4">
                Access comprehensive study guides for all subjects to help with your revision.
              </p>
              <div className="flex justify-end">
                <button className="px-4 py-2 bg-mtech-accent text-white rounded-md hover:bg-mtech-accent/80 transition-colors">
                  Browse Study Guides
                </button>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-3 text-mtech-secondary">Practice Tests</h2>
              <p className="text-gray-600 mb-4">
                Test your knowledge with our practice tests designed to prepare you for exams.
              </p>
              <div className="flex justify-end">
                <button className="px-4 py-2 bg-mtech-accent text-white rounded-md hover:bg-mtech-accent/80 transition-colors">
                  Try Practice Tests
                </button>
              </div>
            </div>
          </div>
          
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4 text-center text-mtech-secondary">Revision Tips</h2>
            <div className="bg-white rounded-lg shadow-md p-6">
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Create a dedicated study space free from distractions</li>
                <li>Use active recall techniques rather than passive reading</li>
                <li>Take regular breaks - try the Pomodoro technique</li>
                <li>Test yourself regularly with practice questions</li>
                <li>Teach concepts to others to reinforce your understanding</li>
                <li>Get enough sleep, especially the night before exams</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Revision;
