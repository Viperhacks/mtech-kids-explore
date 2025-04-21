
import React from 'react';
import { Separator } from '@/components/ui/separator';

const Privacy = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Privacy Policy</h1>
      
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-sm">
        <p className="text-sm text-gray-500 mb-4">Last Updated: April 5, 2025</p>
        
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Introduction</h2>
          <p className="text-gray-700">
            MTECH Kids Explore ("we", "our", or "us") is committed to protecting the privacy of children and all users of our educational platform. This Privacy Policy explains how we collect, use, and share information about you when you use our website, mobile applications, and other online products and services (collectively, the "Services").
          </p>
        </section>
        
        <Separator className="my-4" />
        
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Information We Collect</h2>
          <p className="text-gray-700 mb-3">
            We collect information you provide directly to us when you:
          </p>
          <ul className="list-disc pl-5 text-gray-700 space-y-1">
            <li>Create an account and register as a student  or teacher</li>
            <li>Complete your profile information and preferences</li>
            <li>Participate in learning activities, quizzes, and exercises</li>
            <li>Communicate with us through the platform</li>
            <li>Submit content or feedback about our Services</li>
          </ul>
        </section>
        
        <Separator className="my-4" />
        
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">How We Use Information</h2>
          <p className="text-gray-700 mb-3">
            We use the information we collect to:
          </p>
          <ul className="list-disc pl-5 text-gray-700 space-y-1">
            <li>Provide, maintain, and improve our educational Services</li>
            <li>Track and personalize your learning experience</li>
            <li>Process and fulfill your requests for specific content</li>
            <li>Generate progress reports for students and teachers</li>
            <li>Communicate with you about your account and our Services</li>
            <li>Monitor and analyze trends, usage, and activities in connection with our Services</li>
            <li>Comply with applicable laws, legal processes, and regulations</li>
          </ul>
        </section>
        
        <Separator className="my-4" />
        
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Children's Privacy</h2>
          <p className="text-gray-700">
            We comply with the Children's Online Privacy Protection Act (COPPA). We require parental consent before collecting personal information from children under 13, and we limit the information collected to what is reasonably necessary for participation in our educational activities. Parents can review, edit, or request deletion of their child's information at any time through their parent account.
          </p>
        </section>
        
        <Separator className="my-4" />
        
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Contact Us</h2>
          <p className="text-gray-700">
            If you have any questions about this Privacy Policy or our privacy practices, please contact us at privacy@mtechkidsexplore.com or through our Contact page.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Privacy;
