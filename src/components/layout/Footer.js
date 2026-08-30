import Link from "next/link";
import {
  Mail,
  MapPin,
  Phone,
  Heart,
} from "lucide-react";
import { FacebookIcon, InstagramIcon, YoutubeIcon, WhatsAppIcon } from "@/components/ui/SocialIcons";
import { SITE_NAME, SITE_TAGLINE, NAV_LINKS, SOCIAL_LINKS } from "@/lib/constants";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-charcoal-600 text-white islamic-pattern">
      {/* Main Footer */}
      <div className="section-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-gold flex items-center justify-center">
                <span className="text-white font-heading font-bold text-lg">T</span>
              </div>
              <span className="font-heading font-bold text-xl">{SITE_NAME}</span>
            </div>
            <p className="text-charcoal-200 text-sm leading-relaxed mb-6">
              {SITE_TAGLINE}. Connecting Muslim communities in Pakistan and Canada
              through education, worship, and service.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3">
              <a
                href={SOCIAL_LINKS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold transition-colors"
                aria-label="Facebook"
              >
                <FacebookIcon size={16} />
              </a>
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold transition-colors"
                aria-label="Instagram"
              >
                <InstagramIcon size={16} />
              </a>
              <a
                href={SOCIAL_LINKS.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold transition-colors"
                aria-label="YouTube"
              >
                <YoutubeIcon size={16} />
              </a>
              <a
                href={SOCIAL_LINKS.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold transition-colors"
                aria-label="WhatsApp"
              >
                <WhatsAppIcon size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-5 text-beige-300">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {NAV_LINKS.filter((l) => !l.children).map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-charcoal-200 hover:text-gold text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Communities */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-5 text-beige-300">
              Our Communities
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/pakistan"
                  className="text-charcoal-200 hover:text-gold text-sm transition-colors"
                >
                  Pakistan Community
                </Link>
              </li>
              <li>
                <Link
                  href="/canada"
                  className="text-charcoal-200 hover:text-gold text-sm transition-colors"
                >
                  Canada Community
                </Link>
              </li>
              <li>
                <Link
                  href="/programs"
                  className="text-charcoal-200 hover:text-gold text-sm transition-colors"
                >
                  Programs & Services
                </Link>
              </li>
              <li>
                <Link
                  href="/resources"
                  className="text-charcoal-200 hover:text-gold text-sm transition-colors"
                >
                  Resources & Learning
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-5 text-beige-300">
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-gold mt-0.5 shrink-0" />
                <span className="text-charcoal-200 text-sm">
                  Lahore, Pakistan & Toronto, Canada
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={16} className="text-gold mt-0.5 shrink-0" />
                <a
                  href="mailto:info@taseescircle.org"
                  className="text-charcoal-200 hover:text-gold text-sm transition-colors"
                >
                  info@taseescircle.org
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone size={16} className="text-gold mt-0.5 shrink-0" />
                <span className="text-charcoal-200 text-sm">
                  +92 42 3571 0000
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="section-container py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-charcoal-200 text-sm">
            © {currentYear} {SITE_NAME}. All rights reserved.
          </p>
          <p className="text-charcoal-200 text-sm flex items-center gap-1">
            Made with <Heart size={14} className="text-gold fill-gold" /> for the
            Ummah
          </p>
        </div>
      </div>
    </footer>
  );
}
