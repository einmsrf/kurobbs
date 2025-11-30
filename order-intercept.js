// order-intercept.js (http-request 脚本)
const request = $request;
const body = request.body || "";

if (body.includes("geeTestData")) {
    console.log("检测到订单请求含geeTestData，一次性参数，丢弃请求");
    $done({ policy: "reject" });  // 丢弃请求，防止APP无效提交
    return;
}

$done();  // 正常放行（若无geeTestData）