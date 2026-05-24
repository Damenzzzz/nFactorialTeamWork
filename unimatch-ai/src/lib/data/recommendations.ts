import type {
  ProgramWithAdmissions,
  Recommendation,
  StudentProfile,
} from "@/lib/domain";

export function rankPrograms(
  profile: StudentProfile,
  programs: ProgramWithAdmissions[],
): Recommendation[] {
  return programs
    .map((program) => buildRecommendation(profile, program))
    .sort((left, right) => right.matchScore - left.matchScore);
}

function buildRecommendation(
  profile: StudentProfile,
  record: ProgramWithAdmissions,
): Recommendation {
  const { university, program, requirement } = record;
  const fitReasons: string[] = [];
  const risks: string[] = [];
  const missingRequirements: string[] = [];
  let score = 45;

  if (matchesField(profile.intendedField, record)) {
    score += 24;
    fitReasons.push(`Program field aligns with ${profile.intendedField}.`);
  } else {
    score -= 12;
    risks.push(
      `Program field is ${program.field}, which may not match the intended field.`,
    );
  }

  if (program.degreeLevel === profile.degreeLevel) {
    score += 18;
    fitReasons.push(`Degree level matches the requested ${profile.degreeLevel} path.`);
  } else {
    score -= 25;
    risks.push(
      `Degree level is ${program.degreeLevel}, not ${profile.degreeLevel}.`,
    );
  }

  if (profile.gpa >= requirement.minGpa) {
    score += 18;
    fitReasons.push(`GPA meets the catalog minimum of ${requirement.minGpa.toFixed(1)}.`);
  } else {
    const gap = Number((requirement.minGpa - profile.gpa).toFixed(2));
    score -= Math.min(25, gap * 18);
    risks.push(`GPA is below the catalog minimum by ${gap.toFixed(2)}.`);
    missingRequirements.push(
      `Improve GPA or confirm whether alternative academic evidence can offset a ${gap.toFixed(2)} gap.`,
    );
  }

  if (typeof profile.ielts === "number") {
    if (profile.ielts >= requirement.minIelts) {
      score += 10;
      fitReasons.push(`IELTS score meets the catalog minimum of ${requirement.minIelts}.`);
    } else {
      const gap = Number((requirement.minIelts - profile.ielts).toFixed(1));
      score -= Math.min(18, gap * 8);
      risks.push(`IELTS is below the catalog minimum by ${gap.toFixed(1)}.`);
      missingRequirements.push(
        `Raise IELTS to at least ${requirement.minIelts} or verify accepted alternatives.`,
      );
    }
  } else {
    score -= 8;
    missingRequirements.push(
      `Provide IELTS or accepted English proficiency evidence for a catalog minimum of ${requirement.minIelts}.`,
    );
  }

  if (typeof requirement.minSat === "number") {
    if (typeof profile.sat === "number") {
      if (profile.sat >= requirement.minSat) {
        score += 8;
        fitReasons.push(`SAT score meets the catalog minimum of ${requirement.minSat}.`);
      } else {
        const gap = requirement.minSat - profile.sat;
        score -= Math.min(16, gap / 25);
        risks.push(`SAT is below the catalog minimum by ${gap} points.`);
        missingRequirements.push(
          `Raise SAT to at least ${requirement.minSat} or verify accepted alternatives.`,
        );
      }
    } else {
      score -= 6;
      missingRequirements.push(
        `Submit SAT or accepted equivalent test evidence for a catalog minimum of ${requirement.minSat}.`,
      );
    }
  }

  if (typeof profile.maxTuition === "number") {
    if (program.tuitionUsdPerYear <= profile.maxTuition) {
      score += 10;
      fitReasons.push("Tuition is within the stated annual budget.");
    } else {
      const gap = program.tuitionUsdPerYear - profile.maxTuition;
      score -= Math.min(22, gap / 2500);
      risks.push(`Tuition is about $${gap.toLocaleString()} above the stated annual budget.`);
      missingRequirements.push("Find additional funding or adjust the tuition budget.");
    }
  }

  if (profile.preferredCountries?.length) {
    const countryMatch = profile.preferredCountries.some(
      (country) => normalize(country) === normalize(university.country),
    );

    if (countryMatch) {
      score += 7;
      fitReasons.push(`${university.country} matches a preferred country.`);
    } else {
      score -= 4;
      risks.push(`${university.country} is outside the preferred country list.`);
    }
  }

  if (profile.scholarshipRequired) {
    if (program.scholarshipsAvailable) {
      score += 8;
      fitReasons.push("Scholarship options are listed in the catalog.");
    } else {
      score -= 16;
      risks.push("No program-level scholarship option is marked in the catalog.");
      missingRequirements.push("Identify external funding or a lower-cost option.");
    }
  } else if (program.scholarshipsAvailable) {
    score += 3;
    fitReasons.push("Scholarships may be available if additional funding is useful.");
  }

  if (profile.language) {
    if (normalize(profile.language) === normalize(program.language)) {
      score += 4;
      fitReasons.push(`Instruction language matches ${program.language}.`);
    } else {
      score -= 8;
      risks.push(`Instruction language is ${program.language}, not ${profile.language}.`);
    }
  }

  const matchScore = clampScore(score);
  const nextSteps = buildNextSteps(record, missingRequirements);

  return {
    university,
    program,
    requirement,
    matchScore,
    fitReasons,
    risks,
    missingRequirements,
    nextSteps,
  };
}

function buildNextSteps(
  record: ProgramWithAdmissions,
  missingRequirements: string[],
): string[] {
  const { university, program, requirement } = record;
  const nextSteps = [
    `Verify current requirements and deadline on ${university.name}'s official website.`,
    `Prepare required documents: ${requirement.requiredDocuments.join(", ")}.`,
    `Confirm the ${program.applicationDeadline} catalog deadline against the live admissions page.`,
  ];

  if (program.scholarshipsAvailable) {
    nextSteps.push("Review scholarship eligibility and separate scholarship deadlines.");
  }

  if (missingRequirements.length > 0) {
    nextSteps.push("Resolve missing or below-minimum requirements before applying.");
  }

  return nextSteps;
}

function matchesField(
  intendedField: string,
  { program }: ProgramWithAdmissions,
): boolean {
  const target = normalize(intendedField);
  const searchableText = [program.field, program.name, ...program.tags]
    .map(normalize)
    .join(" ");

  return searchableText.includes(target) || target.includes(normalize(program.field));
}

function clampScore(score: number): number {
  return Math.max(0, Math.min(100, Math.round(score)));
}

function normalize(value: string): string {
  return value.trim().toLowerCase();
}
