import { describe, it, expect } from "@jest/globals";
import { OfficeVisitFactory } from "../../factories/office-visit.factory";
import { UserFactory } from "../../factories/user.factory";

describe("OfficeVisitFactory", () => {
  it("should create an office visit with valid user", async () => {
    const user = await UserFactory.create();
    const visit = await OfficeVisitFactory.create(user.id);
    expect(visit.user_id).toBe(user.id);
    expect(visit).toHaveProperty("visit_date");
  });

  it("should throw error when creating visit with invalid user_id", async () => {
    await expect(OfficeVisitFactory.create("invalid-uuid")).rejects.toThrow();
  });
});
