import { space4, capitalize } from '../common/helper.ts';
import { actionPayloadFileTpl } from '../action_payload/action_payload_tpl.ts';

export function getInsertActionCreatorContent(
  { prefix, key, payload }: { prefix: string; key: string; payload: string },
) {
  return `\nexport function ${key}(payload: ${payload}) {\n${space4}return { type: ${capitalize(prefix)}ActionKey.${capitalize(key)}, payload };\n}\n`;
}

export function getActionPayloadFileContent(prefix: string) {
  return actionPayloadFileTpl.replace(/#_prefix#/g, prefix).replace(/#prefix#/g, capitalize(prefix));
}