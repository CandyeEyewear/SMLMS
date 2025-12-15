'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewCompanyPage() {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [billingEmail, setBillingEmail] = useState('');
  const [location, setLocation] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#1A4490');
  const [secondaryColor, setSecondaryColor] = useState('#2BB5C5');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Auto-generate slug from name
  const handleNameChange = (value: string) => {
    setName(value);
    const generatedSlug = value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    setSlug(generatedSlug);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const supabase = createClient();

    // Check if slug is unique
    const { data: existing } = await supabase
      .from('companies')
      .select('id')
      .eq('slug', slug)
      .single();

    if (existing) {
      setError('A company with this URL slug already exists.');
      setLoading(false);
      return;
    }

    // Create the company
    const { error: insertError } = await supabase.from('companies').insert({
      name,
      slug,
      contact_person: contactPerson || null,
      contact_phone: contactPhone || null,
      billing_email: billingEmail || null,
      location: location || null,
      primary_color: primaryColor,
      secondary_color: secondaryColor,
      status: 'active',
      is_active: true,
    } as never);

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    router.push('/super-admin/companies');
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/super-admin/companies"
          className="text-gray-500 hover:text-gray-700 text-sm mb-2 inline-flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Companies
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Add Company</h1>
        <p className="text-gray-500 mt-1">Create a new client company</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Company Info Section */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Company Information</h3>

            {/* Company Name */}
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Company Name *
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                placeholder="Acme Corporation"
              />
            </div>

            {/* URL Slug */}
            <div className="mb-4">
              <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
                URL Slug *
              </label>
              <input
                id="slug"
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                placeholder="acme-corp"
              />
              <p className="text-sm text-gray-500 mt-1">
                Users will access: lms.salesmasterjm.com/{slug || 'company-slug'}
              </p>
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                id="location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                placeholder="Kingston, Jamaica"
              />
            </div>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Details</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Contact Person */}
              <div>
                <label htmlFor="contactPerson" className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Person
                </label>
                <input
                  id="contactPerson"
                  type="text"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                  placeholder="John Smith"
                />
              </div>

              {/* Contact Phone */}
              <div>
                <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Phone
                </label>
                <input
                  id="contactPhone"
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                  placeholder="+1 (876) 555-0123"
                />
              </div>
            </div>

            {/* Billing Email */}
            <div className="mt-4">
              <label htmlFor="billingEmail" className="block text-sm font-medium text-gray-700 mb-1">
                Billing Email
              </label>
              <input
                id="billingEmail"
                type="email"
                value={billingEmail}
                onChange={(e) => setBillingEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                placeholder="billing@company.com"
              />
            </div>
          </div>

          {/* Branding Section */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Branding</h3>

            <div className="grid grid-cols-2 gap-4">
              {/* Primary Color */}
              <div>
                <label htmlFor="primaryColor" className="block text-sm font-medium text-gray-700 mb-1">
                  Primary Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    id="primaryColor"
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-12 h-12 border border-gray-300 rounded-lg cursor-pointer"
                  />
                  <input
                    type="text"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Secondary Color */}
              <div>
                <label htmlFor="secondaryColor" className="block text-sm font-medium text-gray-700 mb-1">
                  Secondary Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    id="secondaryColor"
                    type="color"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="w-12 h-12 border border-gray-300 rounded-lg cursor-pointer"
                  />
                  <input
                    type="text"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Preview</label>
              <div
                className="p-4 rounded-lg text-white"
                style={{ backgroundColor: primaryColor }}
              >
                <p className="font-medium">{name || 'Company Name'}</p>
                <p className="text-sm opacity-80">Dashboard header preview</p>
                <button
                  type="button"
                  className="mt-2 px-3 py-1 rounded text-sm font-medium"
                  style={{ backgroundColor: secondaryColor }}
                >
                  Sample Button
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 mt-6">
          <button
            type="submit"
            disabled={loading}
            className="bg-primary-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-600 transition-colors disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Company'}
          </button>
          <Link
            href="/super-admin/companies"
            className="px-6 py-3 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
