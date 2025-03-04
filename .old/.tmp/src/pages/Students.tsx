import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { api } from '../services/api';
import { Student } from '../types';
import StudentList from '../components/students/StudentList';
import StudentForm from '../components/students/StudentForm';
import Modal from '../components/shared/Modal';
import toast from 'react-hot-toast';

export default function Students() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const queryClient = useQueryClient();

  const { data: students, isLoading } = useQuery('students', 
    () => api.get('/students')
  );

  const createStudentMutation = useMutation(
    (newStudent: Partial<Student>) => api.post('/students', newStudent),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('students');
        setIsModalOpen(false);
        toast.success('Student added successfully');
      },
    }
  );

  const updateStudentMutation = useMutation(
    (updatedStudent: Partial<Student>) => 
      api.put(`/students/${updatedStudent.id}`, updatedStudent),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('students');
        setIsModalOpen(false);
        toast.success('Student updated successfully');
      },
    }
  );

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Students</h1>
        <button
          onClick={() => {
            setSelectedStudent(null);
            setIsModalOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          Add Student
        </button>
      </div>

      <StudentList
        students={students?.data}
        isLoading={isLoading}
        onEdit={setSelectedStudent}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedStudent ? 'Edit Student' : 'Add New Student'}
      >
        <StudentForm
          initialData={selectedStudent}
          onSubmit={(data) => {
            if (selectedStudent) {
              updateStudentMutation.mutate({ ...data, id: selectedStudent.id });
            } else {
              createStudentMutation.mutate(data);
            }
          }}
          isLoading={createStudentMutation.isLoading || updateStudentMutation.isLoading}
        />
      </Modal>
    </div>
  );
}