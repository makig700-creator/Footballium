import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

Object.assign(global, { TextDecoder, TextEncoder });

// Polyfill Request/Response for JSDOM which removes them
if (typeof Request === 'undefined') {
  global.Request = class Request {} as any;
  global.Response = class Response {
    status: number;
    constructor(body?: any, init?: any) {
      this.status = init?.status || 200;
    }
    json() { return Promise.resolve({}); }
    static json(data: any) {
      const res = new Response();
      res.json = () => Promise.resolve(data);
      return res;
    }
  } as any;
  global.Headers = class Headers {
    get() { return null; }
    set() {}
  } as any;
  global.fetch = jest.fn(() => Promise.resolve({
    json: () => Promise.resolve({})
  })) as any;
}

// Global mock for next-auth to prevent transpilation errors
jest.mock('next-auth/react', () => {
  return {
    useSession: jest.fn(() => ({ data: null, status: 'unauthenticated' })),
    signIn: jest.fn(),
    signOut: jest.fn(),
  };
});
