import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export const Newsletter = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Encode the email for URL safety
    const encodedEmail = encodeURIComponent(email);
    // Redirect to Google Form with pre-filled email
    const formUrl = `https://docs.google.com/forms/d/e/1FAIpQLSelsoDlR9TOEgVU74GhktrUYqHsuA_MmpPwKEXLt8RV4PGniw/viewform?usp=pp_url&entry.1045781291=${encodedEmail}`;
    window.open(formUrl, '_blank');
    setEmail('');
  };

  return (
    <motion.section
      id="newsletter"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="py-16 bg-gray-50"
    >
      <div className="max-w-2xl mx-auto text-center px-4">
        <h2 className="text-3xl font-bold text-blue-600 mb-4">Stay <span className="bg-yellow-300 px-2">Updated</span></h2>
        <p className="text-gray-600 mb-8">
          Subscribe to our newsletter to receive updates about upcoming events and initiatives.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1 border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
          <Button 
            type="submit" 
            className="bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            Subscribe
          </Button>
        </form>
      </div>
    </motion.section>
  );
}; 