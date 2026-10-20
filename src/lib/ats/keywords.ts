type Skill = { name: string; aliases?: string[] };

// Suggestions must name a skill or a job practice, not merely a repeated word.
const PRACTICES = [
  "distributed systems", "system design", "software architecture", "data structures", "algorithms",
  "API design", "REST APIs", "microservices", "database design", "relational databases", "NoSQL",
  "data pipelines", "data engineering", "data modeling", "ETL", "event driven architecture",
  "cloud infrastructure", "infrastructure as code", "site reliability engineering", "incident response",
  "observability", "performance optimization", "unit testing", "integration testing", "automated testing",
  "test driven development", "code review", "version control", "continuous integration", "continuous delivery",
  "machine learning", "deep learning", "natural language processing", "computer vision", "statistics",
  "data analysis", "data analytics", "business intelligence", "A/B testing", "experimental design",
  "information security", "application security", "network security", "threat modeling", "penetration testing",
  "user research", "interaction design", "interface design", "visual design", "design systems",
  "prototyping", "wireframing", "usability testing", "accessibility", "motion design",
  "project management", "product management", "stakeholder management", "requirements gathering",
  "business analysis", "agile", "scrum", "financial reporting", "financial modeling", "risk management",
  "accounting", "bookkeeping", "auditing", "budgeting", "forecasting", "tax preparation",
  "customer service", "customer success", "account management", "sales operations", "lead generation",
  "digital marketing", "search engine optimization", "content strategy", "copywriting", "email marketing",
  "supply chain", "inventory management", "procurement", "logistics", "quality assurance", "quality control",
  "patient care", "clinical research", "nursing", "human resources", "talent acquisition", "recruiting",
  "negotiation", "technical writing", "public speaking", "problem solving",
];

const TOOLS = [
  "Python", "JavaScript", "TypeScript", "Java", "C++", "C#", "Ruby", "Rust", "PHP", "Swift", "Kotlin",
  "Scala", "SQL", "HTML", "CSS", "React", "Angular", "Vue", "Next.js", "Django", "Flask", "FastAPI",
  "Rails", "Spring", ".NET", "GraphQL", "gRPC", "PostgreSQL", "MySQL", "SQLite", "MongoDB", "Redis",
  "DynamoDB", "Elasticsearch", "Kafka", "RabbitMQ", "Spark", "Hadoop", "Airflow", "dbt", "Snowflake",
  "BigQuery", "Docker", "Kubernetes", "Terraform", "Ansible", "Linux", "Git", "GitHub Actions", "Jenkins",
  "CircleCI", "Azure", "Prometheus", "Grafana", "Datadog", "Selenium", "Playwright", "Cypress", "Jest",
  "pytest", "JUnit", "TensorFlow", "PyTorch", "pandas", "NumPy", "scikit-learn", "MATLAB", "Tableau",
  "Salesforce", "Jira", "SAP", "Figma", "Sketch", "Adobe Illustrator", "Adobe Photoshop", "Adobe InDesign",
  "QuickBooks", "Xero", "HubSpot", "Marketo", "Google Analytics", "Looker", "Excel", "PowerPoint",
];

const SKILLS: Skill[] = [
  ...PRACTICES.map((name) => ({ name })), ...TOOLS.map((name) => ({ name })),
  { name: "Node.js", aliases: ["NodeJS", "Node JS"] },
  { name: "AWS", aliases: ["Amazon Web Services"] },
  { name: "Google Cloud", aliases: ["GCP", "Google Cloud Platform"] },
  { name: "CI/CD", aliases: ["CI CD", "continuous integration and continuous delivery"] },
  { name: "Power BI", aliases: ["PowerBI"] },
  { name: "Go", aliases: ["Golang"] }, { name: "R" }, { name: "C" },
];
const EXTRA_ALIASES: Record<string, string[]> = {
  javascript: ["JS"], typescript: ["TS"], react: ["React.js", "ReactJS"],
  postgresql: ["Postgres"], "rest apis": ["RESTful APIs", "REST API"],
  excel: ["Microsoft Excel"], "search engine optimization": ["SEO"],
  "financial modeling": ["financial modelling"], "data modeling": ["data modelling"],
  "test driven development": ["TDD"], "infrastructure as code": ["IaC"],
  "site reliability engineering": ["SRE"],
};

