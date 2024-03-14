// assets
import { Box1, Home, Link, Teacher, Whatsapp } from 'iconsax-react';

// type
import { NavItemType } from 'types/menu';

// icons
const icons = {
  home: Home,
  redirects: Link,
  tutorials: Teacher,
  products: Box1,
  whatsapp: Whatsapp
};

// ==============================|| MENU ITEMS - SUPPORT ||============================== //

const Main: NavItemType = {
  id: 'other',
  // title: <FormattedMessage id="others" />,
  type: 'group',
  children: [
    {
      id: 'funil',
      title: 'Whatsapps',
      type: 'collapse',
      icon: icons.home,
      children: [
        {
          id: 'products',
          title: 'Produtos',
          type: 'item',
          url: '/funil/produtos',
          breadcrumbs: true,
          icon: icons.products
        },
        {
          id: 'whatsapps',
          title: 'Whatsapps',
          type: 'item',
          url: '/funil/whatsapps',
          breadcrumbs: true,
          icon: icons.whatsapp
        }
      ]
    },
    {
      id: 'redirects',
      title: 'Redirecionamentos',
      breadcrumbs: true,
      type: 'item',
      url: '/redirects',
      icon: icons.redirects
    },
    {
      id: 'tutorials',
      title: 'Tutoriais',
      breadcrumbs: false,
      type: 'item',
      url: 'https://www.youtube.com/@zapdiviser/videos',
      icon: icons.tutorials
    }
  ]
};

export default Main;
