// pages/privacy-policy.js
import Head from 'next/head';
import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <div className="bg-white">
      <Head>
        <title>Privacy Policy | TechPulse</title>
        <meta name="description" content="TechPulse's privacy policy explains how we collect, use, and protect your personal information." />
      </Head>

      {/* Navigation */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/">
                  <a className="text-2xl font-bold text-indigo-600">TechPulse</a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-indigo prose-lg mx-auto">
          <h1>Privacy Policy</h1>
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2>Introduction</h2>
          <p>
            At TechPulse, we respect your privacy and are committed to protecting your personal data. 
            This privacy policy will inform you about how we look after your personal data when you 
            visit our website and tell you about your privacy rights and how the law protects you.
          </p>
          
          <h2>The Data We Collect About You</h2>
          <p>
            Personal data, or personal information, means any information about an individual 
            from which that person can be identified. We may collect, use, store and transfer 
            different kinds of personal data about you which we have grouped together as follows:
          </p>
          <ul>
            <li><strong>Identity Data</strong> includes first name, last name, username or similar identifier.</li>
            <li><strong>Contact Data</strong> includes email address.</li>
            <li><strong>Technical Data</strong> includes internet protocol (IP) address, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access this website.</li>
            <li><strong>Usage Data</strong> includes information about how you use our website.</li>
          </ul>
          
          <h2>How We Collect Your Personal Data</h2>
          <p>We use different methods to collect data from and about you including through:</p>
          <ul>
            <li>
              <strong>Direct interactions.</strong> You may give us your Identity and Contact Data by filling in forms 
              or by corresponding with us by email or otherwise.
            </li>
            <li>
              <strong>Automated technologies or interactions.</strong> As you interact with our website, 
              we may automatically collect Technical Data about your equipment, browsing actions and patterns. 
              We collect this personal data by using cookies, server logs and other similar technologies.
            </li>
          </ul>
          
          <h2>Cookies</h2>
          <p>
            Our website uses cookies to distinguish you from other users of our website. 
            This helps us to provide you with a good experience when you browse our website 
            and also allows us to improve our site.
          </p>
          
          <h2>Google AdSense</h2>
          <p>
            We use Google AdSense to serve advertisements on our website. Google AdSense may use cookies 
            and web beacons to serve ads based on your prior visits to our website and other websites on the internet. 
            Google's use of advertising cookies enables it and its partners to serve ads to you based on your visit to our 
            website and/or other websites on the internet.
          </p>
          <p>
            You may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" 
            target="_blank" rel="noopener noreferrer">Google Ads Settings</a>.
          </p>
          
          <h2>Data Security</h2>
          <p>
            We have put in place appropriate security measures to prevent your personal data from being 
            accidentally lost, used or accessed in an unauthorized way, altered or disclosed. 
            In addition, we limit access to your personal data to those employees, agents, contractors 
            and other third parties who have a business need to know.
          </p>
          
          <h2>Data Retention</h2>
          <p>
            We will only retain your personal data for as long as reasonably necessary to fulfill the 
            purposes we collected it for, including for the purposes of satisfying any legal, regulatory, 
            tax, accounting or reporting requirements.
          </p>
          
          <h2>Your Legal Rights</h2>
          <p>
            Under certain circumstances, you have rights under data protection laws in relation to your personal data, including:
          </p>
          <ul>
            <li>The right to access your personal data</li>
            <li>The right to correction of your personal data</li>
            <li>The right to erasure of your personal data</li>
            <li>The right to object to processing of your personal data</li>
            <li>The right to restrict processing of your personal data</li>
            <li>The right to data portability</li>
            <li>The right to withdraw consent</li>
          </ul>
          
          <h2>Contact Us</h2>
          <p>
            If you have any questions about this privacy policy or our privacy practices, 
            please contact us at: contact@techpulse.com
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="mt-8 border-t border-gray-200 pt-8">
            <p className="text-base text-gray-400 xl:text-center">
              &copy; {new Date().getFullYear()} TechPulse. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}