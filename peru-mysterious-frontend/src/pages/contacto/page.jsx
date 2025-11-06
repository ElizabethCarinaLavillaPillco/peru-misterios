import React from "react";
import ContactInfo from "@/components/sections/contacto/ContactInfo";
import ContactForm from "@/components/sections/contacto/ContactForm";

export default function ContactoPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1">
        <ContactInfo />
      </div>
      <div className="lg:col-span-2">
        <ContactForm />
      </div>
    </div>
  );
}
