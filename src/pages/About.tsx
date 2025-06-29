
import React from 'react';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';

const About = () => {
  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-center text-mtech-primary mb-6">About MTECH</h1>
      <Separator className="my-4" />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-semibold mb-4 text-mtech-secondary">Our Mission</h2>
          <p className="text-gray-600 mb-6">
            Mtech Academy is dedicated to providing accessible, high-quality educational resources for primary school students. 
            Our platform aims to empower young learners with the tools they need to succeed academically and develop a 
            lifelong love for learning.
          </p>
          
          <h2 className="text-2xl font-semibold mb-4 text-mtech-secondary">Our Vision</h2>
          <p className="text-gray-600 mb-6">
            We envision a future where every child has equal access to educational opportunities, regardless of 
            their background or circumstances. Through innovative technology and engaging content, we strive to bridge 
            educational gaps and inspire the next generation of thinkers, creators, and leaders.
          </p>
          
          <h2 className="text-2xl font-semibold mb-4 text-mtech-secondary">Our Story</h2>
          <p className="text-gray-600">
            Mtech Academy began as a small initiative by a group of passionate educators who recognized the need for more 
            engaging and accessible learning resources for primary school children. What started as a collection of 
            digital worksheets has grown into a comprehensive educational platform that serves thousands of students 
            across the country.
          </p>
          <p className="text-gray-600 mt-4">
            Our team comprises educators, technologists, and child development specialists who work together to 
            create content that is not only educational but also enjoyable and relevant to today's young learners.
          </p>
        </div>
        
        <div>
          <Card className="mb-6">
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-3 text-mtech-secondary">Our Values</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <div className="bg-mtech-accent/20 p-1 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-mtech-accent"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  <span className="text-gray-700">Excellence in Education</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="bg-mtech-accent/20 p-1 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-mtech-accent"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  <span className="text-gray-700">Innovation & Creativity</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="bg-mtech-accent/20 p-1 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-mtech-accent"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  <span className="text-gray-700">Inclusivity & Accessibility</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="bg-mtech-accent/20 p-1 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-mtech-accent"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  <span className="text-gray-700">Child-Centered Learning</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="bg-mtech-accent/20 p-1 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-mtech-accent"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  <span className="text-gray-700">Continuous Improvement</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          
         
        </div>
      </div>
    </div>
  );
};

export default About;
