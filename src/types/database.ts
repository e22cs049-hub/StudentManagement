export interface Database {
  public: {
    Tables: {
      students: {
        Row: {
          id: string;
          student_id: string;
          name: string;
          email: string;
          major: string;
          year: number;
          gpa: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          name: string;
          email: string;
          major?: string;
          year?: number;
          gpa?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          name?: string;
          email?: string;
          major?: string;
          year?: number;
          gpa?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

export type Student = Database['public']['Tables']['students']['Row'];
