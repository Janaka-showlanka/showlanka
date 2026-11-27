"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useState, type FormEvent } from "react";
import { contactPage } from "./content/pages";
import { EMAIL_RE, ENQUIRY_EMAIL, submitEnquiry } from "./enquiry";

type FieldName = "name" | "email" | "country" | "arrival" | "departure" | "adults" | "children" | "hotel";
type Errors = Partial<Record<FieldName, string>>;

const COUNTS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10+"];

/** Short enquiry form for the home hero; the full form lives on /contact. */
export function HeroEnquiryForm({ className = "", id }: { className?: string; id?: string }) {
  const router = useRouter();
  const uid = useId();
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"" | "sending" | "sent" | "mailto">("");

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "sending") return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const get = (k: string) => String(data.get(k) ?? "").trim();
    // Every field is required except telephone.
    const next: Errors = {};
    if (!get("name")) next.name = "Please enter your name.";
    if (!get("email")) next.email = "Please enter your email.";
    else if (!EMAIL_RE.test(get("email"))) next.email = "Please enter a valid email.";
    if (!get("country")) next.country = "Please enter your country.";
    if (!get("arrival")) next.arrival = "Please choose your arrival date.";
    if (!get("departure")) next.departure = "Please choose your departure date.";
    else if (get("arrival") && new Date(get("departure")) <= new Date(get("arrival"))) {
      next.departure = "Departure date must be after the arrival date.";
    }
    if (!get("adults") || get("adults") === "0") next.adults = "Please choose at least one adult.";
    if (!get("children")) next.children = "Please choose the number of children.";
    if (!get("hotel")) next.hotel = "Please choose a hotel category.";
    setErrors(next);
    if (Object.keys(next).length) return;

    setStatus("sending");
    const result = await submitEnquiry({
      name: get("name"),
      email: get("email"),
      telephone: get("tel"),
      country: get("country"),
      arrival: get("arrival"),
      departure: get("departure"),
      adults: get("adults"),
      children: get("children") === "0" ? "None" : get("children"),
      hotel: get("hotel"),
      message: "Quick enquiry from the home page hero form.",
      page: window.location.pathname,
      website: get("website"),
    });
    if (result === "sent") {
      form.reset();
      router.push("/thank-you");
    }
    setStatus(result);
  };

  const fieldId = (name: string) => `${uid}-${name}`;

  const error = (name: FieldName) => errors[name] && <span className="hero-enquiry__error">{errors[name]}</span>;

  const input = (name: FieldName | "tel", label: string, type: string, extra: { autoComplete?: string; inputMode?: "tel" } = {}) => {
    const required = name !== "tel";
    return (
      <label className="hero-enquiry__field" htmlFor={fieldId(name)}>
        <span>
          {label}
          {required && "*"}
        </span>
        <input
          id={fieldId(name)}
          type={type}
          name={name}
          aria-invalid={name !== "tel" && !!errors[name]}
          aria-required={required}
          {...extra}
        />
        {name !== "tel" && error(name)}
      </label>
    );
  };

  const select = (name: FieldName, label: string, options: string[], placeholder: string, small = false) => (
    <label className={`hero-enquiry__field${small ? " hero-enquiry__field--small" : ""}`} htmlFor={fieldId(name)}>
      <span>{label}*</span>
      <select id={fieldId(name)} name={name} defaultValue="" aria-invalid={!!errors[name]} aria-required>
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      {error(name)}
    </label>
  );

  return (
    // data-lpignore: LastPass otherwise injects icon <div>s into the labels before hydration.
    <form
      id={id}
      name="showlanka-enquiry"
      method="post"
      data-netlify="true"
      netlify-honeypot="website"
      className={`hero-enquiry ${className}`}
      aria-label="Quick enquiry"
      noValidate
      onSubmit={onSubmit}
      data-lpignore="true"
    >
      <input type="hidden" name="form-name" value="showlanka-enquiry" />
      <p className="hero-enquiry__title">Plan your Sri Lanka trip</p>
      <div className="hero-enquiry__fields">
        {input("name", "Name", "text", { autoComplete: "name" })}
        {input("email", "Email", "email", { autoComplete: "email" })}
        {input("tel", "Contact number", "tel", { autoComplete: "tel", inputMode: "tel" })}
        {input("country", "Country", "text", { autoComplete: "country-name" })}
        {input("arrival", "Arrival date", "date")}
        {input("departure", "Departure date", "date")}
        {select("adults", "Adults", COUNTS.slice(1), "Select", true)}
        {select("children", "Children", COUNTS, "Select", true)}
        {select("hotel", "Hotel category", contactPage.hotelCategories, "Select")}
        {/* Honeypot: hidden from people, filled in by spam bots */}
        <span className="sr-only" aria-hidden="true">
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </span>
        <button className="common-btn hero-enquiry__submit" type="submit" disabled={status === "sending"}>
          {status === "sending" ? "Sending…" : "Send Enquiry"}
        </button>
      </div>
      {status === "sent" || status === "mailto" ? (
        <p className="hero-enquiry__status" role="status">
          {status === "sent"
            ? "Thank you! Your enquiry has been sent — we will get back to you shortly."
            : `Your email app should now open with this enquiry addressed to ${ENQUIRY_EMAIL}.`}
        </p>
      ) : (
        <p className="hero-enquiry__more">
          Want to add more detail? <Link href="/contact">Use our full enquiry form</Link>
        </p>
      )}
    </form>
  );
}
