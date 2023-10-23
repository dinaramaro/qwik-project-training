import {
 $,
 component$,
 useStyles$,
 useStore,
 useVisibleTask$,
} from '@builder.io/qwik';
import {
 LuArrowUpDown,
 LuChevronLeft,
 LuChevronRight,
 LuSearch,
 LuX,
} from '@qwikest/icons/lucide';
import { useNavigate } from '@builder.io/qwik-city';

import styles from './acls.less?inline';
import { useAcls } from '../layout';

export interface Acl {
 id: number;
 name: string;
 description: string;
 function: string;
 acltypes_id: number;
 acltypes: any;
}

export interface AclResource {
 previous: string;
 next: string;
 current: string;
 limit: string;
 pagesTotal: number;
 totalResults: number;
 pageCurrent: string;
 resources: Acl[];
}

export interface AclProps {
 acls: AclResource;
 params: any;
}

const AclColumnsObj = [
 { label: 'ID', path: 'id' },
 { label: 'Name', path: 'name' },
 { label: 'Description', path: 'description' },
 { label: 'Function', path: 'function' },
 { label: 'ACL typename', path: 'acltypes.name' },
];

export default component$(() => {
 useStyles$(styles);
 const nav = useNavigate();
 const data = useAcls();
 const { acls, params } = data.value;

 const searchState = useStore({
  searchInput: '',
  limit: acls.limit,
 });

 console.log('data', data.value);

 const onSearchClick = $(() => {
  const searchQuery = `search=${searchState.searchInput}`;
  const page = '1';
  nav(
   `/acls/?sort=${params.sort}&page=${page}&limit=${searchState.limit}&${searchQuery}`
  );
 });

 const onSearchClear = $(() => {
  searchState.searchInput = '';
 });

 useVisibleTask$(({ track }) => {
  track(() => searchState.searchInput);
  if (searchState.searchInput === '') {
   const page = '1';
   nav(
    `/acls/?sort=${params.sort}&page=${page}&limit=${searchState.limit}&search=`
   );
  }
 });

 return (
  <div class='acl-page'>
   <h2 class='title'>Gestion des ACLS</h2>

   <div class='filter-bar'>
    <div class='pagination-item'>
     <label for='pagination-select'>Items per page :</label>
     {/* TODO: set selected value on init */}
     <select
      name='per-page'
      id='pagination-select'
      value='25'
      class='pagination-select'
      onChange$={async (e) => {
       searchState.limit = e.target.value;
       await nav(
        `/acls/?sort=${params.sort}&page=${params.page}&limit=${e.target.value}&search=${searchState.searchInput}`
       );
      }}
     >
      <option value='10'>10</option>
      <option value='25'>25</option>
      <option value='50'>50</option>
      <option value='100'>100</option>
     </select>

     <div class='total-pages-section'>
      {acls.pageCurrent} - {acls.limit} sur {acls.totalResults} résultats
     </div>

     <div class='icons-section'>
      {/* TODO: add functionnal disabled */}
      <button
       onClick$={async () => {
        const page = +params.page - 1;
        await nav(
         `/acls/?sort=${params.sort}&page=${page}&limit=${params.limit}&search=${searchState.searchInput}`
        );
       }}
       disabled={params.page === 1}
      >
       <LuChevronLeft />
      </button>
      <button
       onClick$={async () => {
        const page = +params.page + 1;
        await nav(
         `/acls/?sort=${params.sort}&page=${page}&limit=${params.limit}&search=${searchState.searchInput}`
        );
       }}
       disabled={params.page === acls.pagesTotal}
      >
       <LuChevronRight />
      </button>
     </div>
    </div>

    <div class='search-input-item'>
     <div>
      <input
       class='search-input'
       type='text'
       placeholder='Rechercher dans Id, Name ou Function...'
       value={searchState.searchInput}
       onInput$={(e) =>
        (searchState.searchInput = (e.target as HTMLInputElement).value)
       }
      />
     </div>
     <button onClick$={onSearchClick}>
      <LuSearch />
     </button>
     <button onClick$={onSearchClear}>
      <LuX />
     </button>
    </div>
   </div>

   {!acls.resources || acls.resources.length === 0 ? (
    <h3>No results</h3>
   ) : (
    <table class='table'>
     <thead>
      {AclColumnsObj.map((column: { path: string; label: string }, i) => (
       <th id={column.label} key={i}>
        <p>{column.label}</p>
        {/* TODO: add sort on acl.typename (deep path) */}
        {column.path !== 'acltypes.name' && column.path !== 'description' ? (
         <button
          onClick$={async () => {
           await nav(`/acls/?sort=${column.path}`);
          }}
         >
          <LuArrowUpDown />
         </button>
        ) : null}
       </th>
      ))}
     </thead>

     {acls.resources.map((acl) => (
      <tbody>
       <tr key={acl.id}>
        <td>{acl.id}</td>
        <td>{acl.name}</td>
        <td>{acl.description}</td>
        <td>{acl.function}</td>
        <td>{acl.acltypes.name}</td>
       </tr>
      </tbody>
     ))}
    </table>
   )}
  </div>
 );
});
