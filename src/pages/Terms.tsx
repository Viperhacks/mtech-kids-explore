
import React from 'react';
import { Separator } from '@/components/ui/separator';

const Terms = () => {
  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-center text-mtech-primary mb-6">Terms of Service</h1>
      <p className="text-gray-600 text-center max-w-2xl mx-auto mb-8">
        Last updated: July 1, 2023
      </p>
      <Separator className="my-6" />
      
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold text-mtech-secondary mb-4">1. Introduction</h2>
          <p className="text-gray-600">
            Welcome to MTECH (the "Platform"). These Terms of Service ("Terms") govern your use of our website, 
            services, and educational content. By accessing or using our Platform, you agree to be bound by 
            these Terms. If you are using this Platform on behalf of a child under the age of 13, you represent 
            that you are the parent or legal guardian of such child and consent to these Terms on their behalf.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold text-mtech-secondary mb-4">2. Definitions</h2>
          <ul className="space-y-3 text-gray-600">
            <li><strong>"Platform"</strong> refers to the MTECH website and all related services.</li>
            <li><strong>"User"</strong> refers to any individual who accesses or uses our Platform.</li>
            <li><strong>"Content"</strong> refers to all materials available on our Platform, including text, 
            images, videos, audio files, and interactive features.</li>
            <li><strong>"Student"</strong> refers to a child or young person who is the primary intended user 
            of our educational content.</li>
            <li><strong>"Parent"</strong> refers to a parent or legal guardian of a Student.</li>
            <li><strong>"Teacher"</strong> refers to an educational professional who uses our Platform to 
            facilitate learning.</li>
          </ul>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold text-mtech-secondary mb-4">3. Account Registration</h2>
          <p className="text-gray-600 mb-4">
            To access certain features of our Platform, you may need to create an account. When creating an account:
          </p>
          <ul className="list-disc list-inside pl-4 text-gray-600 space-y-2">
            <li>You agree to provide accurate, current, and complete information.</li>
            <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
            <li>You agree to notify us immediately of any unauthorized access to your account.</li>
            <li>You are fully responsible for all activities that occur under your account.</li>
          </ul>
          <p className="text-gray-600 mt-4">
            For accounts created for children under 13, a parent or guardian must create the account and 
            provide verifiable consent in accordance with applicable laws.
          </p>
        </section>
        
        <div className="bg-mtech-primary/5 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold text-mtech-secondary mb-4">4. User Roles and Permissions</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-medium text-mtech-primary mb-2">4.1 Students</h3>
              <p className="text-gray-600">
                Students may access age-appropriate educational content, participate in interactive learning 
                activities, and track their own progress. Student accounts have limited permissions and cannot 
                modify platform settings or access administrative features.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-medium text-mtech-primary mb-2">4.2 Teachers</h3>
              <p className="text-gray-600">
                Teachers may create and manage classroom groups, assign educational content, monitor student 
                progress, and upload supplementary materials related to their teaching areas. Teachers are 
                responsible for ensuring that any content they upload is appropriate and complies with these Terms.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-medium text-mtech-primary mb-2">4.3 Parents/Guardians</h3>
              <p className="text-gray-600">
                Parents may create and manage their child's account, monitor their child's progress, and 
                communicate with teachers through the Platform. Parents are responsible for supervising their 
                child's use of the Platform.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-medium text-mtech-primary mb-2">4.4 Administrators</h3>
              <p className="text-gray-600">
                Administrators have enhanced permissions to manage user accounts, content, and Platform settings. 
                Administrative access is limited to authorized MTECH staff and designated school officials.
              </p>
            </div>
          </div>
        </div>
        
        <section>
          <h2 className="text-2xl font-semibold text-mtech-secondary mb-4">5. Intellectual Property Rights</h2>
          <p className="text-gray-600 mb-4">
            All content on our Platform, including text, graphics, logos, images, videos, and software, is the 
            property of MTECH or our licensors and is protected by intellectual property laws.
          </p>
          <p className="text-gray-600">
            Users may not copy, modify, distribute, sell, or lease any part of our Platform or its content 
            without our explicit permission. Users may print or download materials for personal, 
            non-commercial educational use only.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold text-mtech-secondary mb-4">6. User Conduct</h2>
          <p className="text-gray-600 mb-4">
            When using our Platform, you agree not to:
          </p>
          <ul className="list-disc list-inside pl-4 text-gray-600 space-y-2">
            <li>Violate any applicable laws or regulations</li>
            <li>Upload or share inappropriate, offensive, or harmful content</li>
            <li>Impersonate any person or entity</li>
            <li>Interfere with or disrupt the Platform or servers</li>
            <li>Attempt to gain unauthorized access to any part of the Platform</li>
            <li>Use automated means to access or collect data from our Platform</li>
            <li>Engage in any activity that could harm or disrupt other users' experience</li>
          </ul>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold text-mtech-secondary mb-4">7. Privacy Policy</h2>
          <p className="text-gray-600">
            Our Privacy Policy explains how we collect, use, and protect your personal information. By using 
            our Platform, you acknowledge that you have read and understood our Privacy Policy, which is 
            incorporated by reference into these Terms. Our Privacy Policy is available at 
            <a href="/privacy" className="text-mtech-primary hover:underline ml-1">Privacy Policy</a>.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold text-mtech-secondary mb-4">8. Termination</h2>
          <p className="text-gray-600">
            We reserve the right to suspend or terminate your access to our Platform at any time for any reason, 
            including but not limited to violation of these Terms. Upon termination, your right to use the 
            Platform will immediately cease. All provisions of the Terms that by their nature should survive 
            termination shall survive, including ownership provisions, warranty disclaimers, indemnity, and 
            limitations of liability.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold text-mtech-secondary mb-4">9. Disclaimer of Warranties</h2>
          <p className="text-gray-600">
            Our Platform is provided on an "as is" and "as available" basis. MTECH makes no warranties, 
            expressed or implied, regarding the operation or availability of the Platform. We do not warrant 
            that the Platform will be uninterrupted or error-free, or that defects will be corrected.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold text-mtech-secondary mb-4">10. Limitation of Liability</h2>
          <p className="text-gray-600">
            To the maximum extent permitted by law, MTECH shall not be liable for any indirect, incidental, 
            special, consequential, or punitive damages resulting from your use of or inability to use the 
            Platform, even if we have been advised of the possibility of such damages.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold text-mtech-secondary mb-4">11. Changes to Terms</h2>
          <p className="text-gray-600">
            We may modify these Terms at any time by posting the revised terms on this page. Your continued 
            use of the Platform after such changes constitutes your acceptance of the new Terms.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold text-mtech-secondary mb-4">12. Contact Us</h2>
          <p className="text-gray-600 mb-4">
            If you have any questions about these Terms, please contact us at:
          </p>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-700">
              <strong>Email:</strong> legal@mtechlearning.com<br />
              <strong>Address:</strong> 123 Education Street, Learning City, ED 12345<br />
              <strong>Phone:</strong> +1 (123) 456-7890
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Terms;
