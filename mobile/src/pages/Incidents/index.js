import React, {useState ,useEffect} from 'react';
import {View, FlatList, Image, Text, TouchableOpacity} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';

import logoImg from '../../assets/logo.png';

import styles from './styles';

import api from '../../services/api';

export default function Incidents() {
    const [incidents, setIncidents] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [loadin, setLoadin] = useState(false);

    const navigation = useNavigation();
    
    function navigateToDetail(incident){
        navigation.navigate('Detail',{ incident });
    }

    useEffect(()=>{
        loadIncidents();
    },[]);
    
    async function loadIncidents(){
        if(loadin){
            return;
        }
        
        if(total > 0 && incidents.length === total ){
            return;
        }

        setLoadin(true);
        
        const response = await api.get(`incidents`, {
            params: { page }
        });

        setIncidents([...incidents, ...response.data]);
        setTotal(response.headers['x-total-count']);
        setPage(page + 1);
        
        setLoadin(false);
    }

    return (
        <View style={styles.container} >
            <View style={styles.header}>
                <Image source={logoImg} />

                <Text style={styles.headerText} >
                    Total de <Text style={styles.headerTextBold} >{total} casos.</Text> 
                </Text>
            </View>

            <Text style={styles.title} >Bem Vindo</Text>
            <Text style={styles.description} >Escolha um dos casos abaixo e salve o dia.</Text>

            <FlatList 
                style={ styles.incidentList }
                data={incidents}
                keyExtractor={ incident => String(incident.id) }
                showsVerticalScrollIndicator={false}
                onEndReached={loadIncidents}
                onEndReachedThreshold={0.2}
                renderItem={({item: incident})=>(
                        <View style={styles.incident} >
                            <Text style={styles.incidentProperty} >ONG:</Text>
                            <Text style={styles.incidentValue} >{incident.name}</Text>
                            
                            <Text style={styles.incidentProperty} >CASO:</Text>
                            <Text style={styles.incidentValue} >{incident.title}</Text>
                            
                            <Text style={styles.incidentProperty} >VALOR:</Text>
                            <Text style={styles.incidentValue} >{
                                Intl.NumberFormat('pt-BR', { 
                                    style: 'currency', 
                                    currency: 'BRL' 
                                }).format(incident.value) }
                            </Text>
                            
                            <TouchableOpacity 
                            onPress={()=>navigateToDetail(incident)} 
                            style={styles.detailsButton} 
                            >
                                <Text style={styles.detailsButtonText} >Ver mais detalhes</Text>
                                <Feather name="arrow-right" size={16} color="#e02141" />
                            </TouchableOpacity>
                        </View>
                )}
            />        

        </View>
    );
}