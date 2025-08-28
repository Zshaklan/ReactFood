import Button from "./UI/Button";
import appLogoImg from "../assets/logo.jpg";
import { useContext } from "react";
import { CartContext } from "../store/CartContext";
import { UserProgressContext } from "../store/UserProgressContext";

export default function Header() {
  const cartCtx = useContext(CartContext);
  const userProgressCtx = useContext(UserProgressContext);

  const totalCartItems = cartCtx.cartItems.reduce((total, item) => {
    return total + item.quantity;
  }, 0);

  function handleCartClick() {
    userProgressCtx.showCart();
  }

  return (
    <header id="main-header">
      <div id="title">
        <img src={appLogoImg} alt="app-logo" />
        <h1>REACTFOOD</h1>
      </div>

      <nav>
        <Button onClick={handleCartClick} textOnly>
          Cart ({totalCartItems})
        </Button>
      </nav>
    </header>
  );
}
