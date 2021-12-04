<template>
    <div class="document-editor">
        <!--<ckeditor :editor="DecoupledEditor" v-model="editorData"  :config="{toolbar: toolbars, language:language}"  @ready="onReady"></ckeditor>-->
      <ckeditor :editor="ClassicEditor" v-model="editorData" :config="{toolbar: toolbars, language:language}"  @ready="onReady"></ckeditor>
    </div>
</template>
<script lang="ts">
import { computed, defineComponent, PropType } from "vue";
import request from '@/utils/request';
import CKEditor from '@ckeditor/ckeditor5-vue';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import '@ckeditor/ckeditor5-build-classic/build/translations/zh-cn';
import { getLocale } from "@/utils/i18n";


const languageLabels: {[key: string]: string} = {
  'zh-CN': 'zh-cn',
  'zh-TW': 'zh',
  'en-US': 'en-us',
};

const CKEditorConfig = {
  image: {
    // Configure the available styles.
    styles: [
      'alignLeft', 'alignCenter', 'alignRight'
    ],

    // Configure the available image resize options.
    resizeOptions: [
      {
        name: 'resizeImage:original',
        label: 'Original',
        value: null
      },
      {
        name: 'resizeImage:50',
        label: '50%',
        value: '50'
      },
      {
        name: 'resizeImage:75',
        label: '75%',
        value: '75'
      }
    ],
    toolbar: [
      'imageStyle:alignLeft', 'imageStyle:alignCenter', 'imageStyle:alignRight',
      '|',
      'resizeImage',
      '|',
      'imageTextAlternative'
    ]
  },
  toolbar: [
    'heading',
    '|',
    'fontfamily',
    'fontsize',
    'fontColor',
    'fontBackgroundColor',
    '|',
    'bold',
    'italic',
    'underline',
    'strikethrough',
    '|',
    'alignment',
    '|',
    'numberedList',
    'bulletedList',
    '|',
    'indent',
    'outdent',
    '|',
    'link',
    'blockquote',
    'imageUpload',
    'imageStyle:full',
    'imageStyle:side',  //图片与上下文组合方式：图片在文字的旁边
    'resizeImage',
    'linkImage',
    'insertTable',
    'mediaEmbed',
    '|',
    'undo',
    'redo',
  ],
  // language: 'zh-cn'
  language: languageLabels[getLocale()],
};

interface CKEditorSetupData {
    language: string;
    editorData: string;
    ClassicEditor: any;
    editorConfig: object;
    onReady:  (editor: any) => void;
}

export default defineComponent({
    name: 'CKEditor',
    props: {
        modelValue: {
            type: String,
            default: ''
        },
        toolbars: {
            type: Array as PropType<string[]>,
            default: CKEditorConfig['toolbar']
        }
    },
    components: {
        ckeditor: CKEditor.component
    },
    setup(props, { emit }): CKEditorSetupData {

        // 数据值
        const editorData = computed({
            get: () => props.modelValue,
            set: val => {
                emit('update:modelValue', val);
            }
        });

      // 加载完成
      const onReady = (editor: any) => {
        // console.log( 'Editor is ready to use!', editor );
        editor.ui
            .getEditableElement()
            .parentElement.insertBefore(
            editor.ui.view.toolbar.element,
            editor.ui.getEditableElement(),
        );
        editor.plugins.get('FileRepository').createUploadAdapter = (
            loader: any,
        ) => {
          //let val = editor.getData();
          return {
            upload: async () => {
              return await loader.file.then((f: any) => {
                // console.log("file:", f);

                const param = new FormData();
                param.append('file', f);

                return new Promise((resolve, reject) => {
                  request({
                    headers: { 'Content-Type': 'multipart/form-data' },
                    url: '/edu/oss/upload',
                    method: 'POST',
                    data: param,
                  })
                      .then(res => {
                        //console.info("编辑器上传图片返回信息res：",res)
                        const { data } = res;
                        //console.info("上传图片返回信息data：",data)
                        resolve({
                          default: data.urlPath || '',
                        });
                      })
                      .catch(err => {
                        console.log(err);
                        reject(err);
                      });
                });
              });
            },
          };
        };
      }

        return {
            ClassicEditor,
            language: CKEditorConfig.language,
            editorData: editorData as unknown as string,
            editorConfig:CKEditorConfig.toolbar,
            onReady
        }
    }
})
</script>
<style lang="scss" scoped>
.document-editor {
  border: 1px solid var(--ck-color-base-border);
  border-radius: var(--ck-border-radius);

  /* Set vertical boundaries for the document editor. */
  /* max-height: 700px; */

  /* This element is a flex container for easier rendering. */
  display: flex;
  flex-flow: column nowrap;

  ::v-deep(.ck.ck-toolbar) {
    /* Make sure the toolbar container is always above the editable. */
    z-index: 1;

    /* Create the illusion of the toolbar floating over the editable. */
    box-shadow: 0 0 5px hsla(0, 0%, 0%, 0.2);

    /* Use the CKEditor CSS variables to keep the UI consistent. */
    border-bottom: 1px solid var(--ck-color-toolbar-border);

    border: 0;
    border-radius: 0;
  }

  ::v-deep(.ck-content) {
    min-height: 300px;
    line-height: normal;
  }
}

</style>
