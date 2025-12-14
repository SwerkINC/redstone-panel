import {
    CaretDoubleLeftIcon,
    CaretDoubleRightIcon,
    CaretDownIcon,
    GearIcon,
    GearSixIcon,
    HardDriveIcon,
    HouseIcon,
    LightningIcon,
    MoonIcon,
    SignOutIcon,
    SunIcon,
} from '@phosphor-icons/react';

import { useLogout } from '@/hooks';

import { useSidebarStore, useThemeStore, useUserStore } from '@/store';

import { Fragment, useState } from 'react';

/** Sidebar component */
const Sidebar = () => {
    const { user } = useUserStore();
    const { isDark, toggleTheme } = useThemeStore();
    const { open, setOpen } = useSidebarStore();
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const logout = useLogout();

    const handleLogout = () => {
        logout();
    };

    const navItems = [
        {
            name: 'Dashboard',
            icon: <HouseIcon weight="bold" />,
            href: '#',
        },
        {
            name: 'Servers',
            icon: <HardDriveIcon weight="bold" />,
            href: '#',
        },
        {
            name: 'Settings',
            icon: <GearSixIcon weight="bold" />,
            href: '#',
        },
    ];

    return (
        <div
            className={`flex h-screen flex-col border-r border-gray-200 bg-white transition-all duration-300 dark:border-gray-700 dark:bg-gray-800 ${
                open ? 'w-64' : 'w-20'
            }`}
        >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700">
                <div className={`flex items-center gap-3 ${!open && 'justify-center'}`}>
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-blue-600">
                        <LightningIcon color="white" weight="bold" />
                    </div>
                    {open && (
                        <span className="text-lg font-bold text-gray-900 dark:text-white">
                            Redstone
                        </span>
                    )}
                </div>
                <button
                    onClick={() => setOpen(!open)}
                    className="rounded-lg p-1.5 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                >
                    {open ? <CaretDoubleLeftIcon /> : <CaretDoubleRightIcon />}
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-2 overflow-y-auto p-4">
                {navItems.map((item) => (
                    <a
                        key={item.name}
                        href={item.href}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 ${
                            !open && 'justify-center'
                        }`}
                        title={!open ? item.name : undefined}
                    >
                        {item.icon}
                        {open && <span className="font-medium">{item.name}</span>}
                    </a>
                ))}
            </nav>

            {/* User Menu Footer */}
            <div className="relative border-t border-gray-200 dark:border-gray-700">
                {/* Dropdown Menu */}
                {userMenuOpen && (
                    <Fragment>
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 z-10"
                            onClick={() => setUserMenuOpen(false)}
                        />
                        {/* Menu */}
                        <div className="absolute inset-x-4 bottom-full z-20 mb-2 rounded-lg border border-gray-200 bg-white py-2 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                            <button
                                onClick={() => {
                                    toggleTheme();
                                    setUserMenuOpen(false);
                                }}
                                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                            >
                                {isDark ? (
                                    <SunIcon className="size-5" />
                                ) : (
                                    <MoonIcon className="size-5" />
                                )}
                                <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
                            </button>

                            <button
                                onClick={() => setUserMenuOpen(false)}
                                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                            >
                                <GearIcon className="size-5" />
                                <span>Settings</span>
                            </button>

                            <div className="my-2 border-t border-gray-200 dark:border-gray-700" />

                            <button
                                onClick={() => {
                                    handleLogout();
                                    setUserMenuOpen(false);
                                }}
                                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                            >
                                <SignOutIcon className="size-5" />
                                <span>Logout</span>
                            </button>
                        </div>
                    </Fragment>
                )}

                {/* User Button */}
                <button
                    onClick={() => {
                        if (!open) {
                            setOpen(true);
                            setTimeout(() => {
                                setUserMenuOpen(true);
                            }, 200);
                        } else {
                            setUserMenuOpen(!userMenuOpen);
                        }
                    }}
                    className={`flex w-full items-center gap-3 p-4 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 ${
                        !open && 'justify-center'
                    }`}
                >
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 font-semibold text-white">
                        {user?.avatar ? (
                            <img
                                src={user.avatar}
                                alt={user.name || user.username}
                                className="size-full rounded-full object-cover"
                            />
                        ) : (
                            <span className="text-sm">
                                {(user?.name || user?.username || 'U').charAt(0).toUpperCase()}
                            </span>
                        )}
                    </div>
                    {open && (
                        <div className="flex-1 text-left">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {user?.name || user?.email || 'Unknown'}
                            </p>
                            <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                                {user?.email || 'Unknown'}
                            </p>
                        </div>
                    )}
                    {open && <CaretDownIcon className="size-5 text-gray-400" />}
                </button>
            </div>
        </div>
    );
};

/** Sidebar display name */
Sidebar.displayName = 'Sidebar';

/** Sidebar default export */
export default Sidebar;
