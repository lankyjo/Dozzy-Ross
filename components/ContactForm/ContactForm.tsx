import React, { useState } from "react";
import { motion } from "framer-motion";
import { postFunc } from "../utils/request";
import PhoneInput from "react-phone-input-2";
import classes from "./contactForm.module.css";
import "react-phone-input-2/lib/style.css";

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    try {
      // Replace with your actual API call
      // await new Promise((resolve) => setTimeout(resolve, 1000));

      // Reset form and show success message
      await postFunc({
        url: "newsletter",
        values: formData,
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
          className="max-w-2xl mx-auto">
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

              <PhoneInput
                inputProps={{
                  required: true,
                  style: { fontSize: "16px" },
                }}
                country={"us"}
                countryCodeEditable={false}
                enableSearch
                enableLongNumbers={false}
                enableAreaCodes={true}
                enableAreaCodeStretch
                prefix="+"
                autoFormat={false}
                containerClass={classes.phoneContainer}
                dropdownClass={classes.dropdownHeight}
                inputClass={classes.phoneInput}
                buttonClass="btnBgColor"
                value={formData.phone}
                onChange={(
                  value: string,
                  data: any,
                  event: React.ChangeEvent<HTMLInputElement>,
                  formattedValue: string
                ) => {
                  event.target.name = "phone";
                  event.target.value = formattedValue;
                  if (event?.type?.toLowerCase() === "change") {
                    handleChange(event);
                  }
                }}
              />
              {/* <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Your phone number"
              /> */}
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                  isSubmitting
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-primary hover:bg-primary/80"
                } text-white`}>
                {isSubmitting ? "Submitting..." : "Subscribe Now"}
              </button>
            </div>

            {submitStatus === "success" && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-green-900/50 border border-green-700 rounded-lg text-green-300 text-center">
                Thank you for subscribing! We&apos;ll keep you updated.
              </motion.div>
            )}

            {submitStatus === "error" && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-300 text-center">
                {message}
              </motion.div>
            )}
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactForm;
