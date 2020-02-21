import { getRouter, route as allMenus } from './router';

export const session$ = {
    token: '',
    menus: [],
    hideMenus: false,
};

export const escapeCheckSession$ = () =>  {
    return new Promise((resolve) => {
        const token = '123456789';
        Object.assign(session$, { hideMenus: false });
        Object.assign(session$, { token });
        resolve(getRouter(allMenus));
        Object.assign(session$, { menus: allMenus });
    });
};
export default {
    data() {
        return {
            session$,
        };
    },
};
