import React, { useState } from 'react';
import { View, Text, Picker, TextInput } from 'react-native';
import styles from './styles';
import PageHeader from '../../components/PageHeader';
import TeacherItem, { Teacher } from '../../components/TeacherItem';
import { Feather } from '@expo/vector-icons';
import { ScrollView, BorderlessButton, RectButton } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';
import api from '../../services/api';
import { useFocusEffect } from '@react-navigation/native';


function TeacherList() {
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [subject, setSubject] = useState('');
  const [week_day, setWeekDay] = useState('');
  const [time, setTime] = useState('');
  const [selectedValue, setSelectedValue] = useState("java");

  async function handleFilterSubmit() {
    loadFavorites();

    const response = await api.get('classes', {
      params: {
        subject,
        week_day,
        time,
      }
    });
    setIsFiltersVisible(false);
    setTeachers(response.data);
  }
  function handleToggleFiltersVisible() {
    setIsFiltersVisible(!isFiltersVisible);
  }

  function loadFavorites() {
    AsyncStorage.getItem('favorites').then(response => {
      if(response) {
        const favoritedTeachers = JSON.parse(response);
        const favoritedTeachersIds = favoritedTeachers.map((teacher: Teacher) => {
          return teacher.id;
        })
        setFavorites(favoritedTeachersIds);
      }
    });
  }

  useFocusEffect(() => {
    loadFavorites();
  });

  return (
    <View style={styles.container}>
      <PageHeader title="Proffys disponíveis" headerRight={
        (
          <BorderlessButton onPress={handleToggleFiltersVisible}>
            <Feather name="filter" size={20} color="#EEE"/>
          </BorderlessButton>
        )
      }>
        { isFiltersVisible && (
          <View style={styles.searchForm}>
            <Text style={styles.label} >Máteria</Text>
            {/* <TextInput style={styles.input} value={subject} onChangeText={text=> setSubject(text)} placeholder="Qual a máteria?" placeholderTextColor="#c1bccc" /> */}
            <View style={styles.input}>
              <Picker
                    selectedValue={subject}
                    onValueChange={(itemValue, itemIndex) => setSubject(itemValue)}
                  >
                    <Picker.Item label="Artes" value="Artes" />
                    <Picker.Item label="Biologia" value="Biologia" />
                    <Picker.Item label="Ciencias" value="Ciencias" />
                    <Picker.Item label="Educação Fisica" value="Educação Fisica" />
                    <Picker.Item label="Historia" value="Historia" />
                    <Picker.Item label="Matemática" value="Matemática" />
                    <Picker.Item label="Português" value="Português" />
                    <Picker.Item label="Química" value="Química" />

              </Picker>
            </View>
            <View style={styles.inputGroup}>
              <View style={styles.inputBlock}>
                <Text style={styles.label} >Dia da semana</Text>
                {/* <TextInput style={styles.input} value={week_day} onChangeText={text=> setWeekDay(text)} placeholder="Qual o dia?" placeholderTextColor="#c1bccc" /> */}
                <View style={styles.input}>

                  <Picker
                    selectedValue={week_day}
                    onValueChange={(itemValue, itemIndex) => setWeekDay(itemValue)}
                  >
                    <Picker.Item label="Domingo" value="0" />
                    <Picker.Item label="Segunda-Feira" value="1" />
                    <Picker.Item label="Terça-Feira" value="2" />
                    <Picker.Item label="Quarta-Feira" value="3" />
                    <Picker.Item label="Quinta-Feira" value="4" />
                    <Picker.Item label="Sexta-Feira" value="5" />
                    <Picker.Item label="Sabado" value="6" />
                  </Picker>
                </View>
              </View>
              <View style={styles.inputBlock}>
                <Text style={styles.label} >Horário</Text>
                <TextInput style={styles.input} value={time} onChangeText={text=> setTime(text)} placeholder="Qual o horário?" placeholderTextColor="#c1bccc" />
              </View>
            </View>
            <RectButton  onPress={handleFilterSubmit} style={styles.submitButton}>
              <Text style={styles.submitButtonText}>Filtrar</Text>
            </RectButton>
          </View>
        ) }
      </PageHeader>
      <ScrollView style={ styles.teacherList } contentContainerStyle={{
        paddingHorizontal: 16,
        paddingBottom: 16
      }}> 
        {teachers.map((teacher: Teacher) => (
            <TeacherItem key={teacher.id} teacher={teacher} favorited={favorites.includes(teacher.id)}/>
        ))}
      </ScrollView>
    </View>
  );
}

export default TeacherList;