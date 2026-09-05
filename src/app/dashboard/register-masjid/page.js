"use client";
import T from "@/components/i18n/T";
import { useLanguage } from "@/components/i18n/LanguageProvider";


import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  Building2,
  MapPin,
  Globe,
  FileText,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";

const COUNTRIES = [
  "Pakistan",
  "Canada",
  "United States",
  "United Kingdom",
  "United Arab Emirates",
  "Saudi Arabia",
  "Other",
];

const steps = [
  { label: "Masjid Details", icon: Building2 },
  { label: "Additional Info", icon: FileText },
  { label: "Confirmation", icon: CheckCircle },
];

export default function RegisterMasjidPage() {
  const { t: translate } = useLanguage();
  const { user, profile } = useAuth();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    name: "",
    zip_code: "",
    area: "",
    city: "",
    country: "Pakistan",
    description: "",
  });

  // Check if user already has a circle
  useEffect(() => {
    if (profile?.current_masjid_id) {
      router.push("/dashboard/my-circle");
      return;
    }

    // Guard against duplicate pending/approved registrations (M-01)
    if (user?.id) {
      const supabase = createClient();
      if (!supabase) return;
      supabase
        .from("masjids")
        .select("id, name, status")
        .eq("created_by", user.id)
        .in("status", ["pending", "approved"])
        .maybeSingle()
        .then(({ data }) => {
          if (data) {
            // Already has an active registration — redirect to dashboard
            router.push(
              `/dashboard?notice=You already have a ${data.status} Masjid registration for "${data.name}". Please wait for approval.`
            );
          }
        });
    }
  }, [profile, user, router]);


  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const validateStep1 = () => {
    if (!formData.name.trim()) return "Please enter the Masjid name.";
    if (!formData.zip_code.trim()) return "Please enter the zip/postal code.";
    if (!formData.area.trim()) return "Please enter the area/locality.";
    if (!formData.city.trim()) return "Please enter the city.";
    if (!formData.country) return "Please select a country.";
    return null;
  };

  const handleNext = () => {
    if (currentStep === 0) {
      const validationError = validateStep1();
      if (validationError) {
        setError(validationError);
        return;
      }
    }
    setError("");
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handleBack = () => {
    setError("");
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");

    try {
      const supabase = createClient();
      if (!supabase) {
        setError("Service not available. Please try again.");
        return;
      }

      // Check for duplicate masjid
      const { data: existing } = await supabase
        .from("masjids")
        .select("id, name")
        .eq("zip_code", formData.zip_code.trim())
        .eq("area", formData.area.trim().toLowerCase())
        .eq("city", formData.city.trim().toLowerCase())
        .eq("country", formData.country)
        .maybeSingle();

      if (existing) {
        setError(
          `A circle for this masjid already exists ("${existing.name}"). Please contact Ta'sees Circle at info@taseescircle.com for more information.`
        );
        setCurrentStep(0);
        return;
      }

      // Check if user already in a circle
      const { data: existingMember } = await supabase
        .from("masjid_members")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (existingMember) {
        setError("You are already part of a circle. You must leave your current circle before creating a new one.");
        return;
      }

      // Create the masjid (status: pending)
      const { data: masjid, error: createError } = await supabase
        .from("masjids")
        .insert({
          name: formData.name.trim(),
          zip_code: formData.zip_code.trim(),
          area: formData.area.trim().toLowerCase(),
          city: formData.city.trim().toLowerCase(),
          country: formData.country,
          description: formData.description.trim() || null,
          created_by: user.id,
          status: "pending",
        })
        .select()
        .single();

      if (createError) {
        if (createError.code === "23505") {
          setError("A circle for this location already exists. Please contact Ta'sees Circle for more information.");
          setCurrentStep(0);
        } else {
          setError(createError.message);
        }
        return;
      }

      setSubmitted(true);
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error("Registration error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl border border-beige-200 p-8 sm:p-12 text-center"
        >
          <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-5">
            <CheckCircle size={32} className="text-amber-600" />
          </div>
          <h2 className="font-heading font-bold text-charcoal-600 text-xl sm:text-2xl mb-3"><T>
            Registration Submitted!
          </T></h2>
          <p className="text-sm text-charcoal-300 leading-relaxed mb-6 max-w-md mx-auto"><T message="Your Masjid {name} has been submitted for approval. The Ta'sees Circle team will review your registration and notify you via email and dashboard." values={{ name: <bdi className="font-semibold">{formData.name}</bdi> }} /></p>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
            <p className="text-xs text-amber-700 font-medium"><T>
              ⏳ Approval usually takes 24-48 hours. You&apos;ll receive a notification once your Masjid is approved and your circle is created.
            </T></p>
          </div>
          <button
            onClick={() => router.push("/dashboard")}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-gold text-white font-medium rounded-xl hover:shadow-lg transition-all text-sm"
          ><T>
            Back to Dashboard
            </T><ArrowRight size={16} />
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-xl sm:text-2xl font-heading font-bold text-charcoal-600"><T>
          Register Your Masjid
        </T></h1>
        <p className="text-sm text-charcoal-300 mt-1"><T>
          Create a circle for your Masjid community. All fields marked with * are required.
        </T></p>
      </motion.div>

      {/* Step Indicator */}
      <div className="flex items-center gap-2 mb-8">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center gap-2 flex-1">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                index === currentStep
                  ? "bg-gradient-gold text-white shadow-md"
                  : index < currentStep
                  ? "bg-islamic-green text-white"
                  : "bg-beige-200 text-charcoal-300"
              }`}
            >
              <T>{index < currentStep ? "✓" : index + 1}</T>
            </div>
            <span
              className={`text-xs font-medium hidden sm:block ${
                index === currentStep ? "text-charcoal-600" : "text-charcoal-300"
              }`}
            >
              <T>{step.label}</T>
            </span>
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 rounded ${
                  index < currentStep ? "bg-islamic-green" : "bg-beige-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3"
        >
          <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
          <p className="text-sm text-red-600"><T>{error}</T></p>
        </motion.div>
      )}

      {/* Form Card */}
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-2xl border border-beige-200 p-6 sm:p-8"
      >
        {/* Step 1: Masjid Details */}
        {currentStep === 0 && (
          <div className="space-y-5">
            <h3 className="font-heading font-bold text-charcoal-600 text-lg flex items-center gap-2">
              <Building2 size={20} className="text-gold" /><T>
              Masjid Details
            </T></h3>

            <div>
              <label className="block text-xs font-medium text-charcoal-400 mb-1.5"><T>
                Masjid Name *
              </T></label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder={translate("e.g., Masjid Al-Noor")}
                className="w-full px-4 py-3 border border-beige-300 rounded-xl text-sm text-charcoal-500 placeholder:text-charcoal-200 focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-charcoal-400 mb-1.5"><T>
                Zip / Postal Code *
              </T></label>
              <input
                type="text"
                value={formData.zip_code}
                onChange={(e) => updateField("zip_code", e.target.value)}
                placeholder={translate("e.g., 54000")}
                className="w-full px-4 py-3 border border-beige-300 rounded-xl text-sm text-charcoal-500 placeholder:text-charcoal-200 focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-charcoal-400 mb-1.5"><T>
                Area / Locality *
              </T></label>
              <div className="relative">
                <MapPin size={16} className="absolute start-3 top-1/2 -translate-y-1/2 text-charcoal-200" />
                <input
                  type="text"
                  value={formData.area}
                  onChange={(e) => updateField("area", e.target.value)}
                  placeholder={translate("e.g., Gulberg, Model Town")}
                  className="w-full ps-10 pe-4 py-3 border border-beige-300 rounded-xl text-sm text-charcoal-500 placeholder:text-charcoal-200 focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-charcoal-400 mb-1.5"><T>
                  City *
                </T></label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => updateField("city", e.target.value)}
                  placeholder={translate("e.g., Lahore")}
                  className="w-full px-4 py-3 border border-beige-300 rounded-xl text-sm text-charcoal-500 placeholder:text-charcoal-200 focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-charcoal-400 mb-1.5"><T>
                  Country *
                </T></label>
                <div className="relative">
                  <Globe size={16} className="absolute start-3 top-1/2 -translate-y-1/2 text-charcoal-200" />
                  <select
                    value={formData.country}
                    onChange={(e) => updateField("country", e.target.value)}
                    className="w-full ps-10 pe-4 py-3 border border-beige-300 rounded-xl text-sm text-charcoal-500 focus:border-gold focus:ring-1 focus:ring-gold transition-colors appearance-none bg-white"
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c} value={c}><T>{c}</T></option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Additional Info */}
        {currentStep === 1 && (
          <div className="space-y-5">
            <h3 className="font-heading font-bold text-charcoal-600 text-lg flex items-center gap-2">
              <FileText size={20} className="text-gold" /><T>
              Additional Information
            </T></h3>

            <div>
              <label className="block text-xs font-medium text-charcoal-400 mb-1.5"><T>
                Description (Optional)
              </T></label>
              <textarea
                value={formData.description}
                onChange={(e) => updateField("description", e.target.value)}
                placeholder={translate("Tell us about your Masjid — its history, community, or any special programs...")}
                rows={5}
                className="w-full px-4 py-3 border border-beige-300 rounded-xl text-sm text-charcoal-500 placeholder:text-charcoal-200 focus:border-gold focus:ring-1 focus:ring-gold transition-colors resize-none"
              />
              <p className="text-xs text-charcoal-200 mt-1"><T>
                This will be visible to circle members.
              </T></p>
            </div>
          </div>
        )}

        {/* Step 3: Confirmation */}
        {currentStep === 2 && (
          <div className="space-y-5">
            <h3 className="font-heading font-bold text-charcoal-600 text-lg flex items-center gap-2">
              <CheckCircle size={20} className="text-gold" /><T>
              Review & Submit
            </T></h3>

            <div className="bg-beige-50 rounded-xl p-5 space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-beige-200">
                <span className="text-xs text-charcoal-300 font-medium"><T>Masjid Name</T></span>
                <span className="text-sm text-charcoal-600 font-semibold">{formData.name}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-beige-200">
                <span className="text-xs text-charcoal-300 font-medium"><T>Zip Code</T></span>
                <span className="text-sm text-charcoal-600">{formData.zip_code}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-beige-200">
                <span className="text-xs text-charcoal-300 font-medium"><T>Area</T></span>
                <span className="text-sm text-charcoal-600">{formData.area}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-beige-200">
                <span className="text-xs text-charcoal-300 font-medium"><T>City</T></span>
                <span className="text-sm text-charcoal-600">{formData.city}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-beige-200">
                <span className="text-xs text-charcoal-300 font-medium"><T>Country</T></span>
                <span className="text-sm text-charcoal-600"><T>{formData.country}</T></span>
              </div>
              {formData.description && (
                <div className="py-2">
                  <span className="text-xs text-charcoal-300 font-medium block mb-1"><T>Description</T></span>
                  <span className="text-sm text-charcoal-500">{formData.description}</span>
                </div>
              )}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-xs text-blue-700"><T>
                ℹ️ After submission, your Masjid will be reviewed by the Ta&apos;sees Circle team. Once approved, a unique code will be generated that you can share with your community members to join your circle.
              </T></p>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8 pt-5 border-t border-beige-100">
          {currentStep > 0 ? (
            <button
              onClick={handleBack}
              className="flex items-center gap-2 px-4 py-2.5 text-sm text-charcoal-400 hover:text-charcoal-600 font-medium transition-colors"
            >
              <ArrowLeft size={16} /><T>
              Back
            </T></button>
          ) : (
            <div />
          )}

          {currentStep < steps.length - 1 ? (
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-gold text-white text-sm font-medium rounded-xl hover:shadow-lg transition-all"
            ><T>
              Next
              </T><ArrowRight size={16} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-gold text-white text-sm font-medium rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" /><T>
                  Submitting...
                </T></>
              ) : (
                <><T>
                  Submit for Approval
                  </T><CheckCircle size={16} />
                </>
              )}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
