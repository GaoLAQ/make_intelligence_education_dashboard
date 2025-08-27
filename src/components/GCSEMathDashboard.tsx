import React, { useState } from "react";
import Header from "./Header";
import StudentScoreOverview from "./StudentScoreOverview";
import ChapterTreeDiagram from "./ChapterTreeDiagram";
import StudentList from "./StudentList";
import AddStudentModal from "./AddStudentModal";
import StudentProfile from "./StudentProfile";
import type {
  Student,
  MathChapter,
  SkillLevel,
  AssessmentResult,
} from "../types/index";

const GCSEMathDashboard: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([
    {
      id: 1,
      name: "JoAnn Lu",
      grade: "Year 10",
      email: "alice.johnson@school.edu",
      targetGrade: "A_STAR",
      currentGrade: "B",
      chapters: [
        { id: 1, name: "Number", progress: 85, mastery: "Advanced" },
        { id: 2, name: "Algebra", progress: 72, mastery: "Intermediate" },
        { id: 3, name: "Geometry", progress: 68, mastery: "Intermediate" },
        { id: 4, name: "Statistics", progress: 45, mastery: "Beginner" },
      ],
      recentAssessments: [
        {
          id: 1,
          chapter: "Number",
          score: 85,
          date: "2024-01-15",
          type: "Quiz",
        },
        {
          id: 2,
          chapter: "Algebra",
          score: 72,
          date: "2024-01-10",
          type: "Test",
        },
        {
          id: 3,
          chapter: "Geometry",
          score: 68,
          date: "2024-01-05",
          type: "Homework",
        },
      ],
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<MathChapter | null>(
    null
  );
  const [showProfile, setShowProfile] = useState(false);

  const addStudent = (student: Omit<Student, "id">) => {
    const newStudent = {
      ...student,
      id: Math.max(...students.map((s) => s.id)) + 1,
    };
    setStudents([...students, newStudent]);
    setShowAddModal(false);
  };

  const updateStudentChapter = (
    studentId: number,
    chapterId: number,
    progress: number,
    mastery: SkillLevel
  ) => {
    setStudents(
      students.map((student) => {
        if (student.id === studentId) {
          return {
            ...student,
            chapters: student.chapters.map((chapter) =>
              chapter.id === chapterId
                ? { ...chapter, progress, mastery }
                : chapter
            ),
          };
        }
        return student;
      })
    );
  };

  const addAssessment = (
    studentId: number,
    assessment: Omit<AssessmentResult, "id">
  ) => {
    const newAssessment = {
      ...assessment,
      id:
        Math.max(
          ...students.flatMap((s) => s.recentAssessments).map((a) => a.id)
        ) + 1,
    };

    setStudents(
      students.map((student) => {
        if (student.id === studentId) {
          return {
            ...student,
            recentAssessments: [
              newAssessment,
              ...student.recentAssessments.slice(0, 2),
            ],
          };
        }
        return student;
      })
    );
  };

  const updateStudent = (updatedStudent: Student) => {
    setStudents(
      students.map((student) =>
        student.id === updatedStudent.id ? updatedStudent : student
      )
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header onAddStudent={() => setShowAddModal(true)} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Student Overview */}
          <div className="lg:col-span-1 space-y-6">
            <StudentScoreOverview students={students} />
          </div>

          {/* Right Column - Chapter Tree and Student List */}
          <div className="lg:col-span-2 space-y-8">
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
              onUpdateChapter={updateStudentChapter}
              onAddAssessment={addAssessment}
              selectedChapter={selectedChapter}
            />
          </div>
        </div>
      </div>

      {showAddModal && (
        <AddStudentModal
          onClose={() => setShowAddModal(false)}
          onAddStudent={addStudent}
        />
      )}

      {showProfile && selectedStudent && (
        <StudentProfile
          student={selectedStudent}
          onClose={() => setShowProfile(false)}
          onUpdateStudent={updateStudent}
        />
      )}
    </div>
  );
};

export default GCSEMathDashboard;
