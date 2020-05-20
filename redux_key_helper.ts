import { toLocaleUpperCase, capitalize, space4 } from "./helper.ts";

export function getInsertActionKeyContent(key: string) {
  const keyValue = key
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .split("_")
    .map(toLocaleUpperCase)
    .join("_");
  return `${capitalize(key)} = '${keyValue}'`;
}

export function getEnumName(filePath: string) {
  return capitalize(filePath.replace(/^.*\/(\w*)\.ts/, "$1"));
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
