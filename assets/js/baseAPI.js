//每次调用接口都会调用下面这个函数

$.ajaxPrefilter(function (options) {

    options.url = 'http://www.liulongbin.top:3007' + options.url
    console.log(options.url);

    //统一为有权限的接口设置headers请求
    if (options.url.indexOf('/my') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('tiken') || ''
        }
    }
    //全局complete回调函数
    options.complete = function (res) {
        console.log('执行了res');
        console.log(res);
        //在complete回调函数中可以使用res.responseJSON拿到
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            //1强制清空tiken
            localStorage.removeItem('tiken')
            //2强制跳转到登录也
            location.href = '/login.html'
        }
    }
})