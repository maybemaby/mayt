import { getQuerySchema } from "./GetQuery";

describe("getQuerySchema", () => {
  test("should be valid", async () => {
    const obj = {
      last: "String",
      size: 20,
      channelId: "Some id",
      tag: ["happy", "sad"],
    };

    const res = await getQuerySchema.isValid(obj, { stripUnknown: true });
    expect(res).toBe(true);
  });

  test("Should transform", async () => {
    const obj = {
      last: "String",
      size: "20",
      channelId: "Some id",
      tag: "happy",
    };

    const casted = getQuerySchema.cast(obj);
    const res = await getQuerySchema.isValid(obj);

    expect(res).toBe(true);
    expect(casted.tag).toStrictEqual(["happy"]);
    expect(typeof casted.size).toBe("number");
  });

  test("Should allow optional", async () => {
    const obj = {};
    const casted = getQuerySchema.cast(obj);
    const res = await getQuerySchema.isValid(obj);

    expect(res).toBe(true);
    expect(getQuerySchema.isValidSync(casted)).toBe(true);
    expect(casted.channelId).toBe(undefined);
    expect(casted.last).toBe(undefined);
    expect(casted.size).toBe(undefined);
    expect(casted.tag).toBe(undefined);
  });
});
