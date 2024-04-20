import { createContext, useReducer } from "react";
import { DUMMY_PRODUCTS } from "../dummy-products";

export const CartContext = createContext({
    items: [],
    addItemToCard: () => { },
    updateItemQuantity: () => { },
})



const shoppingCartReducer = (state, action) => {
    switch (action.type) {
        case "ADD_ITEM":
            const updatedItems = [...state.items];

            const existingCartItemIndex = updatedItems.findIndex(
                (cartItem) => cartItem.id === action.payload
            );
            const existingCartItem = updatedItems[existingCartItemIndex];

            if (existingCartItem) {
                const updatedItem = {
                    ...existingCartItem,
                    quantity: existingCartItem.quantity + 1,
                };
                updatedItems[existingCartItemIndex] = updatedItem;
            } else {
                const product = DUMMY_PRODUCTS.find((product) => product.id === action.payload);
                updatedItems.push({
                    id: action.payload,
                    name: product.title,
                    price: product.price,
                    quantity: 1,
                });
            }

            return {
                ...state,
                items: updatedItems,
            };
        case "UPDATE_ITEM_QUANTITY":
            const updatedItemsNew = [...state.items];
            const updatedItemIndex = updatedItemsNew.findIndex(
                (item) => item.id === action.payload.productId
            );

            const updatedItem = {
                ...updatedItemsNew[updatedItemIndex],
            };

            updatedItem.quantity += action.payload.amount;

            if (updatedItem.quantity <= 0) {
                updatedItemsNew.splice(updatedItemIndex, 1);
            } else {
                updatedItemsNew[updatedItemIndex] = updatedItem;
            }

            return {
                ...state,
                items: updatedItemsNew,
            };
    }
    return state;
}



const CartContextProvider = ({ children }) => {
    const [shoppingCartState, shoppingCartDispatcher] = useReducer(shoppingCartReducer, {
        items: [],
    });

    function handleAddItemToCart(id) {
        shoppingCartDispatcher({
            type: "ADD_ITEM",
            payload: id
        })
    }

    function handleUpdateCartItemQuantity(productId, amount) {
        shoppingCartDispatcher({
            type: "UPDATE_ITEM_QUANTITY",
            payload: { productId, amount }
        })
    }

    const ctxValue = {
        items: shoppingCartState.items,
        addItemToCard: handleAddItemToCart,
        updateItemQuantity: handleUpdateCartItemQuantity
    }


    return <CartContext.Provider value={ctxValue}>
        {children}
    </CartContext.Provider>
}


export default CartContextProvider;

