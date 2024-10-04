import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

const events = [
  { title: 'Art Exhibition', date: 'May 15, 2024', description: 'Showcasing works from Ukrainian artists' },
  { title: 'Charity Concert', date: 'June 2, 2024', description: 'Live performances by Ukrainian musicians' },
  { title: 'Cultural Workshop', date: 'July 10, 2024', description: 'Learn about Ukrainian traditions and crafts' },
];

export const Upcoming = () => {
  return (
    <motion.section
      id="upcoming"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl font-bold text-blue-600 mb-8 text-center">Upcoming Events</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {events.map((event, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>{event.title}</CardTitle>
                <CardDescription>{event.date}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>{event.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};