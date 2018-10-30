import React, { Component } from "react";
import { Text, FlatList, TouchableHighlight } from "react-native";

import TodoItem from "./TodoItem";
import UpOneLevelButton from "./UpOneLevelButton";

const TodoList = ({
  handleClickTodo,
  handleDeleteTodo,
  handleUpOneLevelButton,
  todoList,
  embedLevel
}) => (
  <FlatList
    data={todoList}
    renderItem={({ item }) => {
      return item.todo ? (
        <TodoItem
          item={item}
          handleClickTodo={handleClickTodo}
          handleDeleteTodo={handleDeleteTodo}
        />
      ) : null;
    }}
    keyExtractor={item => item._key}
    ListFooterComponent={
      embedLevel ? (
        <UpOneLevelButton handleUpOneLevelButton={handleUpOneLevelButton} />
      ) : null
    }
  />
);

export default TodoList;
