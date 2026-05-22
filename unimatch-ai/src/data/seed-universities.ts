import type {
  AdmissionRequirement,
  DegreeLevel,
  Program,
  University,
} from "@/lib/domain";

const sourceNote =
  "Sample program data for UniMatch AI. Students should verify current requirements, tuition, scholarships, and deadlines on official university pages before applying.";

export const seedUniversities: University[] = [
  university({
    city: "Astana",
    country: "Kazakhstan",
    id: "nazarbayev-university",
    max: 16000,
    min: 9000,
    name: "Nazarbayev University",
    rankingNotes:
      "Research-focused university with English-taught STEM, business, and public policy pathways.",
    scholarship: "Merit and government-backed awards",
    website: "https://nu.edu.kz",
  }),
  university({
    city: "Almaty",
    country: "Kazakhstan",
    id: "al-farabi-kazakh-national-university",
    max: 6500,
    min: 2500,
    name: "Al-Farabi Kazakh National University",
    rankingNotes:
      "Large public university with broad undergraduate and graduate options across law, economics, and science.",
    scholarship: "University merit scholarships",
    website: "https://www.kaznu.kz",
  }),
  university({
    city: "Tempe",
    country: "USA",
    id: "arizona-state-university",
    max: 41000,
    min: 33000,
    name: "Arizona State University",
    rankingNotes:
      "Large public university with flexible entry paths and strong technology, business, and design options.",
    scholarship: "New American University Scholarship",
    website: "https://www.asu.edu",
  }),
  university({
    city: "Boston",
    country: "USA",
    id: "northeastern-university",
    max: 62000,
    min: 49000,
    name: "Northeastern University",
    rankingNotes:
      "Urban research university known for co-op education, computing, business, and cybersecurity.",
    scholarship: "Merit scholarships for selected applicants",
    website: "https://www.northeastern.edu",
  }),
  university({
    city: "Manchester",
    country: "UK",
    id: "university-of-manchester",
    max: 39000,
    min: 28000,
    name: "University of Manchester",
    rankingNotes:
      "Large UK research university with broad computing, engineering, law, and life sciences options.",
    scholarship: "Global Futures Scholarship",
    website: "https://www.manchester.ac.uk",
  }),
  university({
    city: "Coventry",
    country: "UK",
    id: "university-of-warwick",
    max: 45000,
    min: 30000,
    name: "University of Warwick",
    rankingNotes:
      "Research-intensive university with respected economics, business, data, and interdisciplinary programs.",
    scholarship: "Chancellor's International Scholarship",
    website: "https://warwick.ac.uk",
  }),
  university({
    city: "Toronto",
    country: "Canada",
    id: "university-of-toronto",
    max: 52000,
    min: 42000,
    name: "University of Toronto",
    rankingNotes:
      "Large public research university with broad STEM, business, and health science offerings.",
    scholarship: "International Scholar Awards",
    website: "https://www.utoronto.ca",
  }),
  university({
    city: "Vancouver",
    country: "Canada",
    id: "university-of-british-columbia",
    max: 49000,
    min: 39000,
    name: "University of British Columbia",
    rankingNotes:
      "Public research university with strong engineering, science, economics, and environmental programs.",
    scholarship: "International Major Entrance Scholarship",
    website: "https://www.ubc.ca",
  }),
  university({
    city: "Munich",
    country: "Germany",
    id: "technical-university-of-munich",
    max: 9000,
    min: 3500,
    name: "Technical University of Munich",
    rankingNotes:
      "Technical university known for engineering, data, robotics, and applied sciences.",
    scholarship: "Deutschlandstipendium",
    website: "https://www.tum.de",
  }),
  university({
    city: "Freiburg",
    country: "Germany",
    id: "university-of-freiburg",
    max: 6500,
    min: 3500,
    name: "University of Freiburg",
    rankingNotes:
      "Historic research university with strong medicine, computer science, and sustainability pathways.",
    scholarship: "STIBET and merit scholarships",
    website: "https://www.uni-freiburg.de",
  }),
  university({
    city: "Amsterdam",
    country: "Netherlands",
    id: "university-of-amsterdam",
    max: 23000,
    min: 15000,
    name: "University of Amsterdam",
    rankingNotes:
      "Research university with strong social science, business, analytics, law, and AI programs.",
    scholarship: "Amsterdam Merit Scholarship",
    website: "https://www.uva.nl",
  }),
  university({
    city: "Helsinki",
    country: "Finland",
    id: "university-of-helsinki",
    max: 21000,
    min: 14000,
    name: "University of Helsinki",
    rankingNotes:
      "Research university with English-taught graduate programs in software, data, and life sciences.",
    scholarship: "University of Helsinki Scholarship",
    website: "https://www.helsinki.fi",
  }),
  university({
    city: "Ankara",
    country: "Turkey",
    id: "middle-east-technical-university",
    max: 9000,
    min: 4500,
    name: "Middle East Technical University",
    rankingNotes:
      "Public technical university with English-medium engineering, computing, and economics programs.",
    scholarship: "METU international student awards",
    website: "https://www.metu.edu.tr",
  }),
  university({
    city: "Daejeon",
    country: "South Korea",
    id: "kaist",
    max: 18000,
    min: 12000,
    name: "KAIST",
    rankingNotes:
      "Science and technology university with strong AI, engineering, and research-oriented graduate programs.",
    scholarship: "KAIST International Student Scholarship",
    website: "https://www.kaist.ac.kr",
  }),
  university({
    city: "Kuala Lumpur",
    country: "Malaysia",
    id: "university-of-malaya",
    max: 12000,
    min: 4500,
    name: "University of Malaya",
    rankingNotes:
      "Public research university with accessible tuition and a wide range of English-taught options.",
    scholarship: "UM Excellence Scholarship",
    website: "https://www.um.edu.my",
  }),
  university({
    city: "Abu Dhabi",
    country: "UAE",
    id: "khalifa-university",
    max: 30000,
    min: 18000,
    name: "Khalifa University",
    rankingNotes:
      "Science and technology university with engineering, AI, cybersecurity, and health science strengths.",
    scholarship: "Khalifa University scholarships",
    website: "https://www.ku.ac.ae",
  }),
  university({
    city: "Budapest",
    country: "Hungary",
    id: "eotvos-lorand-university",
    max: 9500,
    min: 4500,
    name: "Eotvos Lorand University",
    rankingNotes:
      "Public university with international programs in computer science, law, economics, and social sciences.",
    scholarship: "Stipendium Hungaricum",
    website: "https://www.elte.hu/en",
  }),
  university({
    city: "Warsaw",
    country: "Poland",
    id: "university-of-warsaw",
    max: 7000,
    min: 3500,
    name: "University of Warsaw",
    rankingNotes:
      "Public university with accessible European tuition and international programs across law, economics, and data.",
    scholarship: "Government and university scholarships",
    website: "https://www.uw.edu.pl",
  }),
  university({
    city: "Milan",
    country: "Italy",
    id: "politecnico-di-milano",
    max: 9000,
    min: 4200,
    name: "Politecnico di Milano",
    rankingNotes:
      "Technical university known for architecture, design, engineering, and digital innovation.",
    scholarship: "Merit-Based International Scholarships",
    website: "https://www.polimi.it",
  }),
  university({
    city: "Singapore",
    country: "Singapore",
    id: "national-university-of-singapore",
    max: 42000,
    min: 28000,
    name: "National University of Singapore",
    rankingNotes:
      "Comprehensive Asian research university with highly competitive STEM, business, and law admissions.",
    scholarship: "NUS Global Merit Scholarship",
    website: "https://www.nus.edu.sg",
  }),
];

