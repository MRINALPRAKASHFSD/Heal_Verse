import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { NextRequest } from 'next/server';
import { GET } from '@/app/api/me/route';

describe('/api/me handler', () => {
  it('returns 401 Unauthorized when request has no active session', async () => {
    const request = new NextRequest('http://localhost:3000/api/me', {
      method: 'GET',
    });

    const response = await GET(request);
    assert.equal(response.status, 401);
    const body = await response.json();
    assert.equal(body.error.code, 'unauthorized');
    assert.equal(body.error.message, 'Not authenticated');
  });
});
