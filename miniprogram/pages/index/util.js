function getNewData( pageindex, callbackcount, callback) {
  wx.request({
      url: 'https://meng.taropowder.cn/wechat/api/song_list.php',
    data: {
      order: 'creat_time',
        g_tk: 5381,
        uin: 0, 
        format: 'json', 
        inCharset: 'utf-8', 
        outCharset: 'utf-8', 
        ie: 'utf-8', 
        num: callbackcount, 
        page: pageindex 
        },    
        method: 'GET',    
        header: {'content-Type': 'application/json'},    
        success: function(res){      
          if(res.statusCode == 200)
          {        callback(res.data);     }    
          }  
          }
          )} 
module.exports = { getNewData: getNewData}
