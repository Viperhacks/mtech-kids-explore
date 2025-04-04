
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
import DefaultLoginInfo from '@/components/DefaultLoginInfo';

const FAQ = () => {
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
            <h1 className="text-3xl font-bold text-mtech-primary">Frequently Asked Questions</h1>
          </div>
          
          <p className="text-gray-600 mb-8">
            Last updated: {currentDate}
          </p>
          <Separator className="my-6" />
          
          <div className="space-y-6">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-xl font-semibold text-mtech-secondary">
                  What is MTECH Kids Explore?
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-gray-600">
                    MTECH Kids Explore is an educational platform designed to help children learn various subjects 
                    through interactive lessons, exercises, and educational games. Our platform covers subjects from 
                    mathematics and science to language arts and social studies, tailored for different grade levels.
                  </p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-xl font-semibold text-mtech-secondary">
                  How do I create an account?
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-gray-600">
                    Creating an account is simple. Click on the "Sign In" button in the navigation bar, then select 
                    "Register". Fill in the required information including your name, email, password, and role 
                    (student, teacher, or parent). Once registered, you'll have immediate access to our platform.
                  </p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-3">
                <AccordionTrigger className="text-xl font-semibold text-mtech-secondary">
                  Is the platform free to use?
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-gray-600">
                    We offer both free and premium content. The basic access is free and includes a wide range of 
                    educational resources. Premium access provides additional features such as personalized learning 
                    paths, advanced progress tracking, and exclusive content. Information about our subscription plans 
                    can be found on our website.
                  </p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-4">
                <AccordionTrigger className="text-xl font-semibold text-mtech-secondary">
                  How do I reset my password?
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-gray-600">
                    If you've forgotten your password, click on the "Sign In" button, then select "Forgot Password?" 
                    link. Enter your email address, and we'll send you a verification code. Once you enter this code, 
                    you'll be able to create a new password for your account.
                  </p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-5">
                <AccordionTrigger className="text-xl font-semibold text-mtech-secondary">
                  Can teachers track student progress?
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-gray-600">
                    Yes, teachers have access to a dashboard where they can monitor their students' progress, identify 
                    areas where students might need additional help, and assign specific lessons or exercises. This 
                    feature helps teachers provide targeted support to individual students.
                  </p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-6">
                <AccordionTrigger className="text-xl font-semibold text-mtech-secondary">
                  How is content organized on the platform?
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-gray-600">
                    Content is organized by grade level and subject. Each subject is further divided into topics and 
                    lessons. This structure makes it easy for students, parents, and teachers to find relevant content 
                    based on educational needs and curriculum requirements.
                  </p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-7">
                <AccordionTrigger className="text-xl font-semibold text-mtech-secondary">
                  How can I contact support?
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-gray-600 mb-4">
                    If you have any questions or need assistance, you can reach our support team through:
                  </p>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700">
                      <strong>Email:</strong> info@mtech.co.zw<br />
                      <strong>Address:</strong> 15900 Sunningdale 2, Harare, Zimbabwe<br />
                      <strong>Phone:</strong> +263 787 778 679
                    </p>
                  </div>
                  <p className="text-gray-600 mt-4">
                    We strive to respond to all inquiries within 24-48 hours during business days.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          
          <DefaultLoginInfo />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default FAQ;
