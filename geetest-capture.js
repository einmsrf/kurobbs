// geetest-capture.js (http-response 脚本)
const response = $response;
if (response.status !== 200) {
    $done(response);
    return;
}

try {
    const json = JSON.parse(response.body);
    if (json.status !== "success" || !json.data || !json.data.seccode) {
        console.log("Geetest响应无效，无seccode数据");
        $done(response);
        return;
    }

    const seccode = json.data.seccode;
    // 提取五个参数，按示例顺序构建JSON
    const geeData = {
        "pass_token": seccode.pass_token,
        "captcha_output": seccode.captcha_output,
        "gen_time": seccode.gen_time,
        "captcha_id": seccode.captcha_id,
        "lot_number": seccode.lot_number
    };

    // JSON.stringify后URL编码
    const jsonStr = JSON.stringify(geeData);
    const encodedGeeTestData = encodeURIComponent(jsonStr);

    // 存储为持久变量
    $persistentStore.write(encodedGeeTestData, "geeTestData");
    console.log("Geetest数据捕获成功，存储geeTestData: " + encodedGeeTestData.substring(0, 50) + "...");

    // 可选：修改响应或直接done原响应
    $done(response);
} catch (e) {
    console.error("Geetest解析失败: " + e);
    $done(response);
}