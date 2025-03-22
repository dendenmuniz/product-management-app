// setupTests.ts
import "@testing-library/jest-dom";

// Polyfill for TextEncoder and TextDecoder
if (typeof global.TextEncoder === "undefined") {
  global.TextEncoder = class {
    encode(input?: string): Uint8Array {
      // Simple implementation for demonstration
      return new Uint8Array(Buffer.from(input || "", "utf-8"));
    }
  } as typeof TextEncoder;
}

if (typeof global.TextDecoder === "undefined") {
  global.TextDecoder = class {
    private encoding: BufferEncoding; // Use BufferEncoding type

    constructor(encoding: BufferEncoding = "utf8") {
      this.encoding = encoding;
    }

    decode(input?: ArrayBuffer | ArrayBufferView | null): string {
      // Ensure input is treated as Uint8Array
      return Buffer.from(input as Uint8Array).toString(this.encoding);
    }
  } as unknown as typeof TextDecoder;
}
