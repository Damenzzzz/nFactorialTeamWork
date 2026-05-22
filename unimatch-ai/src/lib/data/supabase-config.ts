const SUPABASE_URL_ENV = "NEXT_PUBLIC_SUPABASE_URL";
const SUPABASE_ANON_KEY_ENV = "NEXT_PUBLIC_SUPABASE_ANON_KEY";

export interface SupabaseConfigStatus {
  configured: boolean;
  missingVariables: string[];
}

export function getSupabaseConfigStatus(): SupabaseConfigStatus {
  const missingVariables = [SUPABASE_URL_ENV, SUPABASE_ANON_KEY_ENV].filter(
    (name) => !process.env[name],
  );

  return {
    configured: missingVariables.length === 0,
    missingVariables,
  };
}
