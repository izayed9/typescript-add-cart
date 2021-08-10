import React from 'react';
import { Drawer,Grid,LinearProgress,Badge } from '@material-ui/core';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
// Components
import Item from './components/items/Item'
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

  const handleAddToCart = (clicked: CartItemType) => null;

  const handleRemoveFromCart = () => null;
  return (
    <Wrapper>
      <Drawer anchor='right' open={cartOpen} onClose={() => setCartOpen(false)}>
        Goes some here.. and your Own cart
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
  );
}

export default App;
