import { api } from '@/lib/axios';
import type {
  ApiResponse,
  PaginatedResponse,
  PaginationParams,
} from '@/types/api';
import type { CreateUserInput, UpdateUserInput, User } from '@/types/user';

const demoUsers: User[] = [
  {
    id: '1',
    email: 'admin@mahvan.dev',
    firstName: 'آیدا',
    lastName: 'کریمی',
    role: 'admin',
    createdAt: '2026-01-10T10:00:00.000Z',
    updatedAt: '2026-01-10T10:00:00.000Z',
  },
  {
    id: '2',
    email: 'editor@mahvan.dev',
    firstName: 'Nima',
    lastName: 'Rostami',
    role: 'editor',
    createdAt: '2026-02-14T12:30:00.000Z',
    updatedAt: '2026-02-14T12:30:00.000Z',
  },
  {
    id: '3',
    email: 'viewer@mahvan.dev',
    firstName: 'سارا',
    lastName: 'موسوی',
    role: 'viewer',
    createdAt: '2026-03-01T08:15:00.000Z',
    updatedAt: '2026-03-01T08:15:00.000Z',
  },
];

function paginate(params: PaginationParams = {}): PaginatedResponse<User> {
  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? 10;
  const search = params.search?.trim().toLowerCase();

  let filtered = demoUsers;
  if (search) {
    filtered = demoUsers.filter((user) =>
      [user.email, user.firstName, user.lastName, user.role]
        .join(' ')
        .toLowerCase()
        .includes(search),
    );
  }

  const start = (page - 1) * pageSize;
  const data = filtered.slice(start, start + pageSize);

  return {
    data,
    meta: {
      page,
      pageSize,
      total: filtered.length,
      totalPages: Math.max(1, Math.ceil(filtered.length / pageSize)),
    },
  };
}

export const usersService = {
  async list(params?: PaginationParams): Promise<PaginatedResponse<User>> {
    try {
      const { data } = await api.get<PaginatedResponse<User>>('/users', {
        params,
      });
      return data;
    } catch {
      return paginate(params);
    }
  },

  async getById(id: string): Promise<User> {
    try {
      const { data } = await api.get<ApiResponse<User>>(`/users/${id}`);
      return data.data;
    } catch {
      const user = demoUsers.find((item) => item.id === id);
      if (!user) throw { message: 'User not found', status: 404 };
      return user;
    }
  },

  async create(input: CreateUserInput): Promise<User> {
    try {
      const { data } = await api.post<ApiResponse<User>>('/users', input);
      return data.data;
    } catch {
      const user: User = {
        id: String(Date.now()),
        email: input.email,
        firstName: input.firstName,
        lastName: input.lastName,
        role: input.role,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      demoUsers.unshift(user);
      return user;
    }
  },

  async update(id: string, input: UpdateUserInput): Promise<User> {
    const { data } = await api.patch<ApiResponse<User>>(`/users/${id}`, input);
    return data.data;
  },
};
