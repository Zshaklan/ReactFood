import { createContext, useState } from "react";

export const UserProgressContext = createContext({
  progress: "",
  showCart: () => {},
  hideCart: () => {},
  showCheckout: () => {},
  hideCheckout: () => {},
});

export default function UserProgressContextProvider({ children }) {
  const [progress, setProgress] = useState("");

  const showCart = () => setProgress("cart");
  const hideCart = () => setProgress("");
  const showCheckout = () => setProgress("checkout");
  const hideCheckout = () => setProgress("");

  const UserProgressCtx = {
    progress,
    showCart,
    hideCart,
    showCheckout,
    hideCheckout,
  };

  return (
    <UserProgressContext.Provider value={UserProgressCtx}>
      {children}
    </UserProgressContext.Provider>
  );
}
