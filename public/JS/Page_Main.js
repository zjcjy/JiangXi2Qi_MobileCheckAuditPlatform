/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 13-4-26
 * Time: 上午10:15
 * To change this template use File | Settings | File Templates.
 */


/*
   页面全局变量
 */

var SystemTaskStore = [];
var MineTaskStore = [];

Ext.onReady(function(){
    var west_Panel = new Ext.Panel({//左边大Panel壳子
        layout:'border',
        id:'west_Panel',
        region: 'west',
        width:200,
        items:[
            new Ext.Panel({//左上Panel
                id:'west_North_Panel',
                region: 'north',
                bodyBorder:false,//边框，统一不显示。
                height:150,
                html:'west_North_Panel'
            }),
            new Ext.Panel({//左中和左下Panel的壳子
                layout:'border',
                id:'west_Center_Panel',
                region: 'center',
                items:[
                    new Ext.Panel({//左中Panel
                        id:'west_Center_North_Panel',
                        region: 'north',
                        title:'任务信息',
                        height:180,
                        //html:'west_Center_North_Panel'
                        html:'<div id="divTaskInfo"></div>'
                    }),
                    new Ext.TabPanel({//左下TabPanel壳子
                        id:'west_Center_Center_Panel',
                        region: 'center',
                        activeTab:0,//默认触发第一个TabPanel页
                        items:[
                            new Ext.Panel({//左下TabPanel_1
                                id:'west_Center_Center_TabPanel_1',
                                title:'在线查勘员',
                                html:'west_Center_Center_TabPanel_1'
                            }),
                            new Ext.Panel({//左下TabPanel_2
                                id:'west_Center_Center_TabPanel_2',
                                title:'拆检点',
                                html:'west_Center_Center_TabPanel_2'
                            })
                        ]
                    })
                ]
            })
        ]
    });

    var east_Panel = new Ext.Panel({//右边任务列表大Panel壳子
        layout:'border',
        id:'east_Panel',
        region: 'east',
        width:200,
        items:[
            new Ext.Panel({//右上Panel
                id:'east_North_Panel',
                region: 'north',
                title:'待分配任务',
                height:330,
                //html:'east_North_Panel'
                items:[
                    new Ext.tree.TreePanel({
                        id:'treeSystemTask',
                        useArrows: true,
                        autoScroll: true,
                        border: false,
                        height:305,
                        rootVisible: false,
                        listeners:{
                            'click':function(node){
                                //alert('单击查看信息。ID:'+node.id);
                                TaskClick(node.id.split('_')[1],'SystemTask');
                            },//监听节点的点击事件。
                            'dblclick':function(node){
                                Ext.Msg.confirm('系统提示','是否领取该任务 [ '+node.text+' ] ?',
                                    function(btn){
                                        if(btn=='yes')
                                            GetTaskByID(selectChild.id.split('_')[1]);
                                    });
                                }
                        },
                        root: {
                            nodeType: 'async',
                            text: 'Ext JS',
                            draggable: false,
                            id: 'treeSystemTaskRoot'
                            }
                        })
                ]
            }),
            new Ext.Panel({//右下Panel
                id:'east_Center_Panel',
                region: 'center',
                title:'我的任务列表',
                //html:'east_Center_Panel'
                items:[
                    new Ext.tree.TreePanel({
                        id:'treeMineTask',
                        useArrows: true,
                        autoScroll: true,
                        border: false,
                        height:305,
                        rootVisible: false,
                        listeners:{
                            'click':function(node){
                                //alert('单击查看信息。ID:'+node.id);
                                TaskClick(node.id.split('_')[1],'MineTask');
                            },//监听节点的点击事件。
                            'dblclick':function(node){
                                //alert('双击获取任务。ID:'+node.id);
                            }
                        },
                        root: {
                            nodeType: 'async',
                            text: 'Ext JS',
                            draggable: false,
                            id: 'treeMineTaskRoot'
                        }
                    })
                ]
            })
        ]

    });

    var center_Panel = new Ext.Panel({//中间Panel壳子
        layout:'border',
        id:'center_Panel',
        region: 'center',
        items:[
            new Ext.Panel({//中上Panel
                id:'center_North_Panel',
                region: 'north',
                title:'任务图片信息',
                height:150,
                html:'center_North_Panel'
            }),
            new Ext.Panel({//中下Panel
                id:'center_Center_Panel',
                region: 'center',
                html:'<div id="divcenter_Center_Panel">center_Center_Panel</div>'
            }),
            new Ext.Toolbar({//底部状态栏
                id:'center_South_ToolBar',
                region:'south',
                height:26,
                items:[
                    new Ext.Button({
                        id:'btn_DataEntry',
                        iconCls:'toolBar-Button-DataEntry',
                        text:'资料录入',
                        listeners:{'click':function(){}}
                    }),'-',
                    new Ext.Button({
                        id:'btn_LocalView',
                        iconCls:'toolBar-Button-LocalView',
                        text:'本地浏览',
                        listeners:{'click':function(){}}
                    }),'-',
                    new Ext.Button({
                        id:'btn_RiskJudge',
                        iconCls:'toolBar-Button-RiskJudge',
                        text:'风险判定',
                        listeners:{'click':function(){}}
                    }),'-',
                    new Ext.Button({
                        id:'btn_CloseCase',
                        iconCls:'toolBar-Button-CloseCase',
                        text:'结案',
                        listeners:{'click':function(){CloseCase();}}
                    }),'-',
                    new Ext.Button({
                        id:'btn_VoiceIntercom',
                        iconCls:'toolBar-Button-VoiceIntercomOff',
                        text:'语音对讲',
                        listeners:{'click':function(){}}
                    }),'-',
                    new Ext.Button({
                        id:'btn_SnapPhoto',
                        iconCls:'toolBar-Button-SnapPhoto',
                        text:'抓拍',
                        listeners:{'click':function(){}}
                    }),'-',
                    new Ext.Button({
                        id:'btn_CheckStationVideo',
                        iconCls:'toolBar-Button-CheckStationVideo',
                        text:'拆检点视频',
                        listeners:{'click':function(){}}
                    }),'->',
                    new Ext.Button({
                        id:'btn_GetTask',
                        iconCls:'toolBar-Button-GetTask',
                        text:'获取任务',
                        listeners:{
                            'click':function(){
                                var selectChild = Ext.getCmp('treeSystemTask').getSelectionModel().getSelectedNode();
                                if(selectChild)
                                {
                                    Ext.Msg.confirm('系统提示','是否领取该任务 [ '+selectChild.text+' ] ?',
                                        function(btn){
                                            if(btn=='yes')
                                                GetTaskByID(selectChild.id.split('_')[1]);
                                        });
                                }
                                else
                                    Ext.Msg.alert('提示', '请先选择一个待分配任务。');
                            }
                        }
                    }),
                    '<span id="workstate" style="color:Red">繁忙</span>'
                ]
            })
        ]

    });

    var viewport = new Ext.Viewport({
        layout:'border',
        items:[west_Panel,east_Panel,center_Panel],
        listeners:{
            'render':function(){GetSystemTask();GetMineTask();}
        }
    });
});

