<template lang="pug">
    .container
        .map#map(style="width: 100px; height: 100px;display:none")
        div
            el-radio-group(v-model="activeName" v-show="activeName != 'forgetPass'" size="mini" @change="formTypeChange" style="display: flex;justify-content: center;margin-left: 100px;")
                el-radio-button(label="login") 登录
                el-radio-button(label="register") 注册
            el-steps(:space="150" :active="currentStep" :align-center="true" style="display: flex;justify-content: center;margin-left: 100px;" :process-status="processStatus" :finish-status="finishStatus" v-show="activeName == 'forgetPass'")
                el-step(title="邮箱校验")
                el-step(title="已完成")
            el-form(:model="loginForm" :rules="loginRules" v-show="activeName == 'login'" ref="loginForm" label-width="100px" label-position="right" class="demo-ruleForm login-container")
                el-form-item(prop="userName" label="用户名")
                    el-input(type="text" size="mini" v-model="loginForm.userName" auto-complete="off" placeholder="请输入账号")
                el-form-item(prop="userPassword" label="密码")
                    el-input(type="password" size="mini" v-model="loginForm.userPassword" auto-complete="off" placeholder="请输入密码")
                el-checkbox(v-model="checked" checked class="remember") 记住密码
                span(style="float:right;padding-right: 4px; cursor: pointer; color:#409EFF;" @click="forgetPass") 忘记密码
                el-form-item(style="width:100%;" class="login-button-con")
                    el-button(type="primary" size="mini" class="loginBtn" @click.native.prevent="handleSubmit" :loading="loading") 登录
            el-form(:model="registerForm" :rules="registerRules" v-if="activeName == 'register'" ref="registerForm" label-width="100px" label-position="right" class="demo-ruleForm login-container")
                el-form-item(prop="name" label="用户名")
                    el-input(type="text" size="mini" v-model="registerForm.name" auto-complete="off" placeholder="请输入用户名")
                el-form-item(prop="nick" label="昵称")
                    el-input(type="text" size="mini" v-model="registerForm.nick" auto-complete="off" placeholder="请输入昵称")
                el-form-item(prop="email" label="邮件")
                    el-input(type="text" size="mini" v-model="registerForm.email" auto-complete="off" placeholder="请输入邮件")
                el-form-item(prop="password" label="密码")
                    el-input(type="password" size="mini" v-model="registerForm.password" auto-complete="off" placeholder="请输入密码")
                el-form-item(prop="rePassword" label="确认密码")
                    el-input(type="password" size="mini" v-model="registerForm.rePassword" auto-complete="off" placeholder="请输入密码")
                el-form-item(style="width:100%;" class="login-button-con")
                    el-button(type="primary" size="mini" class="loginBtn" @click.native.prevent="registerSubmit" :loading="loading") 注册
            el-form(:model="forgetPassForm" :rules="forgetPassRules" v-if="activeName == 'forgetPass'" ref="forgetPassForm" label-width="100px" label-position="right" class="demo-ruleForm login-container")
                el-form-item(prop="email" label="电子邮箱" v-if="currentStep == 1 || currentStep == 0")
                    el-input(type="text" size="mini" v-model="forgetPassForm.email" @focus="focusEmail" auto-complete="off" placeholder="请输入电子邮箱")
                <!--el-form-item(style="width:100%;" class="login-button-con")-->
                    <!--el-button(type="primary" size="mini" class="loginBtn"  v-show="currentStep != 1 || currentStep != 0" @click.native.prevent="backLogin" :loading="loading") 返回登录-->
                el-form-item(style="width:100%;" class="login-button-con" v-show="currentStep == 1 || currentStep == 0")
                    el-button(type="primary" size="mini" class="loginBtn" @click.native.prevent="okEmail" :loading="loading") 确认
                el-form-item(style="width:100%;" class="login-button-con")
                    el-button(type="primary" size="mini" class="loginBtn"  @click.native.prevent="backLogin" :loading="loading") 返回登录
