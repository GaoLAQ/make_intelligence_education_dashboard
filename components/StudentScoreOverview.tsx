"use client";

import type { Student } from "@/lib/types";

interface StudentScoreOverviewProps {
  students: Student[];
}

const getAverageScore = (students: Student[]) => {
  if (students.length === 0) return 0;
  const total = students.reduce((sum, student) => {
    const chapterAverage =
      student.chapters.reduce((acc, chapter) => acc + chapter.progress, 0) /
      student.chapters.length;
    return sum + chapterAverage;
  }, 0);
  return Math.round(total / students.length);
};

const getImprovementRate = (students: Student[]) => {
  if (students.length === 0) return 0;
  const improvements = students.map((student) => {
    const sortedAssessments = [...student.recentAssessments].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    if (sortedAssessments.length < 2) return 0;
    const earliest = sortedAssessments[0]?.score ?? 0;
    const latest = sortedAssessments[sortedAssessments.length - 1]?.score ?? 0;
    return latest - earliest;
  });
  return Math.round(
    improvements.reduce((sum, improvement) => sum + improvement, 0) /
      students.length
  );
};

export default function StudentScoreOverview({
  students,
}: StudentScoreOverviewProps) {
  const averageScore = getAverageScore(students);
  const improvementRate = getImprovementRate(students);
  const activeStudents = students.length;

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-blue-100">Average Performance</p>
            <h2 className="text-4xl font-bold">{averageScore}%</h2>
          </div>
          <div className="rounded-full bg-white bg-opacity-20 px-4 py-2 text-sm">
            {activeStudents} active student{activeStudents !== 1 ? "s" : ""}
          </div>
        </div>
        <p className="mt-4 text-sm text-blue-100">
          Average chapter progress across all GCSE mathematics topics.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Improvement Rate
            </h3>
            <span
              className={`text-sm font-medium ${
                improvementRate >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {improvementRate >= 0 ? "+" : ""}
              {improvementRate}%
            </span>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            Average change in assessment scores over the past 30 days.
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Mastery Highlights
            </h3>
            <span className="text-sm font-medium text-blue-600">
              {students.flatMap((student) => student.chapters).filter(
                (chapter) => chapter.mastery === "Advanced"
              ).length}{" "}
              advanced topics
            </span>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            Total number of topics where students have reached advanced or
            mastered levels.
          </p>
        </div>
      </div>
    </div>
  );
}
