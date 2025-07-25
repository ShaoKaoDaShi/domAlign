'use client';

import React, { useEffect, useState } from 'react';

const str1 =
  '❌ 报告存在差异 ❌\n\n[DIFF] [NameConvention] 发现新的问题 / Find new violations\nFile: Modules/AWENearby/AWENearby/Classes/Core/BizModule/AWENearbyC2Feed/Classes/C2Nearby/DataController/ImportRuleExample.m:19:19\n⭐️ 🔍 新增文件\n“copyDictionary”不符合命名规范。Objective-C代码中禁止定义copyDictionary前缀的方法。Swift混编OC代码时，桥接文件中会给OC中的方法、属性进行rename。在桥接过程中对于有copyDictionary前缀的OC method，自动rename为copy，与现有的copy语义冲突。文档：https://bytedance.feishu.cn/docx/ZMFRd46BmoQBBCx3K53cFaxXn7e\n🌎 🔍 New file\nName convention violation: "copyDictionary".\n\n[DIFF] [CheckSpellingError] 发现新的问题 / Find new violations\nFile: Modules/AWENearby/AWENearby/Classes/Core/BizModule/AWENearbyC2Feed/Classes/C2Nearby/DataController/ImportRuleExample.m:11:11\n⭐️ 🔍 新增文件\n单词 valule 的拼写错误，可能拼写为 value，注意是否有驼峰问题。如果发现误报，可发起 iDOU OnCall添加白名单。\n🌎 🔍 New file\nspelling error in word valule, the right one might be value If it\'s a false alarm, please contact iDOU OnCall to ignore it.\n👉 https://bytedance.feishu.cn/docx/J0OodiId1oknAsxtLvbcM0EDnNe\n\n[DIFF] [NameConvention] 存在未被发现的问题 / There are undetected violations\nFile: Modules/AWENearby/AWENearby/Classes/Core/BizModule/AWENearbyC2Feed/Classes/C2Nearby/DataController/ImportRuleExample.m:19:19\n🔍 新增文件 / New files\n⭐️ “copyDictionary”不符合命名规范。Objective-C代码中禁止定义copyDictionary前缀的方法。Swift混编OC代码时，桥接文件中会给OC中的方法、属性进行rename。在桥接过程中对于有copyDictionary前缀的OC method，自动rename为copy，与现有的copy语义冲突。文档：https://bytedance.feishu.cn/docx/ZMFRd46BmoQBBCx3K53cFaxXn7e\n🌎 Name convention violation: "copyDictionary".\n\n[DIFF] [CheckSpellingError] 存在未被发现的问题 / There are undetected violations\nFile: Modules/AWENearby/AWENearby/Classes/Core/BizModule/AWENearbyC2Feed/Classes/C2Nearby/DataController/ImportRuleExample.m:11:11\n🔍 新增文件 / New files\n⭐️ 单词 valule 的拼写错误，可能拼写为 value，注意是否有驼峰问题。如果发现误报，可发起 iDOU OnCall添加白名单。\n🌎 spelling error in word valule, the right one might be value If it\'s a false alarm, please contact iDOU OnCall to ignore it.\n👉 钟馗规则Onepager文档丨CheckSpellingError';
