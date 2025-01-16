import React from 'react';
import A from '@theme-original/MDXComponents/A';
import type AType from '@theme/MDXComponents/A';
import type {WrapperProps} from '@docusaurus/types';

type Props = WrapperProps<typeof AType>;

export default function AWrapper(props: Props): JSX.Element {
  const { href } = props;
  const isExternal =
    href?.startsWith('http') &&
    !href?.startsWith('https://knapsackpro.com')

  return (
    <>
      <A
        {...props}
        rel={isExternal ? 'nofollow noopener noreferrer' : undefined}
        target={isExternal ? '_blank' : undefined}
      />
    </>
  );
}
