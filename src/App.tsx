import { useState, useEffect } from 'react';
import { Plus, GraduationCap, Users, Award, TrendingUp } from 'lucide-react';
import { supabase } from './lib/supabase';
import StudentList from './components/StudentList';
import StudentForm, { StudentFormData } from './components/StudentForm';
import type { Student } from './types/database';

function App() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      setError(null);
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setStudents(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load students');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddStudent = async (formData: StudentFormData) => {
    const { error } = await supabase
      .from('students')
      .insert([formData]);

    if (error) throw error;
    await loadStudents();
    setShowForm(false);
  };

  const handleUpdateStudent = async (formData: StudentFormData) => {
    if (!editingStudent) return;

    const { error } = await supabase
      .from('students')
      .update(formData)
      .eq('id', editingStudent.id);

    if (error) throw error;
    await loadStudents();
    setEditingStudent(null);
    setShowForm(false);
  };

  const handleDeleteStudent = async (id: string) => {
    const { error } = await supabase
      .from('students')
      .delete()
      .eq('id', id);

    if (error) {
      alert('Failed to delete student');
      return;
    }
    await loadStudents();
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingStudent(null);
  };

  const stats = {
    total: students.length,
    avgGpa: students.length > 0
      ? (students.reduce((sum, s) => sum + s.gpa, 0) / students.length).toFixed(2)
      : '0.00',
    honorsStudents: students.filter(s => s.gpa >= 3.5).length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-3 rounded-lg">
                <GraduationCap className="text-white" size={32} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Student Management</h1>
                <p className="text-gray-600 mt-1">Manage and track student information</p>
              </div>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
            >
              <Plus size={20} />
              Add Student
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Total Students</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Users className="text-blue-600" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Average GPA</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.avgGpa}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <TrendingUp className="text-green-600" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Honors Students</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.honorsStudents}</p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-lg">
                  <Award className="text-yellow-600" size={24} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          {error && (
            <div className="p-4 bg-red-50 border-b border-red-200">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <div className="p-6">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="text-gray-600 mt-4">Loading students...</p>
              </div>
            ) : (
              <StudentList
                students={students}
                onEdit={handleEdit}
                onDelete={handleDeleteStudent}
              />
            )}
          </div>
        </div>
      </div>

      {showForm && (
        <StudentForm
          student={editingStudent}
          onSubmit={editingStudent ? handleUpdateStudent : handleAddStudent}
          onCancel={handleCloseForm}
        />
      )}
    </div>
  );
}

export default App;
