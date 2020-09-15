import React, { useEffect, useState } from "react"
import { color } from "../../theme"
import { View } from "react-native"
import { observer } from "mobx-react-lite";
import { useStores } from "../../models/root-store";
import { Avatar } from "react-native-elements";

interface ActiveInactiveCardAvatarProps {
    cardId: string
}

export const ActiveInactiveCardAvatar: React.FunctionComponent<ActiveInactiveCardAvatarProps> = observer(props => {
    const { cardId } = props
    const { cardyStore2 } = useStores()
    const [cardIsActive] = useState<boolean>(
        cardyStore2.isActiveCard(cardId) || false
    )

    return (
        <View
            style={[{
                width: '100%'
            }]}
        >
            {
                cardIsActive? 
                    <Avatar
                        title={'A'}             
                        rounded
                        overlayContainerStyle={[{
                            backgroundColor: color.palette.green_sbs,
                            borderColor: color.palette.green_sbs,
                            borderWidth: 1
                        }]}
                        titleStyle={[{
                            color: 'white'
                        }]}
                        size='small'
                    />
                :
                    <Avatar
                        title={'E'}            
                        rounded
                        overlayContainerStyle={[{
                            borderColor: color.palette.grey_sbs,
                            borderWidth: 1
                        }]}
                        titleStyle={[{
                            color: 'white'
                        }]}
                        size='small'
                    />
            }
        </View>
    )
})