//定时获取系统任务
function GetSystemTask()
{
    $.ajax({
        type : "post",
        async:false,
        url : ServiceIP+ServiceName+'/GetSystemTask',
        dataType : "jsonp",
        data:{"RandomTag":Math.random()},
        jsonp: "callbackname",//服务端用于接收callback调用的function名的参数
        jsonpCallback:"jsonpCallbackGetSystemTask",//callback的function名称
        success : function(json){
            if(json.code == 0){
                $("#divcenter_Center_Panel").html(JSON.stringify(json));
                var treeRoot = Ext.getCmp('treeSystemTask').getRootNode();
                SystemTaskStore = json["value"]["systemtask_list"];
                var jsonStr = JSON.stringify(SystemTaskStore);

                //移除不存在节点
                var treeNodeRemoveArray = [];//记录需要移除的数组
                var treeRootSize = 0;//遍历计数器
                treeRoot.eachChild(function(delChild){
                    treeRootSize++;
                    var cidArray = delChild.id.split('_');
                    if (jsonStr.indexOf('"TaskID":' + cidArray[1] + ',') < 0) {
                        treeNodeRemoveArray.push(delChild);
                    }
                    //因each是异步的，所以必须记录下所有需要移除的child，等计数器统计完each之后，一次性全部移除需要移除的child。
                    if(treeRootSize >= treeRoot.childNodes.length)
                    {
                        for(var k = 0;k<treeNodeRemoveArray.length;k++)
                        {
                            treeRoot.removeChild(treeNodeRemoveArray[k]);
                        }
                    }
                });

                //添加不存在节点
                for(var i=0;i<json["value"]["systemtask_list"].length;i++)
                {
                    var gst = json["value"]["systemtask_list"][i];
                    var treeSystemTaskNodeID = 'tstn_'+ gst.TaskID + '_' + gst.CaseNo;

                    //判断是否已存在对应ID的节点
                    var notHasNode = true;//为真的时候即不存在
                    treeRoot.eachChild(function(addChild){
                        if(addChild.id == treeSystemTaskNodeID)
                        {
                            notHasNode=false;
                        }
                    });

                    //不存在则插入
                    if(notHasNode)
                    {
                        treeRoot.appendChild({
                            "text": gst.CaseNo + '_' + gst.TaskType,
                            "id": treeSystemTaskNodeID,
                            "iconCls": "treePanel-Nodes-SystemTask",
                            "treeNodeTag":gst.TaskID,
                            "leaf": true
                        });
                    }
                }

            } else {
                Ext.Msg.alert('系统任务列表获取失败', json.cause);
            }
        },
        error:function(){
            alert('fail');
        }
    });
    setTimeout(GetSystemTask,GetSystemTaskTimeSet);//定时获取系统任务
}

