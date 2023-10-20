import { $, component$, useStyles$ } from '@builder.io/qwik';
import {
 LuArrowUpDown,
 LuPlay,
 LuChevronLeft,
 LuChevronRight,
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

const AclColumns = ['ID', 'Name', 'Description', 'Function', 'ACL typename'];
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
 console.log('data', data);

 return (
  <div class='acl-page'>
   <h2 class='title'>Gestion des ACLS</h2>

   <div class='pagination-item'>
    <label for='pagination-select'>Items per page :</label>

    <select
     name='per-page'
     id='pagination-select'
     class='pagination-select'
     onChange$={async (e) => {
      await nav(
       `/acls/?sort=${params.sort}&page=${params.page}&limit=${e.target.value}`
      );
     }}
    >
     <option value='10'>10</option>
     <option value='15'>15</option>
     <option value='30'>30</option>
     <option value='50'>50</option>
     <option value='75'>75</option>
     <option value='100'>100</option>
    </select>

    <div class='total-pages-section'>1 - 10 of 100</div>
    <div class='icons-section'>
     <LuChevronLeft />
     <LuChevronRight
      onClick$={async () => {
       const page = +params.page + 1;
       await nav(
        `/acls/?sort=${params.sort}&page=${page}&limit=${params.limit}`
       );
      }}
     />
    </div>
   </div>

   <table class='table'>
    <thead>
     {AclColumnsObj.map((column: { path: string; label: string }, i) => (
      <th id={column.label} key={i}>
       <p>{column.label}</p>
       <LuArrowUpDown
        onClick$={async () => {
         await nav(`/acls/?sort=${column.path}`);
        }}
       />
      </th>
     ))}
    </thead>
    <tbody>
     {acls.resources.map((acl) => (
      <tr key={acl.id}>
       <td>{acl.id}</td>
       <td>{acl.name}</td>
       <td>{acl.description}</td>
       <td>{acl.function}</td>
       <td>{acl.acltypes.name}</td>
      </tr>
     ))}
    </tbody>
   </table>
  </div>
 );
});
