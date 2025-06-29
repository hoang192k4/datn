import type { Gender } from "../enums/Gender"
import type { StatusActiveInactive } from "../enums/StatusActiveInactive"

export interface TeacherForm {
  name: string,
  slug: string,
  email: string,
  date_of_birth: string,
  address: string,
  gender: string,
  role: string,
  status: string
}

export interface TeacherList {
  id: number,
  teacher_code: string,
  name: string,
  email: string,
  slug: string,
  date_of_birth: string,
  gender: Gender,
  status: StatusActiveInactive,
  address: string,
  password: string,
  password_update: string,
  password_current: string,
  role: string,
  role_id: number,
  created_at: string
}

export interface Meta {
  current_page: number;
  next_page: number | null;
  previous_page: number | null;
  total_pages: number;
  total: number;
  count: number;
  from: number;
  to: number;
  limit: number;
}
