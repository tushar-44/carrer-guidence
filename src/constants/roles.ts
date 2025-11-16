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