</template>

<script lang="ts">
import { Vue, Prop, Watch, Emit, Component } from "vue-property-decorator";
import {forgetPass, loginApi, registerApi} from "@/api/api";
import { $post } from '@/utils/feth';
import { getURLParameters } from '@/utils/url-params';
import Rule from '@/type/Rule';
import {validEmail} from '@/utils/validate';
import { Base64 } from 'js-base64';
let currentMapConfig:any = undefined;
@Component({
    name: 'Login',
})
export default class Login extends Vue {
    private static validateEmail(rule: Rule, value: string, callback: (error?: Error) => void) {
        if (!validEmail(value)) {
            callback(new Error('邮箱格式不正确'));
        } else {
            callback();
        }
    }
    private loginRules = {
        userName: [
            {required: true, message: '请输入账号', trigger: 'blur'},
        ],
        userPassword: [
            {required: true, message: '请输入密码', trigger: 'blur'},
        ],
    };
    public $refs!: {
        loginForm: HTMLFormElement,
        registerForm: HTMLFormElement,
        forgetPassForm: HTMLFormElement,
    };
    private registerRules = {
        name: [
            {required: true, message: '请输入账号', trigger: 'blur'},
        ],
        password: [
            {required: true, message: '请输入密码', trigger: 'blur'},
        ],
        rePassword: [
            {required: true, message: '请输入确认密码', trigger: 'blur'},
            new Rule({ required: true, trigger: 'blur', message: '请再次确认密码' }, (rule, value, callback) => {
                if (this.registerForm.password != this.registerForm.rePassword) {
                    callback(new Error('确认密码不正确'))
                } else {
                    callback()
                }
            }),
        ],
        nick: [
            {required: true, message: '请输入昵称', trigger: 'blur'},
        ],
        email: [
            {required: true, message: '请输入邮箱', trigger: 'blur'},
            new Rule({}, Login.validateEmail),
        ],
    };
    private forgetPassRules = {
        email: [
            {required: true, message: '请输入邮箱', trigger: 'blur'},
            new Rule({}, Login.validateEmail),
        ],
    };
    public activeName:string = 'login';
    public loginForm = {
        userName:  '',
        userPassword: '',
    };
    public forgetPassForm = {
        email: ''
    };
    public registerForm = {
        name: "",
        email:"",
        password:"",
        rePassword:'',
        nick: "",
    };
    // 当前登录的地址配置
    public currentMapConfig: any;
    public processStatus: string = 'wait';
    public finishStatus: string  = 'wait';
    public currentStep: number = 1;
    private urlParams: any;
    private redirectTarget: string = '';
    private checked = true;
    private loading = false;

    private created() {
        this.urlParams = getURLParameters(window.location.href);
        this.redirectTarget = this.urlParams.redirectUrl ? decodeURIComponent(this.urlParams.redirectUrl) : '';
    }

    private mounted() {
        this.initBaiduMap()
    }

    public handleClick() {

    }

    public focusEmail() {
        this.currentStep = 1;
        this.processStatus = 'wait';
        this.finishStatus = 'wait';
    }

