var { createDatabase } = require("./lib/database");
var fs = require("fs");
//h:\mongodb\bin\mongod.exe -dbpath h:\score\db
var db = createDatabase();
db.open(function(err, db) {
    if (err) throw err;
    else {
        console.log("ok");
        db.collection("byName", function(err, collection) {
            if (err) {
                console.log("groupErr");
            } else {
                fs.readFile('public/byName.json', function(err, data) {
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