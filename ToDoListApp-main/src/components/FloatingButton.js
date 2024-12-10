import React from 'react';
import { TouchableOpacity, StyleSheet, Text ,Platform} from 'react-native';

const FloatingButton = ({ onPress }) => (
  <TouchableOpacity style={styles.floatingButton} onPress={onPress}>
    <Text style={styles.floatingButtonText}>+</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  floatingButton: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }), 
    position: 'absolute', 
    bottom: 20, 
    right: 20, 
    backgroundColor: '#3498db',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center', 
    zIndex: 10,
  },
  floatingButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
});


export default FloatingButton;
