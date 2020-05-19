import { SEP } from "https://deno.land/std@v0.51.0/path/separator.ts";

export const space4 = " ".repeat(4);

function getReduxSuitCommonFilePath(baseDir: string, prefix: string) {
  return `${baseDir}${SEP}${prefix}${SEP}${prefix}`;
}

export function getActionKeyFilePath(baseDir: string, prefix: string) {
  return `${getReduxSuitCommonFilePath(baseDir, prefix)}ActionKey.ts`;
}

export function getInsertActionKeyContent(key: string) {
  const keyValue = key
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .split("_")
    .map(toLocaleUpperCase)
    .join("_");
  return `${capitalize(key)} = '${keyValue}'`;
}

export function getActionCreatorFilePath(baseDir: string, prefix: string) {
  return `${getReduxSuitCommonFilePath(baseDir, prefix)}Action.ts`;
}

export function getInsertActionCreatorContent({ prefix, key, payload }: { prefix: string; key: string; payload: string }) {
  const space8 = space4.repeat(2);
  return `${key}(payload: ${payload}) {\n${space8}return { type: ${capitalize(prefix)}ActionKey.${capitalize(key)}, payload };\n${space4}}`;
}

export function getReducerFilePath(baseDir: string, prefix: string) {
  return `${getReduxSuitCommonFilePath(baseDir, prefix)}Reducer.ts`;
}

export function getSagaPath(baseDir: string, prefix: string) {
  return `${getReduxSuitCommonFilePath(baseDir, prefix)}Saga.ts`;
}

export function getEnumName(filePath: string) {
  return capitalize(filePath.replace(/^.*\/(\w*)\.ts/, "$1"));
}

export function capitalize(prefix: string) {
  return prefix.replace(/^\w/, toLocaleUpperCase);
}

/**
 * 返回一个检测文件是否满足 enumKey 的正则表达式
 */
export function enumRegExp(enumName: string) {
  return new RegExp(`(enum\\s+${enumName}\\s*{)([\\s\\S]*};?)`);
}

function emptyEnumRegExp(enumName: string) {
  return new RegExp(`(enum\\s+NoticeActionKey\\s*{)([\\s]*)(})`);
}

/**
 * 一个比较函数式语义的把文本转为大写的函数
 */
export function toLocaleUpperCase(str: string) {
  return String(str).toLocaleUpperCase();
}

/**
 * 往枚举Key里面插入新的值
 */
export function insertToEnum(code: string, enumName: string, content: string) {
  if (emptyEnumRegExp(enumName).test(code)) {
    // 往空枚举中插入值
    return code.replace(
      emptyEnumRegExp(enumName),
      `$1\n${space4}${content}\n$3`,
    );
  }
  return code.replace(
    enumRegExp(enumName),
    (code, enumStart: string, enumEntriesAndClose: string) => {
      const dealWithCode = enumEntriesAndClose.replace(
        /[^\n]*?(\w+\s*=\s*(['"])\w*\2)(,?(?:\n|^\s*$)*)(};?)/m,
        `${space4}$1,\n${space4}${content}\n$4`,
      );
      return `${enumStart}${dealWithCode}`;
    },
  );
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