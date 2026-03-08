'use client';

import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import Cookies from 'js-cookie';
import {
  createCart,
  addCartLines,
  updateCartLines,
  removeCartLines,
  getCart,
  flattenEdges,
} from '@/lib/shopify';

// ─── Context ──────────────────────────────────────────────────────────────────

const CartContext = createContext(null);

const initialState = {
  cartId: null,
  checkoutUrl: null,
  lines: [],          // normalized line items
  totalAmount: '0',
  currencyCode: 'INR',
  itemCount: 0,
  loading: false,
};

function cartReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };

    case 'SET_CART': {
      const cart = action.payload;
      if (!cart) return { ...state, loading: false };
      const lines = flattenEdges(cart.lines).map(normalizeLine);
      const itemCount = lines.reduce((sum, l) => sum + l.quantity, 0);
      return {
        ...state,
        cartId: cart.id,
        checkoutUrl: cart.checkoutUrl,
        lines,
        totalAmount: cart.cost?.totalAmount?.amount || '0',
        currencyCode: cart.cost?.totalAmount?.currencyCode || 'INR',
        itemCount,
        loading: false,
      };
    }

    case 'CLEAR_CART':
      return { ...initialState };

    default:
      return state;
  }
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load existing cart from cookie on mount
  useEffect(() => {
    const savedCartId = Cookies.get('shopify_cart_id');
    if (savedCartId) {
      dispatch({ type: 'SET_LOADING', payload: true });
      getCart(savedCartId)
        .then((cart) => dispatch({ type: 'SET_CART', payload: cart }))
        .catch(() => {
          Cookies.remove('shopify_cart_id');
          dispatch({ type: 'SET_LOADING', payload: false });
        });
    }
  }, []);

  // Save cartId to cookie whenever it changes
  useEffect(() => {
    if (state.cartId) {
      Cookies.set('shopify_cart_id', state.cartId, { expires: 30 });
    }
  }, [state.cartId]);

  // ── Add item ────────────────────────────────────────────────────────────────
  const addItem = useCallback(async (variantId, quantity = 1) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const lines = [{ merchandiseId: variantId, quantity }];

      let cart;
      if (state.cartId) {
        // Check if variant already in cart
        const existing = state.lines.find((l) => l.variantId === variantId);
        if (existing) {
          cart = await updateCartLines(state.cartId, [
            { id: existing.lineId, quantity: existing.quantity + quantity },
          ]);
        } else {
          cart = await addCartLines(state.cartId, lines);
        }
      } else {
        cart = await createCart(lines);
      }
      dispatch({ type: 'SET_CART', payload: cart });
    } catch (err) {
      console.error('addItem error', err);
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.cartId, state.lines]);

  // ── Increment ────────────────────────────────────────────────────────────────
  const incrementItem = useCallback(async (variantId) => {
    const line = state.lines.find((l) => l.variantId === variantId);
    if (!line) return addItem(variantId);
    if (line.quantity >= line.stock) return;

    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const cart = await updateCartLines(state.cartId, [
        { id: line.lineId, quantity: line.quantity + 1 },
      ]);
      dispatch({ type: 'SET_CART', payload: cart });
    } catch (err) {
      console.error('incrementItem error', err);
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.cartId, state.lines, addItem]);

  // ── Decrement ────────────────────────────────────────────────────────────────
  const decrementItem = useCallback(async (variantId) => {
    const line = state.lines.find((l) => l.variantId === variantId);
    if (!line) return;

    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      let cart;
      if (line.quantity <= 1) {
        cart = await removeCartLines(state.cartId, [line.lineId]);
      } else {
        cart = await updateCartLines(state.cartId, [
          { id: line.lineId, quantity: line.quantity - 1 },
        ]);
      }
      dispatch({ type: 'SET_CART', payload: cart });
    } catch (err) {
      console.error('decrementItem error', err);
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.cartId, state.lines]);

  // ── Remove ────────────────────────────────────────────────────────────────────
  const removeItem = useCallback(async (lineId) => {
    if (!state.cartId) return;
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const cart = await removeCartLines(state.cartId, [lineId]);
      dispatch({ type: 'SET_CART', payload: cart });
    } catch (err) {
      console.error('removeItem error', err);
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.cartId]);

  // ── Get item count for a variant ─────────────────────────────────────────────
  const getItemCount = useCallback(
    (variantId) => state.lines.find((l) => l.variantId === variantId)?.quantity || 0,
    [state.lines]
  );

  const value = {
    ...state,
    addItem,
    incrementItem,
    decrementItem,
    removeItem,
    getItemCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}

// ─── Normalize line item ───────────────────────────────────────────────────────

function normalizeLine(line) {
  const variant = line.merchandise;
  return {
    lineId: line.id,
    variantId: variant.id,
    quantity: line.quantity,
    title: variant.product?.title || '',
    variantTitle: variant.title,
    handle: variant.product?.handle || '',
    image: flattenEdges(variant.product?.images)[0]?.url || null,
    price: variant.priceV2?.amount || '0',
    currencyCode: variant.priceV2?.currencyCode || 'INR',
    lineTotal: line.cost?.totalAmount?.amount || '0',
    available: variant.availableForSale,
    stock: variant.quantityAvailable ?? 99,
  };
}
