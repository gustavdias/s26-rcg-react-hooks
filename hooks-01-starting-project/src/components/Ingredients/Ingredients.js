// import React, { useState, useEffect, useCallback } from "react";
// import React, { useReducer, useState, useEffect, useCallback } from "react";
import React, { useReducer, useEffect, useCallback, useMemo } from "react";

import IngredientForm from "./IngredientForm";
import Search from "./Search";
import IngredientList from "./IngredientList";
import ErrorModal from "../UI/ErrorModal";
//import custom hook
import useHttp from '../../hooks/http'

//You put the useReducer() outside of your component, so that the reduce or function isn't recreated every time a component is rendered.
// const ingredientReducer = (state, action) => {}

const ingredientReducer = (currentIngredients, action) => {
  //action is the object which could have a type and then we can use a switch statement to define different cases for different code you want to execute for different types of actions we're getting.
  switch (action.type) {
    case "SET":
      return action.ingredients; //I expect to get an ingredient property which should be an array of ingredients which will replace the old state.
    case "ADD":
      return [...currentIngredients, action.ingredient]; // it should be our older array + new item
    case "DELETE":
      return currentIngredients.filter((ing) => ing.id !== action.id);
    default:
      throw new Error("should not get there");
  }
};

//reducer outside component for isLoading and error useState. outside of the component to a wide unnecessary recreations
// const httpReducer = (curHttpState, action) => {
//   switch (action.type) {
//     case "SEND":
//       return { loading: true, error: null };
//     case "RESPONSE":
//       return { ...curHttpState, loading: false };
//     case "ERROR":
//       return { loading: false, error: action.errorMessage };
//     case "CLEAR":
//       return { ...curHttpState, error: null };
//     default:
//       throw new Error("should not be reached!");
//   }
// };

