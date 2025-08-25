import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';

const faqs = [
  "Introduction",
  "How To Access Payil?",
  "About Payil Dashboard",
  "About Payil Courses",
  "How To Access Payil Subject",
  "How to add a new course?"
];

export default function FAQScreen() {
  const [search, setSearch] = useState('');

  return (
    <View className="flex-1 bg-white px-4 pt-10">
      <Text className="text-xl font-semibold text-center mb-4">
        FAQ - Frequently Asked Questions
      </Text>

      {/* Search */}
      <View className="bg-gray-100 rounded-2xl px-4 py-2 mb-4 shadow-sm">
        <TextInput
          placeholder="Search"
          placeholderTextColor="#888"
          className="text-base text-gray-800"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <ScrollView className="space-y-4 mb-6">
        {faqs
          .filter(faq => faq.toLowerCase().includes(search.toLowerCase()))
          .map((faq, index) => (
            <View
              key={index}
              className="flex-row justify-between items-center bg-gray-100 px-4 py-4 rounded-2xl shadow"
            >
              <Text className="text-gray-800 text-base font-medium w-4/5">
                {faq}
              </Text>
              <Image
                source={require('../../../assets/plus-icon.png')}
                className="w-5 h-5"
                resizeMode="contain"
              />
            </View>
          ))}
      </ScrollView>

      <Text className="text-blue-600 text-center font-semibold mb-2">
        Need More Help?
      </Text>
      <Text className="text-center text-gray-600 mb-4">
        If You Have Any Further Questions, Feel Free To Reach Out To Our Support Team.
      </Text>

      <TouchableOpacity className="bg-gray-200 rounded-xl py-3 items-center shadow">
        <Text className="text-gray-800 font-semibold">Contact Support</Text>
      </TouchableOpacity>
    </View>
  );
}
