"use client";

import NextLink from "next/link";
import { useRouter as useNextRouter, useSearchParams, useParams as useNextParams, usePathname } from "next/navigation";
import type { ReactNode } from "react";

type LinkProps = {
  to: string;
  children?: ReactNode;
  className?: string;
  onClick?: () => void;
  activeProps?: { className?: string };
  [key: string]: unknown;
};

export function Link({ to, children, className, onClick, activeProps, ...props }: LinkProps) {
  const pathname = usePathname();
  const search = props["search"] as Record<string, string> | undefined;
  const params = props["params"] as Record<string, string> | undefined;
  const path = params
    ? Object.entries(params).reduce((value, [key, item]) => value.replace(`$${key}`, String(item)), to)
    : to;
  const query = search ? `?${new URLSearchParams(search).toString()}` : "";
  const href = `${path}${query}`;
  const isActive = pathname === path || (to !== "/" && pathname.startsWith(path));
  const finalClassName = isActive && activeProps?.className ? `${className ?? ""} ${activeProps.className}`.trim() : className;
  return <NextLink href={href} className={finalClassName} {...(onClick ? { onClick } : {})} {...props}>{children}</NextLink>;
}

export const useNavigate = () => {
  const router = useNextRouter();
  return ({ to, search, replace }: { to: string; search?: Record<string, string>; replace?: boolean }) => {
    const query = search ? `?${new URLSearchParams(search).toString()}` : "";
    router[replace ? "replace" : "push"](`${to}${query}`);
  };
};

export function useLocation() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  return {
    pathname,
    search: Object.fromEntries(searchParams.entries()) as Record<string, string>,
  };
}

export function useParams<T extends Record<string, string> = Record<string, string>>(): T {
  return useNextParams() as T;
}

export function createFileRoute(_path: string) {
  return (config: {
    component: () => ReactNode;
    head?: unknown;
    validateSearch?: unknown;
  }) => ({
    ...config,
    useSearch: () => {
      const sp = useSearchParams();
      return Object.fromEntries(sp.entries()) as Record<string, string>;
    },
    useParams: <P extends Record<string, string> = Record<string, string>>(): P => useNextParams() as P,
  });
}