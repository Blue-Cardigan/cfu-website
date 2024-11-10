import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import events from '../data/events.json';

export const Upcoming = () => {
  return (
    <motion.section
      id="upcoming"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="py-16"
    >
      <h2 className="text-3xl font-bold text-blue-600 mb-12 text-center">
        Upcoming <span className="bg-yellow-300 px-2">Events</span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {events.events.map((event) => (
          <motion.div
            key={event.id}
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
            className="shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Card className="h-full overflow-hidden">
              <CardContent className="p-0">
                <iframe
                  src={`https://lu.ma/embed/event/${event.id}/simple`}
                  width="100%"
                  height="600"
                  frameBorder="0"
                  style={{ 
                    border: '1px solid #bfcbda88', 
                    borderRadius: '8px',
                    transition: 'all 0.3s ease' 
                  }}
                  allowFullScreen=""
                  aria-hidden="false"
                  tabIndex="0"
                />
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};