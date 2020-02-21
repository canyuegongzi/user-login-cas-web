declare module '*.vue' {
  import Vue from 'vue';
  export default Vue;
}
declare module 'qs' {
  const qs: any;
  export default qs;
}

declare let BMap: any;
declare let BMAP_STATUS_SUCCESS: any;
declare module '$post' {
  import {$post} from '@/utils/feth';
  export default $post;
}
declare module '$get' {
  import {$get} from '@/utils/feth';
  export default $get;
}
