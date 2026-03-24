/**
 * calculateMatchScore
 * Returns a score 0–100 representing how well a scholarship fits a student.
 *
 * Scoring breakdown (max 100):
 *   Course match      — 30 pts  (exact: 30, broad "Any"/"All": 15, partial keyword: 10)
 *   Category match    — 25 pts  (matched: 25, no restriction listed: 12)
 *   GPA / Merit       — 20 pts  (meets minGPA: 20, no GPA restriction: 10)
 *   Location match    — 15 pts  (matched: 15, no restriction: 8)
 *   Deadline urgency  — 10 pts  (within 30 days: 10, within 90 days: 5)
 */

function calculateMatchScore(student, scholarship) {
  let score = 0;
  const elig = scholarship.eligibility || {};

  // ── 1. Course match (30 pts) ─────────────────────────────────────
  const schCourses = (elig.courses || []).map(c => c.toLowerCase().trim());
  const stuCourse  = (student.course || "").toLowerCase().trim();

  if (schCourses.length === 0) {
    // No course restriction → open to all
    score += 15;
  } else if (schCourses.some(c => c === "any" || c === "all" || c === "open")) {
    score += 15;
  } else if (stuCourse && schCourses.includes(stuCourse)) {
    score += 30; // Exact match
  } else if (stuCourse && schCourses.some(c => c.includes(stuCourse) || stuCourse.includes(c))) {
    score += 10; // Partial keyword match (e.g. "computer engineering" ↔ "engineering")
  }

  // ── 2. Category / reservation match (25 pts) ────────────────────
  const schCats = (elig.categories || []).map(c => c.toUpperCase().trim());
  const stuCats = (student.categories || []).map(c => c.toUpperCase().trim());

  if (schCats.length === 0) {
    // No category restriction → open to all
    score += 12;
  } else if (schCats.some(c => c === "GEN" || c === "ALL" || c === "OPEN")) {
    score += 12; // General / open scholarship
    if (stuCats.some(c => schCats.includes(c))) score += 13; // Bonus: exact match too
  } else if (stuCats.length > 0 && stuCats.some(c => schCats.includes(c))) {
    score += 25;
  }

  // ── 3. GPA / merit (20 pts) ─────────────────────────────────────
  const minGPA   = elig.minGPA ?? elig.minCGPA ?? null;
  const stuGPA   = parseFloat(student.gpa) || 0;

  if (minGPA === null || minGPA === undefined) {
    // No GPA requirement
    score += 10;
  } else if (stuGPA >= minGPA) {
    score += 20;
  } else if (stuGPA >= minGPA - 0.5) {
    // Within 0.5 of threshold — still somewhat relevant
    score += 8;
  }

  // ── 4. Location match (15 pts) ──────────────────────────────────
  const schLocs = (elig.locations || []).map(l => l.toLowerCase().trim());
  const stuLoc  = (student.location || "").toLowerCase().trim();

  if (schLocs.length === 0) {
    score += 8; // No location restriction
  } else if (stuLoc && schLocs.some(l =>
    l === stuLoc ||
    l.includes(stuLoc) ||
    stuLoc.includes(l) ||
    l === "all india" || l === "india" || l === "nationwide"
  )) {
    score += 15;
  }

  // ── 5. Deadline urgency bonus (10 pts) ──────────────────────────
  if (scholarship.deadline) {
    const daysLeft = (new Date(scholarship.deadline) - new Date()) / (1000 * 60 * 60 * 24);
    if (daysLeft > 0 && daysLeft <= 30)  score += 10;
    else if (daysLeft > 0 && daysLeft <= 90) score += 5;
  }

  return Math.min(score, 100);
}

module.exports = calculateMatchScore;