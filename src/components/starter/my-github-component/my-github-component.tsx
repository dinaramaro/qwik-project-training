import { component$, useStore, Resource, useResource$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';

export default component$(() => {
 const githubStore = useStore({
  org: 'BuilderIO',
  repos: ['qwik', 'partytown'] as string[] | null,
 });

 // Use useResource$() to set up how the data is fetched from the server.
 // See the example for Fetching Data in the text on the left.
 // @ts-ignore: Unused declaration
 const reposResource = useResource$<string[]>(({ track, cleanup }) => {
  // We need a way to re-run fetching data whenever the `githubStore.org` changes.
  // Use `track` to trigger re-running of the this data fetching function.
  track(() => githubStore.org);

  // A good practice is to use `AbortController` to abort the fetching of data if
  // new request comes in. We create a new `AbortController` and register a `cleanup`
  // function which is called when this function re-runs.
  const controller = new AbortController();
  cleanup(() => controller.abort());

  // Fetch the data and return the promises.
  return getRepositories(githubStore.org, controller);
 });

 console.log('Render');

 return (
  <main>
   <label>
    Github username :
    <input
     onInput$={(e) => (githubStore.org = (e.target as HTMLInputElement).value)}
     value={githubStore.org}
    />
   </label>
   <section>
    <Resource
     value={reposResource}
     onPending={() => <div>Loading...</div>}
     onRejected={(error) => <div>Error: {error.message}</div>}
     onResolved={(repos) => (
      <ul>
       {repos.map((repo) => (
        <li key={repo}>
         <a href={`https://github.com/${githubStore.org}/${repo}`}>{repo}</a>
        </li>
       ))}
      </ul>
     )}
    />
   </section>
  </main>
 );
});

export async function getRepositories(
 username: string,
 controller?: AbortController
): Promise<string[]> {
 console.log('FETCH', `https://api.github.com/users/${username}/repos`);
 const resp = await fetch(`https://api.github.com/users/${username}/repos`, {
  signal: controller?.signal,
 });

 const json = await resp.json();
 console.log('FETCH resolved', json);
 return Array.isArray(json)
  ? json.map((repo: { name: string }) => repo.name)
  : Promise.reject(json);
}

export const head: DocumentHead = {
 title: 'Welcome to Qwik',
 meta: [
  {
   name: 'description',
   content: 'Qwik site description',
  },
 ],
};
