import type { Student } from "./types";

export const initialStudents: Student[] = [
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
];
