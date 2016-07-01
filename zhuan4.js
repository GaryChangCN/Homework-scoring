var fs = require("fs");
fs.readFile("public/byMongoDB.json", function(err, data) {
    if (err) throw err;
    else {
        var a = JSON.parse(data.toString());
        var arr = a.data;
        arr.forEach(function(e) {
            var tmp = {
                "pdf": {
                    "publisher": null,
                    "exit": null,
                    "time": null,
                    "name":null
                },
                "doc": {
                    "publisher": null,
                    "exit": null,
                    "time": null,
                    "name", null
                },
                "xls": {
                    "publisher": null,
                    "exit": null,
                    "time": null,
                    "name":null
                }
            }
            var tmp2 = {
                "noMark": null,
                "withMark": null
            }
            e.homework = tmp;
            e.getScore=tmp2;
            var tmp3=e.score;
            delete e.score;
            for(var key in tmp3){
            	tmp3[key]={
            		"score":null,
            		"mark":null
            	}
            }
            e.score=tmp3;
        })
        var data = {
            "data": arr
        }
        fs.writeFile('public/byMongoDB.json', JSON.stringify(data), function(err) {
            console.log("ok");
        });
    }
})
