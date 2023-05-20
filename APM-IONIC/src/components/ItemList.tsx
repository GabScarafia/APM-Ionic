import React, { useState } from 'react';
import { IonList, IonItem, IonModal, IonAlert } from '@ionic/react';
import './itemList.css';
import { Preferences } from '@capacitor/preferences';
import { Toast } from '@capacitor/toast';

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

  function getPokeInfo(item: Item) {
    const loadPokemonFromAPI = () => {
      fetch(item.additionalInfo)
        .then(response => response.json())
        .then((data: Pokemon) => {
          setSelectedPokemon(data);
          Preferences.set({ key: data.name, value: JSON.stringify(data) });
        })
        .catch(async () => {
          await Toast.show({
            text: 'Error en la API',
            duration: 'long'
          });
        });
    };
  
    const loadPokemonFromPreferences = async () => {
      const storedPokemon = await Preferences.get({ key: 'selectedPokemon' });
      if (storedPokemon.value) {
        setSelectedPokemon(JSON.parse(storedPokemon.value));
      } else {
        loadPokemonFromAPI();
      }
    };
  
    loadPokemonFromPreferences();
  }

  const handleItemClick = (item: Item) => {
    if(item != selectedItem){
      setSelectedItem(item);
      getPokeInfo(item);
      setShowModal(true);
    }else{
      setSelectedItem(null);
    }
    
  };

  const handleCrossClick = () => {
    setSelectedItem(null);
    setShowModal(false);
  };
  
  const handleConfirmDelete = async() => {
    if (selectedItem) {
      setShowModal(false);
      const deletedItemId = selectedItem.id;
      setSelectedItem(null);
      onDelete(deletedItemId);
      const updatedItems = items.filter(item => item.id !== deletedItemId);
      updatedItems.forEach(item => {
        if(item.id >= deletedItemId){
          item.id -=1;
        }
      });
      items.splice(0, items.length, ...updatedItems);
      await Toast.show({
        text: 'Elemento eliminado exitosamente',
        duration: 'long'
      });
      
    }
    setShowAlert(false);
  };

  return (
    <>
      <IonList>
        {items.map(item => (
           <IonItem key={item.id} onClick={()=>handleItemClick(item)}>
              <div className='table-div' >
                  <h1>{item.name.charAt(0).toUpperCase() + item.name.slice(1)}</h1>
                  <button className='table-cross-button' onClick={() => setShowAlert(true)} >
                    ✖
                  </button>
              </div>
          </IonItem>
        ))}
      </IonList>

      <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)} className='modal'>
        {selectedItem && (
          <>
            <div className='modal-div'>
                <div  className='table-div'>
                  <h1 style={{fontWeight:'bold'}}>{selectedItem.name.charAt(0).toUpperCase() + selectedItem.name.slice(1)}</h1>
                  <button className='modal-cross-button' onClick={() => handleCrossClick()} >
                    ✖
                  </button>
                </div>
                <p><b> Pokedex: </b>{selectedPokemon ? selectedPokemon.id : " "}<br/><b> Type: </b>{selectedPokemon ? selectedPokemon.types[0].type.name : " "}<br/><b>Weight: </b>{selectedPokemon ? selectedPokemon.weight : " "}</p>
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
            cssClass: 'alert-button-cancel',
            handler: () => {
              setShowAlert(false);
            },
            
          },
          {
            text: 'Eliminar',
            handler: handleConfirmDelete,
            cssClass: 'alert-button-do',
          },
        ]}
        cssClass="alert"
      />
    </>
  );
};

export default ItemList;