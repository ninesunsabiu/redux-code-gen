import { space4, capitalize } from "./helper.ts";

export function getInsertActionCreatorContent(
  { prefix, key, payload }: { prefix: string; key: string; payload: string },
) {
  const space8 = space4.repeat(2);
  return `${key}(payload: ${payload}) {\n${space8}return { type: ${capitalize(prefix)}ActionKey.${capitalize(key)}, payload };\n${space4}}`;
}
