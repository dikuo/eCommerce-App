import Hero from "../components/Hero.tsx";
import LatestCollection from "../components/LatestCollection.tsx";
import BestSeller from "../components/BestSeller.tsx";
import OurPolicy from "../components/OurPolicy.tsx";
import NewsletterBox from "../components/NewsletterBox.tsx";

const Home = () => {
  return (
    <div>
      <Hero />
      <LatestCollection />
      <BestSeller />
      <OurPolicy />
      <NewsletterBox />
    </div>
  );
};

export default Home;
