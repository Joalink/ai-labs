"use client";

import Link from "next/link";
import {
  HeadCircuitIcon,
  GithubLogoIcon,
  FolderIcon,
  VideoConferenceIcon,
  CircuitryIcon,
  SunDimIcon,
  MoonIcon,
  ListIcon,
  XIcon,
} from "@phosphor-icons/react";
import { useTheme } from "next-themes";
import { useState } from "react";

export default function Navigation() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const isDark = resolvedTheme === "dark";

  return (
    <>
      <nav className="fixed top-0 z-50 w-full h-14 bg-background border-b border-default">
        <div className="px-3 py-3 lg:px-5 ">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 lg:hidden hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
              >
                {isOpen ? <XIcon size={24} /> : <ListIcon size={24} />}
              </button>

              <Link href="/" className="flex ms-2">
                <HeadCircuitIcon size={24} weight="fill" />
                <span
                  className={`self-center text-lg font-semibold whitespace-nowrap ms-2 rounded-sm ${
                    isDark ? "hover:bg-gray-800" : "hover:bg-gray-100"
                  }`}
                >
                  JoaLink AI/ML Portfolio
                </span>
              </Link>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setTheme(isDark ? "light" : "dark")}
                className="p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-black dark:hover:text-white rounded-full transition-colors"
              >
                {isDark ? (
                  <SunDimIcon size={24} weight="fill" />
                ) : (
                  <MoonIcon size={24} weight="fill" />
                )}
              </button>

              <Link href="https://github.com/JoaLink" target="_blank">
                <GithubLogoIcon size={24} weight="fill" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-full pt-14 transition-transform border-e border-default bg-neutral-primary-soft
    ${isOpen ? "translate-x-0" : "-translate-x-full"}
    lg:translate-x-0`}
      >
        <div className="h-full px-3 py-4 overflow-y-auto">
          <ul className="space-y-2 font-medium">
            <li>
              <Link
                href="/ai-tools/docs-assistant"
                className="flex items-center px-2 py-1.5 text-body rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group"
              >
                <FolderIcon size={32} />
                <span className="ms-3">Docs Assistant</span>
              </Link>
            </li>
            <li>
              <Link
                href="/ai-tools/meeting-intelligence"
                className="flex items-center px-2 py-1.5 text-body rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group"
              >
                <VideoConferenceIcon size={32} />
                <span className="flex-1 ms-3">Meeting Intelligence</span>
              </Link>
            </li>
            <li>
              <Link
                href="/ai-tools/equipment-anomaly"
                className="flex items-center px-2 py-1.5 text-body rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group"
              >
                <CircuitryIcon size={32} />
                <span className="flex-1 ms-3">Equipment Anomaly</span>
              </Link>
            </li>
          </ul>
        </div>
      </aside>

      <div className="lg:ml-64 mt-14"></div>
    </>
  );
}
