// assets
import { Card, MoneySend, ShoppingCart } from 'iconsax-react';

// type
import { NavItemType } from 'types/menu';

// ==============================|| MENU ITEMS ||============================== //

// icons
const icons = {
  card: Card,
  pix: MoneySend,
  cart: ShoppingCart
};

// ==============================|| MENU ITEMS - SUPPORT ||============================== //

const getMainItems = (product_id: string) => {
  return {
    id: 'funil',
    type: 'group',
    children: [
      {
        id: 'card_approved',
        title: 'Cartão de Crédito',
        breadcrumbs: false,
        type: 'collapse',
        icon: icons.card,
        url: `/funil/produtos/${product_id}/editar-eventos/card_approved`,
        children: [
          {
            id: 'card_approved',
            title: 'Compra Aprovada',
            type: 'item',
            url: `/funil/produtos/${product_id}/editar-eventos/card_approved`,
            breadcrumbs: false
          },
          {
            id: 'card_cancelled',
            title: 'Compra Cancelada',
            type: 'item',
            url: `/funil/produtos/${product_id}/editar-eventos/card_declined`,
            breadcrumbs: false
          }
        ]
      },
      {
        id: 'pix_generated',
        title: 'Pix',
        breadcrumbs: false,
        type: 'collapse',
        icon: icons.pix,
        url: `/funil/produtos/${product_id}/editar-eventos/pix_generated`,
        children: [
          {
            id: 'pix_generated',
            title: 'Pix Gerado',
            type: 'item',
            url: `/funil/produtos/${product_id}/editar-eventos/pix_generated`,
            breadcrumbs: false
          },
          {
            id: 'pix_approved',
            title: 'Pix Aprovado',
            type: 'item',
            url: `/funil/produtos/${product_id}/editar-eventos/pix_approved`,
            breadcrumbs: false
          }
        ]
      },
      {
        id: 'cart_abandoned',
        title: 'Carrinho',
        breadcrumbs: false,
        type: 'collapse',
        icon: icons.cart,
        url: `/funil/produtos/${product_id}/editar-eventos/cart_abandoned`,
        children: [
          {
            id: 'cart_abandoned',
            title: 'Carrinho Abandonado',
            type: 'item',
            url: `/funil/produtos/${product_id}/editar-eventos/cart_abandoned`,
            breadcrumbs: false
          }
        ]
      }
    ]
  };
};

const funnelMenuItems = (product_id: string): { items: NavItemType[] } => {
  return {
    items: [getMainItems(product_id)]
  };
};

export default funnelMenuItems;
