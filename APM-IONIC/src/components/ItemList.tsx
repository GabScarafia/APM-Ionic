import React, { useState } from 'react';
import { IonList, IonItem, IonModal, IonAlert } from '@ionic/react';
import './itemList.css';

interface Item {
  id: number;
  name: string;
  additionalInfo: string;
}

interface ItemListProps {
  items: Item[];
  onDelete: (id: number) => void;
}

interface Pokemon {
  abilities: Ability[];
  base_experience: number;
  forms: any[]; 
  game_indices: any[]; 
  height: number;
  held_items: any[]; 
  id: number;
  is_default: boolean;
  location_area_encounters: string;
  moves: any[]; 
  name: string;
  order: number;
  past_types: any[];
  species: any;
  sprites: any; 
  stats: any[]; 
  types: PokemonType[];
  weight: number;
}

interface Ability {
  // Define la estructura de Ability si es necesario
}

interface PokemonType {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

const ItemList: React.FC<ItemListProps> = ({ items, onDelete }) => {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  function getPokeInfo(item : Item){
    fetch(item.additionalInfo)
      .then((response) => response.json())
      .then((data: Pokemon) => {
        setSelectedPokemon(data);
      })
      .catch((error) => {
      });
  }

  const handleItemClick = (item: Item) => {
    setSelectedItem(item);
    getPokeInfo(item);
    setShowModal(true);
  };

  const handleDeleteClick = (id: number) => {
    setSelectedItem(items.find(item => item.id === id) || null);
    setShowAlert(true);
  };
  
  const handleConfirmDelete = () => {
    if (selectedItem) {
      const deletedItemId = selectedItem.id;
      onDelete(deletedItemId);
      setSelectedItem(null);
      const updatedItems = items.filter(item => item.id !== deletedItemId);
      updatedItems.forEach(item => {
        if(item.id >= deletedItemId){
          item.id -=1;
        }
      });
      items.splice(0, items.length, ...updatedItems);
    }
    setShowAlert(false);
  };

  return (
    <>
      <IonList>
        {items.map(item => (
           <IonItem key={item.id} onClick={()=>handleItemClick(item)}>
              <div style={{padding:8 }} >
                  <h1>{item.name}</h1>
                  <button onClick={() => setShowAlert(true)}>Eliminar</button>
              </div>
          </IonItem>
        ))}
      </IonList>

      <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)} className='modal'>
        {selectedItem && (
          <>
            <div className='modal-div'>
                <h1 style={{fontWeight:'bold'}}>{selectedItem.name}</h1>
                <p><b> Pokedex: </b>{selectedPokemon ? selectedPokemon.id : " "}<br/><b> Type: </b>{selectedPokemon ? selectedPokemon.types[0].type.name : " "}<br/><b>Weight: </b>{selectedPokemon ? selectedPokemon.weight : " "}</p>
                <button onClick={() => setShowAlert(true)}>Eliminar</button>
            </div>
          </>
        )}
      </IonModal>

      <IonAlert isOpen={showAlert}
        onDidDismiss={() => setShowAlert(false)}
        header="Confirmar eliminación" message="¿Estás seguro de que deseas eliminar este elemento?"
        buttons={[
          {
            text: 'Cancelar',
            role: 'cancel',
            cssClass: 'alert-button',
            handler: () => {
              setShowAlert(false);
            },
            
          },
          {
            text: 'Eliminar',
            handler: handleConfirmDelete,
            cssClass: 'alert-button',
          },
        ]}
        cssClass="alert"
      />
    </>
  );
};

export default ItemList;