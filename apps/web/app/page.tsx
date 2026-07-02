"use client";
import Link from "next/link";

import { ChatIcon, FilesIcon, MicrophoneIcon, ReceiptIcon, HouseIcon } from "@phosphor-icons/react";

const tools = [
  {
    title: "Document Assistant",
    desc: "Upload a PDF and extract insights, summaries, and key data.",
    iconBg: "bg-teal-100 dark:bg-teal-900/20",
    href: "/ai-tools/docs-assistant",
    icon: <FilesIcon size={24} color="#1a7e5f" />,
  },
  {
    title: "Meeting Analyzer",
    desc: "Transcribes audio and extracts sentiment and spoken information.",
    iconBg: "bg-orange-100 dark:bg-orange-900/20",
    href: "/ai-tools/meeting-analyze",
    icon: <MicrophoneIcon size={24} color="#9e4425" />,
  },
  {
    title: "Receipts Detection",
    desc: "Collect the data find on receipts and store on a table.",
    iconBg: "bg-blue-100 dark:bg-blue-900/20",
    href: "/ai-tools/receipt-detection",
    icon: <ReceiptIcon size={24} color="#256C9E" />,
  },
  {
    title: "House Energy",
    desc: "Predict energy consumption for your household.",
    iconBg: "bg-yellow-200 dark:bg-yellow-900/20",
    href: "/ai-tools/house-energy",
    icon: <HouseIcon size={24} color="#f5c211" />,
  },
];

export default function Home() {
  return (
    <div className="relative flex flex-col flex-1 items-center justify-center px-8 py-12">
      <div className="relative z-10 text-center mb-10">
        <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-600 mb-2">
          Welcome
        </p>
        <h1 className="text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
          Select a{" "}
          <span className="bg-gradient-to-r from-violet-700 to-teal-600 bg-clip-text text-transparent">
            tool.
          </span>
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
          Choose what you want to work on today.
        </p>
      </div>

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl">
        {tools.map((tool) => (
          <Link
            key={tool.title}
            href={tool.href}
            className="group flex flex-col gap-3 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm hover:border-zinc-300 dark:hover:border-zinc-700 hover:-translate-y-0.5 transition-all"
          >
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center ${tool.iconBg}`}
            >
              {tool.icon}
            </div>
            <p className="font-bold text-sm text-zinc-900 dark:text-white">
              {tool.title}
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              {tool.desc}
            </p>
            <span className="text-zinc-300 dark:text-zinc-700 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors mt-auto self-end text-sm">
              →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
