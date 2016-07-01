var fs=require("fs");
fs.readFile('public/byGroup.json',function(err,data){
	var a=JSON.parse(data);
	var data={
		"data":[]
	}
	for(var key in a){
		var tmp={
		};
		tmp.groupName=key;
		tmp.groupMember=a[key];
		tmp.groupMaster=a[key][0].name;
		data.data.push(tmp);
	}
	var arr=data.data;
	for(let i=0;i<arr.length;i++){
		let tmp={};
		arr.forEach(function(e){
			tmp[e.groupName]=null;
		})
		arr[i].score=tmp;
		delete arr[i]["score"][arr[i]["groupName"]];
	}
	data.data=arr;
	fs.writeFile('public/byMongoDB.json',JSON.stringify(data),function(err){
		console.log(err);
	})
})