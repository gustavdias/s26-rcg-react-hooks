import React from 'react';

import './IngredientList.css';

  //!useMemo()  - alternative to React.memo - useCallback()
  //useCallback() is a hook to save a function that does not change
  //useMemo() a hook where you can save a value which is saved so that the value isn't re created
// another way of memorizing component.
  const IngredientList = React.memo(props => {
  console.log('RENDERING INGREDIENTLIST')
  return (
    <section className="ingredient-list">
      <h2>Loaded Ingredients</h2>
      <ul>
        {props.ingredients.map(ig => (
          <li key={ig.id} onClick={props.onRemoveItem.bind(this, ig.id)}>
            <span>{ig.title}</span>
            <span>{ig.amount}x</span>
          </li>
        ))}
      </ul>
    </section>
  );
});

export default IngredientList;
