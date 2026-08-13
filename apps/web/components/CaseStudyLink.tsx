import Link from "next/link";

type Props = {
  id: string;
};

export default function CaseStudyLink({ id }: Props) {
  return (
    <Link
      href={`/case-studies#${id}`}
      className="text-sm font-medium text-blue-700 underline underline-offset-4 transition-colors hover:text-blue-900 dark:text-blue-300 dark:hover:text-blue-200"
    >
      View case study
    </Link>
  );
}
