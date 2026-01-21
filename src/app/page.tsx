import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Home } from '@/components/Home';
import { AboutUs } from '@/components/AboutUs';
import { Events } from '@/components/Events';
import { Newsletter } from '@/components/Newsletter';
import { ShopCarousel } from '@/components/ShopCarousel';
import events from '@/data/events.json';

type EventsData = {
  events: Array<{ id: string; title?: string; startDate?: string; endDate?: string; location?: string }>;
};

export default async function Page() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://creativesforukraine.vercel.app';

  const allEvents = (events as EventsData).events ?? [];
  const datedEvents = allEvents.filter((e) => e.title && e.startDate);
  const eventJsonLdList = datedEvents.slice(0, 10).map((e) => ({
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: e.title,
    startDate: e.startDate,
    endDate: e.endDate,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    url: `https://luma.com/event/${e.id}`,
    location: e.location
      ? {
          '@type': 'Place',
          name: e.location,
        }
      : undefined,
    organizer: {
      '@type': 'Organization',
      name: 'Creatives for Ukraine',
      url: baseUrl,
    },
  }));

  return (
    <>
      {eventJsonLdList.map((jsonLd, idx) => (
        <script
          // Use index to keep stable ordering; events are curated via events.json.
          // eslint-disable-next-line react/no-array-index-key
          key={idx}
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      ))}
      <Header />
      <main>
        <Home />
        <AboutUs />
        <ShopCarousel 
          title="Gifts of Ukraine" 
          subtitle="Every purchase supports our mission to help Ukraine through art and creativity."
        />
        <Events />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
} 