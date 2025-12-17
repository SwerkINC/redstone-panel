import type { LoginRequest, RegisterRequest } from '@/types';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useUserStore } from '@/store';

import { authService } from '@/services';

import cookies from 'js-cookie';

/**
 * Hook for login mutation
 */
export const useLogin = () => {
    const { setUser } = useUserStore();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (credentials: LoginRequest) => authService.login(credentials),
        onSuccess: async (data) => {
            if (data.requires2FA) {
                return;
            }

            cookies.set('accessToken', data.accessToken);
            cookies.set('refreshToken', data.refreshToken);

            const user = await authService.me();
            setUser(user.data);
            queryClient.invalidateQueries({ queryKey: ['user'] });
        },
    });
};

/**
 * Hook for register mutation
 */
export const useRegister = () => {
    return useMutation({
        mutationFn: (data: RegisterRequest) => authService.register(data),
    });
};

/**
 * Hook to get current user
 */
export const useCurrentUser = () => {
    return useQuery({
        queryKey: ['user'],
        queryFn: () => authService.me(),
        enabled: Boolean(cookies.get('accessToken')),
        retry: false,
        staleTime: Infinity,
    });
};

/**
 * Hook for logout
 */
export const useLogout = () => {
    const { setUser } = useUserStore();
    const queryClient = useQueryClient();

    return () => {
        cookies.remove('accessToken');
        cookies.remove('refreshToken');
        setUser(null);

        queryClient.clear();
    };
};

/**
 * Hook for 2FA generation
 */
export const useGenerate2FA = () => {
    return useMutation({
        mutationFn: () => authService.generate2FA(),
    });
};

/**
 * Hook for enabling 2FA
 */
export const useEnable2FA = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ code, secret }: { code: string; secret: string }) =>
            authService.enable2FA(code, secret),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user'] });
        },
    });
};

/**
 * Hook for disabling 2FA
 */
export const useDisable2FA = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => authService.disable2FA(),
        onSuccess: () => {
            // Refetch user to update 2FA status
            queryClient.invalidateQueries({ queryKey: ['user'] });
        },
    });
};
