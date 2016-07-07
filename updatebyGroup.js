var mongo = require("mongodb");
var fs = require("fs");
//h:\mongodb\bin\mongod.exe -dbpath h:\score\db
var server = new mongo.Server('127.0.0.1', '27017');
var db = new mongo.Db('score', server, { safe: true });
db.open(function(err, db) {
    if (err) throw err;
    else {
        console.log("ok");
        db.collection("byGroup", function(err, collection) {
            if (err) {
                console.log("groupErr");
            } else {
                fs.readFile('public/byMongoDB.json', function(err, data) {
                    var d = JSON.parse(data.toString()).data;
                    collection.insert(d, function(err, docs) {
                        if (err) {
                            console.log("err");
                        } else {
                            console.log("ok");
                            db.close();
                        }
                    })
                })
            }
        });
    }
})

// var mongo = require("mongodb");
// var fs = require("fs");
// //h:\mongodb\bin\mongod.exe -dbpath h:\score\db
// var server = new mongo.Server('127.0.0.1', '27017');
// var db = new mongo.Db('score', server, { safe: true });
// db.open(function(err, db) {
//     if (err) throw err;
//     else {
//         console.log("ok");
//         db.collection("byName", function(err, collection) {
//             if (err) {
//                 console.log("groupErr");
//             } else {
//                 fs.readFile('public/byName.json', function(err, data) {
//                     var d = JSON.parse(data.toString()).data;
//                     collection.insert(d, function(err, docs) {
//                         if (err) {
//                             console.log("err");
//                         } else {
//                             console.log("ok");
//                             db.close();
//                         }
//                     })
//                 })
//             }
//         });
//     }
// })

// var mongo=require("mongodb");
// var server=new mongo.Server('127.0.0.1','27017');
// var db=new mongo.Db('score',server);
// db.open(function(err,db){
//     if(err) throw err;
//     else{
//         db.collection("byName",function(err,collection){
//             if(err) throw err;
//             else{
//                 // collection.find({"groupName":"全场最佳"},{sort:{"id":1},limit:2,skip:1}).toArray(function(err,docs){
//                 //     if(err) throw err;
//                 //     else{
//                 //         console.log(docs);
//                 //         db.close();
//                 //     }
//                 // })
//                 collection.findOne({"groupName":"全场最佳1"},function(err,docs){
//                     if(err) throw err;
//                     else{
//                         console.log(docs);
//                         db.close();
//                     }
//                 })
//             }
//         })
//     }
// })

// var mongo = require("mongodb");
// var server = new mongo.Server('127.0.0.1', '27017');
// var db = new mongo.Db('score', server, { safe: true });
// db.open(function(err, db) {
//     if (err) throw err;
//     else {
//         console.log("ok");
//         db.collection("test", function(err, collection) {
//             if (err) {
//                 console.log("groupErr");
//             } else {
//                 //collection.insert([{"a":"b"},{"a":"cd","ss":"ww"}])
//                 // collection.update({"aa":"b"}, {$set:{ "qq": "b" }}, { "multi": true }, function(err, result) {
//                 //     if (err) {
//                 //         console.log(err);
//                 //     } else {
//                 //         console.log("result");
//                 //     }
//                 // })
//                 collection.remove({"aa":"b"},function(err,result){
//                     console.log(result);
//                 })
//             }
//         });
//     }
// })
