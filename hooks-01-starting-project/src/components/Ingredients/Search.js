import React, { useState, useEffect, useRef } from "react";

import Card from "../UI/Card";
import "./Search.css";

const Search = React.memo((props) => {
  //object destructuring to get onChange of search on ingredients
  //In object destructuring you specify the names of the keys that you want to extract
  const { onLoadIngredients } = props;

  const [enteredFilter, setEnteredFilter] = useState("");
  // const  [enteredFilter, setEnteredFilter] = useState('');

  //useRef allows you to create a reference that you can assign to a DOM element
  const inputRef = useRef();
  useEffect(() => {
    //every time the user types something on search, a request is sen to the database, how avoid it:
    //wait for the user to stop typing for 5000ms and then send the request
   
    //! if there is a keystroke, the old timer should be dismissed. So you should clean up the timer
    const timer = setTimeout(() => {
      //if enter value is the same as 500ms ago
      //enteredFilter is not the current value, but 500ms ago value.
      //you get the current value (inputRef.current.value) with a reference.
     //if the value of 500ms ago is the same as ref (useRef()), it means that the value didn't change
      if (enteredFilter === inputRef.current.value) {
        const query =
          enteredFilter.length === 0
            ? ""
            : `?orderBy="title"&equalTo="${enteredFilter}"`; //how to use filter on firebase
        ///!to allow filtering on firebase you have to add "Ingredients":{ '.indexOn:["title"]'} //? title is the field name that you want to filter

        fetch(
          "https://react-hooks-update-gd-default-rtdb.europe-west1.firebasedatabase.app/ingredients.json" + query
        )
          .then((response) => response.json())
          .then((responseData) => {
            const loadedIngredients = [];
            for (const key in responseData) {
              loadedIngredients.push({
                id: key,
                title: responseData[key].title,
                amount: responseData[key].amount,
              });
            }
            onLoadIngredients(loadedIngredients);
          });
      }
    }, 500);
    //! to clean the timeout
    //when you return something, it always should be a function that will run before the the same useEffect runs the next time (clean up function)
    //if you have [] as dependencies (so the useEffect only runs once), the cleanup function runs when the component gets unmounted
    return () => {
      clearTimeout(timer);
    };
    //firebase supports filtering
  }, [enteredFilter, onLoadIngredients, inputRef]); //if you pass props here, if anything changes in props(ingredients.js) it will re-render
  //you want to pass a dependency that changes only when the user types on search.
  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input
            type="text"
            // useRef allows you to create a reference, what you put inside of ref, goes to inputRef = useRef()
            ref={inputRef}
            value={enteredFilter}
            onChange={(event) => setEnteredFilter(event.target.value)}
          />
        </div>
      </Card>
    </section>
  );
});

export default Search;
