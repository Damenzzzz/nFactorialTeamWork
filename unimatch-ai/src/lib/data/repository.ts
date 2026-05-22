import {
  seedAdmissionRequirements,
  seedPrograms,
  seedUniversities,
} from "@/data/seed-universities";
import type {
  AdmissionRequirement,
  DataRepositoryStatus,
  Program,
  ProgramFilters,
  ProgramWithAdmissions,
  University,
} from "@/lib/domain";
import { getSupabaseConfigStatus } from "@/lib/data/supabase-config";

export interface AdmissionsRepository {
  getStatus(): DataRepositoryStatus;
  listPrograms(filters?: ProgramFilters): Promise<ProgramWithAdmissions[]>;
  getProgramById(programId: string): Promise<ProgramWithAdmissions | null>;
}

class SeedAdmissionsRepository implements AdmissionsRepository {
  private readonly universitiesById = new Map<string, University>(
    seedUniversities.map((university) => [university.id, university]),
  );

  private readonly requirementsByProgramId = new Map<string, AdmissionRequirement>(
    seedAdmissionRequirements.map((requirement) => [
      requirement.programId,
      requirement,
    ]),
  );

  getStatus(): DataRepositoryStatus {
    const supabase = getSupabaseConfigStatus();

    return {
      activeDataSource: "seed",
      supabaseConfigured: supabase.configured,
      supabaseMissingVariables: supabase.missingVariables,
      note: supabase.configured
        ? "Supabase environment variables are present; seed repository is active until a Supabase adapter is connected."
        : "Using local seed data fallback because Supabase environment variables are not fully configured.",
    };
  }

  async listPrograms(filters: ProgramFilters = {}): Promise<ProgramWithAdmissions[]> {
    return this.buildProgramRecords().filter((record) =>
      matchesProgramFilters(record, filters),
    );
  }

  async getProgramById(programId: string): Promise<ProgramWithAdmissions | null> {
    return (
      this.buildProgramRecords().find((record) => record.program.id === programId) ??
      null
    );
  }

  private buildProgramRecords(): ProgramWithAdmissions[] {
    return seedPrograms.map((program) => this.joinProgram(program));
  }

  private joinProgram(program: Program): ProgramWithAdmissions {
    const university = this.universitiesById.get(program.universityId);
    const requirement = this.requirementsByProgramId.get(program.id);

    if (!university || !requirement) {
      throw new Error(`Seed data integrity error for program ${program.id}`);
    }

    return {
      university,
      program,
      requirement,
    };
  }
}

const seedRepository = new SeedAdmissionsRepository();

export function getAdmissionsRepository(): AdmissionsRepository {
  return seedRepository;
}

function matchesProgramFilters(
  record: ProgramWithAdmissions,
  filters: ProgramFilters,
): boolean {
  const { university, program, requirement } = record;

  if (filters.country && !sameText(university.country, filters.country)) {
    return false;
  }

  if (filters.field && !matchesField(program, filters.field)) {
    return false;
  }

  if (filters.degreeLevel && program.degreeLevel !== filters.degreeLevel) {
    return false;
  }

  if (
    typeof filters.maxTuition === "number" &&
    program.tuitionUsdPerYear > filters.maxTuition
  ) {
    return false;
  }

  if (
    typeof filters.minIelts === "number" &&
    requirement.minIelts > filters.minIelts
  ) {
    return false;
  }

  if (filters.scholarshipOnly && !program.scholarshipsAvailable) {
    return false;
  }

  return true;
}

function matchesField(program: Program, field: string): boolean {
  const target = normalizeText(field);
  const searchableText = [
    program.field,
    program.name,
    ...program.tags,
  ]
    .map(normalizeText)
    .join(" ");

  return searchableText.includes(target);
}

function sameText(left: string, right: string): boolean {
  return normalizeText(left) === normalizeText(right);
}

function normalizeText(value: string): string {
  return value.trim().toLowerCase();
}
