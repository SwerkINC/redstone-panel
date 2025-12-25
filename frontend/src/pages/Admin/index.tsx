import { type CreateServerSchemaType, createServerSchema } from '@/schemas';

import { useMutation } from '@tanstack/react-query';

import { Button, Input, Layout } from '@/components';

import { useUserStore } from '@/store';

import { serversService } from '@/services';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Navigate } from 'react-router-dom';

/**
 * Admin page
 */
export function Admin() {
    const { user } = useUserStore();
    const { mutate: createServer } = useMutation({
        mutationFn: async (data: CreateServerSchemaType) => {
            const response = await serversService.createServer(data);
            return response.data;
        },
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CreateServerSchemaType>({
        resolver: zodResolver(createServerSchema),
        defaultValues: {
            name: '',
            description: '',
            type: 'VANILLA',
            version: '',
        },
    });

    if (!user) {
        return null;
    }

    if (!user.groups.find((group) => group.name === 'Admin')) {
        return <Navigate to="/" />;
    }

    const onSubmit = async (data: CreateServerSchemaType) => {
        try {
            await createServer(data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Layout title="Admin">
            <form onSubmit={handleSubmit(onSubmit)}>
                <Input
                    label="Name"
                    {...register('name')}
                    validation={errors.name ? 'error' : 'default'}
                    helperText={errors.name?.message}
                />
                <Input
                    label="Description"
                    {...register('description')}
                    validation={errors.description ? 'error' : 'default'}
                    helperText={errors.description?.message}
                />
                <Input
                    label="Type"
                    {...register('type')}
                    validation={errors.type ? 'error' : 'default'}
                    helperText={errors.type?.message}
                />
                <Input
                    label="Version"
                    {...register('version')}
                    validation={errors.version ? 'error' : 'default'}
                    helperText={errors.version?.message}
                />
                <Button type="submit">Create Server</Button>
            </form>
        </Layout>
    );
}
