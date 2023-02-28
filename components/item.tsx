import useUser from "@libs/client/useUser";
import { cls } from "@libs/client/utils";
import { Fav, Product, User } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import useSWR from "swr";

interface ItemProps {
  title: string;
  id: number;
  price: number;
  image: string;
  hearts: number;
}
interface FavWithUser extends Fav {
  user: User;
}

interface ItemDetailResponse {
  ok: boolean;
  favExists: Fav;
}

export default function Item({ title, price, hearts, id, image }: ItemProps) {
  const router = useRouter();
  const { user } = useUser();
  const { data, mutate } = useSWR<ItemDetailResponse>(
    `/api/products/${id}/fav?productId=${id}`
  );

  return (
    <Link href={`/products/${id}`}>
      <a className="flex px-4 pt-5 cursor-pointer justify-between">
        <div className="flex space-x-4">
          <div className="w-20 h-20 relative  rounded-md">
            <Image
              src={`https://imagedelivery.net/aSbksvJjax-AUC7qVnaC4A/${image}/public`}
              layout="fill"
              objectFit="cover"
            />
          </div>
          <div className="pt-2 flex flex-col">
            <h3 className="text-sm font-medium text-gray-900">{title}</h3>
            <span className="font-medium mt-1 text-gray-900">${price}</span>
          </div>
        </div>
        <div className="flex space-x-2 items-end justify-end">
          <div
            className={cls(
              "flex space-x-0.5 items-center text-sm",
              data?.favExists?.userId === user?.id
                ? "text-red-500 hover:text-red-600"
                : "text-gray-600"
            )}
          >
            {data?.favExists?.userId === user?.id ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                className="h-6 w-6 "
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            )}
            <span>{hearts}</span>
          </div>
        </div>
      </a>
    </Link>
  );
}
