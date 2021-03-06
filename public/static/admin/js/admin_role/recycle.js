layui.use(['table', 'form', 'jquery'], function() {
    let table = layui.table;
    let form = layui.form;
    let $ = layui.jquery;
    let cols = [
        [{
                type: 'checkbox'
            },{
                field: 'id',
                 title: 'ID', 
                 sort: true, 
                 align: 'center',
                 unresize: true,
                 width: 80
            },{
                field: 'name',
                title: '角色名称',
                unresize: true,
                align: 'center'
            }, {
                field: 'desc',
                title: '描述',
                unresize: true,
                align: 'center',
            }, 
            {
                field: 'create_time',
                title: '创建时间',
                unresize: true,
                align: 'center'
            }, 
            {
                field: 'update_time',
                title: '更新时间',
                unresize: true,
                align: 'center'
            },
        ]
    ]

    table.render({
        elem: '#dataTable',
        url: 'recycle',
        page: true,
        cols: cols,
        skin: 'line',
        toolbar: '#toolbar',
        defaultToolbar: [{
            layEvent: 'refresh',
            icon: 'layui-icon-refresh',
        }, 'filter', 'print', 'exports']
    });

    table.on('toolbar(dataTable)', function(obj) {
        if (obj.event === 'batchRemove') {
            window.batchRemove(obj);
        }else if (obj.event === 'renew') {
            window.renew(obj);
        }else if (obj.event === 'refresh') {
            window.refresh();
        } 
    });

    window.renew = function(obj) {
        let data = table.checkStatus(obj.config.id).data;
        if (data.length === 0) {
            layer.msg("未选中数据", {
                icon: 3,
                time: 1000
            });
            return false;
        }
        var ids = []
        var hasCheck = table.checkStatus('dataTable')
        var hasCheckData = hasCheck.data
        if (hasCheckData.length > 0) {
            $.each(hasCheckData, function (index, element) {
                ids.push(element.id)
            })
        }
        layer.confirm('确定要恢复这些角色', {
            icon: 3,
            title: '提示'
        }, function(index) {
            layer.close(index);
            let loading = layer.load();
            $.ajax({
                url:"recycle",
                data:{ids:ids,type:1},
                dataType: 'json',
                type: 'POST',
                success: function(res) {
                    layer.close(loading);
                      //判断有没有权限
                      if(res && res.code==999){
                        layer.msg(res.msg, {
                            icon: 5,
                            time: 2000, 
                        })
                        return false;
                    }else if (res.code==200) {
                        layer.msg(res.msg, {
                            icon: 1,
                            time: 1000
                        }, function() {
                            table.reload('dataTable');
                        });
                    } else {
                        layer.msg(res.msg, {
                            icon: 2,
                            time: 1000
                        });
                    }
                }
            })
        });
    }

    window.batchRemove = function(obj) {
        let data = table.checkStatus(obj.config.id).data;
        if (data.length === 0) {
            layer.msg("未选中数据", {
                icon: 3,
                time: 1000
            });
            return false;
        }
        var ids = []
        var hasCheck = table.checkStatus('dataTable')
        var hasCheckData = hasCheck.data
        if (hasCheckData.length > 0) {
            $.each(hasCheckData, function (index, element) {
                ids.push(element.id)
            })
        }
        layer.confirm('确定要删除这些角色', {
            icon: 3,
            title: '提示'
        }, function(index) {
            layer.close(index);
            let loading = layer.load();
            $.ajax({
                url:"recycle",
                data:{ids:ids,type:2},
                dataType: 'json',
                type: 'POST',
                success: function(res) {
                    layer.close(loading);
                      //判断有没有权限
                      if(res && res.code==999){
                        layer.msg(res.msg, {
                            icon: 5,
                            time: 2000, 
                        })
                        return false;
                     }else if (res.code==200) {
                        layer.msg(res.msg, {
                            icon: 1,
                            time: 1000
                        }, function() {
                            table.reload('dataTable');
                        });
                    } else {
                        layer.msg(res.msg, {
                            icon: 2,
                            time: 1000
                        });
                    }
                }
            })
        });
    }

    window.refresh = function() {
        table.reload('dataTable');
    }
})