export function normaliseKeyword(text: string) {
  return text.normalize("NFKC").toLowerCase().replace(/[\u2010-\u2015-]/g, " ").replace(/\s+/g, " ").trim();
}
const aliases = new Map<string, string[]>();
for (const skill of SKILLS) {
  const terms = [skill.name, ...(skill.aliases ?? []), ...(EXTRA_ALIASES[normaliseKeyword(skill.name)] ?? [])];
  for (const term of terms) aliases.set(normaliseKeyword(term), terms);
}
function escapeRe(text: string) { return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }
function keywordPattern(term: string) {
  const alternatives = aliases.get(normaliseKeyword(term)) ?? [term];
  return alternatives.map((value) => value.trim().split(/[\s\u2010-\u2015-]+/).map(escapeRe).join("[\\s\\u2010-\\u2015-]+"))
    .sort((a, b) => b.length - a.length).join("|");
}
function matcher(term: string) {
  return new RegExp(`(^|[^\\p{L}\\p{N}+#])((?:${keywordPattern(term)})(?:s|es)?)(?=$|[^\\p{L}\\p{N}+#])`, "giu");
}
export function containsKeyword(text: string, term: string) {
  return Boolean(term.trim()) && matcher(term).test(text.normalize("NFKC"));
}
export function parseKeywordList(text: string) {
  return [...new Map(text.split(/[,;\n]+/).map((term) => term.trim()).filter((term) => term.length > 0 && term.length <= 160)
    .map((term) => [normaliseKeyword(term), term])).values()].slice(0, 100);
}

export function suggestKeywords(jobDescription: string): string[] {
  const found = SKILLS.filter((skill) => {
    if (!containsKeyword(jobDescription, skill.name)) return false;
    // These language names also occur as ordinary words or letters.
    if (["Go", "R", "C"].includes(skill.name)) {
      if (skill.name === "Go" && /\bgolang\b/i.test(jobDescription)) return true;
      if (new RegExp(`\\b(?:Python|Java|Ruby|Rust|Scala|Kotlin|Swift)\\b[^.!?\\n]{0,60}\\b${skill.name}\\b`).test(jobDescription)) return true;
      return new RegExp(`(?:languages?|programming|proficiency|proficient|skills?|code|coding)[^.!?\\n]{0,60}\\b${skill.name}\\b|\\b${skill.name}\\s*(?:,|/|\\s+and\\s+(?:Python|Java|SQL|Ruby))`).test(jobDescription);
    }
    return true;
  });
  // Avoid separate suggestions for a phrase and the tool name already inside it.
  return found.filter((skill) => !found.some((other) => other !== skill && other.name.length > skill.name.length && containsKeyword(other.name, skill.name)))
    .sort((a, b) => {
      const count = (skill: Skill) => [...jobDescription.matchAll(matcher(skill.name))].length;
      return count(b) - count(a) || a.name.localeCompare(b.name);
    }).slice(0, 40).map((skill) => skill.name);
}

export type KeywordRange = { start: number; end: number; term: string };
export function keywordRanges(text: string, terms: string[]): KeywordRange[] {
  const candidates = terms.filter((term) => term.trim()).flatMap((term) => [...text.matchAll(matcher(term))].map((match) => ({
    start: match.index! + match[1].length, end: match.index! + match[1].length + match[2].length, term,
  })));
  const accepted: KeywordRange[] = [];
  for (const range of candidates.sort((a, b) => (b.end - b.start) - (a.end - a.start) || a.start - b.start)) {
    if (!accepted.some((other) => range.start < other.end && range.end > other.start)) accepted.push(range);
  }
  return accepted.sort((a, b) => a.start - b.start);
}
