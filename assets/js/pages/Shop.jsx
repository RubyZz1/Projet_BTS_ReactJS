import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import "../../styles/shoppage.css"
import Navbar from '../../js/components/Navbar';
import handleAddToCart from '../../js/components/Navbar';
import cartIconEmpty from '../../js/components/images/cart-icon-empty.png';
import cartIconFull from '../../js/components/images/cart-icon-full.png';
import { toast } from "react-toastify";

function ShopPage() {

  const [basket, setBasket] = useState([]);
  const[products, setProducts] = useState([]);

  const [cartCount, setCartCount] = useState(0);
  const [cartIcon, setCartIcon] = useState(cartIconEmpty);

  const data = basket.map((data) => data.quantite > 1);

  function handleAddToCart() {
    setCartCount(cartCount + data);
    setCartIcon(cartIconFull);
  }

  useEffect(() => {
    Axios.get("http://127.0.0.1:8000/api/produits").then((res) => {
      setProducts(res.data["hydra:member"]);
  });
      Axios.get("http://127.0.0.1:8000/api/paniers").then((res) => {
      setBasket(res.data["hydra:member"]);
    });
  },[]);
  const img = 'https://placehold.it/300x200';
  console.log(products)

  function handleBuyClick(product) {
    const { id, nom , prix, reference} = product;
    const cardInfo = {
      quantite: 1,
      idProduit: id,
      nomProduit: nom,
      prixProduit: prix,
      referenceProduit: reference,
    };
    console.log(cardInfo);
    Axios.post("http://127.0.0.1:8000/api/paniers", cardInfo)
    toast.success("Le Produit a bien été ajouté");
  
  }

  const handleDelete = async (id) => {
    const originalProduct = [...products];

    setProducts(products.filter((products) => products.id !== id));

    try {
      await Axios
      .delete("http://127.0.0.1:8000/api/produits/" + id)
      toast.success("Le Produit a bien été supprimé");
    } catch (error) {
      setProducts(originalProduct);
      toast.error("La suppression du Produit n'a pas pu fonctionner");
    }
  };

 
  return (
    <div className="marketplace">
      <h1>Bienvenue sur notre marketplace</h1>

      <div className='shop'>
    <ul>
      <li>
      {basket.length > 0 ?
        <img className='panier-logo' src={cartIconFull} alt="Logo panier plein" /> :
        <img className='panier-logo' src={cartIconEmpty} alt="Logo panier vide" />
      }
      </li>
    </ul>
    </div>

      <div className="card-container">
        {products.map((product) => (
          <div className="card" key={product.id}>
            <img src={img} alt={product.nom} />
            <h2>{product.nom}</h2>
            <div className="price">${product.prix}</div>
            <button id='button1' onClick={() => handleBuyClick(product)}>Acheter</button>
            <button id='button2' onClick={() => handleDelete(product)}>Supprimer</button>
            <button onClick={handleAddToCart}>TEST</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ShopPage;
