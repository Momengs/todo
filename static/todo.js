// TODO API
// 获取所有 todo
var apiTodoAll = function(callback) {
    var path = '/api/todo/all'
    ajax('GET', path, '', callback)
}

var apiTodoDelete = function(id, callback) {
    var path = `/api/todo/delete?id=${id}`
    ajax('GET', path, '', callback)
}

// 增加一个 todo
var apiTodoAdd = function(form, callback) {
    var path = '/api/todo/add'
    ajax('POST', path, form, callback)
}

var apiTodoUpdate = function(form, callback) {
    var path = '/api/todo/update'
    ajax('POST', path, form, callback)
}

// TODO DOM
var todoTemplate = function(todo) {
    var t = `
        <div class="todo-cell">
            <button data-id=${todo.id} class="todo-delete">删除</button>
            <button data-id=${todo.id} class="todo-edit">编辑</button>
            <span class="todo-task" >${todo.task}</span>
            <span>创建时间： ${todo.created_time}</span>
            <span>修改时间： ${todo.updated_time}</span>
        </div>
    `
    return t
}

var todoUpdateTemplate = function(todo_id) {
    var t = `
        <div class="todo-update-form">
            <input class="todo-update-input">
            <button data-id=${todo_id} class="todo-update">更新</button>
        </div>
    `
    return t
}

var insertTodo = function(todo) {
    var todoCell = todoTemplate(todo)
    // 插入 todo-list
    var todoList = e('.todo-list')
    todoList.insertAdjacentHTML('beforeend', todoCell)
}

var loadTodos = function() {
    // 调用 ajax api 来载入数据
    apiTodoAll(function(r) {
        console.log('load todo all', r)
        // 解析为 数组
        var todos = JSON.parse(r)
        // 循环添加到页面中
        for(var i = 0; i < todos.length; i++) {
            var todo = todos[i]
            insertTodo(todo)
        }
    })
}

var bindEventTodoAdd = function() {
    var b = e('#id-button-add')
    log('开始监听了某个标签', b)
    // 注意, 第二个参数可以直接给出定义函数
    b.addEventListener('click', function(){
        var input = e('#id-input-todo')
        var task = input.value
        log('click add', task)
        var form = {
            task: task,
        }
        apiTodoAdd(form, function(response) {
            // 收到返回的数据, 插入到页面中
            var todo = JSON.parse(response)
            insertTodo(todo)
        })
    })
}

var bindEventTodoDelete = function() {
    var todoList = e('.todo-list')
    // 事件响应函数会传入一个参数 就是事件本身
    todoList.addEventListener('click', function (event) {
        log(event)
        // 我们可以通过 event.target 来得到被点击的对象
        var self = event.target
        log('被点击的元素', self)
        // 通过比较被点击元素的 class
        // 来判断元素是否是我们想要的
        // classList 属性保存了元素所有的 class
        log(self.classList)
        if (self.classList.contains('todo-delete')) {
            log('点到了 完成按钮, id 是', self.dataset.id)
            var todo_id = self.dataset.id
            apiTodoDelete(todo_id, function(response) {
                // 删除 self 的父节点
                self.parentElement.remove()
            })
        } else {
            log('点到了 todo cell')
        }
    })
}

var bindEventTodoEdit = function() {
    var todoList = e('.todo-list')
    todoList.addEventListener('click', function (event) {
        var self = event.target
        if (self.classList.contains('todo-edit')) {
            log('点到了编辑按钮')
            var todo_id = self.dataset.id
            var t = todoUpdateTemplate(todo_id)
            self.parentElement.insertAdjacentHTML('beforeend', t)
        } else {
            log('点到了 todo cell')
        }
    })
}

var bindEventTodoUpdate = function() {
    var todoList = e('.todo-list')
    todoList.addEventListener('click', function (event) {
        var self = event.target
        if (self.classList.contains('todo-update')) {
            log('点到了更新按钮')

            var todoCell = self.closest('.todo-cell')
            var input = todoCell.querySelector('.todo-update-input')
            var todoId = self.dataset.id
            var form = {
                id: todoId,
                task: input.value,
            }
            apiTodoUpdate(form, function(response) {
                log('update', response)

                var updateForm = todoCell.querySelector('.todo-update-form')
                updateForm.remove()

                var todo = JSON.parse(response)
                var todoTag = todoCell.querySelector('.todo-task')
                todoTag.innerHTML = todo.task
            })

        } else {
            log('点到了 todo cell')
        }
    })
}


var bindEvents = function() {
    bindEventTodoAdd()
    bindEventTodoDelete()
    bindEventTodoEdit()
    bindEventTodoUpdate()
}

var __main = function() {
    bindEvents()
    loadTodos()
}

__main()






/*
给 删除 按钮绑定删除的事件
1, 绑定事件
2, 删除整个 todo-cell 元素
*/
// var todoList = e('.todo-list')
// // 事件响应函数会被传入一个参数, 就是事件本身
// todoList.addEventListener('click', function(event){
//     // log('click todolist', event)
//     // 我们可以通过 event.target 来得到被点击的元素
//     var self = event.target
//     // log('被点击的元素是', self)
//     // 通过比较被点击元素的 class 来判断元素是否是我们想要的
//     // classList 属性保存了元素的所有 class
//     // 在 HTML 中, 一个元素可以有多个 class, 用空格分开
//     // log(self.classList)
//     // 判断是否拥有某个 class 的方法如下
//     if (self.classList.contains('todo-delete')) {
//         log('点到了 删除按钮')
//         // 删除 self 的父节点
//         // parentElement 可以访问到元素的父节点
//         self.parentElement.remove()
//     } else {
//         // log('点击的不是删除按钮******')
//     }
// })
