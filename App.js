import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import React from "react"; // Add this import for React
import {
  ImageBackground,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { GiftedChat } from "react-native-gifted-chat";
import * as Speech from 'expo-speech'

export default function App() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [outputMessage, setOutputMessage] = useState("Results to be shown here");

  const generateText = () => {
    console.log(inputMessage);
    const message = {
      _id: Math.random().toString(36).substring(7),
      text: inputMessage,
      createdAt: new Date(),
      user: { _id: 1, name: "1" },
    };
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, [message])
    );

    fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization":
          "Bearer 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", // Replace with your OpenAI API key
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: inputMessage,
          },
        ],
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.choices[0].message.content);
        setInputMessage("")
        setOutputMessage(data.choices[0].message.content.trim());


        const message = {
          _id: Math.random().toString(36).substring(7),
          text: data.choices[0].message.content,
          createdAt: new Date(),
          user: { _id: 2, name: "Uma" },
        };
        setMessages((previousMessages) =>
          GiftedChat.append(previousMessages, [message])
        )

        options = {};
        Speech.speak(data.choices[0].message.content, options)
      })
      .catch((error) => {
        console.error("Error fetching text:", error);
      });
  };

  const generateImages = () => {
    console.log(inputMessage);
    const message = {
      _id: Math.random().toString(36).substring(7),
      text: inputMessage,
      createdAt: new Date(),
      user: { _id: 1, name: "1" },
    };
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, [message])
    );

    fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization":
          "Bearer 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",
      },
      body: JSON.stringify({
        prompt: inputMessage,
        n: 1,
        size: "1024x1024",
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.data[0].url);
        setInputMessage("");
        setOutputMessage(data.data[0].url);
        const message = {
          _id: Math.random().toString(36).substring(7),
          text: "Image Generated✅",
          createdAt: new Date(),
          user: { _id: 2, name: "Uma" },
          image: data.data[0].url,
        };
        setMessages((previousMessages) =>
          GiftedChat.append(previousMessages, [message])
        );
        Speech.VoiceQuality.Enhanced = "Enhanced"
        Speech.speak("Image Generated")
      })
      .catch((error) => {
        console.error("Error fetching image:", error);
      });
  };

  const handleButtonClick = () => {
    console.log(inputMessage);

    if (inputMessage.toLowerCase().startsWith("generate image")) {
      generateImages();
    } else {
      generateText();
    }
  };

  const handleTextInput = (text) => {
    setInputMessage(text);
  };

  return (
    <ImageBackground source={require('./assets/bg.png')} resizeMode="cover"
      style={{ flex: 1, width: "100%", height: "100%" }} >
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1, justifyContent: "center" }}>
          <GiftedChat
            messages={messages}
            renderInputToolbar={() => { }}
            user={{ _id: 1 }}
            minInputToolbarHeight={0}
          />
        </View>

        <View style={{ flexDirection: "row" }}>
          <View
            style={{
              flex: 1,
              marginLeft: 10,
              marginBottom: 10,
              borderRadius: 10,
              borderColor: "grey",
              borderWidth: 1,
              height: 60,
              marginLeft: 10,
              marginRight: 10,
              justifyContent: "center",
              paddingLeft: 10,
              paddingRight: 10,
            }}
          >
            <TextInput
              placeholder="ask a Question or type generate image... "
              onChangeText={handleTextInput}
              value={inputMessage}
            />
          </View>

          <TouchableOpacity onPress={handleButtonClick}>
            <View
              style={{
                backgroundColor: "green",
                padding: 5,
                marginRight: 10,
                marginBottom: 10,
                borderRadius: 9999,
                width: 60,
                height: 60,
                justifyContent: "center",
              }}
            >
              <MaterialIcons
                name="send"
                size={35}
                color="white"
                style={{ marginLeft: 10 }}
              />
            </View>
          </TouchableOpacity>
        </View>

        <StatusBar style="auto" />
      </View>
    </ImageBackground>

  );
}



