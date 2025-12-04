/*
  # Student Management System - Initial Schema

  1. New Tables
    - `students`
      - `id` (uuid, primary key) - Unique identifier for each student
      - `student_id` (text, unique) - Student identification number
      - `name` (text) - Full name of the student
      - `email` (text, unique) - Student email address
      - `major` (text) - Field of study
      - `year` (integer) - Academic year (1-4 for undergraduate)
      - `gpa` (numeric) - Grade point average (0.0 - 4.0)
      - `created_at` (timestamptz) - Record creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on `students` table
    - Add policies for public access (SELECT, INSERT, UPDATE, DELETE)
    
  ## Important Notes
  
  1. Public Access: This demo allows public access to all operations.
     In production, you should implement authentication and restrict
     access based on user roles (admin, teacher, student).
  
  2. Data Validation: Consider adding check constraints for:
     - GPA range validation
     - Year range validation
     - Email format validation
*/

CREATE TABLE IF NOT EXISTS students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id text UNIQUE NOT NULL,
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  major text NOT NULL DEFAULT '',
  year integer NOT NULL DEFAULT 1,
  gpa numeric(3, 2) DEFAULT 0.00,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add check constraints for data validation
ALTER TABLE students 
  ADD CONSTRAINT check_gpa_range CHECK (gpa >= 0.00 AND gpa <= 4.00),
  ADD CONSTRAINT check_year_range CHECK (year >= 1 AND year <= 4);

-- Enable Row Level Security
ALTER TABLE students ENABLE ROW LEVEL SECURITY;

-- Public access policies for demo purposes
CREATE POLICY "Allow public to view students"
  ON students FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public to insert students"
  ON students FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public to update students"
  ON students FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public to delete students"
  ON students FOR DELETE
  TO public
  USING (true);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_students_email ON students(email);
CREATE INDEX IF NOT EXISTS idx_students_student_id ON students(student_id);
CREATE INDEX IF NOT EXISTS idx_students_name ON students(name);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the function on update
CREATE TRIGGER update_students_updated_at
  BEFORE UPDATE ON students
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();