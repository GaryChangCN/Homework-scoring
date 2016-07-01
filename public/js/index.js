//获取用户信息
// var userInformation;
function getAll(userInformation) {
    _Ajax({
        "url": "Tall",
        "method": "get", //默认get
        "async": false, //默认为false
        "data": {
            "": ""
        },
        "header": {},
        "cache": false, //默认为false
        "dataType": "json", //"text"  "json"  "xml"  默认为text
        success: function(data) {
            var json = JSON.parse(data);
            if (json.code == "1") {
                var dataArr = json.data;
                var tmp = "";
                dataArr.forEach(function(e) {
                    if (e.groupName != userInformation.groupName) {
                        var score;
                        if (e.getScore.noMark) {
                            score = e.getScore.noMark;
                        } else {
                            score = " ";
                        }
                        var pdf = e.pdf.exit ? "《" + e.pdf.name + "》" : "暂未上传";
                        tmp +=
                            '<li>' +
                            '<div>' + score + '</div>' +
                            '<span class="docName">' + pdf.replace(".pdf", "") + '</span>' +
                            '<span>组名称:<span class="gName">' + e.groupName + '</span></span>' +
                            '</li>';
                    }
                });
                document.querySelector(".groupList>ul").innerHTML = tmp;
            } else {
                alert("获取其他小组信息失败。");
            }
        },
        beforeSend: function() {}
    });

}
(function() {
    _Ajax({
        "url": "Tinformation",
        "method": "get", //默认get
        "async": false, //默认为false
        "data": {
            "": ""
        },
        "header": {},
        "cache": false, //默认为false
        "dataType": "json", //"text"  "json"  "xml"  默认为text
        success: function(data) {
            var json = JSON.parse(data);
            if (json.code == "1") {
                // userInformation=json.userInformation;
                var groupContent = document.querySelector(".groupContent");
                var groupMember = json.groupMember.map(function(e) {
                    return e.name;
                }).join(" ");
                if(json.homework.pdf.exit){
                	var pdf=json.homework.pdf.name;
                	
                }
                var pdf = json.homework.pdf.exit ? json.homework.pdf.name : "暂未上传";
                document.querySelector(".header>span:last-child>span").innerText = "欢迎您：" + json.userInformation.name;
                groupContent.innerHTML =
                    '<span class="groupName">' + json.groupName + '</span>' +
                    '<span class="groupmaster">组长：' + json.groupMaster + '</span>' +
                    '<span class="groupDoc">论文题目：' + pdf + '</span>' +
                    '<p class="groupmember">组成员：' + groupMember + '</p>' +
                    '<span class="yourScore">97</span>';
                getAll(json.userInformation);
            } else {
                alert("获取本组信息失败");
            }
        },
        beforeSend: function() {}
    })
})();
(function() {
    // var ul = document.querySelector(".groupList>ul");
    // ul.addEventListener("click", function(event) {
    //     var tagName = event.target.tagName;
    //     var li;
    //     switch (tagName) {
    //         case 'li':
    //             li = event.target;
    //             break;
    //         case 'div':
    //             li = event.target.parentNode;
    //             break;
    //         case 'span':
    //             if (target.className == "gName") {
    //                 li = event.target.parentNode.parentNode;
    //             } else {
    //                 li = event.target.parentNode;
    //             }
    //             break;
    //         default:
    //             break;
    //     }
    //     if(li.children[1].innerText=="暂未上传"){

    //     }else{
    //     	var groupName=li.children[2].children[]
    //     	PDFObject.embed("./pdf/1.pdf", "#left");
    //     }
    // });
})();
