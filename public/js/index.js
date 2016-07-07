//获取用户信息
var userInformation;

function getAll(userInformation) {
    _Ajax({
        "url": "Tall",
        "method": "get", //默认get
        "async": false, //默认为false
        "data": {
            "groupName": userInformation.groupName
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
                        if (json["score"][e.groupName]["score"]) {
                            var score = json["score"][e.groupName]["score"];
                        } else {
                            var score = " ";
                        }
                        if (e.pdf.exit) {
                            var li = "<li data-exit='true' data-groupname=" + e.groupName + " data-pdfname=" + e.pdf.name + ">";
                            var pdf = "《" + e.pdf.name.replace(".pdf", "") + "》";
                        } else {
                            var pdf = "暂未上传";
                            var li = "<li data-exit='false' data-groupname=" + e.groupName + ">";
                        }
                        tmp +=
                            li +
                            '<div>' + score + '</div>' +
                            '<span class="docName">' + pdf + '</span>' +
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
//获取小组作业信息
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
                userInformation = json.userInformation;
                var groupContent = document.querySelector(".groupContent");
                var groupMember = json.groupMember.map(function(e) {
                    return e.name;
                }).join(" ");
                if (json.userInformation.name == json.groupMaster) {
                    userInformation.power = true;
                    document.querySelector(".scoreContentCover>span").innerText = "请先选择小组";
                }
                var pdf = json.homework.pdf.exit ? json.homework.pdf.name : "暂未上传";
                document.querySelector(".header>span:last-child>span").innerText = "欢迎您：" + json.userInformation.name;
                groupContent.innerHTML =
                    '<span class="groupName">' + json.groupName + '</span>' +
                    '<span class="groupmaster">组长：' + json.groupMaster + '</span>' +
                    '<span class="groupDoc">论文题目：' + pdf.replace(".pdf", "") + '</span>' +
                    '<p class="groupmember">组成员：' + groupMember + '</p>' +
                    '<span class="yourScore"></span>';
                getAll(userInformation);
            } else {
                window.location.href="/error.html";
            }
        },
        beforeSend: function() {}
    })
})();
//选择小组 展示PDF
(function() {
    var ul = document.querySelector(".groupList>ul");
    ul.addEventListener("click", function(event) {
        var tagName = event.target.tagName.toLowerCase();
        var li;
        switch (tagName) {
            case 'li':
                li = event.target;
                break;
            case 'div':
                li = event.target.parentNode;
                break;
            case 'span':
                if (event.target.className == "gName") {
                    li = event.target.parentNode.parentNode;
                } else {
                    li = event.target.parentNode;
                }
                break;
            default:
                break;
        }
        if (userInformation.power) {
            document.querySelector(".scoreContentCover").style.visibility = "hidden";
            document.querySelector(".scoreContent").style.opacity = "1";
        }
        if (li.dataset.exit == "true") {
            var groupName = li.dataset.groupname;
            var pdfName = li.dataset.pdfname;
            document.querySelector(".scoreContent").id = null;
            document.querySelector(".scoreContentCover").id = null;
            PDFObject.embed("./pdf/" + groupName + "/" + pdfName, "#left");
            document.querySelector(".Tbutton").dataset.groupname = li.dataset.groupname;
            document.querySelector(".Tbutton").innerText = "提交分数";
        } else {
            document.getElementById("left").innerHTML = "<div id='attention'>该小组暂未上传作业，请选择其他组</div>";
            document.querySelector(".scoreContentCover>span").innerText = "该小组暂未上传作业，不能打分";
            document.querySelector(".scoreContent").id = "scoreContent";
            document.querySelector(".scoreContentCover").id = "scoreContentCover";
        }

    });
})();

//打分
(function() {
    var s = document.querySelector(".score input");
    var m = document.querySelector(".scoreContent textarea");
    s.onfocus = function() {
        s.id = null;
        m.id = null;
    }
    m.onfocus = function() {
        s.id = null;
        m.id = null;
    }
    var Tbutton = document.querySelector(".Tbutton");
    Tbutton.onclick = function() {
        var forGroupName = Tbutton.dataset.groupname;
        var score = s.value;
        var mark = m.value;
        if (!score && !mark) {
            s.id = "nonono";
            m.id = "nonono";
        } else if (!score || score <= 0 || score > 100||(/\./.test(score))) {
            s.id = "nonono";
        } else if (!mark) {
            m.id = "nonono";
        } else {
            _Ajax({
                "url": "submitScore",
                "method": "get", //默认get
                "async": true, //默认为false
                "data": {
                    "forGroupName": forGroupName,
                    "groupName": userInformation.groupName,
                    "score": score,
                    "mark": mark
                },
                "header": {},
                "cache": false, //默认为false
                "dataType": "json", //"text"  "json"  "xml"  默认为text
                success: function(data) {
                    var json = JSON.parse(data);
                    if (json.code == "1") {
                        Tbutton.innerText = "打分成功";
                        getAll(userInformation);
                    } else {
                        window.location.href = "/error.html";
                    }
                },
                beforeSend: function() {}
            });
        }
    }
})();
