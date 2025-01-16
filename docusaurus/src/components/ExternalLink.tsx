import { ReactNode } from "react";
import Link, { Props } from "@docusaurus/Link";

const ExternalLink: React.FC<Props> = (props) => {
  const { to, href, ...rest } = props;
  const isExternal = href?.startsWith('http') && !href?.startsWith('https://knapsackpro.com') && !href?.includes(window.location.origin);

  return (
    <Link
      {...rest}
      to={to}
      href={href}
      rel={isExternal ? 'nofollow noopener noreferrer' : undefined}
      target={isExternal ? '_blank' : undefined}
    />
  );
};

export default ExternalLink;
