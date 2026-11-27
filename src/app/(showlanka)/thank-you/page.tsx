import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Mail, MessageCircle, Phone } from "lucide-react";
import { ENQUIRY_EMAIL } from "@/components/sites/showlanka/enquiry";
import { ThankYouConversion } from "@/components/sites/showlanka/thank-you-conversion";

export const metadata: Metadata = {
  title:
    "Thanks for Reaching Out to Show Lanka Tours | We Received Your Sri Lanka Holiday Enquiry and Our Local Team Will Be in Touch to Help Plan Your Trip",
  robots: { index: false, follow: false },
};

const steps = [
  {
    title: "We review your enquiry",
    text: "Our local travel team reads every request personally.",
  },
  {
    title: "We reach out to you",
    text: "Expect a reply by email or phone, usually within 24 hours.",
  },
  {
    title: "We tailor your trip",
    text: "Together we shape an itinerary that fits your dates and budget.",
  },
];

export default function ThankYouPage() {
  return (
    <>
      <ThankYouConversion />
      <section className="thank-you">
        <div className="container">
          <div className="thank-you__card">
            <CheckCircle2 className="thank-you__icon" aria-hidden="true" strokeWidth={1.5} />
            <h1 className="thank-you__title">Thank you!</h1>
            <p className="thank-you__lead">
              Your enquiry has been received. Our team will be in touch with you shortly.
            </p>

            <ol className="thank-you__steps">
              {steps.map((step, i) => (
                <li key={step.title}>
                  <span className="thank-you__step-num">{i + 1}</span>
                  <div>
                    <h2>{step.title}</h2>
                    <p>{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="thank-you__contact">
              <p>Need to reach us sooner?</p>
              <ul>
                <li>
                  <a href="tel:+94779144664">
                    <Phone aria-hidden="true" size={16} /> 0094 779 144664
                  </a>
                </li>
                <li>
                  <a href="https://wa.me/94779144664" target="_blank" rel="noopener">
                    <MessageCircle aria-hidden="true" size={16} /> WhatsApp
                  </a>
                </li>
                <li>
                  <a href={`mailto:${ENQUIRY_EMAIL}`}>
                    <Mail aria-hidden="true" size={16} /> {ENQUIRY_EMAIL}
                  </a>
                </li>
              </ul>
            </div>

            <div className="thank-you__actions">
              <Link className="common-btn" href="/">
                Return to home
              </Link>
              <Link className="thank-you__secondary" href="/sri-lanka-tours">
                Browse tours
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
