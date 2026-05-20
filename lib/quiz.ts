export type QuizCategory =
  | "faith_essentials"
  | "faith_practices"
  | "christian_convictions"
  | "marriage_family"
  | "lifestyle"
  | "life_location";

export type QuizQuestion = {
  id: string;
  category: QuizCategory;
  weight: number;
  prompt: string;
  options: string[];
};

export const CATEGORY_LABELS: Record<QuizCategory, string> = {
  faith_essentials: "Faith essentials",
  faith_practices: "Faith practices",
  christian_convictions: "Christian convictions",
  marriage_family: "Marriage & family",
  lifestyle: "Lifestyle",
  life_location: "Life & location",
};

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // Faith essentials — weight 3
  {
    id: "bible_authority",
    category: "faith_essentials",
    weight: 3,
    prompt: "The Bible is the inspired and authoritative word of God.",
    options: ["Strongly agree", "Agree", "Neutral", "Disagree"],
  },
  {
    id: "jesus_salvation",
    category: "faith_essentials",
    weight: 3,
    prompt: "Jesus is the only way to salvation.",
    options: ["Strongly agree", "Agree", "Neutral", "Disagree"],
  },
  {
    id: "prayer_central",
    category: "faith_essentials",
    weight: 3,
    prompt: "Prayer is central to my daily walk with God.",
    options: ["Strongly agree", "Agree", "Neutral", "Disagree"],
  },
  {
    id: "spiritual_season",
    category: "faith_essentials",
    weight: 3,
    prompt: "How would you describe your spiritual life right now?",
    options: [
      "Growing actively",
      "Steady walk",
      "In a hard season",
      "Returning to faith",
    ],
  },
  {
    id: "denomination_match",
    category: "faith_essentials",
    weight: 3,
    prompt: "How important is it that your partner shares your denomination?",
    options: ["Essential", "Important", "Nice to have", "Not important"],
  },

  // Faith practices — weight 2
  {
    id: "church_attendance",
    category: "faith_practices",
    weight: 2,
    prompt: "How often do you attend church services?",
    options: ["Every week", "Most weeks", "A few times a month", "Occasionally"],
  },
  {
    id: "tithing",
    category: "faith_practices",
    weight: 2,
    prompt: "How important is tithing to you?",
    options: [
      "Essential to me",
      "Important",
      "Give occasionally",
      "Not part of my practice",
    ],
  },
  {
    id: "bible_reading",
    category: "faith_practices",
    weight: 2,
    prompt: "How would you describe your Bible reading?",
    options: ["Daily", "Several times a week", "Weekly", "Occasionally"],
  },
  {
    id: "church_involvement",
    category: "faith_practices",
    weight: 2,
    prompt: "How involved are you in church beyond Sunday service?",
    options: [
      "Lead or serve regularly",
      "In small groups",
      "Attend mainly",
      "Just visiting",
    ],
  },

  // Christian convictions — weight 3
  {
    id: "carnival",
    category: "christian_convictions",
    weight: 3,
    prompt: "How do you feel about Christians participating in carnival?",
    options: [
      "I don't participate",
      "I'm a spectator only",
      "Participate selectively",
      "Participate joyfully",
    ],
  },
  {
    id: "physical_intimacy",
    category: "christian_convictions",
    weight: 3,
    prompt: "Where do you stand on physical intimacy before marriage?",
    options: [
      "Wait until marriage",
      "Affection, but no sex",
      "Open in a committed relationship",
      "Prefer not to say",
    ],
  },
  {
    id: "cohabitation",
    category: "christian_convictions",
    weight: 3,
    prompt: "Living together before marriage?",
    options: [
      "Wait for marriage",
      "After engagement is fine",
      "Open to it",
      "Not concerned either way",
    ],
  },
  {
    id: "bars_nightclubs",
    category: "christian_convictions",
    weight: 3,
    prompt: "How do you feel about Christians at bars or nightclubs?",
    options: [
      "I avoid them",
      "Special occasions only",
      "Fine in moderation",
      "Regular part of social life",
    ],
  },
  {
    id: "media_choices",
    category: "christian_convictions",
    weight: 3,
    prompt: "How careful are you about the media you watch and listen to?",
    options: [
      "Mostly Christian or family-friendly",
      "Mindful, but not strict",
      "Watch most things, skip the worst",
      "Don't filter my media",
    ],
  },
  {
    id: "tattoos_piercings",
    category: "christian_convictions",
    weight: 2,
    prompt: "How do you view tattoos and visible piercings?",
    options: [
      "I avoid them on biblical grounds",
      "Not for me, but I don't judge others",
      "Open to small or meaningful ones",
      "Love them — they're self-expression",
    ],
  },

  // Marriage & family — weight 2
  {
    id: "marriage_timing",
    category: "marriage_family",
    weight: 2,
    prompt: "How soon would you like to be married?",
    options: [
      "Within 1–2 years",
      "Within 3–5 years",
      "When God brings the right person",
      "Not sure",
    ],
  },
  {
    id: "children",
    category: "marriage_family",
    weight: 2,
    prompt: "Do you want children?",
    options: [
      "Yes, definitely",
      "Would like to",
      "Maybe",
      "No",
      "Have kids, not planning more",
    ],
  },
  {
    id: "marriage_leadership",
    category: "marriage_family",
    weight: 2,
    prompt: "How do you see leadership in a Christian marriage?",
    options: [
      "Husband as servant-leader",
      "Mutual partnership",
      "Whoever is gifted in the area",
      "Haven't formed a view",
    ],
  },
  {
    id: "extended_family",
    category: "marriage_family",
    weight: 2,
    prompt: "How important is your partner's family being part of your life?",
    options: ["Very important", "Somewhat", "A little", "Not important"],
  },

  // Lifestyle — weight 1
  {
    id: "active",
    category: "lifestyle",
    weight: 1,
    prompt: "How important is staying physically active?",
    options: ["Essential", "Important", "Sometimes", "Not a priority"],
  },
  {
    id: "personality",
    category: "lifestyle",
    weight: 1,
    prompt: "Where do you fall on personality?",
    options: [
      "Strong introvert",
      "Lean introvert",
      "Lean extrovert",
      "Strong extrovert",
    ],
  },

  // Life & location — weight 2
  {
    id: "aruba_commitment",
    category: "life_location",
    weight: 2,
    prompt: "Are you committed to staying in Aruba?",
    options: [
      "Yes, my life is here",
      "Open to leaving for the right reason",
      "Looking to leave eventually",
      "Not sure",
    ],
  },
  {
    id: "service_missions",
    category: "life_location",
    weight: 2,
    prompt: "How important is shared service or missions in marriage?",
    options: ["Essential", "Important", "Open to it", "Not for me"],
  },
];

