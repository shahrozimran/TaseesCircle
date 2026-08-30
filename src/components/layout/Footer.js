import Link from "next/link";
import {
  Mail,
  Globe,
  Heart,
} from "lucide-react";
import { FacebookIcon, InstagramIcon, YoutubeIcon, WhatsAppIcon } from "@/components/ui/SocialIcons";
import { SITE_NAME, SITE_TAGLINE, NAV_LINKS, SOCIAL_LINKS } from "@/lib/constants";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-charcoal-600 text-white islamic-pattern border-t border-white/10">
      {/* Main Footer */}
      <div className="section-container py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12">
          {/* Brand Column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-gold flex items-center justify-center shrink-0">
                <span className="text-white font-heading font-bold text-lg">T</span>
              </div>
              <span className="font-heading font-bold text-xl">{SITE_NAME}</span>
            </div>
            <p className="text-charcoal-200 text-sm leading-relaxed mb-6 max-w-sm">
              {SITE_TAGLINE}. A digital Islamic platform connecting Muslim communities in Pakistan and Canada through online knowledge, discussions, and authentic Islamic guidance.
            </p>
            {/* Social Icons with Touch Friendly Targets */}
            <div className="flex items-center gap-3">
              <a
                href={SOCIAL_LINKS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold transition-colors"
                aria-label="Facebook"
              >
                <FacebookIcon size={18} />
              </a>
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold transition-colors"
                aria-label="Instagram"
              >
                <InstagramIcon size={18} />
              </a>
              <a
                href={SOCIAL_LINKS.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold transition-colors"
                aria-label="YouTube"
              >
                <YoutubeIcon size={18} />
              </a>
              <a
                href={SOCIAL_LINKS.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold transition-colors"
                aria-label="WhatsApp"
              >
                <WhatsAppIcon size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-bold text-base sm:text-lg mb-4 sm:mb-5 text-beige-300">
              Quick Links
            </h4>
            <ul className="space-y-2.5 sm:space-y-3">
              {NAV_LINKS.filter((l) => !l.children).map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-charcoal-200 hover:text-gold text-sm transition-colors block py-0.5"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Communities */}
          <div>
            <h4 className="font-heading font-bold text-base sm:text-lg mb-4 sm:mb-5 text-beige-300">
              Our Communities
            </h4>
            <ul className="space-y-2.5 sm:space-y-3">
              <li>
                <Link
                  href="/pakistan"
                  className="text-charcoal-200 hover:text-gold text-sm transition-colors block py-0.5"
                >
                  Pakistan Community
                </Link>
              </li>
              <li>
                <Link
                  href="/canada"
                  className="text-charcoal-200 hover:text-gold text-sm transition-colors block py-0.5"
                >
                  Canada Community
                </Link>
              </li>
              <li>
                <Link
                  href="/programs"
                  className="text-charcoal-200 hover:text-gold text-sm transition-colors block py-0.5"
                >
                  Programs & Services
                </Link>
              </li>
              <li>
                <Link
                  href="/resources"
                  className="text-charcoal-200 hover:text-gold text-sm transition-colors block py-0.5"
                >
                  Resources & Learning
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-heading font-bold text-base sm:text-lg mb-4 sm:mb-5 text-beige-300">
              Contact Us
            </h4>
            <ul className="space-y-3.5">
              <li className="flex items-start gap-3">
                <Globe size={16} className="text-gold mt-0.5 shrink-0" />
                <span className="text-charcoal-200 text-sm leading-snug">
                  Digital Community — Pakistan &amp; Canada
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={16} className="text-gold mt-0.5 shrink-0" />
                <a
                  href="mailto:info@taseescircle.org"
                  className="text-charcoal-200 hover:text-gold text-sm transition-colors break-all"
                >
                  info@taseescircle.org
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="section-container py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p className="text-charcoal-200 text-xs sm:text-sm">
            © {currentYear} {SITE_NAME}. All rights reserved.
          </p>
          <p className="text-charcoal-200 text-xs sm:text-sm flex items-center justify-center gap-1">
            Made with <Heart size={14} className="text-gold fill-gold shrink-0" /> for the
            Ummah
          </p>
        </div>
      </div>
    </footer>
  );
}
