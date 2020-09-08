import React, { Component, useEffect, useState  } from 'react';
import { Platform, LayoutAnimation, View, Text, UIManager, TouchableOpacity, StyleSheet } from 'react-native';
import { Avatar, Icon } from 'react-native-elements';
import { color, spacing } from '../theme';
import { Button } from '../components/button/button'
import { DatePicker } from './date-picker/date-picker'
import { border_boxes, globalStyles  } from '../global-helper';
import { Hoshi } from 'react-native-textinput-effects';
import { Snack } from './snack/snack';
import { Api } from '../services/api';
import { Progress_Loader } from './progress-loader/progress-loader';
import { ICardy, Cardy } from '../models';
import { addItem} from '../services/firebase/firebase.service';
import { observer } from "mobx-react-lite";
import { useStores } from "../models/root-store"
import { AddClientDialog } from '../components';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons'

const styles = StyleSheet.create({
    rowSpace: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    inputContainerStyle: {
        backgroundColor: color.palette.grey_sbs,
        paddingLeft: spacing[4],
        borderBottomColor: color.palette.grey_sbs,
        borderRadius: 4,
    },
    inputTextStyle: {
        fontSize: 12,
        opacity: 0.5
    },
})

const price_btns_array_т = [
    { title: "5т 125лв", price: '125', type: 'trainings', rate: '25', card_limit: '5'},
    { title: "8т 160лв", price: '160', type: 'trainings', rate: '20', card_limit: '8'},
    { title: "12т 180лв", price: '180', type: 'trainings', rate: '15', card_limit: '12'},
  ];

const price_btns_array_m = [
    { title: "1м 200лв", price: '199', type: 'month', rate: '199', card_limit: '1'},
    { title: "2м 360лв", price: '360', type: 'month', rate: '180', card_limit: '2'},
    { title: "3м 450лв", price: '450', type: 'month', rate: '150', card_limit: '3'},
];

const TrainerAvatar: React.FunctionComponent<{title}> = observer(props => {
    const userStore = useStores().userStore
    const { title } = props
    return (
        <View
        style={[{
            width: '90%',
            paddingVertical: 20,
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',

        }]}
    >
        <Avatar                
            rounded
            containerStyle={[{
                borderColor: color.palette.blue_sbs,
                borderWidth: 1
            }]}
            size='medium'
            source={{
                uri:
                userStore.users
                    .find(user => user.item.email === title)
                    .item.picture ||
                    'https://images.assetsdelivery.com/compings_v2/4zevar/4zevar1604/4zevar160400009.jpg',
            }}
        />
        <Text
            style={[{
                marginLeft: '5%'
            
            }]}
        >{props.title}</Text>
    </View>
    )
})

interface GetClientSuggestions {
    func: any
}

const GetClientSuggestions: React.FunctionComponent<GetClientSuggestions> = observer(props => {
    const userStore = useStores().userStore
    const { func } = props
    useEffect(() => {
        userStore.ggetItems()
    }, [])
    return (
        <View
            style={[{
                width: '100%'
            }]}
        >
            {
                userStore.clients?.map((client, index) => {
                    return  <TouchableOpacity
                                style={[
                                    styles.inputContainerStyle,
                                    {
                                        marginVertical: 2,
                                        paddingVertical: 10
                                    }
                                ]}
                                key={index}
                                onPress={() => func(client.item.email)}
                            >
                                <Text
                                    style={[
                                        styles.inputTextStyle
                                    ]}
                                >{client.item.email}</Text>
                            </TouchableOpacity>
                    
                })
            }
            </View>
        )
})

const getPriceButtons = (array: any[], func) => {
    return array?.map((item, index) => {
        return (
            <Button
            key={index}
                style={[{
                    backgroundColor: color.palette.blue_sbs,
                    width: '25%'
                }]}
                onPress={() => func(item.price, item.type, item.rate, item.card_limit)}
            >
                <Text
                    style={[{
                        color: 'white',
                        fontSize: 12
                    }]}
                >{item.title}</Text>
            </Button>
        )
    })
}

