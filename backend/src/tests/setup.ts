import { afterEach, beforeAll } from "@jest/globals";
import dotenv from "dotenv";
import { supabase } from "../utils/supabase";

beforeAll(() => {
  dotenv.config();
});

afterEach(async () => {
  await supabase.from("office_visits").delete().neq("id", "");
  await supabase.from("profiles").delete().neq("id", "");
});
