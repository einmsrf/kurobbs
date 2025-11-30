// exchange-commodity.js
// 商品ID变量 - 根据需要修改此变量
const commodityCode = "1443554543620575232"; // 示例商品ID，从文档中提取

// 固定参数 - 从请求包中提取，无需解码，直接使用URL编码形式
const bodyParams = `area=%E6%98%8C%E5%B9%B3%E5%8C%BA&city=%E5%8C%97%E4%BA%AC%E5%B8%82&commodityCode=${encodeURIComponent(commodityCode)}&commodityNum=1&detail=%E4%BD%B0%E5%98%89%E5%9F%8E15%E5%8F%B7%E6%A5%BC1%E5%8D%95%E5%85%83401&gameId=2&geeTestData=&mobile=18529520016&province=%E5%8C%97%E4%BA%AC%E5%B8%82&receiver=%E8%8C%83%E8%B1%AA%E5%AE%87`;

// 构建请求
const url = "https://api.kurobbs.com/encourage/order/create";
const headers = {
    "source": "ios",
    "lang": "zh-Hans",
    "User-Agent": "KuroGameBox/20251119170243 CFNetwork/3826.600.41 Darwin/24.6.0",
    "Cookie": "acw_tc=b202e043-657c-4dd9-846a-1c1769e121682056399bd2ce8c170423ca35d3f688a3",
    "Ip": "192.168.2.31",
    "channelId": "1",
    "channel": "appstore",
    "distinct_id": "DE121F54-9C74-45DB-9CCC-4AEB83B71C22",
    "version": "2.8.0",
    "devCode": "14FB5208-5C8D-4BAE-9A13-D0E1FABC6336",
    "token": "eyJhbGciOiJIUzI1NiJ9.eyJjcmVhdGVkIjoxNzUyNjcyMzk2MDE2LCJ1c2VySWQiOjEwMzc3NjE2fQ.PidWHBk9GYMaNCJSQrzleluzP7ggnhY_yP7PEqGgArQ",
    "Connection": "keep-alive",
    "Accept-Language": "zh-CN,zh-Hans;q=0.9",
    "model": "iPhone17,1",
    "osVersion": "18.7.1",
    "Accept": "*/*",
    "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
    "Accept-Encoding": "gzip, deflate, br"
};

// 发送POST请求
$httpClient.post({
    url: url,
    headers: headers,
    body: bodyParams
}, function(error, response, data) {
    if (error) {
        console.error("请求失败: " + error);
        $notification.post("兑换失败", "网络错误", error);
        return;
    }
    
    if (response.status === 200) {
        try {
            const json = JSON.parse(data);
            if (json.success && json.code === 200) {
                console.log("兑换成功: " + json.msg);
                $notification.post("兑换成功", "商品已兑换", json.msg);
            } else {
                console.log("兑换失败: " + json.msg);
                $notification.post("兑换失败", json.msg, "请检查商品库存或参数");
            }
        } catch (e) {
            console.error("解析响应失败: " + e);
            $notification.post("兑换异常", "响应解析错误", data);
        }
    } else {
        console.log("HTTP错误: " + response.status);
        $notification.post("兑换失败", "HTTP " + response.status, "服务器返回非200状态");
    }
});

console.log("定时任务执行: 尝试兑换商品 " + commodityCode);// exchange-commodity.js
// 商品ID变量 - 根据需要修改此变量
const commodityCode = "1443554543620575232"; // 示例商品ID，从文档中提取

