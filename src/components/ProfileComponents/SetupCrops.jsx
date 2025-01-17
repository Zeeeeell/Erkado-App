import {
  View,
  Text,
  SafeAreaView,
  Image,
  StatusBar,
  Platform,
  StyleSheet,
  TextInput,
  ScrollView,
  Button,
  TouchableOpacity,
  KeyboardAvoidingView,
  Keyboard,
} from "react-native";
import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import COLORS from "../../constant/colors";
import ProgressBar from "react-native-animated-progress";
import placeholder from "../../../assets/profile/Default Farmer.png";
import { Icon } from "@rneui/base";
import TextInputField from "../../components/General/TextInputField";
import SetPriceModal from "./SetPriceModal";
import Mapbox from "@rnmapbox/maps";
import AddCropBottomSheet from "./AddCropBottomSheet";
import BottomSheet from "@gorhom/bottom-sheet";
import { useSelector } from "react-redux";

function SetupCrops(props) {
  isFarmer = useSelector((state) => state.ui.isFarmer);
  return (
    <View>
      <SetPriceModal
        priceModal={props.priceModal}
        handlePriceModal={props.handlePriceModal}
        setPrice={props.setPrice}
        currentPrice={props.currentPrice}
      />
      <View className="flex-row justify-between items-center">
        <Text className="text-2xl font-bold" style={{ color: COLORS.primary }}>
          Setup Crops
        </Text>
        <TouchableOpacity
          className="rounded-lg  p-2 "
          style={{ backgroundColor: COLORS.primary }}
          onPress={props.handleOpenBottomSheet}
          disabled={props.isLoading}
        >
          <Text className="text-white text-lg self-center">Add Crops</Text>
        </TouchableOpacity>
      </View>
      <ScrollView className="mt-8 ">
        {props.crops && props.crops.length > 0 ? (
          props.crops.map((crop) => (
            <View
              key={crop.selectedCrop.CropID}
              className="flex-row justify-between items-center bg-zinc-50 mb-5 p-5 rounded-md"
            >
              <View className="flex-row space-x-3">
                <Image
                  source={{ uri: crop.selectedCrop.Uri }}
                  style={{ width: 40, height: 40 }}
                  resizeMode="contain"
                />
                <View>
                  <Text className="font-bold">
                    {crop.selectedCrop.CropName}
                  </Text>

                  <Text className="text-xs font-medium text-gray-400">
                    {crop.selectedCrop.Type}
                  </Text>
                  <Text className="text-xs font-medium text-gray-400">
                    {crop.selectedCrop.Quality}
                  </Text>
                </View>
              </View>

              {isFarmer ? (
                <View className="flex-row items-center space-x-3">
                  <TouchableOpacity
                    onPress={
                      crop.quantity > 1
                        ? () =>
                            props.decrementQuantity(crop.selectedCrop.CropID)
                        : null
                    }
                    disabled={props.isLoading}
                  >
                    <Icon
                      name="remove-circle"
                      type="ionicon"
                      color={COLORS.primary}
                      size={25}
                    />
                  </TouchableOpacity>

                  <View>
                    <Text className="text-slate-400 text-xs">Quantity</Text>
                    <TextInput
                      className=" border-b-2 border-gray-600 text-center"
                      onChangeText={(value) =>
                        props.handleQuantity(crop.selectedCrop.CropID, value)
                      }
                      value={crop?.quantity.toString()}
                      keyboardType="numeric"
                      onBlur={(event) => {
                        const value =
                          event._dispatchInstances.memoizedProps.value;
                        if (value === "" || parseFloat(value) === 0) {
                          props.handleQuantity(crop.selectedCrop.CropID, "1");
                        }
                      }}
                    />
                  </View>
                  <TouchableOpacity
                    onPress={() =>
                      props.incrementQuantity(crop.selectedCrop.CropID)
                    }
                    disabled={props.isLoading}
                  >
                    <Icon
                      name="add-circle"
                      type="ionicon"
                      color={COLORS.primary}
                      size={25}
                    />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    props.updatePrice(crop.selectedCrop, crop.price);
                    props.handlePriceModal;
                  }}
                  disabled={props.isLoading}
                >
                  <View className="flex items-center space-y-2  border-b-2 border-lime-500">
                    <Text className="text-slate-400 text-xs self-center">
                      Price
                    </Text>

                    <Text className="self-center font-bold">{crop?.price}</Text>
                  </View>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                onPress={() => props.removeCrop(crop.selectedCrop)}
                disabled={props.isLoading}
              >
                <Icon name="trash" type="ionicon" color="red" size={30} />
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text className="self-center font-semibold text-gray-400">
            {isFarmer
              ? "You don't have any crops yet."
              : "You don't have any crops to purchase yet."}
          </Text>
        )}
      </ScrollView>
    </View>
  );
}

export default SetupCrops;
