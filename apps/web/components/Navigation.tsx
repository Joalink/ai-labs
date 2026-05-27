"use client";
import Link from "next/link";
import {
  HeadCircuitIcon,
  GithubLogoIcon,
  ChatIcon,
  FilesIcon,
  MicrophoneIcon,
  SunDimIcon,
  MoonIcon,
  ListIcon,
  XIcon,
} from "@phosphor-icons/react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

export default function Navigation() {
  const { setTheme, resolvedTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const isDark = resolvedTheme === "dark";

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navLinks = [
    {
      href: "/ai-tools/docs-assistant",
      label: "Docs Assistant",
      icon: <FilesIcon size={24} />,
    },
    {
      href: "/ai-tools/meeting-analyze",
      label: "Meeting Analyzer",
      icon: <MicrophoneIcon size={24} />,
    },
  ];

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <nav className="fixed top-0 z-50 w-full h-14 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="px-3 py-3 lg:px-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 lg:hidden hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                aria-label="Toggle menu"
              >
                {isOpen ? <XIcon size={24} /> : <ListIcon size={24} />}
              </button>
              <Link href="/" className="flex items-center gap-2 ms-2">
                <HeadCircuitIcon size={24} weight="fill" />
                <span className="text-lg font-semibold whitespace-nowrap text-gray-900 dark:text-white">
                  JoaLink Labs
                </span>
              </Link>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setTheme(isDark ? "light" : "dark")}
                className="p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                aria-label="Toggle theme"
              >
                {!mounted ? (
                  <SunDimIcon size={24} weight="fill" className="opacity-0" />
                ) : isDark ? (
                  <SunDimIcon size={24} weight="fill" />
                ) : (
                  <MoonIcon size={24} weight="fill" />
                )}
              </button>
              <Link
                href="https://github.com/JoaLink"
                target="_blank"
                aria-label="GitHub"
              >
                <GithubLogoIcon size={24} weight="fill" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-full pt-14 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 transition-transform
          ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        <div className="h-full px-3 py-4 overflow-y-auto">
          <ul className="space-y-2 font-medium">
            {navLinks.map(({ href, label, icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center px-2 py-1.5 text-gray-900 dark:text-gray-100 rounded hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  {icon}
                  <span className="ms-3">{label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </>
  );
}
