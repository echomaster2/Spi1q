# SPI Master Ultrasound Physics - Commercialization Phased Roadmap

This plan outlines the strategic transition of the SPI Master application from a development prototype to a production-ready commercial platform.

## Phase 1: High-Availability Infrastructure & Persistence (Foundation)
**Goal**: Ensure user data is persistent, secure, and accessible across devices.
- [x] **Firebase Integration**: Primary database and authentication layer established.
- [x] **Security Hardening**: Implementation of Zero-Trust Firestore Security Rules.
- [ ] **State Migration**: Port current localState logic to Firebase-synced repositories.
- [ ] **Error Monitoring**: Integrate Sentry or similar for real-time crash reporting.

## Phase 2: Personalized Learning & AI (Product Differentiation)
**Goal**: Leverage AI to provide a unique "Tutor" experience that justifies a subscription.
- [ ] **Personalized Study Paths**: Analyze quiz results to flag weak areas (e.g., Doppler Shift) and prioritize related modules.
- [ ] **AI-Generated Clinical Scenarios**: Daily dynamic cases created by Gemini based on real ultrasound datasets.
- [ ] **Interactive Voice Tutor**: Full integration of TTS/STT for hands-free clinical review.

## Phase 3: Monetization & Growth (Commercial Launch)
**Goal**: Generate revenue and scale the user base.
- [ ] **Tiered Subscription Model**:
  - **Free**: 3 Basic Modules + Daily Insight.
  - **Pro**: Full Library + AI Tutor + Registry Simulator + PDF Study Guides.
  - **Institutional**: Group licensing for Diagnostic Medical Sonography (DMS) schools.
- [ ] **Stripe Checkout Integration**: Secure payment processing for Pro upgrades.
- [ ] **SEO & Analytics**: Optimize for terms like "SPI Exam Prep" and "Ultrasound Physics ARDMS".

## Phase 4: Platform Maturity (Mobile & Offline)
**Goal**: Provide a seamless experience for sonographers on-the-go.
- [ ] **PWA/Capacitor Optimization**: Native-feel mobile app builds.
- [ ] **Offline Mode**: Local caching of lesson content and images for use in hospital basement clinics.
- [ ] **Content CMS**: Admin Dashboard for adding new modules without code changes.

---

### Immediate Next Steps
1. **User Authentication UI**: Add a "Login to Save Progress" prompt in the User Profile section.
2. **Sync Hook**: Create a `useSyncProgress` custom hook to handle the bridge between React state and Firestore.
3. **Admin Dashboard**: Populate the `AdminDashboard.tsx` with tools to manage the `glossary` and `flashcards` collections.
