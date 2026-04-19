import type { Metadata } from 'next';
import CompanyFormationPage from '@/features/business/pages/CompanyFormationPage';

export const metadata: Metadata = {
  title: 'Company Formation in Dubai | DMCC, Mainland LLC & Offshore | Dubai À La Carte',
  description:
    'Expert-guided company formation in Dubai. DMCC Free Zone, Dubai Mainland LLC, offshore entity or branch office. 100% foreign ownership. From AED 8,500.',
  keywords: [
    'company formation dubai',
    'DMCC free zone setup',
    'dubai mainland LLC',
    'uae offshore company',
    'branch office dubai',
    'business setup dubai 2026',
    '100% foreign ownership uae',
    'DED license dubai',
    'company registration UAE',
    'free zone company dubai',
  ],
  openGraph: {
    title: 'Company Formation in Dubai | Dubai À La Carte',
    description:
      'Set up your Dubai company with expert guidance. DMCC, Mainland LLC, Offshore & Branch. From AED 8,500.',
    type: 'article',
    siteName: 'Dubai À La Carte',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Company Formation in Dubai | Dubai À La Carte',
    description:
      'Expert-guided company formation in Dubai. DMCC, Mainland LLC, Offshore & Branch. 100% foreign ownership from AED 8,500.',
  },
  alternates: {
    canonical: '/business/company-formation',
  },
  robots: {
    index: true,
    follow: true,
  },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Can a foreigner own 100% of a company in Dubai?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Yes. Following the UAE's 2021 Commercial Companies Law amendments, foreigners can own 100% of most mainland LLC activities without an Emirati local partner. All UAE free zones have always permitted 100% foreign ownership. Certain restricted sectors (oil and gas, telecoms, defence) maintain specific ownership limitations.",
      },
    },
    {
      '@type': 'Question',
      name: 'What is the minimum capital requirement to register a company in Dubai?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'There is no statutory minimum share capital for most free zone formations or mainland DED LLCs. Specific regulated sectors — banking, insurance, investment management — carry their own capital thresholds set by the relevant regulator. Your DALC advisor will confirm requirements specific to your activity.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the difference between a mainland and free zone company in the UAE?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Mainland companies (DED-licensed) can trade freely across all UAE Emirates, contract with government entities, and sell directly to retail consumers. Free zone companies enjoy superior tax efficiency and faster setup but are generally restricted to trading within the free zone perimeter or internationally.',
      },
    },
    {
      '@type': 'Question',
      name: 'How long does company formation take in Dubai?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Free zone formations typically complete in 2–5 business weeks. Mainland DED LLCs take 2–4 weeks. Branch office registrations typically take 4–6 weeks. All timelines assume documents are provided promptly and in full.',
      },
    },
    {
      '@type': 'Question',
      name: 'What are the ongoing annual costs after company formation in Dubai?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Ongoing annual costs include licence renewal fees (typically AED 5,000–15,000 depending on jurisdiction and activity type), registered office costs, and visa renewals every 2–3 years. Corporate tax filings, accounting, and VAT returns are additional.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do I need a physical office to register a company in Dubai?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Mainland DED licences require a physical tenancy contract registered on EJARI. Most UAE free zones — including DMCC — offer Flexi-Desk or Shared Desk options as a cost-effective alternative to dedicated office space.',
      },
    },
    {
      '@type': 'Question',
      name: 'Which is the best free zone for trading companies in Dubai?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "DMCC (Dubai Multi Commodities Centre) in JLT is consistently ranked the world's top free zone and is particularly suited to commodity trading, fintech, and professional services. JAFZA is preferred for import/export and logistics. DIFC is the choice for financial services.",
      },
    },
    {
      '@type': 'Question',
      name: 'Is there corporate tax in the UAE and how does it affect my Dubai company?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The UAE introduced a 9% federal corporate tax in June 2023, applicable to taxable profits above AED 375,000. Qualifying free zone entities may benefit from a 0% rate on qualifying income, provided they meet substance requirements and maintain Qualifying Free Zone Person status.',
      },
    },
  ],
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline:
    'Company Formation in Dubai: DMCC, Mainland LLC, Offshore & Branch Office Guide 2026',
  description:
    'Comprehensive expert guide to setting up a company in Dubai. Compare DMCC Free Zone, Mainland LLC, UAE Offshore, and Branch Office structures, costs, timelines, and requirements.',
  author: {
    '@type': 'Organization',
    name: 'Dubai À La Carte',
    url: 'https://dubaialacharte.com',
  },
  publisher: {
    '@type': 'Organization',
    name: 'Dubai À La Carte',
    url: 'https://dubaialacharte.com',
  },
  datePublished: '2025-01-01',
  dateModified: '2026-01-01',
  keywords: [
    'company formation dubai',
    'DMCC free zone',
    'dubai mainland LLC',
    'UAE offshore company',
    'business setup dubai',
  ],
  about: {
    '@type': 'Thing',
    name: 'Company Formation in Dubai',
    description: 'Process of registering a business entity in Dubai, UAE',
  },
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <CompanyFormationPage />
    </>
  );
}
