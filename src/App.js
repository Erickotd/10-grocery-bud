import React, { useState, useEffect } from 'react';
import List from './List';
import Alert from './Alert';

const getLocalStorage = () => {
  let list = localStorage.getItem('groceryList');
  if (list) {
    return JSON.parse(localStorage.getItem('groceryList'));
  } else {
    return [];
  }
};

function App() {
  const [groceryList, setGroceryList] = useState(getLocalStorage());
  const [name, setName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editID, setedItID] = useState(null);
  const [alert, setAlert] = useState({
    show: false,
    message: '',
    type: '',
  });

  const handlerSubmit = (e) => {
    e.preventDefault();
    if (!name) {
      showAlert(true, 'danger', 'please enter value');
    } else if (name && isEditing) {
      setGroceryList(
        groceryList.map((item) => {
          if (item.id === editID) {
            return { ...item, title: name };
          }
          return item;
        })
      );
      setName('');
      setedItID(null);
      setIsEditing(false);
      showAlert(true, 'success', 'value changed');
    } else {
      showAlert(true, 'success', 'item added to the list');
      const newItem = { id: new Date().getTime().toString(), title: name };
      setGroceryList([...groceryList, newItem]);
      setName('');
    }
  };

  const showAlert = (show = false, type = '', msg = '') => {
    setAlert({ show, type, msg });
  };

  const clearList = () => {
    showAlert(true, 'danger', 'empty list');
    setGroceryList([]);
  };

  const removeItem = (id) => {
    showAlert(true, 'danger', 'item removed');
    const newGroceryList = groceryList.filter((grocery) => grocery.id !== id);
    setGroceryList(newGroceryList);
  };

  const editItem = (id) => {
    const specificItem = groceryList.find((item) => item.id === id);
    setIsEditing(true);
    setedItID(id);
    setName(specificItem.title);
  };

  useEffect(() => {
    localStorage.setItem('groceryList', JSON.stringify(groceryList));
  }, [groceryList]);

  return (
    <main>
      <section className="section-center">
        <form className="grocery-form" onSubmit={handlerSubmit}>
          {alert.show && <Alert {...alert} removeAlert={showAlert} />}
          <h3>Grocery Bud</h3>
          <div className="form-control">
            <input
              className="grocery"
              type="text"
              name="grocery-item"
              placeholder="e.g eggs"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <button type="submit" className="submit-btn">
              {isEditing ? 'edit' : 'submit'}
            </button>
          </div>
        </form>
        {groceryList.length > 0 && (
          <div className="grocery-container">
            <List
              groceries={groceryList}
              removeItem={removeItem}
              editItem={editItem}
            />
            <button className="clear-btn" onClick={clearList}>
              Clear items
            </button>
          </div>
        )}
      </section>
    </main>
  );
}

export default App;
