from routes import (
    redirect,
    http_response,
    current_user,
    login_required,
)
from utils import template, log



def index(request):
    """
    主页的处理函数, 返回主页的响应
    """
    u = current_user(request)
    body = template('weibo_index.html')
    return http_response(body)


def route_dict():
    d = {
        '/weibo/index': login_required(index),
    }
    return d
