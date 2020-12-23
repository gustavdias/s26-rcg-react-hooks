//You don't need to import React because we are not using a react component
import { useReducer, useCallback } from "react";

//it's a normal javascript function just treat it in a special way by react that's the core thing.
//you can use stateful features: useEffect, useReducer

//!http that was in Ingredients.js
//reducer outside component for isLoading and error useState. outside of the component to a wide unnecessary recreations
//Define outside the hook, because it doesn't need to re-run in ever render cycle
const httpReducer = (curHttpState, action) => {
  switch (action.type) {
    case "SEND":
      return { loading: true, error: null };
    case "RESPONSE":
      return { ...curHttpState, loading: false, data: action.responseData };
    case "ERROR":
      return { loading: false, error: action.errorMessage };
    case "CLEAR":
      return { ...curHttpState, error: null };
    default:
      throw new Error("should not be reached!");
  }
};

//Your hook will get called whenever to component where you're using your hook gets re executed
const useHttp = () => {
  const [httpState, dispatchHttp] = useReducer(httpReducer, {
    loading: false,
    error: null,
    data: null,
  });

  //flexible http request
  //if we would not wrap send request with the use callback instead of use HTTP this would actually change whenever the component where we use useHttp, so whenever ingredients renders, and therefore sendRequest would change it on every re-render there and therefore remove ingredient handler would change and we would again lose all our optimizations
  const sendRequest = useCallback((url, method, body) => {
    dispatchHttp({ type: "SEND" });
    fetch(
      // `https://react-hooks-update-gd-default-rtdb.europe-west1.firebasedatabase.app/ingredients/${ingredientId}.json`,
      url,
      {
        //   method: "DELETE",
        method: method,
        body: body,
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => {
        // setIsLoading(false);
        //   dispatchHttp({ type: "RESPONSE" });
        return response.json();
        //once you get a response, update the UI
        // setUserIngredients((prevIngredients) =>
        //   prevIngredients.filter((ingredient) => ingredient.id !== ingredientId)
        //); //If they are equal, it is false, so it is not included in the new array created by filter.
        //   dispatch({ type: "DELETE", id: ingredientId });
        //this doesn't belong it this hook that's something the component that uses our hook needs to do
      })
      .then((responseData) => {
        dispatchHttp({ type: "RESPONSE", responseData: responseData });
      })
      .catch((error) => {
        // setError("something went wrong! ", error.message);
        // setIsLoading(false);// this is already included too
        dispatchHttp({ type: "ERROR", errorMessage: "Something went wrong!" });
      });
  }, []);
  //How do we now connect us to our component
  return {
    isLoading: httpState.loading,
    data: httpState.data,
    error: httpState.error,
    sendRequest: sendRequest, //we return a handle to this function as well.
  }; //you can return anything,it can be a object or a [] or anything
};

export default useHttp;

//any component that uses your own hook will then run this hook as if you had to code written in here directly in the component
//Each Functional Component gets its own snapshot of this hook
//you can have state full logic in there but the state for logic will then be different for each component where you use that hook so that you can shared a logic not the data.
