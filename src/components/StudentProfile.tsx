import React, { useState } from "react";
import type { Student, AssessmentResult, MathChapter } from "../types/index";

interface StudentProfileProps {
  student: Student;
  onClose: () => void;
  onUpdateStudent: (updatedStudent: Student) => void;
}

const StudentProfile: React.FC<StudentProfileProps> = ({
  student,
  onClose,
  onUpdateStudent,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: student.name,
    email: student.email,
    targetGrade: student.targetGrade,
  });

  const handleSave = () => {
    const updatedStudent = {
      ...student,
      ...editForm,
    };
    onUpdateStudent(updatedStudent);
    setIsEditing(false);
  };

  const getGradeColor = (grade: string) => {
    if (grade.includes("A_STAR")) return "bg-purple-100 text-purple-800";
    if (grade.includes("A")) return "bg-blue-100 text-blue-800";
    if (grade.includes("B")) return "bg-green-100 text-green-800";
    if (grade.includes("C")) return "bg-yellow-100 text-yellow-800";
    if (grade.includes("D")) return "bg-orange-100 text-orange-800";
    return "bg-red-100 text-red-800";
  };

  const getMasteryColor = (mastery: string) => {
    switch (mastery) {
      case "Advanced":
      case "Mastered":
        return "bg-green-100 text-green-800";
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "Beginner":
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

  // Calculate strengths and weaknesses
  const strengths = student.chapters
    .filter((c) => c.progress >= 80)
    .sort((a, b) => b.progress - a.progress);

  const weaknesses = student.chapters
    .filter((c) => c.progress < 60)
    .sort((a, b) => a.progress - b.progress);

  // Mock upcoming activities
  const upcomingActivities = [
    {
      id: 1,
      type: "Test",
      subject: "Algebra",
      date: "2024-02-15",
      time: "09:00 AM",
      duration: "1 hour",
      location: "Room 201",
    },
    {
      id: 2,
      type: "Homework",
      subject: "Geometry",
      date: "2024-02-12",
      time: "Due",
      duration: "2 hours",
      location: "Online",
    },
    {
      id: 3,
      type: "Practice",
      subject: "Statistics",
      date: "2024-02-10",
      time: "Optional",
      duration: "1 hour",
      location: "Math Lab",
    },
  ];

  // Mock recent activity
  const recentActivity = [
    {
      id: 1,
      type: "Assessment",
      description: "Completed Number chapter quiz",
      score: 85,
      date: "2024-01-15",
      time: "2:30 PM",
    },
    {
      id: 2,
      type: "Study",
      description: "Reviewed Algebra formulas",
      duration: "45 min",
      date: "2024-01-14",
      time: "4:15 PM",
    },
    {
      id: 3,
      type: "Practice",
      description: "Solved 20 geometry problems",
      score: 75,
      date: "2024-01-13",
      time: "3:00 PM",
    },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-3xl font-bold">
                {student.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div>
                <h1 className="text-3xl font-bold">{student.name}</h1>
                <p className="text-blue-100">{student.email}</p>
                <div className="flex items-center space-x-3 mt-2">
                  <span className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm">
                    {student.grade}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${getGradeColor(
                      student.currentGrade
                    )}`}
                  >
                    Current: {student.currentGrade}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${getGradeColor(
                      student.targetGrade
                    )}`}
                  >
                    Target: {student.targetGrade}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-all"
              >
                {isEditing ? "Cancel" : "Edit"}
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Edit Form */}
          {isEditing && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold mb-4">Edit Profile</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm({ ...editForm, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) =>
                      setEditForm({ ...editForm, email: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Target Grade
                  </label>
                  <select
                    value={editForm.targetGrade}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        targetGrade: e.target.value as any,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="U">U</option>
                    <option value="G">G</option>
                    <option value="F">F</option>
                    <option value="E">E</option>
                    <option value="D">D</option>
                    <option value="C">C</option>
                    <option value="B">B</option>
                    <option value="A">A</option>
                    <option value="A_STAR">A*</option>
                  </select>
                </div>
              </div>
              <div className="mt-4">
                <button
                  onClick={handleSave}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Performance & Chapters */}
            <div className="lg:col-span-2 space-y-6">
              {/* Performance Overview */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Performance Overview
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">
                      {Math.round(
                        student.chapters.reduce(
                          (sum, c) => sum + c.progress,
                          0
                        ) / student.chapters.length
                      )}
                      %
                    </div>
                    <div className="text-sm text-gray-600">
                      Overall Progress
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">
                      {
                        student.chapters.filter(
                          (c) =>
                            c.mastery === "Advanced" || c.mastery === "Mastered"
                        ).length
                      }
                    </div>
                    <div className="text-sm text-gray-600">Strong Areas</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-600">
                      {
                        student.chapters.filter(
                          (c) => c.mastery === "Intermediate"
                        ).length
                      }
                    </div>
                    <div className="text-sm text-gray-600">Developing</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-600">
                      {
                        student.chapters.filter((c) => c.mastery === "Beginner")
                          .length
                      }
                    </div>
                    <div className="text-sm text-gray-600">Needs Focus</div>
                  </div>
                </div>
              </div>

              {/* Chapter Progress */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Chapter Progress
                </h2>
                <div className="space-y-4">
                  {student.chapters.map((chapter) => (
                    <div
                      key={chapter.id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {chapter.name}
                        </h3>
                        <span
                          className={`px-3 py-1 text-sm font-medium rounded-full ${getMasteryColor(
                            chapter.mastery
                          )}`}
                        >
                          {chapter.mastery}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Progress</span>
                        <span
                          className={`text-sm font-medium ${getProgressColor(
                            chapter.progress
                          )}`}
                        >
                          {chapter.progress}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
                          style={{ width: `${chapter.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Assessments */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Recent Assessments
                </h2>
                <div className="space-y-3">
                  {student.recentAssessments.map((assessment) => (
                    <div
                      key={assessment.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <div className="font-medium text-gray-900">
                          {assessment.chapter}
                        </div>
                        <div className="text-sm text-gray-600">
                          {assessment.type} • {assessment.date}
                        </div>
                      </div>
                      <div
                        className={`px-3 py-1 text-sm font-medium rounded-full ${
                          assessment.score >= 80
                            ? "bg-green-100 text-green-800"
                            : assessment.score >= 60
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {assessment.score}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Strengths, Weaknesses, Activity, Upcoming */}
            <div className="space-y-6">
              {/* Strengths */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <svg
                    className="w-5 h-5 text-green-600 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Strengths
                </h3>
                <div className="space-y-2">
                  {strengths.length > 0 ? (
                    strengths.map((chapter) => (
                      <div
                        key={chapter.id}
                        className="flex items-center justify-between p-2 bg-green-50 rounded-lg"
                      >
                        <span className="text-sm font-medium text-green-800">
                          {chapter.name}
                        </span>
                        <span className="text-sm text-green-600">
                          {chapter.progress}%
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No strong areas yet</p>
                  )}
                </div>
              </div>

              {/* Weaknesses */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <svg
                    className="w-5 h-5 text-red-600 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                  Areas for Improvement
                </h3>
                <div className="space-y-2">
                  {weaknesses.length > 0 ? (
                    weaknesses.map((chapter) => (
                      <div
                        key={chapter.id}
                        className="flex items-center justify-between p-2 bg-red-50 rounded-lg"
                      >
                        <span className="text-sm font-medium text-red-800">
                          {chapter.name}
                        </span>
                        <span className="text-sm text-red-600">
                          {chapter.progress}%
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">
                      All areas are strong!
                    </p>
                  )}
                </div>
              </div>

              {/* Upcoming Activities */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <svg
                    className="w-5 h-5 text-blue-600 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  Upcoming
                </h3>
                <div className="space-y-3">
                  {upcomingActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className="p-3 bg-blue-50 rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-blue-900">
                          {activity.type}
                        </span>
                        <span className="text-xs text-blue-600">
                          {activity.date}
                        </span>
                      </div>
                      <div className="text-sm text-blue-800">
                        {activity.subject}
                      </div>
                      <div className="text-xs text-blue-600 mt-1">
                        {activity.time} • {activity.duration}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <svg
                    className="w-5 h-5 text-purple-600 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  Recent Activity
                </h3>
                <div className="space-y-3">
                  {recentActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className="p-3 bg-purple-50 rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-purple-900">
                          {activity.type}
                        </span>
                        <span className="text-xs text-purple-600">
                          {activity.date}
                        </span>
                      </div>
                      <div className="text-sm text-purple-800">
                        {activity.description}
                      </div>
                      {activity.score && (
                        <div className="text-xs text-purple-600 mt-1">
                          Score: {activity.score}%
                        </div>
                      )}
                      {activity.duration && (
                        <div className="text-xs text-purple-600 mt-1">
                          Duration: {activity.duration}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
