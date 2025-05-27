import {
  defaultCurrency,
  defaultNumber,
  imagePlaceholder,
} from "@/components/utils/contextAPI/helperFunctions";
import { Button, Box, Text } from "@mantine/core";
import Image from "next/image";
import { useState } from "react";

export default function WishListCardCheckout({
  wishlist,
  handleWishListSelection,
  currency,
}: {
  wishlist: WishList;
  handleWishListSelection: (wishList: WishList) => void;
  currency: string;
}) {
  const [list] = useState({ ...wishlist, isSelected: false });

  return (
    <div className="w-full min-h-[280px] bg-white rounded-[10px] p-4 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col">
      <Box
        w="100%"
        mx="auto"
        className="overflow-hidden rounded-lg h-[130px] md:h-[150px]"
        pos="relative">
        <Image
          src={wishlist?.image || imagePlaceholder}
          alt="Gift image"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </Box>

      <Box className="flex-1 flex flex-col justify-between mt-2">
        <div>
          <Text
            fz={14}
            tt="capitalize"
            ff="poppins-regular"
            c="dark.8"
            fw={500}
            lh="1"
            className="line-clamp-2">
            {wishlist?.name}
          </Text>
          <Text
            fz={16}
            tt="capitalize"
            c="secondary_color.0"
            fw={600}
            className="font-poppins-medium mt-2">
            {currency || defaultCurrency}
            {Number(wishlist.price).toLocaleString() || defaultNumber}
          </Text>
        </div>

        {wishlist?.isSelected ? (
          <Button
            onClick={() => {
              handleWishListSelection(list);
            }}
            variant="white"
            fullWidth
            size="md"
            className="bg-gray-500 hover:bg-gray-500 rounded-lg text-white text-sm capitalize font-medium font-poppins-regular mt-2 transition-colors duration-200">
            Remove
          </Button>
        ) : (
          <Button
            onClick={() => {
              handleWishListSelection(wishlist);
            }}
            variant="white"
            fullWidth
            size="md"
            className="bg-secondary_color hover:bg-[#d66c0b] rounded-lg text-white text-sm capitalize font-medium font-poppins-regular mt-2 transition-colors duration-200">
            Select Item
          </Button>
        )}
      </Box>
    </div>
  );
}
