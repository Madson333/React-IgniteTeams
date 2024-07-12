import AsyncStorage from "@react-native-async-storage/async-storage";
import { PLAYER_COLLECTION } from "@storage/storageConfig";
import { playersGetByGroup } from "./playersGetByGroup";
import { AppError } from "@utils/appError";
import { PlayerStorageDTO } from "./playerStorageDTO"

export async function playerAddByGroup(newPlayer: PlayerStorageDTO, group: string){
  try{
    const storedPlayers = await playersGetByGroup(group)

    const playerAlreadyExists = storedPlayers.filter(player => player.name === newPlayer.name)

    if(playerAlreadyExists.length > 0){
      throw new AppError("Pessoa já cadastrada em um time aqui.")
    }

    const storage = JSON.stringify([...storedPlayers, newPlayer])

    await AsyncStorage.setItem(`${PLAYER_COLLECTION}-${group}`, storage)
  } catch(error){
    throw (error)
  }
}

