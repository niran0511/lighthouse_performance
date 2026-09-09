import { describe, expect, it } from 'vitest';
import { parsePublicHttpUrl, validatePublicTarget } from '../src/utils/url-safety.js';

describe('public URL safety', () => {
  it('accepts absolute public HTTP(S) URLs', () => {
    expect(parsePublicHttpUrl('https://example.com/path').toString()).toBe('https://example.com/path');
    expect(parsePublicHttpUrl('http://example.com').protocol).toBe('http:');
  });

  it.each(['', 'example.com', 'javascript:alert(1)', 'file:///etc/passwd', 'data:text/plain,no', 'http://localhost', 'http://127.0.0.1'])('rejects unsafe or invalid values: %s', (url) => {
    expect(() => parsePublicHttpUrl(url)).toThrow();
  });

  it('rejects a host that resolves to a private IP', async () => {
    const lookup = async () => [{ address: '10.0.0.8', family: 4 }];
    await expect(validatePublicTarget('https://public-looking.example', lookup)).rejects.toThrow('not allowed');
  });

  it('allows a host that resolves to a public IP', async () => {
    const lookup = async () => [{ address: '93.184.216.34', family: 4 }];
    await expect(validatePublicTarget('https://example.com', lookup)).resolves.toBe('https://example.com/');
  });
});

