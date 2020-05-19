# redux-code-gen
在项目里新建一个Action时总得在好几个文件里增加代码，没错，就是Key ActionCreator Reducer 这几个东西  
所以希望能输入 Key 和 ActionPayload 自动生成文件或者往文件里一些特殊的位置插入一些模板代码  
因此想要利用 deno 实现这样的功能脚本

## Usage
```base

$ deno run --allow-read --allow-write --allow-net \
https://raw.githubusercontent.com/ninesunsabiu/redux-code-gen/master/redux_code_generator.ts \
--base-dir=<DIR_PATH> \
--action-prefix=notice \
--key=fetchUserInfo \
--payload='{"a": 32}'

```
|参数|说明|
|:--:|:--:|
|base-dir|指定项目中redux组织目录 非必填 如果提供时请以目录分割符结尾|
|action-prefix|action前缀 将会影响文件名的匹配和文件中枚举关键字的查找|
|key|action key|
|payload|action payload|

*P.S. 如果 raw.githubusercontent.com 无法访问 请善用搜索引擎解决问题*

## TODO
- [x] 插入已有的Key枚举
- [ ] 新建Key枚举文件并插入key值
- [ ] 生成 ActionCreator
- [ ] 生成 Reducer Handler
- [ ] 生成 Saga Generator Function 