// src/screens/CameraScreen.js
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Camera } from 'expo-camera';
import { useIsFocused } from '@react-navigation/native';

export default function CameraScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const timerRef = useRef(null);
  const recordingTimerRef = useRef(null);
  const isFocused = useIsFocused();

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();

    return () => {
      clearInterval(timerRef.current);
      clearTimeout(recordingTimerRef.current);
    };
  }, []);

  const startRecording = async () => {
    if (cameraRef) {
      try {
        setIsRecording(true);
        setIsProcessing(false);
        setRecordingDuration(0);
        const video = await cameraRef.recordAsync({ maxDuration: 60 }); // maxDuration is in seconds (1 minute)
        console.log('Video recorded:', video.uri);
        // Handle the video, save it, or navigate to another screen to preview
      } catch (e) {
        console.error(e);
      } finally {
        stopRecording();
      }
    }
  };

  const stopRecording = async () => {
    if (cameraRef && isRecording) {
      setIsProcessing(true);
      await cameraRef.stopRecording();
      clearInterval(timerRef.current);
      clearTimeout(recordingTimerRef.current);
      setIsRecording(false);
      setIsProcessing(false);
    }
  };

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setRecordingDuration((prevDuration) => prevDuration + 1);
    }, 1000);

    // Stop recording after 60 seconds
    recordingTimerRef.current = setTimeout(() => {
      if (isRecording) {
        stopRecording();
      }
    }, 60000);
  };

  const takePicture = async () => {
    if (cameraRef) {
      try {
        const photo = await cameraRef.takePictureAsync();
        console.log('Photo taken:', photo.uri);
        // Handle the photo, save it, or navigate to another screen to preview
      } catch (e) {
        console.error(e);
      }
    }
  };

  if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      {isFocused && (
        <Camera
          style={styles.camera}
          type={Camera.Constants.Type.back}
          ref={(ref) => setCameraRef(ref)}
          onRecordingStart={startTimer}
        >
          <View style={styles.controls}>
            {isRecording ? (
              <TouchableOpacity style={styles.stopButton} onPress={stopRecording} disabled={isProcessing}>
                {isProcessing ? (
                  <ActivityIndicator size="large" color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>STOP</Text>
                )}
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.recordButton} onPress={startRecording}>
                <Text style={styles.buttonText}>RECORD</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.photoButton} onPress={takePicture} disabled={isRecording}>
              <Text style={styles.buttonText}>PHOTO</Text>
            </TouchableOpacity>
            {isRecording && <Text style={styles.timerText}>{recordingDuration}s</Text>}
          </View>
        </Camera>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  controls: {
    alignItems: 'center',
    marginBottom: 20,
  },
  recordButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  stopButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'darkred',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  photoButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  timerText: {
    marginTop: 10,
    color: '#fff',
    fontSize: 18,
  },
});
