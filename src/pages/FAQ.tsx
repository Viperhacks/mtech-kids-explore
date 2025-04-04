
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

const FAQ = () => {
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
            <h1 className="text-3xl font-bold text-mtech-primary">Frequently Asked Questions</h1>
          </div>
          
          <Separator className="my-6" />
          
          <div className="space-y-6">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-xl font-semibold text-mtech-secondary">
                  What age groups does MTECH Kids Explore cater to?
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-gray-600">
                    MTECH Kids Explore is designed for primary school children, typically between the ages of 5-12 years.
                    Our content is carefully tailored to match appropriate educational levels for different age groups
                    within this range.
                  </p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-xl font-semibold text-mtech-secondary">
                  How does the subscription model work?
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-gray-600">
                    We offer monthly and annual subscription plans. The subscription gives full access to all content
                    within your child's grade level. Parents can manage subscriptions through their account dashboard,
                    and we send reminders before any renewal. You can cancel your subscription at any time.
                  </p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-3">
                <AccordionTrigger className="text-xl font-semibold text-mtech-secondary">
                  Is the curriculum aligned with national education standards?
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-gray-600">
                    Yes, all of our educational content is designed to align with Zimbabwe's national curriculum
                    requirements. Our team works with qualified educators to ensure our material meets or exceeds
                    established educational standards while providing an engaging learning experience.
                  </p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-4">
                <AccordionTrigger className="text-xl font-semibold text-mtech-secondary">
                  How can I track my child's progress?
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-gray-600">
                    Parents have access to a comprehensive dashboard that shows their child's activity, completed
                    lessons, quiz results, time spent learning, and areas of strength or improvement. You can also
                    receive weekly email reports summarizing your child's progress.
                  </p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-5">
                <AccordionTrigger className="text-xl font-semibold text-mtech-secondary">
                  Can multiple children use the same account?
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-gray-600">
                    Each child should have their own profile under the family account. Our family plans allow parents
                    to create separate profiles for up to 4 children, each with personalized learning paths and progress
                    tracking. This ensures that each child receives content appropriate for their age and learning stage.
                  </p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-6">
                <AccordionTrigger className="text-xl font-semibold text-mtech-secondary">
                  Is my child's data secure?
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-gray-600">
                    We take data security very seriously. All personal information is encrypted and stored securely.
                    We comply with children's online privacy laws and never share children's personal information with
                    third parties without explicit parental consent. For more details, please see our Privacy Policy.
                  </p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-7">
                <AccordionTrigger className="text-xl font-semibold text-mtech-secondary">
                  How do I get technical support?
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-gray-600">
                    Technical support is available through multiple channels. You can email us at support@mtech.co.zw,
                    use the live chat feature on our website during business hours, or call our support line at
                    +263 787 778 679. Our support team is available Monday through Friday, 8am to 6pm.
                  </p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-8">
                <AccordionTrigger className="text-xl font-semibold text-mtech-secondary">
                  Can teachers use MTECH Kids Explore in the classroom?
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-gray-600">
                    Yes, we offer special school licenses for classroom use. Teachers can create a classroom,
                    invite students, assign specific activities, and monitor the entire class's progress.
                    We also provide teaching resources, lesson plans, and printable worksheets to complement 
                    the digital content.
                  </p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-9">
                <AccordionTrigger className="text-xl font-semibold text-mtech-secondary">
                  Does the platform work on all devices?
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-gray-600">
                    MTECH Kids Explore works on most modern devices including computers, tablets, and smartphones.
                    We have web-based access as well as dedicated apps for iOS and Android. The platform is 
                    responsive and adapts to different screen sizes for an optimal learning experience.
                  </p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-10">
                <AccordionTrigger className="text-xl font-semibold text-mtech-secondary">
                  Do you offer content in multiple languages?
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-gray-600">
                    Currently, our primary content is available in English, with selected modules available in 
                    Shona and Ndebele. We are working to expand our language offerings to make our platform more inclusive.
                  </p>
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

export default FAQ;
