"use client";

import { useState } from "react";
import type {
  AssessmentResult,
  AssessmentType,
  MathChapter,
  SkillLevel,
  Student,
} from "@/lib/types";

interface StudentListProps {
  students: Student[];
  onSelectStudent: (student: Student) => void;
  onUpdateChapter: (
    studentId: number,
    chapterId: number,
    progress: number,
    mastery: SkillLevel
  ) => Promise<void>;
  onAddAssessment: (
    studentId: number,
    assessment: Omit<AssessmentResult, "id">
  ) => Promise<void>;
  selectedChapter: MathChapter | null;
}

const getGradeColor = (grade: string) => {
  if (grade.includes("A_STAR")) return "bg-purple-100 text-purple-800";
  if (grade.includes("A")) return "bg-blue-100 text-blue-800";
  if (grade.includes("B")) return "bg-green-100 text-green-800";
  if (grade.includes("C")) return "bg-yellow-100 text-yellow-800";
  if (grade.includes("D")) return "bg-orange-100 text-orange-800";
  return "bg-red-100 text-red-800";
};

const getMasteryColor = (mastery: SkillLevel) => {
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

export default function StudentList({
  students,
  onSelectStudent,
  onUpdateChapter,
  onAddAssessment,
  selectedChapter,
}: StudentListProps) {
  const [editingStudent, setEditingStudent] = useState<number | null>(null);
  const [editingChapter, setEditingChapter] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({
    progress: 0,
    mastery: "" as SkillLevel,
  });
  const [showAddAssessment, setShowAddAssessment] = useState<number | null>(
    null
  );
  const [assessmentForm, setAssessmentForm] = useState({
    chapter: "",
    score: 0,
    type: "Quiz" as AssessmentType,
    feedback: "",
  });

  const filteredStudents = selectedChapter
    ? students.filter((student) =>
        student.chapters.some((chapter) => chapter.name === selectedChapter.name)
      )
    : students;

  const handleEditChapter = (student: Student, chapter: MathChapter) => {
    setEditingStudent(student.id);
    setEditingChapter(chapter.id);
    setEditForm({ progress: chapter.progress, mastery: chapter.mastery });
  };

  const handleSaveChapter = async (studentId: number, chapterId: number) => {
    if (
      editForm.progress >= 0 &&
      editForm.progress <= 100 &&
      editForm.mastery
    ) {
      await onUpdateChapter(
        studentId,
        chapterId,
        editForm.progress,
        editForm.mastery
      );
      setEditingStudent(null);
      setEditingChapter(null);
    }
  };

  const handleAddAssessment = async (studentId: number) => {
    if (
      assessmentForm.chapter &&
      assessmentForm.score >= 0 &&
      assessmentForm.score <= 100
    ) {
      await onAddAssessment(studentId, {
        chapter: assessmentForm.chapter,
        score: assessmentForm.score,
        type: assessmentForm.type,
        date: new Date().toISOString().split("T")[0],
        feedback: assessmentForm.feedback,
      });
      setShowAddAssessment(null);
      setAssessmentForm({
        chapter: "",
        score: 0,
        type: "Quiz",
        feedback: "",
      });
    }
  };

  return (
    <div className="rounded-xl bg-white shadow-lg">
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Students</h2>
            <p className="text-sm text-gray-600">
              {selectedChapter
                ? `Showing students for ${selectedChapter.name}`
                : "All students"}
            </p>
          </div>
          <div className="text-sm text-gray-500">
            {filteredStudents.length} student
            {filteredStudents.length !== 1 ? "s" : ""}
          </div>
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {filteredStudents.map((student) => (
          <div key={student.id} className="px-6 py-4">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500">
                    <span className="text-lg font-bold text-white">
                      {student.name
                        .split(" ")
                        .map((name) => name[0])
                        .join("")}
                    </span>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {student.name}
                  </h3>
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <span>{student.grade}</span>
                    <span>•</span>
                    <span>{student.email}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`rounded-full px-3 py-1 text-sm font-medium ${getGradeColor(
                        student.currentGrade
                      )}`}
                    >
                      Current: {student.currentGrade}
                    </span>
                    <span
                      className={`rounded-full px-3 py-1 text-sm font-medium ${getGradeColor(
                        student.targetGrade
                      )}`}
                    >
                      Target: {student.targetGrade}
                    </span>
                  </div>
                  <div className="mt-1 text-sm text-gray-500">
                    Overall:{" "}
                    {Math.round(
                      student.chapters.reduce(
                        (sum, chapter) => sum + chapter.progress,
                        0
                      ) / student.chapters.length
                    )}
                    %
                  </div>
                </div>
                <button
                  onClick={() => onSelectStudent(student)}
                  className="rounded-lg border border-blue-100 px-3 py-1 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50"
                >
                  View Profile
                </button>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="mb-3 text-sm font-medium text-gray-700">
                Chapter Progress
              </h4>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {student.chapters.map((chapter) => (
                  <div
                    key={chapter.id}
                    className="rounded-lg border border-gray-200 p-3"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">
                        {chapter.name}
                      </span>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-medium ${getMasteryColor(
                            chapter.mastery
                          )}`}
                        >
                          {chapter.mastery}
                        </span>
                        <button
                          onClick={() => handleEditChapter(student, chapter)}
                          className="text-gray-400 transition-colors hover:text-gray-600"
                        >
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {editingStudent === student.id &&
                    editingChapter === chapter.id ? (
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs font-medium text-gray-600">
                            Progress (%):
                          </label>
                          <input
                            type="number"
                            min={0}
                            max={100}
                            value={editForm.progress}
                            onChange={(event) =>
                              setEditForm({
                                ...editForm,
                                progress: Number(event.target.value),
                              })
                            }
                            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-600">
                            Mastery Level:
                          </label>
                          <select
                            value={editForm.mastery}
                            onChange={(event) =>
                              setEditForm({
                                ...editForm,
                                mastery: event.target.value as SkillLevel,
                              })
                            }
                            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                          >
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                            <option value="Mastered">Mastered</option>
                          </select>
                        </div>
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => {
                              setEditingStudent(null);
                              setEditingChapter(null);
                            }}
                            className="rounded-lg border border-gray-300 px-3 py-1 text-xs text-gray-600 hover:bg-gray-100"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() =>
                              handleSaveChapter(student.id, chapter.id)
                            }
                            className="rounded-lg bg-blue-600 px-3 py-1 text-xs font-semibold text-white hover:bg-blue-700"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="mb-2 flex items-center justify-between">
                          <span
                            className={`text-lg font-semibold ${getProgressColor(
                              chapter.progress
                            )}`}
                          >
                            {chapter.progress}%
                          </span>
                          <span className="text-xs text-gray-500">
                            Mastery: {chapter.mastery}
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-gray-200">
                          <div
                            className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                            style={{ width: `${chapter.progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-3 flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-700">
                  Recent Assessments
                </h4>
                <button
                  onClick={() => setShowAddAssessment(student.id)}
                  className="text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  + Add Assessment
                </button>
              </div>

              {showAddAssessment === student.id && (
                <div className="mb-4 rounded-lg bg-blue-50 p-4">
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
                    <div>
                      <label className="text-xs font-medium text-blue-900">
                        Chapter
                      </label>
                      <input
                        type="text"
                        value={assessmentForm.chapter}
                        onChange={(event) =>
                          setAssessmentForm({
                            ...assessmentForm,
                            chapter: event.target.value,
                          })
                        }
                        className="mt-1 w-full rounded-lg border border-blue-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        placeholder="Enter chapter"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-blue-900">
                        Score (%)
                      </label>
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={assessmentForm.score}
                        onChange={(event) =>
                          setAssessmentForm({
                            ...assessmentForm,
                            score: Number(event.target.value),
                          })
                        }
                        className="mt-1 w-full rounded-lg border border-blue-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-blue-900">
                        Type
                      </label>
                      <select
                        value={assessmentForm.type}
                        onChange={(event) =>
                          setAssessmentForm({
                            ...assessmentForm,
                            type: event.target.value as AssessmentType,
                          })
                        }
                        className="mt-1 w-full rounded-lg border border-blue-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      >
                        <option value="Quiz">Quiz</option>
                        <option value="Test">Test</option>
                        <option value="Homework">Homework</option>
                        <option value="Exam">Exam</option>
                        <option value="Practice">Practice</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-blue-900">
                        Feedback
                      </label>
                      <input
                        type="text"
                        value={assessmentForm.feedback}
                        onChange={(event) =>
                          setAssessmentForm({
                            ...assessmentForm,
                            feedback: event.target.value,
                          })
                        }
                        className="mt-1 w-full rounded-lg border border-blue-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        placeholder="Optional feedback"
                      />
                    </div>
                  </div>
                  <div className="mt-3 flex justify-end space-x-2">
                    <button
                      onClick={() => {
                        setShowAddAssessment(null);
                        setAssessmentForm({
                          chapter: "",
                          score: 0,
                          type: "Quiz",
                          feedback: "",
                        });
                      }}
                      className="rounded-lg border border-blue-200 px-3 py-1 text-xs text-blue-700 hover:bg-blue-100"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleAddAssessment(student.id)}
                      className="rounded-lg bg-blue-600 px-3 py-1 text-xs font-semibold text-white hover:bg-blue-700"
                    >
                      Save Assessment
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {student.recentAssessments.map((assessment) => (
                  <div
                    key={assessment.id}
                    className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3"
                  >
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {assessment.chapter}
                      </p>
                      <p className="text-xs text-gray-500">
                        {assessment.type} • {assessment.date}
                      </p>
                      {assessment.feedback && (
                        <p className="mt-1 text-xs text-gray-600">
                          Feedback: {assessment.feedback}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-blue-600">
                        {assessment.score}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
