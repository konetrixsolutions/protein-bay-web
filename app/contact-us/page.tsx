import BusinessHours from "./BussinessHours";
import ContactForm from "./ContactForm";
import ContactInfo from "./ContactInfo";
import FollowUs from "./Followus";

const ContactUs = () => {
  return (
    <main className="bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        {/* Header */}

        <div className="pl-1 text-start">
          <p className="text-3xl font-semibold uppercase tracking-wider text-primary">
            CONTACT US
          </p>

          <h1 className="mt-1 text-sm font-medium  text-muted-foreground">
            We'd love to hear from you.
          </h1>

          <p className=" text-sm font-medium text-muted-foreground ">
            Reach out and we'll get back to you soon.
          </p>
        </div>

        {/* Content */}
        <section className="mt-6 grid gap-8 lg:grid-cols-5">
          {/* Left */}
          <div className="space-y-6 lg:col-span-2">
            <ContactInfo />
            <BusinessHours />
            <FollowUs />
          </div>
          {/* Right */}
          <div className="lg:col-span-3">
            <ContactForm />
          </div>
        </section>
      </div>
    </main>
  );
};

export default ContactUs;
