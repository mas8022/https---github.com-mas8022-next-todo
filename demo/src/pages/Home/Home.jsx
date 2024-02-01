import { useEffect, useContext, useState } from "react";
import Todo from "../../components/Todo";
import context from "../../context";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function Home() {
  const contextHome = useContext(context);
  const [todoDate, setTodoDate] = useState(new Date());

  useEffect(() => {
    fetch("http://localhost:3031/todos")
      .then((res) => res.json())
      .then((data) => contextHome.setAllTodo(data));
  }, []);

  useEffect(() => {
    fetch("http://localhost:3031/todos")
      .then((res) => res.json())
      .then((data) => contextHome.setAllTodo(data));
  }, [contextHome.allTodo]);

  const registerTodo = async () => {
    if (contextHome.todo.trim()) {
      await fetch("http://localhost:3031/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: crypto.randomUUID(),
          todo: contextHome.todo,
          todoColor: contextHome.todoColor,
          date: todoDate.toString().slice(0, 15),
          complete: false,
        }),
      }).then((res) => {
        if (res.ok) {
          contextHome.setTodo("");
          contextHome.setTodoColor("#ff0000");
        }
      });
    }
  };

  const setdateHandler = (e) => {
    let newDate = String(e).slice(0, 15);
    setTodoDate(newDate);
  };

  return (
    <div className="home">
      <div className="addTodo">
        <img
          onClick={registerTodo}
          className="image"
          src="../../../public/images/plus.svg"
          alt="add icon"
        />
        <input
          className="home__input__text"
          value={contextHome.todo}
          onChange={(e) => contextHome.setTodo(e.target.value)}
          type="text"
          placeholder="write your todo..."
        />
        <input
          value={contextHome.todoColor}
          onChange={(e) => contextHome.setTodoColor(e.target.value)}
          className="home__input__color"
          type="color"
        />
      </div>

      <Calendar
        onClickDay={setdateHandler}
        value={todoDate}
        onChange={(e) => setTodoDate(e)}
      />

      <div className="showTodosContainer">
        {contextHome.allTodo ? (
          contextHome.allTodo.map((todo) => <Todo key={todo.id} {...todo} />)
        ) : (
          <div className="showTodosContainer__alert_noExist">
            <img
              className="image"
              src="../../../public/images/happy.svg"
              alt="no exist"
            />
            <p>No Exist Todo Here</p>
          </div>
        )}
      </div>
    </div>
  );
}
