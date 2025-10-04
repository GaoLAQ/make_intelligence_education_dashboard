"use client";

import { FormEvent, useState } from "react";
import type { GCSEGrade, Student } from "@/lib/types";

interface AddStudentModalProps {
  onClose: () => void;
  onAddStudent: (student: Omit<Student, "id">) => Promise<void>;
}

export default function AddStudentModal({
  onClose,
  onAddStudent,
}: AddStudentModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    grade: "Year 10",
    email: "",
    targetGrade: "B" as GCSEGrade,
    currentGrade: "C" as GCSEGrade,
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newStudent: Omit<Student, "id"> = {
      name: formData.name,
      grade: formData.grade,
      email: formData.email,
      targetGrade: formData.targetGrade,
      currentGrade: formData.currentGrade,
      chapters: [
        { id: 1, name: "Number", progress: 0, mastery: "Beginner" },
        { id: 2, name: "Algebra", progress: 0, mastery: "Beginner" },
        { id: 3, name: "Geometry", progress: 0, mastery: "Beginner" },
        { id: 4, name: "Statistics", progress: 0, mastery: "Beginner" },
      ],
      recentAssessments: [],
    };

    await onAddStudent(newStudent);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
        <div className="rounded-t-2xl bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Add New Student</h2>
            <button
              onClick={onClose}
              className="text-white transition-colors hover:text-gray-200"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(event) =>
                  setFormData({ ...formData, name: event.target.value })
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter student's full name"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Year Group *
              </label>
              <select
                required
                value={formData.grade}
                onChange={(event) =>
                  setFormData({ ...formData, grade: event.target.value })
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Year 7">Year 7</option>
                <option value="Year 8">Year 8</option>
                <option value="Year 9">Year 9</option>
                <option value="Year 10">Year 10</option>
                <option value="Year 11">Year 11</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(event) =>
                  setFormData({ ...formData, email: event.target.value })
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="student@school.edu"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Current Grade
              </label>
              <select
                value={formData.currentGrade}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    currentGrade: event.target.value as GCSEGrade,
                  })
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
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

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Target Grade *
              </label>
              <select
                required
                value={formData.targetGrade}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    targetGrade: event.target.value as GCSEGrade,
                  })
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
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

          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
            <div className="flex items-start space-x-3">
              <svg
                className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div className="text-sm text-blue-800">
                <p className="font-medium">New students start with:</p>
                <ul className="mt-1 space-y-1">
                  <li>• 0% progress in all GCSE Math chapters</li>
                  <li>• Beginner mastery level across all topics</li>
                  <li>• No assessment history</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-xl"
            >
              Add Student
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
