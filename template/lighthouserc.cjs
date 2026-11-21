// Lighthouse CI thresholds from CLAUDE.md (mobile). Demos are noindex on purpose, so for them
// the SEO category is replaced by each SEO audit except "is-crawlable".
const client = require('./src/data/client.json');

const seoAudits = ['document-title', 'meta-description', 'http-status-code', 'link-text',
  'crawlable-anchors', 'image-alt', 'hreflang', 'canonical', 'robots-txt'];

module.exports = {
  ci: {
    collect: {
      staticDistDir: './dist',
      url: ['/', '/privacy/'],
      numberOfRuns: 1,
      settings: { chromeFlags: '--headless=new --no-sandbox' },
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:best-practices': ['error', { minScore: 0.95 }],
        ...(client.demo
          ? Object.fromEntries(seoAudits.map((a) => [a, client.demo && a === 'robots-txt' ? 'off' : 'error']))
          : { 'categories:seo': ['error', { minScore: 0.95 }] }),
      },
    },
    upload: { target: 'filesystem', outputDir: '.lighthouseci' },
  },
};
