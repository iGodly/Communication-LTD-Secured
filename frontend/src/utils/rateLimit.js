const MAX_ATTEMPTS = 3;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

class RateLimiter {
  constructor() {
    this.attempts = new Map();
  }

  isBlocked(key) {
    const attemptData = this.attempts.get(key);
    if (!attemptData) return false;

    if (attemptData.blockedUntil && Date.now() < attemptData.blockedUntil) {
      return true;
    }

    if (attemptData.count >= MAX_ATTEMPTS) {
      attemptData.blockedUntil = Date.now() + LOCKOUT_DURATION;
      return true;
    }

    return false;
  }

  recordAttempt(key) {
    const attemptData = this.attempts.get(key) || { count: 0 };
    attemptData.count++;
    this.attempts.set(key, attemptData);
  }

  resetAttempts(key) {
    this.attempts.delete(key);
  }

  getRemainingAttempts(key) {
    const attemptData = this.attempts.get(key);
    if (!attemptData) return MAX_ATTEMPTS;
    return Math.max(0, MAX_ATTEMPTS - attemptData.count);
  }

  getBlockedUntil(key) {
    const attemptData = this.attempts.get(key);
    if (!attemptData || !attemptData.blockedUntil) return null;
    return attemptData.blockedUntil;
  }
}

export const loginRateLimiter = new RateLimiter(); 