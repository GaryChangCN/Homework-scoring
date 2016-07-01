var fs = require("fs");
fs.readFile('public/data.txt', function(err, data) {
    var d = data.toString();
    var arr1 = d.split("###"); //按学生分数组
    console.log(arr1.length)
    var result=[];
    arr1.forEach(function(e){
    	var arr2=e.split("#");
    	var tmp={};
    	tmp.id=arr2[0];
    	tmp.name=arr2[1];
    	tmp.groupName=arr2[2];
    	result.push(tmp);
    })
    var file={
    	"data":result
    }
    fs.writeFile('public/byName.json',JSON.stringify(file),function(err){
    	if(err) throw err;
    	else{
    		console.log("ok")
    	}
    })
})
