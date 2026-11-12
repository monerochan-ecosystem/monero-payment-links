// test data goes to test-data/<folder>/<test file>/<test>/.
// the folder of a test file is deleted once, when that file starts to run.
// nothing deletes it after the run, so you can look at what each test wrote.
import { beforeAll } from "bun:test";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { relative, resolve } from "node:path";

export const REPO = resolve(import.meta.dir, "..");
export const TEST_DATA = resolve(REPO, "test-data");

// call once at the top of a test file: const testData = testDataFor(import.meta.path);
export function testDataFor(testFile: string) {
  const root = resolve(TEST_DATA, relative(import.meta.dir, testFile).replace(/\.test\.ts$/, ""));
  beforeAll(() => {
    rmSync(root, { recursive: true, force: true });
    mkdirSync(root, { recursive: true });
  });
  // one folder per test
  const forTest = (name: string) => {
    const dir = resolve(root, name);
    mkdirSync(dir, { recursive: true });
    return { dir, dump: (file: string, text: string) => writeFileSync(resolve(dir, file), text) };
  };
  forTest.root = root;
  return forTest;
}
