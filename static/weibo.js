var apiWeiboAll = function(callback) {
    var path = '/api/weibo/all'
    ajax('GET', path, '', callback)
}

var apiWeiboAdd = function(form, callback) {
    var path = '/api/weibo/add'
    ajax('POST', path, form, callback)
}

var apiWeiboDelete = function(id, callback) {
    var path = `/api/weibo/delete?id=${id}`
    ajax('GET', path, '', callback)
}

var apiWeiboUpdate = function(form, callback) {
    var path = '/api/weibo/update'
    ajax('POST', path, form, callback)
}

var apiCommentAll = function(weibo_id,callback) {
    var path = `/api/comment/all?weibo_id=${weibo_id}`
    log('准备发过去的id', weibo_id)
    ajax('GET', path, weibo_id, callback)
}

var apiCommentAdd = function(form, callback) {
    var path = '/api/comment/add'
    log('form里面有啥', form)
    ajax('POST', path, form, callback)
}

var apiCommentDelete = function(id, callback) {
    var path = `/api/comment/delete?id=${id}`
    ajax('GET', path, '', callback)
}


var weiboTemplate = function(weibo) {
    var t = `
        <div class="weibo-cell">
            <span class="weibo-content" >${weibo.content}</span>
            <button data-id=${weibo.id} class="weibo-delete">删除</button>
            <button data-id=${weibo.id} class="weibo-edit">编辑</button>
            <br>
            <input class="input-comment">
            <button class="comment-add" data-weibo_id=${weibo.id}>添加评论</button>
            <div class="weibo-comment" id=id-weibo_id-${weibo.id}></div>
            <br>
            <br>
        </div>
    `
    return t
}

var weiboUpdateTemplate = function(weibo_id) {
    var w = `
        <div class="weibo-update-form">
            <input class="weibo-update-input">
            <button data-id=${weibo_id} class="weibo-update">更新</button>
        </div>
    `
    return w
}

var commentAddTemplate = function(id) {
    var t = `
        <div class="comment-add-form">
            <input class="comment-add-input">
            <button data-id=${id} class="comment-add">添加</button>
        </div>
    `
    return t
}

var commentTemplate = function(comment) {
    var t = `
        <div class="comment-cell">
            <div class="comment-list" data-comment_id="${comment}">${comment.content}</div>
            <button data-id=${comment.id} class="comment-delete">删除</button>
        </div>
    `
    return t
}


var insertWeibo = function(weibo) {
    var weiboCell = weiboTemplate(weibo)
    var weiboList = e('.weibo-list')
    weiboList.insertAdjacentHTML('beforeEnd', weiboCell)
}

var insertComment = function(comment) {
    log('开始准备插入comment', comment)
    var commentCell = commentTemplate(comment)
    log('commentCell', commentCell)
    var commentList = e(`#id-weibo_id-${comment.weibo_id}`)
    log('选中的标签', commentList)
    commentList.insertAdjacentHTML('beforeEnd', commentCell)
}


var bindEventWeiboAdd = function() {
    var b = e('#id-button-add')
    // 注意, 第二个参数可以直接给出定义函数
    b.addEventListener('click', function(){
        var input = e('#id-input-weibo')
        var content = input.value
        log('click add', content)
        var form = {
            content: content,
        }
        apiWeiboAdd(form, function(response) {
            // 收到返回的数据, 插入到页面中
            var weibo = JSON.parse(response)
            insertWeibo(weibo)
        })
    })
}

var bindEventWeiboDelete = function() {
    var weiboList = e('.weibo-list')
    // 事件响应函数会传入一个参数 就是事件本身
    weiboList.addEventListener('click', function (event) {
        log(event)
        var self = event.target
        log('被点击的元素', self)
        log(self.classList)
        if (self.classList.contains('weibo-delete')) {
            log('点到了 完成按钮, id 是', self.dataset.id)
            var weibo_id = self.dataset.id
            apiWeiboDelete(weibo_id, function(response) {
                // 删除 self 的父节点
                self.parentElement.remove()
            })
        } else {
            log('点到了 weibo cell')
        }
    })
}

