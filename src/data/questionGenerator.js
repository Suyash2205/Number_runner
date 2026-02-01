/**
 * Grade-based Question Generator
 * ONE entry point: generateQuestion(grade) → buildMathExpression(config)
 */

const GRADE_STORAGE_KEY = "number-path-runner-grade";

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getGrade() {
  try {
    const stored = localStorage.getItem(GRADE_STORAGE_KEY);
    const g = stored != null ? parseInt(stored, 10) : 5;
    return g >= 3 && g <= 7 ? g : 5;
  } catch {
    return 5;
  }
}

export function setGrade(grade) {
  try {
    localStorage.setItem(GRADE_STORAGE_KEY, String(grade));
  } catch {
    /* ignore */
  }
}

function getDifficultyConfig(grade) {
  switch (grade) {
    case 3:
      return { max: 100, ops: 1, allowNegative: false, allowDecimal: false, allowExponent: false, allowFractions: false };
    case 4:
      return { max: 500, ops: 2, allowNegative: false, allowDecimal: false, allowExponent: false, allowFractions: false };
    case 5:
      return { max: 1000, ops: 3, allowNegative: false, allowDecimal: false, allowExponent: false, allowFractions: false };
    case 6:
      return { max: 1000, ops: 3, allowNegative: true, allowDecimal: true, allowExponent: false, allowFractions: false };
    case 7:
      return { max: 5000, ops: 4, allowNegative: true, allowDecimal: true, allowExponent: true, allowFractions: true };
    default:
      return getDifficultyConfig(5);
  }
}

function randomExponent() {
  const base = randomInt(2, 12);
  const exp = randomInt(2, 3);
  return `${base}^${exp}`;
}

function randomFraction() {
  const n = randomInt(1, 9);
  const d = randomInt(2, 10);
  return `${n}/${d}`;
}

function buildMathExpression(config) {
  const { max, ops, allowNegative, allowDecimal, allowExponent, allowFractions } = config;
  const cap = Math.min(max, ops >= 4 ? 500 : ops >= 3 ? 200 : ops >= 2 ? 100 : 50);

  if (ops === 1) {
    const opList = ["+", "−", "×"];
    const op = opList[randomInt(0, 2)];
    const a = randomInt(1, cap);
    let b;
    if (op === "−") b = randomInt(0, a - 1);
    else if (op === "×") b = randomInt(1, 12);
    else b = randomInt(1, cap - a);
    const v = op === "+" ? a + b : op === "−" ? a - b : a * b;
    return { question: `${a} ${op} ${b}`, answer: Math.round(v) };
  }

  if (ops === 2) {
    if (Math.random() < 0.5) {
      const d = randomInt(2, 12);
      const q = randomInt(1, Math.floor(cap / d));
      const a = q * d;
      const b = randomInt(1, 50);
      return { question: `(${a} ÷ ${d}) + ${b}`, answer: q + b };
    }
    const a = randomInt(1, 30);
    const b = randomInt(2, 10);
    const c = randomInt(1, 50);
    return { question: `${a} + ${b} × ${c}`, answer: a + b * c };
  }

  if (ops === 3) {
    if (allowNegative && Math.random() < 0.4) {
      const a = randomInt(1, 30);
      const b = randomInt(2, 12);
      const c = randomInt(1, 20);
      const v = -a + b * c;
      return { question: `-${a} + ${b} × ${c}`, answer: Math.round(v) };
    }
    if (allowDecimal && Math.random() < 0.4) {
      const w = randomInt(1, 15);
      const t = randomInt(1, 9);
      const b = randomInt(2, 6);
      const c = randomInt(1, 10);
      const v = w + t / 10 + b * c;
      return { question: `${w}.${t} + ${b} × ${c}`, answer: Math.round(v) };
    }
    if (Math.random() < 0.5) {
      const a = randomInt(50, cap);
      const b = randomInt(5, 30);
      const c = randomInt(2, 10);
      const d = randomInt(10, 60);
      const v = a - b * c + d;
      return { question: `${a} − ${b} × ${c} + ${d}`, answer: Math.round(v) };
    }
    const a = randomInt(50, 150);
    const b = randomInt(2, 12);
    const c = randomInt(1, 50);
    const d = randomInt(2, 8);
    const v = Math.floor(a / b) + c * d;
    return { question: `(${a} ÷ ${b}) + ${c} × ${d}`, answer: v };
  }

  if (ops === 4 && allowExponent && allowFractions) {
    const templates = [
      () => {
        const f1 = randomFraction();
        const f2 = randomFraction();
        const [n1, d1] = f1.split("/").map(Number);
        const [n2, d2] = f2.split("/").map(Number);
        const mult = d1 * d2;
        const sum = (n1 * d2 + n2 * d1) / mult;
        const v = Math.round(sum * mult);
        if (v !== sum * mult || v < 2) return null;
        return { q: `(${f1} + ${f2}) × ${mult}`, v };
      },
      () => {
        const e1 = randomExponent();
        const e2 = randomExponent();
        const [b1, exp1] = e1.split("^").map(Number);
        const [b2, exp2] = e2.split("^").map(Number);
        const m = randomInt(2, 8);
        const d = randomInt(2, 6);
        const v = Math.pow(b1, exp1) + (Math.pow(b2, exp2) * m) / d;
        if (Math.abs(v - Math.round(v)) > 0.001) return null;
        return { q: `${e1} + ${e2} × ${m} ÷ ${d}`, v: Math.round(v) };
      },
      () => {
        const b = randomInt(2, 5);
        const sq = b * b;
        const sub = randomInt(1, sq - 1);
        const denom = sq - sub;
        const quo = randomInt(2, 12);
        const num = denom * quo;
        const add = randomInt(1, 15);
        return { q: `${num} ÷ (${b}^2 − ${sub}) + ${add}`, v: quo + add };
      },
      () => {
        const e1 = randomExponent();
        const e2 = randomExponent();
        const [b1, exp1] = e1.split("^").map(Number);
        const [b2, exp2] = e2.split("^").map(Number);
        const add = randomInt(1, 25);
        return { q: `${e1} + ${e2} + ${add}`, v: Math.pow(b1, exp1) + Math.pow(b2, exp2) + add };
      },
    ];
    for (let i = 0; i < 15; i++) {
      const fn = templates[randomInt(0, templates.length - 1)];
      const r = fn();
      if (r && r.v >= 2 && r.v <= 500) {
        return { question: r.q, answer: Math.round(r.v) };
      }
    }
  }

  const a = randomInt(50, cap);
  const b = randomInt(5, 30);
  const c = randomInt(2, 10);
  const d = randomInt(10, 60);
  const v = a - b * c + d;
  return { question: `${a} − ${b} × ${c} + ${d}`, answer: Math.round(v) };
}

export function generateQuestion(grade = getGrade()) {
  const config = getDifficultyConfig(grade);
  const result = buildMathExpression(config);
  const answer = Math.round(result.answer);
  if (answer < 2 || answer > 999) return generateQuestion(grade);
  return { question: result.question, answer };
}

export function generateQuestions(count, grade = getGrade()) {
  const out = [];
  for (let i = 0; i < count; i++) out.push(generateQuestion(grade));
  return out;
}
