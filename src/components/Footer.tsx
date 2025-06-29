import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import mtechAcademyLogo from "@/assets/mtech_logo.svg"

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Facebook, url: 'https://www.facebook.com/mtechkidsexplore' },
    { icon: Instagram, url: 'https://www.instagram.com/mtechkidsexplore' },
    { icon: Twitter, url: 'https://twitter.com/mtechkidsexplore' },
    { icon: Youtube, url: 'https://youtube.com/@tadiwa-blessed' },
  ];

  return (
    <footer className="bg-mtech-dark text-white pt-12 pb-6">
      <div className="mtech-container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-bold mb-4">MTECH Kids Explore</h3>
            <p className="text-gray-300 mb-4">
              Making learning fun and accessible for primary school children with interactive educational content.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map(({ icon: Icon, url }, idx) => (
                <a
                  key={idx}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 hover:text-white">Home</Link></li>
              <li><Link to="/revision" className="text-gray-300 hover:text-white">Revision</Link></li>
              <li><Link to="/teachers" className="text-gray-300 hover:text-white">Teachers</Link></li>
              <li><Link to="/contacts" className="text-gray-300 hover:text-white">Contact Us</Link></li>
              <li><Link to="/faq" className="text-gray-300 hover:text-white">FAQ</Link></li>
              <li><Link to="/privacy" className="text-gray-300 hover:text-white">Privacy Policy</Link></li>
             
            </ul>
          </div>

          {/* Resources */}
          <div >
            <h3 className="text-xl font-bold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><Link to="/tutorials" className="text-gray-300 hover:text-white">Video Tutorials</Link></li>
              <li><Link to="/exercises" className="text-gray-300 hover:text-white">Practice Exercises</Link></li>
              <li><Link to="/quizzes" className="text-gray-300 hover:text-white">Interactive Quizzes</Link></li>
              <li><Link to="/subjects" className="text-gray-300 hover:text-white">Subject Materials</Link></li>
              
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 text-mtech-primary" />
                <span className="text-gray-300">3373 Nehanda Cop.
Dzivarasekwa Extension.</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-mtech-primary" />
                <span className="text-gray-300">+263 77 327 5834</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-mtech-primary" />
                <span className="text-gray-300">info@mtech.co.zw</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-700 text-center">
          <p className="text-sm text-gray-400">
            © 2017-{currentYear} MTECH Kids Explore. All rights reserved.
          </p>
          <div
          className='mt-2 flex justify-center items-center gap-2'>
            <span className="text-sm text-gray-400">Powered by</span>
          <div className="bg-white rounded-md p-3"><img src={mtechAcademyLogo} alt="Mtech Academy Logo" 
          className='h-16'/></div>
          </div>
        </div>
      </div>
      {
        /* Developed by Blexta Technologies
        website: www.tadiwa-blessed.tech
        */
      }
    </footer>
  );
};

export default Footer;
