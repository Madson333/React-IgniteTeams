import { Header } from "@components/header";
import { Container, Form, HeaderList, NumbersOfPlayers } from "./styles";
import { Highlight } from "@components/highlight";
import { ButtonIcon } from "@components/ButtonIcon";
import { Input } from "@components/input";
import { Filter } from "@components/filter";
import { Alert, FlatList, TextInput } from "react-native";
import { useEffect, useState, useRef } from "react";
import { PlayerCard } from "@components/playerCard";
import { ListEmpty } from "@components/listEmpty";
import { Button } from "@components/button";
import { useNavigation, useRoute } from "@react-navigation/native";
import { AppError } from "@utils/appError";
import { playerAddByGroup } from "@storage/player/playerAddByGroup";
import { playersGetByGroupAndTeam } from "@storage/player/playerGetByGroupAndTeam";
import { PlayerStorageDTO } from "@storage/player/playerStorageDTO";
import { playerRemoveByGroup } from "@storage/player/playerRemoveByGroup";
import { groupRemoveByName } from "@storage/group/groupRemoveByName";


type RouterParams = {
  group: string;  
}

export function Players(){
  const [newPlayerName, setNewPlayerName] = useState('')
  const [team, setTeam] =  useState("time a")
  const [players, setPlayers] = useState<PlayerStorageDTO[]>([])
  const navigation = useNavigation()
  
  const route = useRoute()
  const { group } = route.params as RouterParams

  const newPlayerNameInputRef = useRef<TextInput>(null)

  async function handleAddPlayer(){
    if(newPlayerName.trim().length === 0){
      return Alert.alert("Novo Jogador","Informe o nome para adicionar")
    }

    const newPlayer = {
      name: newPlayerName,
      team,
    }
    
    try{
      await playerAddByGroup(newPlayer, group)
      newPlayerNameInputRef.current?.blur()
      setNewPlayerName("")
      fetchPlayersByTeam()
      
      
    } catch(error){
      if(error instanceof AppError){
        Alert.alert("nova pessoa", error.message)
      } else {
        Alert.alert("nova pessoa", "Não foi possivel adicionar a pessoa.")
      }
    }
  }

  async function fetchPlayersByTeam(){
    try{
      const playersByTeam = await playersGetByGroupAndTeam(group, team)
      setPlayers(playersByTeam)

    } catch(error){
      throw error
    }
  }

  async function handlePlayerRemove(playerName: string){
    try{
      await playerRemoveByGroup(playerName, group)
      fetchPlayersByTeam()

    }catch(error){
      console.log(error)
      Alert.alert("Remover pessoa", "Não foi possivel remover essa pessoa")
    }
  }
  
  async function groupRemove(){
    try {
      await groupRemoveByName(group)
      navigation.navigate("groups")
    }catch(error){
      console.log(error)
      throw error
    }
  }

  async function handleRemoveGroup(){
    Alert.alert("Remover", "deseja remover o grupo?", [
      {text: "Sim", onPress: () => groupRemove()},
      {text: "Não", style: "cancel"}
    ])
    

  }



  useEffect(() => {
    fetchPlayersByTeam()
  },[team])

  return(
    <Container>
      <Header showBackButton />

      <Highlight 
        title={group}
        subtitle="Adicione a galera e separe os times"
      />
      <Form>
          <Input 
            inputRef={newPlayerNameInputRef}
            placeholder="Nome da pessoa" 
            autoCorrect={false} 
            onChangeText={setNewPlayerName}
            value={newPlayerName}
            onSubmitEditing={handleAddPlayer}
            returnKeyType="done"
          />
          <ButtonIcon 
            icon="add" 
            onPress={handleAddPlayer}
            />
      </Form>

    <HeaderList>
      <FlatList 
        data={["time a", "time b"]}
        keyExtractor={item => item}
        horizontal 
        showsHorizontalScrollIndicator={false}
        renderItem={({item}) => (
          <Filter 
            title={item} 
            isActive={item === team}
            onPress={() => setTeam(item)}
          />
        )}
      />
      <NumbersOfPlayers>{players.length}</NumbersOfPlayers>
    </HeaderList>

    <FlatList
      showsVerticalScrollIndicator={false}  
      ListEmptyComponent={
        <ListEmpty 
          message={"Não há pessoas nesse time"}
        />
      }
      data={players}
      keyExtractor={item => item.name}
      renderItem={({item}) => (
        <PlayerCard 
          name={item.name} 
          onRemove={() => handlePlayerRemove(item.name)}
          />          
      )}
      contentContainerStyle={[
        {paddingBottom: 100},
        players.length === 0 && {flex: 1}
      ]}
    />    
    <Button 
      onPress={handleRemoveGroup}
      title="Remover turma"
      type="SECONDARY"
    />
    </Container>
  )
}