/*
    各配置项
 */
//服务器连接地址
var ServiceIP = "http://127.0.0.1:8000/";
var ServiceName = "MobileCheckAuditPlatform";

//定时拉取系统任务(未分配任务)[单位：毫秒]
var GetSystemTaskTimeSet = 300000;//




/*
    各工具类
 */

// 获取地址栏的参数数组
function getUrlParams()
{
    var search = window.location.search ;
    // 写入数据字典
    var tmparray = search.substr(1,search.length).split("&");
    var paramsArray = new Array;
    if( tmparray != null)
    {
        for(var i = 0;i<tmparray.length;i++)
        {
            var reg = /[=|^==]/;    // 用=进行拆分，但不包括==
            var set1 = tmparray[i].replace(reg,'&');
            var tmpStr2 = set1.split('&');
            var array = new Array ;
            array[tmpStr2[0]] = tmpStr2[1] ;
            paramsArray.push(array);
        }
    }
    // 将参数数组进行返回
    return paramsArray ;
}

// 根据参数名称获取参数值
function getParamValue(name)
{
    var paramsArray = getUrlParams();
    if(paramsArray != null)
    {
        for(var i = 0 ; i < paramsArray.length ; i ++ )
        {
            for(var  j in paramsArray[i] )
            {
                if( j == name )
                {
                    return paramsArray[i][j] ;
                }
            }
        }
    }
    return null ;
}
