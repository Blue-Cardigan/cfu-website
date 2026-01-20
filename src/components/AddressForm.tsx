'use client';

import React, { useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

export interface AddressData {
  name: string;
  address1: string;
  address2?: string;
  city: string;
  state_code: string;
  country_code: string;
  zip: string;
  email: string;
  phone?: string;
}

interface AddressFormProps {
  onSubmit: (addressData: AddressData) => void;
  onCancel: () => void;
}

export function AddressForm({ onSubmit, onCancel }: AddressFormProps) {
  const [savedAddress, setSavedAddress] = useLocalStorage<AddressData | null>('shipping_address', null);
  
  const [formData, setFormData] = useState<AddressData>(
    savedAddress || {
      name: '',
      address1: '',
      address2: '',
      city: '',
      state_code: '',
      country_code: 'GB',
      zip: '',
      email: '',
      phone: '',
    }
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    const required = ['name', 'address1', 'city', 'state_code', 'country_code', 'zip', 'email'];
    
    required.forEach(field => {
      if (!formData[field as keyof AddressData]) {
        newErrors[field] = 'This field is required';
      }
    });
    
    // Basic email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Save address to localStorage
      setSavedAddress(formData);
      onSubmit(formData);
    }
  };

  const countries = [
    { code: 'GB', name: 'United Kingdom' },
    { code: 'US', name: 'United States' },
    { code: 'CA', name: 'Canada' },
    { code: 'FR', name: 'France' },
    { code: 'DE', name: 'Germany' },
    { code: 'IT', name: 'Italy' },
    { code: 'ES', name: 'Spain' },
    { code: 'NL', name: 'Netherlands' },
    { code: 'UA', name: 'Ukraine' },
    // Add more countries as needed
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Shipping Address</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border ${errors.name ? 'border-red-500' : 'border-gray-300'} px-3 py-2 shadow-sm focus:border-brand-lightBlue focus:outline-none focus:ring-brand-lightBlue`}
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border ${errors.email ? 'border-red-500' : 'border-gray-300'} px-3 py-2 shadow-sm focus:border-brand-lightBlue focus:outline-none focus:ring-brand-lightBlue`}
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="address1" className="block text-sm font-medium text-gray-700">Address Line 1</label>
          <input
            type="text"
            id="address1"
            name="address1"
            value={formData.address1}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border ${errors.address1 ? 'border-red-500' : 'border-gray-300'} px-3 py-2 shadow-sm focus:border-brand-lightBlue focus:outline-none focus:ring-brand-lightBlue`}
          />
          {errors.address1 && <p className="mt-1 text-sm text-red-600">{errors.address1}</p>}
        </div>

        <div>
          <label htmlFor="address2" className="block text-sm font-medium text-gray-700">Address Line 2 (Optional)</label>
          <input
            type="text"
            id="address2"
            name="address2"
            value={formData.address2}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-brand-lightBlue focus:outline-none focus:ring-brand-lightBlue"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border ${errors.city ? 'border-red-500' : 'border-gray-300'} px-3 py-2 shadow-sm focus:border-brand-lightBlue focus:outline-none focus:ring-brand-lightBlue`}
            />
            {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
          </div>
          
          <div>
            <label htmlFor="state_code" className="block text-sm font-medium text-gray-700">State/Province</label>
            <input
              type="text"
              id="state_code"
              name="state_code"
              value={formData.state_code}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border ${errors.state_code ? 'border-red-500' : 'border-gray-300'} px-3 py-2 shadow-sm focus:border-brand-lightBlue focus:outline-none focus:ring-brand-lightBlue`}
            />
            {errors.state_code && <p className="mt-1 text-sm text-red-600">{errors.state_code}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="country_code" className="block text-sm font-medium text-gray-700">Country</label>
            <select
              id="country_code"
              name="country_code"
              value={formData.country_code}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border ${errors.country_code ? 'border-red-500' : 'border-gray-300'} px-3 py-2 shadow-sm focus:border-brand-lightBlue focus:outline-none focus:ring-brand-lightBlue`}
            >
              {countries.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.name}
                </option>
              ))}
            </select>
            {errors.country_code && <p className="mt-1 text-sm text-red-600">{errors.country_code}</p>}
          </div>
          
          <div>
            <label htmlFor="zip" className="block text-sm font-medium text-gray-700">Postal Code</label>
            <input
              type="text"
              id="zip"
              name="zip"
              value={formData.zip}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border ${errors.zip ? 'border-red-500' : 'border-gray-300'} px-3 py-2 shadow-sm focus:border-brand-lightBlue focus:outline-none focus:ring-brand-lightBlue`}
            />
            {errors.zip && <p className="mt-1 text-sm text-red-600">{errors.zip}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone (Optional)</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-brand-lightBlue focus:outline-none focus:ring-brand-lightBlue"
          />
        </div>

        <div className="flex gap-4 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-full hover:bg-gray-300 transition-colors"
          >
            Back
          </button>
          <button
            type="submit"
            className="flex-1 bg-brand-blue text-white py-3 rounded-full hover:bg-brand-darkBlue transition-colors"
          >
            Continue to Payment
          </button>
        </div>
      </form>
    </div>
  );
} 