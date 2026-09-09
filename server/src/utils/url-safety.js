import dns from 'node:dns/promises';
import net from 'node:net';
import { AppError } from './app-error.js';

const blockedHostnames = new Set(['localhost', 'localhost.localdomain', 'metadata.google.internal']);

function ipv4ToNumber(address) {
  return address.split('.').reduce((total, part) => (total * 256) + Number(part), 0);
}

function isPrivateIpv4(address) {
  const value = ipv4ToNumber(address);
  const inRange = (start, bits) => (value >>> (32 - bits)) === (start >>> (32 - bits));
  return inRange(0x00000000, 8)
    || inRange(0x0a000000, 8)
    || inRange(0x64400000, 10)
    || inRange(0x7f000000, 8)
    || inRange(0xa9fe0000, 16)
    || inRange(0xac100000, 12)
    || inRange(0xc0a80000, 16)
    || inRange(0xc6120000, 15)
    || inRange(0xe0000000, 4);
}

function isBlockedAddress(address) {
  const family = net.isIP(address);
  if (family === 4) return isPrivateIpv4(address);
  if (family === 6) {
    const normalized = address.toLowerCase();
    return normalized === '::1'
      || normalized === '::'
      || normalized.startsWith('fc')
      || normalized.startsWith('fd')
      || normalized.startsWith('fe80:')
      || normalized.startsWith('::ffff:127.')
      || normalized.startsWith('::ffff:10.')
      || normalized.startsWith('::ffff:192.168.');
  }
  return true;
}

export function parsePublicHttpUrl(value) {
  if (typeof value !== 'string' || !value.trim()) {
    throw new AppError('A website URL is required.', 400, 'URL_REQUIRED');
  }

  let url;
  try {
    url = new URL(value.trim());
  } catch {
    throw new AppError('Enter a valid absolute HTTP or HTTPS URL.', 400, 'INVALID_URL');
  }

  if (!['http:', 'https:'].includes(url.protocol)) {
    throw new AppError('Only HTTP and HTTPS URLs can be scanned.', 400, 'UNSUPPORTED_URL_PROTOCOL');
  }
  if (url.username || url.password) {
    throw new AppError('URLs containing credentials cannot be scanned.', 400, 'UNSAFE_URL');
  }

  const hostname = url.hostname.toLowerCase().replace(/\.$/, '');
  if (!hostname || blockedHostnames.has(hostname) || hostname.endsWith('.local')) {
    throw new AppError('This destination is not allowed for scanning.', 400, 'UNSAFE_URL');
  }
  if (net.isIP(hostname) && isBlockedAddress(hostname)) {
    throw new AppError('Private or local network destinations cannot be scanned.', 400, 'UNSAFE_URL');
  }

  return url;
}

export async function validatePublicTarget(value, lookup = dns.lookup) {
  const url = parsePublicHttpUrl(value);
  const hostname = url.hostname;
  if (net.isIP(hostname)) return url.toString();

  let records;
  try {
    records = await lookup(hostname, { all: true, verbatim: true });
  } catch {
    throw new AppError('The website hostname could not be resolved.', 422, 'URL_UNREACHABLE');
  }

  if (!records.length || records.some((record) => isBlockedAddress(record.address))) {
    throw new AppError('This destination is not allowed for scanning.', 400, 'UNSAFE_URL');
  }

  return url.toString();
}

