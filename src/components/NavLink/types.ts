import Link from "next/link";

export type NavLinkProps = {
  children?: React.ReactNode;
  href: string;
  activeClassName: string;
  nonActiveClassName?: string;
  className?: string;
} & React.ComponentProps<typeof Link>;
