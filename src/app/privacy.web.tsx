import React from 'react';
import { View, Text, ScrollView } from 'react-native';

export default function PrivacyPolicyWeb() {
  return (
    <article className="max-w-3xl mx-auto py-6">
      <header className="mb-10 pb-6 border-b border-surfaceContainer">
        <h1 className="font-jakarta text-[36px] font-bold text-primary tracking-tight mb-3">
          Privacy Policy
        </h1>
        <p className="font-jakarta text-[14px] text-onSurfaceVariant/60">
          Last Updated: July 5, 2026
        </p>
      </header>

      <section className="space-y-8 font-jakarta text-[16px] leading-[26px] text-onSurfaceVariant">
        <div className="bg-surfaceContainerLow border border-outlineVariant/40 rounded-2xl p-6 mb-6">
          <h3 className="text-primary font-semibold text-[18px] mb-2">Local-First Privacy Guard</h3>
          <p className="text-[15px] text-onSurfaceVariant">
            Nimo is built as a local-first application. This means all of your journal entries, streak counts, intentions, and mindful reflections are stored entirely on your physical device. We do not transmit, sync, or backup your personal data to remote servers.
          </p>
        </div>

        <div>
          <h2 className="text-primary font-bold text-[22px] mb-3 tracking-tight">1. Information We Collect</h2>
          <p className="mb-4">
            Because Nimo runs fully locally on your device, we do not require you to create an account, register, or provide an email address. We do not collect or store any of the following:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>Your name, email address, or contact details.</li>
            <li>Your journal entries, notes, or reflections (these stay in your local database).</li>
            <li>Your daily and weekly streak activity.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-primary font-bold text-[22px] mb-3 tracking-tight">2. Local Storage</h2>
          <p className="mb-4">
            Your data is stored securely using local on-device database systems (SQLite and MMKV). This data can only be accessed through the Nimo application on your physical device.
          </p>
          <p className="font-semibold text-primary">
            Important Note: If you delete the Nimo application from your device, all of your saved entries and settings will be permanently lost, as we do not keep backups on our servers.
          </p>
        </div>

        <div>
          <h2 className="text-primary font-bold text-[22px] mb-3 tracking-tight">3. Third-Party Services</h2>
          <p className="mb-4">
            We do not sell, trade, or otherwise transfer your personal data to third parties. We do not use third-party tracking, analytics, or advertisement SDKs that harvest user behavioral data.
          </p>
        </div>

        <div>
          <h2 className="text-primary font-bold text-[22px] mb-3 tracking-tight">4. Security</h2>
          <p className="mb-4">
            Since your data resides entirely on your device, the security of your journal entries relies on your device's security. We recommend setting a secure PIN/passcode or utilizing biometric lock features on your phone to prevent unauthorized access to your device.
          </p>
        </div>

        <div>
          <h2 className="text-primary font-bold text-[22px] mb-3 tracking-tight">5. Contact Us</h2>
          <p>
            If you have any questions or feedback regarding this Privacy Policy, feel free to contact us at{' '}
            <span className="text-sage font-semibold">privacy@nimo.app</span>.
          </p>
        </div>
      </section>
    </article>
  );
}
