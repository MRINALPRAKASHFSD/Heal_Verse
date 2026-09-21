import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

const BASE_URL = 'http://localhost:3000';

describe('End-to-End Authenticated Conversation Persistence (Live API)', () => {
  const timestamp = Date.now();
  const userA = {
    name: `User A ${timestamp}`,
    email: `usera_${timestamp}@example.com`,
    password: 'Password123!',
  };
  const userB = {
    name: `User B ${timestamp}`,
    email: `userb_${timestamp}@example.com`,
    password: 'Password123!',
  };

  let userACookie = '';
  let userBCookie = '';
  let conversationAId = '';
  let messageAId = '';

  it('Step 1: Register User A and receive session cookie', async () => {
    const res = await fetch(`${BASE_URL}/api/auth/sign-up/email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: BASE_URL,
      },
      body: JSON.stringify(userA),
    });

    assert.equal(res.status, 200);
    const setCookie = res.headers.get('set-cookie');
    assert.ok(setCookie, 'Expected set-cookie header');
    userACookie = setCookie.split(';')[0];
    const data = await res.json();
    assert.equal(data.user.email, userA.email);
  });

  it('Step 2: Verify authenticated /api/me for User A', async () => {
    const res = await fetch(`${BASE_URL}/api/me`, {
      headers: { Cookie: userACookie },
    });

    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.user.email, userA.email);
    assert.ok(data.session.id);
  });

  it('Step 3: User A creates a conversation, ignoring client-supplied userId', async () => {
    const res = await fetch(`${BASE_URL}/api/conversations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: userACookie,
      },
      body: JSON.stringify({
        title: 'User A Health Check',
        userId: '99999999-9999-4999-8999-999999999999', // should be ignored
      }),
    });

    assert.equal(res.status, 200);
    const data = await res.json();
    conversationAId = data.conversation.id;
    assert.equal(data.conversation.title, 'User A Health Check');
    assert.ok(data.conversation.participantIds.length > 0);
    assert.notEqual(data.conversation.participantIds[0], '99999999-9999-4999-8999-999999999999');
  });

  it('Step 4: User A posts a message to Conversation A', async () => {
    const res = await fetch(`${BASE_URL}/api/conversations/${conversationAId}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: userACookie,
      },
      body: JSON.stringify({
        content: 'I have had a mild headache for two days.',
      }),
    });

    assert.equal(res.status, 200);
    const data = await res.json();
    assert.ok(data.message);
    assert.equal(data.message.content, 'I have had a mild headache for two days.');
    messageAId = data.message.id;
  });

  it('Step 5: User A retrieves messages for Conversation A (persisted in database)', async () => {
    const res = await fetch(`${BASE_URL}/api/conversations/${conversationAId}/messages`, {
      headers: { Cookie: userACookie },
    });

    assert.equal(res.status, 200);
    const data = await res.json();
    assert.ok(data.items.length >= 1);
    const found = data.items.some((msg: { id: string }) => msg.id === messageAId);
    assert.equal(found, true);
  });

  it('Step 6: Register User B and verify cross-user isolation', async () => {
    const res = await fetch(`${BASE_URL}/api/auth/sign-up/email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: BASE_URL,
      },
      body: JSON.stringify(userB),
    });

    assert.equal(res.status, 200);
    const setCookie = res.headers.get('set-cookie');
    assert.ok(setCookie);
    userBCookie = setCookie.split(';')[0];
  });

  it('Step 7: User B cannot list, retrieve, update, delete, or message Conversation A', async () => {
    // 1. User B lists conversations -> should be empty
    const listRes = await fetch(`${BASE_URL}/api/conversations`, {
      headers: { Cookie: userBCookie },
    });
    assert.equal(listRes.status, 200);
    const listData = await listRes.json();
    assert.equal(listData.items.length, 0);

    // 2. User B tries to retrieve Conversation A -> 403
    const getRes = await fetch(`${BASE_URL}/api/conversations/${conversationAId}`, {
      headers: { Cookie: userBCookie },
    });
    assert.equal(getRes.status, 403);

    // 3. User B tries to update Conversation A -> 403
    const patchRes = await fetch(`${BASE_URL}/api/conversations/${conversationAId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Cookie: userBCookie,
      },
      body: JSON.stringify({ title: 'Hacked Title' }),
    });
    assert.equal(patchRes.status, 403);

    // 4. User B tries to delete Conversation A -> 403
    const delRes = await fetch(`${BASE_URL}/api/conversations/${conversationAId}`, {
      method: 'DELETE',
      headers: { Cookie: userBCookie },
    });
    assert.equal(delRes.status, 403);

    // 5. User B tries to read messages of Conversation A -> 403
    const getMsgRes = await fetch(`${BASE_URL}/api/conversations/${conversationAId}/messages`, {
      headers: { Cookie: userBCookie },
    });
    assert.equal(getMsgRes.status, 403);

    // 6. User B tries to post message to Conversation A -> 403
    const postMsgRes = await fetch(`${BASE_URL}/api/conversations/${conversationAId}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: userBCookie,
      },
      body: JSON.stringify({ content: 'Malicious message from User B' }),
    });
    assert.equal(postMsgRes.status, 403);
  });

  it('Step 8: User A signs out and session is invalidated', async () => {
    const res = await fetch(`${BASE_URL}/api/auth/sign-out`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: userACookie,
        Origin: BASE_URL,
      },
      body: JSON.stringify({}),
    });

    assert.equal(res.status, 200);

    // Protected endpoints must reject with 401
    const meRes = await fetch(`${BASE_URL}/api/me`, {
      headers: { Cookie: userACookie },
    });
    assert.equal(meRes.status, 401);

    const convRes = await fetch(`${BASE_URL}/api/conversations`, {
      headers: { Cookie: userACookie },
    });
    assert.equal(convRes.status, 401);
  });

  it('Step 9: User A logs back in and recovers conversation and messages', async () => {
    const res = await fetch(`${BASE_URL}/api/auth/sign-in/email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: BASE_URL,
      },
      body: JSON.stringify({
        email: userA.email,
        password: userA.password,
      }),
    });

    assert.equal(res.status, 200);
    const setCookie = res.headers.get('set-cookie');
    assert.ok(setCookie);
    const newCookie = setCookie.split(';')[0];

    // Recover conversation list
    const convListRes = await fetch(`${BASE_URL}/api/conversations`, {
      headers: { Cookie: newCookie },
    });
    assert.equal(convListRes.status, 200);
    const convListData = await convListRes.json();
    assert.ok(convListData.items.length >= 1);
    const foundConv = convListData.items.find((c: { id: string }) => c.id === conversationAId);
    assert.ok(foundConv, 'Expected to recover Conversation A');
    assert.equal(foundConv.title, 'User A Health Check');

    // Recover messages
    const msgListRes = await fetch(`${BASE_URL}/api/conversations/${conversationAId}/messages`, {
      headers: { Cookie: newCookie },
    });
    assert.equal(msgListRes.status, 200);
    const msgListData = await msgListRes.json();
    const foundMsg = msgListData.items.find((m: { id: string }) => m.id === messageAId);
    assert.ok(foundMsg, 'Expected to recover Message A');
    assert.equal(foundMsg.content, 'I have had a mild headache for two days.');
  });
});
