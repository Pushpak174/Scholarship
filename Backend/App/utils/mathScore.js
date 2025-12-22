function calculateMatchScore(student, scholarship) {
  let score = 0;

  // Course match
  if (
    scholarship.eligibility?.courses?.includes(student.course)
  ) {
    score += 40;
  }

  // GPA match
  if (
    scholarship.eligibility?.minGPA &&
    student.gpa >= scholarship.eligibility.minGPA
  ) {
    score += 25;
  }

  // Location match
  if (
    scholarship.eligibility?.locations?.includes(student.location)
  ) {
    score += 15;
  }

  // Category match
  if (
    scholarship.eligibility?.categories?.some(cat =>
      student.categories.includes(cat)
    )
  ) {
    score += 10;
  }

  // Deadline urgency (within 30 days)
  if (scholarship.deadline) {
    const daysLeft =
      (new Date(scholarship.deadline) - new Date()) / (1000 * 60 * 60 * 24);
    if (daysLeft <= 30) score += 5;
  }

  return score;
}

module.exports = calculateMatchScore;
