import React, { useState } from "react";
import type {
  Student,
  MathChapter,
  SkillLevel,
  AssessmentResult,
  AssessmentType,
} from "../types/index";

interface StudentListProps {
  students: Student[];
  onSelectStudent: (student: Student) => void;
  onUpdateChapter: (
    studentId: number,
    chapterId: number,
    progress: number,
    mastery: SkillLevel
  ) => void;
  onAddAssessment: (
    studentId: number,
    assessment: Omit<AssessmentResult, "id">
  ) => void;
  selectedChapter: MathChapter | null;
}

const StudentList: React.FC<StudentListProps> = ({
  students,
  onSelectStudent,
  onUpdateChapter,
  onAddAssessment,
  selectedChapter,
}) => {
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
    ? students.filter((s) =>
        s.chapters.some((c) => c.name === selectedChapter.name)
      )
    : students;

  const handleEditChapter = (student: Student, chapter: any) => {
    setEditingStudent(student.id);
    setEditingChapter(chapter.id);
    setEditForm({ progress: chapter.progress, mastery: chapter.mastery });
  };

  const handleSaveChapter = (studentId: number, chapterId: number) => {
    if (
      editForm.progress >= 0 &&
      editForm.progress <= 100 &&
      editForm.mastery
    ) {
      onUpdateChapter(
        studentId,
        chapterId,
        editForm.progress,
        editForm.mastery
      );
      setEditingStudent(null);
      setEditingChapter(null);
    }
  };

  const handleAddAssessment = (studentId: number) => {
    if (
      assessmentForm.chapter &&
      assessmentForm.score >= 0 &&
      assessmentForm.score <= 100
    ) {
      onAddAssessment(studentId, {
        chapter: assessmentForm.chapter,
        score: assessmentForm.score,
        type: assessmentForm.type,
        date: new Date().toISOString().split("T")[0],
        feedback: assessmentForm.feedback,
      });
      setShowAddAssessment(null);
      setAssessmentForm({ chapter: "", score: 0, type: "Quiz", feedback: "" });
    }
  };

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
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "text-green-600";
    if (progress >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="bg-white rounded-xl shadow-lg">
      <div className="px-6 py-4 border-b border-gray-200">
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
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-lg font-bold text-white">
                      {student.name
                        .split(" ")
                        .map((n) => n[0])
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
                      className={`px-3 py-1 text-sm font-medium rounded-full ${getGradeColor(
                        student.currentGrade
                      )}`}
                    >
                      Current: {student.currentGrade}
                    </span>
                    <span
                      className={`px-3 py-1 text-sm font-medium rounded-full ${getGradeColor(
                        student.targetGrade
                      )}`}
                    >
                      Target: {student.targetGrade}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    Overall:{" "}
                    {Math.round(
                      student.chapters.reduce((sum, c) => sum + c.progress, 0) /
                        student.chapters.length
                    )}
                    %
                  </div>
                </div>
              </div>
            </div>

            {/* Chapter Progress */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-3">
                Chapter Progress
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {student.chapters.map((chapter) => (
                  <div
                    key={chapter.id}
                    className="border border-gray-200 rounded-lg p-3"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">
                        {chapter.name}
                      </span>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getMasteryColor(
                            chapter.mastery
                          )}`}
                        >
                          {chapter.mastery}
                        </span>
                        <button
                          onClick={() => handleEditChapter(student, chapter)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <svg
                            className="w-4 h-4"
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
                          <label className="block text-xs text-gray-600 mb-1">
                            Progress (%)
                          </label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={editForm.progress}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                progress: parseInt(e.target.value) || 0,
                              })
                            }
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">
                            Mastery Level
                          </label>
                          <select
                            value={editForm.mastery}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                mastery: e.target.value as SkillLevel,
                              })
                            }
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          >
                            <option value="">Select Level</option>
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                            <option value="Mastered">Mastered</option>
                          </select>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() =>
                              handleSaveChapter(student.id, chapter.id)
                            }
                            className="px-2 py-1 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => {
                              setEditingStudent(null);
                              setEditingChapter(null);
                            }}
                            className="px-2 py-1 text-xs font-medium text-gray-600 bg-gray-200 rounded hover:bg-gray-300"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-gray-600">
                            Progress
                          </span>
                          <span
                            className={`text-xs font-medium ${getProgressColor(
                              chapter.progress
                            )}`}
                          >
                            {chapter.progress}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                            style={{ width: `${chapter.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Assessments */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-gray-700">
                  Recent Assessments
                </h4>
                <button
                  onClick={() =>
                    setShowAddAssessment(
                      showAddAssessment === student.id ? null : student.id
                    )
                  }
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  {showAddAssessment === student.id
                    ? "Cancel"
                    : "+ Add Assessment"}
                </button>
              </div>

              {showAddAssessment === student.id && (
                <div className="bg-gray-50 rounded-lg p-4 mb-3">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">
                        Chapter
                      </label>
                      <select
                        value={assessmentForm.chapter}
                        onChange={(e) =>
                          setAssessmentForm({
                            ...assessmentForm,
                            chapter: e.target.value,
                          })
                        }
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="">Select Chapter</option>
                        {student.chapters.map((c) => (
                          <option key={c.id} value={c.name}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">
                        Score (%)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={assessmentForm.score}
                        onChange={(e) =>
                          setAssessmentForm({
                            ...assessmentForm,
                            score: parseInt(e.target.value) || 0,
                          })
                        }
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">
                        Type
                      </label>
                      <select
                        value={assessmentForm.type}
                        onChange={(e) =>
                          setAssessmentForm({
                            ...assessmentForm,
                            type: e.target.value as AssessmentType,
                          })
                        }
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="Quiz">Quiz</option>
                        <option value="Test">Test</option>
                        <option value="Homework">Homework</option>
                        <option value="Exam">Exam</option>
                        <option value="Practice">Practice</option>
                      </select>
                    </div>
                    <div className="flex items-end">
                      <button
                        onClick={() => handleAddAssessment(student.id)}
                        className="w-full px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex space-x-3 overflow-x-auto">
                {student.recentAssessments.map((assessment, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 bg-gray-50 rounded-lg p-3 min-w-48"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">
                        {assessment.chapter}
                      </span>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          assessment.score >= 80
                            ? "bg-green-100 text-green-800"
                            : assessment.score >= 60
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {assessment.score}%
                      </span>
                    </div>
                    <div className="text-xs text-gray-600">
                      <div>
                        {assessment.type} • {assessment.date}
                      </div>
                      {assessment.feedback && (
                        <div className="mt-1 text-gray-700">
                          {assessment.feedback}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-3 border-t border-gray-200">
              <button
                onClick={() => onSelectStudent(student)}
                className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                View Details
              </button>
              <button className="px-4 py-2 text-sm font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                Generate Report
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentList;
