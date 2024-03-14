import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// types
import { MenuProps } from 'types/menu';

// initial state
const initialState: MenuProps = {
  openItem: ['dashboard'],
  openComponent: 'buttons',
  selectedID: null,
  drawerOpen: true,
  componentDrawerOpen: false,
  menu: {},
  error: null
};

// ==============================|| SLICE - MENU ||============================== //

export const fetchMenu = createAsyncThunk('', async () => {
  return {
    dashboard: [
      {
        id: 'dashboard',
        type: 'group',
        title: 'Dashboard',
        children: [
          {
            id: 'analytics',
            title: 'Analytics',
            type: 'item',
            url: '/dashboard/analytics',
            breadcrumbs: false
          },
          {
            id: 'sales',
            title: 'Sales',
            type: 'item',
            url: '/dashboard/sales',
            breadcrumbs: false
          },
          {
            id: 'crypto',
            title: 'Crypto',
            type: 'item',
            url: '/dashboard/crypto',
            breadcrumbs: false
          },
          {
            id: 'campaign',
            title: 'Campaign',
            type: 'item',
            url: '/dashboard/campaign',
            breadcrumbs: false
          },
          {
            id: 'calendar',
            title: 'Calendar',
            type: 'item',
            url: '/dashboard/calendar',
            breadcrumbs: false
          }
        ]
      }
    ]
  };
});

const menu = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    activeItem(state, action) {
      state.openItem = action.payload.openItem;
    },

    activeID(state, action) {
      state.selectedID = action.payload;
    },

    activeComponent(state, action) {
      state.openComponent = action.payload.openComponent;
    },

    openDrawer(state, action) {
      state.drawerOpen = action.payload;
    },

    openComponentDrawer(state, action) {
      state.componentDrawerOpen = action.payload.componentDrawerOpen;
    },

    hasError(state, action) {
      state.error = action.payload;
    }
  },

  extraReducers(builder) {
    builder.addCase(fetchMenu.fulfilled, (state, action) => {
      state.menu = action.payload.dashboard as any;
    });
  }
});

export default menu.reducer;

export const { activeItem, activeComponent, openDrawer, openComponentDrawer, activeID } = menu.actions;
