import { Header } from "@components/header";
import { Container, Content, Icon } from "./styles";
import { Highlight } from "@components/highlight";
import { Button } from "@components/button";
import { Input } from "@components/input";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { groupCreate } from "@storage/group/groupCreate";
import { AppError } from "@utils/appError";
import { Alert } from "react-native";


export function NewGroup(){
  const [group, setGroup] = useState('')
  const navigation = useNavigation()

  async function handleNew(){
   try{
    if(group.trim().length === 0){
     return  Alert.alert("Novo grupo", "Informe o nome da turma.")
    }

    await groupCreate(group)
    navigation.navigate("players", {group})
   } catch(error){
     console.log(error)
     if(error instanceof AppError) {
      Alert.alert("Novo grupo", error.message)
     }else{
      Alert.alert("Novo grupo", "Não foi possivel criar um novo grupo.")
     } 
   }
  }
  
  return (
    <Container>
      <Header showBackButton />
      <Content>
        <Icon />
        <Highlight title="Nova turma" subtitle="Crie a turma para adicionar as pessoas" />
          <Input placeholder="Nome da turma" onChangeText={setGroup} value={group} />
        <Button onPress={handleNew} title="Criar" style={{marginTop: 20}} />
      </Content>
      
    </Container>
  )
}