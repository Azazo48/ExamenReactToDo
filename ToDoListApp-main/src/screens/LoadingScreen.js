import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const LoadingScreen = () => {
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const goFullScreen = () => {
    const element = document.documentElement;

    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen();
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleEnter = () => {
    goFullScreen();
    navigation.replace("TaskList");
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingScreen}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadingText}>Cargando...</Text>
        </View>
      ) : (
        <View style={styles.mainScreen}>
          <Button title="Comenzar" onPress={handleEnter} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  loadingScreen: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#333',
    marginTop: 10,
  },
  mainScreen: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoadingScreen;
