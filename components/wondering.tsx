import useUser from "@libs/client/useUser";
import { cls } from "@libs/client/utils";
import { Fav, Product, User, Wondering } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import useSWR from "swr";

interface ItemProps {
  count: any;
  id: number;
  [key: string]: any;
}

interface ItemDetailResponse {
  ok: boolean;
  WonderingExists: Wondering;
}

export default function Wonder({ id, count, onClick }: ItemProps) {
  const { data } = useSWR<ItemDetailResponse>(
    `/api/posts/${id}/wonder?id=${id}`
  );

  return (
    <span
      onClick={onClick}
      className={cls(
        "flex space-x-2 items-center text-sm",
        data?.WonderingExists ? "text-teal-600" : ""
      )}
    >
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        ></path>
      </svg>
      <span>궁금해요 {count}</span>
    </span>
  );
}
