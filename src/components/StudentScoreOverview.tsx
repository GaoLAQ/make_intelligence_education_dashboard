import React from "react";
import type { Student, GCSEGrade } from "../types/index";

interface StudentScoreOverviewProps {
  students: Student[];
}

const StudentScoreOverview: React.FC<StudentScoreOverviewProps> = ({
  students,
}) => {
  const totalStudents = students.length;

  const gradeDistribution = students.reduce((acc, student) => {
    acc[student.currentGrade] = (acc[student.currentGrade] || 0) + 1;
    return acc;
  }, {} as Record<GCSEGrade, number>);

  const averageProgress =
    students.reduce((acc, student) => {
      const studentAvg =
        student.chapters.reduce((sum, chapter) => sum + chapter.progress, 0) /
        student.chapters.length;
      return acc + studentAvg;
    }, 0) / totalStudents;

  const studentsOnTrack = students.filter((s) => {
    const gradeOrder: GCSEGrade[] = [
      "U",
      "G",
      "F",
      "E",
      "D",
      "C",
      "B",
      "A",
      "A_STAR",
    ];
    const currentIndex = gradeOrder.indexOf(s.currentGrade);
    const targetIndex = gradeOrder.indexOf(s.targetGrade);
    return currentIndex >= targetIndex - 1; // Within 1 grade of target
  }).length;

  const getGradeColor = (grade: GCSEGrade) => {
    switch (grade) {
      case "A_STAR":
        return "bg-purple-100 text-purple-800";
      case "A":
        return "bg-blue-100 text-blue-800";
      case "B":
        return "bg-green-100 text-green-800";
      case "C":
        return "bg-yellow-100 text-yellow-800";
      case "D":
        return "bg-orange-100 text-orange-800";
      case "E":
      case "F":
      case "G":
      case "U":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "text-green-600";
    if (progress >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-6">
      {/* Overall Statistics */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Class Overview</h2>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
            <div className="text-3xl font-bold text-blue-600">
              {totalStudents}
            </div>
            <div className="text-sm text-blue-600">Total Students</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
            <div className="text-3xl font-bold text-green-600">
              {studentsOnTrack}
            </div>
            <div className="text-sm text-green-600">On Track</div>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Average Progress
            </span>
            <span className="text-sm font-medium text-gray-900">
              {Math.round(averageProgress)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${averageProgress}%` }}
            ></div>
          </div>
        </div>

        <div className="text-center">
          <span className="text-sm text-gray-600">
            {
              students.filter((s) => s.chapters.some((c) => c.progress < 50))
                .length
            }{" "}
            students need support
          </span>
        </div>
      </div>

      {/* Grade Distribution */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Grade Distribution
        </h3>
        <div className="space-y-3">
          {Object.entries(gradeDistribution).map(([grade, count]) => (
            <div key={grade} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span
                  className={`px-3 py-1 text-sm font-medium rounded-full ${getGradeColor(
                    grade as GCSEGrade
                  )}`}
                >
                  {grade}
                </span>
                <span className="text-sm text-gray-600">{count} students</span>
              </div>
              <div className="text-sm text-gray-500">
                {Math.round((count / totalStudents) * 100)}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chapter Performance */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Chapter Performance
        </h3>
        <div className="space-y-3">
          {["Number", "Algebra", "Geometry", "Statistics"].map(
            (chapterName) => {
              const chapterStudents = students.filter((s) =>
                s.chapters.some((c) => c.name === chapterName)
              );
              const avgProgress =
                chapterStudents.reduce((acc, s) => {
                  const chapter = s.chapters.find(
                    (c) => c.name === chapterName
                  );
                  return acc + (chapter?.progress || 0);
                }, 0) / chapterStudents.length;

              return (
                <div
                  key={chapterName}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm font-medium text-gray-700">
                    {chapterName}
                  </span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                        style={{ width: `${avgProgress}%` }}
                      ></div>
                    </div>
                    <span
                      className={`text-sm font-medium ${getProgressColor(
                        avgProgress
                      )}`}
                    >
                      {Math.round(avgProgress)}%
                    </span>
                  </div>
                </div>
              );
            }
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h3>
        <div className="space-y-3">
          <button className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
            <div className="font-medium text-blue-900">
              Generate Progress Report
            </div>
            <div className="text-sm text-blue-600">
              Export class performance data
            </div>
          </button>
          <button className="w-full text-left p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
            <div className="font-medium text-green-900">
              Schedule Assessment
            </div>
            <div className="text-sm text-green-600">Plan next class test</div>
          </button>
          <button className="w-full text-left p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
            <div className="font-medium text-purple-900">
              Identify Weak Areas
            </div>
            <div className="text-sm text-purple-600">
              Find topics needing focus
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentScoreOverview;