const getInput = (placeholder, operatedVariable, setVarState, width='45%', onF, onB) => {
    return (
        <View
            style={[
                // border_boxes().black,
                {
                width: width,
                marginVertical: 5
            }]}
        >
            <Hoshi 
                autoCapitalize='none'
                autoCompleteType="off"
                autoCorrect={false}
                value={operatedVariable}
                onChangeText={x => setVarState(x)}
                // placeholder={placeholder}
                placeholderTextColor={'#999999'}
                // containerStyle={{paddingHorizontal: 0}}
                // inputContainerStyle={styles.inputContainerStyle}          
                inputStyle={{fontSize: 16}}

                onFocus={() => onF()}
                onBlur={() => onB()}
                label={placeholder}
                labelStyle={[styles.inputTextStyle, {marginBottom: 10}]}
                defaultValue={operatedVariable}
                borderColor={color.palette.blue_sbs}
                inputPadding={3}
            />

        </View>
    )
}

interface State {
    updated_Height: number,
    cardy: ICardy,
    requireds: {
        showClientError: boolean,
        showTypeError: boolean,
        showCardLimitError: boolean,
        showRateError: boolean,
        showPriceError: boolean,
        showRealPriceError: boolean
    },
    seeSuggestions: boolean,
    clientsList: any,
    seeDatePaymentPicker: boolean,
    seeDateStartPicker: boolean,
}

const resState = {
    updated_Height: 0,

    cardy: new Cardy(),

    requireds: {
        showClientError: false,
        showTypeError: false,
        showCardLimitError: false,
        showRateError: false,
        showPriceError: false,
        showRealPriceError: false
    },
    clientsList: [],
    seeSuggestions: false,
    seeDatePaymentPicker: false,
    seeDateStartPicker: false,
}

class Accordion_Panel extends Component<{item: any, onClickFunction, activateSnack, seeClientDialog}, State> {

    constructor(props) {
        super(props);
        this.state = resState
    }

    componentDidMount() {
        const API = new Api()
            API.setup()
            API.postGetConditionalItems('users', 'role', '==', 'client')
            .then((res: any) => {
                res.data.data?.map(item => {
                    this.setState(prevSt => ({...prevSt, clientsList: [...prevSt.clientsList, item.item.email]}))
                })
            })
    }

    componentWillReceiveProps(update_Props) {
        if (update_Props.item.expanded) {
            this.setState(() => {
                return {
                updated_Height: null
                }
            });
        }
        else {
            this.setState(() => {
                return {
                updated_Height: 0
                }
            });
        }
    }

    shouldComponentUpdate(update_Props, nextState) {
        if (update_Props.item.expanded !== this.props.item.expanded) {
            // {}
            this.setState(prevSt => ({...prevSt, cardy: {...prevSt.cardy, trainer: update_Props.item.title}}) ) 
            return true;
        }

        if (nextState !== this.state) {
            return true;
        }

        return false;
    }

