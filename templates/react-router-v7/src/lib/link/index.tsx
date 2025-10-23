import { type ComponentProps } from "react";
// eslint-disable-next-line
import { Link as RRLink } from "react-router";

export type LinkProps = {
  href: Pick<ComponentProps<typeof RRLink>, "to">["to"];
} & Omit<ComponentProps<typeof RRLink>, "to">;

export function Link({ href, ...props }: LinkProps) {
  return <RRLink {...props} to={href} />;
}
