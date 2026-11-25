'use strict';

const { MongoClient } = require('mongodb');

const finish = (operation, callback) =>
    operation.then(value => callback(null, value), callback);

// Bridge the application's existing callback handlers to the maintained driver
// without changing the database name, collection names, or replacement writes.
function createDatabase({
    uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017',
    database = process.env.MONGODB_DATABASE || 'score',
    Client = MongoClient,
} = {}) {
    const client = new Client(uri);
    const db = client.db(database);
    const legacy = {
        open(callback) {
            finish(client.connect().then(() => legacy, async error => {
                await client.close().catch(() => {});
                // The old API provides a closeable handle to error branches.
                throw error;
            }), (error, value) => callback(error, value || legacy));
        },
        close() {
            return client.close().catch(error => console.error('Database close failed:', error.message));
        },
        collection(name, callback) {
            let collection;
            try {
                collection = db.collection(name);
            } catch (error) {
                return callback(error);
            }
            callback(null, {
                findOne(query, done) {
                    finish(collection.findOne(query), done);
                },
                find(query) {
                    const cursor = collection.find(query);
                    return { toArray: done => finish(cursor.toArray(), done) };
                },
                update(query, document, done) {
                    finish(collection.replaceOne(query, document), done);
                },
                insert(documents, done) {
                    finish(Array.isArray(documents) ? collection.insertMany(documents) : collection.insertOne(documents), done);
                },
            });
        },
    };
    return legacy;
}

module.exports = { createDatabase };
