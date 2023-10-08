import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, FlatList,StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import generateId from "react-id-generator";


const App = () => {
  const [empleados, setEmpleados] = useState([]);
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [sueldo, setSueldo] = useState("");
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    cargarEmpleados();
  }, []);

  const cargarEmpleados = async () => {
    try {
      const listaEmpleados = await AsyncStorage.getItem("empleados");
      if (listaEmpleados !== null) {
        setEmpleados(JSON.parse(listaEmpleados));
      }
    } catch (error) {
      console.error("Error al cargar empleados:", error);
    }
  };
  const eliminarEmpleado = async (empleadoId) => {
    try {
      // Elimina al empleado del AsyncStorage
      await AsyncStorage.removeItem("empleados");
      const nuevosEmpleados = empleados.filter(
        (empleado) => empleado.id !== empleadoId
      );
      await AsyncStorage.setItem("empleados", JSON.stringify(nuevosEmpleados));
      setEmpleados(nuevosEmpleados);
    } catch (error) {
      console.error("Error al eliminar empleado:", error);
    }
  };
  const calcularDescuentos = (sueldo) => {
    if (sueldo <= 325) return 0;
    if (sueldo <= 700) return sueldo * 0.15;
    if (sueldo <= 1200) return sueldo * 0.17;
    if (sueldo <= 2200) return sueldo * 0.21;
    if (sueldo <= 3700) return sueldo * 0.25;
    return sueldo * 0.29;
  };

  const agregarEmpleado = async () => {
    if (nombre && apellido && sueldo) {
      const id = generateId();
      const descuentos = calcularDescuentos(parseFloat(sueldo));
      const isss = parseFloat(sueldo) * 0.0325;
      const afp = parseFloat(sueldo) * 0.0725;
      const sueldoNeto = parseFloat(sueldo) - descuentos - isss - afp;

      const nuevoEmpleado = {
        id,
        nombre,
        apellido,
        sueldo: parseFloat(sueldo),
        renta: descuentos,
        isss,
        afp,
        sueldoNeto,
      };

      try {
        const nuevaListaEmpleados = [...empleados, nuevoEmpleado];
        await AsyncStorage.setItem(
          "empleados",
          JSON.stringify(nuevaListaEmpleados)
        );
        setEmpleados(nuevaListaEmpleados);
        setNombre("");
        setApellido("");
        setSueldo("");
        setMensaje("Empleado agregado con éxito.");
      } catch (error) {
        console.error("Error al agregar empleado:", error);
      }
    } else {
      setMensaje("Por favor, complete todos los campos.");
    }
  };

  return (
    <View style={styles.container}>
    <Text h3 style={styles.titulo}>
      Registro de Empleados
    </Text>
    <Text style={styles.mensaje}>{mensaje}</Text>
    <TextInput
      style={styles.input}
      placeholder="Nombre"
      value={nombre}
      onChangeText={(text) => setNombre(text)}
    />
    <TextInput
      style={styles.input}
      placeholder="Apellido"
      value={apellido}
      onChangeText={(text) => setApellido(text)}
    />
    <TextInput
      style={styles.input}
      placeholder="Sueldo"
      value={sueldo}
      onChangeText={(text) => setSueldo(text)}
      keyboardType="numeric"
    />
    <Button title="Agregar Empleado" onPress={agregarEmpleado} />
    <Text h4 style={styles.listaTitulo}>
      Lista de Empleados:
    </Text>
    {empleados.length === 0 ? (
      <Text style={styles.listaVacia}>No tiene ningún dato.</Text>
    ) : (
      <FlatList
        data={empleados}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>Nombre: {item.nombre}</Text>
            <Text>Apellido: {item.apellido}</Text>
            <Text>Sueldo: ${item.sueldo.toFixed(2)}</Text>
            <Text>Renta: ${item.renta.toFixed(2)}</Text>
            <Text>ISSS: ${item.isss.toFixed(2)}</Text>
            <Text>AFP: ${item.afp.toFixed(2)}</Text>
            <Text>Sueldo Neto: ${item.sueldoNeto.toFixed(2)}</Text>
            <Button
              title="Eliminar"
              type="outline"
              onPress={() => eliminarEmpleado(item.id)}
            />
          </View>
        )}
      />
    )}
  </View>
);
};

const styles = StyleSheet.create({
container: {
  flex: 1,
  padding: 16,
},
titulo: {
  fontSize: 24,
  fontWeight: "bold",
  marginBottom: 16,
},
mensaje: {
  fontSize: 18,
  marginBottom: 16,
},
input: {
  fontSize: 16,
  marginBottom: 16,
  borderColor: "#ccc",
  borderWidth: 1,
  padding: 8,
  borderRadius: 5,
},
listaTitulo: {
  fontSize: 20,
  fontWeight: "bold",
  marginTop: 16,
},
listaVacia: {
  fontSize: 18,
  marginTop: 8,
},
item: {
  marginBottom: 16,
  borderColor: "#ccc",
  borderWidth: 1,
  padding: 16,
  borderRadius: 5,
},
});



export default App;
