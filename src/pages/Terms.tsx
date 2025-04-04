
import React from 'react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Terms = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <div className="container mx-auto py-10 px-4">
          <div className="flex items-center mb-6">
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)} 
              className="mr-2"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold text-mtech-primary">Terms of Service</h1>
          </div>
          
          <p className="text-gray-600 mb-8">
            Last updated: July 1, 2025
          </p>
          <Separator className="my-6" />
          
          <div className="space-y-6">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-2xl font-semibold text-mtech-secondary">
                  1. Introduction
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-gray-600">
                    Welcome to MTECH (the "Platform"). These Terms of Service ("Terms") govern your use of our website, 
                    services, and educational content. By accessing or using our Platform, you agree to be bound by 
                    these Terms. If you are using this Platform on behalf of a child under the age of 13, you represent 
                    that you are the parent or legal guardian of such child and consent to these Terms on their behalf.
                  </p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-2xl font-semibold text-mtech-secondary">
                  2. Definitions
                </AccordionTrigger>
                <AccordionContent>
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
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-3">
                <AccordionTrigger className="text-2xl font-semibold text-mtech-secondary">
                  3. Account Registration
                </AccordionTrigger>
                <AccordionContent>
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
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-4">
                <AccordionTrigger className="text-2xl font-semibold text-mtech-secondary">
                  4. User Roles and Permissions
                </AccordionTrigger>
                <AccordionContent className="bg-mtech-primary/5 p-4 rounded-lg">
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
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-5">
                <AccordionTrigger className="text-2xl font-semibold text-mtech-secondary">
                  5. Intellectual Property Rights
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-gray-600 mb-4">
                    All content on our Platform, including text, graphics, logos, images, videos, and software, is the 
                    property of MTECH or our licensors and is protected by intellectual property laws.
                  </p>
                  <p className="text-gray-600">
                    Users may not copy, modify, distribute, sell, or lease any part of our Platform or its content 
                    without our explicit permission. Users may print or download materials for personal, 
                    non-commercial educational use only.
                  </p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-6">
                <AccordionTrigger className="text-2xl font-semibold text-mtech-secondary">
                  6. User Conduct
                </AccordionTrigger>
                <AccordionContent>
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
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-7">
                <AccordionTrigger className="text-2xl font-semibold text-mtech-secondary">
                  7. Privacy Policy
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-gray-600">
                    Our Privacy Policy explains how we collect, use, and protect your personal information. By using 
                    our Platform, you acknowledge that you have read and understood our Privacy Policy, which is 
                    incorporated by reference into these Terms. Our Privacy Policy is available at
                    <a href="/privacy" className="text-mtech-primary hover:underline ml-1">Privacy Policy</a>.
                  </p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-8">
                <AccordionTrigger className="text-2xl font-semibold text-mtech-secondary">
                  8. Termination
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-gray-600">
                    We reserve the right to suspend or terminate your access to our Platform at any time for any reason, 
                    including but not limited to violation of these Terms. Upon termination, your right to use the 
                    Platform will immediately cease. All provisions of the Terms that by their nature should survive 
                    termination shall survive, including ownership provisions, warranty disclaimers, indemnity, and 
                    limitations of liability.
                  </p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-9">
                <AccordionTrigger className="text-2xl font-semibold text-mtech-secondary">
                  9. Disclaimer of Warranties
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-gray-600">
                    Our Platform is provided on an "as is" and "as available" basis. MTECH makes no warranties, 
                    expressed or implied, regarding the operation or availability of the Platform. We do not warrant 
                    that the Platform will be uninterrupted or error-free, or that defects will be corrected.
                  </p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-10">
                <AccordionTrigger className="text-2xl font-semibold text-mtech-secondary">
                  10. Limitation of Liability
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-gray-600">
                    To the maximum extent permitted by law, MTECH shall not be liable for any indirect, incidental, 
                    special, consequential, or punitive damages resulting from your use of or inability to use the 
                    Platform, even if we have been advised of the possibility of such damages.
                  </p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-11">
                <AccordionTrigger className="text-2xl font-semibold text-mtech-secondary">
                  11. Changes to Terms
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-gray-600">
                    We may modify these Terms at any time by posting the revised terms on this page. Your continued 
                    use of the Platform after such changes constitutes your acceptance of the new Terms.
                  </p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-12">
                <AccordionTrigger className="text-2xl font-semibold text-mtech-secondary">
                  12. Contact Us
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-gray-600 mb-4">
                    If you have any questions about these Terms, please contact us at:
                  </p>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700">
                      <strong>Email:</strong> info@mtech.co.zw<br />
                      <strong>Address:</strong> 15900 Sunningdale 2, Harare, Zimbabwe<br />
                      <strong>Phone:</strong> +263 787 778 679
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Terms;
