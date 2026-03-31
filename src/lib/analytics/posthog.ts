// PostHog Analytics — No-op stubs
// These are safe no-ops that do nothing until posthog-js is installed.
// To enable: npm install posthog-js, then replace this file with the real implementation.

export function initPostHog() {
  // no-op
}

export function trackVisitor(_pathname: string, _properties?: Record<string, unknown>) {
  // no-op
}

export function trackButtonClick(_buttonName: string, _properties?: Record<string, unknown>) {
  // no-op
}

export function trackEvent(_eventName: string, _properties?: Record<string, unknown>) {
  // no-op
}

export function identifyUser(_userId: string, _properties?: Record<string, unknown>) {
  // no-op
}

export function resetIdentity() {
  // no-op
}
