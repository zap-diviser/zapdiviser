import _ from 'lodash';

type Events =
  | 'form_submitted'
  | 'card_approved'
  | 'card_declined'
  | 'pix_generated'
  | 'pix_approved'
  | 'cart_abandoned';

type EventMapperBase = {
  mapTo: Events;
};

type ValueEventMapper = EventMapperBase & {
  type: 'value';
  value: string | number;
};

type FunctionEventMapper = EventMapperBase & {
  type: 'function';
  fn: (value: any, event: string) => boolean;
};

type Handler = {
  name: string;
  detect: (data: any) => boolean;
  phonePath: string;
  namePath: string;
  eventPath: string;
  eventMap: (ValueEventMapper | FunctionEventMapper)[];
};

const handlers: Handler[] = [
  {
    name: 'cashtime',
    detect: (data) => {
      return _.has(data, 'data.postbackUrl');
    },
    phonePath: 'data.customer.phone',
    namePath: 'data.customer.name',
    eventPath: 'data',
    eventMap: [
      {
        type: 'function',
        fn: (value) => {
          return (
            value.data.status === 'paid' &&
            value.data.paymentMethod === 'credit_card'
          );
        },
        mapTo: 'card_approved',
      },
      {
        type: 'function',
        fn: (value) => {
          return (
            value.data.status === 'refused' &&
            value.data.paymentMethod === 'credit_card'
          );
        },
        mapTo: 'card_declined',
      },
      {
        type: 'function',
        fn: (value) => {
          return (
            value.data.status === 'paid' && value.data.paymentMethod === 'pix'
          );
        },
        mapTo: 'pix_approved',
      },
      {
        type: 'function',
        fn: (value) => {
          return (
            value.data.status === 'waiting_payment' &&
            value.data.paymentMethod === 'pix'
          );
        },
        mapTo: 'pix_generated',
      },
    ],
  },
  {
    name: 'perfectpay',
    detect: (data) => {
      return _.has(data, 'customer.phone_number');
    },
    phonePath: 'customer.phone_formated_ddi',
    namePath: 'customer.full_name',
    eventPath: 'sale_status_enum',
    eventMap: [
      {
        type: 'value',
        value: 12,
        mapTo: 'cart_abandoned',
      },
      {
        type: 'function',
        fn: (value) => {
          return value.sale_status_enum === 1 && value.payment_type_enum === 7;
        },
        mapTo: 'pix_generated',
      },
      {
        type: 'function',
        fn: (value) => {
          return value.sale_status_enum === 1 && value.payment_type_enum === 2;
        },
        mapTo: 'pix_approved',
      },
      {
        type: 'function',
        fn: (value) => {
          return value.sale_status_enum === 1 && value.payment_type_enum === 1;
        },
        mapTo: 'card_approved',
      },
      {
        type: 'function',
        fn: (value) => {
          return value.sale_status_enum === 5 && value.payment_type_enum === 1;
        },
        mapTo: 'card_declined',
      },
    ],
  },
  {
    name: 'hotmart',
    detect: (data) => {
      return _.has(data, 'data.buyer.phone');
    },
    phonePath: 'data.buyer.phone',
    namePath: 'data.buyer.name',
    eventPath: 'event',
    eventMap: [
      {
        type: 'value',
        value: 'PURCHASE_OUT_OF_SHOPPING_CART',
        mapTo: 'cart_abandoned',
      },
      {
        type: 'function',
        fn: (value) =>
          value.purchase.status === 'APPROVED' &&
          value.purchase.payment.type === 'CREDIT_CARD',
        mapTo: 'card_approved',
      },
      {
        type: 'function',
        fn: (value) =>
          value.purchase.status === 'CANCELLED' &&
          value.purchase.payment.type === 'CREDIT_CARD',
        mapTo: 'card_declined',
      },
      {
        type: 'function',
        fn: (value) =>
          value.purchase.status === 'WAITING_PAYMENT' &&
          value.purchase.payment.type === 'PIX',
        mapTo: 'pix_generated',
      },
      {
        type: 'function',
        fn: (value) =>
          value.purchase.status === 'APPROVED' &&
          value.purchase.payment.type === 'PIX',
        mapTo: 'pix_approved',
      },
    ],
  },
  {
    name: 'kiwify',
    detect: (data) => {
      return _.has(data, 'Customer.mobile');
    },
    phonePath: 'Customer.full_name',
    namePath: 'Customer.mobile',
    eventPath: 'order_status',
    eventMap: [
      {
        type: 'value',
        value: 'paid',
        mapTo: 'card_approved',
      },
    ],
  },
  {
    name: 'eduzz',
    detect: (data) => {
      return _.has(data, 'customer.phone') && _.has(data, 'product_name');
    },
    phonePath: 'customer.phone',
    namePath: 'customer.name',
    eventPath: 'event_name',
    eventMap: [
      {
        type: 'value',
        value: 'cart_abandonment',
        mapTo: 'cart_abandoned',
      },
    ],
  },
  {
    name: 'pepper',
    detect: (data) => {
      return data.payment_engine === 'pepper';
    },
    phonePath: 'phone_number',
    namePath: 'name',
    eventPath: 'status',
    eventMap: [
      {
        type: 'value',
        value: 'WaitingPayment',
        mapTo: 'pix_generated',
      },
    ],
  },
  {
    name: 'yampi',
    detect: (data) => {
      return _.has(data, 'resource.customer.data.phone.full_number');
    },
    phonePath: 'resource.customer.data.phone.full_number',
    namePath: 'resource.customer.data.name',
    eventPath: 'event',
    eventMap: [
      {
        type: 'value',
        value: 'cart.reminder',
        mapTo: 'cart_abandoned',
      },
      {
        type: 'value',
        value: 'transaction.payment.refused',
        mapTo: 'card_declined',
      },
      {
        type: 'function',
        fn: (value, event) =>
          event === 'order.created' &&
          value.resource.search.payment_method === 'pix',
        mapTo: 'pix_generated',
      },
      {
        type: 'function',
        fn: (value, event) =>
          event === 'order.paid' &&
          value.resource.search.payment_method === 'pix',
        mapTo: 'pix_approved',
      },
      {
        type: 'function',
        fn: (value, event) =>
          event === 'order.created' &&
          value.resource.search.payment_method === 'credit_card',
        mapTo: 'card_approved',
      },
    ],
  },
  {
    name: 'vega',
    detect: (data) => {
      return _.has(data, 'store_name');
    },
    eventPath: 'status',
    namePath: 'customer.name',
    phonePath: 'customer.phone',
    eventMap: [
      {
        type: 'value',
        value: 'abandoned_cart',
        mapTo: 'cart_abandoned',
      },
      {
        type: 'function',
        fn: (value, event) => {
          return event === 'approved' && value.method === 'credit_card';
        },
        mapTo: 'card_approved',
      },
      {
        type: 'function',
        fn: (value, event) => {
          return event === 'refused' && value.method === 'credit_card';
        },
        mapTo: 'card_declined',
      },
      {
        type: 'function',
        fn: (value, event) => {
          return event === 'pending' && value.method === 'pix';
        },
        mapTo: 'pix_generated',
      },
      {
        type: 'function',
        fn: (value, event) => {
          return event === 'approved' && value.method === 'pix';
        },
        mapTo: 'pix_approved',
      },
    ],
  },
  {
    name: 'hofficePay',
    detect: (data) => {
      return _.has(data, 'paymentId');
    },
    eventPath: 'status',
    namePath: 'customer.name',
    phonePath: 'customer.phone',
    eventMap: [
      {
        type: 'value',
        value: 'ABANDONED_CART',
        mapTo: 'cart_abandoned',
      },
      {
        type: 'function',
        fn: (value, event) => {
          return event === 'APPROVED' && value.paymentMethod === 'CREDIT_CARD';
        },
        mapTo: 'card_approved',
      },
      {
        type: 'function',
        fn: (value, event) => {
          return event === 'REJECTED' && value.paymentMethod === 'CREDIT_CARD';
        },
        mapTo: 'card_declined',
      },
      {
        type: 'function',
        fn: (value, event) => {
          return event === 'PENDING' && value.paymentMethod === 'PIX';
        },
        mapTo: 'pix_generated',
      },
      {
        type: 'function',
        fn: (value, event) => {
          return event === 'APPROVED' && value.paymentMethod === 'PIX';
        },
        mapTo: 'pix_approved',
      },
    ],
  },
  {
    name: 'payt',
    detect: (data) => {
      return _.has(data, 'integration_key');
    },
    eventPath: 'type',
    namePath: 'customer.name',
    phonePath: 'customer.phone',
    eventMap: [
      {
        type: 'value',
        value: 'abandoned-cart',
        mapTo: 'cart_abandoned',
      },
      {
        type: 'function',
        fn: (value, event) => {
          return (
            event === 'order' &&
            value.status === 'paid' &&
            _.get(value, 'transaction.payment_method') === 'credit_card'
          );
        },
        mapTo: 'card_approved',
      },
      {
        type: 'function',
        fn: (value, event) => {
          return (
            event === 'order' &&
            value.status === 'cancelled' &&
            _.get(value, 'transaction.payment_method') === 'credit_card'
          );
        },
        mapTo: 'card_declined',
      },
      {
        type: 'function',
        fn: (value, event) => {
          return (
            event === 'order' &&
            value.status === 'waiting_payment' &&
            _.get(value, 'transaction.payment_method') === 'pix'
          );
        },
        mapTo: 'pix_generated',
      },

      {
        type: 'function',
        fn: (value, event) => {
          return (
            event === 'order' &&
            value.status === 'paid' &&
            _.get(value, 'transaction.payment_method') === 'pix'
          );
        },
        mapTo: 'pix_approved',
      },
    ],
  },
  {
    name: 'elementor',
    detect: (data) => {
      return _.has(data, 'form_id');
    },
    eventPath: 'form_id',
    namePath: 'name',
    phonePath: 'phone',
    eventMap: [
      {
        type: 'function',
        fn: () => true,
        mapTo: 'form_submitted',
      },
    ],
  },
  {
    name: 'elementor_advanced',
    detect: (data) => {
      return _.has(data, 'form.id');
    },
    eventPath: 'form.id',
    namePath: 'fields.name.value',
    phonePath: 'fields.phone.value',
    eventMap: [
      {
        type: 'function',
        fn: () => true,
        mapTo: 'form_submitted',
      },
    ],
  }
];

type HandleResult = {
  name: string;
  phone: string;
  event: Events;
};

export function handle(data: any): HandleResult | null {
  const handler = handlers.find((handler) => handler.detect(data));

  if (!handler) {
    return null;
  }

  let phone = _.get(data, handler.phonePath).replace(/\D/g, '');
  const name = _.get(data, handler.namePath);
  const event = String(_.get(data, handler.eventPath));

  if (!phone.startsWith('55')) {
    phone = `55${phone}`;
  }

  phone = `+${phone}`;

  const eventMapper = handler.eventMap.find((eventMapper) => {
    if (eventMapper.type === 'value') {
      return String(eventMapper.value) === event;
    } else {
      return eventMapper.fn(data, event);
    }
  });

  if (!eventMapper) {
    return null;
  }

  return {
    name,
    phone,
    event: eventMapper.mapTo,
  };
}
