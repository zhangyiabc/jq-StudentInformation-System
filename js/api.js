var dataArr = Mock.mock({
    "result|2000": [{
        "id": "@id",
        "name": "@cname",
        "birth": "@date('yyyy')",
        "sex|1": [0, 1],
        "sNo": "@integer(1000, 1000000)",
        "email": "@email",
        "phone": "@integer(13000000000, 19000000000)",
        "address": "@city(true)",
        "appkey": "@word(16)",
        "ctime": 1547190636,
        "utime": 1547190636
    }]
})

//添加学生
Mock.mock(RegExp('addStudent?[\w\W]*'), 'post', function (options) {
    console.log(options);
    var body = decodeURIComponent(options.body);
    var thisBody = formatQuery(body);
    dataArr.result.push(thisBody);
    return {
        "data": {
            total: dataArr.result.length,
            nowData: dataArr.result
        },
        "msg": "添加成功",
        "status": "success"

    }
});
//查询学生
Mock.mock(RegExp('studentList?[\w\W]*'), 'get', function (options) {
    var myStr = options.url.slice(options.url.indexOf('?') + 1);
    //再把字符串转化为对象
    var myObj = formatQuery(myStr);
    // console.log(myObj)

    //筛选数据当前页面的
    // 第一页  10条   0 - 9
    //  第二页  10条   10 - 19    10n -- 10n + 9
    
    var nowData = dataArr.result.filter(function (item, index) {

        return index >= myObj.size * (myObj.page - 1) && index < myObj.size * myObj.page
    })
    nowData = filterSex(nowData,myObj.sex);
    nowData = filterInput(nowData,myObj.text);
    // console.log(nowData)

    return {
        "data": {
            total: dataArr.result.length,
            nowData: nowData
        },
        "msg": "查询成功",
        "status": "success"

    }
})
//更新数据
Mock.mock(RegExp('updateStudent?[\w\W]*'), 'post', function (options) {
    console.log(options)
    var body = decodeURIComponent(options.body);
    var myObj = formatQuery(body)
    var sNo = myObj.sNo;
    console.log(myObj)
    //找到所有数据中sno=传进来的sno
    dataArr.result.forEach(function(item,index){
        if(item.sNo == sNo){
            dataArr.result[index] = myObj
        }
    })
    

    return {
        "data": {
            // total: dataArr.result.length,
            nowData: dataArr.result
        },
        "status": "success",
        "msg": "修改成功"
    }
})

Mock.mock(RegExp('delBySno?[\w\W]*'), 'get', function (options) {
    console.log(options)
    var myStr = options.url.slice(options.url.indexOf('?') + 1);
    var myObj = decodeURIComponent(myStr);
    var obj = formatQuery(myObj)
    dataArr.result = dataArr.result.filter(function(item,index){
        return item.sNo != obj.sNo;

    })
    return {
        "data": {
            total: dataArr.result.length,
            nowData: dataArr.result
        },
        "status": "success",
        "msg": "删除成功"
    }
})



function formatQuery(str) {
    var queryArr = str.split('&');
    var queryObj = {};
    for (var i = 0; i < queryArr.length; i++) {
        var key = queryArr[i].split('=')[0];
        var value = queryArr[i].split('=')[1];
        queryObj[key] = value;
    }
    return queryObj
}