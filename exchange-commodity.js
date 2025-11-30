// exchange-commodity.js (cron 脚本)
const commodityCode = "1443554543620575232"; // 示例商品ID，根据需要修改

// 读取存储的geeTestData
let geeTestData = $persistentStore.read("geeTestData");
if (!geeTestData) {
    console.error("未找到geeTestData变量，请先手动完成Geetest验证");
    $notification.post("兑换失败", "缺少CAPTCHA数据", "请手动触发/verify请求捕获数据");
    return;
}

// 固定参数，插入commodityCode和geeTestData
const baseParams = `area=%E6%98%8C%E5%B9%B3%E5%8C%BA&city=%E5%8C%97%E4%BA%AC%E5%B8%82&commodityCode=${encodeURIComponent(commodityCode)}&commodityNum=1&detail=%E4%BD%B0%E5%98%89%E5%9F%8E15%E5%8F%B7%E6%A5%BC1%E5%8D%95%E5%85%83401&gameId=2&mobile=18529520016&province=%E5%8C%97%E4%BA%AC%E5%B8%82&receiver=%E8%8C%83%E8%B1%AA%E5%AE%87`;
const bodyParams = baseParams + `&geeTestData=${geeTestData}`;

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
                // 可选：兑换后清除变量
                $persistentStore.write(null, "geeTestData");
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

console.log("定时任务执行: 尝试兑换商品 " + commodityCode + "，使用捕获的geeTestData");