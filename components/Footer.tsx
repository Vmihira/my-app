'use client';

import Link from 'next/link';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa6';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { id: 1, name: 'Audio', href: '#audio' },
    { id: 2, name: 'Document', href: '#document' },
    { id: 3, name: 'PPT', href: '#ppt' },
  ];

  const socialLinks = [
    { id: 1, icon: FaFacebook, href: '#', label: 'Facebook' },
    { id: 2, icon: FaTwitter, href: '#', label: 'Twitter' },
    { id: 3, icon: FaInstagram, href: '#', label: 'Instagram' },
    { id: 4, icon: FaLinkedin, href: '#', label: 'LinkedIn' },
  ];

  return (
    <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Meteor AI
              </h2>
            </div>

            <nav className="mb-6 md:mb-0">
              <ul className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8">
                {footerLinks.map((link) => (
                  <li key={link.id}>
                    <Link href={link.href} legacyBehavior>
                      <a
                        className="text-gray-300 hover:text-white transition-colors duration-300 hover:underline"
                        aria-label={link.name}
                      >
                        {link.name}
                      </a>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <Link key={social.id} href={social.href} legacyBehavior>
                  <a
                    className="text-gray-400 hover:text-white transition-colors duration-300"
                    aria-label={social.label}
                  >
                    <social.icon className="h-6 w-6" />
                  </a>
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-700 text-center">
            <p className="text-gray-400 text-sm">
              © {currentYear} Meteor AI. All Rights Reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
