import { Edit2, Trash2, GraduationCap } from 'lucide-react';
import type { Student } from '../types/database';

interface StudentListProps {
  students: Student[];
  onEdit: (student: Student) => void;
  onDelete: (id: string) => void;
}

export default function StudentList({ students, onEdit, onDelete }: StudentListProps) {
  const getGpaColor = (gpa: number) => {
    if (gpa >= 3.5) return 'text-green-700 bg-green-50';
    if (gpa >= 3.0) return 'text-blue-700 bg-blue-50';
    if (gpa >= 2.5) return 'text-yellow-700 bg-yellow-50';
    return 'text-red-700 bg-red-50';
  };

  if (students.length === 0) {
    return (
      <div className="text-center py-12">
        <GraduationCap className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No students yet</h3>
        <p className="text-gray-500">Get started by adding your first student.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Student ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Major
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Year
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              GPA
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {students.map((student) => (
            <tr key={student.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {student.student_id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {student.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {student.email}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {student.major}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                Year {student.year}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getGpaColor(student.gpa)}`}>
                  {student.gpa.toFixed(2)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => onEdit(student)}
                  className="text-blue-600 hover:text-blue-900 mr-4 transition-colors"
                  title="Edit student"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Are you sure you want to delete ${student.name}?`)) {
                      onDelete(student.id);
                    }
                  }}
                  className="text-red-600 hover:text-red-900 transition-colors"
                  title="Delete student"
                >
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
