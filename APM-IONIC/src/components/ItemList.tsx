import React, { useState } from 'react';
import { IonList, IonItem, IonModal, IonAlert } from '@ionic/react';

interface Item {
  id: number;
  name: string;
  additionalInfo: string;
}

interface ItemListProps {
  items: Item[];
  onDelete: (id: number) => void;
}

const ItemList: React.FC<ItemListProps> = ({ items, onDelete }) => {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const handleItemClick = (item: Item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const handleDeleteClick = (id: number) => {
    setSelectedItem(items.find(item => item.id === id) || null);
    setShowAlert(true);
  };
  

  const handleConfirmDelete = () => {
    if (selectedItem) {
      onDelete(selectedItem.id);
    }
    setSelectedItem(null);
    setShowAlert(false);
  };

  return (
    <>
      <IonList>
        {items.map(item => (
           <IonItem key={item.id}>
            <div style={{padding:8 }} >
                <div>{item.name}</div>
                <div>{item.additionalInfo}</div>
                <button onClick={() => onDelete(item.id)}>Eliminar</button>
            </div>
               
         </IonItem>
        ))}
      </IonList>

      <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
        {selectedItem && (
          <>
            <div style={{ background: 'red', zIndex: 9999 }}>
                <h2 color='black'>{selectedItem.name}</h2>
                <p>{selectedItem.additionalInfo}</p>
            </div>
          </>
        )}
      </IonModal>

      <IonAlert
        isOpen={showAlert}
        onDidDismiss={() => setShowAlert(false)}
        header="Confirmar eliminación"
        message="¿Estás seguro de que deseas eliminar este elemento?"
        buttons={[
          {
            text: 'Cancelar',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              setShowAlert(false);
            },
          },
          {
            text: 'Eliminar',
            handler: handleConfirmDelete,
          },
        ]}
      />
    </>
  );
};

export default ItemList;