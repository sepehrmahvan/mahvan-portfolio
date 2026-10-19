'use client';

import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/constants/query-keys';
import { usersService } from '@/services/users.service';
import type { PaginationParams } from '@/types/api';

export function useUsers(params: PaginationParams = {}) {
  return useQuery({
    queryKey: queryKeys.users.list(params),
    queryFn: () => usersService.list(params),
  });
}
