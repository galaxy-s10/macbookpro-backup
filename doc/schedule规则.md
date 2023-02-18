



```js
const rule = new schedule.RecurrenceRule();

const allHour = 24;
const allMinute = 60;
const allSecond = 60;
const allHourArr = [];
const allMinuteArr = [];
const allSecondArr = [];

for (let i = 0; i < allHour; i += 1) {
  allHourArr.push(i);
}
for (let i = 0; i < allMinute; i += 1) {
  allMinuteArr.push(i);
}
for (let i = 0; i < allSecond; i += 1) {
  allSecondArr.push(i);
}

rule.hour = allHourArr.filter((v) => v % 2 === 0); // 0,2,4,6,8,10,12,14,16,18,20,22小时执行
rule.minute = allMinuteArr.filter((v) => v % 10 === 0); // 0,10,20,30,40,50分钟执行
rule.second = allSecondArr.filter((v) => v % 10 === 0); // 0,10,20,30,40,50秒执行
/**
 * 总结：
 * 0时0分0秒执行，0时0分10秒执行，0时0分20秒执行...0时0分50秒执行
 * 0时10分0秒执行，0时10分10秒执行，0时10分20秒执行...0时10分50秒执行
 * 0时20分0秒执行，0时20分10秒执行，0时20分20秒执行...0时20分50秒执行
 * ...
 * 02时0分0秒执行，02时0分10秒执行，02时0分20秒执行...02时0分50秒执行
 * 02时10分0秒执行，02时10分10秒执行，02时10分20秒执行...02时10分50秒执行
 * 02时20分0秒执行，02时20分10秒执行，02时20分20秒执行...02时20分50秒执行
 * ...
 * 22时0分0秒执行，22时0分10秒执行，22时0分20秒执行...22时0分50秒执行
 * 22时10分0秒执行，22时10分10秒执行，22时10分20秒执行...22时10分50秒执行
 * 22时20分0秒执行，22时20分10秒执行，22时20分20秒执行...22时20分50秒执行
 */

```

