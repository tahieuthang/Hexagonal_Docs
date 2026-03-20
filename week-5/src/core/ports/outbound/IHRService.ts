interface Employee {
    id: string;
    name: string;
    email: string;
    department: string;
    status: 'active' | 'resigned' | 'on_leave';
}

export interface IHRService {
  checkEmployeeStatus(name: string): Promise<Employee | null>;
}