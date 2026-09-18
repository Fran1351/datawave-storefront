import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BreadcrumbsProps {
  category: string;
  productName: string;
}

export default function Breadcrumbs({ category, productName }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center flex-wrap gap-1 text-xs font-mono text-zinc-400">
        <li>
          <Link href="/" className="hover:text-cyan-400 transition-colors">
            Inicio
          </Link>
        </li>
        <li className="flex items-center gap-1">
          <ChevronRight size={14} className="text-zinc-600" />
          <Link
            href={`/productos?categoria=${encodeURIComponent(category)}`}
            className="hover:text-cyan-400 transition-colors"
          >
            {category}
          </Link>
        </li>
        <li className="flex items-center gap-1 min-w-0">
          <ChevronRight size={14} className="text-zinc-600 flex-shrink-0" />
          <span className="text-zinc-200 truncate" aria-current="page">
            {productName}
          </span>
        </li>
      </ol>
    </nav>
  );
}