// File: src/app/page.tsx
// Version: v35 - Server component with SEO metadata that renders client component

import { Metadata } from 'next'
import HomePageClient from './HomePageComponent'

// SEO Metadata (exported for Next.js)
export const metadata: Metadata = {
  title: 'Voluntold - Free Online Sign-up Sheets & Member Polling Platform',
  description: 'Create professional sign-up sheets and member polling for volunteers with automatic email notifications. Perfect for nonprofits, churches, schools, and community organizations. Free for the first year.',
  keywords: 'sign-up sheets, signup sheets, sign up sheets, volunteer sign-up sheets, member polling, volunteer polling, organization polling, online sign-up sheets, free sign-up sheets, volunteer management, nonprofit software, volunteer scheduling, volunteer coordination, community organizing, church volunteers, school volunteers, member voting, volunteer database, email notifications',
  authors: [{ name: 'Voluntold Team' }],
  creator: 'Voluntold',
  publisher: 'Voluntold',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'Voluntold - Free Online Sign-up Sheets & Member Polling',
    description: 'Create professional sign-up sheets and member polling for volunteers with automatic email notifications. Perfect for nonprofits, churches, schools, and community organizations.',
    url: 'https://voluntold.net',
    siteName: 'Voluntold',
    images: [
      {
        url: 'https://voluntold.net/voluntold-og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Voluntold - Free Online Sign-up Sheets & Member Polling Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Voluntold - Free Online Sign-up Sheets & Member Polling',
    description: 'Create professional sign-up sheets and member polling for volunteers with automatic email notifications. Perfect for nonprofits, churches, schools, and community organizations.',
    images: ['https://voluntold.net/voluntold-twitter-image.jpg'],
    creator: '@voluntold',
  },
  alternates: {
    canonical: 'https://voluntold.net',
  },
  category: 'Technology',
  classification: 'Business Software',
  verification: {
    google: 'your-google-site-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
}

export default function HomePage() {
  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'Voluntold',
            description: 'Free online sign-up sheets and member polling platform for nonprofits, churches, schools, and community organizations with email notifications and volunteer management.',
            url: 'https://voluntold.net',
            applicationCategory: 'BusinessApplication',
            operatingSystem: 'Web Browser',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
              availability: 'https://schema.org/InStock',
              priceValidUntil: '2025-12-31',
              description: 'Free for the first year'
            },
            screenshot: 'https://voluntold.net/dashboard-screenshot.jpg',
            featureList: [
              'Online sign-up sheets for volunteers',
              'Member polling and voting system',
              'Email notifications and reminders',
              'Calendar integration for volunteers',
              'Volunteer hour tracking and reporting',
              'Multi-organization support',
              'Admin dashboard with analytics',
              'Member self-management portal',
              'Automated email confirmations',
              'Anonymous and time-bound polling'
            ],
            audience: {
              '@type': 'Audience',
              audienceType: 'Nonprofit Organizations, Churches, Schools, Community Groups, Volunteer Coordinators'
            },
            provider: {
              '@type': 'Organization',
              name: 'Voluntold',
              url: 'https://voluntold.net'
            },
            softwareVersion: '1.0',
            releaseNotes: 'Complete sign-up sheet and member polling solution with email integration and multi-organization support.',
            downloadUrl: 'https://voluntold.net',
            installUrl: 'https://voluntold.net',
            memoryRequirements: 'Web Browser',
            storageRequirements: 'Cloud-based',
            permissions: 'Email sending, Calendar integration'
          })
        }}
      />

      {/* Organization Schema for Platform */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'Voluntold',
            url: 'https://voluntold.net',
            logo: 'https://voluntold.net/voluntold-logo.png',
            description: 'Free online sign-up sheets and member polling platform for nonprofits, churches, schools, and community organizations',
            foundingDate: '2025',
            industry: 'Software',
            keywords: 'sign-up sheets, member polling, volunteer management, nonprofit software, volunteer coordination, community organizing',
            knowsAbout: [
              'Online Sign-up Sheets',
              'Member Polling Systems',
              'Volunteer Management',
              'Nonprofit Software',
              'Community Service Coordination',
              'Volunteer Coordination',
              'Church Volunteer Management',
              'School Volunteer Organization',
              'Community Group Management'
            ],
            contactPoint: {
              '@type': 'ContactPoint',
              contactType: 'Customer Support',
              url: 'https://voluntold.net/help',
              availableLanguage: 'English'
            },
            sameAs: [
              'https://twitter.com/voluntold',
              'https://facebook.com/voluntold',
              'https://linkedin.com/company/voluntold'
            ]
          })
        }}
      />

      {/* WebApplication Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'Voluntold',
            url: 'https://voluntold.net',
            description: 'Free online sign-up sheets and member polling platform for nonprofits, churches, schools, and community organizations with email notifications and volunteer management.',
            browserRequirements: 'Requires JavaScript. Requires HTML5.',
            softwareVersion: '1.0',
            operatingSystem: 'Web Browser',
            applicationCategory: 'BusinessApplication',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
              description: 'Free for the first year'
            },
            featureList: [
              'Online volunteer sign-up sheets',
              'Member polling and voting',
              'Email notifications and reminders',
              'Calendar integration',
              'Volunteer hour tracking',
              'Multi-organization support',
              'Member self-management',
              'Admin dashboard'
            ]
          })
        }}
      />

      {/* FAQ Schema for Common Questions */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: 'How do I create online sign-up sheets for volunteers?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'With Voluntold, you can create professional sign-up sheets in minutes. Simply sign up as an administrator, create your organization, and start adding volunteer opportunities. Members can sign up directly from their email with one click.'
                }
              },
              {
                '@type': 'Question',
                name: 'Can I use member polling and voting features?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Yes! Voluntold includes comprehensive member polling and voting features. You can create polls that are anonymous, time-bound, and changeable for maximum flexibility. Perfect for decision-making and gathering feedback from your community.'
                }
              },
              {
                '@type': 'Question',
                name: 'Is Voluntold free for nonprofits and churches?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Yes, Voluntold is free for the first year for all organizations including nonprofits, churches, schools, and community groups. Our platform is designed to help communities coordinate volunteers without budget constraints.'
                }
              },
              {
                '@type': 'Question',
                name: 'Do volunteers need passwords to sign up?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'No passwords required! Volunteers access their information through magic links sent to their email. This makes it easy for members to sign up and manage their commitments without remembering additional passwords.'
                }
              }
            ]
          })
        }}
      />

      {/* Render the client component */}
      <HomePageClient />
    </>
  )
}