import Hero from '@/components/Hero';
import FeaturedPrompts from '@/components/FeaturedPrompts';
import WhyChooseUs from '@/components/WhyChooseUs';
import TopCreators from '@/components/TopCreators';
import CustomerReviews from '@/components/CustomerReviews';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main>
      <Hero />
      <FeaturedPrompts />
      <WhyChooseUs />
      <TopCreators />
      <CustomerReviews />
      
    </main>
  );
}