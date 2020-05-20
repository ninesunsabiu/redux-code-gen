import { assertEquals } from "https://deno.land/std@v0.51.0/testing/asserts.ts";
import {
  getReduxSuitCommonFilePath,
  getActionKeyFilePath,
  getActionCreatorFilePath,
  getReducerFilePath,
  getSagaPath,
} from "./file_path_helper.ts";


const baseDir = "/Users/eziolin/gitrepos/agilean/valueui/pure-react-ui/src/redux";
const actionModule = "notice";

const suitDirExpectedPath = `${baseDir}/${actionModule}`;
const actionKeyFilePath = `${suitDirExpectedPath}/${actionModule}ActionKey.ts`;
const actionFilePath = `${suitDirExpectedPath}/${actionModule}Action.ts`;
const reducerFilePath = `${suitDirExpectedPath}/${actionModule}Reducer.ts`;
const sagaFilePath = `${suitDirExpectedPath}/${actionModule}Saga.ts`;

Deno.test({
  name: "redux suit dir path test",
  fn(): void {
    assertEquals(suitDirExpectedPath, getReduxSuitCommonFilePath(baseDir, actionModule));
  },
});

Deno.test({
    name: 'action key file path test',
    fn(): void {
        assertEquals(actionKeyFilePath, getActionKeyFilePath(baseDir, actionModule));
    }
});

Deno.test({
    name: 'action file path test',
    fn(): void {
        assertEquals(actionFilePath, getActionCreatorFilePath(baseDir, actionModule));
    }
});

Deno.test({
    name: 'reducer file path test',
    fn(): void {
        assertEquals(reducerFilePath, getReducerFilePath(baseDir, actionModule));
    }
});

Deno.test({
    name: 'saga file path test',
    fn(): void {
        assertEquals(sagaFilePath, getSagaPath(baseDir, actionModule));
    }
});