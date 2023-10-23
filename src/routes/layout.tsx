import { component$, Slot, useStyles$ } from '@builder.io/qwik';
import {
 routeLoader$,
 RequestHandler,
 routeAction$,
} from '@builder.io/qwik-city';
import { Buffer } from 'buffer';

import { AclProps, AclResource } from './acls';

export const onRequest: RequestHandler = async ({ headers }) => {
 // SET HEADERS
 const login = 'dina.ramarovahoaka@rhinov.fr:password';
 const buffer = Buffer.from(login);
 const base64data = buffer.toString('base64');
 headers.set('Authorization', 'Basic ' + base64data);
 headers.set('x-api-key', '2');
 headers.set('Content-Type', 'application/json');
 headers.set('Content-Language', 'fr-FR');

 const obj: Record<string, string> = {};
 headers.forEach((value, key) => (obj[key] = value));
};

// Application pages Requests
export const useAcls = routeLoader$(async (requestEvent) => {
 const { headers, query } = requestEvent;

 //TODO: update func for last column (acltype.name). Add asc/desc
 let queryPagination = '';
 let querySearch = '';
 let queryObj: Record<string, string> = {
  sort: 'id',
  limit: '50',
  page: '1',
  search: '',
 };

 if (query) {
  query.forEach((v, k) => (queryObj[k] = v));
 }

 queryPagination = `limit=${queryObj.limit}&page=${queryObj.page}&sort=aclsubjects.${queryObj.sort}`;
 if (queryObj.search !== '') {
  querySearch = `(q.aclsubjects.id.lk=${queryObj.search}|q.aclsubjects.name.lk=${queryObj.search}|q.aclsubjects.function.lk=${queryObj.search})`;
 }

 const data = await fetch(
  `https://api.rhinov.fr/bo/acl?${queryPagination}&${querySearch}&q.menuId.eq=administration.acls`,
  { headers }
 );

 // TODO: refacto func to handle errors (throwerror, sendStatus eventually etc.)
 const acls = (await data.json()) as AclResource;

 const aclsProps = {
  acls: acls,
  params: queryObj,
 } as AclProps;

 return aclsProps;
});

export default component$(() => {
 return (
  <>
   <main>
    <Slot />
   </main>
  </>
 );
});
