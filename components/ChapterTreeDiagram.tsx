"use client";

import type { MathChapter, Student } from "@/lib/types";

interface ChapterTreeDiagramProps {
  students: Student[];
  onChapterSelect: (chapter: MathChapter | null) => void;
  selectedChapter: MathChapter | null;
}

const gcseChapters = [
  {
    id: 1,
    name: "Number",
    description: "Number operations, fractions, decimals, percentages",
    difficulty: "Both",
    weightage: 25,
    subtopics: [
      "Place Value & Ordering",
      "Fractions & Decimals",
      "Percentages",
      "Ratio & Proportion",
      "Powers & Roots",
      "Standard Form",
    ],
    examQuestions: 8,
    estimatedHours: 40,
  },
  {
    id: 2,
    name: "Algebra",
    description: "Expressions, equations, sequences, graphs",
    difficulty: "Both",
    weightage: 30,
    subtopics: [
      "Expressions & Formulae",
      "Linear Equations",
      "Quadratic Equations",
      "Sequences",
      "Graphs & Functions",
      "Inequalities",
    ],
    examQuestions: 10,
    estimatedHours: 50,
  },
  {
    id: 3,
    name: "Geometry",
    description: "Shapes, angles, area, volume, transformations",
    difficulty: "Both",
    weightage: 25,
    subtopics: [
      "Angles & Polygons",
      "Pythagoras & Trigonometry",
      "Area & Perimeter",
      "Volume & Surface Area",
      "Transformations",
      "Constructions",
    ],
    examQuestions: 8,
    estimatedHours: 45,
  },
  {
    id: 4,
    name: "Statistics",
    description: "Data handling, probability, averages",
    difficulty: "Both",
    weightage: 20,
    subtopics: [
      "Data Collection",
      "Averages & Range",
      "Charts & Graphs",
      "Probability",
      "Correlation",
      "Sampling",
    ],
    examQuestions: 6,
    estimatedHours: 35,
  },
] as const;

const getMasteryColor = (mastery: string) => {
  switch (mastery) {
    case "Advanced":
      return "bg-green-100 text-green-800 border-green-200";
    case "Intermediate":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "Beginner":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "Foundation":
      return "bg-blue-100 text-blue-800";
    case "Higher":
      return "bg-purple-100 text-purple-800";
    case "Both":
      return "bg-indigo-100 text-indigo-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function ChapterTreeDiagram({
  students,
  onChapterSelect,
  selectedChapter,
}: ChapterTreeDiagramProps) {
  const getChapterProgress = (chapterName: string) => {
    const chapterStudents = students.filter((student) =>
      student.chapters.some((chapter) => chapter.name === chapterName)
    );

    if (chapterStudents.length === 0) {
      return 0;
    }

    return (
      chapterStudents.reduce((accumulator, student) => {
        const chapter = student.chapters.find(
          (currentChapter) => currentChapter.name === chapterName
        );
        return accumulator + (chapter?.progress ?? 0);
      }, 0) / chapterStudents.length
    );
  };

  const getMasteryLevel = (chapterName: string) => {
    const chapterStudents = students.filter((student) =>
      student.chapters.some((chapter) => chapter.name === chapterName)
    );

    if (chapterStudents.length === 0) {
      return "Beginner";
    }

    const advancedCount = chapterStudents.filter((student) => {
      const chapter = student.chapters.find(
        (currentChapter) => currentChapter.name === chapterName
      );
      return (
        chapter?.mastery === "Advanced" || chapter?.mastery === "Mastered"
      );
    }).length;

    const percentage = (advancedCount / chapterStudents.length) * 100;

    if (percentage >= 70) return "Advanced";
    if (percentage >= 40) return "Intermediate";
    return "Beginner";
  };

  return (
    <div className="rounded-xl bg-white p-6 shadow-lg">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          GCSE Math Chapter Tree
        </h2>
        <div className="text-sm text-gray-600">Click chapters to view details</div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {gcseChapters.map((chapter) => {
          const progress = getChapterProgress(chapter.name);
          const mastery = getMasteryLevel(chapter.name);
          const isSelected = selectedChapter?.name === chapter.name;

          return (
            <div
              key={chapter.id}
              className={`relative cursor-pointer rounded-xl border-2 p-6 transition-all duration-200 hover:shadow-lg ${
                isSelected
                  ? "border-blue-500 bg-blue-50 shadow-lg"
                  : "border-gray-200 hover:border-blue-300"
              }`}
              onClick={() =>
                onChapterSelect(
                  isSelected
                    ? null
                    : {
                        id: chapter.id,
                        name: chapter.name,
                        progress,
                        mastery: mastery as MathChapter["mastery"],
                      }
                )
              }
            >
              <div className="mb-4 flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="mb-2 text-xl font-bold text-gray-900">
                    {chapter.name}
                  </h3>
                  <p className="mb-3 text-sm text-gray-600">
                    {chapter.description}
                  </p>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${getDifficultyColor(
                      chapter.difficulty
                    )}`}
                  >
                    {chapter.difficulty}
                  </span>
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-medium ${getMasteryColor(
                      mastery
                    )}`}
                  >
                    {mastery}
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    Average Progress
                  </span>
                  <span className="text-sm font-semibold text-blue-600">
                    {Math.round(progress)}%
                  </span>
                </div>
                <div className="h-2 rounded-full bg-gray-200">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
                <div className="rounded-lg bg-gray-50 p-3">
                  <p className="font-medium text-gray-700">Exam Weightage</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {chapter.weightage}%
                  </p>
                </div>
                <div className="rounded-lg bg-gray-50 p-3">
                  <p className="font-medium text-gray-700">Estimated Hours</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {chapter.estimatedHours}
                  </p>
                </div>
                <div className="col-span-2 rounded-lg bg-blue-50 p-3">
                  <p className="mb-2 text-sm font-medium text-blue-900">
                    Key Subtopics
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {chapter.subtopics.map((topic) => (
                      <span
                        key={topic}
                        className="rounded-full bg-white px-3 py-1 text-xs font-medium text-blue-700 shadow-sm"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
