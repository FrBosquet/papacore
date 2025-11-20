import type { Link } from "@blacksmithgu/datacore";
import type { ComponentChildren } from "preact";
import { classMerge } from "../../utils/classMerge";
import { classVariants } from "../../utils/classVariants";

const getVariant = classVariants({
  base: '[&_a]:no-underline [&_a]:contents [&_a]:font-[weight:inherit] [&_a]:text-inherit',
  variants: {
    default: ''
  },
  sizes: {
    default: ''
  }
})

export type Props = {
  children?: ComponentChildren;
  className?: string;
  variant?: Parameters<typeof getVariant>[0]
  size?: Parameters<typeof getVariant>[1]
} & (
    { path: string, link?: never } |
    { path?: never, link: Link }
  )

export const Link = ({
  children,
  className,
  path,
  link,
  variant,
  size
}: Props) => {
  const resolvedClassName = classMerge(getVariant(variant, size), className);
  const resolvedLink = link ?? dc.fileLink(path);
  const linkAndViz = resolvedLink.withDisplay(children as unknown as string);

  return <div className={resolvedClassName}>
    <dc.Link link={linkAndViz} />
  </div>;
}