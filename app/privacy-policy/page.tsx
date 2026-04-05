"use client";

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-background text-text-primary p-4 sm:p-8 pt-24">
      <div className="p-4 sm:p-8 max-w-5xl mx-auto bg-sub-background rounded-xl">
        <h1 className="text-4xl font-bold mb-2 text-text">Privacy Policy</h1>
        <p className="text-text-500 mb-8">Last Updated: April 5, 2026</p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
          <p className="text-text-secondary">
            Couch to Crunch is a personal project that helps users discover and
            organize workout videos. This Privacy Policy explains how I collect,
            use, and protect your personal information. By using my service, you
            agree to the practices outlined in this policy.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            2. Information I Collect
          </h2>

          <h3 className="text-xl font-semibold mb-3 mt-5">
            Information You Provide
          </h3>
          <p className="mb-3 text-text-secondary">
            When you sign in with Google, I collect:
          </p>
          <ul className="list-disc list-inside mb-4 text-text-secondary space-y-1">
            <li>Email address</li>
            <li>Full name</li>
            <li>Google ID</li>
            <li>Profile picture URL</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 mt-5">
            Information Collected Automatically
          </h3>
          <p className="mb-3 text-text-secondary">
            When you use my service, I automatically collect:
          </p>
          <ul className="list-disc list-inside text-text-secondary space-y-1">
            <li>Videos you watch and save</li>
            <li>Search queries and filter preferences</li>
            <li>IP address and device information</li>
            <li>Browser type and pages visited</li>
            <li>Cookies and tracking technologies</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            3. How I Use Your Information
          </h2>
          <ul className="list-disc list-inside text-text-secondary space-y-2">
            <li>To provide and maintain the service</li>
            <li>To authenticate your account</li>
            <li>To track your saved workout videos</li>
            <li>To improve user experience and service quality</li>
            <li>To detect and prevent fraud or security issues</li>
            <li>To comply with legal obligations</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            4. How I Share Your Information
          </h2>
          <p className="mb-4 text-text-secondary">
            I do not sell, trade, or rent your personal information to third
            parties. I may share your information only:
          </p>
          <ul className="list-disc list-inside text-text-secondary space-y-2">
            <li>
              <strong>With Google:</strong> For authentication purposes through
              Google Sign-In
            </li>
            <li>
              <strong>With service providers:</strong> If I use third-party
              services to operate the service (e.g., hosting providers)
            </li>
            <li>
              <strong>As required by law:</strong> When legally required to
              disclose information
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Data Retention</h2>
          <p className="text-text-secondary">
            I retain your personal data as long as your account is active. If
            you delete your account, I will remove your personal data within 30
            days, except where I am required to retain it by law. Backup copies
            may be retained for up to 90 days before permanent deletion.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Data Security</h2>
          <p className="text-text-secondary">
            I implement reasonable technical, administrative, and physical
            security measures to protect your information from unauthorized
            access, alteration, and disclosure. However, no method of
            transmission over the Internet is completely secure, and I cannot
            guarantee absolute security.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            7. Your Privacy Rights
          </h2>
          <p className="mb-4 text-text-secondary">
            You have the following rights regarding your personal information:
          </p>
          <ul className="list-disc list-inside text-text-secondary space-y-2">
            <li>
              <strong>Access:</strong> Request access to your personal data
            </li>
            <li>
              <strong>Correction:</strong> Request correction of inaccurate data
            </li>
            <li>
              <strong>Deletion:</strong> Request deletion of your account and
              data
            </li>
            <li>
              <strong>Withdraw Consent:</strong> Withdraw consent for data
              collection
            </li>
            <li>
              <strong>Data Portability:</strong> Request your data in a portable
              format
            </li>
          </ul>
          <p className="mt-4 text-text-secondary">
            To exercise these rights, contact me at the email listed below. I
            will respond within 30 days.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            8. Third-Party Services
          </h2>
          <p className="text-text-secondary">
            My service integrates with Google Sign-In. I recommend reviewing
            Google's Privacy Policy to understand their data practices:{" "}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Google Privacy Policy
            </a>
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">9. Contact Us</h2>
          <p className="mb-4 text-text-secondary">
            If you have questions about this Privacy Policy or wish to exercise
            your privacy rights, please contact me:
          </p>
          <div className="bg-background p-4 rounded border border-text-300">
            <p className="font-semibold mb-2 text-text">Couch to Crunch</p>
            <p className="text-text-500">Email: sonyaj124.ca@gmail.com</p>
            <p className="text-text-500 text-sm mt-3">
              I aim to respond to all inquiries within 30 days.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
