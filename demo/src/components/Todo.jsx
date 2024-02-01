import { useContext } from "react";
import context from "../context";
import swal from "sweetalert";
export default function Todo({ todo, date, todoColor, id, complete }) {
  const contextTodo = useContext(context);

  const calPercentProgresHandler = async () => {
    let allTodo = await fetch("http://localhost:3031/todos").then((res) =>
      res.json()
    );
    let todoComplete = allTodo.filter((todo) => todo.complete === true);
    console.log(todoComplete);

    let percentProcess = Math.ceil(
      (todoComplete.length / allTodo.length) * 100
    );
    contextTodo.setPercentProgres(percentProcess);
  };

  const completeTodo = async () => {
    swal({
      icon: "warning",
      text: "Are You Sure To Complete The Todo",
      buttons: true,
    }).then((res) => {
      if (res) {
        fetch(`http://localhost:3031/todos/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id,
            todo,
            todoColor,
            date: new Date().toLocaleDateString(),
            complete: true,
          }),
        }).then((res) => res.ok && calPercentProgresHandler());
      }
    });
  };

  const editTodo = (id) => {
    swal({
      content: {
        element: "input",
        attributes: {
          placeholder: "Type your todo",
          type: "text",
        },
      },
      buttons: true,
    }).then((res) => {
      if (res) {
        fetch(`http://localhost:3031/todos/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id,
            todo: res,
            todoColor,
            date: new Date().toLocaleDateString(),
            complete: false,
          }),
        });
      }
    });
  };

  const deleteTodo = (id) => {
    let newAllTodo = contextTodo.allTodo.filter((todo) => todo.id != id);

    swal({
      icon: "warning",
      text: "Are You Sure To Delete The Todo",
      buttons: true,
    }).then((res) => {
      if (res) {
        contextTodo.setAllTodo(newAllTodo);
        fetch(`http://localhost:3031/todos/${id}`, {
          method: "DELETE",
        });
      }
    });
  };

  return (
    <div style={{ background: `${todoColor}` }} className="todo">
      <p className={complete ? "todo__text complete" : "todo__text"}>{todo}</p>
      <div className="todo__bottomTodo">
        <p className="todo__bottomTodo__date">{date}</p>
        <div className="todo__bottomTodo__btns">
          {!complete ? (
            <img
              onClick={() => completeTodo(id)}
              className="image todo__bottomTodo__btn"
              src="../../public/images/complete.svg"
              alt="complete icon"
            />
          ) : null}
          <img
            onClick={() => editTodo(id)}
            className="image todo__bottomTodo__btn"
            src="../../public/images/edit.svg"
            alt="edit icon"
          />
          <img
            onClick={() => deleteTodo(id)}
            className="image todo__bottomTodo__btn"
            src="../../public/images/delete.svg"
            alt="delete icon"
          />
        </div>
      </div>
    </div>
  );
}
