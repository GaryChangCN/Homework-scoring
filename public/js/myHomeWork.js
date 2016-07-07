var userInformation;
//跳转首页
(function() {
    document.querySelector(".selectFile>span").onclick = function() {
        window.location.href = "/index.html";
    }
})();
////关闭提示
(function() {
    var close = document.querySelector(".tips span");
    close.onclick = function() {
        document.querySelector(".tips").style.display = "none";
    }
})();
//关闭提示结束
//关闭提示
(function() {
    var close = document.querySelector(".coverTop span");
    close.onclick = function() {
        document.querySelector(".cover").style = "none";
    }
    var enter = document.querySelector(".coverEnter");
    enter.addEventListener("click", function() {
        window.location.reload();
    });
})();
//获取信息
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
                //小组信息
                userInformation = json.userInformation;
                document.getElementById("groupName").innerText = json.groupName;
                document.getElementById("groupMaster").innerText = json.groupMaster;
                var tmp = "";
                json.groupMember.forEach(function(e) {
                        tmp += e.name + " ";
                    })
                    //小组信息结束===已上传文件
                document.getElementById("groupMember").innerText = tmp;
                var homework = json.homework;
                if (homework.doc.exit) {
                    var tmp = document.querySelector(".uploadFiles>li:nth-child(1)>ul");
                    var li1 = document.createElement("li");
                    li1.innerText = homework.doc.name;
                    var li2 = document.createElement("li");
                    li2.innerText = "上传者：" + homework.doc.publisher;
                    var li3 = document.createElement("li");
                    li3.innerText = "上传日期：" + homework.doc.time;
                    tmp.appendChild(li1);
                    tmp.appendChild(li2);
                    tmp.appendChild(li3);
                } else {
                    var tmp = document.querySelector(".uploadFiles>li:nth-child(1)>ul");
                    var li1 = document.createElement("li");
                    li1.innerText = "暂未上传";
                    tmp.appendChild(li1);
                }
                if (homework.pdf.exit) {
                    var tmp = document.querySelector(".uploadFiles>li:nth-child(2)>ul");
                    var li1 = document.createElement("li");
                    li1.innerText = homework.pdf.name;
                    var li2 = document.createElement("li");
                    li2.innerText = "上传者：" + homework.pdf.publisher;
                    var li3 = document.createElement("li");
                    li3.innerText = "上传日期：" + homework.pdf.time;
                    tmp.appendChild(li1);
                    tmp.appendChild(li2);
                    tmp.appendChild(li3);
                } else {
                    var tmp = document.querySelector(".uploadFiles>li:nth-child(2)>ul");
                    var li1 = document.createElement("li");
                    li1.innerText = "暂未上传";
                    tmp.appendChild(li1);
                }
                if (homework.xls.exit) {
                    var tmp = document.querySelector(".uploadFiles>li:nth-child(3)>ul");
                    var li1 = document.createElement("li");
                    li1.innerText = homework.xls.name;
                    var li2 = document.createElement("li");
                    li2.innerText = "上传者：" + homework.xls.publisher;
                    var li3 = document.createElement("li");
                    li3.innerText = "上传日期：" + homework.xls.time;
                    tmp.appendChild(li1);
                    tmp.appendChild(li2);
                    tmp.appendChild(li3);
                } else {
                    var tmp = document.querySelector(".uploadFiles>li:nth-child(3)>ul");
                    var li1 = document.createElement("li");
                    li1.innerText = "暂未上传";
                    tmp.appendChild(li1);
                }
                //已上传文件结束==顶部欢迎
                document.getElementById("welN").innerText = "欢迎您：" + userInformation.name;
                //顶部欢迎结束

            } else {
                window.location.href = "/error.html"
            }
        },
        beforeSend: function() {}
    })
})();
//上传文件函数
//(function() {
var file = document.getElementById("file");
var submitA = document.querySelector(".submitA");
var data = new FormData();
data.append("groupName", userInformation.groupName);
data.append("userName", userInformation.name);
data.append("userId", userInformation.id);
var d = new Date();
var time = d.toLocaleString();
data.append("time", time);
file.addEventListener("change", function(event) {
    submitA.style.display = "inline";
    var files = event.target.files;
    var objArr = [];
    var fileList = document.querySelector(".fileList");
    objArr.push(files);
    objArr.forEach(function(e) {
        var arr = Array.prototype.slice.call(e);
        arr.forEach(function(e) {
            if (e.name.match(/.(doc|docs|pdf|xls|xlsx)/)) {
                if (/( |\s)/.test(e.name)) {
                    alert("上传文件名不能有空格");
                    window.location.reload();
                } else {
                    var li = document.createElement("li");
                    li.innerHTML = "<span>" + e.name.replace(/.(doc|docs|pdf|xls|xlsx)/, "") + "</span><span>" + e.name.match(/.(doc|docs|pdf|xls|xlsx)/)[1] + "文件</span>"
                    fileList.appendChild(li);
                }
            } else {
                alert("仅支持doc、docx、pdf、xls、xlsx格式");
                window.location.reload();
            }
        })
        var i = 0;
        var len = files.length;
        while (i < len) {
            data.append("file", files[i]);
            i++;
        }
    });
    //限制多文件同时上传，因为后台问题没有解决  苦逼  放弃---已解决
    // var add = document.querySelector(".selectFile>a");
    // add.style.visibility = "hidden";
    // event.target.style.visibility = "hidden";
});
submitA.addEventListener("click", function() {
    var coverContent = document.querySelector(".coverContent");
    document.querySelector(".cover").style.display = "inline";
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 1) {
            //document.querySelector(".cover").style.display = "inline";
        } else if (xhr.readyState == 4) {
            if (xhr.status >= 200 && xhr.status < 300 || xhr.status == 304) {
                var result = xhr.responseText;
                if (result == "ok") {
                    coverContent.innerText = "=====上传成功=====";
                    document.querySelector(".coverTop span").style.display = "none";
                } else {
                    coverContent.innerText = "上传失败，请重新上传";
                    document.querySelector(".coverTop span").style.display = "none";
                }
            }
        }
    }
    xhr.upload
    xhr.open("post", "Tpost", true);
    xhr.send(data);

});
//})();