function Ingredients() {
  //initialize useReducer() that takes useReducer() function ingredientReducer and an optional stater state
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
 //you have to use useHttp() on root
 //useHttp doesn't send the request actually it just sets up the logic for sending a request it sets up our state and it sets up this function which sends a request.
const {isLoading, error, data, sendRequest} =useHttp();


  //the second argument is now not a method to set our user ingredients. Instead we're doing the setting in our reducer. Instead it's a dispatch function.
  //We choose to call dispatch function which will call to dispatch these actions later.
  // const [userIngredients, setUserIngredients] = useState([]);

  //a scenario where using use reducer could make sense as if you have multiple connected states
  //They're both related to ascending http request, they are related
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState();


  //since the reducer was removed into http.js
  // const [httpState, dispatchHttp] = useReducer(httpReducer, {
  //   loading: false,
  //   error: null,
  // });

  //!useEffect(()=>{}) you need to pass a function inside it.
  //For you to manage side effects
  // rendered after every component render cycle
  //side effect means that you have some logic that runs that does affect your application
  //for example we are fetching some data here but it's not getting finished in this current renderer cycle
  //or maybe it affects something which is outside of the scope of your JSX.

  //you don't need the extra useEffect() here because you already do a request on search
  //useEffect(() => {
  //   fetch('https://react-hooks-update.firebaseio.com/ingredients.json')
  //     .then(response => response.json())
  //     .then(responseData => {
  //       const loadedIngredients = [];
  //       for (const key in responseData) {
  //         loadedIngredients.push({
  //           id: key,
  //           title: responseData[key].title,
  //           amount: responseData[key].amount
  //         });
  //       }
  //       setUserIngredients(loadedIngredients);
  //     });
  // }, []);

  //useEffect acts like componentDidUpdate: it runs the function after every component update(re-render).
  // a array with the dependencies of your function: [] only when it changes, that is a re-render.
  //! with [], useEffect() acts like componentDidMount: only runs once after the first render.

  //You can have as many as you want useEffect)()
  useEffect(() => {
    console.log("RENDERING INGREDIENTS", userIngredients);
  }, [userIngredients]);

  //the useCallback() allows you to wrap one of your functions with it.
  //you pass a second argument with the dependencies of your function.
  //It caches you function so it survives re-render cycles, so the specific function is not recreated on the next render
  //! Use useMemo() for optimization useCallback()??
  const filteredIngredientsHandler = useCallback((filteredIngredients) => {
    // setUserIngredients(filteredIngredients);
    dispatch({ type: "SET", ingredients: filteredIngredients }); //to dispatch an action the action could be anything could be a string. But typically it's an object
  }, []);
  //With useReducer(), React will re-render  the component whenever your reducer returns the new state
  const addIngredientHandler = useCallback((ingredient) => {
    // setIsLoading(true);
    // dispatchHttp({ type: "SEND" });
    // fetch(
    //   "https://react-hooks-update-gd-default-rtdb.europe-west1.firebasedatabase.app/ingredients.json",
    //   {
    //     method: "POST",
    //     body: JSON.stringify(ingredient), //axios does it automatically
    //     headers: { "Content-Type": "application/json" }, //axios does it automatically
    //   }
    // )
    //   .then((response) => {
    //     // setIsLoading(false);
    //     dispatchHttp({ type: "RESPONSE" });//
    //     return response.json();
    //   })
    //   .then((responseData) => {
    //     // setUserIngredients((prevIngredients) => [
    //     //   ...prevIngredients,
    //     //   { id: responseData.name, ...ingredient }, //name is for firebase to give you a unique id
    //     // ]);
    //     dispatch({
    //       type: "ADD",
    //       ingredient: { id: responseData.name, ...ingredient },
    //     });
    //   });
  },[]);//[] where you define your dependencies
  //!useMemo() useCallback()??
  const removeIngredientHandler = useCallback((ingredientId) => {
    // setIsLoading(true);
    sendRequest(`https://react-hooks-update-gd-default-rtdb.europe-west1.firebasedatabase.app/ingredients/${ingredientId}.json`, 'DELETE' )

    //!custom hooks - just as all of our hooks you have to use it on the root level.
//So we can't use it in here in the remove ingredient handler.
//That won't work.
    // dispatchHttp({ type: "SEND" });

    //into http custom hooks
    // fetch(
    //   `https://react-hooks-update-gd-default-rtdb.europe-west1.firebasedatabase.app/ingredients/${ingredientId}.json`,
    //   {
    //     method: "DELETE",
    //   }
    // )
    //   .then((response) => {
    //     // setIsLoading(false);
    //     dispatchHttp({ type: "RESPONSE" });

    //     //once you get a response, update the UI
    //     // setUserIngredients((prevIngredients) =>
    //     //   prevIngredients.filter((ingredient) => ingredient.id !== ingredientId)
    //     //); //If they are equal, it is false, so it is not included in the new array created by filter.
    //     dispatch({ type: "DELETE", id: ingredientId });
    //   })
    //   .catch((error) => {
    //     // setError("something went wrong! ", error.message);
    //     // setIsLoading(false);// this is already included too
    //     dispatchHttp({ type: "ERROR", errorMessage: "Something went wrong!" });
    //   });
  },[sendRequest]);

  const clearError = useCallback(() => {
    // dispatchHttp({type: 'CLEAR'});
    // setError(null);
    // setIsLoading(false);
    //react batches this two states together for the next render
    //one render for both
    //   That simply means that calling

    // setName('Max');
    // setAge(30);
    // in the same synchronous (!) execution cycle (e.g. in the same function) will NOT trigger two component re-render cycles.

    // Instead, the component will only re-render once and both state updates will be applied simultaneously.
  },[]);

  //!useMemo() instead of useCallback
  //This tells react when it should rerun this function to create a new object, that it should memorize and we know it should rerun this function whenever the user ingredients change.
const ingredientList = useMemo(()=> {
  return (
    <IngredientList
    ingredients={userIngredients}
    onRemoveItem={removeIngredientHandler}
  />
  )
},[userIngredients, removeIngredientHandler]);//[ list of dependencies that you have]

  return (
    <div className="App">
      {/* {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>} */}
      {/* {httpState.error && <ErrorModal onClose={clearError}>{httpState.error}</ErrorModal>} */}
      {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}

      {/* //Loading */}
      <IngredientForm
        onAddIngredient={addIngredientHandler}
        // loading={isLoading}
        // loading={httpState.loading}
        loading={isLoading}

      />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        {ingredientList}
        {/* Need to add list here! */}
        {/* //!useMemo() */}
        {/* <IngredientList
          ingredients={userIngredients}
          onRemoveItem={removeIngredientHandler}
        /> */}
      </section>
    </div>
  );
}

export default Ingredients;
