//从layui获取form对象
var form = layui.form
var layer = layui.layer
//通过from.verify()定义规则
form.verify({
    //自定义了一个pwd校验规则
    pwd: [/^[\S]{6,12}$/, '密码必须是6-12位,且不能有空格'],
    //校验两次密码是否一致
    samePwd: function (value) {
        var pwd = $('.layui-form [name=oldPwd]').val()
        if (pwd == value) {
            return '密码和原密码一致，请换个密码吧'
        }
    },
    //校验两次密码是否一致
    repwd: function (value) {
        //通过形参拿到确认密码框的内容
        //还需要拿到密码框的内容
        //然后进行一次等于判断
        //如果判断错误就return一个提示消息即可
        var pwd = $('.layui-form [name=newPwd]').val()
        if (pwd !== value) {
            return '两次密码不一致'
        }
    }
})

//
$('.layui-form').submit(function (e) {
    e.preventDefault()
    $.ajax({
        method: 'POST',
        url: '/my/updatepwd',
        data: $(this).serialize(),
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg('更改密码失败')
            }
            layui.layer.msg('密码更改成功')
            $('#btnReset').click()
        }
    })
})