    render() {
        const { client, type, card_limit, rate, price, realPrice } = this.state.cardy
        return (
            <View
                style={[
                    // border_boxes().black,
                    {
                    borderRadius: 20,
                    width: '90%',
                    marginVertical: 10,
                    alignItems: 'center',
                    backgroundColor: 'white'
                }]}
            >
            <TouchableOpacity activeOpacity={0.7} onPress={this.props.onClickFunction} 
                style={[{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%'
                }]}
            >
                <TrainerAvatar title={this.props.item.title} />           
            </TouchableOpacity>

            <View 
                style={[
                    // border_boxes().red,
                    { 
                        height: this.state.updated_Height,
                        overflow: 'hidden',
                        width: '100%'
                    }    
                ]}
            >
                <View
                    style={[
                        // border_boxes().orange
                    ]}
                >
                    <View
                        style={[
                            {
                                
                            },
                            {
                                width: '90%',
                                alignSelf: 'center',
                                paddingVertical: 10,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                            },
                            // border_boxes().black
                        ]}
                    >
                        { getPriceButtons(price_btns_array_т, (p, t, r, q) => {
                            this.setState(prevSt => ({
                                                        ...prevSt,
                                                        cardy: {
                                                            ...prevSt.cardy,
                                                            price: p,
                                                            type: t,
                                                            rate: r,
                                                            card_limit: q
                                                        },
                                                        requireds: {
                                                            ...prevSt.requireds,
                                                            showPriceError: false,
                                                            showTypeError: false,
                                                            showRateError: false,
                                                            showCardLimitError: false
                                                        }
                                                    })
                            )
                        }) }
                    </View>
                    <View
                        style={[
                            {
                                width: '90%',
                                alignSelf: 'center',
                                paddingVertical: 10,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                            }
                        ]}
                    >                
                        { getPriceButtons(price_btns_array_m, (p, t, r, q) => {
                                                    this.setState(prevSt => ({
                                                        ...prevSt,
                                                        cardy: {
                                                            ...prevSt.cardy,
                                                            price: p,
                                                            realPrice: p,
                                                            type: t,
                                                            rate: r,
                                                            card_limit: q
                                                        },
                                                        requireds: {
                                                            ...prevSt.requireds,
                                                            showPriceError: false,
                                                            showTypeError: false,
                                                            showRateError: false,
                                                            showCardLimitError: false,
                                                            showRealPriceError: false
                                                        }
                                                    })
                            )
                        }) }
                    </View>
                    <View
                        style={[
                            // border_boxes().green,
                            {
                            width: '90%',
                            alignSelf: 'center'
                        }]}
                    >
                        { this.state.seeSuggestions ? 
                            <GetClientSuggestions 
                                func={(x) => {
                                this.setState(prevSt => ({...prevSt, cardy: {...prevSt.cardy, client: x}}));
                                this.setState({seeSuggestions: false})
                                this.setState(prevState => ({...prevState, requireds: {...prevState.requireds,  showClientError: false }}))
                            }} />
                        : null}

                        <View
                            style={[
                                styles.rowSpace
                            ]}
                        >
                            {   getInput(
                                    'клиент',
                                    this.state.cardy.client,
                                    x => this.setState(prevSt => ({...prevSt, cardy: {...prevSt.cardy, client: x}})),
                                    '80%',
                                    () => this.setState({seeSuggestions: true}),
                                    () => {
                                        this.setState({seeSuggestions: false})
                                        this.state.cardy.client === ''? 
                                            this.setState(prevState => ({...prevState, requireds: {...prevState.requireds,  showClientError: true }}))
                                        : this.setState(prevState => ({...prevState, requireds: {...prevState.requireds,  showClientError: false }}));                                
                                    }
                                )
                            }
                            <TouchableOpacity
                                onPress={() => this.props.seeClientDialog()}
                                style={[
                                    // border_boxes().green,
                                    {
                                    width: '20%',
                                    justifyContent: 'center',
                                    alignItems: 'flex-end',
                                    // alignContent: 'center'
                                }]}
                            >
                                <FontAwesomeIcon 
                                    icon={ faPlusCircle }
                                    color={color.palette.green_sbs}
                                    size={60}
                                />
                            </TouchableOpacity>
                        </View>
                        {this.state.requireds.showClientError? 
                            <Text
                                style={[{
                                    color: 'red',
                                    fontSize: 12,
                                    width: '50%'
                                }]}
                            >{'Полето е задължително!'}</Text>
                        : null}
                        
                        <View
                            style={[
                                styles.rowSpace
                            ]}
                        >
                            {   getInput('Дата на плащане',
                                        displayDateFromTimestamp(this.state.cardy.datestampPayment),
                                        (x) => {this.setState(prevSt => ({...prevSt, cardy: {...prevSt.cardy, datestampPayment:  x}}))},
                                        undefined,
                                        () => {this.setState({ seeDatePaymentPicker:  true})},
                                        () => {}
                            )}
                            {   getInput('Дата на картата',
                                        displayDateFromTimestamp(this.state.cardy.datestampStart),
                                        (x) => {this.setState(prevSt => ({...prevSt, cardy: {...prevSt.cardy, datestampStart:  x}}))},
                                        undefined,
                                        () => {this.setState({ seeDateStartPicker:  true})},
                                        () => {}
                            )}
                        </View>
                        {this.state.seeDatePaymentPicker? (
                            <DatePicker 
                                showPicker={() => {this.setState({seeDatePaymentPicker: false})}}
                                inputDateStamp={this.state.cardy.datestampPayment}
                                onDateChange={(_dateStamp: number) => {
                                    this.setState(prevSt => ({...prevSt, cardy: {...prevSt.cardy, datestampPayment: _dateStamp }}))
                                }}
                            />
                        ): null}

                        {this.state.seeDateStartPicker? (
                            <DatePicker 
                                showPicker={() => {this.setState({seeDateStartPicker: false})}}
                                inputDateStamp={this.state.cardy.datestampStart}
                                onDateChange={(_dateStamp: number) => {
                                    this.setState(prevSt => ({...prevSt, cardy: {...prevSt.cardy, datestampStart: _dateStamp }}))
                                }}
                            />
                        ): null}                    
                        <View
                            style={[
                                styles.rowSpace
                            ]}
                        >
                            {   getInput('Тип карта',
                                        this.state.cardy.type,
                                        (x) => {this.setState(prevSt => ({...prevSt, cardy: {...prevSt.cardy,  type:  x}}))},
                                        undefined,
                                        () => {},
                                        () => {
                                            this.state.cardy.type === ''? 
                                                this.setState(prevState => ({...prevState, requireds: {...prevState.requireds,  showTypeError: true }}))
                                            : this.setState(prevState => ({...prevState, requireds: {...prevState.requireds,  showTypeError: false }}));
                                        }
                            )}                       
                            {   getInput('Количество',
                                        this.state.cardy.card_limit,
                                        (x) => {this.setState(prevSt => ({...prevSt, cardy: {...prevSt.cardy, card_limit:  x}}))},
                                        undefined,
                                        () => {},
                                        () => {
                                            this.state.cardy.card_limit === ''? 
                                                this.setState(prevState => ({...prevState, requireds: {...prevState.requireds,  showCardLimitError: true }}))
                                            : this.setState(prevState => ({...prevState, requireds: {...prevState.requireds,  showCardLimitError: false }}));
                                        }
                            )}
                        </View>
                        <View
                            style={[
                                styles.rowSpace
                            ]}
                        >
                            <View
                                style={[{width:'45%'}]}
                            >
                                {this.state.requireds.showTypeError? 
                                    <Text
                                        style={[{
                                            color: 'red',
                                            fontSize: 12,
                                            width: '100%'
                                        }]}
                                    >{'Полето е задължително!'}</Text>
                                : null}
                            </View>
                            <View
                                style={[{width:'45%'}]}
                            >
                                {this.state.requireds.showCardLimitError? 
                                    <Text
                                        style={[{
                                            color: 'red',
                                            fontSize: 12,
                                            width: '100%'
                                        }]}
                                    >{'Полето е задължително!'}</Text>
                                : null}
                            </View>
                        </View>
                        <View
                            style={[
                                styles.rowSpace
                            ]}
                        >
                            {   getInput('Ставка',
                                        this.state.cardy.rate,
                                        (x) => {this.setState(prevSt => ({...prevSt, cardy: {...prevSt.cardy, rate:  x}}))},
                                        undefined,
                                        () => {},
                                        () => {
                                            this.state.cardy.rate === ''? 
                                                this.setState(prevState => ({...prevState, requireds: {...prevState.requireds,  showRateError: true }}))
                                            : this.setState(prevState => ({...prevState, requireds: {...prevState.requireds,  showRateError: false }}));
                                        }
                            )}
                            {   getInput('Цена по тип карта',
                                        this.state.cardy.price,
                                        (x) => {this.setState(prevSt => ({...prevSt, cardy: {...prevSt.cardy,  price:  x}}))},
                                        undefined,
                                        () => {},
                                        () => {
                                            this.state.cardy.price === ''? 
                                                this.setState(prevState => ({...prevState, requireds: {...prevState.requireds,  showPriceError: true }}))
                                            : this.setState(prevState => ({...prevState, requireds: {...prevState.requireds,  showPriceError: false }}));
                                            // console.log(this.state.cardy.price === '')
                                            // console.log(this.state.requireds.showPriceError)
                                        }
                            )}
                            
                        </View>
                        <View
                            style={[
                                styles.rowSpace,
                                // border_boxes().green
                            ]}
                        >
                            <View
                                style={[{width:'45%'}]}
                            >
                                {this.state.requireds.showRateError? 
                                    <Text
                                        style={[{
                                            color: 'red',
                                            fontSize: 12,
                                            width: '100%'
                                        }]}
                                    >{'Полето е задължително!'}</Text>
                                : null}
                            </View>
                            <View
                                style={[{width:'45%'}]}
                            >
                                {this.state.requireds.showPriceError? 
                                    <Text
                                        style={[{
                                            color: 'red',
                                            fontSize: 12,
                                            width: '100%'
                                        }]}
                                    >{'Полето е задължително!'}</Text>
                                : null}
                            </View>
                        </View>
                        {   getInput('Реална цена',
                                        this.state.cardy.realPrice,
                                        (x) => {this.setState(prevSt => ({...prevSt, cardy: {...prevSt.cardy, realPrice:  x}}))},
                                        '100%',
                                        () => {},
                                        () => {
                                            this.state.cardy.realPrice === ''? 
                                                this.setState(prevState => ({...prevState, requireds: {...prevState.requireds,  showRealPriceError: true }}))
                                            : this.setState(prevState => ({...prevState, requireds: {...prevState.requireds,  showRealPriceError: false }}));
                                            // console.log(this.state.cardy.realPrice === '')
                                            // console.log(this.state.requireds.showRealPriceError)
                                        }
                        )}
                        <View
                            style={[
                                styles.rowSpace,
                                // border_boxes().green
                            ]}
                        >
                            <View
                                style={[{width:'100%'}]}
                            >
                                {this.state.requireds.showRealPriceError? 
                                    <Text
                                        style={[{
                                            color: 'red',
                                            fontSize: 12,
                                            width: '100%'
                                        }]}
                                    >{'Полето е задължително!'}</Text>
                                : null}
                            </View>                            
                        </View>
                        {   getInput('Кой плаща',
                                        this.state.cardy.whoPays,
                                        (x) => {this.setState(prevSt => ({...prevSt, cardy: {...prevSt.cardy, whoPays:  x}}))},
                                        '100%',
                                        () => {},
                                        () => {}
                        )}
                        {   getInput('Коментар', 
                                    this.state.cardy.comment, 
                                    (x) => {this.setState(prevSt => ({...prevSt, cardy: {...prevSt.cardy, comment:  x}}))},
                                    '100%',
                                    () => {},
                                    () => {}
                        )}
                        </View>
                    <View
                        style={[
                            // border_boxes().black,
                            {
                            width: '90%',
                            alignSelf: 'center',
                            paddingVertical: 10,
                            marginVertical: 10,
                            alignItems: 'flex-end'
                        }]}
                    >
                        <View
                            style={[{ width: '30%'}]}
                        >
                            <Button
                                style={[{
                                    backgroundColor: color.palette.green_sbs,
                                }]}
                                onPress={() => {
                                    if (client !== '' && type !== '' &&
                                        card_limit !== '' && rate !== '' && price !== '' &&
                                        realPrice !== '') 
                                        {
                                            addItem(this.state.cardy, 'cards');
                                            this.props.activateSnack()
                                            this.props.onClickFunction()
                                            this.setState(resState)
                                    } else {                                     
                                        this.setState(prevSt => ({
                                            ... prevSt,
                                            requireds: {
                                                ...prevSt.requireds, 
                                                showClientError: client === ''? true: false,
                                                showTypeError: type === ''? true: false,
                                                showCardLimitError: card_limit === ''? true: false,
                                                showRateError: rate === ''? true: false,
                                                showPriceError: price === ''? true: false,
                                                showRealPriceError: realPrice === ''? true: false
                                            }
                                        }))

                                    }
                                }}
                            >
                                <Text
                                    style={[{
                                        color: 'white'
                                    }]}
                                >{"Create Card"}</Text>
                            </Button>
                        </View>
                    </View>
                </View>
            </View>
        </View>
        );
    }
}

