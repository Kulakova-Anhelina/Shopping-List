import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import * as SQLite from "expo-sqlite";
import { ListItem, Button, Input, Header } from "react-native-elements";

const db = SQLite.openDatabase("shoppingListdb.db");

export default function App() {
  const [product, setProduct] = useState("");
  const [amount, setAmount] = useState("");
  const [data, setData] = useState([]);

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql(
        "create table if not exists shoppingList (id integer primary key not null, amount text, product text);"
      );
    });
    updateList();
  }, []);




  // Save shopingList
  const saveItem = () => {
    db.transaction(
      tx => {
        tx.executeSql(
          "insert into shoppingList (product, amount) values (?, ?);",
          [product, amount]
        );
      },
      null,
      updateList
    );
  setProduct('')
  setAmount('')
  };



  // Update shopingList
  const updateList = () => {
    db.transaction(tx => {
      tx.executeSql("select * from shoppingList;", [], (_, { rows }) =>
        setData(rows._array)
      );
    });
  };

  const deleteItem = id => {
    db.transaction(
      tx => {
        tx.executeSql(`delete from shoppingList where id = ?;`, [id]);
      },
      null,
      updateList
    );
  };

  return (
    <View style={styles.container}>
      <Header
        containerStyle={{ backgroundColor: "#735CDD" }}
        centerComponent={{ text: "SHOPPING LIST", style: { color: "#fff", fontSize: 20 } }}
      />
      <Input
        placeholder="Product"
        label="PRODUCT"
        labelStyle={{
          color: "#37000A"
        }}
        containerStyle={{
          marginTop: 10,
          fontSize: 18
        }}
        onChangeText={(product) => setProduct(product)}
        value={product}
      />

      <Input
        placeholder="Amount"
        label="AMOUNT"
        labelStyle={{
          color: "#37000A"
        }}
        containerStyle={{
          marginTop: 10,
          marginBottom: 10,
          fontSize: 18
        }}
        onChangeText={(amount) => setAmount(amount)}
        value={amount}
      />

      <Button
        onPress={saveItem}
        buttonStyle={{
          width: "90%",
          backgroundColor: "#7E007B"
        }}
        title="Save"
        titleStyle={{ flex: 1 }}
      />
      <View style={{ width: "100%" }}>
        {data.map((item, i) => (
          <ListItem
            key={i}
            title={item.product}
            subtitle={item.amount}
            bottomDivider
            chevron
            rightElement={
              <Text
                style={{ fontSize: 18, color: "#B3C2F2" }}
                onPress={() => deleteItem(item.id)}
              >
                {" "}
                bought
              </Text>
            }
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});
