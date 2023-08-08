
export default [
  
  {
    path: '/',
    name: 'home',
    component: () => import('../pages/home/home'),
    redirect: '/another',
    children: [
      {
        path: '/another',
        name: 'another',
        component: () => import('../pages/another/another')
      },
      {
        path: '/anotherDetail',
        name: 'anotherDetail',
        component: () => import('../modal/anotherModal/anotherModal')
      },
      {
        path: '/worksList',
        name: 'worksList',
        component: () => import('../pages/works/works')
      },
      {
        path: '/worksDetail',
        name: 'worksDetail',
        component: () => import('../pages/worksDetail/worksDetail')
      },
    ]
  },

]