export class Accordeon extends Component<{trainers}, {AccordionData, showSnack, showLoader, seeClDialog}> {

    componentDidMount() {
        this.setState({showLoader: false})
    }

    constructor(props) {
        super(props);

        if (Platform.OS === 'android') {
            UIManager.setLayoutAnimationEnabledExperimental(true)
        }

        this.state = { 
            AccordionData: props.trainers,
            showLoader: true,
            showSnack: false,
            seeClDialog: false
        }
    }

    update_Layout = (index, item) => {

        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

        const array = this.state.AccordionData?.map((item) => {

            const newItem = Object.assign({}, item);

            newItem.expanded = false;

            return newItem;
        });

        array[index].expanded = !item.expanded;

        this.setState(() => {
        return {
            AccordionData: array
        }
        });
    }

    render() {
        const {showSnack, seeClDialog} = this.state
        return (
            <View
                style={[{
                    width: '100%',
                    alignItems: 'center'
                }]}
            >
            <View style={globalStyles.snackView}>
                {showSnack ? 
                    <Snack message={'Saved !'} onDismiss={() => {this.setState({showSnack: false})}}/>
                : null}
                {seeClDialog ? 
                    <AddClientDialog onDismiss={() => {this.setState({seeClDialog: false})}}/>
                : null}
            </View>
            <Progress_Loader flag={this.state.showLoader} />
            {this.state.AccordionData?.map((item, key) => {
                return (
                    <Accordion_Panel 
                        key={key} 
                        onClickFunction={this.update_Layout.bind(this, key, item)} 
                        item={item} 
                        activateSnack={() => {this.setState({showSnack: true})}}
                        seeClientDialog={() => {this.setState({seeClDialog: true})}}
                    />   
                )  
            })}
            </View>
        );
    }
}