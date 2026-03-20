'use client';

import NextLink, { type LinkProps } from 'next/link';
import {
  useParams as useNextParams,
  usePathname,
  useRouter,
  useSearchParams as useNextSearchParams,
} from 'next/navigation';
import React, { useEffect, useMemo } from 'react';

type To =
  | string
  | {
      pathname?: string;
      search?: string;
      hash?: string;
    };

type NavigateOptions = {
  replace?: boolean;
  state?: unknown;
};

type SearchParamValue = string | string[] | undefined;
type SearchParamsInit =
  | string
  | string[][]
  | Record<string, SearchParamValue>
  | URLSearchParams;

type LocationLike = {
  pathname: string;
  search: string;
  hash: string;
  state: unknown;
  key: string;
};

type LinkShimProps = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'className'> &
  Omit<LinkProps, 'href'> & {
    to: To;
    state?: unknown;
    className?: string;
  };

type NavLinkRenderState = { isActive: boolean; isPending: boolean };

type NavLinkShimProps = Omit<LinkShimProps, 'className' | 'children'> & {
  end?: boolean;
  className?: string | ((props: NavLinkRenderState) => string);
  children?: React.ReactNode | ((props: NavLinkRenderState) => React.ReactNode);
};

const ROUTER_STATE_PREFIX = 'dalc-router-state:';

function normalizeTo(to: To): string {
  if (typeof to === 'string') return to;

  const pathname = to.pathname ?? '';
  const search = to.search
    ? to.search.startsWith('?')
      ? to.search
      : `?${to.search}`
    : '';
  const hash = to.hash
    ? to.hash.startsWith('#')
      ? to.hash
      : `#${to.hash}`
    : '';

  return `${pathname}${search}${hash}`;
}

function createSearchParams(init?: SearchParamsInit) {
  if (!init) return new URLSearchParams();
  if (init instanceof URLSearchParams) return new URLSearchParams(init);
  if (typeof init === 'string' || Array.isArray(init)) return new URLSearchParams(init);

  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(init)) {
    if (value == null) continue;
    if (Array.isArray(value)) {
      for (const item of value) {
        params.append(key, item);
      }
      continue;
    }

    params.set(key, value);
  }

  return params;
}

function storeRouteState(href: string, state: unknown) {
  if (typeof window === 'undefined' || state === undefined) return;

  window.sessionStorage.setItem(
    `${ROUTER_STATE_PREFIX}${href}`,
    JSON.stringify(state),
  );
}

function readRouteState(href: string) {
  if (typeof window === 'undefined') return null;

  const raw = window.sessionStorage.getItem(`${ROUTER_STATE_PREFIX}${href}`);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function BrowserRouter({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function Routes({ children }: { children?: React.ReactNode }) {
  return <>{children}</>;
}

export function Route(_props: {
  path?: string;
  element?: React.ReactNode;
  index?: boolean;
  children?: React.ReactNode;
}) {
  return null;
}

export function Outlet() {
  return null;
}

export function useParams<T extends Record<string, string | undefined> = Record<string, string | undefined>>() {
  const params = useNextParams();

  return useMemo(() => {
    const normalized: Record<string, string | undefined> = {};

    for (const [key, value] of Object.entries(params ?? {})) {
      normalized[key] = Array.isArray(value) ? value[0] : value;
    }

    return normalized as T;
  }, [params]);
}

export function useLocation(): LocationLike {
  const pathname = usePathname() ?? '';
  const nextSearchParams = useNextSearchParams();
  const search = nextSearchParams?.toString() ? `?${nextSearchParams.toString()}` : '';
  const href = `${pathname}${search}`;
  const state = useMemo(() => readRouteState(href), [href]);

  return {
    pathname,
    search,
    hash: '',
    state,
    key: href,
  };
}

export function useNavigate() {
  const router = useRouter();

  return (to: number | To, options?: NavigateOptions) => {
    if (typeof to === 'number') {
      if (typeof window === 'undefined') return;

      if (to === -1) {
        router.back();
        return;
      }

      if (to === 1) {
        router.forward();
        return;
      }

      window.history.go(to);
      return;
    }

    const href = normalizeTo(to);
    storeRouteState(href, options?.state);

    if (options?.replace) {
      router.replace(href);
      return;
    }

    router.push(href);
  };
}

export function useSearchParams(): [
  URLSearchParams,
  (nextInit?: SearchParamsInit, navigateOptions?: { replace?: boolean; state?: unknown }) => void,
] {
  const router = useRouter();
  const pathname = usePathname() ?? '';
  const nextSearchParams = useNextSearchParams();
  const searchParams = useMemo(
    () => new URLSearchParams(nextSearchParams?.toString() ?? ''),
    [nextSearchParams],
  );

  const setSearchParams = (
    nextInit?: SearchParamsInit,
    navigateOptions?: { replace?: boolean; state?: unknown },
  ) => {
    const params = createSearchParams(nextInit);
    const query = params.toString();
    const href = query ? `${pathname}?${query}` : pathname;

    storeRouteState(href, navigateOptions?.state);

    if (navigateOptions?.replace) {
      router.replace(href);
      return;
    }

    router.push(href);
  };

  return [searchParams, setSearchParams];
}

export function Navigate({
  to,
  replace,
  state,
}: {
  to: To;
  replace?: boolean;
  state?: unknown;
}) {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(to, { replace, state });
  }, [navigate, replace, state, to]);

  return null;
}

export function LinkShim({
  to,
  replace,
  state,
  onClick,
  children,
  ...props
}: LinkShimProps) {
  const href = normalizeTo(to);

  return (
    <NextLink
      href={href}
      replace={replace}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        storeRouteState(href, state);
      }}
      {...props}
    >
      {children}
    </NextLink>
  );
}

export function NavLink({
  to,
  end,
  className,
  children,
  ...props
}: NavLinkShimProps) {
  const pathname = usePathname() ?? '';
  const href = normalizeTo(to);
  const isActive = end ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
  const navState: NavLinkRenderState = { isActive, isPending: false };
  let resolvedClassName: string | undefined;
  if (typeof className === 'function') {
    resolvedClassName = className(navState);
  } else {
    resolvedClassName = className;
  }

  let resolvedChildren: React.ReactNode;
  if (typeof children === 'function') {
    resolvedChildren = children(navState);
  } else {
    resolvedChildren = children;
  }

  return (
    <LinkShim to={to} className={resolvedClassName} {...props}>
      {resolvedChildren}
    </LinkShim>
  );
}

export { LinkShim as Link };
