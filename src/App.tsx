import React from 'react';
import { Drawer,Grid,LinearProgress,Badge } from '@material-ui/core';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
// Components
import Item from './components/items/Item';
import Cart from './components/cart/Cart';
import Header from './components/header/index'

// styles

import { Wrapper, StyledButton } from './App.styles';

import { useQuery } from 'react-query';
import { useState } from 'react';


// Types

export type CartItemType = {
  id: number;
  category: string;
  description: string;
  image: string;
  price: number;
  title: string;
  amount: number;
};




const getProducts = async (): Promise<CartItemType[]> =>
  await (await fetch('https://fakestoreapi.com/products')).json();

const App = () => {

  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([] as CartItemType[])

  const { data, isLoading, error } = useQuery<CartItemType[]>(
    'products',
    getProducts
  );
  console.log(data)
  if (isLoading) return <LinearProgress />
  if (error) return <div>Something went wrong...</div>

  const getTotalItems = (items: CartItemType[]) =>
    items.reduce((ack:number, item)=> ack + item.amount, 0)

  ;

  const handleAddToCart = (clickedItem: CartItemType) => {
    setCartItems(prev => {
      // 1. Is the item already added in the cart?
      const isItemInCart = prev.find(item => item.id === clickedItem.id);

      if (isItemInCart) {
        return prev.map(item =>
          item.id === clickedItem.id
            ? { ...item, amount: item.amount + 1 }
            : item
        );
      }
      // First time the item is added
      return [...prev, { ...clickedItem, amount: 1 }];
    });
  };

  const handleRemoveFromCart = (id: number) => {
    setCartItems(prev =>
      prev.reduce((ack, item) => {
        if (item.id === id) {
          if (item.amount === 1) return ack;
          return [...ack, { ...item, amount: item.amount - 1 }];
        } else {
          return [...ack, item];
        }
      }, [] as CartItemType[])
    );
  };
  return (
    <>
      <Wrapper>
      <Header />
      <Drawer anchor='right' open={cartOpen} onClose={() => setCartOpen(false)}>

        <Cart
          cartItems={cartItems}
          addToCart={handleAddToCart}
          removeFromCart={handleRemoveFromCart}
        />
      </Drawer>
      <StyledButton onClick={() => setCartOpen(true)}>
       <Badge badgeContent={getTotalItems(cartItems)} color='error'>
          <ShoppingCartIcon />
        </Badge>
      </StyledButton>
      <Grid container spacing={3}>
        {data?.map(item => (
          <Grid item key={item.id} xs={12} sm={4}>
            <Item item={item} handleAddToCart={ handleAddToCart}/>
          </Grid>
        ))}
      </Grid>
    </Wrapper>
    </>
  );
}

export default App;
