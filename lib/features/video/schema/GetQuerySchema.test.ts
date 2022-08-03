import { getQuerySchema } from "./GetQuery";

describe("getQuerySchema", () => {
  test("should be valid", async () => {
    const obj = {
      last: "String",
      size: 20,
      channelId: "Some id",
      tag: ["happy", "sad"],
    };

    const res = await getQuerySchema.safeParseAsync(obj);
    expect(res.success).toBe(true);
  });

  test("Should transform", async () => {
    const obj = {
      last: "String",
      size: "20",
      channelId: "Some id",
      tag: "happy",
    };

    const casted = await getQuerySchema.parseAsync(obj);
    const res = await getQuerySchema.safeParseAsync(obj);

    expect(res.success).toBe(true);
    expect(casted.tags).toStrictEqual(["happy"]);
    expect(typeof casted.size).toBe("number");
  });

  test("Should allow optional", async () => {
    const obj = {};
    const casted = getQuerySchema.parse(obj);
    const res = await getQuerySchema.safeParseAsync(obj);

    expect(res.success).toBe(true);
    expect(getQuerySchema.safeParse(casted).success).toBe(true);
    expect(casted.channelId).toBe(undefined);
    expect(casted.last).toBe(undefined);
    expect(casted.size).toBe(undefined);
    expect(casted.tags).toBe(undefined);
  });
});
