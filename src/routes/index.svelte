<script>
  import supabase from "$lib/db";
  import Todo from "$lib/Todo.svelte";
  import { onMount } from "svelte";

  let todos = [];
  let newTask = "";

  onMount(async () => {
    await getAllTodos();
  });

  const getAllTodos = async () => {
    try {
      let { data, error } = await supabase.from("todos").select("*");
      todos = data;
    } catch (err) {
      console.log(err);
    }
  };

  const addNewTodo = async () => {
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

  const updateTodo = async (todo) => {
    try {
      const { data, error } = await supabase
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

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && newTask !== "") {
      addNewTodo();
    }
  };
</script>

<div class="add-todo">
  <input type="text" bind:value={newTask} />
  <button on:click={() => addNewTodo()}>Add Task</button>
</div>

{#each todos as todo}
  <Todo {todo} {updateTodo} {deleteTodo} />
{:else}
  <p>No todos found</p>
{/each}

<svelte:window on:keypress={handleKeyPress} />

<style>
  .add-todo {
    display: flex;
    margin-bottom: 0.5em;
  }
</style>
