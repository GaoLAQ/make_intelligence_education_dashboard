"use client";

import { useEffect, useMemo, useState } from "react";
import AddStudentModal from "@/components/AddStudentModal";
import ChapterTreeDiagram from "@/components/ChapterTreeDiagram";
import Header from "@/components/Header";
import StudentList from "@/components/StudentList";
import StudentProfile from "@/components/StudentProfile";
import StudentScoreOverview from "@/components/StudentScoreOverview";
import { useStudentStore } from "@/lib/useStudents";
import type {
  AssessmentResult,
  MathChapter,
  Student,
} from "@/lib/types";

export default function GCSEMathDashboard() {
  const {
    students,
    addStudent,
    updateStudent,
    updateStudentChapter,
    addAssessment,
  } = useStudentStore();

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<MathChapter | null>(
    null
  );
  const [showProfile, setShowProfile] = useState(false);

  const studentsById = useMemo(() => {
    return new Map(students.map((student) => [student.id, student]));
  }, [students]);

  useEffect(() => {
    if (!selectedStudent) {
      return;
    }

    const updated = studentsById.get(selectedStudent.id);
    if (updated && updated !== selectedStudent) {
      setSelectedStudent(updated);
    }
  }, [selectedStudent, studentsById]);

  useEffect(() => {
    if (!selectedChapter) {
      return;
    }

    const chapterFromStore = students
      .flatMap((student) => student.chapters)
      .find((chapter) => chapter.id === selectedChapter.id);

    if (chapterFromStore && chapterFromStore !== selectedChapter) {
      setSelectedChapter(chapterFromStore);
    }
  }, [selectedChapter, students]);

  const handleAddStudent = async (student: Omit<Student, "id">) => {
    await addStudent(student);
  };

  const handleUpdateStudent = async (updatedStudent: Student) => {
    await updateStudent(updatedStudent);
    setSelectedStudent(updatedStudent);
  };

  const handleUpdateChapter = async (
    studentId: number,
    chapterId: number,
    progress: number,
    mastery: MathChapter["mastery"]
  ) => {
    await updateStudentChapter({ studentId, chapterId, progress, mastery });
    setSelectedStudent((current) => {
      if (!current || current.id !== studentId) {
        return current;
      }

      return {
        ...current,
        chapters: current.chapters.map((chapter) =>
          chapter.id === chapterId ? { ...chapter, progress, mastery } : chapter
        ),
      };
    });
  };

  const handleAddAssessment = async (
    studentId: number,
    assessment: Omit<AssessmentResult, "id">
  ) => {
    await addAssessment({ studentId, assessment });
    setSelectedStudent((current) => {
      if (!current || current.id !== studentId) {
        return current;
      }

      const nextId =
        current.recentAssessments.length === 0
          ? 1
          : Math.max(...current.recentAssessments.map((item) => item.id)) + 1;

      return {
        ...current,
        recentAssessments: [
          { ...assessment, id: nextId },
          ...current.recentAssessments.slice(0, 2),
        ],
      };
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header onAddStudent={() => setShowAddModal(true)} />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-1">
            <StudentScoreOverview students={students} />
          </div>

          <div className="space-y-8 lg:col-span-2">
            <ChapterTreeDiagram
              students={students}
              onChapterSelect={setSelectedChapter}
              selectedChapter={selectedChapter}
            />

            <StudentList
              students={students}
              onSelectStudent={(student) => {
                setSelectedStudent(student);
                setShowProfile(true);
              }}
              onUpdateChapter={async (studentId, chapterId, progress, mastery) =>
                handleUpdateChapter(studentId, chapterId, progress, mastery)
              }
              onAddAssessment={async (studentId, assessment) =>
                handleAddAssessment(studentId, assessment)
              }
              selectedChapter={selectedChapter}
            />
          </div>
        </div>
      </div>

      {showAddModal && (
        <AddStudentModal
          onClose={() => setShowAddModal(false)}
          onAddStudent={handleAddStudent}
        />
      )}

      {showProfile && selectedStudent && (
        <StudentProfile
          student={selectedStudent}
          onClose={() => setShowProfile(false)}
          onUpdateStudent={handleUpdateStudent}
        />
      )}
    </div>
  );
}
