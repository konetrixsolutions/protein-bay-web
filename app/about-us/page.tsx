import FeatureStrip from "./FeatureStrip";
import JourneyTimeline from "./JourneyTimeline";
import StorySection from "./StorySection";
import WhyChooseUs from "./WhyChooseUs";

const AboutUs = () => {
  return (
    <main className="bg-background">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <StorySection />
        <WhyChooseUs />
        <JourneyTimeline />
        <FeatureStrip />
      </div>
    </main>
  );
};

export default AboutUs;
