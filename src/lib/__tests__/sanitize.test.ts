import { describe, it, expect } from 'vitest';

import { sanitizeHtml, sanitizeUrl, sanitizeText, sanitizeAttribute, sanitizeClassName } from '../sanitize';

describe('sanitizeHtml', () => {
  it('allows safe HTML', () => {
    const html = '<p>Hello <strong>world</strong></p>';
    const result = sanitizeHtml(html);
    expect(result).toContain('<p>');
    expect(result).toContain('<strong>');
    expect(result).toContain('Hello');
  });

  it('removes dangerous scripts', () => {
    const html = '<p>Hello</p><script>alert("XSS")</script>';
    const result = sanitizeHtml(html);
    expect(result).not.toContain('<script>');
    expect(result).not.toContain('alert');
    expect(result).toContain('Hello');
  });

  it('removes event handlers', () => {
    const html = '<div onclick="alert(\'XSS\')">Click me</div>';
    const result = sanitizeHtml(html);
    expect(result).not.toContain('onclick');
    expect(result).not.toContain('alert');
  });

  it('removes javascript: URLs', () => {
    const html = '<a href="javascript:alert(\'XSS\')">Link</a>';
    const result = sanitizeHtml(html);
    expect(result).not.toContain('javascript:');
  });

  it('allows data URLs for images', () => {
    const html = '<img src="data:image/png;base64,iVBORw0KGgo=" alt="test" />';
    const result = sanitizeHtml(html);
    expect(result).toContain('data:image');
  });
});

describe('sanitizeUrl', () => {
  it('allows safe HTTP URLs', () => {
    expect(sanitizeUrl('https://example.com')).toBe('https://example.com');
    expect(sanitizeUrl('http://example.com')).toBe('http://example.com');
  });

  it('allows relative URLs', () => {
    expect(sanitizeUrl('/path/to/page')).toBe('/path/to/page');
    expect(sanitizeUrl('./relative')).toBe('./relative');
  });

  it('blocks javascript: URLs', () => {
    expect(sanitizeUrl('javascript:alert("XSS")')).toBe('about:blank');
  });

  it('blocks data: URLs', () => {
    expect(sanitizeUrl('data:text/html,<script>alert("XSS")</script>')).toBe('about:blank');
  });

  it('blocks vbscript: URLs', () => {
    expect(sanitizeUrl('vbscript:msgbox("XSS")')).toBe('about:blank');
  });

  it('handles null and undefined', () => {
    expect(sanitizeUrl(null as any)).toBe('about:blank');
    expect(sanitizeUrl(undefined as any)).toBe('about:blank');
  });
});

describe('sanitizeText', () => {
  it('escapes HTML entities', () => {
    expect(sanitizeText('<script>alert("XSS")</script>')).toBe('&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;');
  });

  it('escapes special characters', () => {
    expect(sanitizeText('Hello & "world" <tag>')).toContain('&amp;');
    expect(sanitizeText('Hello & "world" <tag>')).toContain('&quot;');
    expect(sanitizeText('Hello & "world" <tag>')).toContain('&lt;');
    expect(sanitizeText('Hello & "world" <tag>')).toContain('&gt;');
  });

  it('handles empty strings', () => {
    expect(sanitizeText('')).toBe('');
  });
});

describe('sanitizeAttribute', () => {
  it('removes dangerous characters', () => {
    expect(sanitizeAttribute('normal-value')).toBe('normal-value');
    expect(sanitizeAttribute('value with spaces')).toBe('value with spaces');
  });

  it('removes quotes and brackets', () => {
    const dangerous = 'value"with\'quotes<and>brackets';
    const result = sanitizeAttribute(dangerous);
    expect(result).not.toContain('"');
    expect(result).not.toContain("'");
    expect(result).not.toContain('<');
    expect(result).not.toContain('>');
  });
});

describe('sanitizeClassName', () => {
  it('allows valid CSS class names', () => {
    expect(sanitizeClassName('btn btn-primary')).toBe('btn btn-primary');
    expect(sanitizeClassName('text-lg font-bold')).toBe('text-lg font-bold');
  });

  it('removes invalid characters', () => {
    const result = sanitizeClassName('class<script>alert()</script>');
    expect(result).not.toContain('<');
    expect(result).not.toContain('>');
    expect(result).not.toContain('script');
  });

  it('preserves hyphens and underscores', () => {
    expect(sanitizeClassName('my-class_name')).toBe('my-class_name');
  });
});

