"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavLinkProps } from "./types";

const NavLink: React.ForwardRefRenderFunction<
  HTMLAnchorElement,
  NavLinkProps
> = ({
  children,
  href,
  activeClassName,
  nonActiveClassName,
  className,
  ...rest
}) => {
  const pathname = usePathname(); // p
  const isActive =
    pathname.endsWith(href) || (href.includes(pathname) && pathname !== "/");
  const newClassName = `${
    isActive ? activeClassName : nonActiveClassName
  } ${className}`;
  return (
    <Link href={href} className={newClassName} {...rest}>
      {children}
    </Link>
  );
};

export default NavLink;
