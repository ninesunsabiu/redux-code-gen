
export const space4 = " ".repeat(4);

export function capitalize(prefix: string) {
  return prefix.replace(/^\w/, toLocaleUpperCase);
}

/**
 * 一个比较函数式语义的把文本转为大写的函数
 */
export function toLocaleUpperCase(str: string) {
  return String(str).toLocaleUpperCase();
}

/**
 * 中横线命名 转 驼峰命名
 */
export function dashesToCamelCase(varName: string): string {
  return varName.replace(
    /-([a-z])/g,
    (_: string, letter: string) => toLocaleUpperCase(letter),
  );
}

/**
 * 转换主程序的输入参数
 * --xxx=bbb => { xxx: bbb }
 * 中间 xxx 遵循 中横杠命名法 转换为对象时会变为驼峰命名
 */
export function mapArgsToPoj(args: string[]): Record<string, string> {
  return args.reduce(
    (acc, cur) => {
      const [key, value] = cur.replace(/^--/, "").split("=");
      return {
        ...acc,
        [dashesToCamelCase(key)]: value,
      };
    },
    {},
  );
}