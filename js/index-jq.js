//c出错地方 数据中性别用 0 1 表示
//筛选中用f m表示
//数字类型没有indexOf()方法
var timer = null;
var tableData = [];
var dataClone = [];
//初始化查找
var fillerObj = {
    text: '',
    sex: 'all'
};
var mySno = null
//初始化翻页
/**
 * nowPage 当前页面的索引
 * total   共有多少个页面
 * size    每个页面最多有多少条数据
 */
var pageObj = {
    nowPage: 1,
    total: 1,
    size: 17,
}
//将查找组件插入页面
// $('.header > .f').load('find/find.html')



function bindEvent() {
    $("dd[data-id=student-add]").click(function(){
        $('.filterFanc').fadeOut();
    }).siblings().click(function(){
        $('.filterFanc').fadeIn();
    })
    $('.menu').on('click', 'dd', function () {
        var id = $(this).data('id');
        $(this).addClass('active')
            .siblings().removeClass('active');
        $('#' + id).fadeIn().siblings().fadeOut();
    });
    //删除按钮功能实现
    $('#student-body > tbody').on('click', '.remove', function (e) {
        e.preventDefault();
        var index = $(this).parents('tr').index();
        var isDel = confirm("您是否要删除 学号为：" + tableData[index].sNo + "姓名为:" + tableData[index].name + "的个人信息");
        if (isDel) {
            $.ajax({
                url: '/delBySno',
                type: "get",
                data: {
                    sNo: tableData[index].sNo
                },
                dataType: "json",
                success: function (res) {
                    alert(res.msg);
                    getTableData();
                }
            })
        }

    })
    //修改按钮功能实现
    //方案一:仅仅能在本地数据实现改
    // $('#student-body > tbody').on('click', '.edit', function (e) {
    //     e.preventDefault();
    //     var index = $(this).parents('tr').index();
    //     backWrite(tableData[index]);
    //     $('.modal').slideDown();

    //     //提交数据功能实现
    //     $('#student-edit-submit').click(function (e) {
    //         e.preventDefault();
    //         var nowData = getBackFormData($('#student-edit-form'))
    //         tableData[index] = nowData.data;
    //         renderDom(tableData)
    //         $('.modal').slideUp();
    //     })
    // })

    //方案二 ： 可以实现数据存储
    $('#student-body > tbody').on('click', '.edit', function (e) {
        e.preventDefault();
        var index = $(this).parents('tr').index();

        backWrite(tableData[index]);
        mySno = tableData[index].sNo;
        $('.modal').slideDown();

    })
    //修改个人信息功能
    $('#student-edit-submit').click(function (e) {
        e.preventDefault();
        var nowData = getBackFormData($('#student-edit-form'));
        console.log(nowData.data)
        // console.log(JSON.stringify(nowData.data))


        if (nowData.status === "success") {
            //发送请求
            $.ajax({
                url: '/updateStudent',
                type: "post",

                data: nowData.data,
                dataType: "json",
                success: function (res) {
                    if (res.status == "success") {
                        $('.modal').slideUp();
                        getTableData();
                    }
                }
            })
        }

    });

    //点击遮罩层
    $('.modal').click(function (e) {
        if (e.target == this) {
            $('.modal').slideUp();
        }
    })

    //点击添加学生
    $('#student-add-submit').click(function (e) {
        e.preventDefault();

        var FormData = getBackFormData($('#student-add-form'));

        if (FormData.status == 'success') {
            $.ajax({
                url: "/addStudent",
                type: "post",
                data: FormData.data,
                dataType: "json",
                success: function (res) {
                    if (res.status == "success") {
                        alert(res.msg);
                        getTableData()
                        $('.menu > dd[data-id=student-list]').trigger('click');
                        // $('.filterFanc').fadeIn();
                    }
                }
            })
        } else {
            alert(FormData.msg);
        }
    })
    //过滤事件
    $('.header').on('input', "input", function () {
        fillerObj.text = $(this).val();

        getTableData();
    })

    $('.header').on('click', "span[sex='0']", function () {
        $(this).addClass('active').siblings().removeClass('active');
        fillerObj.sex = '0';
        getTableData();
    })

    $('.header').on('click', "span[sex='1']", function () {
        $(this).addClass('active').siblings().removeClass('active');
        fillerObj.sex = '1';

        getTableData();
    })

    $('.header').on('click', "span[sex='all']", function () {
        $(this).addClass('active').siblings().removeClass('active');
        fillerObj.sex = 'all';

        getTableData();
    })
}

function getTableData() {
    // clearTimeout(timer)
    $.ajax({
        url: '/studentList',
        type: "get",
        dataType: "json",
        data: {
            sex:fillerObj.sex,
            text:fillerObj.text,
            page: pageObj.nowPage,
            size: pageObj.size
        },
        success: function (res) {
            // console.log(res)
            if (res.status == "success") {
                tableData = res.data.nowData;
                // dataClone = res.data.nowData;
                pageObj.total = Math.ceil(res.data.total / pageObj.size);
                renderDom(tableData)

                
            }
        }
    })
}

bindEvent()

getTableData();

function renderDom(data) {
    var str = data.reduce(function (prev, item) {
        return prev + `<tr>
        <td>${item.sNo}</td>
        <td>${item.name}</td>
        <td>${item.sex == 1?"男":"女"}</td>
        <td>${item.email}
        </td>
        <td>${new Date().getFullYear() - item.birth}</td>
        <td>${item.phone}</td>
        <td>${item.address}</td>
        <td>
            <button class="btn edit">编辑</button>
            <button class="btn remove">删除</button>
        </td>
    </tr>`
    }, '');
    $("#student-body > tbody").html(str);

    //调用page方法
    $('.page').page({
        nowPage: pageObj.nowPage,
        total: pageObj.total,
        change: function (p) {
            pageObj.nowPage = p;
            getTableData();
        }
    })


}

//表单回填
function backWrite(res) {
    console.log(res)
    var backForm = $("#student-edit-form")[0];

    for (var prop in res) {
        if (backForm[prop]) {
            backForm[prop].value = res[prop];
        }
    }
}

function getBackFormData(form) {
    var arr = form.serializeArray();
    console.log(arr)
    var result = {
        status: 'success',
        msg: '',
        data: {}
    };
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].value) {
            result.data[arr[i].name] = arr[i].value;
        } else {
            result.status = "fail";
            result.msg = "信息填写不完整"
            return result;
        }
    }
    return result;
}