export type AnswerMap = Map<string, number>;

export type Compatibility = {
  overall: number;
  byCategory: Partial<Record<QuizCategory, number>>;
  answeredBoth: number;
  totalQuestions: number;
};

export function computeCompatibility(
  a: AnswerMap,
  b: AnswerMap
): Compatibility {
  let totalWeighted = 0;
  let totalMax = 0;
  let answeredBoth = 0;

  const catWeighted: Partial<Record<QuizCategory, number>> = {};
  const catMax: Partial<Record<QuizCategory, number>> = {};

  for (const q of QUIZ_QUESTIONS) {
    const av = a.get(q.id);
    const bv = b.get(q.id);
    if (av === undefined || bv === undefined) continue;

    answeredBoth++;
    const maxDiff = q.options.length - 1;
    const sim = maxDiff === 0 ? 1 : 1 - Math.abs(av - bv) / maxDiff;
    const w = q.weight;

    totalWeighted += sim * w;
    totalMax += w;

    catWeighted[q.category] = (catWeighted[q.category] ?? 0) + sim * w;
    catMax[q.category] = (catMax[q.category] ?? 0) + w;
  }

  const overall = totalMax > 0 ? Math.round((totalWeighted / totalMax) * 100) : 0;
  const byCategory: Partial<Record<QuizCategory, number>> = {};
  for (const key of Object.keys(catWeighted) as QuizCategory[]) {
    const max = catMax[key] ?? 0;
    byCategory[key] =
      max > 0 ? Math.round(((catWeighted[key] ?? 0) / max) * 100) : 0;
  }

  return {
    overall,
    byCategory,
    answeredBoth,
    totalQuestions: QUIZ_QUESTIONS.length,
  };
}

export function toAnswerMap(
  rows: Array<{ question_id: string; answer_index: number }>
): AnswerMap {
  const map: AnswerMap = new Map();
  for (const r of rows) map.set(r.question_id, r.answer_index);
  return map;
}
