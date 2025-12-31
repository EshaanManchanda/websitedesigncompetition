import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Instagram, Youtube, MessageCircle } from 'lucide-react';

const Footer: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleSectionNav = (sectionId: string) => {
    if (location.pathname === '/') {
      // Already on home page, just scroll
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Navigate to home, then scroll
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  return (
    <footer className="bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Competition Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-yellow-300">Kids Web Design Competition</h3>
            <p className="text-sm text-gray-200">
              Empowering young minds to create amazing websites and digital experiences. Join us in celebrating creativity and innovation!
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/gemavarsity/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-yellow-300 transition-colors"
                aria-label="Visit our Facebook page"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://www.instagram.com/gemavarsity"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-yellow-300 transition-colors"
                aria-label="Follow us on Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://www.youtube.com/@gema7853"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-yellow-300 transition-colors"
                aria-label="Subscribe to our YouTube channel"
              >
                <Youtube size={20} />
              </a>
              <a
                href="https://api.whatsapp.com/send?phone=971527809450"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-yellow-300 transition-colors"
                aria-label="Contact us on WhatsApp"
              >
                <MessageCircle size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-yellow-300">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => handleSectionNav('categories')}
                  className="text-sm text-gray-200 hover:text-white transition-colors text-left"
                >
                  Competition Categories
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleSectionNav('structure')}
                  className="text-sm text-gray-200 hover:text-white transition-colors text-left"
                >
                  Competition Structure
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleSectionNav('judging')}
                  className="text-sm text-gray-200 hover:text-white transition-colors text-left"
                >
                  Judging Rubric
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleSectionNav('guidelines')}
                  className="text-sm text-gray-200 hover:text-white transition-colors text-left"
                >
                  Guidelines & Rules
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleSectionNav('submission')}
                  className="text-sm text-gray-200 hover:text-white transition-colors text-left"
                >
                  Submit Your Project
                </button>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-yellow-300">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/resources" className="text-sm text-gray-200 hover:text-white transition-colors">
                  Web Design Tutorials
                </Link>
              </li>
              <li>
                <a
                  href="https://www.w3schools.com/html/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-200 hover:text-white transition-colors"
                >
                  HTML & CSS Basics
                </a>
              </li>
              <li>
                <a
                  href="https://www.awwwards.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-200 hover:text-white transition-colors"
                >
                  Design Inspiration
                </a>
              </li>
              <li>
                <a
                  href="https://scratch.mit.edu/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-200 hover:text-white transition-colors"
                >
                  Coding Tools for Kids
                </a>
              </li>
              <li>
                <Link to="/faq" className="text-sm text-gray-200 hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-yellow-300">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail size={16} className="text-yellow-300" />
                <span className="text-sm text-gray-200">contact@websitedesigningcompetition.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={16} className="text-yellow-300" />
                <span className="text-sm text-gray-200">+971-527809450</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin size={16} className="text-yellow-300 mt-0.5" />
                <span className="text-sm text-gray-200">
                  48, Level 20, Burj Gate Tower<br />
                  Downtown Dubai, UAE
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-white/20">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-200">
              © 2026 Kids Web Design Competition. All rights reserved.
            </div>
            <div className="flex space-x-6">
              <button className="text-sm text-gray-200/50 cursor-not-allowed" aria-disabled="true" title="Coming soon">
                Privacy Policy
              </button>
              <button className="text-sm text-gray-200/50 cursor-not-allowed" aria-disabled="true" title="Coming soon">
                Terms of Service
              </button>
              <button className="text-sm text-gray-200/50 cursor-not-allowed" aria-disabled="true" title="Coming soon">
                Cookie Policy
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