    /**
     * 返回登录
     */
    public backLogin() {
        this.activeName = 'login';
        this.currentStep = 1;
        this.finishStatus = 'wait';
        this.forgetPassForm.email = '';
        try {
            this.$refs.forgetPassForm.resetFields();
        }catch (e) {
            console.log(e)
            return true;
        }
    }
    /**
     * 密码忘记
     */
    public forgetPass() {
        this.activeName = 'forgetPass'
    }
    /**
     * 表单类型改变
     */
    public formTypeChange(value: any) {
        try {
            this.$refs.loginForm.resetFields();
            this.$refs.registerForm.resetFields();
            this.$refs.forgetPassForm.resetFields();
        }catch (e) {
            console.log(e)
        }
    }
    /**
     * 用户登录
     */
    public async handleSubmit() {
        const api: string = loginApi.api;
        const el: any = this.$refs.loginForm;
        el.validate(async (valid: boolean) => {
            const address = Base64.encode(JSON.stringify(currentMapConfig.point));
            if (!valid) {
                return false;
            }
            const params = { name: this.loginForm.userName, password: this.loginForm.userPassword, other: address };
            const res: any = await $post(api, params);
            if (res.data.success) {
                const url: string = decodeURIComponent(this.redirectTarget) + '?token=' + res.data.data.accessToken;
                window.location.replace(url);
            } else {
                this.$message({
                    type: 'error',
                    message: res.data.message,
                });
            }
        });
        this.loading = false;
    }

    /**
     * 用户注册
     */
    public registerSubmit() {
        const api: string = registerApi.api;
        const el: any = this.$refs.registerForm;
        el.validate(async (valid: boolean) => {
            const address = Base64.encode(JSON.stringify(currentMapConfig.point));
            if (!valid) {
                return false;
            }
            const params = { name: this.registerForm.name, password: this.registerForm.password, age: '', address: '', nick: this.registerForm.nick, email: this.registerForm.email, other: address };
            const res: any = await $post(api, params);
            if (res.data.success) {
                this.$message({
                    type: 'success',
                    message: '注册成功',
                });
                this.formTypeChange('login');
                this.activeName = 'login';
            } else {
                this.$message({
                    type: 'error',
                    message: res.data.message,
                });
            }
        });
        this.loading = false;
    }

    /**
     * 邮箱确认密码
     */
    public okEmail() {
        const api: string = forgetPass.api;
        const el: any = this.$refs.forgetPassForm;
        el.validate(async (valid: boolean) => {
            if (!valid) {
                return false;
            }
            const params = { email: this.forgetPassForm.email};
            const res: any = await $post(api, params);
            if (res.data && res.data.success) {
                this.currentStep = this.currentStep + 1
                this.finishStatus = 'success'
                this.$message({
                    type: 'success',
                    message: '密码已发至邮箱，请注意查收'
                })
            } else {
                this.currentStep = 0;
                this.processStatus = 'error'
                this.$message({
                    type: 'error',
                    message: res.data.message
                })
            }
            console.log(res)

        });
        this.loading = false;
    }

    /**
     * 初始化百度地图
     */
    public initBaiduMap() {
        const map = new BMap.Map("map");
        const that = this;
        const point = new BMap.Point(116.331398, 39.897445);
        map.centerAndZoom(point, 12);
        const geoc = new BMap.Geocoder();
        const geolocation = new BMap.Geolocation();
        // 开启SDK辅助定位
        geolocation.enableSDKLocation();
        geolocation.getCurrentPosition(function (r: any){
            // @ts-ignore
            if (this.getStatus() == BMAP_STATUS_SUCCESS){
                const mk = new BMap.Marker(r.point);
                map.addOverlay(mk);
                map.panTo(r.point);
                geoc.getLocation(r.point, (rs: any) => {
                    that.currentMapConfig = {
                        address: rs.addressComponents,
                        point: rs.point,
                        surroundingPois: rs.surroundingPois
                    };
                    currentMapConfig = JSON.parse(JSON.stringify(that.currentMapConfig))
                })
            } else {
                console.warn('GET LOCATION FILED, PLEASE ENABLE BROWSER LOCATION')
                that.currentMapConfig = {
                    address: {},
                    point: {},
                    surroundingPois: {}
                };
            }
        })
    }

}
</script>

<style lang="stylus" scoped>
    .container
        display flex
        justify-content center
        align-items center
        height 100%
        >>>.demo-ruleForm
                .remember
                    padding-left 108px
                .login-button-con
                    width 100%
                    display flex
                    justify-content center
                    margin-left 0px
                    .loginBtn
                        width 300px
</style>
