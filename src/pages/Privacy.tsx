import React from 'react';
import { format } from 'date-fns';
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

const Privacy = () => {
  const navigate = useNavigate();
  const currentDate = format(new Date(), "MMMM d, yyyy");
  
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
            <h1 className="text-3xl font-bold text-mtech-primary">Privacy Policy</h1>
          </div>
          
          <p className="text-gray-600 mb-8">
            Last updated: {currentDate}
          </p>
          <Separator className="my-6" />
          
          {/* Rest of the Privacy Policy content with accordions */}
          <div className="space-y-6">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-2xl font-semibold text-mtech-secondary">
                  1. Information We Collect
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-gray-600 mb-4">
                    We collect several types of information from and about users of our Platform, including:
                  </p>
                  <ul className="list-disc list-inside pl-4 text-gray-600 space-y-2">
                    <li>Personal information such as name, email address, and in some cases, age or grade level.</li>
                    <li>Educational information such as performance data, progress in educational activities, and assessment results.</li>
                    <li>Usage information including how you interact with our Platform, features you use, and time spent on various activities.</li>
                    <li>Device information such as IP address, browser type, operating system, and device identifiers.</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-2xl font-semibold text-mtech-secondary">
                  2. How We Use Your Information
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-gray-600 mb-4">
                    We use the information we collect for various purposes, including:
                  </p>
                  <ul className="list-disc list-inside pl-4 text-gray-600 space-y-2">
                    <li>To provide and improve our educational services</li>
                    <li>To personalize learning experiences based on skill level and progress</li>
                    <li>To communicate with you about your account or our services</li>
                    <li>To monitor and analyze usage patterns and trends</li>
                    <li>To maintain the security and integrity of our Platform</li>
                    <li>To comply with legal obligations</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-3">
                <AccordionTrigger className="text-2xl font-semibold text-mtech-secondary">
                  3. Children's Privacy
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-gray-600 mb-4">
                    We are committed to protecting the privacy of children under 13 years of age. For users under 13:
                  </p>
                  <ul className="list-disc list-inside pl-4 text-gray-600 space-y-2">
                    <li>We require verifiable parental consent before collecting personal information</li>
                    <li>Parents can review, update, or request deletion of their child's personal information</li>
                    <li>We collect only the information necessary to provide our educational services</li>
                    <li>We do not share personal information with third parties except as necessary to provide our services</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              
              {/* Add more sections as needed */}
              <AccordionItem value="item-4">
                <AccordionTrigger className="text-2xl font-semibold text-mtech-secondary">
                  4. Sharing Your Information
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-gray-600">
                    We may share your personal information with the following parties:
                    <ul className="list-disc list-inside pl-4 text-gray-600 mt-2 space-y-2">
                      <li>Teachers and school administrators if you are using our Platform through a school program</li>
                      <li>Service providers who perform services on our behalf</li>
                      <li>Legal authorities when required by law or to protect our rights</li>
                      <li>Parents or guardians of children under 13</li>
                    </ul>
                    We do not sell personal information to third parties.
                  </p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-5">
                <AccordionTrigger className="text-2xl font-semibold text-mtech-secondary">
                  5. Contact Information
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-gray-600 mb-4">
                    If you have any questions about this Privacy Policy, please contact us at:
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

export default Privacy;