// 固定参数 - 从请求包中提取，无需解码，直接使用URL编码形式
const bodyParams = `area=%E6%98%8C%E5%B9%B3%E5%8C%BA&city=%E5%8C%97%E4%BA%AC%E5%B8%82&commodityCode=1443554543620575232&commodityNum=1&detail=%E4%BD%B0%E5%98%89%E5%9F%8E15%E5%8F%B7%E6%A5%BC1%E5%8D%95%E5%85%83401&gameId=2&geeTestData=%7B%22captcha_id%22%3A%229ad5bca3df011e3476728a081e6a9cf0%22%2C%22pass_token%22%3A%22c9bf9dae24f92788403a4b58861613ded88febbce9d1f146627ef32fb41808fc%22%2C%22lot_number%22%3A%2246981346021b4125b9aca4571eab7720%22%2C%22gen_time%22%3A%221764503186%22%2C%22captcha_output%22%3A%221dhE1pbH1b8Rixpe-Ya2gqY8Oyxj05JSJoQ1f-xUk-xSfu628nZr-9iBAvWKw0Q2nKtzlypITG31DCccZBGRxj-nMaOdePW5i43hBN4ZpZBZ0AHVUtQskcGRSGguud2ZFcEcuOobauccSNCk7iVI867WTWoMs08_26uJhUoNl0LmTIP8kJSPU9SIFiPgvCK1OahonhY1SFOt4Ppm0sFWH1wfn4PlSTFomBArmAYladC_A1ZjuEhRGqYSebzrJ_JPjrjGPP6DITQmvK9968eqHh3CQaM_qtNA2l6WPn47qi7rvwEp_vzaSGmK2I1Z8SOi5r4me4t0lwVSxOmFCbSpu5DOt0yvl8GXQKZ2b6hVBBzDlj09qEznskDSwD_aAuRdMPJw0gJIjgNRq1E6uO2JkbCumeiMwnbzVxHW18nRC0k%3D%22%7D&mobile=18529520016&province=%E5%8C%97%E4%BA%AC%E5%B8%82&receiver=%E8%8C%83%E8%B1%AA%E5%AE%87`;

// 构建请求
const url = "https://api.kurobbs.com/encourage/order/create";
const headers = {
    "source": "ios",
    "lang": "zh-Hans",
    "User-Agent": "KuroGameBox/20251119170243 CFNetwork/3826.600.41 Darwin/24.6.0",
    "Cookie": "acw_tc=b202e043-657c-4dd9-846a-1c1769e121682056399bd2ce8c170423ca35d3f688a3",
    "Ip": "192.168.2.31",
    "channelId": "1",
    "channel": "appstore",
    "distinct_id": "DE121F54-9C74-45DB-9CCC-4AEB83B71C22",
    "version": "2.8.0",
    "devCode": "14FB5208-5C8D-4BAE-9A13-D0E1FABC6336",
    "token": "eyJhbGciOiJIUzI1NiJ9.eyJjcmVhdGVkIjoxNzUyNjcyMzk2MDE2LCJ1c2VySWQiOjEwMzc3NjE2fQ.PidWHBk9GYMaNCJSQrzleluzP7ggnhY_yP7PEqGgArQ",
    "Connection": "keep-alive",
    "Accept-Language": "zh-CN,zh-Hans;q=0.9",
    "model": "iPhone17,1",
    "osVersion": "18.7.1",
    "Accept": "*/*",
    "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
    "Accept-Encoding": "gzip, deflate, br"
};

// 发送POST请求
$httpClient.post({
    url: url,
    headers: headers,
    body: bodyParams
}, function(error, response, data) {
    if (error) {
        console.error("请求失败: " + error);
        $notification.post("兑换失败", "网络错误", error);
        return;
    }
    
    if (response.status === 200) {
        try {
            const json = JSON.parse(data);
            if (json.success && json.code === 200) {
                console.log("兑换成功: " + json.msg);
                $notification.post("兑换成功", "商品已兑换", json.msg);
            } else {
                console.log("兑换失败: " + json.msg);
                $notification.post("兑换失败", json.msg, "请检查商品库存或参数");
            }
        } catch (e) {
            console.error("解析响应失败: " + e);
            $notification.post("兑换异常", "响应解析错误", data);
        }
    } else {
        console.log("HTTP错误: " + response.status);
        $notification.post("兑换失败", "HTTP " + response.status, "服务器返回非200状态");
    }
});

console.log("定时任务执行: 尝试兑换商品 " + commodityCode);