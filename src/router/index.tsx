
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
        path: '/publisher',
        name: 'publisher',
        component: () => import('../pages/publisher/publisher')
      },
      {
        path: '/books',
        name: 'books',
        component: () => import('../pages/books/books')
      },
      {
        path: '/booksDetail',
        name: 'booksDetail',
        component: () => import('../pages/booksDetail/booksDetail')
      },
      {
        path: '/volume',
        name: 'volume',
        component: () => import('../pages/volume/volume')
      },
      {
        path: '/chapter',
        name: 'chapter',
        component: () => import('../pages/chapter/chapter')
      },
    ]
  },

]