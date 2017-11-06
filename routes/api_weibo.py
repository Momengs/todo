from utils import log
from routes import json_response, current_user
from models.weibo import Weibo
from models.comment import Comment
import json


def all(request):
    weibos = Weibo.all_json()
    return json_response(weibos)


def add(request):
    u = current_user(request)
    form = request.json()
    w = Weibo.new(form, u.id)
    return json_response(w.json())


def delete(request):
    weibo_id = int(request.query.get('id'))
    w = Weibo.delete(weibo_id)
    return json_response(w.json())


def update(request):
    form = request.json()
    weibo_id = int(form.get('id'))
    w = Weibo.update(weibo_id, form)
    return json_response(w.json())


def comment_all(request):
    log('comment_all路由函数接收到请求查询路径', request.query)
    id = int(request.query['weibo_id'])
    log('获取该微博id成功', id)
    c = Comment.find_all(weibo_id=id)
    log('获取该微博所有评论成功', c, type(c[0]))
    d = [i.json() for i in c]
    return json_response(d)


def comment_add(request):
    u = current_user(request)
    form = request.json()
    log('后端接到的form', form)
    c = Comment.new(form, u.id)
    return json_response(c.json())


def comment_delete(request):
    comment_id = int(request.query.get('id'))
    c = Comment.delete(comment_id)
    log('获取评论删除成功', c)
    return json_response(c.json())


def route_dict():
    d = {
        '/api/weibo/all': all,
        '/api/weibo/add': add,
        '/api/weibo/delete': delete,
        '/api/weibo/update': update,
        '/api/comment/all': comment_all,
        '/api/comment/add': comment_add,
        '/api/comment/delete': comment_delete,
    }
    return d

