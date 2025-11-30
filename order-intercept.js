// order-intercept.js (http-request 脚本) - 关键修正：直接返回404模拟REJECT
const body = $request.body || "";
console.log("订单请求触发: URL=" + $request.url + ", Body包含geeTestData? " + body.includes("geeTestData"));

if (body.includes("geeTestData")) {
    console.log("检测到订单请求含geeTestData，一次性参数，丢弃请求 (返回404)");
    $done({ status: 404 });  // 模拟REJECT：404空响应，丢弃请求
    return;
}

// 正常放行（无修改）
console.log("订单请求正常放行");
$done($request);  // 传递原请求