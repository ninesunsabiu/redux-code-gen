import { mapArgsToPoj } from "./helper.ts";
import { assertEquals } from "https://deno.land/std@v0.51.0/testing/asserts.ts";

Deno.test({
    name: 'args to plain object test',
    fn(): void {
        const actual = mapArgsToPoj(['--action-prefix=action', '--key=someoneTest', '--payload={ "a": 124, "b": "string", "c": { "a": 124, "b": "fsd" } }']);
        assertEquals(actual, {
            actionPrefix: 'action',
            key: 'someoneTest',
            payload: '{ "a": 124, "b": "string", "c": { "a": 124, "b": "fsd" } }'
        });
    }
});