const programRecords: Array<
  Program & {
    requirement: Omit<AdmissionRequirement, "id" | "programId">;
  }
> = [
  program("nu-bsc-computer-science", "nazarbayev-university", "Computer Science", "Bachelor", "Computer Science", 11000, "2027-05-20", true, "Software, algorithms, and systems training for students targeting technology careers.", ["software", "algorithms", "systems"], 3.2, 6.5, 1240),
  program("nu-msc-data-science", "nazarbayev-university", "Data Science", "Master", "Data Science", 12500, "2027-04-15", true, "Graduate analytics program focused on statistics, machine learning, and applied data products.", ["analytics", "machine learning", "statistics"], 3.1, 6.5),
  program("nu-phd-artificial-intelligence", "nazarbayev-university", "Artificial Intelligence Research", "PhD", "Artificial Intelligence", 9000, "2027-02-01", true, "Research path for students with strong AI, math, and publication potential.", ["ai", "research", "machine learning"], 3.5, 7.0),
  program("kaznu-llb-law", "al-farabi-kazakh-national-university", "International Law", "Bachelor", "Law", 3200, "2027-06-25", true, "Law degree with international relations, policy, and comparative legal systems exposure.", ["law", "policy", "international"], 2.8, 6.0),
  program("kaznu-ma-economics", "al-farabi-kazakh-national-university", "Economics", "Master", "Economics", 3600, "2027-06-10", false, "Applied economics program for students interested in markets, policy, and analytics.", ["economics", "policy", "markets"], 2.9, 6.0),
  program("asu-bs-business", "arizona-state-university", "Business Administration", "Bachelor", "Business", 35000, "2027-05-01", true, "Flexible business degree covering management, entrepreneurship, and operations.", ["business", "management", "entrepreneurship"], 3.0, 6.0, 1180),
  program("asu-bs-design", "arizona-state-university", "Industrial Design", "Bachelor", "Design", 36500, "2027-02-01", true, "Studio-led design program focused on product thinking, prototyping, and user needs.", ["design", "portfolio", "product"], 3.0, 6.0, 1150),
  program("asu-ms-cybersecurity", "arizona-state-university", "Cybersecurity", "Master", "Cybersecurity", 32500, "2027-03-15", true, "Security-focused graduate program covering networks, risk, and applied cyber defense.", ["security", "networks", "risk"], 3.1, 6.5),
  program("neu-bs-computer-science", "northeastern-university", "Computer Science", "Bachelor", "Computer Science", 58500, "2027-01-01", true, "Co-op oriented computing program for students seeking industry experience.", ["software", "co-op", "systems"], 3.4, 7.0, 1380),
  program("neu-ms-ai", "northeastern-university", "Artificial Intelligence", "Master", "Artificial Intelligence", 54000, "2027-04-15", true, "Graduate AI curriculum combining machine learning, data, and human-centered systems.", ["ai", "machine learning", "co-op"], 3.3, 7.0),
  program("neu-ms-cybersecurity", "northeastern-university", "Cybersecurity and Privacy", "Master", "Cybersecurity", 53500, "2027-04-01", true, "Applied cybersecurity program with privacy, governance, and technical security tracks.", ["cybersecurity", "privacy", "governance"], 3.2, 7.0),
  program("manchester-bsc-computer-science", "university-of-manchester", "Computer Science", "Bachelor", "Computer Science", 31500, "2027-01-29", true, "Computing degree with strong math, programming, and software engineering foundations.", ["software", "ai", "systems"], 3.1, 6.5, 1300),
  program("manchester-llb-law", "university-of-manchester", "Law", "Bachelor", "Law", 28500, "2027-01-29", true, "Law degree for students interested in legal reasoning, policy, and global legal issues.", ["law", "policy", "writing"], 3.2, 7.0, 1280),
  program("manchester-mph-health", "university-of-manchester", "Public Health", "Master", "Medicine/Health Sciences", 29500, "2027-03-31", false, "Health sciences program focused on population health, policy, and evidence-based practice.", ["health", "policy", "research"], 3.0, 6.5),
  program("warwick-bsc-economics", "university-of-warwick", "Economics", "Bachelor", "Economics", 34000, "2027-01-29", true, "Quantitative economics degree for students targeting finance, policy, or graduate study.", ["economics", "math", "finance"], 3.4, 7.0, 1360),
  program("warwick-msc-business-analytics", "university-of-warwick", "Business Analytics", "Master", "Business", 39000, "2027-07-31", true, "Analytics program for business decisions, operations, and data-driven strategy.", ["analytics", "business", "strategy"], 3.2, 7.0),
  program("warwick-phd-data-science", "university-of-warwick", "Data Science Research", "PhD", "Data Science", 25500, "2027-01-15", true, "Research pathway for advanced statistics, machine learning, and computational methods.", ["data", "research", "statistics"], 3.5, 7.0),
  program("uoft-bsc-computer-science", "university-of-toronto", "Computer Science", "Bachelor", "Computer Science", 46000, "2027-01-15", true, "Highly selective computing degree with software, theory, and systems pathways.", ["software", "algorithms", "systems"], 3.5, 6.5, 1350),
  program("uoft-msc-applied-computing", "university-of-toronto", "Applied Computing", "Master", "Computer Science", 51000, "2026-12-01", true, "Professional graduate computing program with industry-linked applied projects.", ["software", "applied computing", "industry"], 3.4, 7.0),
  program("uoft-mhsc-health-informatics", "university-of-toronto", "Health Informatics", "Master", "Medicine/Health Sciences", 43000, "2027-02-01", true, "Health technology program connecting data systems, clinical workflows, and analytics.", ["health", "informatics", "data"], 3.2, 7.0),
  program("ubc-basc-environmental-engineering", "university-of-british-columbia", "Environmental Engineering", "Bachelor", "Engineering", 44000, "2027-01-15", true, "Engineering degree for sustainability, water, climate, and infrastructure challenges.", ["engineering", "sustainability", "climate"], 3.3, 6.5, 1280),
  program("ubc-bcom-business", "university-of-british-columbia", "Commerce", "Bachelor", "Business", 45500, "2027-01-15", true, "Business degree with finance, marketing, operations, and entrepreneurship pathways.", ["business", "commerce", "finance"], 3.3, 6.5, 1290),
  program("ubc-msc-data-science", "university-of-british-columbia", "Data Science", "Master", "Data Science", 36000, "2027-02-28", true, "Applied data science program focused on real-world analysis and communication.", ["data", "statistics", "applied"], 3.2, 7.0),
  program("tum-bsc-mechanical-engineering", "technical-university-of-munich", "Mechanical Engineering", "Bachelor", "Engineering", 5500, "2027-07-15", false, "Technical engineering foundation in design, mechanics, production, and systems.", ["engineering", "mechanics", "design"], 3.0, 6.5),
  program("tum-msc-data-engineering", "technical-university-of-munich", "Data Engineering and Analytics", "Master", "Data Science", 6500, "2026-11-30", true, "Advanced data systems program for analytics, infrastructure, and engineering roles.", ["data", "analytics", "engineering"], 3.0, 6.5),
  program("tum-msc-robotics-ai", "technical-university-of-munich", "Robotics and Artificial Intelligence", "Master", "Artificial Intelligence", 8000, "2027-05-31", true, "AI and robotics program combining perception, control, and intelligent systems.", ["robotics", "ai", "systems"], 3.3, 6.5),
  program("freiburg-md-medicine", "university-of-freiburg", "Medicine", "Bachelor", "Medicine/Health Sciences", 5000, "2027-07-15", false, "Health sciences pathway with strong science readiness and language planning needs.", ["medicine", "health", "science"], 3.6, 7.0, 1380),
  program("freiburg-msc-computer-science", "university-of-freiburg", "Computer Science", "Master", "Computer Science", 4200, "2027-05-15", true, "Graduate computing program with algorithms, software systems, and research options.", ["software", "algorithms", "research"], 3.0, 6.5),
  program("uva-msc-business-analytics", "university-of-amsterdam", "Business Analytics", "Master", "Business", 18500, "2027-04-01", true, "Business analytics degree for quantitative decision-making and strategy roles.", ["business", "analytics", "management"], 3.2, 7.0),
  program("uva-llm-law-technology", "university-of-amsterdam", "Law and Technology", "Master", "Law", 17000, "2027-04-01", true, "Legal studies program focused on technology regulation, data, and digital society.", ["law", "technology", "policy"], 3.1, 7.0),
  program("uva-bsc-ai", "university-of-amsterdam", "Artificial Intelligence", "Bachelor", "Artificial Intelligence", 16000, "2027-04-01", true, "Interdisciplinary AI program with computing, cognition, and data foundations.", ["ai", "cognition", "data"], 3.2, 6.5, 1280),
  program("helsinki-msc-software-engineering", "university-of-helsinki", "Software and Service Engineering", "Master", "Computer Science", 16500, "2027-01-03", true, "Software engineering path for cloud services, scalable products, and applied systems.", ["software", "services", "cloud"], 3.0, 6.5),
  program("helsinki-msc-data-science", "university-of-helsinki", "Data Science", "Master", "Data Science", 17500, "2027-01-03", true, "Data science curriculum spanning machine learning, statistics, and responsible data use.", ["data", "machine learning", "statistics"], 3.1, 6.5),
  program("metu-bsc-engineering", "middle-east-technical-university", "Electrical and Electronics Engineering", "Bachelor", "Engineering", 6200, "2027-07-01", true, "Engineering degree with strong math, circuits, signal processing, and systems work.", ["engineering", "electronics", "systems"], 3.0, 6.0, 1200),
  program("metu-bsc-economics", "middle-east-technical-university", "Economics", "Bachelor", "Economics", 5200, "2027-07-01", false, "Economics degree with quantitative, policy, and development economics foundations.", ["economics", "policy", "quantitative"], 2.9, 6.0, 1180),
  program("kaist-msc-artificial-intelligence", "kaist", "Artificial Intelligence", "Master", "Artificial Intelligence", 15000, "2026-12-15", true, "Research-oriented AI program for machine learning, optimization, and intelligent systems.", ["ai", "machine learning", "research"], 3.3, 6.5),
  program("kaist-phd-cybersecurity", "kaist", "Cybersecurity Research", "PhD", "Cybersecurity", 14000, "2027-01-10", true, "Doctoral research path in security, cryptography, privacy, and resilient systems.", ["security", "research", "privacy"], 3.5, 7.0),
  program("um-bcs-computer-science", "university-of-malaya", "Computer Science", "Bachelor", "Computer Science", 6500, "2027-06-30", true, "Accessible computing degree with software engineering and systems fundamentals.", ["software", "systems", "programming"], 3.0, 6.0, 1150),
  program("um-mba-business", "university-of-malaya", "Business Administration", "Master", "Business", 7800, "2027-05-31", true, "Business program for students building management, finance, and strategy skills.", ["business", "strategy", "management"], 3.0, 6.5),
  program("khalifa-bsc-aerospace-engineering", "khalifa-university", "Aerospace Engineering", "Bachelor", "Engineering", 22000, "2027-03-15", true, "Engineering program focused on aircraft, space systems, design, and simulation.", ["engineering", "aerospace", "simulation"], 3.3, 6.5, 1300),
  program("khalifa-msc-cybersecurity", "khalifa-university", "Cybersecurity", "Master", "Cybersecurity", 24000, "2027-04-30", true, "Graduate cybersecurity degree covering secure systems, networks, and critical infrastructure.", ["cybersecurity", "networks", "infrastructure"], 3.2, 6.5),
  program("elte-bsc-computer-science", "eotvos-lorand-university", "Computer Science", "Bachelor", "Computer Science", 6200, "2027-06-30", true, "European computing degree with programming, algorithms, data, and systems courses.", ["software", "algorithms", "europe"], 2.9, 6.0, 1120),
  program("elte-ma-law", "eotvos-lorand-university", "European and International Business Law", "Master", "Law", 7200, "2027-05-31", true, "Law program for students interested in European business, contracts, and regulation.", ["law", "business", "europe"], 3.0, 6.5),
  program("warsaw-ba-international-relations", "university-of-warsaw", "International Relations", "Bachelor", "Law", 4500, "2027-07-10", false, "Policy-oriented program for students interested in diplomacy, law, and global institutions.", ["politics", "diplomacy", "law"], 2.8, 6.0),
  program("warsaw-msc-data-science", "university-of-warsaw", "Data Science and Business Analytics", "Master", "Data Science", 6200, "2027-06-01", true, "Data and analytics degree for students targeting business intelligence and modeling roles.", ["data", "analytics", "business"], 3.0, 6.5),
  program("polimi-msc-architecture", "politecnico-di-milano", "Architecture and Urban Design", "Master", "Design", 5200, "2027-03-07", true, "Design-led architecture program emphasizing portfolio quality, urban systems, and studio work.", ["architecture", "design", "urban planning"], 3.0, 6.0),
  program("polimi-msc-digital-design", "politecnico-di-milano", "Digital and Interaction Design", "Master", "Design", 6500, "2027-03-07", true, "Interaction design program for digital products, research, prototyping, and service design.", ["design", "ux", "product"], 3.0, 6.5),
  program("nus-bsc-data-science", "national-university-of-singapore", "Data Science and Analytics", "Bachelor", "Data Science", 31000, "2027-02-21", true, "Highly selective data science degree with statistics, computing, and machine learning.", ["data", "statistics", "machine learning"], 3.6, 6.5, 1400),
  program("nus-llb-law", "national-university-of-singapore", "Law", "Bachelor", "Law", 36000, "2027-03-01", true, "Competitive law degree for students with strong writing, reasoning, and academic record.", ["law", "writing", "policy"], 3.7, 7.0, 1420),
  program("nus-phd-ai", "national-university-of-singapore", "Artificial Intelligence Research", "PhD", "Artificial Intelligence", 28000, "2026-12-15", true, "Doctoral path in AI, machine learning, data systems, and responsible technology.", ["ai", "research", "machine learning"], 3.6, 7.0),
];

