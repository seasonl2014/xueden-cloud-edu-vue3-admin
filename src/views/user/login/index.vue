<template>
    <div class="main">
        <h1 class="title">
            {{t('page.user.login.form.title')}}
        </h1>
        <el-form :model="modelRef" :rules="rulesRef" ref="formRef">
            <el-form-item  label="" prop="username">
                <el-input v-model="modelRef.username" :placeholder="t('page.user.login.form-item-username')" @keydown.enter="handleSubmit">
                    <template #prefix><i class="el-icon-user el-input__icon"></i></template>
                </el-input>
            </el-form-item>
            <el-form-item label="" prop="password">
                <el-input v-model="modelRef.password" type="password" :placeholder="t('page.user.login.form-item-password')" @keydown.enter="handleSubmit">
                    <template #prefix><i class="el-icon-unlock el-input__icon"></i></template>
                </el-input>
            </el-form-item>

          <el-form-item prop="code">
            <el-input v-model="modelRef.code" auto-complete="off" :placeholder="t('page.user.login.form-item-captcha')"  style="width: 54%" @keydown.enter="handleSubmit">
              <template #prefix><i class="el-icon-milk-tea el-input__icon"></i></template>
            </el-input>
            <div class="login-code">
              <img :src="codeUrl" @click="getCode">
            </div>
          </el-form-item>

            <el-form-item>
                <el-button type="primary" class="submit" @click="handleSubmit" :loading="submitLoading">
                    {{t('page.user.login.form.btn-submit')}}
                </el-button>
                <div class="text-align-right">
                    <a target="_blank" href="http://java.goodym.cn/html/1610442125958.html">
                        在线视频教程
                    </a>
                </div>
            </el-form-item>

            <el-alert v-if="loginStatus === 'error' && !submitLoading" :title="t('page.user.login.form.login-error')" type="error" show-icon :closable="false" />

        </el-form>
    </div>
</template>
<script lang="ts">
import {computed, defineComponent, reactive, ref, watch, Ref, onMounted} from "vue";
import { useRouter, RouteRecordRaw } from 'vue-router';
import { useStore } from 'vuex';
import { useI18n } from "vue-i18n";
import { ElForm, ElMessage } from 'element-plus';
import { LoginParamsType } from './data.d';
import { StateType as UserLoginStateType } from './store';
import {ResponseData} from "@/utils/request";
import {buildMenus} from "@/services/user";

import {generateLeftAndTopMenusTree} from "@/utils/menudata";
import {RoutesDataItem} from "@/utils/routes";


interface UserLoginSetupData {
    t: Function;
    modelRef: LoginParamsType;
    rulesRef: any;
    formRef: typeof ElForm;
    submitLoading: boolean;
    handleSubmit: () => Promise<void>;
    getCode: () => Promise<void>;
    loginStatus?: "ok" | "error" ;
    codeUrl?: string | undefined;
}

export default defineComponent({
    name: 'UserLogin',
    components: {
    },
    setup(): UserLoginSetupData {
        const router = useRouter();
        const { currentRoute } = router;
        const store = useStore<{userlogin: UserLoginStateType}>();
        const { t } = useI18n();

        const codeUrl: any = ref();


        // 表单值
        const modelRef = reactive<LoginParamsType>({
            username: 'admin',
            password: '123456',
            code: '',
            uuid: ''
        });
        // 表单验证
        const rulesRef = reactive({
            username: [
                {
                    required: true,
                    message: t('page.user.login.form-item-username.required'),
                },
            ],
            password: [
                {
                    required: true,
                    message: t('page.user.login.form-item-password.required'),
                },
            ],
          code: [
              {
                required: true,
                message: t('page.user.login.form-item-captcha.required'),
              },
            ],
        });
        // form
        const formRef = ref<typeof ElForm>();
        // 登录loading
        const submitLoading = ref<boolean>(false);


        // 登录
        const handleSubmit = async () => {
            submitLoading.value = true;
            try {
                const valid: boolean | undefined =  await formRef.value?.validate();
                if(valid === true) {
                    const res: boolean = await store.dispatch('userlogin/login',modelRef);
                    if (res === true) {
                      buildMenus().then(res => {
                        const menusList: Array<RoutesDataItem > = generateLeftAndTopMenusTree(res.data)
                        store.commit('user/saveCurrentUserMenu', menusList || {});
                      })
                        ElMessage.success(t('page.user.login.form.login-success'));
                        const { redirect, ...query } = currentRoute.value.query;
                        router.replace({
                            path: redirect as string || '/',
                            query: {
                                ...query
                            }
                        });
                    }
                }
            } catch (error) {
                // console.log(error);
                ElMessage.warning(t('app.global.form.validatefields.catch'));
            }
            submitLoading.value = false;
        }

        // 登录状态
        const loginStatus = computed<"ok" | "error" | undefined>(()=> store.state.userlogin.loginStatus);

        // 获取验证码
      const getCode = async() => {
        try {
          const resultData: ResponseData = await store.dispatch('userlogin/getCodeImg')
          codeUrl.value = "data:image/gif;base64,"+resultData.img
          modelRef.uuid = resultData.uuid
        }catch (error){
          ElMessage.warning(t('app.global.form.validatefields.catch'));
        }


      }

      onMounted(()=> {
        getCode();
      })


        return {
            t,
            modelRef,
            rulesRef,
            formRef: formRef as unknown as typeof ElForm,
            submitLoading: submitLoading as unknown as boolean,
            handleSubmit,
            getCode,
            codeUrl,
            loginStatus: loginStatus as unknown as "ok" | "error" | undefined
        }
    }
})
</script>
<style lang="scss" scoped>
.main {
  flex: none;
  width: 248px;
  padding: 36px;
  margin: 0 auto;
  border-radius: 4px;
  background-color: rgba(255, 255, 255, 0.2);
  .title {
    font-size: 28px;
    margin-top: 0;
    margin-bottom: 30px;
    text-align: center;
    color: #986a46;
    /* background-image:-webkit-linear-gradient(right,#FFFFFF,#009688, #FFFFFF);
        -webkit-background-clip: text;
        -webkit-text-fill-color:transparent; */
  }
  .submit {
    width: 100%;
  }

  .login-code {
    width: 44%;
    display: inline-block;
    height: 45px;
    float: right;
    img{
      cursor: pointer;
      vertical-align:middle;
      border:1px solid #e6e6e6;
      height:36px;
      width:100%;
    }
  }

}

</style>
