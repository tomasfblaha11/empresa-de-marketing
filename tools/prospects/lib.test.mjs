import { test } from 'node:test';
import assert from 'node:assert/strict';
import { classifyWebsite, scoreProspect, toProspect, mergeProspect, toCsv } from './lib.mjs';

test('classifyWebsite', () => {
  assert.equal(classifyWebsite(''), 'none');
  assert.equal(classifyWebsite(undefined), 'none');
  assert.equal(classifyWebsite('https://www.facebook.com/joeslandscaping'), 'social');
  assert.equal(classifyWebsite('https://m.facebook.com/x'), 'social');
  assert.equal(classifyWebsite('https://joes.business.site/'), 'dead');
  assert.equal(classifyWebsite('https://www.bookabach.co.nz/123'), 'listing');
  assert.equal(classifyWebsite('https://www.airbnb.co.nz/rooms/1'), 'listing');
  assert.equal(classifyWebsite('https://joe.wixsite.com/landscaping'), 'builder');
  assert.equal(classifyWebsite('https://joeslandscaping.co.nz'), 'own');
  assert.equal(classifyWebsite('not a url'), 'none');
});

test('no website with many reviews is tier A', () => {
  const r = scoreProspect({ websiteType: 'none', userRatingCount: 34, rating: 4.8, phone: '021 123' });
  assert.equal(r.tier, 'A');
  assert.equal(r.score, 65);
});

test('good own site is tier C, slow non-mobile own site is tier A', () => {
  const p = { websiteType: 'own', userRatingCount: 25, rating: 4.2, phone: '09 555' };
  assert.equal(scoreProspect(p, { reachable: true, https: true, mobileFriendly: true, performance: 92, seo: 95 }).tier, 'C');
  const bad = scoreProspect(p, { reachable: true, https: false, mobileFriendly: false, performance: 31, seo: 70 });
  assert.equal(bad.tier, 'A');
  assert.ok(bad.reasons.includes('no adaptada a móvil'));
});

test('unreachable own site scores high; tiny business without phone scores low', () => {
  assert.equal(scoreProspect({ websiteType: 'own', userRatingCount: 10, phone: 'x' }, { reachable: false }).score, 55);
  assert.equal(scoreProspect({ websiteType: 'own', userRatingCount: 1, phone: '' }).score, 0);
});

test('toProspect + mergeProspect dedupe by placeId', () => {
  const place = { id: 'p1', displayName: { text: 'Bay Landscapes' }, nationalPhoneNumber: '07 1', userRatingCount: 12 };
  const map = new Map();
  mergeProspect(map, toProspect(place, 'paving-landscaping', 'landscaping', 'Tauranga'));
  mergeProspect(map, toProspect(place, 'paving-landscaping', 'landscape design', 'Tauranga'));
  assert.equal(map.size, 1);
  const p = map.get('p1');
  assert.equal(p.websiteType, 'none');
  assert.deepEqual(p.queries, ['landscaping @ Tauranga', 'landscape design @ Tauranga']);
});

test('toCsv escapes', () => {
  assert.equal(toCsv([{ a: 'x,y', b: ['1', '2'] }], ['a', 'b']), 'a,b\n"x,y",1 | 2\n');
});

test('unknown review count (OpenStreetMap) is not penalised', () => {
  const r = scoreProspect({ websiteType: 'none', userRatingCount: null, phone: '03 1' });
  assert.equal(r.score, 40);
  assert.equal(r.tier, 'B');
});
