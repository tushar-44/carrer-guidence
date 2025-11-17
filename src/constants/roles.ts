// User types for the CareerPath platform
export type UserType = 'graduates' | 'mentor' | 'company';

export const userTypes: { value: UserType; label: string; description: string }[] = [
  {
    value: 'graduates',
    label: 'Graduate/Student',
    description: 'Looking for career guidance and mentorship'
  },
  {
    value: 'mentor',
    label: 'Mentor',
    description: 'Experienced professional offering guidance'
  },
  {
    value: 'company',
    label: 'Company Representative',
    description: 'Hiring or representing an organization'
  }
];

// Legacy roles (kept for backward compatibility if needed)
export type Role = 'STUDENT' | 'PARENT' | 'COUNSELOR' | 'ADMIN';

export const roles: { value: Role; label: string; description: string }[] = [
  {
    value: 'STUDENT',
    label: 'Student',
    description: 'Access student-specific features and resources'
  },
  {
    value: 'PARENT',
    label: 'Parent',
    description: 'Monitor and support your child\'s career journey'
  },
  {
    value: 'COUNSELOR',
    label: 'Counselor',
    description: 'Guide students with professional expertise'
  },
  {
    value: 'ADMIN',
    label: 'Admin',
    description: 'Manage platform settings and users'
  }
];
