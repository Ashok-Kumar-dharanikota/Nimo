import React from 'react';
import { View, Text } from 'react-native';

export default function TermsOfServiceWeb() {
  return (
    <article className="max-w-3xl mx-auto py-6">
      <header className="mb-10 pb-6 border-b border-surfaceContainer">
        <h1 className="font-jakarta text-[36px] font-bold text-primary tracking-tight mb-3">
          Terms of Service
        </h1>
        <p className="font-jakarta text-[14px] text-onSurfaceVariant/60">
          Last Updated: July 30, 2026
        </p>
      </header>

      <section className="space-y-8 font-jakarta text-[16px] leading-[26px] text-onSurfaceVariant">
        <div>
          <h2 className="text-primary font-bold text-[22px] mb-3 tracking-tight">1. Acceptance of Terms</h2>
          <p className="mb-4">
            By downloading, installing, or using the Nimo application, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the application.
          </p>
        </div>

        <div>
          <h2 className="text-primary font-bold text-[22px] mb-3 tracking-tight">2. Description of Service</h2>
          <p className="mb-4">
            Nimo is a local-first mindfulness and micro-journaling application designed to help you track habits, set intentions, and reflect on your days.
          </p>
        </div>

        <div>
          <h2 className="text-primary font-bold text-[22px] mb-3 tracking-tight">3. Data Ownership and Local Storage</h2>
          <p className="mb-4">
            All data created, recorded, or inputted by you in Nimo (including journal entries, streak dates, intentions) is stored locally on your device. We do not own, access, or control this data.
          </p>
          <div className="bg-surfaceContainerLow border border-outlineVariant/40 rounded-2xl p-6 mb-6">
            <h3 className="text-primary font-semibold text-[18px] mb-2">Google Sign-In & AI Features</h3>
            <p className="text-[15px] text-onSurfaceVariant mb-3">
              If you choose to use Google Sign-In, your basic profile information is saved securely on your device for personalizing your experience and enabling future personal cloud backups. We do not collect this on our servers.
            </p>
            <p className="text-[15px] text-onSurfaceVariant">
              Additionally, all Artificial Intelligence (AI) features (like chat and semantic search) are executed locally on your device using on-device models. Your journal entries are never sent to third-party AI services.
            </p>
          </div>
          <div className="bg-surfaceContainerLow border border-outlineVariant/40 rounded-2xl p-6 mb-6">
            <h3 className="text-primary font-semibold text-[18px] mb-2">No Cloud Recovery</h3>
            <p className="text-[15px] text-onSurfaceVariant">
              Since we do not store your data on our servers, we have no way to recover your data if your device is lost, stolen, damaged, or if the Nimo app is uninstalled (unless you have explicitly configured a personal cloud backup). You are solely responsible for managing and safeguarding your device and data.
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-primary font-bold text-[22px] mb-3 tracking-tight">4. Prohibited Uses</h2>
          <p className="mb-4">
            You agree to use the application only for lawful purposes. You shall not attempt to reverse engineer, decompile, or copy the source code of the application without explicit permission.
          </p>
        </div>

        <div>
          <h2 className="text-primary font-bold text-[22px] mb-3 tracking-tight">5. Disclaimer of Warranties</h2>
          <p className="mb-4">
            The application is provided "as is" and "as available" without warranties of any kind, either express or implied. Nimo does not warrant that the application will be error-free, uninterrupted, or that data loss will not occur.
          </p>
        </div>

        <div>
          <h2 className="text-primary font-bold text-[22px] mb-3 tracking-tight">6. Changes to Terms</h2>
          <p className="mb-4">
            We reserve the right to modify these Terms of Service at any time. We will indicate changes by updating the "Last Updated" date at the top of this document.
          </p>
        </div>

        <div>
          <h2 className="text-primary font-bold text-[22px] mb-3 tracking-tight">7. Contact Information</h2>
          <p>
            If you have any questions about these Terms, please contact us at{' '}
            <span className="text-sage font-semibold">ashok.d.paul@gmail.com</span>.
          </p>
        </div>
      </section>
    </article>
  );
}
