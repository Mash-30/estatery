import React from 'react'
import { Link } from 'react-router-dom'
import { Facebook, Instagram, Twitter, Linkedin } from 'lucide-react'
import EstateryLogo from './EstateryLogo'

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-400 shadow-2xl">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Column 1 - Logo and Sell/Buy Sections */}
          <div className="space-y-6 sm:space-y-8">
            {/* Logo */}
            <div>
              <EstateryLogo size="lg" />
            </div>
            
            {/* Sell A Home Section */}
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-silver-800 uppercase tracking-wide mb-3 sm:mb-4">
                SELL A HOME
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/sell" className="text-sm sm:text-base text-silver-600 hover:text-primary-600 transition-colors">
                    Request an offer
                  </Link>
                </li>
                <li>
                  <Link to="/pricing" className="text-sm sm:text-base text-silver-600 hover:text-primary-600 transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link to="/reviews" className="text-sm sm:text-base text-silver-600 hover:text-primary-600 transition-colors">
                    Reviews
                  </Link>
                </li>
                <li>
                  <Link to="/stories" className="text-sm sm:text-base text-silver-600 hover:text-primary-600 transition-colors">
                    Stories
                  </Link>
                </li>
              </ul>
            </div>

            {/* Buy A Home Section */}
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-silver-800 uppercase tracking-wide mb-3 sm:mb-4">
                BUY A HOME
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/properties" className="text-sm sm:text-base text-silver-600 hover:text-primary-600 transition-colors">
                    Buy
                  </Link>
                </li>
                <li>
                  <Link to="/finance" className="text-sm sm:text-base text-silver-600 hover:text-primary-600 transition-colors">
                    Finance
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Column 2 - Buy/Rent/Sell and Terms/Privacy */}
          <div className="space-y-6 sm:space-y-8">
            {/* Buy, Rent and Sell Section */}
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-silver-800 uppercase tracking-wide mb-3 sm:mb-4">
                BUY, RENT AND SELL
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/properties" className="text-sm sm:text-base text-silver-600 hover:text-primary-600 transition-colors">
                    Buy and sell properties
                  </Link>
                </li>
                <li>
                  <Link to="/rentals" className="text-sm sm:text-base text-silver-600 hover:text-primary-600 transition-colors">
                    Rent home
                  </Link>
                </li>
                <li>
                  <Link to="/builder" className="text-sm sm:text-base text-silver-600 hover:text-primary-600 transition-colors">
                    Builder trade-up
                  </Link>
                </li>
              </ul>
            </div>

            {/* Terms & Privacy Section */}
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-silver-800 uppercase tracking-wide mb-3 sm:mb-4">
                TERMS & PRIVACY
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/trust-safety" className="text-sm sm:text-base text-silver-600 hover:text-primary-600 transition-colors">
                    Trust & Safety
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="text-sm sm:text-base text-silver-600 hover:text-primary-600 transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="text-sm sm:text-base text-silver-600 hover:text-primary-600 transition-colors">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Column 3 - About and Resources */}
          <div className="space-y-6 sm:space-y-8">
            {/* About Section */}
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-silver-800 uppercase tracking-wide mb-3 sm:mb-4">
                ABOUT
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/company" className="text-sm sm:text-base text-silver-600 hover:text-primary-600 transition-colors">
                    Company
                  </Link>
                </li>
                <li>
                  <Link to="/how-it-works" className="text-sm sm:text-base text-silver-600 hover:text-primary-600 transition-colors">
                    How it works
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-sm sm:text-base text-silver-600 hover:text-primary-600 transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link to="/investors" className="text-sm sm:text-base text-silver-600 hover:text-primary-600 transition-colors">
                    Investors
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources Section */}
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-silver-800 uppercase tracking-wide mb-3 sm:mb-4">
                RESOURCES
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/blog" className="text-sm sm:text-base text-silver-600 hover:text-primary-600 transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link to="/guides" className="text-sm sm:text-base text-silver-600 hover:text-primary-600 transition-colors">
                    Guides
                  </Link>
                </li>
                <li>
                  <Link to="/faq" className="text-sm sm:text-base text-silver-600 hover:text-primary-600 transition-colors">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link to="/help" className="text-sm sm:text-base text-silver-600 hover:text-primary-600 transition-colors">
                    Help Center
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section - Copyright and Social Media */}
      <div className="border-t border-silver-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
            {/* Copyright */}
            <div className="text-silver-500 text-xs sm:text-sm">
              ©2024 Estatery. All rights reserved
            </div>

            {/* Social Media Icons */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-silver-500 hover:text-primary-600 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-silver-500 hover:text-primary-600 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-silver-500 hover:text-primary-600 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-silver-500 hover:text-primary-600 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
