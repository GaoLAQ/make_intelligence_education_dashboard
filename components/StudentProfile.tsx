"use client";

import { useState } from "react";
import type { Student } from "@/lib/types";

interface StudentProfileProps {
  student: Student;
  onClose: () => void;
  onUpdateStudent: (updatedStudent: Student) => Promise<void>;
}

const getGradeColor = (grade: string) => {
  if (grade.includes("A_STAR")) return "bg-purple-100 text-purple-800";
  if (grade.includes("A")) return "bg-blue-100 text-blue-800";
  if (grade.includes("B")) return "bg-green-100 text-green-800";
  if (grade.includes("C")) return "bg-yellow-100 text-yellow-800";
  if (grade.includes("D")) return "bg-orange-100 text-orange-800";
  return "bg-red-100 text-red-800";
};

const getProgressColor = (progress: number) => {
  if (progress >= 80) return "text-green-600";
  if (progress >= 60) return "text-yellow-600";
  return "text-red-600";
};

export default function StudentProfile({
  student,
  onClose,
  onUpdateStudent,
}: StudentProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: student.name,
    email: student.email,
    targetGrade: student.targetGrade,
  });

  const handleSave = async () => {
    const updatedStudent = {
      ...student,
      ...editForm,
    };
    await onUpdateStudent(updatedStudent);
    setIsEditing(false);
  };

  const strengths = student.chapters
    .filter((chapter) => chapter.progress >= 80)
    .sort((a, b) => b.progress - a.progress);

  const weaknesses = student.chapters
    .filter((chapter) => chapter.progress < 60)
    .sort((a, b) => a.progress - b.progress);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="max-h-[90vh] w-full max-w-6xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="rounded-t-2xl bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white bg-opacity-20 text-3xl font-bold text-white">
                {student.name
                  .split(" ")
                  .map((name) => name[0])
                  .join("")}
              </div>
              <div>
                <h1 className="text-3xl font-bold">{student.name}</h1>
                <p className="text-blue-100">{student.email}</p>
                <div className="mt-2 flex items-center space-x-3">
                  <span className="rounded-full bg-white bg-opacity-20 px-3 py-1 text-sm">
                    {student.grade}
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 text-sm ${getGradeColor(
                      student.currentGrade
                    )}`}
                  >
                    Current: {student.currentGrade}
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 text-sm ${getGradeColor(
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
                className="rounded-lg bg-white bg-opacity-20 px-4 py-2 transition-all hover:bg-opacity-30"
              >
                {isEditing ? "Cancel" : "Edit"}
              </button>
              <button
                onClick={onClose}
                className="rounded-lg bg-white bg-opacity-20 px-4 py-2 transition-all hover:bg-opacity-30"
              >
                Close
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          {isEditing && (
            <div className="mb-6 rounded-lg bg-gray-50 p-4">
              <h3 className="mb-4 text-lg font-semibold">Edit Profile</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(event) =>
                      setEditForm({ ...editForm, name: event.target.value })
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(event) =>
                      setEditForm({ ...editForm, email: event.target.value })
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Target Grade
                  </label>
                  <select
                    value={editForm.targetGrade}
                    onChange={(event) =>
                      setEditForm({
                        ...editForm,
                        targetGrade: event.target.value as Student["targetGrade"],
                      })
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
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
              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleSave}
                  className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">
                  Chapter Performance
                </h3>
                <div className="space-y-3">
                  {student.chapters.map((chapter) => (
                    <div
                      key={chapter.id}
                      className="rounded-lg border border-gray-200 p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-base font-semibold text-gray-900">
                            {chapter.name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            Mastery: {chapter.mastery}
                          </p>
                        </div>
                        <div className="text-right">
                          <span
                            className={`text-xl font-bold ${getProgressColor(
                              chapter.progress
                            )}`}
                          >
                            {chapter.progress}%
                          </span>
                        </div>
                      </div>
                      <div className="mt-3 h-2 rounded-full bg-gray-200">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                          style={{ width: `${chapter.progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">
                  Recent Activity
                </h3>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start">
                      <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                        {activity.type[0]}
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900">
                          {activity.description}
                        </h4>
                        <p className="text-xs text-gray-500">
                          {activity.date} • {activity.time}
                        </p>
                        {"score" in activity && (
                          <p className="text-xs text-gray-600">
                            Score: {activity.score}%
                          </p>
                        )}
                        {"duration" in activity && (
                          <p className="text-xs text-gray-600">
                            Duration: {activity.duration}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">
                  Strengths
                </h3>
                <div className="space-y-3">
                  {strengths.length > 0 ? (
                    strengths.map((chapter) => (
                      <div
                        key={chapter.id}
                        className="rounded-lg bg-green-50 p-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-green-800">
                            {chapter.name}
                          </span>
                          <span className="text-sm font-bold text-green-700">
                            {chapter.progress}%
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-600">
                      No strengths identified yet.
                    </p>
                  )}
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">
                  Focus Areas
                </h3>
                <div className="space-y-3">
                  {weaknesses.length > 0 ? (
                    weaknesses.map((chapter) => (
                      <div key={chapter.id} className="rounded-lg bg-red-50 p-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-red-800">
                            {chapter.name}
                          </span>
                          <span className="text-sm font-bold text-red-700">
                            {chapter.progress}%
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-600">
                      No focus areas identified.
                    </p>
                  )}
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">
                  Upcoming Activities
                </h3>
                <div className="space-y-3">
                  {upcomingActivities.map((activity) => (
                    <div key={activity.id} className="rounded-lg bg-blue-50 p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-blue-800">
                          {activity.subject}
                        </span>
                        <span className="text-xs text-blue-700">
                          {activity.type}
                        </span>
                      </div>
                      <div className="mt-1 text-xs text-blue-700">
                        {activity.date} • {activity.time}
                      </div>
                      <div className="text-xs text-blue-600">
                        {activity.duration} • {activity.location}
                      </div>
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
}
