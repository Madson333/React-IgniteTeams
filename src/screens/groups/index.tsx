
import { Header } from "@components/header";
import { Container } from "./styles";
import { Highlight } from "@components/highlight";
import { GroupCard } from "@components/groupCard";
import { FlatList } from "react-native";
import { useEffect, useState, useCallback } from "react";
import { ListEmpty } from "@components/listEmpty";
import { Button } from "@components/button";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { groupsGetAll } from "@storage/group/groupsGetAll";


export function Groups(){
  const [groups, setGroups] = useState<string[]>([])
  const navigation = useNavigation()
  function handleNewGroup(){
    navigation.navigate("new")
  }

  async function fetchGroup(){
    try{
     const data = await groupsGetAll()
     setGroups(data)
    } catch(error){
      console.log(error)
    }
  }

  function handleOpenGroup(group: string){
    navigation.navigate("players", {group})
  }

useFocusEffect(useCallback(() => {
    fetchGroup()
  },[]))

  return(

    <Container>
      <Header />
      <Highlight title="Turmas" subtitle="jogue com a sua turma" />

      <FlatList 
        data={groups}
        keyExtractor={item => item}
        contentContainerStyle={ groups.length === 0 && {flex: 1}}
        ListEmptyComponent={() =>
          <ListEmpty message={"Lista não encontrada"} />
        }
        renderItem={({item}) => (
            <GroupCard 
              title={item}
              onPress={() => handleOpenGroup(item)}
             />
          )
        }
      />
      
     <Button 
        title="Criar nova turma" 
        onPress={handleNewGroup}
      />
      
    </Container>

  )
}