const str2 =
  "❌ 报告存在差异 ❌\n\n[DIFF] 问题数不同 / Different violations\n\n[DIFF] [JojoIssue] 发现新的问题 / Find new violations\nFile: None\n⭐️ 🔍 JoJo 构建失败，请 Oncall 联系 /jojo。（<a href=\"https://voffline.byted.org/download/tos/schedule/zhongkui/verboses/20250724/jojo-dump-ast-log-Aweme-bits-wangzeyu.miao-20250724151055-202507241510554A96B8980D094BE68D.log\" target=\"_blank\">日志</a>）\n🌎 🔍 JoJo build FAILED. Oncall by /jojo. (<a href=\"https://voffline.byted.org/download/tos/schedule/zhongkui/verboses/20250724/jojo-dump-ast-log-Aweme-bits-wangzeyu.miao-20250724151055-202507241510554A96B8980D094BE68D.log\" target=\"_blank\">Log</a>)\n\n[DIFF] [ExternVariable] 存在未被发现的问题 / There are undetected violations\nFile: Modules/AWEUser/AWEUser/Classes/ModuleInterface/Constant/AWEUserNotifications.h:12:12\n⭐️ 为避免重复定义符号，增加IPA包大小，请在头文件中使用'extern'声明，在.m文件中进行实现。\n🌎 To avoid duplicate symbols and increase IPA size, use the 'extern' declaration in the header file and implement it in the .m file.\n\n[DIFF] [InCompatiblePointersTypes] 存在未被发现的问题 / There are undetected violations\nFile: Modules/AWEUser/AWEUser/Classes/Core/Module/UserProfile/View/AWEProfileEditDatePickerView.m:106:106\nincompatible pointer types sending 'NSString *' to parameter of type 'NSURL * _Nonnull'\n\n[DIFF] [InCompatiblePointersTypes] 存在未被发现的问题 / There are undetected violations\nFile: Modules/AWEUser/AWEUser/Classes/Core/Module/UserProfile/View/AWEProfileEditDatePickerView.m:106:106\nincompatible pointer types sending 'NSString *' to parameter of type 'NSURL * _Nonnull'\n\n[DIFF] [LimitAddLaunchTask] 存在未被发现的问题 / There are undetected violations\nFile: Modules/AWEUser/AWEUser/Classes/ModuleImplement/Douyin/AWEUserConfiguration.m:18:30\n⭐️ 启动任务execute同步调用链同步触达函数谨慎修改：<a href=\"https://tosv.byted.org/obj/spider-data/ZKRuleCacheData/LimitAddLaunchTask/1142/2025-04/7009934/433179795/details_-%5BAWEUserConfiguration%20initWithBlock%3A%5D.txt\" target=\"_blank\">调用链详情链接</a>,函数'-[AWEUserConfiguration initWithBlock:]'在启动任务execute阶段被调用,谨慎修改。如果有其他疑惑，请拉群讨论。\n\n[DIFF] [LimitAccess] 存在未被发现的问题 / There are undetected violations\nFile: Modules/AWEUser/AWEUser/Classes/Core/Module/UserProfile/View/AWEProfileEditDatePickerView.m:106:106\n⭐️ 限制使用该方法 ([UIApplication canOpenURL:])。iOS 15及以上系统限制了info.plist中LSApplicationQueriesSchemes字段声明的前50个schema调用canOpenURL才能返回正确结果，请确保你要使用的schema顺序在前50。\n🌎 Limit calling this method ([UIApplication canOpenURL:]). It can be access canOpenURL only in first 50 schemas declared in the LSApplicationQueriesSchemes field in Info.plist. Ensure the schema you want to use is in the first 50.\n👉 https://bytedance.feishu.cn/docs/doccnGeWSFfahPwv5UGalzvHYog\n\n[DIFF] [LimitAccess] 存在未被发现的问题 / There are undetected violations\nFile: Modules/AWEUser/AWEUser/Classes/Core/Module/UserProfile/View/AWEProfileEditDatePickerView.m:106:106\n⭐️ 限制使用该方法 ([UIApplication canOpenURL:])。为什么这些 API 不能被调用？👉 https://bytedance.feishu.cn/docx/doxcnwtY7w2qaRC5f7PW9QQS0Fd\n🌎 Limit calling this method ([UIApplication canOpenURL:]). \n\n[DIFF] [LimitLoad] 存在未被发现的问题 / There are undetected violations\nFile: Modules/AWEUser/AWEUser/Classes/ModuleImplement/Douyin/AWEUserConfiguration.m:36:38\n⭐️ 禁止使用load方法，详见末尾文档链接。\n🌎 Limit using 'load' method. Detail for https://bytedance.feishu.cn/docs/doccnsHjmqIXfM3e1UB6jpibKYf\n\n[DIFF] [LimitConstructorAttr] 存在未被发现的问题 / There are undetected violations\nFile: Modules/AWEUser/AWEUser/Classes/ModuleImplement/Douyin/AWEUserConfiguration.m:12:12\n⭐️ 限制使用'__attribute__((constructor))'，详见末尾文档链接。\n🌎 Limit using '__attribute__((constructor))', read http://t.zijieimg.com/KTS4LW/ for detail.";
const str3 =
  '我是一只猫钟馗规则Onepager文档丨CheckSpellingError，\n我是一只猫 钟馗规则Onepager文档丨CheckSpellingError，\n我是一只猫钟馗规则Onepager文档丨CheckSpellingError ，\n👉 钟馗规则Onepager文档丨CheckSpellingError 然后还有 <a href="钟馗规则Onepager文档丨CheckSpellingError">这是一只小链接哒</a>👉 钟馗规则Onepager文档丨CheckSpellingError ';

export default function Simple() {
  const [sourceItemHeight, setSourceItemHeight] = useState(400);
  const [targetItemHeight, setTargetItemHeight] = useState(200);
  useEffect(() => {
    const aTagRegex =
      /(?<!<a.*?href=")(https?.*?)(?=\s|[\u4e00-\u9fa5])(?!<)/gi;
    console.log('aTagRegex.exec(str3)', str3.match(aTagRegex));
    console.log('aTagRegex.exec(str2)', str2.match(aTagRegex));

    console.log('aTagRegex.exec(str1)', str1.match(aTagRegex));
  }, []);
  return (
    <div>
      <p>str1</p>
      <p>{str1}</p>
      <p>str2</p>
      <p>{str2}</p>
      <p>str3</p>
      <p>{str3}</p>
    </div>
  );
}
