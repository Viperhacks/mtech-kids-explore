
import React from 'react';
import { Separator } from '@/components/ui/separator';

const Terms = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Terms of Service</h1>
      
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-sm">
        <p className="text-sm text-gray-500 mb-4">Last Updated: April 5, 2025</p>
        
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Agreement to Terms</h2>
          <p className="text-gray-700">
            By accessing or using Mtech Academy's educational platform, website, and services (collectively, the "Services"), you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing our Services.
          </p>
        </section>
        
        <Separator className="my-4" />
        
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">User Accounts</h2>
          <p className="text-gray-700 mb-3">
            When you create an account with us, you must provide accurate and complete information. You are responsible for maintaining the security of your account and password. You agree to accept responsibility for all activities that occur under your account.
          </p>
          <p className="text-gray-700">
            Parents creating accounts for children under 13 are responsible for managing their child's account and monitoring their use of our Services.
          </p>
        </section>
        
        <Separator className="my-4" />
        
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Intellectual Property</h2>
          <p className="text-gray-700">
            The Services and all content, features, and functionality (including but not limited to text, graphics, videos, logos, and software) are owned by Mtech Academy or its licensors and are protected by copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, modify, create derivative works of, publicly display, or use any content from our Services without prior written consent.
          </p>
        </section>
        
        <Separator className="my-4" />
        
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Acceptable Use</h2>
          <p className="text-gray-700 mb-3">
            You agree not to use our Services for any purpose that is unlawful or prohibited by these Terms. You may not:
          </p>
          <ul className="list-disc pl-5 text-gray-700 space-y-1">
            <li>Post harmful, offensive, or inappropriate content</li>
            <li>Impersonate any person or entity</li>
            <li>Interfere with or disrupt the Services or servers</li>
            <li>Collect user information without their consent</li>
            <li>Use the Services for commercial purposes without authorization</li>
            <li>Attempt to gain unauthorized access to any portion of the Services</li>
          </ul>
        </section>
        
        <Separator className="my-4" />
        
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Termination</h2>
          <p className="text-gray-700">
            We may terminate or suspend your account and access to our Services immediately, without prior notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties, or for any other reason at our sole discretion.
          </p>
        </section>
        
        <Separator className="my-4" />
        
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Changes to Terms</h2>
          <p className="text-gray-700">
            We reserve the right to modify these Terms at any time. Your continued use of the Services following the posting of revised Terms means that you accept and agree to the changes.
          </p>
        </section>
        
        <Separator className="my-4" />
        
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Contact Us</h2>
          <p className="text-gray-700">
            If you have any questions about these Terms, please contact us at terms@mtechkidsexplore.com or through our Contact page.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Terms;