var bindEventWeiboEdit = function() {
    var weiboList = e('.weibo-list')
    weiboList.addEventListener('click', function (event) {
        var self = event.target
        if (self.classList.contains('weibo-edit')) {
            log('点到了编辑按钮')
            var weibo_id = self.dataset.id
            var w = weiboUpdateTemplate(weibo_id)
            self.parentElement.insertAdjacentHTML('beforeend', w)
        } else {
            log('点到了 weibo cell')
        }
    })
}

var bindEventWeiboUpdate = function() {
    var weiboList = e('.weibo-list')
    weiboList.addEventListener('click', function (event) {
        var self = event.target
        if (self.classList.contains('weibo-update')) {
            log('点到了更新按钮')
            // closest()拿到button的父元素
            var weiboCell = self.closest('.weibo-cell')
            // querySelector()得用父元素调用
            var input = weiboCell.querySelector('.weibo-update-input')
            var weiboId = self.dataset.id
            var form = {
                id: weiboId,
                content: input.value,
            }
            apiWeiboUpdate(form, function(response) {
                log('update', response)

                var updateForm = weiboCell.querySelector('.weibo-update-form')
                updateForm.remove()

                var weibo = JSON.parse(response)
                var weiboTag = weiboCell.querySelector('.weibo-content')
                weiboTag.innerHTML = weibo.content
            })

        } else {
            log('点到了 weibo cell')
        }
    })
}

var bindEventCommentAdd = function() {
    var commentList = e('.weibo-list')
    // 注意, 第二个参数可以直接给出定义函数
    commentList.addEventListener('click', function(event){
        self = event.target
        if (self.classList.contains('comment-add')){
            var input = e('.input-comment')
            log('input被成功捕获', input)
            var content = input.value
            var weibo_id = self.dataset.weibo_id
            log('self里面有啥',self.dataset)
            var form = {
                weibo_id: weibo_id,
                content: content,
            }
            log('前端的form', form)
            apiCommentAdd(form, function(response) {
                // 收到返回的数据, 插入到页面中
                var comment = JSON.parse(response)
                insertComment(comment)
            })
        }
    })
}

var bindEventCommentDelete = function() {
    var commentList = e('.weibo-list')
    // 注意, 第二个参数可以直接给出定义函数
    commentList.addEventListener('click', function(event){
        self = event.target
        log('self classlist',self.classList)
        if (self.classList.contains('comment-delete')){
            log('点到了删除按钮, comment-id 是', self.dataset.id)
            var comment_id = self.dataset.id
            apiCommentDelete(comment_id, function(response) {
                // 删除 self 的父节点
                self.parentElement.remove()
            })
        } else {
            log('点到了 todo cell')
        }
    })
}


var loadComments = function(weibo_id) {
    log('前端获得weiboid并开始发送请求', weibo_id)
    apiCommentAll(weibo_id,function(r) {
        var commentLists = JSON.parse(r)
        log('前端获得了该微博的所有评论组成的数组', commentLists)
        for(var i = 0; i < commentLists.length; i++) {
            var comments = commentLists[i]
            log('获取一条评论', comments)
            insertComment(comments)
        }
    })
}

var loadWeibos = function() {
    apiWeiboAll(function(r) {
        var weibos = JSON.parse(r)
        for(var i = 0; i < weibos.length; i++) {
            var weibo = weibos[i]
            insertWeibo(weibo)
            log('该微博的id', weibo.id)
            loadComments(weibo.id)
        }
    })
}

var bindEvents = function() {
    bindEventWeiboAdd()
    bindEventWeiboDelete()
    bindEventWeiboEdit()
    bindEventWeiboUpdate()
}

var __main = function() {
    bindEvents()
    loadWeibos()
    bindEventCommentAdd()
    bindEventCommentDelete()



}

__main()