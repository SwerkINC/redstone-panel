import type { LoginRequest } from '@/types';

import { LightningIcon } from '@phosphor-icons/react';

import { Button, Card, Input } from '@/components';

import { useLogin } from '@/hooks';

import { useState } from 'react';
import { useForm } from 'react-hook-form';

/** Login page */
export default function Login() {
    const [requires2FA, setRequires2FA] = useState(false);
    const [error, setError] = useState('');

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginRequest>({
        defaultValues: {
            email: '',
            password: '',
            code: '',
        },
    });

    const loginMutation = useLogin();

    const onSubmit = async (data: LoginRequest) => {
        setError('');

        try {
            const response = await loginMutation.mutateAsync({
                email: data.email,
                password: data.password,
                code: requires2FA ? data.code : undefined,
            });

            if (response.requires2FA) {
                setRequires2FA(true);
            }
        } catch (error) {
            const err = error as { response?: { data?: { message?: string } } };
            const message = err.response?.data?.message || 'Login failed. Please try again.';
            setError(message);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 dark:bg-gray-900">
            <Card className="w-full max-w-md" size="lg">
                <div className="mb-8 text-center">
                    <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-lg bg-blue-600">
                        <LightningIcon className="size-10 text-white" weight="bold" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Welcome to RedstoneP
                    </h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">Sign in to your account</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {error && (
                        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
                            {error}
                        </div>
                    )}

                    {!requires2FA ? (
                        <>
                            <Input
                                label="Email"
                                type="email"
                                placeholder="admin@app.com"
                                {...register('email', {
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                        message: 'Invalid email address',
                                    },
                                })}
                                validation={errors.email ? 'error' : 'default'}
                                helperText={errors.email?.message}
                                disabled={loginMutation.isPending}
                            />

                            <Input
                                label="Password"
                                type="password"
                                placeholder="Enter your password"
                                {...register('password', {
                                    required: 'Password is required',
                                    minLength: {
                                        value: 8,
                                        message: 'Password must be at least 8 characters',
                                    },
                                })}
                                validation={errors.password ? 'error' : 'default'}
                                helperText={errors.password?.message}
                                disabled={loginMutation.isPending}
                            />
                        </>
                    ) : (
                        <Input
                            label="Two-Factor Code"
                            type="text"
                            placeholder="Enter 6-digit code"
                            {...register('code', {
                                required: '2FA code is required',
                                pattern: {
                                    value: /^\d{6}$/,
                                    message: 'Code must be 6 digits',
                                },
                            })}
                            maxLength={6}
                            validation={errors.code ? 'error' : 'default'}
                            helperText={
                                errors.code?.message ||
                                'Enter the 6-digit code from your authenticator app'
                            }
                            disabled={loginMutation.isPending}
                        />
                    )}

                    <Button
                        type="submit"
                        block
                        size="lg"
                        loading={loginMutation.isPending}
                        disabled={loginMutation.isPending}
                    >
                        {requires2FA ? 'Verify Code' : 'Sign In'}
                    </Button>

                    {requires2FA && (
                        <Button
                            type="button"
                            variant="ghost"
                            block
                            onClick={() => {
                                setRequires2FA(false);
                                setError('');
                            }}
                        >
                            Back to Login
                        </Button>
                    )}
                </form>

                <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                    <p>
                        Test credentials: <strong>admin@app.com</strong> /{' '}
                        <strong>Motdepasse123!+</strong>
                    </p>
                </div>
            </Card>
        </div>
    );
}