export const seedPrograms: Program[] = programRecords.map(toProgram);

export const seedAdmissionRequirements: AdmissionRequirement[] = programRecords.map(
  ({ id, requirement }) => ({
    ...requirement,
    id: `req-${id}`,
    programId: id,
  }),
);

function university({
  city,
  country,
  id,
  max,
  min,
  name,
  rankingNotes,
  scholarship,
  website,
}: {
  city: string;
  country: string;
  id: string;
  max: number;
  min: number;
  name: string;
  rankingNotes: string;
  scholarship: string;
  website: string;
}): University {
  return {
    city,
    country,
    id,
    name,
    rankingNotes,
    scholarships: [
      {
        coverage: "Varies by applicant profile and annual funding round",
        eligibilitySummary:
          "Typically based on academic strength, application quality, and program availability.",
        name: scholarship,
      },
    ],
    sourceNote,
    tuitionRange: { currency: "USD", max, min },
    website,
  };
}

function toProgram(
  record: Program & { requirement: Omit<AdmissionRequirement, "id" | "programId"> },
): Program {
  return {
    applicationDeadline: record.applicationDeadline,
    degreeLevel: record.degreeLevel,
    description: record.description,
    durationMonths: record.durationMonths,
    field: record.field,
    id: record.id,
    language: record.language,
    name: record.name,
    scholarshipsAvailable: record.scholarshipsAvailable,
    tags: record.tags,
    tuitionUsdPerYear: record.tuitionUsdPerYear,
    universityId: record.universityId,
  };
}

