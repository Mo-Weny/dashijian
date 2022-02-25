$(function () {
    var layer = layui.layer
    var form = layui.form
    initCate()
    //初始化富文本编辑器
    initEditor()

    //定义加载文章分类方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('初始化文章分类失败')
                }
                //调用模板引擎渲染下拉菜单数据
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                //一定调用form.render()
                form.render()
            }
        })
    }

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    //为选择封面的按钮绑定点击事件处理
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click()
    })

    //监听 coverFile的change事件 ,获取用户选的文件列表
    $('#coverFile').on('change', function (e) {
        var files = e.target.files
        //判断该用户是否选择了文件
        if (files.length === 0) {
            return
        }
        //更具文件,创建对应的url地址
        var newImgURL = URL.createObjectURL(files[0])
        //为裁剪区重新设置图片
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })


    var art_state = '已发布'
    //为存为草稿 绑定点击事件处理函数
    $('#btnSave2').on('click', function () {
        art_state = '草稿'
    })

    //为表单绑定submit事件
    $('#form-pub').on('submit', function (e) {
        //1阻止默认提交行为
        e.preventDefault()
        //2基于form表单,快速创建一个forData对象
        var fd = new FormData($(this)[0])
        //3将文章的发布状态存到fd中
        fd.append('state', art_state)
        //4将封面裁剪过后的文件 输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                //5将文件对象存储到fd中
                fd.append('cover_img', blob)
                //6发起ajax请求
                publishArticle(fd)

            })
        //定义一个发布文章的方法
        function publishArticle() {
            $.ajax({
                method: 'POST',
                url: '/my/article/add',
                data: fd,
                //如果想服务器提交的是fordata格式需要配置下面配置项
                contentType: false,
                processData: false,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('发布文章失败')
                    }
                    layer.msg('发布文章成功')
                    location.href = '/article/art_list.html'
                }

            })
        }
    })

})