declare module '*.vue' {
  import Vue from 'vue';
  export default Vue;
}
declare module 'qs' {
  const qs: any;
  export default qs;
}

declare module 'BMap' {
  const BMap: (id: string) => any;
  export default BMap;
}
declare module '$post' {
  import {$post} from '@/utils/feth';
  export default $post;
}
declare module '$get' {
  import {$get} from '@/utils/feth';
  export default $get;
}