function program(
  id: string,
  universityId: string,
  name: string,
  degreeLevel: DegreeLevel,
  field: string,
  tuitionUsdPerYear: number,
  applicationDeadline: string,
  scholarshipsAvailable: boolean,
  description: string,
  tags: string[],
  minGpa: number,
  minIelts: number,
  minSat?: number,
): Program & { requirement: Omit<AdmissionRequirement, "id" | "programId"> } {
  return {
    applicationDeadline,
    degreeLevel,
    description,
    durationMonths: degreeLevel === "Bachelor" ? 48 : degreeLevel === "Master" ? 24 : 48,
    field,
    id,
    language: "English",
    name,
    requirement: {
      minGpa,
      minIelts,
      minSat,
      notes: requirementNote(field, degreeLevel),
      requiredDocuments: documentsFor(field, degreeLevel, minSat),
    },
    scholarshipsAvailable,
    tags,
    tuitionUsdPerYear,
    universityId,
  };
}

function documentsFor(
  field: string,
  degreeLevel: DegreeLevel,
  minSat?: number,
): string[] {
  const documents = [
    degreeLevel === "Bachelor" ? "High school transcript" : "Previous degree transcript",
    "English proficiency evidence",
    "Statement of purpose",
  ];

  if (typeof minSat === "number") {
    documents.push("SAT or accepted equivalent");
  }

  if (degreeLevel !== "Bachelor") {
    documents.push("CV");
  }

  if (degreeLevel === "PhD") {
    documents.push("Research proposal", "Recommendation letters");
  }

  if (field === "Design") {
    documents.push("Portfolio");
  }

  if (field === "Medicine/Health Sciences") {
    documents.push("Science prerequisite evidence");
  }

  return documents;
}

function requirementNote(field: string, degreeLevel: DegreeLevel): string {
  if (degreeLevel === "PhD") {
    return "Research fit, supervisor alignment, and prior academic work matter strongly.";
  }

  if (field === "Design") {
    return "Portfolio quality can be as important as academic indicators.";
  }

  if (field === "Medicine/Health Sciences") {
    return "Science preparation and prerequisite recognition should be checked early.";
  }

  if (["Computer Science", "Data Science", "Artificial Intelligence", "Cybersecurity"].includes(field)) {
    return "Math, programming, and project evidence can improve competitiveness.";
  }

  return "Competitive applicants usually exceed the minimum academic indicators.";
}
