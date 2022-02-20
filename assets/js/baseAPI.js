//每次调用接口都会调用下面这个函数

$.ajaxPrefilter(function (options) {

    options.url = 'http://www.liulongbin.top:3007' + options.url
    console.log(options.url);
})