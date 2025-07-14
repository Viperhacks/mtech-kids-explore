import React from 'react';
import { Separator } from '@/components/ui/separator';

const privacyData = {
  lastUpdated: 'June 29, 2025',
  sections: [
    {
      title: 'Introduction',
      content: `Mtech Academy ("we", "our", or "us") is committed to protecting the privacy of children and all users of our educational platform. This Privacy Policy explains how we collect, use, and share information about you when you use our website, mobile applications, and other online products and services (collectively, the "Services").`,
    },
    {
      title: 'Information We Collect',
      content: `We collect information you provide directly to us when you:`,
      bullets: [
        'Create an account and register as a student or teacher',
        'Complete your profile information and preferences',
        'Participate in learning activities, quizzes, and exercises',
        'Communicate with us through the platform',
        'Submit content or feedback about our Services',
      ],
    },
    {
      title: 'How We Use Information',
      content: `We use the information we collect to:`,
      bullets: [
        'Provide, maintain, and improve our educational Services',
        'Track and personalize your learning experience',
        'Process and fulfill your requests for specific content',
        'Generate progress reports for students and teachers',
        'Communicate with you about your account and our Services',
        'Monitor and analyze trends, usage, and activities in connection with our Services',
        'Comply with applicable laws, legal processes, and regulations',
      ],
    },
    {
      title: `Children's Privacy`,
      content: `We comply with the Children's Online Privacy Protection Act (COPPA). We require parental consent before collecting personal information from children under 13, and we limit the information collected to what is reasonably necessary for participation in our educational activities. Parents can review, edit, or request deletion of their child's information at any time through their parent account.`,
    },
    {
      title: 'Contact Us',
      content: `If you have any questions about this Privacy Policy or our privacy practices, please contact us at info@mtechacademy.co.zw or through our Contact page.`,
    },
  ],
};

const Privacy = () => {
  return (
    <div className="container mx-auto px-4 py-8 bg-gradient-to-br from-white via-[#f0f9ff] to-mtech-primary/5">
      <h1 className="text-3xl font-bold mb-6 text-center text-mtech-dark">
        Privacy Policy
      </h1>

      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-sm">
        <p className="text-sm text-mtech-accent mb-4">
          Last Updated: {privacyData.lastUpdated}
        </p>

        {privacyData.sections.map((section, index) => (
          <div key={index}>
            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3 text-mtech-primary">{section.title}</h2>
              <p className="text-gray-700 mb-3">{section.content}</p>
              {section.bullets && (
                <ul className="list-disc pl-5 text-gray-700 space-y-1">
                  {section.bullets.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              )}
            </section>
            {index !== privacyData.sections.length - 1 && (
              <Separator className="my-4" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Privacy;
