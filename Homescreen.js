import { StatusBar } from 'expo-status-bar';
import { Text, View, Image, ImageBackground, TouchableOpacity, Modal, Button, TextInput, Alert } from 'react-native';
import React, { Component } from 'react';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import axios from 'axios';
import tw from 'twrnc'; 
import uuid from 'react-native-uuid';

export default class Homescreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      avatarSource: null,
      isImageSelected: false,
      fullScreenModalVisible: false,
      name: '',         
      contact: '',      
    };
  }

  handleSubmit = async () => {
    const { avatarSource, name, contact } = this.state;
    
    if (!avatarSource || !avatarSource.uri) {
      Alert.alert('No Data to upload', 'Please select an image.');
      return;
    }
    
    if (!name || !contact) {
      Alert.alert('Missing Information', 'Name and contact number are required.');
      return;
    }
    
    const reportId = uuid.v4();  // Generate a unique identifier
    
    try {
      const response = await axios.post('http://192.168.191.107:5000/report', {  // Use the correct endpoint
        reportId,   // Include the unique identifier
        name,
        contact,          
        imageUrl: avatarSource.uri,
      });
      
      if (response.status === 201) {
        Alert.alert('Success', 'Image and details uploaded successfully');
        this.closeModal(); 
      } else {
        Alert.alert('Failed', 'Server responded with status: ' + response.status);
      }
    } catch (error) {
      console.error('Error uploading details:', error);
      Alert.alert('Error', 'Error uploading details');
    }
  };
  

  handleGifPress = () => {
    this.setState({ modalVisible: true });
  };

  closeModal = () => {
    this.setState({ 
      modalVisible: false,
      avatarSource: null, 
      isImageSelected: false,
      name: '',         
      contact: '',      
    });
  };

  openFullScreenModal = () => {
    this.setState({ fullScreenModalVisible: true });
  };

  closeFullScreenModal = () => {
    this.setState({ fullScreenModalVisible: false });
  };

  handleBrowseFiles = () => {
    Alert.alert(
      "Select Image",
      "Choose an option",
      [
        {
          text: "Camera",
          onPress: this.handleCamera,
        },
        {
          text: "Photo Library",
          onPress: this.handleLibrary,
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ],
      { cancelable: true }
    );
  };

  handleCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert("Permission required", "Permission to access camera is required!");
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,  // Disable cropping
      quality: 1,
    });

    if (!result.canceled) {
      const uniqueName = `${Date.now()}.jpg`;
      const newUri = FileSystem.documentDirectory + uniqueName;
  
      await FileSystem.moveAsync({
        from: result.assets[0].uri,
        to: newUri,
      });
  
      const asset = await MediaLibrary.createAssetAsync(newUri);
  
      this.setState({ 
        avatarSource: { uri: asset.uri },
        isImageSelected: true,
      });
    }
  };

  handleLibrary = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,  
      quality: 1,
    });

    if (!result.canceled) {
      const source = { uri: result.assets[0].uri };
      this.setState({ avatarSource: source, isImageSelected: true });
    }
  };

  handleNameChange = (text) => {
    this.setState({ name: text });
  };

  handleContactChange = (text) => {
    this.setState({ contact: text });
  };

  render() {
    return (
      <ImageBackground
        source={require('./assets/image.png')}
        style={tw`flex-1 justify-center`}
      >
        <View style={tw `flex-1 items-center justify-center`}>
          <Text style={tw `text-32px text-black font-bold mt-18 ml-4 `}>Are you in emergency?</Text>
          <Text style={tw `text-sm text-gray-500 font-bold mb-2 text-center`}>Press the button below, help will reach</Text>
          <Text style={tw `text-sm text-gray-500 font-bold mb-1 text-center`}>Soon!</Text>

          <TouchableOpacity onPress={this.handleGifPress}>
            <Image
              source={require('./assets/alarm.gif')}
              style={tw `w-70 h-70 mt-5`}
            />
          </TouchableOpacity>

          <View style={tw `absolute bottom-3 left-3 flex-row`}>
            <TouchableOpacity
              style={tw `bg-[#d3b1b3]  w-26 h-10 rounded-r-2xl mr-3 flex-row justify-center items-center`}
              onPress={this.handleFirstButtonPress}
            >
              <Text style={tw `text-white text-12px `}>Developer : </Text>
              <Image
                source={require('./assets/dev.png')}  
                style={tw `w-6 h-6`}  
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={tw ` w-27 h-10 rounded-r-2xl flex-row justify-center items-center bg-[#800000]`}
              onPress={this.handleSecondButtonPress}
            >
              <Text style={tw `text-white text-xs font-bold mr-2`}>Power By:</Text>
              <Image
                source={require('./assets/swu.png')}  
                style={tw `w-6 h-6 `}  
              />
            </TouchableOpacity>
          </View>

          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.modalVisible}
            onRequestClose={this.closeModal}
          >
            <View style={tw `flex-1 justify-center items-center`}>
              <View style={tw `w-75 bg-white rounded-lg p-5 items-center shadow-md relative`}>
                <Image
                  source={require('./assets/alarm.gif')}
                  style={tw `w-37 h-37 mb-5`}
                />
                <View style={tw `w-full items-center`}>
                  <Text style={tw `text-xl font-bold mb-2 text-black`}>Emergency Alert</Text>
                  <TextInput
                    style={tw `w-full h-10 bg-gray-300 rounded-lg mb-2 px-2 text-black`}
                    placeholder="Name"
                    placeholderTextColor="#868686"
                    onChangeText={this.handleNameChange}  
                    value={this.state.name}  
                  />
                  <TextInput
                    style={tw `w-full h-10 bg-gray-300 rounded-lg mb-2 px-2 text-black`}
                    placeholder="Contact"
                    placeholderTextColor="#868686"
                    onChangeText={this.handleContactChange}  
                    value={this.state.contact}  
                  />
                  <View style={tw `w-full h-10 bg-gray-300 rounded-lg mb-2 justify-center items-center`}>
                    <Text style={tw `text-gray-500`}>Choose type</Text>
                  </View>

                  <View style={tw `w-full flex-row items-center justify-between mb-2`}>
                    {this.state.isImageSelected ? (
                      <TouchableOpacity onPress={this.openFullScreenModal}>
                        <Image
                          source={this.state.avatarSource}
                          style={tw `w-25 h-20`}
                        />
                      </TouchableOpacity>
                    ) : (
                      <Text style={tw `text-base text-black max-w-[60%]`}>No file selected</Text>
                    )}
                    <TouchableOpacity style={tw `w-27 h-10 bg-red-600 px-4 justify-center items-center rounded-lg`} onPress={this.handleBrowseFiles}>
                      <Text style={tw `text-white`}>Browse File</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={tw `w-full mt-2 justify-center items-center`}>
                    <Button title="SUBMIT" color="#800000" onPress={this.handleSubmit} />
                  </View>
                </View>
                <TouchableOpacity style={tw `absolute top-2 right-2 w-7 h-7 justify-center items-center`} onPress={this.closeModal}>
                  <Text style={tw `text-red-600 text-2xl font-bold`}>X</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <Modal
            animationType="fade"
            transparent={true}
            visible={this.state.fullScreenModalVisible}
            onRequestClose={this.closeFullScreenModal}
          >
            <View style={tw `flex-1 bg-black bg-opacity-80 justify-center items-center`}>
              {this.state.avatarSource && (
                <Image
                  source={this.state.avatarSource}
                  style={tw `w-full h-full`}
                  resizeMode="contain"
                />
              )}
              <TouchableOpacity style={tw `absolute top-5 right-5 w-10 h-10 justify-center items-center`} onPress={this.closeFullScreenModal}>
                <Text style={tw `text-white text-2xl font-bold`}>X</Text>
              </TouchableOpacity>
            </View>
          </Modal>
        </View>
      </ImageBackground>
    );
  }
}
