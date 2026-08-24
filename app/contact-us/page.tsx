import BusinessHours from "./BussinessHours";
import ContactForm from "./ContactForm";
import ContactInfo from "./ContactInfo";
import FollowUs from "./Followus";

const ContactUs = () => {
  return (
    <main className="min-h-screen bg-[#f7f9f4]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        <div className="max-w-2xl">
          <p className="text-2xl font-bold uppercase tracking-[0.2em] text-[#3f7d3f]">
            Contact Us
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#173b1b] sm:text-4xl">
            We'd love to hear from you.
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
            Have a question about an order, product, or anything else? Reach out
            to us and our team will be happy to help.
          </p>
        </div>

        {/* CONTENT */}

        <section className="mt-8 grid gap-6 lg:grid-cols-5 lg:gap-8">
          {/* LEFT */}

          <div className="space-y-5 lg:col-span-2">
            <ContactInfo />
            <BusinessHours />
            <FollowUs />
          </div>

          {/* RIGHT */}

          <div className="lg:col-span-3">
            <ContactForm />
          </div>
        </section>
      </div>
    </main>
  );
};

export default ContactUs;
