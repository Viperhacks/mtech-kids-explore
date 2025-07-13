import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useIsMobile } from '@/hooks/use-mobile';

const FAQ = () => {
  const isMobile = useIsMobile();

  return (
    <div className="container mx-auto px-3 py-4 bg-gradient-to-br from-[#E0F2FE] via-[#FEF9C3] to-[#FEE2E2]">
      <h1 className="text-xl md:text-2xl font-semibold mb-4 text-center text-mtech-secondary">
        FAQs
      </h1>

      <div className="max-w-2xl mx-auto">
        <Accordion type="single" collapsible className="w-full space-y-1">
          {[
            {
              value: 'item-1',
              question: 'How do I get started with MTECH Kids Explore?',
              answer:
                "Create an account, pick your grade, and dive into interactive, fun lessons right away.",
            },
            {
              value: 'item-2',
              question: 'What subjects does MTECH Kids Explore cover?',
              answer:
                'Core subjects like Maths, English, Science, and Social Studies. All aligned with national standards.',
            },
            {
              value: 'item-3',
              question: 'Is there a mobile app available?',
              answer:
                'Not yet, but the site works great on all devices. A mobile app is on the way!',
            },
            /*{
              value: 'item-4',
              question: "How do parents monitor their child's progress?",
              answer:
                'Link a parent account to the child profile. View reports, lessons done, scores, and more.',
            },*/
            {
              value: 'item-5',
              question: 'Are there offline learning options?',
              answer:
                'Some materials are downloadable. Look for the icon. Offline access is expanding soon.',
            },
            {
              value: 'item-6',
              question: 'How do I contact support if I have issues?',
              answer:
                'Hit the "Contacts" page. We’ve got email, live chat, and a help center with guides.',
            },
            {
              value: 'item-7',
              question: 'How does the badge system work?',
              answer:
                'Students earn badges for streaks, quizzes, and activities. Teachers earn them too for contributing.',
            },
            /*{
              value: 'item-8',
              question:
                'Can I track how much time my child spends on the platform?',
              answer:
                'Yup. Time, usage, accessed content, and subject progress — all logged and reportable.',
            },*/
          ].map(({ value, question, answer }) => (
            <AccordionItem key={value} value={value}>
              <AccordionTrigger
                className={`${isMobile ? 'text-sm' : 'text-base'} text-mtech-primary pr-2`}
              >
                {question}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed">
                {answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default FAQ;
