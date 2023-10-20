/* eslint-disable no-console */
import { component$, useStore } from '@builder.io/qwik';

import Acls, { AclProps } from './acls';

// import { useAcls } from './layout';

export default component$(() => {
 return (
  <>
   <Acls />
  </>
 );
});
