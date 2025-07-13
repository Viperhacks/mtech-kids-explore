import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const contactItems = [
  {
    title: 'Email',
    icon: Mail,
    bg: 'bg-mtech-primary/10',
    color: 'text-mtech-primary',
    content: [
      'support@mtechacademy.co.zw',
      'info@mtechacademy.co.zw',
    ],
  },
  {
    title: 'Phone',
    icon: Phone,
    bg: 'bg-mtech-secondary/10',
    color: 'text-mtech-secondary',
    content: [
      '+263 77 327 5834',
    ],
  },
  {
    title: 'Location',
    icon: MapPin,
    bg: 'bg-mtech-accent/10',
    color: 'text-mtech-accent',
    content: [
      'Mtech Academy',
      '3373 Nehanda Cop. Dzivarasekwa Extension',
    ],
  },
  {
    title: 'Business Hours',
    icon: Clock,
    bg: 'bg-mtech-warning/10',
    color: 'text-mtech-warning',
    content: [
      'Mon - Fri: 8:00 AM - 6:00 PM',
      'Saturday: 9:00 AM - 1:00 PM',
      'Sunday: Closed',
    ],
  },
];

const Contacts = () => {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: 'Message Sent',
      description: "We've received your message and will get back to you soon!",
    });
  };

  return (
    <div className="container mx-auto px-4 py-12 bg-gradient-to-br from-white via-[#f0f9ff] to-mtech-primary/5">

      <h1 className="text-3xl font-bold mb-8 text-center text-mtech-dark">
Contact Us</h1>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contact Form */}
        <div>
          <Card className="shadow-lg rounded-xl border border-mtech-primary/10">

            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="name"className="block text-sm font-semibold text-mtech-dark">Full Name</label>
                    <Input id="name" placeholder="Enter your full name" required />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-semibold text-mtech-dark">Email Address</label>
                    <Input id="email" type="email" placeholder="Enter your email" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="subject" className="block text-sm font-semibold text-mtech-dark">Subject</label>
                  <Input id="subject" placeholder="What is this regarding?" required />
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="block text-sm font-semibold text-mtech-dark">Message</label>
                  <Textarea
                    id="message"
                    placeholder="Type your message here..."
                    rows={5}
                    required
                  />
                </div>

               <Button type="submit" className="w-full bg-mtech-secondary hover:bg-mtech-primary text-white">
Send Message</Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Contact Info */}
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Have questions or need assistance? Our support team is here to help.
            </p>
          </div>

         <div className="text-sm divide-y divide-gray-200 rounded-lg overflow-hidden border border-gray-100 bg-white">
  {contactItems.map(({ title, icon: Icon, bg, color, content }, index) => (
    <div key={index} className="flex items-start space-x-4 p-4">

                <div className={`${bg} p-3 rounded-full`}>
                  <Icon className={`h-5 w-5 ${color}`} />
                </div>
                <div>
                 <h3 className="text-base font-semibold text-mtech-dark mb-1">{title}</h3>

                  {content.map((line, i) => (
                    <p key={i} className="text-sm text-mtech-dark/80">{line}</p>
                  ))}
                </div>
                
              </div>
            ))}
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contacts;
