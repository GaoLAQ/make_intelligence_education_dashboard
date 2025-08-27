import React from "react";
import type { Student, MathChapter } from "../types/index";

interface ChapterTreeDiagramProps {
  students: Student[];
  onChapterSelect: (chapter: MathChapter | null) => void;
  selectedChapter: MathChapter | null;
}

const ChapterTreeDiagram: React.FC<ChapterTreeDiagramProps> = ({
  students,
  onChapterSelect,
  selectedChapter,
}) => {
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
  ];

  const getChapterProgress = (chapterName: string) => {
    const chapterStudents = students.filter((s) =>
      s.chapters.some((c) => c.name === chapterName)
    );
    if (chapterStudents.length === 0) return 0;

    return (
      chapterStudents.reduce((acc, s) => {
        const chapter = s.chapters.find((c) => c.name === chapterName);
        return acc + (chapter?.progress || 0);
      }, 0) / chapterStudents.length
    );
  };

  const getMasteryLevel = (chapterName: string) => {
    const chapterStudents = students.filter((s) =>
      s.chapters.some((c) => c.name === chapterName)
    );
    if (chapterStudents.length === 0) return "Beginner";

    const advancedCount = chapterStudents.filter((s) => {
      const chapter = s.chapters.find((c) => c.name === chapterName);
      return chapter?.mastery === "Advanced" || chapter?.mastery === "Mastered";
    }).length;

    const percentage = (advancedCount / chapterStudents.length) * 100;
    if (percentage >= 70) return "Advanced";
    if (percentage >= 40) return "Intermediate";
    return "Beginner";
  };

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

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          GCSE Math Chapter Tree
        </h2>
        <div className="text-sm text-gray-600">
          Click chapters to view details
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {gcseChapters.map((chapter) => {
          const progress = getChapterProgress(chapter.name);
          const mastery = getMasteryLevel(chapter.name);
          const isSelected = selectedChapter?.name === chapter.name;

          return (
            <div
              key={chapter.id}
              className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-lg ${
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
                        mastery: mastery as any,
                      }
                )
              }
            >
              {/* Chapter Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {chapter.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {chapter.description}
                  </p>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${getDifficultyColor(
                      chapter.difficulty
                    )}`}
                  >
                    {chapter.difficulty}
                  </span>
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${getMasteryColor(
                      mastery
                    )}`}
                  >
                    {mastery}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Class Progress
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {Math.round(progress)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Chapter Stats */}
              <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                <div>
                  <div className="text-lg font-bold text-blue-600">
                    {chapter.weightage}%
                  </div>
                  <div className="text-xs text-gray-600">Exam Weight</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-green-600">
                    {chapter.examQuestions}
                  </div>
                  <div className="text-xs text-gray-600">Questions</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-purple-600">
                    {chapter.estimatedHours}h
                  </div>
                  <div className="text-xs text-gray-600">Study Time</div>
                </div>
              </div>

              {/* Subtopics */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">
                  Key Topics:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {chapter.subtopics.slice(0, 4).map((subtopic, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full"
                    >
                      {subtopic}
                    </span>
                  ))}
                  {chapter.subtopics.length > 4 && (
                    <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
                      +{chapter.subtopics.length - 4} more
                    </span>
                  )}
                </div>
              </div>

              {/* Selection Indicator */}
              {isSelected && (
                <div className="absolute top-4 right-4">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Chapter Tree Legend */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Legend</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-100 border border-green-200 rounded"></div>
            <span>Advanced Mastery</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-100 border border-yellow-200 rounded"></div>
            <span>Intermediate</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-100 border border-red-200 rounded"></div>
            <span>Beginner</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-indigo-100 border border-indigo-200 rounded"></div>
            <span>Foundation & Higher</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChapterTreeDiagram;
