// console.log(5,"5")
(function () {
    function turnPage(options, dom) {
        this.nowPage = options.nowPage || 1;
        this.dom = dom;
        this.total = options.total || 1;
        this.changePage = options.change || function () {};
    }
    turnPage.prototype.creatDom = function () {
        var pageWrapper = $('<ul class="my-page"></ul>');
        // 上一页
        if (this.nowPage > 1) {
            $('<li class="my-page-prev">上一页</li>').appendTo(pageWrapper);
        }
        //第一页
        $('<li class="my-page-num">1</li>').appendTo(pageWrapper)
            .addClass(this.nowPage == 1 ? 'my-page-current' : '');
        if (this.nowPage - 2 - 1 > 1) {
            $("<span>...</span>").appendTo(pageWrapper);
        }
        //中间五页
        for (var i = this.nowPage - 2; i <= this.nowPage + 2; i++) {
            if (i > 1 && i < this.total) {
                $('<li class="my-page-num"></li>').appendTo(pageWrapper)
                    .text(i)
                    .addClass(this.nowPage == i ? 'my-page-current' : '');
            }

        }
        if (this.total - (this.nowPage + 2) > 1) {
            $("<span>...</span>").appendTo(pageWrapper);
        }
        //最后一页
        $('<li class="my-page-num"></li>').appendTo(pageWrapper)
            .text(this.total)
            .addClass(this.nowPage == this.total ? 'my-page-current' : '');
        // 下一页
        if (this.nowPage < this.total) {
            $('<li class="my-page-next">上一页</li>').appendTo(pageWrapper);
        }
        // $("跳转").appendTo(pageWrapper)
        $('<input class="my-page-to" type="text" ></input>').val(this.nowPage).appendTo(pageWrapper)
        $("跳转").appendTo(pageWrapper)
        this.dom.html(pageWrapper);


    }
    turnPage.prototype.bindEvent = function () {
        var self = this;
        $(this.dom).find(".my-page-next").click(function () {
                self.nowPage++;
                self.changePage(self.nowPage);
            }).end()
            .find('.my-page-prev').click(function () {
                self.nowPage--;
                self.changePage(self.nowPage);
            }).end()
            .find('.my-page-num').click(function(){
                self.nowPage = parseInt($(this).text())
                self.changePage(self.nowPage)
            }).end()
            .find('.my-page-to').on("blur",function(){
                self.nowPage = parseInt($(this).val());
                self.changePage(self.nowPage)
            })
    }

    turnPage.prototype.init = function () {
        this.creatDom();
        this.bindEvent();
    }

    $.fn.extend({
        page: function (options) {
            var p = new turnPage(options, this)
            p.init();
        }
    })
}())