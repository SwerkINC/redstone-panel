export default function Error({ code, message }: { code: string; message: string }) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 dark:bg-gray-900">
            <div className="text-center">
                <div className="mb-4 text-lg text-red-600 dark:text-red-400">
                    {code} - {message}
                </div>
            </div>
        </div>
    );
}
