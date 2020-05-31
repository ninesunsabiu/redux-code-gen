import { replacePrefixAndKey } from '../common/helper.ts';
import { sagaFileTpl, sagaHandlerTpl } from './saga_tpl.ts';

export function getSagaFileContent(prefix: string, key: string) {
  return replacePrefixAndKey(sagaFileTpl, { prefix, key });
}

export function getInsertSagaHandlerContent(prefix: string, key: string) {
  return replacePrefixAndKey(sagaHandlerTpl, { prefix, key });
}