<script>
  import supabase from "$lib/db";
  import { onMount } from "svelte";

  let todos = [];
  let newTask;
  onMount(async () => {
    await getAllTodos();
  });

  const getAllTodos = async () => {
    let { data, error } = await supabase.from("todos").select("*");
    todos = data;
  };

  const addTodo = async (task) => {
    try {
      const { data, error } = await supabase
        .from("todos")
        .insert([{ task: newTask }]);
      await getAllTodos();
      newTask = "";
    } catch (err) {
      console.log(err);
    }
  };

  const updateTodoTask = async (todo) => {
    try {
      const { data: todoData, error } = await supabase
        .from("todos")
        .update({ task: todo.task, isComplete: todo.isComplete })
        .eq("id", todo.id);
      await getAllTodos();
    } catch (err) {
      console.log(err);
    }
  };

  const deleteTodo = async (todo) => {
    try {
      const { data, error } = await supabase
        .from("todos")
        .delete()
        .eq("id", todo.id);
      await getAllTodos();
    } catch (err) {
      console.log(err);
    }
  };

  const handleKeydown = (e) => {
    if (e.key === "Enter" && newTask !== "") {
      addTodo(newTask);
    }
  };
</script>

{#await todos}
  <p>Loading...</p>
{:then todos}
  <div class="add-todo">
    <input type="text" bind:value={newTask} />
    <button on:click={() => addTodo(newTask)}>Add</button>
  </div>

  {#each todos as todo}
    <div class="todo">
      <input
        type="checkbox"
        checked={todo.isComplete}
        on:change={(e) => {
          todo.isComplete = e.currentTarget.checked;
          updateTodoTask(todo);
        }}
      />
      <input
        type="text"
        name="task"
        class:complete={todo.isComplete}
        value={todo.task}
        on:change={(e) => {
          todo.task = e.currentTarget.value;
          updateTodoTask(todo);
        }}
      />
      <button class="delete" on:click={() => deleteTodo(todo)}>X</button>
    </div>
  {:else}
    <p>No todos found</p>
  {/each}
{/await}

<svelte:window on:keydown={handleKeydown} />

<style>
  .complete {
    text-decoration: line-through;
  }
  .add-todo,
  .todo {
    display: flex;
    margin-bottom: 0.25em;
  }
  .delete {
    color: red;
    /* font-weight: bold; */
  }
</style>
