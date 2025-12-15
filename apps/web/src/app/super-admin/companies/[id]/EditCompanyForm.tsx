'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

interface Company {
  id: string;
  name: string;
  slug: string;
  contact_person: string | null;
  contact_phone: string | null;
  billing_email: string | null;
  location: string | null;
  primary_color: string | null;
  secondary_color: string | null;
  is_active: boolean;
}

export default function EditCompanyForm({ company }: { company: Company }) {
  const [name, setName] = useState(company.name);
  const [slug, setSlug] = useState(company.slug);
  const [contactPerson, setContactPerson] = useState(company.contact_person || '');
  const [contactPhone, setContactPhone] = useState(company.contact_phone || '');
  const [billingEmail, setBillingEmail] = useState(company.billing_email || '');
  const [location, setLocation] = useState(company.location || '');
  const [primaryColor, setPrimaryColor] = useState(company.primary_color || '#1A4490');
  const [secondaryColor, setSecondaryColor] = useState(company.secondary_color || '#2BB5C5');
  const [isActive, setIsActive] = useState(company.is_active);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const supabase = createClient();

    // Check if slug is unique (if changed)
    if (slug !== company.slug) {
      const { data: existing } = await supabase
        .from('companies')
        .select('id')
        .eq('slug', slug)
        .neq('id', company.id)
        .single();

      if (existing) {
        setError('A company with this URL slug already exists.');
        setLoading(false);
        return;
      }
    }

    // Update the company
    const { error: updateError } = await supabase
      .from('companies')
      .update({
        name,
        slug,
        contact_person: contactPerson || null,
        contact_phone: contactPhone || null,
        billing_email: billingEmail || null,
        location: location || null,
        primary_color: primaryColor,
        secondary_color: secondaryColor,
        is_active: isActive,
        updated_at: new Date().toISOString(),
      } as never)
      .eq('id', company.id);

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    setSuccess('Company updated successfully.');
    setLoading(false);
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
        {error && (
          <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="p-3 bg-green-50 text-green-600 rounded-lg text-sm">
            {success}
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
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
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
            />
            <p className="text-sm text-gray-500 mt-1">
              Users will access: lms.salesmasterjm.com/{slug}
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
              <p className="font-medium">{name}</p>
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

        {/* Status Section */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Status</h3>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-5 h-5 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
            />
            <span className="text-gray-700">Company is active</span>
          </label>
          <p className="text-sm text-gray-500 mt-1">
            Inactive companies cannot access the platform.
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4 mt-6">
        <button
          type="submit"
          disabled={loading}
          className="bg-primary-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-600 transition-colors disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}
