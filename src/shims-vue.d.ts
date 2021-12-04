declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '@ckeditor/ckeditor5-vue';
declare module '@ckeditor/ckeditor5-build-decoupled-document';
declare module '@ckeditor/ckeditor5-image/src/image';
declare module '@ckeditor/ckeditor5-image/src/imagetoolbar';

declare module '@ckeditor/ckeditor5-image/src/imagecaption';
declare module '@ckeditor/ckeditor5-image/src/imagestyle';
declare module '@ckeditor/ckeditor5-image/src/imageresize';
declare module '@ckeditor/ckeditor5-link/src/linkimage';

declare module '@ckeditor/ckeditor5-build-classic';

interface Window {
  Aliplayer: any;
}
