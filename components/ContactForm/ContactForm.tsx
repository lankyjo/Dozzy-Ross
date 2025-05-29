import React, { useState } from "react";
import { motion } from "framer-motion";
import { postFunc } from "../utils/request";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhoneChange = (phone: string) => {
    setFormData((prev) => ({
      ...prev,
      phone,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.name || !formData.email) {
      setMessage("Please fill in all required fields");
      setSubmitStatus("error");
      setTimeout(() => {
        setSubmitStatus("idle");
      }, 3000);
      return;
    }

    setIsSubmitting(true);

    try {
      // Create a copy of the form data for submission
      const submissionData: {
        name: string;
        email: string;
        phone?: string;
      } = {
        name: formData.name,
        email: formData.email,
      };

      // Handle phone field - only add it if it's a valid phone number
      if (formData.phone && formData.phone.replace(/\D/g, "").length > 0) {
        // Ensure the phone has only digits, plus sign, and parentheses
        const phoneDigits = formData.phone.replace(/[^\d+()]/g, "");
        // Only add phone if it's long enough to be valid
        if (phoneDigits.length >= 7) {
          submissionData.phone = phoneDigits;
        }
      }

      // Submit the form with cleaned data
      await postFunc({
        url: "newsletter",
        values: submissionData,
      });

      setFormData({ name: "", email: "", phone: "" });
      setSubmitStatus("success");

      // Reset status after 3 seconds
      setTimeout(() => {
        setSubmitStatus("idle");
      }, 3000);
    } catch (error: any) {
      setSubmitStatus("error");
      if (!error?.response) {
        setMessage(error.message);
        return;
      }
      setMessage(error?.response.data.message);

      // Reset error status after 3 seconds
      setTimeout(() => {
        setSubmitStatus("idle");
      }, 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="w-full py-20 bg-black">
      <div className="contain">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="max-w-2xl mx-auto"
        >
          <h2 className="text-3xl font-anton font-bold text-white mb-4 text-center">
            Stay Connected
          </h2>
          <p className="text-gray-300 text-center mb-8">
            Subscribe to our newsletter for the latest updates and exclusive
            offers.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-white mb-2">
                Name <span className="text-primary">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Your name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-white mb-2">
                Email <span className="text-primary">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="your.email@example.com"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-white mb-2">
                Phone Number <span className="text-gray-500">(optional)</span>
              </label>

              <div style={{ zIndex: 100 }}>
                <PhoneInput
                  defaultCountry="us"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  inputStyle={{
                    width: "100%",
                    height: "50px",
                    fontSize: "16px",
                    backgroundColor: "#1f2937",
                    color: "white",
                    border: "1px solid #374151",
                    borderRadius: "0 0.5rem 0.5rem 0",
                  }}
                  countrySelectorStyleProps={{
                    buttonStyle: {
                      backgroundColor: "#1f2937",
                      border: "1px solid #374151",
                      borderRight: "none",
                      borderRadius: "0.5rem 0 0 0.5rem",
                      height: "50px",
                    },
                    dropdownStyleProps: {
                      style: {
                        backgroundColor: "#1f2937",
                        border: "1px solid #374151",
                        zIndex: 999,
                      },
                      listItemStyle: {
                        color: "white",
                      },
                    },
                  }}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Leave blank if you prefer not to provide a phone number
                </p>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                  isSubmitting
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-primary hover:bg-primary/80"
                } text-white`}
              >
                {isSubmitting ? "Submitting..." : "Subscribe Now"}
              </button>
            </div>

            {submitStatus === "success" && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-green-900/50 border border-green-700 rounded-lg text-green-300 text-center"
              >
                Thank you for subscribing! We&apos;ll keep you updated.
              </motion.div>
            )}

            {submitStatus === "error" && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-300 text-center"
              >
                {message}
              </motion.div>
            )}
          </form>
        </motion.div>
      </div>

      <style jsx global>{`
        /* Override styles for new phone input */
        .react-international-phone-country-selector-dropdown {
          background-color: #1f2937 !important;
          color: white !important;
          border-color: #374151 !important;
          z-index: 9999 !important;
        }

        .react-international-phone-country-selector-dropdown__list-item {
          color: white !important;
        }

        .react-international-phone-country-selector-dropdown__list-item:hover {
          background-color: #374151 !important;
        }

        .react-international-phone-country-selector-dropdown__search-input {
          background-color: #2d3748 !important;
          color: white !important;
          border-color: #4a5568 !important;
        }

        /* Additional styling for better visibility */
        .react-international-phone-input {
          color: white !important;
        }

        .react-international-phone-country-selector-button {
          background-color: #1f2937 !important;
        }
      `}</style>
    </section>
  );
};

export default ContactForm;
