const space4 = " ".repeat(4);

/**
 * 返回一个检测文件是否满足 enumKey 的正则表达式
 */
export function enumRegExp(enumName: string) {
  return new RegExp(`(enum\\s+${enumName.replace(/^\w/, toLocaleUpperCase)}\\s*{)([\\s\\S]*};?)`);
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
    return code.replace(emptyEnumRegExp(enumName), `$1\n${space4}${content}\n$3`);
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