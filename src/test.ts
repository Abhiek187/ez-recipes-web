import 'fake-indexeddb/auto';
import { vi } from 'vitest';

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

globalThis.PublicKeyCredential = class {
  authenticatorAttachment = '';
  rawId = new ArrayBuffer();
  response = {
    clientDataJSON: new ArrayBuffer(),
  };
  getClientExtensionResults = () => ({});
  toJSON = () => ({});
  id = '';
  type = '';

  static async isUserVerifyingPlatformAuthenticatorAvailable() {
    return true;
  }
  static async isConditionalMediationAvailable() {
    return true;
  }

  static async getClientCapabilities() {
    return {};
  }

  static parseCreationOptionsFromJSON() {
    return {
      challenge: new ArrayBuffer(),
      rp: {
        name: 'EZ Recipes Web',
        id: location.hostname,
      },
      user: {
        id: new ArrayBuffer(),
        name: 'test@email.com',
        displayName: '',
      },
      pubKeyCredParams: [
        { alg: -8, type: 'public-key' as const },
        { alg: -7, type: 'public-key' as const },
        { alg: -257, type: 'public-key' as const },
      ],
      timeout: 60_000,
      excludeCredentials: [
        {
          id: new ArrayBuffer(),
          transports: [],
          type: 'public-key' as const,
        },
      ],
      authenticatorSelection: {
        requireResidentKey: true,
      },
      extensions: {
        credProps: true,
      },
      hints: [],
    };
  }

  static parseRequestOptionsFromJSON() {
    return {
      rpId: location.hostname,
      challenge: new ArrayBuffer(),
      allowCredentials: [
        {
          id: new ArrayBuffer(),
          transports: [],
          type: 'public-key' as const,
        },
      ],
      timeout: 60_000,
    };
  }
};

Object.defineProperty(navigator, 'credentials', {
  value: {
    create: async () => Promise.resolve({ id: 'mock-id' }),
    get: async () => Promise.resolve({ id: 'mock-id' }),
  },
  writable: true,
});
