var groupInformation = {
    "groupName": null,
    "score": null, //获得分数数组;
    "max": 1,
    "min": 1
};
$("document").ready(function() {
    //获取小组列表
    $.ajax({
        "type": "get",
        "dataType": "json",
        "url": "/TgetGroupList",
        "success": function(data) {
            var json = data.data;
            var tmp = "";
            json.forEach(function(e) {
                tmp += '<li data-groupname="' + e.groupName + '"><span>' + e.groupName + '</span></li>';
            });
            $(".groupList").html(tmp);
            $(".groupList>li").click(function() {
                var groupName = $(this).text();
                //传入名字
                groupInformation.groupName = groupName;
                $(".groupList>li").css('backgroundColor', 'transparent');
                $(this).css('backgroundColor', '#e2e2e2');
                $(".max").text(groupInformation.max);
                $(".min").text(groupInformation.min);
                $("#max").val(groupInformation.max);
                $("#min").val(groupInformation.min);
                $(".Score").children().remove();
                $("#sumScore").text("");
                getScore(groupName);
                getSetScore(groupName);
            });
        }
    });
    //跳转文件列表
    (function(){
        $(".file").click(function(){
           window.open("/file.html"); 
        });
    })();
    //调整去除人数
    $(".range>input").change(function() {
        var max = $("#max").val();
        var min = $("#min").val();
        groupInformation.max = parseFloat(max);
        groupInformation.min = parseFloat(min);
        $(".max").text(max);
        $(".min").text(min);
        averageOptionScore(groupInformation);
    });
    //别的组对本组打分
    function getScore(groupName) {
        $(".rightTop>.cTitle>span").text("别组对→" + groupName + "组的打分");
        $.ajax({
            "url": "/TgetOtherScore",
            "data": {
                "groupname": groupName
            },
            "type": "get",
            "dataType": "json",
            "success": function(dat) {
                if (dat.code != "1") {
                    document.getElementById("getScore").innerText("哼，出现错误");
                } else {
                    var json = dat.data;
                    //Echarts
                    var myChart = echarts.init(document.getElementById("getScore"));
                    option = {
                        title: {
                            show: true,
                            text: '别的小组对此组打分'
                        },
                        color: ['#0099bc'],
                        yAxis: {
                            type: 'value',
                            axisLine: {
                                show: false
                            },
                            axisTick: {
                                show: false
                            },
                            axisLabel: {
                                show: false
                            },
                            splitLine: {
                                show: false
                            }
                        },
                        xAxis: {
                            boundaryGap: false,
                            type: 'category',
                            data: [],
                            axisLabel: {
                                interval: 0,
                                rotate: -15,
                                textStyle: {
                                    fontSize: 10,
                                    onZreo: false
                                }
                            }
                        },
                        series: {
                            label: {
                                normal: {
                                    show: true,
                                    position: "top"
                                }
                            },
                            type: 'bar',
                            data: []
                        }
                    };
                    json.forEach(function(e) {
                        option.xAxis.data.push(e.groupName);
                        if (e.score.effective && e.score.score) {
                            var score = e.score.score;
                        } else {
                            var score = "0";
                        }
                        option.series.data.push(score);
                    });
                    //把该组得分数组传入总信息
                    groupInformation.score = option.series.data;
                    averageScore(groupInformation);
                    // averageOptionScore(groupInformation);
                    //==============================
                    myChart.setOption(option);
                    myChart.on("mouseover", function(params) {
                        var tmpName = json[params.dataIndex]["groupName"];
                        var mark = json[params.dataIndex]["score"]["mark"];
                        var score = json[params.dataIndex]["score"]["score"];
                        $("#cover").css({ "display": "block", "top": "50px" }).html("<span></span>给出分数：<b>" + score + "</b></br>" + "打分理由：" + mark);
                        $("#cover>span").text(tmpName);
                    });
                    myChart.on("mouseout", function() {
                        $("#cover").hide();
                    });
                    myChart.on("dblclick", function(params) {
                        $.ajax({
                            url: "/Tinvalid",
                            type: "get",
                            dataType: "json",
                            data: {
                                bygroupname: json[params.dataIndex]["groupName"],
                                forgroupname: groupName
                            },
                            success: function(result) {
                                if (result.code != 1) {
                                    alert("未删除该组打分");
                                } else {
                                    alert("操作成功,已删除该组打分");
                                    window.location.reload();
                                }
                            }
                        });
                    });
                }
            }
        });
    };
    //本组对其他组打分
    function getSetScore(groupName) {
        $(".rightBottom>.cTitle>span").text(groupName + "组→对其他组打分");
        $.ajax({
            url: "/TgetSetScore",
            data: {
                groupname: groupName
            },
            type: "get",
            dataType: "json",
            success: function(da) {
                if (da.code != "1") {
                    document.getElementById("giveScore").innerText("哼，出现错误");
                } else {
                    var myChart = echarts.init(document.getElementById("giveScore"));
                    var json = da.data;
                    var xData = [];
                    var yData = [];
                    for (var key in json) {
                        xData.push(key);
                        if (json[key]["score"] && json[key]["effective"]) {
                            var score = json[key]['score'];
                        } else {
                            var score = "0";
                        }
                        yData.push(score);
                    }
                    option = {
                        title: {
                            show: true,
                            text: '此组对其他组打分'
                        },
                        color: ['#0099bc'],
                        yAxis: {
                            type: 'value',
                            axisLine: {
                                show: false
                            },
                            axisTick: {
                                show: false
                            },
                            axisLabel: {
                                show: false
                            },
                            splitLine: {
                                show: false
                            }
                        },
                        xAxis: {
                            boundaryGap: false,
                            type: 'category',
                            data: xData,
                            axisLabel: {
                                interval: 0,
                                rotate: -15,
                                textStyle: {
                                    fontSize: 10,
                                    onZreo: false
                                }
                            }
                        },
                        series: {
                            label: {
                                normal: {
                                    show: true,
                                    position: "top"
                                }
                            },
                            type: 'bar',
                            data: yData
                        }
                    };
                    myChart.setOption(option);
                    myChart.on("mouseover", function(params) {
                        var tmp = json[params.name];
                        $("#cover").show().css("top", "350px").html("<span></span>给出分数：<b>" + tmp.score + "</b></br>" + "打分理由：" + tmp.mark);
                        $("#cover>span").text("========本组========");
                    });
                    myChart.on("mouseout", function() {
                        document.getElementById("cover").style.display = "none";
                    });
                    myChart.on("dblclick", function(params) {
                        var byGroupName = groupName;
                        var forGroupName = params.name;
                        $.ajax({
                            url: "/Tinvalid",
                            type: "get",
                            dataType: "json",
                            data: {
                                bygroupname: byGroupName,
                                forgroupname: forGroupName
                            },
                            success: function(result) {
                                if (result.code != 1) {
                                    alert("未删除该组打分");
                                } else {
                                    alert("操作成功,已删除该组打分");
                                    window.location.reload();
                                }
                            }
                        });
                    });
                }
            }
        })
    };
    //本组得到的平均分
    function averageScore(groupInformation) {
        var noZero = groupInformation.score.filter(function(e) {
            if (e != 0) {
                return true;
            }
        });
        var length = noZero.length;
        if (length == 0) {
            var averageS = 0;
            var averageN = "无有效打分";
        } else {
            var sum = noZero.reduce(function(prev, cur, index, array) {
                return parseFloat(prev) + parseFloat(cur);
            });
            var averageS = Math.round(sum / length);
            var averageN = "平均分";
        }
        groupInformation.a = averageS;
        averageOptionScore(groupInformation);
        var eCharts = echarts.init(document.getElementById("averageScore"));
        var option = {
            tooltip: {
                formatter: "{a} <br/>{b} : {c}"
            },
            toolbox: {
                feature: {
                    restore: {},
                    saveAsImage: {}
                }
            },
            series: [{
                radius: "90%",
                name: '平均分',
                type: 'gauge',
                detail: { formatter: '{value}分' },
                data: [{ value: averageS, name: averageN }],
                axisLine: {
                    lineStyle: {
                        color: [
                            [0.09, '#bf3c36'],
                            [0.82, '#0099bc'],
                            [1, '#36bf8c']
                        ],
                        width: 10
                    }
                },
                axisLabel: {
                    show: false
                },
                axisTick: {
                    length: 17,
                    lineStyle: {
                        color: 'auto',
                        shadowColor: '#fff',
                        shadowBlur: 0
                    }
                },
                splitLine: {
                    length: 25,
                    lineStyle: { // 属性lineStyle（详见lineStyle）控制线条样式
                        width: 1,
                        color: '#0099bc',
                        shadowColor: '#fff', //默认透明
                        shadowBlur: 0
                    }
                }
            }]
        };
        eCharts.setOption(option);
    };
    //本组得到的去掉n最高和n个最低
    function averageOptionScore(groupInformation) {
        $(".range").show();
        var noZero = groupInformation.score.filter(function(e) {
            if (e != 0) {
                return true;
            }
        }).map(function(e) {
            return parseFloat(e);
        });
        var length = noZero.length;
        if (length == 0) {
            var averageS = 0;
            var averageN = "无有效打分";
        } else {
            var max = groupInformation.max;
            var min = groupInformation.min;
            if ((max + min) >= length) {
                alert("去除个数超过总有效分数个数");
                var averageS = "0";
                var averageN = "超出总个数";
            } else {
                noZero.sort();
                for (var i = 0; i < max; i++) {
                    noZero.pop();
                };
                for (var j = 0; j < min; j++) {
                    noZero.shift()
                };
                var sum = noZero.reduce(function(prev, cur, index, array) {
                    return parseFloat(prev) + parseFloat(cur);
                });
                var averageS = Math.round(sum / noZero.length);
                var averageN = "平均分";
            }
        }
        //使用教师打分函数
        groupInformation.b = averageS;
        teacherScore(groupInformation);
        var eCharts = echarts.init(document.getElementById("averageOptionScore"));
        var option = {
            tooltip: {
                formatter: "{a} <br/>{b} : {c}"
            },
            toolbox: {
                feature: {
                    restore: {},
                    saveAsImage: {}
                }
            },
            series: [{
                radius: "90%",
                name: '平均分',
                type: 'gauge',
                detail: { formatter: '{value}分' },
                data: [{ value: averageS, name: averageN }],
                axisLine: {
                    lineStyle: {
                        color: [
                            [0.09, '#bf3c36'],
                            [0.82, '#0099bc'],
                            [1, '#36bf8c']
                        ],
                        width: 10
                    }
                },
                axisLabel: {
                    show: false
                },
                axisTick: {
                    length: 17,
                    lineStyle: {
                        color: 'auto',
                        shadowColor: '#fff',
                        shadowBlur: 0
                    }
                },
                splitLine: {
                    length: 25,
                    lineStyle: { // 属性lineStyle（详见lineStyle）控制线条样式
                        width: 1,
                        color: '#0099bc',
                        shadowColor: '#fff', //默认透明
                        shadowBlur: 0
                    }
                }
            }]
        };
        eCharts.setOption(option);
    };
    //教师打分
    function teacherScore(groupInformation) {
        var groupName = groupInformation.groupName;
        var a = groupInformation.a;
        var b = groupInformation.b;
        $.ajax({
            url: "/TgetTeacherScore",
            type: "get",
            data: {
                groupname: groupName,
                a: a,
                b: b
            },
            dataType: "json",
            success: function(data) {
                if (data.code != "1") {
                    $("#teacherScore").html("<h1>获取打分失败</h1>");
                } else {
                    if (data.c) {
                        var c = data.c;
                    } else {
                        var c = c;
                    }
                    if (data.d) {
                        var d = data.d;
                    } else {
                        var d = "未打";
                    }
                    $("#sumScore").text(d);
                    var tmp = '<input type="number" min="0" max="100" value="' + c + '">' +
                        '<div>' +
                        '<span>占比</span>' +
                        '<input type="number" value="30"  min="0" max="100" >' +
                        '<a href="#" id="submitS">确认</a>' +
                        '</div>';
                    $("#teacherScore").html(tmp);
                }
            }
        });
        //提交老师打分
        $("#teacherScore").on("click", "#submitS", function() {
            var s = $("#teacherScore>input").val();
            var p = $("#teacherScore>div>input").val();
            if (s >= 0 && p >= 0) {
                var b = groupInformation.b
                var c = s;
                p = parseFloat(p);
                var d = Math.round((b * (100 - p) + c * p) / 100);
                if (!isNaN(d)) {
                    $("#sumScore").text(d);
                    $.ajax({
                        url: "/TsetTeacherScore",
                        type: "get",
                        dataType: "json",
                        data: {
                            groupname: groupName,
                            c: c,
                            d: d
                        },
                        scuuess: function(data) {
                            if (data.code != "1") {
                                alert("上传成绩失败");
                            } else {
                                alert("上传成绩成功");
                            }
                        }
                    });
                } else {
                    $("#sumScore").text("错误");
                }
            } else {
                alert("不能为负数");
            }
        })
    };
});
