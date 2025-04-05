
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useIsMobile } from '@/hooks/use-mobile';

const FAQ = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-center">Frequently Asked Questions</h1>
      
      <div className="max-w-3xl mx-auto">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger className={isMobile ? "text-sm pr-2" : ""}>
              How do I get started with MTECH Kids Explore?
            </AccordionTrigger>
            <AccordionContent>
              Simply create an account, select your grade level, and you'll have immediate access to all learning materials designed for your grade. Our interactive platform makes learning fun and engaging!
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-2">
            <AccordionTrigger className={isMobile ? "text-sm pr-2" : ""}>
              What subjects does MTECH Kids Explore cover?
            </AccordionTrigger>
            <AccordionContent>
              We cover all core subjects including Mathematics, English, Science, Social Studies, and more. Our curriculum is aligned with national educational standards to ensure comprehensive learning.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-3">
            <AccordionTrigger className={isMobile ? "text-sm pr-2" : ""}>
              Is there a mobile app available?
            </AccordionTrigger>
            <AccordionContent>
              Currently, MTECH Kids Explore is accessible through web browsers on any device. Our responsive design ensures a great experience on smartphones and tablets. A dedicated mobile app is in development and coming soon!
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-4">
            <AccordionTrigger className={isMobile ? "text-sm pr-2" : ""}>
              How do parents monitor their child's progress?
            </AccordionTrigger>
            <AccordionContent>
              Parents can create a parent account and link it to their child's account. This provides access to detailed progress reports, completed lessons, quiz scores, and activity logs to help track learning achievements.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-5">
            <AccordionTrigger className={isMobile ? "text-sm pr-2" : ""}>
              Are there offline learning options?
            </AccordionTrigger>
            <AccordionContent>
              Some of our materials can be downloaded for offline use. Look for the download icon on eligible resources. We're continually expanding our offline capabilities to support learning in all environments.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-6">
            <AccordionTrigger className={isMobile ? "text-sm pr-2" : ""}>
              How do I contact support if I have issues?
            </AccordionTrigger>
            <AccordionContent>
              You can reach our support team through the "Contacts" page on our website. We offer email support, live chat during business hours, and a comprehensive help center with tutorials and guides.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-7">
            <AccordionTrigger className={isMobile ? "text-sm pr-2" : ""}>
              How does the badge system work?
            </AccordionTrigger>
            <AccordionContent>
              Our badge system automatically rewards students for their achievements and progress. Badges are earned for activities like login streaks, quiz completion, watching educational videos, and more. Teachers earn badges for creating content and helping students. Check your profile to see your earned badges!
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-8">
            <AccordionTrigger className={isMobile ? "text-sm pr-2" : ""}>
              Can I track how much time my child spends on the platform?
            </AccordionTrigger>
            <AccordionContent>
              Yes, our platform automatically tracks learning time and activities. Parents can view detailed reports showing when and how long their child used the platform, what resources they accessed, and their progress in different subjects.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default FAQ;
