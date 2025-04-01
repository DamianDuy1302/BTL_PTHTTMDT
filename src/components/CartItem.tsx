import { useCart } from "@/stores/cartStore";
import { formatPrice } from "@/lib/utils";
import { ImageIcon, X } from "lucide-react";
import Image from "next/image";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { removeSpaces } from "@/utils/functions";

const CartItem = ({ product, index }: any) => {
  console.log(product);
  const variant = product.variants.find(
    (variant: any) =>
      removeSpaces(Object.values(variant.options).join(", ")) ===
      removeSpaces(Object.values(product.options).join(", "))
  );
  const image = variant?.image || product.images[0];
  const { removeItem, addItem, minusItem, clearCart } = useCart();

  return (
    <div className="space-y-3 py-2">
      {/* <button
        onClick={() => {
          clearCart();
        }}
      >
        hahaha
      </button> */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="relative aspect-square h-16 w-16 min-w-fit overflow-hidden rounded border">
            {image ? (
              <Image
                src={image}
                alt={product.name}
                fill
                className="absolute object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-secondary">
                <ImageIcon
                  aria-hidden="true"
                  className="h-4 w-4 text-muted-foreground"
                />
              </div>
            )}
          </div>

          <div className="flex flex-col self-start">
            <span className="line-clamp-1 text-sm font-medium mb-1">
              {product.name}
            </span>

            <div className="flex gap-2">
              <span className="line-clamp-1 text-xs capitalize text-muted-foreground">
                Phân loại: {product.category.name}
              </span>
              {product.options &&
                removeSpaces(Object.values(product.options).join(", ")) !==
                  "" && (
                  <span className="line-clamp-1 text-xs  text-muted-foreground">
                    Lựa chọn: {Object.values(product.options).join(", ")}
                  </span>
                )}
            </div>

            <div className="flex w-full items-center gap-1 mt-2">
              <Button
                disabled={product.quantity === 1}
                variant={"outline"}
                className="!p-2 h-6 w-6"
                onClick={() => {
                  minusItem(product);
                }}
              >
                -
              </Button>
              <Input
                value={product.quantity}
                type="text"
                readOnly
                className="w-[54px] h-6 text-center font-normal"
              />
              <Button
                variant={"outline"}
                className="!p-2 h-6 w-6"
                onClick={() => {
                  addItem(product, 1);
                }}
              >
                +
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-1 font-medium !justify-between h-[72px]">
          <div className="ml-auto line-clamp-1 text-sm">
            {formatPrice(product.price)}
          </div>
          <div className="">
            {/* <Button
              disabled={product.quantity === 1}
              variant={"outline"}
              className="!p-2 max-h-6 max-w-6"
              onClick={() => {
                minusItem(product.id);
              }}
            >
              -
            </Button>
            <Input
              value={product.quantity}
              type="text"
              readOnly
              className="w-[54px] h-6 text-center font-normal"
            />
            <Button
              variant={"outline"}
              className="!p-2 max-h-6 max-w-6"
              onClick={() => {
                addItem(product, 1);
              }}
            >
              +
            </Button> */}
            <div className="flex justify-end">
              <Button
                variant={"outline"}
                onClick={() => removeItem(product)}
                className="!p-2 h-6 w-6"
              >
                x
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
