"use client";
import LanguageSwitcher from "@/components/i18n/LanguageSwitcher";
import T from "@/components/i18n/T";
import { useLanguage } from "@/components/i18n/LanguageProvider";


import Link from "next/link";
import { ChevronDown, LogIn, LogOut, LayoutDashboard } from "lucide-react";
import { NAV_LINKS } from "@/lib/constants";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function MobileMenu({ isOpen, onClose, pathname }) {
  const { t: translate } = useLanguage();
  const [expandedItem, setExpandedItem] = useState(null);
  const { user, signOut } = useAuth();

  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const fullName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split("@")[0];

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-charcoal-600/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Slide-out Panel */}
      <div
        inert={!isOpen}
        aria-hidden={!isOpen}
        className={`fixed top-0 end-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out lg:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full rtl:-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-beige-200">
            <span className="font-heading font-bold text-xl text-charcoal-600"><T>
              Menu
            </T></span>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-charcoal-400 hover:bg-beige-100 transition-colors"
              aria-label={translate("Close menu")}
            >
              ✕
            </button>
          </div>

          {/* User profile banner if logged in */}
          {user && (
            <div className="px-6 py-4 bg-beige-50 border-b border-beige-200">
              <p className="text-xs text-charcoal-300"><T>Signed in as</T></p>
              <p className="font-heading font-bold text-charcoal-600 text-base">{fullName}</p>
              <p className="text-xs text-charcoal-400 truncate">{user.email}</p>
              <Link
                href="/dashboard"
                onClick={onClose}
                className="mt-3 flex items-center justify-center gap-2 w-full px-4 py-2 bg-gradient-gold text-white text-xs font-semibold rounded-lg shadow-sm"
              >
                <LayoutDashboard size={14} /><T>
                Go to Dashboard
              </T></Link>
            </div>
          )}

          <div className="px-4 pt-3"><LanguageSwitcher /></div>
          {/* Links */}
          <div className="flex-1 overflow-y-auto py-4">
            {NAV_LINKS.map((link) => (
              <div key={link.label}>
                {link.children ? (
                  <>
                    <button
                      onClick={() =>
                        setExpandedItem(
                          expandedItem === link.label ? null : link.label
                        )
                      }
                      className={`w-full flex items-center justify-between px-6 py-3.5 text-start font-medium transition-colors ${
                        link.children.some((c) => isActive(c.href))
                          ? "text-gold"
                          : "text-charcoal-500 hover:text-charcoal-600 hover:bg-beige-50"
                      }`}
                    >
                      <T>{link.label}</T>
                      <ChevronDown
                        size={16}
                        className={`transition-transform ${
                          expandedItem === link.label ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {expandedItem === link.label && (
                      <div className="bg-beige-50 animate-slide-down">
                        {link.children.map((child) => (
                          <Link
                            key={child.label}
                            href={child.href}
                            onClick={onClose}
                            className={`block px-10 py-3 text-sm transition-colors ${
                              isActive(child.href)
                                ? "text-gold font-medium"
                                : "text-charcoal-400 hover:text-charcoal-600"
                            }`}
                          >
                            <T>{child.label}</T>
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={link.href}
                    onClick={onClose}
                    className={`block px-6 py-3.5 font-medium transition-colors ${
                      isActive(link.href)
                        ? "text-gold"
                        : "text-charcoal-500 hover:text-charcoal-600 hover:bg-beige-50"
                    }`}
                  >
                    <T>{link.label}</T>
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Bottom Action (Login / Logout) */}
          <div className="p-6 border-t border-beige-200">
            {user ? (
              <button
                onClick={() => {
                  onClose();
                  signOut();
                }}
                className="flex items-center justify-center gap-2 w-full px-5 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-all"
              >
                <LogOut size={18} /><T>
                Sign Out
              </T></button>
            ) : (
              <Link
                href="/login"
                onClick={onClose}
                className="flex items-center justify-center gap-2 w-full px-5 py-3 bg-gradient-gold text-white font-medium rounded-lg hover:shadow-lg transition-all"
              >
                <LogIn size={18} /><T>
                Sign In / Login
              </T></Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
