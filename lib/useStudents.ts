"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { initialStudents } from "./studentData";
import type {
  AssessmentResult,
  SkillLevel,
  Student,
} from "./types";

const STUDENTS_QUERY_KEY = ["students"] as const;

type AddStudentInput = Omit<Student, "id">;

type UpdateChapterInput = {
  studentId: number;
  chapterId: number;
  progress: number;
  mastery: SkillLevel;
};

type AddAssessmentInput = {
  studentId: number;
  assessment: Omit<AssessmentResult, "id">;
};

type UpdateStudentInput = Student;

const resolveNextStudentId = (students: Student[]) => {
  if (students.length === 0) {
    return 1;
  }

  return Math.max(...students.map((student) => student.id)) + 1;
};

export const useStudentStore = () => {
  const queryClient = useQueryClient();

  const { data: students = initialStudents } = useQuery({
    queryKey: STUDENTS_QUERY_KEY,
    queryFn: async () => initialStudents,
    initialData: initialStudents,
  });

  const addStudentMutation = useMutation({
    mutationFn: async (student: AddStudentInput) => student,
    onSuccess: (student) => {
      queryClient.setQueryData<Student[]>(STUDENTS_QUERY_KEY, (current = []) => {
        const nextId = resolveNextStudentId(current);
        return [...current, { ...student, id: nextId }];
      });
    },
  });

  const updateChapterMutation = useMutation({
    mutationFn: async (input: UpdateChapterInput) => input,
    onSuccess: ({ studentId, chapterId, progress, mastery }) => {
      queryClient.setQueryData<Student[]>(STUDENTS_QUERY_KEY, (current = []) =>
        current.map((student) =>
          student.id === studentId
            ? {
                ...student,
                chapters: student.chapters.map((chapter) =>
                  chapter.id === chapterId
                    ? { ...chapter, progress, mastery }
                    : chapter
                ),
              }
            : student
        )
      );
    },
  });

  const addAssessmentMutation = useMutation({
    mutationFn: async (input: AddAssessmentInput) => input,
    onSuccess: ({ studentId, assessment }) => {
      queryClient.setQueryData<Student[]>(STUDENTS_QUERY_KEY, (current = []) =>
        current.map((student) => {
          if (student.id !== studentId) {
            return student;
          }

          const nextId =
            student.recentAssessments.length === 0
              ? 1
              : Math.max(...student.recentAssessments.map((item) => item.id)) + 1;

          return {
            ...student,
            recentAssessments: [
              { ...assessment, id: nextId },
              ...student.recentAssessments.slice(0, 2),
            ],
          };
        })
      );
    },
  });

  const updateStudentMutation = useMutation({
    mutationFn: async (input: UpdateStudentInput) => input,
    onSuccess: (updatedStudent) => {
      queryClient.setQueryData<Student[]>(STUDENTS_QUERY_KEY, (current = []) =>
        current.map((student) =>
          student.id === updatedStudent.id ? { ...updatedStudent } : student
        )
      );
    },
  });

  return useMemo(
    () => ({
      students,
      addStudent: addStudentMutation.mutateAsync,
      updateStudent: updateStudentMutation.mutateAsync,
      updateStudentChapter: updateChapterMutation.mutateAsync,
      addAssessment: addAssessmentMutation.mutateAsync,
    }),
    [
      students,
      addStudentMutation.mutateAsync,
      updateStudentMutation.mutateAsync,
      updateChapterMutation.mutateAsync,
      addAssessmentMutation.mutateAsync,
    ]
  );
};