//获取我的任务
function GetMineTask()
{
    $.ajax({
        type : "post",
        async:false,
        url : ServiceIP+ServiceName+'/GetMineTask',
        dataType : "jsonp",
        data:{'username':getParamValue('username'),"RandomTag":Math.random()},
        jsonp: "callbackname",//服务端用于接收callback调用的function名的参数
        jsonpCallback:"jsonpCallbackGetMineTask",//callback的function名称
        success : function(json){
            if(json.code == 0){
                //$("#divcenter_Center_Panel").html(JSON.stringify(json));
                var treeRoot = Ext.getCmp('treeMineTask').getRootNode();
                MineTaskStore = json["value"]["minetask_list"];
                var jsonStr = JSON.stringify(MineTaskStore);

                //移除不存在节点
                var treeNodeRemoveArray = [];//记录需要移除的数组
                var treeRootSize = 0;//遍历计数器
                treeRoot.eachChild(function(delChild){
                    treeRootSize++;
                    var cidArray = delChild.id.split('_');
                    if (jsonStr.indexOf('"TaskID":' + cidArray[1] + ',') < 0) {
                        treeNodeRemoveArray.push(delChild);
                    }
                    //因each是异步的，所以必须记录下所有需要移除的child，等计数器统计完each之后，一次性全部移除需要移除的child。
                    if(treeRootSize >= treeRoot.childNodes.length)
                    {
                        for(var k = 0;k<treeNodeRemoveArray.length;k++)
                        {
                            treeRoot.removeChild(treeNodeRemoveArray[k]);
                        }
                    }
                });

                //添加不存在节点
                for(var i=0;i<json["value"]["minetask_list"].length;i++)
                {
                    var gst = json["value"]["minetask_list"][i];
                    var treeMineTaskNodeID = 'tstn_'+ gst.TaskID + '_' + gst.CaseNo;

                    //判断是否已存在对应ID的节点
                    var notHasNode = true;//为真的时候即不存在
                    treeRoot.eachChild(function(addChild){
                        if(addChild.id == treeMineTaskNodeID)
                        {
                            notHasNode=false;
                        }
                    });

                    //不存在则插入
                    if(notHasNode)
                    {
                        treeRoot.appendChild({
                            "text": gst.CaseNo + '_' + gst.TaskType,
                            "id": treeMineTaskNodeID,
                            "iconCls": "treePanel-Nodes-MineTask",
                            "treeNodeTag":gst.TaskID,
                            "leaf": true
                        });
                    }
                }

            } else {
                Ext.Msg.alert('我的任务列表获取失败', json.cause);
            }
        },
        error:function(){
            alert('fail');
        }
    });
}

