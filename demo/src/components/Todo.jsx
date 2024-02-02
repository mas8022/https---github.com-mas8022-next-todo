import { useContext } from "react";
import context from "../context";
import swal from "sweetalert";
export default function Todo({ todo, date, todoColor, id, complete }) {
  const contextTodo = useContext(context);

  const calPercentProgressHandler = async (newAllTodo) => {
    if (newAllTodo.length) {
      let todoComplete = newAllTodo.filter((item) => item.complete === true);

      console.log(todoComplete);

      let percentProcess = await Math.ceil(
        (todoComplete.length / contextTodo.allTodo.length) * 100
      );
      contextTodo.setPercentProgress(percentProcess);
    }
  };

  const completeTodo = async () => {
    swal({
      icon: "warning",
      text: "Are You Sure To Complete The Todo",
      buttons: true,
    }).then(async (res) => {
      if (res) {
        if (contextTodo.allTodo.length) {
          let newAllTodo = [...contextTodo.allTodo].map((item) => {
            if (item.id === id) {
              todo = {
                id: item.id,
                todo: item.todo,
                todoColor: item.todoColor,
                date: item.date,
                complete: true,
              };
              return todo;
            }
            return item;
          });
          await contextTodo.setAllTodo(newAllTodo);
          calPercentProgressHandler(newAllTodo);
        }
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
        let newAllTodo = [...contextTodo.allTodo].map((item) => {
          if (item.id === id) {
            todo = {
              id: item.id,
              todo: res,
              todoColor: item.todoColor,
              date: new Date().toLocaleDateString(),
              complete: false,
            };
            return todo;
          }
          return item;
        });
        contextTodo.setAllTodo(newAllTodo);
        calPercentProgressHandler(newAllTodo);
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
        if (!newAllTodo.length) {
          contextTodo.setPercentProgress(0);
        }
      }
    });
  };

  return (
    <div style={{ background: `${todoColor}` }} className="todo shad">
      <p className={complete ? "todo__text complete" : "todo__text"}>{todo}</p>
      <div className="todo__bottomTodo">
        <p className="todo__bottomTodo__date">{date}</p>
        <div className="todo__bottomTodo__btns">
          {!complete ? (
            <img
              onClick={() => completeTodo(id)}
              className="image todo__bottomTodo__btn"
              src="/images/complete.svg"
              alt="complete icon"
            />
          ) : null}
          <img
            onClick={() => editTodo(id)}
            className="image todo__bottomTodo__btn"
            src="/images/edit.svg"
            alt="edit icon"
          />
          <img
            onClick={() => deleteTodo(id)}
            className="image todo__bottomTodo__btn"
            src="/images/delete.svg"
            alt="delete icon"
          />
        </div>
      </div>
    </div>
  );
}
