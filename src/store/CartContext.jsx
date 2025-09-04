import { createContext, useReducer, useEffect } from "react";

export const CartContext = createContext({
  cartItems: [],
  addItem: (item) => {},
  removeItem: (itemId) => {},
  clearCart: () => {},
});

function cartReducer(state, action) {
  if (action.type === "ADD_ITEM") {
    const existingCartItemIndex = state.cartItems.findIndex(
      (item) => item.id === action.item.id
    );

    const updatedCartItems = [...state.cartItems];

    if (existingCartItemIndex > -1) {
      const existingCartItem = state.cartItems[existingCartItemIndex];
      const updatedItem = {
        ...existingCartItem,
        quantity: existingCartItem.quantity + 1,
      };
      updatedCartItems[existingCartItemIndex] = updatedItem;
    } else {
      updatedCartItems.push({ ...action.item, quantity: 1 });
    }
    return { ...state, cartItems: updatedCartItems };
  }

  if (action.type === "REMOVE_ITEM") {
    const existingCartItemIndex = state.cartItems.findIndex(
      (item) => item.id === action.itemId
    );

    const existingItem = state.cartItems[existingCartItemIndex];
    const updatedCartItems = [...state.cartItems];

    if (existingItem.quantity === 1) {
      updatedCartItems.splice(existingCartItemIndex, 1);
    } else {
      const updatedItem = {
        ...existingItem,
        quantity: existingItem.quantity - 1,
      };
      updatedCartItems[existingCartItemIndex] = updatedItem;
    }

    return { ...state, cartItems: updatedCartItems };
  }

  if (action.type === "CLEAR_CART") {
    return { ...state, cartItems: [] };
  }
  return state;
}

// Load cart from localStorage if available
const storedCart = localStorage.getItem("cartItems");
const initialCartState = {
  cartItems: storedCart ? JSON.parse(storedCart) : [],
};

export default function CartContextProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialCartState);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
  }, [state.cartItems]);

  const addItem = (item) => dispatch({ type: "ADD_ITEM", item });
  const removeItem = (itemId) => dispatch({ type: "REMOVE_ITEM", itemId });
  const clearCart = () => dispatch({ type: "CLEAR_CART" });

  const cartContext = {
    cartItems: state.cartItems,
    addItem,
    removeItem,
    clearCart,
  };

  return (
    <CartContext.Provider value={cartContext}>{children}</CartContext.Provider>
  );
}