//获取系统任务到我的任务列表中
function GetTaskByID(TaskID)
{
    $.ajax({
        type : "post",
        async:false,
        url : ServiceIP+ServiceName+'/GetTaskByID',
        dataType : "jsonp",
        data:{'username':getParamValue('username'),'taskid':TaskID,"RandomTag":Math.random()},
        jsonp: "callbackname",//服务端用于接收callback调用的function名的参数
        jsonpCallback:"jsonpCallbackGetTaskByID",//callback的function名称
        success : function(json){
            if(json.code == 0){
                var treeSystemRoot = Ext.getCmp('treeSystemTask').getRootNode();
                var treeMineRoot = Ext.getCmp('treeMineTask').getRootNode();

                if(json.value>0){
                    treeSystemRoot.eachChild(function(addChild){
                        if (addChild.id.split('_')[1] == TaskID) {
                            treeMineRoot.appendChild(addChild);//将该系统任务移动到我的任务树
                            for(var s=0;s<SystemTaskStore.length;s++)
                            {
                                if(SystemTaskStore[s].TaskID == TaskID)
                                {
                                    MineTaskStore.push(SystemTaskStore[s]);
                                    SystemTaskStore.splice(s,1);
                                    break;
                                }
                            }
                        }
                    });
                } else {
                    Ext.Msg.alert('任务获取失败', "任务不存在或已被他人获取。");
                    treeSystemRoot.eachChild(function(delChild){
                        if (delChild.id.split('_')[1] == TaskID) {
                            treeSystemRoot.removeChild(delChild);//将该系统任务删除
                        }
                    });
                }
            } else {
                Ext.Msg.alert('任务获取失败', json.cause);
            }
        },
        error:function(){
            alert('fail');
        }
    });
}

//单击案件事件
function TaskClick(taskID,treeNodeType)
{
    var treeNodeStore = treeNodeType=='SystemTask'?SystemTaskStore:MineTaskStore;
    var _task;
    for(var i = 0;i<treeNodeStore.length;i++){
        if(treeNodeStore[i].TaskID == taskID)
        {
            _task = treeNodeStore[i];
            break;
        }
    }
    if(_task)
    {
        //alert(_task.TaskID+'---'+_task.CaseNo);
        $("#divTaskInfo").html(
            '<span style="color:blue;font-size: 12px;">&nbsp;'+ _task.CaseNo + _task.TaskType +'</span><br />'+
            '<span style="font-size: 12px;">&nbsp;操作员：</span><span style="color:blue;font-size: 12px;">'+ _task.FrontOperator +'(' + _task.RealName + ')</span><br />'+
            '<span style="font-size: 12px;">&nbsp;车牌号：</span><span style="color:blue;font-size: 12px;">'+ _task.CarMark +'</span><br />'+
            '<span style="font-size: 12px;">&nbsp;车主姓名：</span><span style="color:blue;font-size: 12px;">'+ _task.CarOwner +'</span><br />'+
            '<span style="font-size: 12px;">&nbsp;车主电话：</span><span style="color:blue;font-size: 12px;">'+ _task.Telephone +'</span><br />'+
            '<span style="font-size: 12px;">&nbsp;审核时间：</span><span style="color:blue;font-size: 12px;">'+ _task.AccidentTime +'</span><br />'+
            '<span style="font-size: 12px;">&nbsp;案发地址：</span><span style="color:blue;font-size: 12px;"><img src="../Images/map.gif" style="cursor:pointer" onclick="alert(\'clickMap!\')" /></span>'
        );
    }
}

//填充视频框，显示结案窗口
function CloseCase(){
    if(!Ext.getCmp('windowCloseCase'))
    {
        var CloseCaseWindow = new Ext.Window({
            id:'windowCloseCase',
            title:'金额录入',
            layout:'fit',
            width:300,
            height:170,
            closeAction:'close',
            plain: true,
            items: [
                new Ext.FormPanel({
                    id:'CloseCase_Panel',
                    frame:true,
                    labelAlign:'right',
                    items:[
                        {
                            xtype:'textfield',
                            regex:/\d+/,//正则验证该字段为数字
                            width:110,
                            fieldLabel:'估审金额',
                            //value:estmount,
                            id:'estMount',
                            allowBlank:false,//禁止为空
                            name:'estMount'
                        },{
                            xtype:'textfield',
                            regex:/\d+/,
                            width:110,
                            fieldLabel:'初审金额',
                            id:'auditMount',
                            //value:auditmount,
                            allowBlank:false,//禁止为空
                            name:'auditMount'
                        },{
                            xtype:'textfield',
                            regex:/\d+/,
                            width:110,
                            fieldLabel:'实际金额',
                            id:'fixedMount',
                            //value:fixedmount,
                            allowBlank:false,//禁止为空
                            name:'fixedMount'
                        }
                    ]
                })
            ],
            buttonAlign:'left',
            buttons: [{
                text:'出单',
                disabled:true
            },'->',{
                text: '直接结案 ',
                handler: function(){
                    Ext.getCmp('windowCloseCase').destroy();
                }
            }]
        });
        Ext.getCmp('windowCloseCase').show();
    } else {
        try{Ext.getCmp('windowCloseCase').destroy();}catch(err){}
    }
}