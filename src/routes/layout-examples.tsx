import { component$ } from '@builder.io/qwik';
import { routeAction$ } from '@builder.io/qwik-city';

import { AclProps } from './acls';
import { LuArrowUpDown } from '@qwikest/icons/lucide';

// Exempla use case of routeAction$
export const useSortedAcls = routeAction$(async (data, requestEvent) => {
 const { headers, query } = requestEvent;

 console.log('requestEvent routeAction', requestEvent);

 const datas = await fetch(
  'https://api.rhinov.fr/bo/acl?limit=50&page=1&sort=aclsubjects.description&q.menuId.eq=administration.acls',
  { headers }
 );

 const sortedAcls = (await datas.json()) as AclProps;

 return {
  success: true,
  value: sortedAcls,
 };
});

export default component$(() => {
 const action = useSortedAcls();

 return (
  <>
   <LuArrowUpDown
    onClick$={async () => {
     const { value } = await action.submit();
     console.log(value);
    }}
   />
  </>
 );
});
