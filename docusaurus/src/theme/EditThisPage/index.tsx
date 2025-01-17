// Swizzle action eject is unsafe to perform on EditThisPage.
// It is more likely to be affected by breaking changes in the future
// https://docusaurus.io/docs/swizzling/
//
// We added nofollow to the link for SEO purposes.

import React from 'react';
import Translate from '@docusaurus/Translate';
import {ThemeClassNames} from '@docusaurus/theme-common';
import Link from '@docusaurus/Link';
import IconEdit from '@theme/Icon/Edit';
import type {Props} from '@theme/EditThisPage';

export default function EditThisPage({editUrl}: Props): JSX.Element {
  return (
    <Link to={editUrl} className={ThemeClassNames.common.editThisPage} rel="nofollow noopener noreferrer">
      <IconEdit />
      <Translate
        id="theme.common.editThisPage"
        description="The link label to edit the current page">
        Edit this page
      </Translate>
    </Link>
  );
}
