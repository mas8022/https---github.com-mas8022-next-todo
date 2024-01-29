import Navbar from "./components/Navbar";
import context from "./context";
import { useEffect, useState } from "react";
import Home from "./pages/Home/Home";

function App() {
  const [them, setThem] = useState(() => {
    const localThem = JSON.parse(localStorage.getItem("them"));
    return localThem ? localThem : "sun";
  });
  const [user, setUser] = useState({});
  const [allTodo, setAllTodo] = useState([]);
  const [todo, setTodo] = useState("");
  const [todoColor, setTodoColor] = useState("#ff0000");
  const [percentProgres, setPercentProgres] = useState(0);

  useEffect(() => {
    localStorage.setItem("them", JSON.stringify(them));
  }, [them]);

  useEffect(() => {
    calPercentProgresHandler();
  }, [allTodo.length]);

  const calPercentProgresHandler = () => {
    let todoComplete = allTodo.filter((todo) => todo.complete === true);
    let percentProcess = Math.ceil(
      (todoComplete.length / allTodo.length) * 100
    );
    setPercentProgres(percentProcess);
  };

  return (
    <context.Provider
      value={{
        user,
        setUser,
        them,
        setThem,
        allTodo,
        setAllTodo,
        todo,
        setTodo,
        todoColor,
        setTodoColor,
        calPercentProgresHandler,
        percentProgres,
        setPercentProgres,
      }}
    >
      <div className="App">
        <Navbar />
        <Home />
      </div>
    </context.Provider>
  );
}

export default App;
