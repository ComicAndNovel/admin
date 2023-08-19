
export default [
  
  {
    path: '/',
    name: 'home',
    component: () => import('../pages/home/home'),
    redirect: '/author',
    children: [
      {
        path: '/author',
        name: 'author',
        component: () => import('../pages/author/author')
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