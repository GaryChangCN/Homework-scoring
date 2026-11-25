'use strict';

const assert = require('node:assert/strict');
const { once } = require('node:events');
const test = require('node:test');
const { randomUUID } = require('node:crypto');
const { request } = require('node:http');
const { MongoClient } = require('mongodb');
const { createDatabase } = require('../lib/database');
const app = require('../app');

function get(server, path, cookie, compressed = false) {
    return new Promise((resolve, reject) => {
        const headers = {};
        if (cookie) headers.cookie = cookie;
        if (compressed) headers['accept-encoding'] = 'gzip';
        request({ host: '127.0.0.1', port: server.address().port, path, headers }, response => {
            const parts = [];
            response.on('data', part => parts.push(part));
            response.on('end', () => resolve({
                status: response.statusCode,
                headers: response.headers,
                body: Buffer.concat(parts),
            }));
            response.on('error', reject);
        }).on('error', reject).end();
    });
}

test('application serves guest page with compression and redirects guests from protected routes', async t => {
    const server = app.listen(0, '127.0.0.1');
    t.after(() => server.close());
    await once(server, 'listening');
    const page = await get(server, '/', null, true);
    assert.equal(page.status, 200);
    assert.equal(page.headers['content-encoding'], 'gzip');
    assert.match(require('node:zlib').gunzipSync(page.body).toString(), /<html/i);
    const protectedPage = await get(server, '/myHomeWork.html');
    assert.equal(protectedPage.status, 301);
    assert.equal(protectedPage.headers.location, '/');
});

test('MongoDB-backed student login and group read/write', { skip: !process.env.MONGODB_TEST_URI }, async t => {
    const uri = process.env.MONGODB_TEST_URI;
    assert.match(uri, /^mongodb:\/\/(?:127\.0\.0\.1|localhost):\d+\/?$/);
    const name = 'homework_dependency_smoke_' + randomUUID().replaceAll('-', '');
    const client = await MongoClient.connect(uri);
    const db = client.db(name);
    const previousUri = process.env.MONGODB_URI;
    const previousName = process.env.MONGODB_DATABASE;
    process.env.MONGODB_URI = uri;
    process.env.MONGODB_DATABASE = name;
    t.after(async () => {
        await db.dropDatabase();
        await client.close();
        if (previousUri === undefined) delete process.env.MONGODB_URI;
        else process.env.MONGODB_URI = previousUri;
        if (previousName === undefined) delete process.env.MONGODB_DATABASE;
        else process.env.MONGODB_DATABASE = previousName;
    });
    await db.collection('byName').insertOne({ name: 'Smoke Student', id: 'test-1', groupName: 'Sandbox' });
    await db.collection('byGroup').insertOne({ groupName: 'Sandbox', synthetic: true });
    const server = app.listen(0, '127.0.0.1');
    t.after(() => server.close());
    await once(server, 'listening');
    const login = await get(server, '/Tlogin?username=Smoke%20Student&password=test-1');
    assert.equal(login.status, 301);
    assert.equal(login.headers.location, '/myHomeWork.html');
    const cookie = login.headers['set-cookie'].map(value => value.split(';')[0]).join('; ') + '; userId=test-1';
    const information = await get(server, '/Tinformation', cookie);
    assert.equal(information.status, 200);
    assert.equal(JSON.parse(information.body).groupName, 'Sandbox');

    const adapter = createDatabase();
    t.after(() => adapter.close());
    await new Promise((resolve, reject) => adapter.open(error => error ? reject(error) : resolve()));
    const groups = await new Promise((resolve, reject) => adapter.collection('byGroup', (error, value) => error ? reject(error) : resolve(value)));
    await new Promise((resolve, reject) => groups.update({ groupName: 'Sandbox' }, { groupName: 'Sandbox', synthetic: false }, error => error ? reject(error) : resolve()));
    const rows = await new Promise((resolve, reject) => groups.find({ groupName: 'Sandbox' }).toArray((error, value) => error ? reject(error) : resolve(value)));
    assert.equal(rows.length, 1);
    assert.equal(rows[0].synthetic, false);
});
