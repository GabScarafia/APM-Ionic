import React, { useEffect, useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ItemList from './components/ItemList';
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import pokeImage from './assets/Pokemon.png';
import { IonApp } from '@ionic/react';
import { Preferences } from '@capacitor/preferences';
import { Toast } from '@capacitor/toast';

interface Pokemon {
  id: number;
  name: string;
  additionalInfo: string;
  url: string;
}

const App: React.FC = () => {
  const [items, setItems] = useState<Pokemon[]>([]);

  useEffect(() => {
    const loadItemsFromAPI = () => {
      fetch('https://pokeapi.co/api/v2/pokemon/')
        .then(response => response.json())
        .then(data => {
          const formattedItems = data.results.map((pokemon: Pokemon, index: number) => ({
            id: index,
            name: pokemon.name,
            additionalInfo: pokemon.url
          }));
          setItems(formattedItems);
          Preferences.set({ key: 'items', value: JSON.stringify(formattedItems) });
        })
        .catch(async () => {
          await Toast.show({
            text: 'Error en la API',
            duration: 'long'
          });
        });
    };
  
    const loadItemsFromPreferences = async () => {
      const storedItems = await Preferences.get({ key: 'items' });
      if (storedItems.value) {
        setItems(JSON.parse(storedItems.value));
      } else {
        loadItemsFromAPI();
      }
    };
  
    loadItemsFromPreferences();
  }, []);

  const handleDeleteItem = (id: number) => {
    // Realiza la llamada a la API para eliminar el elemento con el id especificado
    // Luego, actualiza la lista de elementos
    const updatedItems = items.filter((item, index) => index !== id);
    setItems(updatedItems);
  };

  return (
    <IonApp>
      <IonPage>
        <IonContent>
          <div style={{padding: 4}}>
            <img src={pokeImage} alt="PokeImagen" style={{ maxWidth: '100%', height: 'auto' }}/>
            <ItemList items={items} onDelete={handleDeleteItem} />
          </div>
        </IonContent>
      </IonPage>
    </IonApp>
  );
};

export default App;