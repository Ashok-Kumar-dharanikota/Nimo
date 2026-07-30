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
          Last Updated: July 30, 2026
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
            Nimo offers an optional Google Sign-In feature to personalize your experience and facilitate personal cloud backups (like Google Drive). When you sign in, we receive your basic profile information (name, email address, and profile picture).
          </p>
          <p className="mb-4 font-semibold text-primary">
            Crucially, this information is only stored locally on your device. We do not transmit, collect, or store this personal information on our remote servers.
          </p>
          <p className="mb-4">
            If you choose not to sign in, we do not collect any personal information whatsoever. In all cases, your journal entries, notes, reflections, and streak activity stay solely in your local database.
          </p>
        </div>

        <div>
          <h2 className="text-primary font-bold text-[22px] mb-3 tracking-tight">2. Local Storage & AI Processing</h2>
          <p className="mb-4">
            Your data is stored securely using local on-device database systems (SQLite and MMKV). This data can only be accessed through the Nimo application on your physical device.
          </p>
          <p className="mb-4">
            <strong className="text-primary">Local AI Guarantee:</strong> All AI features (including natural language chat and semantic search) process your journal entries entirely on your local device. Your private data is never sent to external AI servers (like OpenAI or Anthropic).
          </p>
          <p className="font-semibold text-primary">
            Important Note: If you delete the Nimo application from your device without setting up personal cloud backups, all of your saved entries and settings will be permanently lost, as we do not keep backups on our servers.
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
            <span className="text-sage font-semibold">ashok.d.paul@gmail.com</span>.
          </p>
        </div>
      </section>
    </article>
  );
}
