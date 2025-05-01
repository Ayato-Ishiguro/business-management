import { supabase } from "../utils/supabase";
import type { Database } from "@/types/supabase";

type OfficeVisit = Database["public"]["Tables"]["office_visits"]["Row"];

export class OfficeVisitFactory {
  static async create(
    userId: string,
    overrides: Partial<OfficeVisit> = {},
  ): Promise<OfficeVisit> {
    const defaultData = {
      user_id: userId,
      visit_date: new Date().toISOString().split("T")[0],
    };

    const { data, error } = await supabase
      .from("office_visits")
      .insert([
        {
          ...defaultData,
          ...overrides,
        },
      ])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  }
}
