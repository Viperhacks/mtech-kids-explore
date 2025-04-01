
import React from 'react';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';

const Privacy = () => {
  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-center text-mtech-primary mb-6">Privacy Policy</h1>
      <p className="text-gray-600 text-center max-w-2xl mx-auto mb-8">
        Last updated: July 1, 2023
      </p>
      <Separator className="my-6" />
      
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold text-mtech-secondary mb-4">1. Introduction</h2>
          <p className="text-gray-600">
            MTECH ("we", "our", or "us") is committed to protecting the privacy of children who use our 
            educational platform. This Privacy Policy explains how we collect, use, disclose, and safeguard 
            your information when you use our website and services. Please read this privacy policy carefully.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold text-mtech-secondary mb-4">2. Information We Collect</h2>
          <div className="pl-4 space-y-4">
            <div>
              <h3 className="text-xl font-medium text-mtech-primary mb-2">2.1 Personal Information</h3>
              <p className="text-gray-600">
                We may collect personally identifiable information, such as:
              </p>
              <ul className="list-disc list-inside pl-4 mt-2 text-gray-600 space-y-1">
                <li>Full name</li>
                <li>Email address</li>
                <li>School name</li>
                <li>Grade level</li>
                <li>Parent or guardian contact information (for users under 13)</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-medium text-mtech-primary mb-2">2.2 Non-Personal Information</h3>
              <p className="text-gray-600">
                We may also collect non-personal information about how you interact with our platform:
              </p>
              <ul className="list-disc list-inside pl-4 mt-2 text-gray-600 space-y-1">
                <li>Browser type and version</li>
                <li>Operating system</li>
                <li>Device information</li>
                <li>Time spent on pages</li>
                <li>Links clicked</li>
                <li>Learning progress and performance data</li>
              </ul>
            </div>
          </div>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold text-mtech-secondary mb-4">3. How We Use Your Information</h2>
          <p className="text-gray-600 mb-3">
            The information we collect is used for the following purposes:
          </p>
          <ul className="list-disc list-inside pl-4 text-gray-600 space-y-2">
            <li>To provide and maintain our educational services</li>
            <li>To personalize the learning experience</li>
            <li>To track progress and provide appropriate educational content</li>
            <li>To communicate with parents/guardians about their child's progress</li>
            <li>To improve our platform based on feedback and usage patterns</li>
            <li>To comply with applicable laws and regulations</li>
          </ul>
        </section>
        
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold text-mtech-secondary mb-4">4. Children's Privacy</h2>
            <p className="text-gray-600 mb-4">
              We are committed to protecting the privacy of children under 13 years of age. We comply with the 
              Children's Online Privacy Protection Act (COPPA).
            </p>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
              <p className="text-yellow-800">
                <strong>Important:</strong> We only collect personal information from children under 13 with 
                verifiable parental consent. Parents have the right to review, delete, or refuse further 
                collection of their child's personal information.
              </p>
            </div>
            <p className="text-gray-600">
              For more information about COPPA and your child's privacy rights, please visit: 
              <a href="https://www.ftc.gov/business-guidance/privacy-security/childrens-privacy" 
                 className="text-mtech-primary hover:underline ml-1" target="_blank" rel="noreferrer">
                FTC Children's Privacy
              </a>
            </p>
          </CardContent>
        </Card>
        
        <section>
          <h2 className="text-2xl font-semibold text-mtech-secondary mb-4">5. Data Security</h2>
          <p className="text-gray-600 mb-4">
            We implement appropriate technical and organizational measures to protect your personal information 
            against unauthorized or unlawful processing, accidental loss, destruction, or damage. These measures include:
          </p>
          <ul className="list-disc list-inside pl-4 text-gray-600 space-y-2">
            <li>Encryption of sensitive data</li>
            <li>Regular security assessments</li>
            <li>Restricted access to personal information</li>
            <li>Employee training on data protection practices</li>
            <li>Secure data storage systems</li>
          </ul>
          <p className="text-gray-600 mt-4">
            However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot 
            guarantee absolute security.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold text-mtech-secondary mb-4">6. Data Retention</h2>
          <p className="text-gray-600">
            We retain personal information only for as long as necessary to fulfill the purposes outlined in this 
            Privacy Policy, unless a longer retention period is required or permitted by law. When we no longer need 
            to use your information, we will either securely delete it or anonymize it so that it can no longer be 
            associated with you.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold text-mtech-secondary mb-4">7. Your Rights</h2>
          <p className="text-gray-600 mb-4">
            Depending on your location, you may have certain rights regarding your personal information:
          </p>
          <ul className="list-disc list-inside pl-4 text-gray-600 space-y-2">
            <li>Right to access your personal information</li>
            <li>Right to correct inaccurate information</li>
            <li>Right to delete your personal information</li>
            <li>Right to restrict or object to processing</li>
            <li>Right to data portability</li>
            <li>Right to withdraw consent</li>
          </ul>
          <p className="text-gray-600 mt-4">
            To exercise these rights, please contact us using the information provided in the "Contact Us" section.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold text-mtech-secondary mb-4">8. Changes to This Privacy Policy</h2>
          <p className="text-gray-600">
            We may update this Privacy Policy from time to time to reflect changes in our practices or for other 
            operational, legal, or regulatory reasons. We will notify you of any material changes by posting the 
            updated Privacy Policy on this page and updating the "Last Updated" date. We encourage you to review 
            this Privacy Policy periodically.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold text-mtech-secondary mb-4">9. Contact Us</h2>
          <p className="text-gray-600 mb-4">
            If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:
          </p>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-700">
              <strong>Email:</strong> privacy@mtechlearning.com<br />
              <strong>Address:</strong> 123 Education Street, Learning City, ED 12345<br />
              <strong>Phone:</strong> +1 (123) 456-7890
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Privacy;
