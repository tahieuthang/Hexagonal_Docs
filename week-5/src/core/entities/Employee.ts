import { InvalidDataError } from "@errors/InvalidDataError";

export enum EmployeeStatus {
  ACTIVE = 'active',
  RESIGNED = 'resigned'
}

export class Employee {
  public readonly id: string
  public readonly name: string
  public readonly email: string
  public readonly status: EmployeeStatus
  public readonly department: string
  public readonly lastLogin: Date | undefined

  constructor(
    id: string,
    name: string,
    email: string,
    status: EmployeeStatus,
    department: string,
    lastLogin?: Date
  ) {
    this.id = id
    this.name = name.trim()
    this.email = email.trim()
    this.status = status
    this.department = department.trim()
    this.lastLogin = lastLogin || undefined
    this.validate()
  }

  private validate() {
    if (!this.id) throw new InvalidDataError('Mã nhân viên không được để trống')
    if (!this.name) throw new InvalidDataError('Tên nhân viên không được để trống')
    if (!this.email || !this.email.includes('@')) {
      throw new InvalidDataError('Email nhân viên không hợp lệ')
    }
  }

  static fromRaw(data: any): Employee {
    return new Employee(
      data.employee_id,
      data.name,
      data.email,
      data.status as EmployeeStatus,
      data.department,
      data.last_login ? new Date(data.last_login) : undefined
    );
  }

  public canResetPassword(): boolean {
    return this.status === EmployeeStatus.ACTIVE;
  }
}