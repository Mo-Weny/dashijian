$(function () {
    // 调用getUserInfo()获取用户基本信息
    getUserInfo()

    var layer = layui.layer

    //点击退出实现退出账号
    $('#btnLogout').on('click', function () {
        //确认用户是否退出
        layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function (index) {
            //1清空本地存储
            localStorage.removeItem('tiken')
            //2跳转到登录也
            location.href = '/login.html'
            //关闭询问看
            layer.close(index);
        })
    })
})

//获取用户的基本信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        //headers请求头字段
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function (res) {
            if (res.status != 0) {
                return layui.layer.msg('获取用户失败')
            }
            //调用下面函数渲染用户头像
            renderAvatar(res.data)
        },
        //成功or失败都会调用complete回调函数
        // complete: function (res) {
        //     console.log('执行了res');
        //     console.log(res);
        //     //在complete回调函数中可以使用res.responseJSON拿到
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        //         //1强制清空tiken
        //         localStorage.removeItem('tiken')
        //         //2强制跳转到登录也
        //         location.href = '/login.html'
        //     }
        // }
    })
}
function renderAvatar(user) {
    //1获取用户名字
    var name = user.nickname || user.username
    //2设置欢迎文本
    $('#welcome').html('欢迎&nbsp&nbsp' + name)
    //3按需渲染用户头像
    if (user.user_pic !== null) {
        //渲染图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide()
    } else {
        //渲染文字头像
        $('.layui-nav-img').hide()
        var first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()
    }
}