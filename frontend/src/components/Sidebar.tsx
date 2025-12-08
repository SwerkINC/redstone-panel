import { useLogout } from "@/hooks";
import { useSidebarStore, useThemeStore, useUserStore } from "@/store";
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
} from "@phosphor-icons/react";
import { Fragment, useState } from "react";
export function Sidebar() {
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
      name: "Dashboard",
      icon: <HouseIcon weight="bold" />,
      href: "#",
    },
    {
      name: "Servers",
      icon: <HardDriveIcon weight="bold" />,
      href: "#",
    },
    {
      name: "Settings",
      icon: <GearSixIcon weight="bold" />,
      href: "#",
    },
  ];

  return (
    <div
      className={`flex flex-col h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ${
        open ? "w-64" : "w-20"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className={`flex items-center gap-3 ${!open && "justify-center"}`}>
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <LightningIcon color="white" weight="bold" />
          </div>
          {open && (
            <span className="font-bold text-lg text-gray-900 dark:text-white">
              Redstone
            </span>
          )}
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
        >
          {open ? <CaretDoubleLeftIcon /> : <CaretDoubleRightIcon />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => (
          <a
            key={item.name}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
              !open && "justify-center"
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
            <div className="absolute bottom-full left-4 right-4 mb-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-20">
              <button
                onClick={() => {
                  toggleTheme();
                  setUserMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {isDark ? (
                  <SunIcon className="w-5 h-5" />
                ) : (
                  <MoonIcon className="w-5 h-5" />
                )}
                <span>{isDark ? "Light Mode" : "Dark Mode"}</span>
              </button>

              <button
                onClick={() => setUserMenuOpen(false)}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <GearIcon className="w-5 h-5" />
                <span>Settings</span>
              </button>

              <div className="border-t border-gray-200 dark:border-gray-700 my-2" />

              <button
                onClick={() => {
                  handleLogout();
                  setUserMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <SignOutIcon className="w-5 h-5" />
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
          className={`w-full flex items-center gap-3 p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
            !open && "justify-center"
          }`}
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name || user.username}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-sm">
                {(user?.name || user?.username || "U").charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          {open && (
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {user?.name || user?.email || "Unknown"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {user?.email || "Unknown"}
              </p>
            </div>
          )}
          {open && <CaretDownIcon className="w-5 h-5 text-gray-400" />}
        </button>
      </div>
    </div>
  );
}
