import { describe, it, expect } from "@jest/globals";
import { supabase } from "../utils/supabase";

describe("Supabase Connection", () => {
  it("should connect to Supabase", async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .limit(1);
    expect(error).toBeNull();
    expect(Array.isArray(data)).toBeTruthy();
  });
});
