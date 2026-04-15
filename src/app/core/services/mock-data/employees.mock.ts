import { Employee } from '../../models/employee.model';

/**
 * ARCHITECTURAL DECISION: Separated mock data files
 *
 * Keeping seed data in its own file (separate from the service) means:
 * 1. The service can be tested with different mock data via dependency injection
 * 2. The seed data could later be replaced with a call to a seeding API
 * 3. File stays small and focused — follows Single Responsibility Principle
 */
export const MOCK_EMPLOYEES: Employee[] = [
  {
    id: 'emp-001', firstName: 'Sarah',   lastName: 'Johnson',
    email: 'sarah.johnson@corp.com',     phone: '+91-98765-43210',
    department: 'Engineering',           role: 'Senior Frontend Developer',
    status: 'active',  salary: 1850000, hireDate: '2021-03-15',
    createdAt: '2021-03-15T09:00:00Z',
  },
  {
    id: 'emp-002', firstName: 'Rohan',   lastName: 'Mehta',
    email: 'rohan.mehta@corp.com',       phone: '+91-87654-32109',
    department: 'Engineering',           role: 'Backend Developer (.NET)',
    status: 'active',  salary: 1650000, hireDate: '2020-07-01',
    createdAt: '2020-07-01T09:00:00Z',
  },
  {
    id: 'emp-003', firstName: 'Priya',   lastName: 'Sharma',
    email: 'priya.sharma@corp.com',      phone: '+91-76543-21098',
    department: 'Human Resources',       role: 'HR Manager',
    status: 'active',  salary: 1350000, hireDate: '2019-11-20',
    createdAt: '2019-11-20T09:00:00Z',
  },
  {
    id: 'emp-004', firstName: 'Aditya',  lastName: 'Patel',
    email: 'aditya.patel@corp.com',      phone: '+91-65432-10987',
    department: 'Sales',                 role: 'Sales Executive',
    status: 'on-leave', salary: 980000, hireDate: '2022-01-10',
    createdAt: '2022-01-10T09:00:00Z',
  },
  {
    id: 'emp-005', firstName: 'Kavya',   lastName: 'Reddy',
    email: 'kavya.reddy@corp.com',       phone: '+91-54321-09876',
    department: 'Finance',               role: 'Financial Analyst',
    status: 'active',  salary: 1250000, hireDate: '2021-08-05',
    createdAt: '2021-08-05T09:00:00Z',
  },
  {
    id: 'emp-006', firstName: 'James',   lastName: 'Chen',
    email: 'james.chen@corp.com',        phone: '+91-43210-98765',
    department: 'Marketing',             role: 'Digital Marketing Lead',
    status: 'active',  salary: 1150000, hireDate: '2020-04-15',
    createdAt: '2020-04-15T09:00:00Z',
  },
  {
    id: 'emp-007', firstName: 'Neha',    lastName: 'Gupta',
    email: 'neha.gupta@corp.com',        phone: '+91-32109-87654',
    department: 'Engineering',           role: 'DevOps Engineer',
    status: 'active',  salary: 1550000, hireDate: '2022-06-01',
    createdAt: '2022-06-01T09:00:00Z',
  },
  {
    id: 'emp-008', firstName: 'Vikram',  lastName: 'Singh',
    email: 'vikram.singh@corp.com',      phone: '+91-21098-76543',
    department: 'Operations',            role: 'Operations Manager',
    status: 'inactive', salary: 1450000, hireDate: '2018-09-30',
    createdAt: '2018-09-30T09:00:00Z',
  },
  {
    id: 'emp-009', firstName: 'Ananya',  lastName: 'Krishnan',
    email: 'ananya.krishnan@corp.com',   phone: '+91-10987-65432',
    department: 'Engineering',           role: 'QA Engineer',
    status: 'active',  salary: 1100000, hireDate: '2023-02-14',
    createdAt: '2023-02-14T09:00:00Z',
  },
  {
    id: 'emp-010', firstName: 'Marcus',  lastName: 'Williams',
    email: 'marcus.williams@corp.com',   phone: '+91-09876-54321',
    department: 'Sales',                 role: 'Regional Sales Manager',
    status: 'active',  salary: 1750000, hireDate: '2019-05-20',
    createdAt: '2019-05-20T09:00:00Z',
  },
  {
    id: 'emp-011', firstName: 'Divya',   lastName: 'Nair',
    email: 'divya.nair@corp.com',        phone: '+91-98764-32108',
    department: 'Finance',               role: 'Senior Accountant',
    status: 'active',  salary: 1050000, hireDate: '2020-12-01',
    createdAt: '2020-12-01T09:00:00Z',
  },
  {
    id: 'emp-012', firstName: 'Arjun',   lastName: 'Bose',
    email: 'arjun.bose@corp.com',        phone: '+91-87653-21097',
    department: 'Engineering',           role: 'Tech Lead',
    status: 'active',  salary: 2200000, hireDate: '2017-08-15',
    managerId: 'emp-002',
    createdAt: '2017-08-15T09:00:00Z',
  },
];