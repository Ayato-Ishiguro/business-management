import { describe, it, expect } from "@jest/globals";
import { UserFactory } from "../../factories/user.factory";

describe("UserFactory", () => {
  it("should create a user with default values", async () => {
    const user = await UserFactory.create();
    expect(user).toHaveProperty("id");
    expect(user).toHaveProperty("role", "user");
  });

  it("should create a user with custom values", async () => {
    const user = await UserFactory.create({
      name: "Test User",
    });
    expect(user.name).toBe("Test User");
  });

  it("should throw error when creating user with invalid role", async () => {
    await expect(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      UserFactory.create({ role: "invalid" as any }),
    ).rejects.toThrow();
  });
});
