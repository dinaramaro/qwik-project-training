import {
 $,
 component$,
 useSignal,
 useStyles$,
 useVisibleTask$,
} from '@builder.io/qwik';
import {
 SubmitHandler,
 formAction$,
 useForm,
 valiForm$,
} from '@modular-forms/qwik';

import { useFormLoader } from '~/routes/layout';
import styles from './upload-file-form.less?inline';

export type myForm = {
 file: any;
 sendBy: string;
};

export default component$(() => {
 useStyles$(styles);

 const [myForm, { Form, Field }] = useForm<myForm>({
  loader: useFormLoader(),
 });

 const fileInputRef = useSignal<HTMLInputElement>();

 useVisibleTask$(({ track }) => {
  track(() => fileInputRef.value);
 });

 const handleSubmit: SubmitHandler<myForm> = $((values, event) => {
  // Runs on client
  console.log('submitted values', values);
 });

 return (
  <Form onSubmit$={handleSubmit} class='form'>
   <div class='fields-section'>
    <Field name='sendBy'>
     {(field, props) => (
      <div>
       <label for='sendBy'>Send by</label>
       <input {...props} type='text' value={field.value} />
      </div>
     )}
    </Field>
    <div class='upload-field'>
     <Field name='file'>
      {(field, props) => (
       <div>
        <input {...props} type='file' accept='image/*' ref={fileInputRef} />
        {field.error && <div>{field.error}</div>}
       </div>
      )}
     </Field>

     <button
      onClick$={async () => {
       const fileInput = fileInputRef.value as HTMLInputElement;
       console.timeLog('fileInput', fileInput);

       if (fileInput && fileInput.files) {
        const file = fileInput.files[0];
        const link = document.createElement('a');
        const imageURL = URL.createObjectURL(file);
        link.download = file.name;
        link.href = imageURL;
        link.click();
       }
      }}
      class='save-btn'
     >
      Upload file
     </button>
    </div>
   </div>

   <div class='actions-section'>
    <button type='submit' class='save-btn'>
     SUBMIT FORM
    </button>
   </div>
  </Form>
 );
});
