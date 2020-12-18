import React, { useState } from "react";

import Card from "../UI/Card";
import "./IngredientForm.css";
import LoadingIndicator from '../UI/LoadingIndicator';

const IngredientForm = React.memo((props) => {
  // useXYZ should be used on your func component body (here:)
  //A state inside a Class-Based Component is always an object.
  //A state inside a functional stateful component can be any type of value.

  //!useState() without destructuring
  // const inputState = useState({ title: "", amount: "" });
  // <input
  // type="number"
  // id="amount"
  // value={inputState[0].amount}
  // onChange={(event) => {
  //   const newAmount = event.target.value;
  //   inputState[1]((prevInputState) => ({
  //     amount: newAmount,
  //     title: prevInputState.title,
  //   }));
  // }}/>
  //alternative:
  // const [inputState, setInputState] = useState({ title: "", amount: "" });
  const [enteredTitle, setEnteredTitle] = useState('');
  const [enteredAmount, setEnteredAmount] = useState('');


  const submitHandler = (event) => {
    event.preventDefault();
    props.onAddIngredient({title: enteredTitle, amount: enteredAmount});
  };

  return (
    <section className="ingredient-form">
      <Card>
        <form onSubmit={submitHandler}>
          <div className="form-control">
            <label htmlFor="title">Name</label>
            <input
              type="text"
              id="title"
              value={enteredTitle}
              onChange={(event) => {
                // const newTitle = event.target.value;
                setEnteredTitle(event.target.value);
                // setInputState((prevInputState) => ({
                //   title: newTitle,
                //   amount: prevInputState.amount,
                // }));
              }}
            />
          </div>
          <div className="form-control">
            <label htmlFor="amount">Amount</label>
            <input
              type="number"
              id="amount"
              value={enteredAmount}
              onChange={(event) => {
                // const newAmount = event.target.value;
                setEnteredAmount(event.target.value);
                // setInputState((prevInputState) => ({
                //   amount: newAmount,
                //   title: prevInputState.title, }));
              }}
            />
          </div>
          <div className="ingredient-form__actions">
            <button type="submit">Add Ingredient</button>
            {/* {props.loading? <LoadingIndicator/> : null} */}
            {props.loading && <LoadingIndicator/> }
          </div>
        </form>
      </Card>
    </section>
  );
});

export default IngredientForm;
