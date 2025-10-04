"use client";

interface HeaderProps {
  onAddStudent: () => void;
}

export default function Header({ onAddStudent }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-6 sm:px-6 lg:px-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            GCSE Mathematics Dashboard
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Track student progress, mastery, and assessments across the GCSE
            mathematics curriculum.
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <button className="rounded-lg border border-gray-200 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50">
            Export Report
          </button>
          <button
            onClick={onAddStudent}
            className="rounded-lg bg-blue-600 px-5 py-2 font-semibold text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-xl"
          >
            Add Student
          </button>
        </div>
      </div>
    </header>
  );
}
