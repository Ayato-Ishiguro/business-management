import { supabase } from "../utils/supabase";
import type { Database } from "@/types/supabase";
import { v4 as uuidv4 } from "uuid";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export class UserFactory {
  static async create(overrides: Partial<Profile> = {}): Promise<Profile> {
    const defaultData = {
      id: uuidv4(),
      name: `Test User ${Date.now()}`,
      role: "user" as const,
    };

    const { data, error } = await supabase
      .from("profiles")
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

  static async createMany(count: number): Promise<Profile[]> {
    const users = await Promise.all(
      Array.from({ length: count }).map(() => this.create()),
    );
    return users;
  }
}
