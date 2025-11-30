// kurobbs-exchange.js
// 主脚本: cron 类型，定时执行兑换逻辑
// 基于 nsloon.app Script API

// 商品Code 硬编码: 从列表响应中复制最新 commodityCode 填入此处 (每次上新商品需手动更新)
const targetCommodityCode = "1443554543620575232";  // 用户填入: 商品的 commodityCode

let $ = new Env("Kurobbs 兑换自动化");  // 使用 $ 变量 (如 $httpClient, $notification 等)

// 从 $argument 读取配置 (Argument 参数通过 $argument.get("param") 获取)
let config = {
    enable: $argument.get("enable") || "true",
    token: $argument.get("token") || "",
    devCode: $argument.get("devCode") || "",
    mobile: $argument.get("mobile") || "",
    receiver: $argument.get("receiver") || "",
    province: $argument.get("province") || "",
    city: $argument.get("city") || "",
    area: $argument.get("area") || "",
    detail: $argument.get("detail") || ""
};

// 检查开关
if (config.enable !== "true") {
    console.log("兑换自动化已关闭");
    $done();
    return;
}

// 检查必需参数
if (!config.token || !config.devCode || !config.mobile || !config.receiver || !targetCommodityCode) {
    $notification.post("Kurobbs 兑换", "配置缺失", "请检查 token、devCode、mobile、receiver 或 JS 中的 targetCommodityCode 参数");
    $done();
    return;
}

// 通用 Headers
const headers = {
    "Host": "api.kurobbs.com",
    "source": "ios",
    "lang": "zh-Hans",
    "User-Agent": "KuroGameBox/20251119170243 CFNetwork/3826.600.41 Darwin/24.6.0",
    "Cookie": "acw_tc=b202e043-657c-4dd9-846a-1c1769e121682056399bd2ce8c170423ca35d3f688a3",  // 可动态更新
    "Ip": "192.168.2.31",  // 你的 IP
    "channelId": "1",
    "channel": "appstore",
    "distinct_id": "DE121F54-9C74-45DB-9CCC-4AEB83B71C22",
    "version": "2.8.0",
    "devCode": config.devCode,
    "token": config.token,
    "Connection": "keep-alive",
    "Accept-Language": "zh-CN,zh-Hans;q=0.9",
    "model": "iPhone17,1",
    "osVersion": "18.7.1",
    "Accept": "*/*",
    "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
    "Accept-Encoding": "gzip, deflate, br"
};

// 函数: 发送 POST 请求
async function postRequest(url, body) {
    return new Promise((resolve) => {
        $httpClient.post({
            url: `https://api.kurobbs.com${url}`,
            headers: headers,
            body: body,
            handler: function(response) {
                let data;
                try {
                    data = JSON.parse(response.body);
                } catch (e) {
                    data = response.body;
                }
                resolve({
                    status: response.status,
                    data: data
                });
            }
        });
    });
}

// 主逻辑: 获取列表 -> 查找指定商品 -> 尝试兑换
async function runExchange() {
    try {
        console.log("开始获取商品列表以验证商品...");
        // 1. 获取商品列表
        const listBody = `gameId=0&kindId=0&pageIndex=1&pageSize=10`;
        const listRes = await postRequest("/encourage/commodity/list", listBody);
        
        if (listRes.status !== 200 || !listRes.data.success) {
            $notification.post("Kurobbs 列表失败", "", listRes.data.msg || "未知错误");
            $done();
            return;
        }

        const commodities = listRes.data.data.commodityList || [];
        let targetItem = null;
        
        // 2. 查找指定商品Code
        for (let item of commodities) {
            if (item.commodityCode === targetCommodityCode) {
                targetItem = item;
                break;
            }
        }

        if (!targetItem) {
            $notification.post("Kurobbs 兑换", "商品未找到", `Code ${targetCommodityCode} 不在当前列表中。请检查列表并更新 JS 中的 targetCommodityCode。`);
            $done();
            return;
        }

        if (targetItem.isSellout || targetItem.totalSurplusStock <= 0) {
            $notification.post("Kurobbs 兑换", "商品已售罄", `${targetItem.commodityName} 已无库存。`);
            $done();
            return;
        }

        $notification.post("Kurobbs 兑换", "商品验证成功", `准备兑换: ${targetItem.commodityName} (剩余: ${targetItem.totalSurplusStock})`);

        console.log(`尝试兑换: ${targetItem.commodityName} (Code: ${targetItem.commodityCode})`);
        
        // 可选: 获取详情 (如果需要额外验证)
        // const detailBody = `commodityCode=${targetItem.commodityCode}`;
        // await postRequest("/encourage/commodity/detail", detailBody);  // 跳过以简化

        // 3. beforeCreate (获取地址? 示例中无 body，响应可能返回地址验证)
        const beforeRes = await postRequest("/encourage/order/beforeCreate", "");
        if (beforeRes.status !== 200) {
            console.log(`beforeCreate 失败: ${beforeRes.data.msg}`);
            $notification.post("Kurobbs 兑换失败", "beforeCreate 错误", beforeRes.data.msg || "未知错误");
            $done();
            return;
        }

        // 4. create 订单
        const createBody = `area=${encodeURIComponent(config.area)}&city=${encodeURIComponent(config.city)}&commodityCode=${targetItem.commodityCode}&commodityNum=1&detail=${encodeURIComponent(config.detail)}&gameId=${targetItem.gameId}&geeTestData=&mobile=${config.mobile}&province=${encodeURIComponent(config.province)}&receiver=${encodeURIComponent(config.receiver)}`;
        
        const createRes = await postRequest("/encourage/order/create", createBody);
        
        if (createRes.status === 200 && createRes.data.success) {
            $notification.post("Kurobbs 兑换成功", "", `${targetItem.commodityName} 已兑换！`);
            console.log(`成功兑换: ${targetItem.commodityName}`);
        } else {
            $notification.post("Kurobbs 兑换失败", `${targetItem.commodityName}`, createRes.data.msg || "未知错误");
            console.log(`失败: ${createRes.data.msg}`);
        }

        $notification.post("Kurobbs 兑换完成", "", `处理完毕: ${targetItem.commodityName}`);
        
    } catch (error) {
        console.error("兑换异常:", error);
        $notification.post("Kurobbs 异常", "", error.message);
    }
    
    $done();
}

// 执行
runExchange();
