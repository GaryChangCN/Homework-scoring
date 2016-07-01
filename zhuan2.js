var fs=require("fs");
fs.readFile('public/byName.json',function(err,data){
	var a=JSON.parse(data.toString());
	var b={};
	a.data.forEach(function(e){
		var c=Object.keys(b);
		if(c.indexOf(e.groupName)<0){
			b[e.groupName]=[];
			var tmp={
			}
			tmp.id=e.id;
			tmp.name=e.name;
			b[e.groupName].push(tmp);
		}else{
			var tmp={
			}
			tmp.id=e.id;
			tmp.name=e.name;
			b[e.groupName].push(tmp);
		}
	});
	fs.writeFile('public/byGroup.json',JSON.stringify(b),function(err){
		console.log("ok")
	})
});