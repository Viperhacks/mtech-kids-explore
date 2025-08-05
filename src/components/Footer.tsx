import React from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
} from "lucide-react";
import mtechAcademyLogo from "@/assets/mtech_logo.svg";
import blextaLogo from "@/assets/blexta_black_logo.png";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Facebook, url: "https://www.facebook.com/mtechkidsexplore" },
    { icon: Instagram, url: "https://www.instagram.com/mtechkidsexplore" },
    { icon: Twitter, url: "https://twitter.com/mtechkidsexplore" },
    { icon: Youtube, url: "https://youtube.com/@tadiwa-blessed" },
  ];

  return (
    <footer className="bg-gradient-to-br from-blue-900 to-mtech-primary text-white pt-12 pb-8">
      <div className="mtech-container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-mtech-accent drop-shadow-md">

              Mtech Academy
            </h3>
            <p
              className="text-white/80
 mb-4"
            >
              Making learning fun and accessible for primary school children
              with interactive educational content.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map(({ icon: Icon, url }, idx) => (
                <a
                  key={idx}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-white/10 rounded-full hover:bg-mtech-secondary transition"
                >
                  <Icon className="h-5 w-5 text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-mtech-accent drop-shadow-md">

              Quick Links
            </h3>
            <ul className="space-y-2">
              {[
                { label: "Home", to: "/" },
                { label: "Revision", to: "/revision" },
                { label: "Teachers", to: "/teachers" },
                { label: "Contact Us", to: "/contacts" },
                { label: "FAQ", to: "/faq" },
                { label: "Privacy Policy", to: "/privacy" },
              ].map((link, i) => (
                <li key={i}>
                  <Link
                    to={link.to}
                    className="text-white/80 hover:text-red-500 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div>
           <h3 className="text-xl font-bold mb-4 text-mtech-accent drop-shadow-md">

              Contact Us
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 text-white" />
                <span
                  className="text-white/80 hover:text-red-500 cursor-pointer
"
                >
                  3373 Nehanda Cop. Dzivarasekwa Extension.
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-white" />
                <span
                  className="text-white/80 hover:text-red-500 cursor-pointer
"
                >
                  +263 77 327 5834
                </span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-white" />
                <span
                  className="text-white/80 hover:text-red-500 cursor-pointer
"
                >
                  info@mtech.co.zw
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400 text-center md:text-left">
            <p>© 2017–{currentYear} Mtech Academy. All rights reserved.</p>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span>Powered by</span>
                <div className="rounded-md p-1">
                  <img
                    src={mtechAcademyLogo}
                    alt="Mtech Logo"
                    className="h-10"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span>Developed by</span>
                <a
                  href="https://tadiwa-blessed.tech"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md p-2 hover:shadow-md transition"
                >
                  <img src={blextaLogo} alt="Blexta Logo" className="h-10" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Developed by Blexta Technologies
        website: www.tadiwa-blessed.tech
        */}
    </footer>
  );
};

export default Footer;
